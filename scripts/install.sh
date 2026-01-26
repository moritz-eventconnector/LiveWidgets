#!/usr/bin/env bash
set -euo pipefail

get_ubuntu_version() {
  if command -v lsb_release >/dev/null 2>&1; then
    lsb_release -rs
    return 0
  fi

  if [[ -f /etc/os-release ]]; then
    . /etc/os-release
    if [[ "${ID:-}" == "ubuntu" && -n "${VERSION_ID:-}" ]]; then
      echo "${VERSION_ID}"
      return 0
    fi
  fi

  return 1
}

if ! ubuntu_version=$(get_ubuntu_version); then
  echo "Unable to detect Ubuntu version. Install lsb-release or ensure /etc/os-release exists." >&2
  exit 1
fi
if [[ "$ubuntu_version" != "22.04" && "$ubuntu_version" != "24.04" ]]; then
  echo "Unsupported Ubuntu version: $ubuntu_version" >&2
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "Installing Docker..."
  sudo apt-get update
  sudo apt-get install -y ca-certificates curl gnupg lsb-release
  sudo install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
  sudo apt-get update
  sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  sudo systemctl enable --now docker
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "Docker Compose plugin missing." >&2
  exit 1
fi

if [[ ! -f package.json || ! -f docker-compose.yml ]]; then
  echo "Run this script from the LiveWidgets repo root." >&2
  exit 1
fi

prompt_required() {
  local label="$1"
  local value=""
  while [[ -z "$value" ]]; do
    read -rp "${label}: " value
  done
  echo "$value"
}

prompt_optional() {
  local label="$1"
  local default_value="${2:-}"
  local value=""
  read -rp "${label} [${default_value}]: " value
  if [[ -z "$value" ]]; then
    value="$default_value"
  fi
  echo "$value"
}

generate_secret() {
  if command -v openssl >/dev/null 2>&1; then
    openssl rand -hex 32
  else
    date +%s%N | sha256sum | awk '{print $1}'
  fi
}

DOMAIN=$(prompt_required "DOMAIN (example: livewidgets.de)")
LETSENCRYPT_EMAIL=$(prompt_required "LETSENCRYPT_EMAIL")
POSTGRES_PASSWORD=$(prompt_optional "POSTGRES_PASSWORD" "$(generate_secret)")
REDIS_PASSWORD=$(prompt_optional "REDIS_PASSWORD" "$(generate_secret)")
NEXTAUTH_SECRET=$(prompt_optional "NEXTAUTH_SECRET" "$(generate_secret)")
STRIPE_SECRET_KEY=$(prompt_required "STRIPE_SECRET_KEY")
STRIPE_WEBHOOK_SECRET=$(prompt_required "STRIPE_WEBHOOK_SECRET")
STRIPE_PRICE_ID_CREATOR=$(prompt_required "STRIPE_PRICE_ID_CREATOR")
STRIPE_PRICE_ID_CREATOR_PLUS=$(prompt_required "STRIPE_PRICE_ID_CREATOR_PLUS")
TWITCH_CLIENT_ID=$(prompt_required "TWITCH_CLIENT_ID")
TWITCH_CLIENT_SECRET=$(prompt_required "TWITCH_CLIENT_SECRET")
BOT_TWITCH_USERNAME=$(prompt_required "BOT_TWITCH_USERNAME")
BOT_TWITCH_OAUTH_TOKEN=$(prompt_required "BOT_TWITCH_OAUTH_TOKEN")
SMTP_HOST=$(prompt_required "SMTP_HOST")
SMTP_PORT=$(prompt_required "SMTP_PORT")
SMTP_USER=$(prompt_required "SMTP_USER")
SMTP_PASS=$(prompt_required "SMTP_PASS")
SMTP_FROM=$(prompt_required "SMTP_FROM")
ADMIN_EMAIL=$(prompt_required "ADMIN_EMAIL")
ADMIN_PASSWORD=$(prompt_required "ADMIN_PASSWORD")

if [[ -f .env ]]; then
  mv .env ".env.backup.$(date +%s)"
fi

cat <<ENV > .env
APP_URL=https://${DOMAIN}
DOMAIN=${DOMAIN}
NEXT_PUBLIC_SOCKET_URL=https://${DOMAIN}
SOCKET_SERVER_PORT=3001
DATABASE_URL=postgresql://livewidgets:${POSTGRES_PASSWORD}@postgres:5432/livewidgets
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=${REDIS_PASSWORD}
NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
NEXTAUTH_URL=https://${DOMAIN}
TWITCH_CLIENT_ID=${TWITCH_CLIENT_ID}
TWITCH_CLIENT_SECRET=${TWITCH_CLIENT_SECRET}
BOT_TWITCH_USERNAME=${BOT_TWITCH_USERNAME}
BOT_TWITCH_OAUTH_TOKEN=${BOT_TWITCH_OAUTH_TOKEN}
STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET}
STRIPE_PRICE_ID_CREATOR=${STRIPE_PRICE_ID_CREATOR}
STRIPE_PRICE_ID_CREATOR_PLUS=${STRIPE_PRICE_ID_CREATOR_PLUS}
SMTP_HOST=${SMTP_HOST}
SMTP_PORT=${SMTP_PORT}
SMTP_USER=${SMTP_USER}
SMTP_PASS=${SMTP_PASS}
SMTP_FROM=${SMTP_FROM}
ADMIN_EMAIL=${ADMIN_EMAIL}
ADMIN_PASSWORD=${ADMIN_PASSWORD}
LETSENCRYPT_EMAIL=${LETSENCRYPT_EMAIL}
ENV

sudo docker compose up -d --build

migrate_done=false
for attempt in {1..30}; do
  if sudo docker compose ps -q app >/dev/null 2>&1; then
    if sudo docker compose exec -T app npm run prisma:migrate; then
      migrate_done=true
      break
    fi
  fi
  echo "Waiting for app container to be ready (${attempt}/30)..."
  sleep 2
done

if [[ "$migrate_done" != true ]]; then
  echo "Migration failed after waiting for the app container." >&2
  exit 1
fi

sudo docker compose exec -T app npm run seed

echo "Installation complete."
