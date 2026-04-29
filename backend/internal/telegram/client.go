package telegram

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"time"
)

type Client struct {
	token  string
	chatID string
	http   *http.Client
}

func New(token, chatID string) *Client {
	return &Client{
		token:  token,
		chatID: chatID,
		http:   &http.Client{Timeout: 10 * time.Second},
	}
}

func (c *Client) Configured() bool {
	return c.token != "" && c.chatID != ""
}

type sendMessagePayload struct {
	ChatID          string `json:"chat_id"`
	Text            string `json:"text"`
	ParseMode       string `json:"parse_mode"`
	MessageThreadID int    `json:"message_thread_id,omitempty"`
}

type apiResponse struct {
	OK          bool   `json:"ok"`
	Description string `json:"description,omitempty"`
}

var ErrNotConfigured = errors.New("telegram_not_configured")

func (c *Client) Send(ctx context.Context, text string, threadID int) error {
	if !c.Configured() {
		return ErrNotConfigured
	}

	payload := sendMessagePayload{
		ChatID:          c.chatID,
		Text:            text,
		ParseMode:       "Markdown",
		MessageThreadID: threadID,
	}
	body, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("telegram marshal: %w", err)
	}

	url := fmt.Sprintf("https://api.telegram.org/bot%s/sendMessage", c.token)
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, url, bytes.NewReader(body))
	if err != nil {
		return fmt.Errorf("telegram request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := c.http.Do(req)
	if err != nil {
		return fmt.Errorf("telegram network: %w", err)
	}
	defer resp.Body.Close()

	var out apiResponse
	if err := json.NewDecoder(resp.Body).Decode(&out); err != nil {
		return fmt.Errorf("telegram decode: %w", err)
	}
	if !out.OK {
		return fmt.Errorf("telegram api: %s", out.Description)
	}
	return nil
}
