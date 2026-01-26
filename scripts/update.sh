#!/usr/bin/env bash
set -euo pipefail

if [[ ! -f .env ]]; then
  echo "Missing .env file. Copy .env.example to .env and configure your secrets before updating." >&2
  exit 1
fi

load_env_file() {
  while IFS= read -r line || [[ -n "$line" ]]; do
    line="${line#"${line%%[![:space:]]*}"}"
    if [[ -z "$line" || "${line:0:1}" == "#" ]]; then
      continue
    fi

    if [[ "$line" == export\ * ]]; then
      line="${line#export }"
    fi

    if [[ "$line" != *"="* ]]; then
      continue
    fi

    key="${line%%=*}"
    value="${line#*=}"
    key="${key%"${key##*[![:space:]]}"}"
    value="${value#"${value%%[![:space:]]*}"}"
    value="${value%"${value##*[![:space:]]}"}"

    if [[ "$value" == \"*\" && "$value" == *\" ]]; then
      value="${value:1:-1}"
    elif [[ "$value" == \'*\' && "$value" == *\' ]]; then
      value="${value:1:-1}"
    fi

    export "${key}=${value}"
  done < .env
}

load_env_file

if [[ -z "${POSTGRES_PASSWORD:-}" ]]; then
  echo "POSTGRES_PASSWORD is not set in .env. Please configure it before updating." >&2
  exit 1
fi

git pull
sudo docker compose build
sudo docker compose up -d

postgres_ready=false
for attempt in {1..30}; do
  if sudo docker compose exec -T postgres pg_isready -U livewidgets >/dev/null 2>&1; then
    postgres_ready=true
    break
  fi
  echo "Waiting for postgres container to be ready (${attempt}/30)..."
  sleep 2
done

if [[ "$postgres_ready" != true ]]; then
  echo "Postgres did not become ready in time." >&2
  exit 1
fi

if ! sudo docker compose exec -T postgres env PGPASSWORD="${POSTGRES_PASSWORD}" \
  psql -U livewidgets -d livewidgets -c "SELECT 1" >/dev/null 2>&1; then
  cat <<'EOF' >&2
Database authentication failed.

This usually happens when POSTGRES_PASSWORD was changed after the database volume was created.
To fix this, either restore the original password in .env or reset the database volume:

  sudo docker compose down -v
  sudo docker compose up -d --build

EOF
  exit 1
fi

sudo docker compose exec -T app npm run prisma:migrate

echo "Update complete."
