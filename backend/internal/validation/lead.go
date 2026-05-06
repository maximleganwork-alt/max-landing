package validation

import (
	"errors"
	"regexp"
	"strings"
	"unicode/utf8"
)

var (
	phoneRe = regexp.MustCompile(`^[\+\d\s\-\(\)]{10,20}$`)
	nickRe  = regexp.MustCompile(`^@[\w\d_]{4,32}$`)
)

type Lead struct {
	Name         string `json:"name"`
	Contact      string `json:"contact"`
	Message      string `json:"message,omitempty"`
	Tariff       string `json:"tariff,omitempty"`
	TariffLabel  string `json:"tariff_label,omitempty"`
	Source       string `json:"source"`
	CaptchaToken string `json:"captchaToken"`
	Website      string `json:"website,omitempty"`
	UTMSource    string `json:"utm_source,omitempty"`
	UTMMedium    string `json:"utm_medium,omitempty"`
	UTMCampaign  string `json:"utm_campaign,omitempty"`
	UTMContent   string `json:"utm_content,omitempty"`
	UTMTerm      string `json:"utm_term,omitempty"`
}

var (
	ErrNameInvalid    = errors.New("name_invalid")
	ErrContactInvalid = errors.New("contact_invalid")
	ErrMessageTooLong = errors.New("message_too_long")
	ErrTariffInvalid      = errors.New("tariff_invalid")
	ErrTariffLabelTooLong = errors.New("tariff_label_too_long")
	ErrSourceInvalid      = errors.New("source_invalid")
	ErrCaptchaMissing     = errors.New("captcha_missing")
)

var allowedTariffs = map[string]struct{}{
	"":           {},
	"starter":    {},
	"business":   {},
	"enterprise": {},
}

var allowedSources = map[string]struct{}{
	"max": {},
	"tg":  {},
	"web": {},
}

func (l *Lead) Normalize() {
	l.Name = strings.TrimSpace(l.Name)
	l.Contact = strings.TrimSpace(l.Contact)
	l.Message = strings.TrimSpace(l.Message)
	l.Tariff = strings.TrimSpace(l.Tariff)
	l.TariffLabel = strings.TrimSpace(l.TariffLabel)
	l.Source = strings.ToLower(strings.TrimSpace(l.Source))
}

func (l *Lead) Validate() error {
	nameLen := utf8.RuneCountInString(l.Name)
	if nameLen < 2 || nameLen > 100 {
		return ErrNameInvalid
	}
	if !phoneRe.MatchString(l.Contact) && !nickRe.MatchString(l.Contact) {
		return ErrContactInvalid
	}
	if utf8.RuneCountInString(l.Message) > 1000 {
		return ErrMessageTooLong
	}
	if _, ok := allowedTariffs[l.Tariff]; !ok {
		return ErrTariffInvalid
	}
	if utf8.RuneCountInString(l.TariffLabel) > 50 {
		return ErrTariffLabelTooLong
	}
	if _, ok := allowedSources[l.Source]; !ok {
		return ErrSourceInvalid
	}
	if strings.TrimSpace(l.CaptchaToken) == "" {
		return ErrCaptchaMissing
	}
	return nil
}

func (l *Lead) IsHoneypotTriggered() bool {
	return strings.TrimSpace(l.Website) != ""
}

func TariffLabel(id string) string {
	switch id {
	case "starter":
		return "Старт"
	case "business":
		return "Бизнес"
	case "enterprise":
		return "Корпоративный"
	default:
		return ""
	}
}
