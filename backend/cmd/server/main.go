package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"strings"
	"syscall"
	"time"

	"github.com/joho/godotenv"

	"github.com/botmax/lead-service/internal/captcha"
	"github.com/botmax/lead-service/internal/handlers"
	"github.com/botmax/lead-service/internal/ratelimit"
	"github.com/botmax/lead-service/internal/telegram"
)

func main() {
	// Special mode: `/app/server -healthcheck` делает HTTP GET к собственному
	// /api/health и выходит с кодом 0/1. Используется HEALTHCHECK'ом в
	// distroless-образе, где нет wget/curl/sh.
	if len(os.Args) > 1 && os.Args[1] == "-healthcheck" {
		runHealthcheck()
		return
	}

	// Best-effort: подгружаем .env при наличии (полезно в dev). В Docker
	// переменные приходят через env_file/environment, .env обычно нет.
	_ = godotenv.Load()

	port := getEnv("PORT", "8080")
	allowedOrigins := splitCSV(os.Getenv("ALLOWED_ORIGINS"))
	rateLimitPerMin, err := strconv.Atoi(getEnv("RATE_LIMIT_PER_MIN", "5"))
	if err != nil || rateLimitPerMin < 1 {
		rateLimitPerMin = 5
	}
	captchaKey := os.Getenv("SMARTCAPTCHA_SERVER_KEY")
	tgToken := os.Getenv("TELEGRAM_BOT_TOKEN")
	tgChatID := os.Getenv("TELEGRAM_CHAT_ID")
	appEnv := strings.ToLower(os.Getenv("APP_ENV"))

	// Прод-страховка: эндпоинт /api/lead открыт через nginx (api.<domain>),
	// и без SmartCaptcha он защищён только rate-limit'ом 5/мин на IP.
	// В production отказываемся стартовать, чтобы не выкатить «открытый» API.
	if appEnv == "production" && captchaKey == "" {
		log.Fatal("[fatal] SMARTCAPTCHA_SERVER_KEY is required when APP_ENV=production")
	}
	if captchaKey == "" {
		log.Println("[warn] SMARTCAPTCHA_SERVER_KEY is empty — captcha verification is DISABLED (dev mode)")
	}
	if tgToken == "" || tgChatID == "" {
		log.Println("[warn] TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID empty — leads will be logged only")
	}

	leadHandler := &handlers.LeadHandler{
		Limiter:  ratelimit.New(rateLimitPerMin),
		Captcha:  captcha.New(captchaKey),
		Telegram: telegram.New(tgToken, tgChatID),
	}

	mux := http.NewServeMux()
	mux.Handle("/api/lead", leadHandler)
	mux.HandleFunc("/api/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(`{"ok":true}`))
	})

	handler := withRecover(withCORS(allowedOrigins, mux))

	srv := &http.Server{
		Addr:              ":" + port,
		Handler:           handler,
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       15 * time.Second,
		WriteTimeout:      15 * time.Second,
		IdleTimeout:       60 * time.Second,
	}

	serverErr := make(chan error, 1)
	go func() {
		log.Printf("[lead-service] listening on :%s (rate=%d/min, origins=%d, captcha=%t, telegram=%t)",
			port, rateLimitPerMin, len(allowedOrigins), captchaKey != "", tgToken != "" && tgChatID != "")
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			serverErr <- err
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)

	select {
	case sig := <-stop:
		log.Printf("[lead-service] received signal %s, shutting down…", sig)
	case err := <-serverErr:
		log.Fatalf("[lead-service] listen error: %v", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Printf("[lead-service] shutdown error: %v", err)
	}
	log.Println("[lead-service] stopped")
}

// runHealthcheck вызывается через `/app/server -healthcheck`. Делает быстрый
// GET на собственный /api/health и завершается с exit 0/1 — формат, который
// docker HEALTHCHECK ожидает.
func runHealthcheck() {
	port := getEnv("PORT", "8080")
	client := &http.Client{Timeout: 3 * time.Second}
	resp, err := client.Get("http://127.0.0.1:" + port + "/api/health")
	if err != nil {
		fmt.Fprintln(os.Stderr, "healthcheck:", err)
		os.Exit(1)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		fmt.Fprintln(os.Stderr, "healthcheck: status", resp.StatusCode)
		os.Exit(1)
	}
	os.Exit(0)
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func splitCSV(s string) []string {
	if s == "" {
		return nil
	}
	parts := strings.Split(s, ",")
	out := make([]string, 0, len(parts))
	for _, p := range parts {
		if p = strings.TrimSpace(p); p != "" {
			out = append(out, p)
		}
	}
	return out
}

// withRecover ловит панику в любом нижестоящем хэндлере, пишет лог и
// отдаёт 500 — без этого один баг в обработке формы прибивает весь процесс.
func withRecover(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if rec := recover(); rec != nil {
				log.Printf("[panic] %v %s %s", rec, r.Method, r.URL.Path)
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusInternalServerError)
				_, _ = fmt.Fprint(w, `{"ok":false,"error":"internal"}`)
			}
		}()
		h.ServeHTTP(w, r)
	})
}

// withCORS отдаёт CORS-заголовки только для origin'ов из ALLOWED_ORIGINS.
// Фронтенды бьются в backend через docker-network (server-side fetch), и CORS
// им не нужен — это защита для прямого доступа браузера к api.<domain>.
func withCORS(allowed []string, h http.Handler) http.Handler {
	allowSet := make(map[string]struct{}, len(allowed))
	for _, o := range allowed {
		allowSet[o] = struct{}{}
	}
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		if origin != "" {
			if _, ok := allowSet[origin]; ok {
				w.Header().Set("Access-Control-Allow-Origin", origin)
				w.Header().Set("Vary", "Origin")
				w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
				w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
				w.Header().Set("Access-Control-Max-Age", "600")
			}
		}
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		h.ServeHTTP(w, r)
	})
}
