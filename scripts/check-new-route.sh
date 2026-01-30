#!/usr/bin/env bash
set -euo pipefail

echo "=========================================="
echo "New Route Check Script"
echo "=========================================="
echo ""

echo "1. Checking if new route file exists in container..."
echo "----------------------------------------"
docker compose exec app ls -la app/api/bonus-hunts/route.ts 2>&1 || echo "File not found in container"
echo ""

echo "2. Checking if new route is in build output..."
echo "----------------------------------------"
docker compose exec app ls -la .next/server/app/api/bonus-hunts/ 2>&1 || echo "Route not found in build"
echo ""

echo "3. Checking if new route is in app-paths-manifest.json..."
echo "----------------------------------------"
docker compose exec app cat .next/server/app-paths-manifest.json 2>&1 | grep -i "bonus-hunts" || echo "Route not in app-paths-manifest"
echo ""

echo "4. Checking if new route is in routes-manifest.json..."
echo "----------------------------------------"
docker compose exec app cat .next/routes-manifest.json 2>&1 | grep -i "bonus-hunts" || echo "Route not in routes-manifest"
echo ""

echo "5. Checking git status on server..."
echo "----------------------------------------"
docker compose exec app git status --short 2>&1 | head -10 || echo "Could not check git status"
echo ""

echo "=========================================="
echo "Check complete"
echo "=========================================="
echo ""
echo "If the route file doesn't exist in the container,"
echo "you need to commit and push your changes, then run:"
echo "  git pull"
echo "  ./scripts/update.sh --clean"

