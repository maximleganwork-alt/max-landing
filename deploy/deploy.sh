#!/usr/bin/env bash
#
# Pull, rebuild, and restart all services. Idempotent — safe to re-run.
# Run from the repo root: `./deploy/deploy.sh`
#
# Required: docker, docker compose plugin, .env populated.

set -euo pipefail

# Move to repo root regardless of where the script was invoked.
cd "$(dirname "$0")/.."

if [[ ! -f .env ]]; then
  echo "ERROR: .env is missing. Copy from .env.example and fill in." >&2
  exit 1
fi

# Surface any obvious "still using example.ru" mistake before we burn 5 min on
# a build that bakes the wrong domain into the static HTML.
if grep -qE '^SITE_URL_(MAX|TG|WEB)=https://[a-z]+\.example\.ru' .env; then
  echo "WARNING: .env still contains placeholder SITE_URL_* values pointing at example.ru." >&2
  echo "         Update them, then re-run." >&2
  read -rp "Continue anyway? [y/N] " ans
  [[ "$ans" =~ ^[Yy]$ ]] || exit 1
fi

echo "==> git pull"
git pull --ff-only

echo "==> docker compose build (this may take 3–10 min on a small VPS)"
# --pull keeps base images fresh (security patches in node:alpine etc).
docker compose build --pull

echo "==> docker compose up -d"
docker compose up -d --remove-orphans

echo "==> waiting for healthchecks"
# Backend healthcheck is the slowest gate. Give it 30s.
for i in {1..30}; do
  status=$(docker inspect --format='{{.State.Health.Status}}' botmax-backend 2>/dev/null || echo "starting")
  if [[ "$status" == "healthy" ]]; then
    echo "    backend healthy"
    break
  fi
  sleep 1
done

echo "==> services:"
docker compose ps

echo "==> done."
