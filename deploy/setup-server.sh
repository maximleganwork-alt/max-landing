#!/usr/bin/env bash
#
# First-time server bootstrap. Run ONCE on a fresh Ubuntu 22.04 / Debian 12
# server, as a sudo-capable user. Idempotent — safe to re-run.
#
# What it does:
#   1. Installs docker + docker compose plugin from the official Docker repo.
#   2. Adds the current user to the `docker` group (avoids `sudo docker`).
#   3. Installs nginx + certbot.
#   4. Creates a 2 GB swap file if RAM ≤ 2 GB (so `next build` doesn't OOM).
#   5. Opens UFW for 22 / 80 / 443.
#
# What it DOES NOT do (you do these manually after):
#   - Clone the repo.
#   - Populate .env.
#   - Symlink the nginx vhost.
#   - Run certbot to get SSL certs.
# See DEPLOY.md for the full sequence.

set -euo pipefail

if [[ "$EUID" -eq 0 ]]; then
  echo "ERROR: don't run this as root. Use a sudo-capable user." >&2
  exit 1
fi

echo "==> apt update + base packages"
sudo apt-get update -y
sudo apt-get install -y \
  ca-certificates curl gnupg lsb-release ufw nginx git

# ─── Docker ───
if ! command -v docker >/dev/null 2>&1; then
  echo "==> installing Docker Engine"
  sudo install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/$(. /etc/os-release; echo "$ID")/gpg \
    | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  sudo chmod a+r /etc/apt/keyrings/docker.gpg
  codename=$(. /etc/os-release; echo "${VERSION_CODENAME}")
  os_id=$(. /etc/os-release; echo "$ID")
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/${os_id} ${codename} stable" \
    | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
  sudo apt-get update -y
  sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  sudo systemctl enable --now docker
fi

# Add current user to docker group so `docker compose` works without sudo.
if ! id -nG "$USER" | grep -qw docker; then
  echo "==> adding $USER to docker group (re-login required to take effect)"
  sudo usermod -aG docker "$USER"
fi

# ─── Certbot (snap is the upstream-recommended path; falls back to apt) ───
if ! command -v certbot >/dev/null 2>&1; then
  echo "==> installing certbot"
  if command -v snap >/dev/null 2>&1; then
    sudo snap install --classic certbot
    sudo ln -sf /snap/bin/certbot /usr/bin/certbot
  else
    sudo apt-get install -y certbot python3-certbot-nginx
  fi
fi

# ─── Swap (2 GB) for low-RAM VPS so `next build` survives ───
ram_kb=$(awk '/^MemTotal:/ { print $2 }' /proc/meminfo)
ram_gb=$(( ram_kb / 1024 / 1024 ))
if [[ "$ram_gb" -le 2 ]] && [[ ! -f /swapfile ]]; then
  echo "==> RAM is ${ram_gb} GB; creating /swapfile (2 GB)"
  sudo fallocate -l 2G /swapfile
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab > /dev/null
  # Tune swappiness so the OS doesn't swap aggressively in steady state.
  echo 'vm.swappiness=10' | sudo tee /etc/sysctl.d/99-swappiness.conf > /dev/null
  sudo sysctl --system > /dev/null
fi

# ─── UFW (only if it's enabled — don't surprise users with a firewall) ───
if sudo ufw status | grep -q "Status: active"; then
  echo "==> UFW is active; ensuring 22/80/443 are allowed"
  sudo ufw allow 22/tcp || true
  sudo ufw allow 80/tcp || true
  sudo ufw allow 443/tcp || true
fi

cat <<'EOF'

==> Done.

Next steps (do NOT run these as root):

  1) Re-login (so the docker group membership takes effect):
       exit
       ssh <user>@<server>

  2) Clone the repo and `cd` into it:
       git clone <your-repo> botmax && cd botmax

  3) Configure the production env:
       cp .env.example .env
       nano .env     # fill in SITE_URL_*, ALLOWED_ORIGINS, telegram, etc.

  4) Bring services up (will take 3–10 min on first build):
       ./deploy/deploy.sh

  5) Wire up nginx + SSL:
       sudo cp deploy/nginx/botmax-tls.conf   /etc/nginx/snippets/
       sudo cp deploy/nginx/botmax-proxy.conf /etc/nginx/snippets/
       sudo cp deploy/nginx/botmax.conf       /etc/nginx/sites-available/
       sudo sed -i 's/example\.ru/yourdomain.ru/g' /etc/nginx/sites-available/botmax.conf
       sudo ln -sf /etc/nginx/sites-available/botmax.conf /etc/nginx/sites-enabled/
       sudo nginx -t && sudo systemctl reload nginx
       sudo certbot --nginx \
         -d max.yourdomain.ru -d tg.yourdomain.ru -d web.yourdomain.ru

  See DEPLOY.md for full details.
EOF
