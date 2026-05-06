# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing landing pages for a studio building bots and web services. The original spec for the MAX-bots site is in `TZ-Landing-MAX-Bots.md` (Russian) — reference it when in doubt about copy, palette, sections, or behavior. The original multi-site migration plan is in `PLAN-MULTI-SITE.md` (now executed). Production deployment is documented in `DEPLOY.md`. Pre-launch legal todos are in `NEED.MD`.

The repo is a **multi-frontend + single backend** monorepo using npm workspaces (one root `node_modules/` is hoisted; root `package.json` declares `"workspaces": ["frontend-*", "shared"]`):

- `frontend-max/` — landing for **MAX-messenger** bot dev (`source: "max"`, theme `#5B8DFF` / purple).
- `frontend-tg/`  — landing for **Telegram** bot dev (`source: "tg"`, theme `#229ED9` / blue).
- `frontend-web/` — landing for **web/CRM/ERP** dev (`source: "web"`).
- `shared/`       — workspace npm package consumed as `import … from "shared/…"`. Holds **all** UI components, SEO/OG helpers, the lead Zod schema, the legal entity record, and the marketing page assembly. **Most code lives here** — each frontend is a thin shell of `lib/site.ts` + `lib/content/*.ts` + Next file-convention routes.
- `backend/`      — Go lead-service shared by all three frontends. Lead source is distinguished by a `source` field in the upstream payload.

## Common commands

From the repo root: `npm install` once installs deps for all workspaces.

Frontend (run from `frontend-max/`, `frontend-tg/`, or `frontend-web/`):
- `npm run dev` — Next dev on `:3000`
- `npm run build` / `npm run start` — production build / serve
- `npm run type-check` — `tsc --noEmit`
- `npm run lint` — `next lint`

Backend (`cd backend`):
- `go run ./cmd/server` — dev on `:8080`
- `go build -trimpath -ldflags="-s -w" -o bin/server ./cmd/server`
- `go vet ./...`
- `docker build -t botmax-lead-service .` (multi-stage → distroless)

Full local stack (from repo root, requires populated `.env`):
- `docker compose up -d --build` — bring up all 4 containers; frontends bind to `127.0.0.1:3001/3002/3003`, backend stays on the internal `botmax` network.
- `docker compose logs -f --tail=100 <service>` — tail one service.
- `./deploy/deploy.sh` — production deploy on the server (`git pull` + rebuild + restart).

To run *just one frontend* against a real Go backend during dev, both must be up. The frontend reads `BACKEND_URL` server-side and proxies `/api/lead` there. Without the Go service the form returns 500.

## Request flow for the lead form

```
Browser →  POST /api/lead       (Next.js route per-frontend, shared/lib/schema.ts revalidation,
                                 honeypot short-circuit, server route stamps `source: "max" | "tg" | "web"`
                                 hardcoded literally in each route.ts — never trusted from client)
        →  POST {BACKEND_URL}/api/lead
                                (Go handler: rate-limit by IP → revalidate → SmartCaptcha verify →
                                 Telegram sendMessage; all sources share one chat, distinguished
                                 by the 🟣/🔵/🟢 marker in the message header)
        ←  200 { "ok": true } | 400 validation | 429 rate_limit | 500 internal
```

Both ends share the same Zod-equivalent rules (frontend Zod schema in `shared/lib/schema.ts`, Go validation in `backend/internal/validation/lead.go`). When you change one, change the other in the same edit. Phone/nickname regex is intentionally permissive (`PHONE_REGEX` + `NICK_REGEX`) and replicated server-side.

`source` is **never** trusted from the client — `frontend-X/app/api/lead/route.ts` injects it server-side after `safeParse`, before proxying upstream. The Zod schema does **not** include `source`. The three `route.ts` files are otherwise identical; if you change one, change all three.

The Telegram send is best-effort: if `TELEGRAM_BOT_TOKEN` is empty the handler logs to stdout and still returns 200, so dev works without secrets. SmartCaptcha verify is also skipped when `SMARTCAPTCHA_SERVER_KEY` is empty (frontend uses literal `"dev-no-captcha"` token in that case — see `shared/components/sections/SmartCaptcha.tsx`). All three sites post into the single `TELEGRAM_CHAT_ID`; the Go handler picks an emoji marker (`🟣 MAX`, `🔵 TG`, `🟢 WEB`) by `lead.Source` to disambiguate them.

## Frontend architecture

### Per-frontend layout (identical structure across `frontend-max/`, `-tg/`, `-web/`)

- App Router, all routes are SSG except `/api/lead` (`force-dynamic`). `app/(marketing)/` holds `page.tsx`, `MarketingClient.tsx`, `privacy/page.tsx`, `consent/page.tsx`, `offer/page.tsx`, `cases/[slug]/page.tsx`, and the blog (`blog/page.tsx` + `blog/[slug]/page.tsx` + `blog/rss.xml/route.ts`). Cases generate static via `generateStaticParams` from `lib/content/cases.ts`; blog posts are MDX files under `content/blog/*.mdx` (each frontend has its own).
- `app/page.tsx` is a **server** component that renders `<JsonLd />` (server) + `<MarketingClient />` (a thin `"use client"` wrapper that imports `shared/components/MarketingHome` and `lib/content`). The wrapper exists because the section components transitively import `lucide-react` icons and `framer-motion`, which can't cross the RSC server→client boundary. **Don't import section content directly from a server component**; route it through the `MarketingClient` wrapper.
- `lib/site.ts` — per-frontend config (`SiteConfig extends LegalSiteConfig & SiteMetaConfig`): `domain`, `source`, `purpose`, brand title/description copy, keywords, theme color, `serviceType` for JSON-LD. Domain is a placeholder until launch.
- `lib/content/*.ts` — per-frontend typed content (`hero.ts`, `services.ts`, `cases.ts`, `tariffs.ts`, `whyPlatform.ts`, `whyUs.ts`, `faq.ts`, `leadForm.ts`, `footer.ts`, `header.ts`). The shape of each `*Content` type is defined in `shared/lib/content/*.ts`; per-frontend files import that type and export the literal data. **The three frontends have parallel structures** — when you add a new field to a section type, you must update it in the shared type plus every frontend's content file.
- `app/layout.tsx` calls `buildSiteMetadata({ config: siteConfig })` and `buildSiteViewport(siteConfig)` from `shared/lib/site-meta.ts` to derive the full `Metadata` and `Viewport`. The font (`Inter`, `subsets: ["latin", "cyrillic"]`) is loaded here.
- `app/sitemap.ts` and `app/robots.ts` re-export the helpers from `shared/lib/site-routing.ts`; per-site URL is read from `NEXT_PUBLIC_SITE_URL`.
- `app/opengraph-image.tsx` calls `renderSiteOgImage(siteConfig)` from `shared/lib/og-image.tsx`. Runtime is `edge`; the route fetches Inter from Google Fonts on cold start (will 500 if outbound HTTPS to `*.googleapis.com` / `*.gstatic.com` is blocked). Twitter shares the same image — `metadata.twitter.images = ["/opengraph-image"]`, no separate `twitter-image.tsx`. Blog has its own pair (`app/(marketing)/blog/opengraph-image.tsx` for the index, `app/(marketing)/blog/[slug]/opengraph-image.tsx` per-post).
- `app/icon.tsx` (32×32) and `app/apple-icon.tsx` (180×180) generate the favicon and apple-touch-icon dynamically via `next/og` + `shared/lib/dynamic-icon.tsx`. PNG icons for PWA install (192×192, 512×512) come from `app/icon-192/route.ts` and `app/icon-512/route.ts`, referenced from the manifest. Each frontend passes its own brand gradient (`gradFrom`/`gradTo`).
- `app/manifest.ts` — per-site PWA manifest.
- `next.config.mjs` (per frontend) sets `transpilePackages: ["shared"]` (so Next compiles the workspace's TS), `output: "standalone"` (for Docker), and `outputFileTracingRoot: path.join(__dirname, "..")` — without that, Next traces only inside the frontend dir and the standalone server crashes with `Cannot find module 'shared/...'`. It also injects security headers (`X-Content-Type-Options`, `X-Frame-Options: DENY`, `Permissions-Policy`, `Referrer-Policy`).

### Shared workspace (`shared/`)

- `shared/components/MarketingHome.tsx` — `"use client"` page assembly. Takes `{ contents: SiteContents, heroVisual?: ReactNode }` and renders `Header → Hero → Services → Cases → WhyUs → Tariffs → WhyPlatform → FAQ → LeadForm → Footer → StickyCTA`. **This file is the section order — change it here, not per-frontend.** `LeadForm` is lazily loaded via `next/dynamic` (drops ~25 KB gz from First Load JS — react-hook-form + zod-resolver come in only when needed). The section background pattern alternates `bg → bg-subtle → bg → bg-subtle…`; when reordering, also flip the section component's `className` (`section-padding` vs `section-padding bg-bg-subtle`) to keep the rhythm.
- `shared/components/sections/` — all section components (`Hero`, `Services`, `Cases` + `cases/CaseVisual`, `WhyUs`, `Tariffs`, `WhyPlatform`, `FAQ`, `LeadForm`, `Footer`, `SmartCaptcha`). **All are dumb / props-driven.** No section reads from a content file directly; data is wired from `MarketingHome`.
- `shared/components/layout/StickyCTA.tsx` — мобильный sticky-CTA, появляется после прокрутки 600 px и скрывается, когда `#lead-form` уже в viewport. Фиксируется внизу на `<lg` экранах.
- `shared/components/layout/Header.tsx` — smart-scroll header (hides on scroll-down, reappears on scroll-up, 6px hysteresis on `lastY`). The mobile drawer respects `--header-height`; if you change header height here, also update `--header-height` in each frontend's `app/globals.css` (mobile + sm breakpoints).
- `shared/components/seo/JsonLd.tsx` — server component. Builds Organization/WebSite/FAQPage/Service JSON-LD; takes `site`, `services`, `faqItems`, etc. as props. Imported from `app/page.tsx` (server-side).
- `shared/components/legal/` — `PrivacyPolicy`, `Consent`, `OperatorAddress`. Per-frontend pages (`app/(marketing)/privacy/page.tsx`, `consent/page.tsx`) just pass `siteConfig` and `legalEntity` into these.
- `shared/components/analytics/` — `CookieBanner.tsx` writes `localStorage.cookie_consent = "accepted"` and dispatches a `cookie:accepted` window event. `YandexMetrika.tsx` listens for that event and only injects the YM script after consent. Goals are typed in `shared/lib/analytics.ts` — call `reachGoal(name, params?)`. New goals must be added to the `GoalName` union there (build is `--strict`).
- `shared/components/Providers.tsx` only mounts `ToastProvider`. `useToast()` will throw outside it.
- `shared/components/visuals/` — hero visuals (e.g. `PhoneMockup`). Each frontend's `MarketingClient.tsx` chooses which visual to pass as `heroVisual`.
- `shared/components/ui/Button.tsx` — single Button component used everywhere. The text node is wrapped in `<span className="leading-none">` to fix Inter's optical-vertical-centering quirk; keep that wrapper if you refactor it. `text-white` is forced with `!text-white` because Tailwind's nested `primary.fg` color path was unreliable.
- `shared/components/ui/AnimateIn.tsx` — `AnimateIn`, `Stagger`, `StaggerItem` motion helpers. They all respect `useReducedMotion`. The Hero counter (`CountUp`) animates only when in view and once.
- `shared/lib/site-meta.ts` — `buildSiteMetadata`, `buildSiteViewport`, `resolveSiteUrl`. Reads `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_YANDEX_VERIFICATION`, `NEXT_PUBLIC_GOOGLE_VERIFICATION`. Sets `metadataBase`, OG, Twitter, robots (Yandex/Google specifics, `max-image-preview: large`), apple-touch-icon, manifest.
- `shared/lib/site-routing.ts` — `buildSiteSitemap`, `buildSiteRobots`. Robots whitelists Yandex/Google/Bing + AI crawlers (GPTBot, ClaudeBot, etc.) and disallows `/api/`.
- `shared/lib/legal-entity.ts` — **single source of truth** for the operator (`brand`, `legalName`, `inn`, `ogrnip`, `address`, `contactEmail`, `policyDate`, `policyRevision`). All three frontends import this; one edit updates `/privacy` and `/consent` everywhere. **Currently a placeholder** — must be replaced before public launch (see `NEED.MD`).
- `shared/lib/schema.ts` — `leadSchema` + `PHONE_REGEX` + `NICK_REGEX`. Imported by all three `app/api/lead/route.ts`. Note `source` is intentionally **not** in the schema.
- `shared/lib/content/*.ts` — type definitions for each section's content. Per-frontend `lib/content/*.ts` imports the type and exports the literal data.
- `shared/lib/og-image.tsx` — edge OG image renderer. Pulls Inter from Google Fonts.
- `shared/lib/utils.ts` — `cn()` (`clsx` + `tailwind-merge`); `getUTMParams()` reads UTM from URL, used by the form and forwarded as hidden fields into the Telegram message.

### FAQ duplication and the RSC boundary

`lib/content/faq.ts` (per-frontend) is the canonical FAQ data source. Both `shared/components/sections/FAQ.tsx` (client component) and `shared/components/seo/JsonLd.tsx` (server component) consume this — but JsonLd is imported from the server `page.tsx` and FAQ from the client `MarketingClient`. **Do not put data in client components and import it from server components** — that broke the build once because `"use client"` files become opaque RSC modules at build-time. Keep section data in plain `.ts` files (no `"use client"` directive).

### Design tokens and theming

Design tokens live as CSS custom properties in each frontend's `app/globals.css` (`--bg`, `--fg`, `--primary`, `--accent-soft`, `--gradient-brand`, `--bg-subtle`, etc.) and are exposed to Tailwind via `tailwind.config.ts theme.extend.colors`. **Light theme only** — dark theme + `next-themes` were intentionally removed; do not add `data-theme="dark"` selectors back. Each frontend can have a slightly different palette (theme color comes from `siteConfig.themeColor`).

Diagonal section backgrounds (`section-diagonal-bg`, `section-leadform-bg`) are flat on mobile (<768px) and slanted on desktop. The `.card` utility (`bg-bg-card border border-border rounded-[var(--radius)]` + shadow + hover lift) lives in each `globals.css @layer components`.

## Backend architecture

- Single binary `cmd/server/main.go`: graceful shutdown via SIGINT/SIGTERM, `withRecover` middleware, CORS over the `ALLOWED_ORIGINS` whitelist (CSV of full origin URLs, one per landing — must list every public frontend URL exactly).
- `internal/ratelimit` is an in-memory token-bucket per IP via `golang.org/x/time/rate` with a janitor goroutine pruning idle entries every minute. **Resets on restart and is not shared across instances** — if you scale horizontally, swap to Redis.
- `internal/captcha/yandex.go` POSTs `application/x-www-form-urlencoded` to `https://smartcaptcha.yandexcloud.net/validate`. Empty secret = pass-through (dev-friendly).
- `internal/handlers/lead.go` builds a MarkdownV2 message; `escapeMarkdownV2` escapes all 18 special characters (`_*[]()~\`>#+-=|{}.!`). The header uses a coloured marker (`🟣 MAX`, `🔵 TG`, `🟢 WEB`) chosen by `lead.Source` so all three sources can share a single Telegram chat without ambiguity. On Telegram-send failure the handler logs only `ip` + `err` — the message body contains PII (имя, контакт) and **must not** end up in stdout/log files (152-ФЗ).
- IP extraction prefers `X-Forwarded-For` then `X-Real-IP` then `RemoteAddr` — the Next.js proxy always sets the first two.
- `/api/health` returns 200 — used by docker healthcheck.

## Deployment

Production runs all 4 services as Docker containers on a single VPS with **host nginx** (not containerised) terminating SSL. nginx proxies `max.<domain>` → `127.0.0.1:3001`, `tg.<domain>` → `:3002`, `web.<domain>` → `:3003`. Backend has **no** public port — frontends call it as `http://backend:8080` over the docker network. Full guide is in `DEPLOY.md`.

Key constraints when working on Dockerfiles or compose:
- Each frontend's `Dockerfile` has the **monorepo root** as build context (`context: .` in `docker-compose.yml`), because `shared/` lives outside the frontend dir. The Dockerfile copies all four `package.json`s for the deps cache layer, then only the frontend being built + `shared/` for the build layer.
- `NEXT_PUBLIC_*` env vars must be passed as Docker `args:` (not `environment:`), because Next inlines them into the client bundle and bakes them into SSG'd HTML at `next build` time. After changing any `NEXT_PUBLIC_*`, you **must rebuild**, not just restart. Pure server-runtime config (`BACKEND_URL`, `TELEGRAM_*`, `ALLOWED_ORIGINS`, `SMARTCAPTCHA_SERVER_KEY`) goes via `env_file: .env`.
- Node heap is capped at 1536 MB in the Dockerfile (`NODE_OPTIONS=--max-old-space-size=1536`) so `next build` survives on a 2 GB VPS. The `setup-server.sh` script creates a 2 GB swap if RAM ≤ 2 GB.
- The runtime image uses `next/standalone` output and runs as the unprivileged `node` user.

## Conventions

- All copy is in Russian.
- Imports inside a frontend: use the `@/` alias for that frontend's own files (configured in `frontend-X/tsconfig.json`); use `shared/...` for cross-workspace imports. **Never** reach into another frontend.
- `cn()` from `shared/lib/utils.ts` (`clsx` + `tailwind-merge`) is the only way to compose class lists; don't string-concat Tailwind classes.
- When adding a new "card grid" section, follow the pattern in `Services.tsx` / `WhyPlatform.tsx` / `WhyUs.tsx`: `Stagger` → `StaggerItem` → `<div class="card card-hover h-full p-6">`.
- Section IDs (`#services`, `#process`, `#tariffs`, `#faq`, `#lead-form`, `#why-us`, `#why-platform`) are referenced from Header nav, Footer columns, CTAs, `JsonLd`, and `sitemap.ts`. Don't rename without grepping every frontend.
- When changing a shared section's contract: update the type in `shared/lib/content/<section>.ts`, then update each frontend's `lib/content/<section>.ts` literal. TypeScript will catch missing fields, but spread across 3 packages.

## Placeholder data

The repo ships with placeholders the customer will replace before launch. **Don't treat any of these as real values:** `BotMax`, `*.example.ru`, `@botmax_studio`, `@botmax_studio_tg`. Real values currently in `shared/lib/legal-entity.ts`: brand `"Legan Studio"`, legal entity (ИП Леган Максим Артёмович, ИНН, ОГРНИП, адрес, банк) and `contactEmail: legan-studio@yandex.com`. Internal infra slug `botmax` (docker network, container names, nginx upstream IDs, Go module path `github.com/botmax/lead-service`, package.json `name`) is intentionally not renamed — it's a stable identifier. Pre-launch checklist is in `NEED.MD` (replace remaining placeholders + domains; submit РКН ПДн notification + cross-border transfer notification for Telegram per 152-ФЗ).
