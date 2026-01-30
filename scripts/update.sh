#!/usr/bin/env bash
set -euo pipefail

clean_build=false
force_reset=false
for arg in "$@"; do
  case "$arg" in
    --clean)
      clean_build=true
      ;;
    --force)
      force_reset=true
      ;;
  esac
done

if [[ ! -f .env ]]; then
  echo "Missing .env file. Copy .env.example to .env and configure your secrets before updating." >&2
  exit 1
fi

dirty_entries="$(git status --porcelain)"
ignored_dirty_entries="$(echo "$dirty_entries" | grep -E '^\?\? \.env\.backup\.[0-9]+$' || true)"
filtered_dirty_entries="$(echo "$dirty_entries" | grep -vE '^\?\? \.env\.backup\.[0-9]+$' || true)"

if [[ -n "$filtered_dirty_entries" ]]; then
  if [[ "$force_reset" == true ]]; then
    echo "Working tree has uncommitted changes. Forcing a reset to match HEAD." >&2
    git status --short >&2
    git reset --hard HEAD
    git clean -fd -e .env -e ".env.backup.*"
  else
    echo "Working tree has uncommitted changes. Please commit or reset them before updating." >&2
    git status --short >&2
    exit 1
  fi
fi

if [[ -n "$ignored_dirty_entries" ]]; then
  echo "Ignoring .env.backup.* files created during previous updates." >&2
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

if [[ "$clean_build" == true ]]; then
  echo "Running clean rebuild (no cache, force recreate containers)..."
  rm -rf .next node_modules
  sudo docker compose build --no-cache
else
  sudo docker compose build
fi

if sudo docker compose up --help | grep -q -- '--wait'; then
  if [[ "$clean_build" == true ]]; then
    sudo docker compose up -d --wait --force-recreate
  else
    sudo docker compose up -d --wait
  fi
else
  if [[ "$clean_build" == true ]]; then
    sudo docker compose up -d --force-recreate
  else
    sudo docker compose up -d
  fi
fi

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
  sudo docker compose logs --tail=200 postgres >&2 || true
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

if [[ ! -d prisma/migrations || -z "$(find prisma/migrations -maxdepth 1 -type d -not -path prisma/migrations 2>/dev/null)" ]]; then
  echo "No prisma migrations found. Running prisma db push..."
  sudo docker compose exec -T app npm run prisma:push
else
  # Check if _prisma_migrations table exists (database has been baselined)
  has_migration_table=$(sudo docker compose exec -T postgres env PGPASSWORD="${POSTGRES_PASSWORD}" \
    psql -U livewidgets -d livewidgets -tAc "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '_prisma_migrations');" 2>/dev/null | tr -d '[:space:]' || echo "f")
  
  if [[ "$has_migration_table" == "t" ]]; then
    echo "Database has migration history. Running prisma migrate deploy..."
    if sudo docker compose exec -T app npm run prisma:migrate; then
      echo "Migrations applied successfully."
    else
      echo "Migration failed. If this is the first time using migrations on an existing database,"
      echo "you may need to baseline it first. Run: ./scripts/baseline-migration.sh"
      exit 1
    fi
  else
    echo "Database exists but has no migration history. Attempting to baseline..."
    # Try to baseline the migration
    if sudo docker compose exec -T app npx prisma migrate resolve --applied 20250101000000_add_bonus_hunt_fields 2>/dev/null; then
      echo "Database baselined successfully. Running migrate deploy..."
      sudo docker compose exec -T app npm run prisma:migrate
    else
      echo "Failed to baseline. The database schema may not match the migration."
      echo "You can either:"
      echo "  1. Run: ./scripts/baseline-migration.sh (if schema already matches)"
      echo "  2. Or run: sudo docker compose exec app npm run prisma:push (to sync schema)"
      exit 1
    fi
  fi
fi

echo "Update complete."
