#!/usr/bin/env bash
set -euo pipefail

git pull
sudo docker compose build
sudo docker compose up -d
sudo docker compose exec app npm run prisma:migrate

echo "Update complete."
