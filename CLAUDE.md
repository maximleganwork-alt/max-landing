# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing landing pages for a studio building bots and web services. The original spec for the MAX-bots site is in `TZ-Landing-MAX-Bots.md` (Russian) — reference it when in doubt about copy, palette, sections, or behavior. The multi-site migration plan is in `PLAN-MULTI-SITE.md`.

The repo is a **multi-frontend + single backend** monorepo using npm workspaces. Currently:
- `frontend-max/` — landing for MAX-messenger bot development (the original site).
- `backend/` — Go lead-service, shared by all frontends.

Planned (per `PLAN-MULTI-SITE.md`): `frontend-tg/` (Telegram bots), `frontend-web/` (web/CRM/ERP). All three frontends share the same Go backend; lead source is distinguished by a `source` field in the payload.

## Common commands

Frontend (`cd frontend-max`):
- `npm run dev` — Next dev on `:3000`
- `npm run build` / `npm run start` — production build / serve
- `npx tsc --noEmit` — typecheck (alias: `npm run type-check`)
- `npm run lint` — `next lint`

From the repo root, `npm install` installs deps for all workspaces (one root `node_modules/` is hoisted).

Backend (`cd backend`):
- `go run ./cmd/server` — dev on `:8080`
- `go build -trimpath -ldflags="-s -w" -o bin/server ./cmd/server`
- `go vet ./...`
- `docker build -t botmax-lead-service .` (multi-stage → distroless)

To run the full app locally both services must be up. Frontend reads `BACKEND_URL` server-side and proxies `/api/lead` there. Without the Go service the form returns 500.

## Request flow for the lead form

```
Browser →  POST /api/lead       (Next.js route, lib/schema.ts revalidation, honeypot short-circuit,
                                 server route stamps `source: "max" | "tg" | "web"` per-site)
        →  POST {BACKEND_URL}/api/lead
                                (Go handler: rate-limit by IP → revalidate → SmartCaptcha verify →
                                 Telegram sendMessage with `message_thread_id` chosen by source)
        ←  200 { "ok": true } | 400 validation | 429 rate_limit | 500 internal
```

Both ends share the same Zod-equivalent rules (frontend Zod schema in `frontend-max/lib/schema.ts`, Go validation in `backend/internal/validation/lead.go`). When you change one, change the other in the same edit. Phone/nickname regex is intentionally permissive on the frontend (`PHONE_REGEX` + `NICK_REGEX`) and replicated server-side.

`source` is **never** trusted from the client — `frontend-X/app/api/lead/route.ts` injects it server-side after `safeParse`, before proxying upstream. The Zod schema does **not** include `source`.

The Telegram send is best-effort: if `TELEGRAM_BOT_TOKEN` is empty the handler logs to stdout and still returns 200, so dev works without secrets. SmartCaptcha verify is also skipped when `SMARTCAPTCHA_SERVER_KEY` is empty (frontend uses literal `"dev-no-captcha"` token in that case — see `SmartCaptcha.tsx`). `TELEGRAM_THREAD_ID_*` env vars map source → forum thread; if a thread id is empty, the message lands in the supergroup's General topic.

## Frontend architecture (frontend-max)

- App Router, all routes are SSG except `/api/lead` (`force-dynamic`). `app/(marketing)/` holds `page.tsx`, `MarketingHome.tsx`, `privacy/page.tsx`, `consent/page.tsx`.
- `page.tsx` is a server component that renders `<JsonLd />` (server) + `<MarketingHome />` (client wrapper). The client wrapper exists because content files import `lucide-react` icon components, which can't cross the RSC server→client boundary. **Don't import section content directly from a server component**; route it through a `"use client"` wrapper.
- **Sections are dumb / props-driven.** All section components in `components/sections/` accept their data via props. The data lives in typed config files under `lib/content/` (`hero.ts`, `services.ts`, `process.ts`, `tariffs.ts`, `whyMax.ts`, `whyUs.ts`, `faq.ts`, `leadForm.ts`, `footer.ts`, `header.ts`). When you add or rename a section field, update the type in the content file — it's the source of truth for the section's contract.
- Section background pattern alternates `bg → bg-subtle → bg → bg-subtle…`. When reordering sections, also flip the section's `className` (`section-padding` vs `section-padding bg-bg-subtle`) to keep the rhythm. Diagonal section backgrounds (`section-diagonal-bg`, `section-leadform-bg`) are flat on mobile (<768px) and slanted on desktop.
- Design tokens live as CSS custom properties in `app/globals.css` (`--bg`, `--fg`, `--primary`, `--accent-soft`, `--gradient-brand`, etc.) and are exposed to Tailwind via `tailwind.config.ts theme.extend.colors`. Light theme only — dark theme + `next-themes` were intentionally removed; do not add `data-theme="dark"` selectors back.
- `components/ui/Button.tsx` — single Button component used everywhere. The text node is wrapped in `<span className="leading-none">` to fix Inter's optical-vertical-centering quirk; keep that wrapper if you refactor it. `text-white` is forced with `!text-white` because Tailwind's nested `primary.fg` color path was unreliable.
- Animations live in `components/ui/AnimateIn.tsx` (`AnimateIn`, `Stagger`, `StaggerItem`) — they all respect `useReducedMotion`. The Hero counter (`CountUp`) animates only when in view and once.
- `lib/content/faq.ts` is the canonical FAQ data source. Both `components/sections/FAQ.tsx` (client component) and `components/seo/JsonLd.tsx` (server component) import from it. **Do not put data in client components and import it from server components** — that broke the build once because `"use client"` files become opaque RSC modules at build-time.
- `components/Providers.tsx` only mounts `ToastProvider`. `useToast()` will throw outside it.

### Analytics & consent

- `components/analytics/CookieBanner.tsx` writes `localStorage.cookie_consent = "accepted"` and dispatches a `cookie:accepted` window event.
- `components/analytics/YandexMetrika.tsx` listens for that event and only injects the YM script after consent. Goals are typed in `lib/analytics.ts` — call `reachGoal(name, params?)`. New goals must be added to the `GoalName` union there (build is `--strict`).
- UTM params are read by the form (`getUTMParams()` in `lib/utils.ts`) and forwarded as hidden fields → into the Telegram message.

### Header behavior

The header uses smart-scroll: hides on scroll-down, reappears on scroll-up. Uses a 6px hysteresis on `lastY`. The mobile drawer respects `--header-height` for offset; if you change header height in `Header.tsx`, also update `--header-height` in `globals.css` (mobile + sm breakpoints).

## Backend architecture

- Single binary `cmd/server/main.go`: graceful shutdown via SIGINT/SIGTERM, `withRecover` middleware, CORS over the `ALLOWED_ORIGINS` whitelist (CSV of full origin URLs, one per landing).
- `internal/ratelimit` is an in-memory token-bucket per IP via `golang.org/x/time/rate` with a janitor goroutine pruning idle entries every minute. **Resets on restart and is not shared across instances** — if you scale horizontally, swap to Redis.
- `internal/captcha/yandex.go` POSTs `application/x-www-form-urlencoded` to `https://smartcaptcha.yandexcloud.net/validate`. Empty secret = pass-through (dev-friendly).
- `internal/handlers/lead.go` builds a Markdown message; `escapeMarkdown` escapes `_*\`[`. The header uses a coloured marker (`🟣 MAX`, `🔵 TG`, `🟢 WEB`) chosen by `lead.Source`. Telegram thread id is picked from `LeadHandler.ThreadIDs[source]`; empty/zero means General topic.
- IP extraction prefers `X-Forwarded-For` then `X-Real-IP` then `RemoteAddr` — the Next.js proxy always sets the first two.

## Conventions

- All copy is in Russian.
- Imports inside a frontend use the `@/` alias (configured in `frontend-max/tsconfig.json`).
- `cn()` from `lib/utils.ts` (`clsx` + `tailwind-merge`) is the only way to compose class lists; don't string-concat Tailwind classes.
- When adding a new "card grid" section, follow the pattern in `Services.tsx` / `WhyMax.tsx` / `WhyUs.tsx`: `Stagger` → `StaggerItem` → `<div class="card card-hover h-full p-6">`. The `.card` utility lives in `globals.css @layer components`.
- Section IDs (`#services`, `#process`, `#tariffs`, `#faq`, `#lead-form`, `#why-us`, `#why-max`) are referenced from Header nav, Footer columns, CTAs, `JsonLd`, and `sitemap.ts`. Don't rename without grepping.

## Placeholder data

The repo ships with placeholders the customer will replace before launch (see README "Что заменить после сдачи"). Don't treat any of these as real values: `BotMax`, `example.ru`, `hello@example.ru`, `@botmax_studio`, `@botmax_studio_tg`, ИП/ИНН/ОГРНИП in Footer + privacy + consent.
