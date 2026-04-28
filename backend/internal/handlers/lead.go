package handlers

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net"
	"net/http"
	"strings"
	"time"

	"github.com/botmax/lead-service/internal/captcha"
	"github.com/botmax/lead-service/internal/ratelimit"
	"github.com/botmax/lead-service/internal/telegram"
	"github.com/botmax/lead-service/internal/validation"
)

type LeadHandler struct {
	Limiter  *ratelimit.Limiter
	Captcha  *captcha.Verifier
	Telegram *telegram.Client
}

func (h *LeadHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeError(w, http.StatusMethodNotAllowed, "method_not_allowed")
		return
	}

	ip := clientIP(r)
	if !h.Limiter.Allow(ip) {
		writeError(w, http.StatusTooManyRequests, "rate_limit")
		return
	}

	defer r.Body.Close()
	r.Body = http.MaxBytesReader(w, r.Body, 32*1024)

	var lead validation.Lead
	dec := json.NewDecoder(r.Body)
	dec.DisallowUnknownFields()
	if err := dec.Decode(&lead); err != nil {
		writeError(w, http.StatusBadRequest, "invalid_json")
		return
	}
	lead.Normalize()

	if lead.IsHoneypotTriggered() {
		log.Printf("[lead] honeypot triggered ip=%s", ip)
		writeOK(w)
		return
	}

	if err := lead.Validate(); err != nil {
		writeError(w, http.StatusBadRequest, "validation")
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 8*time.Second)
	defer cancel()

	if err := h.Captcha.Verify(ctx, lead.CaptchaToken, ip); err != nil {
		log.Printf("[lead] captcha failed ip=%s err=%v", ip, err)
		writeError(w, http.StatusBadRequest, "captcha")
		return
	}

	userAgent := r.Header.Get("X-User-Agent")
	if userAgent == "" {
		userAgent = r.Header.Get("User-Agent")
	}

	text := formatTelegramMessage(lead, ip, userAgent)
	if err := h.Telegram.Send(ctx, text); err != nil {
		log.Printf("[lead] telegram send failed ip=%s err=%v\nMessage:\n%s", ip, err, text)
		if !errors.Is(err, telegram.ErrNotConfigured) {
			writeError(w, http.StatusInternalServerError, "internal")
			return
		}
	}

	writeOK(w)
}

func writeOK(w http.ResponseWriter) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(map[string]any{"ok": true})
}

func writeError(w http.ResponseWriter, status int, code string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(map[string]any{"ok": false, "error": code})
}

func clientIP(r *http.Request) string {
	if xff := r.Header.Get("X-Forwarded-For"); xff != "" {
		parts := strings.Split(xff, ",")
		if len(parts) > 0 {
			return strings.TrimSpace(parts[0])
		}
	}
	if rip := r.Header.Get("X-Real-IP"); rip != "" {
		return strings.TrimSpace(rip)
	}
	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return r.RemoteAddr
	}
	return host
}

func escapeMarkdown(s string) string {
	replacer := strings.NewReplacer(
		"_", "\\_",
		"*", "\\*",
		"`", "\\`",
		"[", "\\[",
	)
	return replacer.Replace(s)
}

func formatTelegramMessage(lead validation.Lead, ip, userAgent string) string {
	var b strings.Builder
	b.WriteString("*🆕 Новая заявка с лендинга*\n\n")
	fmt.Fprintf(&b, "*Имя:* %s\n", escapeMarkdown(lead.Name))
	fmt.Fprintf(&b, "*Контакт:* %s\n", escapeMarkdown(lead.Contact))

	if label := validation.TariffLabel(lead.Tariff); label != "" {
		fmt.Fprintf(&b, "*Тариф:* %s\n", label)
	}

	if lead.Message != "" {
		b.WriteString("\n*Задача:*\n")
		b.WriteString(escapeMarkdown(lead.Message))
		b.WriteString("\n")
	}

	utmParts := []string{}
	if lead.UTMSource != "" {
		utmParts = append(utmParts, "source="+lead.UTMSource)
	}
	if lead.UTMMedium != "" {
		utmParts = append(utmParts, "medium="+lead.UTMMedium)
	}
	if lead.UTMCampaign != "" {
		utmParts = append(utmParts, "campaign="+lead.UTMCampaign)
	}
	if lead.UTMContent != "" {
		utmParts = append(utmParts, "content="+lead.UTMContent)
	}
	if lead.UTMTerm != "" {
		utmParts = append(utmParts, "term="+lead.UTMTerm)
	}
	if len(utmParts) > 0 {
		fmt.Fprintf(&b, "\n*UTM:* %s\n", escapeMarkdown(strings.Join(utmParts, " · ")))
	}

	fmt.Fprintf(&b, "\n_IP: %s · UA: %s_", escapeMarkdown(ip), escapeMarkdown(truncate(userAgent, 80)))
	return b.String()
}

func truncate(s string, n int) string {
	if len(s) <= n {
		return s
	}
	return s[:n] + "…"
}
