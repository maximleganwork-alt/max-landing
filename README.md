# BotMax — Лендинг студии разработки ботов для MAX

Одностраничный продающий лендинг для студии разработки ботов под мессенджер MAX. Реализован
строго по техническому заданию `TZ-Landing-MAX-Bots.md`.

## Архитектура

```
[Браузер] → POST /api/lead (Next.js API Route, proxy)
              → POST http://go-service:8080/api/lead (Go service)
                  → POST https://smartcaptcha.yandexcloud.net/validate (verify)
                  → POST https://api.telegram.org/bot{TOKEN}/sendMessage
              ← 200 OK { "ok": true }
            ← 200 OK { "ok": true }
[Toast: «Заявка принята»] + ym('reachGoal', 'form_submit_success')
```

- **frontend/** — Next.js 15 (App Router, SSG), TypeScript, Tailwind CSS, Framer Motion,
  React Hook Form + Zod, next-themes, lucide-react.
- **backend/** — Go 1.22 микросервис: приём заявки, проверка SmartCaptcha, отправка в
  Telegram. Зависимости минимальны: `joho/godotenv`, `golang.org/x/time/rate`.

## Установка зависимостей

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
go mod download
```

## Запуск в dev-режиме

В двух терминалах:

```bash
# Терминал 1 — Go backend (порт 8080)
cd backend
cp .env.example .env  # заполните реальными значениями
go run ./cmd/server
```

```bash
# Терминал 2 — Next.js frontend (порт 3000)
cd frontend
cp .env.example .env.local  # заполните реальными значениями
npm run dev
```

Сайт будет доступен на <http://localhost:3000>.

## Production-сборка

```bash
# Frontend
cd frontend
npm run build
npm run start  # запустит на :3000

# Backend
cd ../backend
go build -trimpath -ldflags="-s -w" -o bin/server ./cmd/server
./bin/server
```

Или через Docker для бэкенда:

```bash
cd backend
docker build -t botmax-lead-service .
docker run --rm -p 8080:8080 --env-file .env botmax-lead-service
```

## ENV-переменные

### Frontend (`frontend/.env.local`)

| Переменная | Назначение |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Полный URL сайта (для canonical, OG, sitemap) |
| `NEXT_PUBLIC_YANDEX_METRIKA_ID` | ID счётчика Яндекс.Метрики |
| `NEXT_PUBLIC_SMARTCAPTCHA_CLIENT_KEY` | Клиентский ключ SmartCaptcha |
| `BACKEND_URL` | URL Go-сервиса (виден только серверу Next.js) |

См. `frontend/.env.example`.

### Backend (`backend/.env`)

| Переменная | Назначение |
|---|---|
| `PORT` | Порт прослушивания (по умолчанию 8080) |
| `ALLOWED_ORIGIN` | Разрешённый Origin для CORS |
| `TELEGRAM_BOT_TOKEN` | Токен бота для уведомлений |
| `TELEGRAM_CHAT_ID` | ID чата/канала для отправки заявок |
| `SMARTCAPTCHA_SERVER_KEY` | Серверный ключ SmartCaptcha |
| `RATE_LIMIT_PER_MIN` | Лимит запросов с одного IP в минуту (по умолчанию 5) |

См. `backend/.env.example`.

## Деплой

Общие рекомендации:

- **Frontend** деплоится на любой провайдер с поддержкой Next.js: Vercel, Netlify, серверный
  Node.js, Docker. Команда сборки — `npm run build`, запуск — `npm run start`.
- **Backend** упакован в Dockerfile (multi-stage, distroless). Запускайте за
  reverse-proxy (nginx, Caddy, Traefik) с TLS-терминированием.
- **`BACKEND_URL`** во фронте должен указывать на внутренний адрес Go-сервиса (например,
  `http://go-service:8080` в docker-compose / kubernetes).
- **Robots / Sitemap / OG** — `next/metadata` генерирует автоматически. После деплоя
  проверьте, что `${SITE_URL}/sitemap.xml`, `/robots.txt`, `/og-image.png` отдаются.

## Структура проекта

```
project/
├── frontend/                      # Next.js
│   ├── app/
│   │   ├── (marketing)/
│   │   │   ├── page.tsx           # Лендинг
│   │   │   ├── privacy/page.tsx   # Политика конфиденциальности
│   │   │   └── consent/page.tsx   # Согласие на обработку ПДн
│   │   ├── api/lead/route.ts      # Прокси к Go
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── robots.ts
│   │   ├── sitemap.ts
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── sections/              # 9 секций лендинга
│   │   ├── ui/                    # Button, Input, Modal, Toast, Accordion, …
│   │   ├── visuals/               # Logo, PhoneMockup
│   │   ├── layout/                # Header, StickyCTA
│   │   ├── analytics/             # YandexMetrika, CookieBanner
│   │   └── seo/                   # JsonLd
│   ├── lib/                       # schema, analytics, utils
│   └── public/                    # icon.svg, og-image.png, favicon.ico, …
│
├── backend/                       # Go-сервис
│   ├── cmd/server/main.go         # bootstrap, graceful shutdown
│   ├── internal/
│   │   ├── handlers/lead.go       # POST /api/lead
│   │   ├── validation/lead.go     # валидация полей формы
│   │   ├── captcha/yandex.go      # SmartCaptcha verify
│   │   ├── ratelimit/limiter.go   # token bucket по IP
│   │   └── telegram/client.go     # отправка в Telegram
│   ├── Dockerfile
│   └── go.mod
│
└── README.md
```

## Что заменить после сдачи

| Плейсхолдер | На что заменить |
|---|---|
| `BotMax` | Реальное название студии |
| `https://example.ru` | Реальный домен |
| `hello@example.ru` | Реальный email |
| `@botmax_studio` | Реальный ник в MAX |
| `@botmax_studio_tg` | Реальный ник в Telegram |
| ИП/реквизиты | Реальные юр. данные (privacy, consent, footer) |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | Реальные значения в `backend/.env` |
| `SMARTCAPTCHA_*` | Ключи из Яндекс.Облака |
| `NEXT_PUBLIC_YANDEX_METRIKA_ID` | ID счётчика Метрики |
| `Logo.tsx` SVG | Финальный SVG-логотип |
| `og-image.png` | Финальное изображение для OG (1200×630) |

## Соответствие ТЗ

- 9 секций (Hero, Почему MAX, Что мы делаем, Процесс, Тарифы, Почему мы, FAQ, Форма, Footer)
- Light/Dark темы через `next-themes`, анти-FOUC скрипт в `<head>`
- Yandex SmartCaptcha (invisible) + honeypot + rate-limit на бэке
- 14 целей Метрики, инициализация только после согласия на cookies
- JSON-LD: Organization, Service ×3, FAQPage, BreadcrumbList на юр. страницах
- Адаптивность mobile-first, sticky CTA на mobile
- Доступность: skip-link, focus-visible, ARIA, `prefers-reduced-motion`
- SSG для всех статических роутов, динамичен только `/api/lead`
