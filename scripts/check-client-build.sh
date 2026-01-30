#!/usr/bin/env bash
set -euo pipefail

echo "=========================================="
echo "Client Build Check"
echo "=========================================="
echo ""

echo "1. Checking client build files..."
echo "----------------------------------------"
docker compose exec app find .next/static/chunks -name "page-*.js" -type f | head -5 || echo "No client build files found"
echo ""

echo "2. Checking build timestamp..."
echo "----------------------------------------"
docker compose exec app stat -c "%y" .next/BUILD_ID 2>&1 || echo "No BUILD_ID found"
echo ""

echo "3. Checking if bonus-hunts is in client build..."
echo "----------------------------------------"
docker compose exec app grep -r "bonus-hunts" .next/static/chunks --include="*.js" | head -3 || echo "Route not found in client build"
echo ""

echo "4. Checking if bonus-hunt (old) is still in client build..."
echo "----------------------------------------"
docker compose exec app grep -r "/api/bonus-hunt\"" .next/static/chunks --include="*.js" | head -3 || echo "Old route not found (GOOD)"
echo ""

echo "5. Checking BUILD_ID..."
echo "----------------------------------------"
docker compose exec app cat .next/BUILD_ID 2>&1 || echo "No BUILD_ID"
echo ""

echo "=========================================="
echo "Check complete"
echo "=========================================="
echo ""
echo "If the build is old, run: ./scripts/update.sh --clean"
echo "Then clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)"

