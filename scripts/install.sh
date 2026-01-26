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

prompt_with_default() {
  local label="$1"
  local default_value="${2:-}"
  if [[ -n "$default_value" ]]; then
    prompt_optional "$label" "$default_value"
  else
    prompt_required "$label"
  fi
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

prompt_yes_no() {
  local label="$1"
  local default_value="${2:-y}"
  local value=""
  local normalized_default="y"
  if [[ "${default_value,,}" == "n" ]]; then
    normalized_default="n"
  fi
  while true; do
    read -rp "${label} [${normalized_default}]: " value
    value="${value:-$normalized_default}"
    case "${value,,}" in
      y|yes)
        echo "y"
        return 0
        ;;
      n|no)
        echo "n"
        return 0
        ;;
      *)
        echo "Please enter y or n."
        ;;
    esac
  done
}

get_env_value() {
  local key="$1"
  if [[ -f .env ]]; then
    while IFS= read -r line; do
      if [[ "$line" == "${key}="* ]]; then
        echo "${line#${key}=}"
        return 0
      fi
    done < .env
  fi
  return 1
}

generate_secret() {
  if command -v openssl >/dev/null 2>&1; then
    openssl rand -hex 32
  else
    date +%s%N | sha256sum | awk '{print $1}'
  fi
}

DOMAIN=$(prompt_with_default "DOMAIN (example: livewidgets.de)" "$(get_env_value "DOMAIN" || true)")
LETSENCRYPT_EMAIL=$(prompt_with_default "LETSENCRYPT_EMAIL" "$(get_env_value "LETSENCRYPT_EMAIL" || true)")
POSTGRES_PASSWORD_DEFAULT=$(get_env_value "POSTGRES_PASSWORD" || true)
existing_postgres_volume=false
if docker volume ls -q --filter name=postgres_data | grep -q .; then
  existing_postgres_volume=true
fi
reset_postgres_volume=false
if [[ "$existing_postgres_volume" == true ]]; then
  echo "Existing postgres volume detected."
  reuse_postgres_volume=$(prompt_yes_no "Reuse existing postgres data volume? (If no, data will be removed)" "y")
  if [[ "$reuse_postgres_volume" == "n" ]]; then
    reset_postgres_volume=true
  fi
fi

if [[ "$existing_postgres_volume" == true && "$reset_postgres_volume" != true && -z "$POSTGRES_PASSWORD_DEFAULT" ]]; then
  echo "Please provide the current POSTGRES_PASSWORD to avoid authentication failures."
  POSTGRES_PASSWORD=$(prompt_required "POSTGRES_PASSWORD")
else
  if [[ -z "$POSTGRES_PASSWORD_DEFAULT" ]]; then
    POSTGRES_PASSWORD_DEFAULT=$(generate_secret)
  fi
  POSTGRES_PASSWORD=$(prompt_optional "POSTGRES_PASSWORD" "$POSTGRES_PASSWORD_DEFAULT")
fi

if [[ "$reset_postgres_volume" == true ]]; then
  echo "Removing existing postgres container and volume..."
  sudo docker compose stop postgres >/dev/null 2>&1 || true
  sudo docker compose rm -f -s postgres >/dev/null 2>&1 || true
  postgres_volumes=$(docker volume ls -q --filter name=postgres_data)
  if [[ -n "$postgres_volumes" ]]; then
    while IFS= read -r volume; do
      if [[ -n "$volume" ]]; then
        sudo docker volume rm "$volume"
      fi
    done <<< "$postgres_volumes"
  fi
fi
REDIS_PASSWORD_DEFAULT=$(get_env_value "REDIS_PASSWORD" || true)
if [[ -z "$REDIS_PASSWORD_DEFAULT" ]]; then
  REDIS_PASSWORD_DEFAULT=$(generate_secret)
fi
NEXTAUTH_SECRET_DEFAULT=$(get_env_value "NEXTAUTH_SECRET" || true)
if [[ -z "$NEXTAUTH_SECRET_DEFAULT" ]]; then
  NEXTAUTH_SECRET_DEFAULT=$(generate_secret)
fi
REDIS_PASSWORD=$(prompt_optional "REDIS_PASSWORD" "$REDIS_PASSWORD_DEFAULT")
NEXTAUTH_SECRET=$(prompt_optional "NEXTAUTH_SECRET" "$NEXTAUTH_SECRET_DEFAULT")
STRIPE_SECRET_KEY=$(prompt_with_default "STRIPE_SECRET_KEY" "$(get_env_value "STRIPE_SECRET_KEY" || true)")
STRIPE_WEBHOOK_SECRET=$(prompt_with_default "STRIPE_WEBHOOK_SECRET" "$(get_env_value "STRIPE_WEBHOOK_SECRET" || true)")
STRIPE_PRICE_ID_CREATOR=$(prompt_with_default "STRIPE_PRICE_ID_CREATOR" "$(get_env_value "STRIPE_PRICE_ID_CREATOR" || true)")
STRIPE_PRICE_ID_CREATOR_PLUS=$(prompt_with_default "STRIPE_PRICE_ID_CREATOR_PLUS" "$(get_env_value "STRIPE_PRICE_ID_CREATOR_PLUS" || true)")
TWITCH_CLIENT_ID=$(prompt_with_default "TWITCH_CLIENT_ID" "$(get_env_value "TWITCH_CLIENT_ID" || true)")
TWITCH_CLIENT_SECRET=$(prompt_with_default "TWITCH_CLIENT_SECRET" "$(get_env_value "TWITCH_CLIENT_SECRET" || true)")
BOT_TWITCH_USERNAME=$(prompt_with_default "BOT_TWITCH_USERNAME" "$(get_env_value "BOT_TWITCH_USERNAME" || true)")
BOT_TWITCH_OAUTH_TOKEN=$(prompt_with_default "BOT_TWITCH_OAUTH_TOKEN" "$(get_env_value "BOT_TWITCH_OAUTH_TOKEN" || true)")
SMTP_HOST=$(prompt_with_default "SMTP_HOST" "$(get_env_value "SMTP_HOST" || true)")
SMTP_PORT=$(prompt_with_default "SMTP_PORT" "$(get_env_value "SMTP_PORT" || true)")
SMTP_USER=$(prompt_with_default "SMTP_USER" "$(get_env_value "SMTP_USER" || true)")
SMTP_PASS=$(prompt_with_default "SMTP_PASS" "$(get_env_value "SMTP_PASS" || true)")
SMTP_FROM=$(prompt_with_default "SMTP_FROM" "$(get_env_value "SMTP_FROM" || true)")
ADMIN_EMAIL=$(prompt_with_default "ADMIN_EMAIL" "$(get_env_value "ADMIN_EMAIL" || true)")
ADMIN_PASSWORD=$(prompt_with_default "ADMIN_PASSWORD" "$(get_env_value "ADMIN_PASSWORD" || true)")

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
    if [[ ! -d prisma/migrations || -z "$(find prisma/migrations -maxdepth 1 -type d -not -path prisma/migrations 2>/dev/null)" ]]; then
      echo "No prisma migrations found. Running prisma db push..."
      if sudo docker compose exec -T app npm run prisma:push; then
        migrate_done=true
        break
      fi
    else
      if sudo docker compose exec -T app npm run prisma:migrate; then
        migrate_done=true
        break
      elif sudo docker compose exec -T app npm run prisma:push; then
        migrate_done=true
        break
      fi
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
