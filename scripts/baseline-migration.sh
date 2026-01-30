#!/usr/bin/env bash
set -euo pipefail

if [[ ! -f .env ]]; then
  echo "Missing .env file." >&2
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
  echo "POSTGRES_PASSWORD is not set in .env." >&2
  exit 1
fi

echo "Baselining existing database..."
echo "This will mark the migration as already applied."

sudo docker compose exec -T app npx prisma migrate resolve --applied 20250101000000_add_bonus_hunt_fields

echo "Baseline complete. You can now run ./scripts/update.sh normally."

