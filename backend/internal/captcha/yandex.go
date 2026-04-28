package captcha

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"strings"
	"time"
)

const validateURL = "https://smartcaptcha.yandexcloud.net/validate"

type Verifier struct {
	secret string
	client *http.Client
}

func New(secret string) *Verifier {
	return &Verifier{
		secret: secret,
		client: &http.Client{Timeout: 5 * time.Second},
	}
}

type validateResponse struct {
	Status  string `json:"status"`
	Message string `json:"message,omitempty"`
}

var ErrInvalid = errors.New("captcha_invalid")

func (v *Verifier) Verify(ctx context.Context, token, ip string) error {
	if v.secret == "" {
		return nil
	}
	if strings.TrimSpace(token) == "" {
		return ErrInvalid
	}

	form := url.Values{}
	form.Set("secret", v.secret)
	form.Set("token", token)
	if ip != "" {
		form.Set("ip", ip)
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, validateURL, strings.NewReader(form.Encode()))
	if err != nil {
		return fmt.Errorf("captcha request: %w", err)
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	resp, err := v.client.Do(req)
	if err != nil {
		return fmt.Errorf("captcha network: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("captcha status %d", resp.StatusCode)
	}

	var out validateResponse
	if err := json.NewDecoder(resp.Body).Decode(&out); err != nil {
		return fmt.Errorf("captcha decode: %w", err)
	}
	if out.Status != "ok" {
		return ErrInvalid
	}
	return nil
}
