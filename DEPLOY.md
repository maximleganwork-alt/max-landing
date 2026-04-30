# Deployment guide

Production deploy on a single Linux server (Ubuntu 22.04 / Debian 12), running:
- **Docker** for the four app services (3 Next frontends + Go backend)
- **nginx on host** for SSL termination and reverse proxy

The whole stack fits comfortably on a 2 GB RAM / 1 vCPU VPS once the swap and Node memory cap (both auto-configured) are in place.

---

## Topology

```
                        ┌─────────────── server :22, :80, :443 ───────────────┐
                        │                                                      │
   public DNS           │   nginx (host pkg)                                   │
   max.example.ru ─────►│     ├─ max.example.ru → 127.0.0.1:3001              │
   tg.example.ru  ─────►│     ├─ tg.example.ru  → 127.0.0.1:3002              │
   web.example.ru ─────►│     └─ web.example.ru → 127.0.0.1:3003              │
                        │                                                      │
                        │   ┌─────── docker network: botmax ─────────┐         │
                        │   │  frontend-max  :3000 → :3001  (loopback) │       │
                        │   │  frontend-tg   :3000 → :3002  (loopback) │       │
                        │   │  frontend-web  :3000 → :3003  (loopback) │       │
                        │   │  backend       :8080  (internal only)    │       │
                        │   └─────────────────────────────────────────┘        │
                        └──────────────────────────────────────────────────────┘
```

**Why nginx on host, not in Docker:** simpler `certbot --nginx` automation. The four app services live in Docker; nginx terminates SSL on the host and proxies to `127.0.0.1:300{1,2,3}`. Backend has **no** public port — only the frontends reach it via the docker network as `http://backend:8080`.

---

## Prerequisites

- **DNS** for the three subdomains (e.g. `max.example.ru`, `tg.example.ru`, `web.example.ru`) all pointing A/AAAA to your server's public IP. Wait for propagation before running certbot.
- **SSH** access as a sudo-capable non-root user.
- **Telegram bot + chat id** if you want lead notifications (optional — without them the backend logs leads to stdout and still returns 200).
- **Yandex SmartCaptcha** key pair (optional — without `SMARTCAPTCHA_SERVER_KEY` the backend skips captcha verification).
- **Yandex Webmaster / Google Search Console verifications** (optional — set the meta-tag tokens later for SEO confirmation).

---

## First-time setup (~20 min)

### 1. Bootstrap the server

SSH to the server **as your non-root user** and run:

```bash
curl -fsSL https://raw.githubusercontent.com/<you>/<repo>/main/deploy/setup-server.sh -o /tmp/setup.sh
bash /tmp/setup.sh
```

Or clone the repo first and run `./deploy/setup-server.sh`.

This installs **docker**, **nginx**, **certbot**, creates a 2 GB swap if RAM is tight, and adds you to the `docker` group. You'll need to **log out and back in** before the next step so docker works without `sudo`.

### 2. Clone the repo

```bash
git clone https://github.com/<you>/<repo>.git botmax
cd botmax
```

### 3. Populate `.env`

```bash
cp .env.example .env
nano .env
```

What to fill in (everything else can stay blank for the first deploy):

| Variable | Why |
|---|---|
| `SITE_URL_MAX` / `_TG` / `_WEB` | Public URL of each landing — baked into canonical, OG image, sitemap, JSON-LD at build time. **MUST match the nginx `server_name`.** |
| `ALLOWED_ORIGINS` | CSV of the same three URLs — the Go backend's CORS check is exact-match. |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | Get from `@BotFather` and your group's `getUpdates`. Leads from all three sites land in the same chat — they're distinguished by the 🟣/🔵/🟢 marker in the message header. Leaving them blank makes the form succeed and just log to stdout. |
| `SMARTCAPTCHA_SERVER_KEY` + `NEXT_PUBLIC_SMARTCAPTCHA_CLIENT_KEY` | Pair from Yandex Cloud Console. Both blank = captcha bypassed (dev/first-deploy). |
| `NEXT_PUBLIC_YANDEX_METRIKA_ID` | Numeric counter id from `metrika.yandex.ru`. Blank = no analytics injected. |
| `NEXT_PUBLIC_YANDEX_VERIFICATION` / `NEXT_PUBLIC_GOOGLE_VERIFICATION` | Verification tokens from Webmaster / Search Console. |

### 4. Build & start the containers

```bash
./deploy/deploy.sh
```

First build downloads ~700 MB of base images and runs three `next build`s sequentially. On a 1 vCPU / 2 GB VPS this takes ~5–10 min. Subsequent builds are 1–3 min thanks to layer caching.

After the script finishes, verify everything is healthy:

```bash
docker compose ps
# all four containers should be "Up" / "healthy"

curl -fsS http://127.0.0.1:3001/ | head -1   # frontend-max
curl -fsS http://127.0.0.1:3002/ | head -1   # frontend-tg
curl -fsS http://127.0.0.1:3003/ | head -1   # frontend-web
docker exec botmax-backend wget -qO- http://127.0.0.1:8080/api/health
```

### 5. Wire up nginx (HTTP first)

```bash
# Snippets (proxy + TLS)
sudo cp deploy/nginx/botmax-tls.conf   /etc/nginx/snippets/
sudo cp deploy/nginx/botmax-proxy.conf /etc/nginx/snippets/

# Vhost — replace example.ru with YOUR apex domain
sudo cp deploy/nginx/botmax.conf /etc/nginx/sites-available/
sudo sed -i 's/example\.ru/YOUR-DOMAIN.ru/g' /etc/nginx/sites-available/botmax.conf

# Enable
sudo ln -sf /etc/nginx/sites-available/botmax.conf /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

sudo nginx -t && sudo systemctl reload nginx
```

At this point only the `:80` blocks work. The `:443` blocks reference cert files that don't exist yet — that's fine, certbot will fix it next.

### 6. Get SSL certificates

```bash
sudo certbot --nginx \
  -d max.YOUR-DOMAIN.ru \
  -d tg.YOUR-DOMAIN.ru \
  -d web.YOUR-DOMAIN.ru \
  --agree-tos --redirect -m you@yourmail.ru
```

certbot will edit `botmax.conf` in place: the `:80` blocks become 301 redirects, the `:443` blocks get the right `ssl_certificate` paths. Auto-renewal is set up by the certbot package (systemd timer / cron).

### 7. Smoke test

```bash
curl -I https://max.YOUR-DOMAIN.ru
curl -I https://tg.YOUR-DOMAIN.ru
curl -I https://web.YOUR-DOMAIN.ru
# expect HTTP/2 200, valid TLS, content-type: text/html
```

Open each subdomain in a browser, submit the lead form once on each. The Telegram chat should receive three messages with the right `🟣 MAX` / `🔵 TG` / `🟢 WEB` markers.

---

## Updating the deployed app

```bash
ssh user@server
cd botmax
./deploy/deploy.sh
```

That's the whole flow: `git pull`, `docker compose build --pull`, `docker compose up -d`. Old images are tagged `:latest` and overwritten; the previous container is removed only after the new one is healthy.

If you only want to redeploy one service:

```bash
docker compose build frontend-max
docker compose up -d frontend-max
```

---

## Operating

### Logs

```bash
docker compose logs -f                       # all services, follow
docker compose logs -f --tail=100 backend    # just backend
docker compose logs --since 1h frontend-max  # last hour, frontend-max
```

Logs auto-rotate (10 MB × 3 files per container — see `x-logging` in `docker-compose.yml`).

### Restart a single service without rebuilding

```bash
docker compose restart frontend-max
```

### Get a shell inside a container

```bash
docker compose exec backend sh        # backend (distroless image — limited)
docker compose exec frontend-max sh   # any frontend (alpine, full sh)
```

### nginx access logs

```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## Troubleshooting

### `next build` fails with OOM (`Killed` / exit 137)

The setup script creates a 2 GB swap if RAM ≤ 2 GB. If you're on a smaller box (1 GB), increase the swap to 4 GB:

```bash
sudo swapoff /swapfile && sudo rm /swapfile
sudo fallocate -l 4G /swapfile && sudo chmod 600 /swapfile
sudo mkswap /swapfile && sudo swapon /swapfile
```

The Dockerfile already caps Node's heap with `NODE_OPTIONS=--max-old-space-size=1536`. If still failing, build one frontend at a time:

```bash
docker compose build backend
docker compose build frontend-max
docker compose build frontend-tg
docker compose build frontend-web
```

### `docker: permission denied while trying to connect`

You forgot to log out and back in after `setup-server.sh` added you to the `docker` group. `exit`, SSH back in, retry.

### Forms hit `502 Bad Gateway`

```bash
docker compose ps                                  # is backend "healthy"?
docker compose logs --tail=50 backend              # any panic?
docker exec botmax-backend wget -qO- http://127.0.0.1:8080/api/health
```

If backend is up but frontend can't reach it: the frontend's `BACKEND_URL` env should be `http://backend:8080` (Docker DNS) — not `http://localhost:8080`.

### Captcha box doesn't appear / form rejects valid submissions

Check `.env`:
- `NEXT_PUBLIC_SMARTCAPTCHA_CLIENT_KEY` (client-side, must be in `.env` BEFORE `docker compose build` — it's baked at build time)
- `SMARTCAPTCHA_SERVER_KEY` (server-side, runtime)

Both blank = captcha disabled. Only client blank = box doesn't render (form sends `dev-no-captcha` token, server skips). Only server blank = server skips verification, accepts any token.

After changing `NEXT_PUBLIC_*` you **must rebuild**, not just restart:

```bash
docker compose build --no-cache frontend-max frontend-tg frontend-web
docker compose up -d
```

### OG image returns 500 / "Unsupported OpenType signature"

The dynamic OG image fetches Inter from Google Fonts on cold start. If the edge worker can't reach `fonts.googleapis.com`, the route 500s. Most likely: outbound HTTPS is blocked by your hosting firewall. Allow egress to `*.googleapis.com` and `*.gstatic.com`.

### "504 Gateway Timeout" on lead form

Telegram API is slow / rate-limited. The Go backend has a 10 s outbound timeout — bumps to 30 s if you need it (`internal/telegram/telegram.go`). For now, just retry.

### Certificate didn't auto-renew

```bash
sudo certbot renew --dry-run    # diagnoses without changing anything
sudo systemctl status snap.certbot.renew.timer    # or, on apt-installed certbot:
sudo systemctl status certbot.timer
```

The certbot package sets up a timer that runs twice daily. If it's missing:

```bash
sudo systemctl enable --now certbot.timer
```

---

## Hardening (optional, after first deploy works)

### Enable HSTS

In `deploy/nginx/botmax-tls.conf`, uncomment the `add_header Strict-Transport-Security` line. Test for at least a week before considering `preload`.

### Submit sitemaps

After the site is live and the meta-tag verifications pass:

```
https://search.google.com/search-console     # add property → submit /sitemap.xml
https://webmaster.yandex.ru                  # add site → confirm meta tag → submit
```

### Replace placeholder legal entity data

Edit `shared/lib/legal-entity.ts` and replace `legalName`, `inn`, `ogrnip`, `address`, `contactEmail`, `policyDate` with real values. **Required** before public launch — РКН can fine for false data on a 152-ФЗ privacy policy.

After editing, rebuild:

```bash
./deploy/deploy.sh
```

### Move secrets out of `.env` into a secrets manager

For >1 server / team setups, replace `.env` with HashiCorp Vault, AWS SSM, or just systemd's `EnvironmentFile=` pointing at a 0600 file in `/etc/`.

---

## Files in `deploy/`

| Path | Purpose |
|---|---|
| `deploy/setup-server.sh` | One-shot: install docker/nginx/certbot, create swap, configure UFW |
| `deploy/deploy.sh` | Pull + rebuild + restart. Idempotent. |
| `deploy/nginx/botmax.conf` | nginx site config — 3 vhosts, redirects, proxy |
| `deploy/nginx/botmax-tls.conf` | TLS hardening snippet |
| `deploy/nginx/botmax-proxy.conf` | Reverse-proxy headers + gzip snippet |
