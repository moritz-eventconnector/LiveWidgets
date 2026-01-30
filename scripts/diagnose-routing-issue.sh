#!/usr/bin/env bash
set -euo pipefail

echo "=========================================="
echo "Comprehensive Route Diagnosis"
echo "=========================================="
echo ""

echo "1. Checking if OLD route file exists in container..."
echo "----------------------------------------"
docker compose exec app ls -la app/api/bonus-hunt/route.ts 2>&1 || echo "OLD route file not found (GOOD)"
echo ""

echo "2. Checking if NEW route file exists in container..."
echo "----------------------------------------"
docker compose exec app ls -la app/api/bonus-hunts/route.ts 2>&1 || echo "NEW route file not found (BAD)"
echo ""

echo "3. Checking OLD route in build output..."
echo "----------------------------------------"
docker compose exec app ls -la .next/server/app/api/bonus-hunt/route.js 2>&1 || echo "OLD route not in build"
echo ""

echo "4. Checking NEW route in build output..."
echo "----------------------------------------"
docker compose exec app ls -la .next/server/app/api/bonus-hunts/route.js 2>&1 || echo "NEW route not in build"
echo ""

echo "5. Checking app-paths-manifest for OLD route..."
echo "----------------------------------------"
docker compose exec app cat .next/server/app-paths-manifest.json 2>&1 | grep -i "\"bonus-hunt/route\"" || echo "OLD route not in app-paths-manifest"
echo ""

echo "6. Checking app-paths-manifest for NEW route..."
echo "----------------------------------------"
docker compose exec app cat .next/server/app-paths-manifest.json 2>&1 | grep -i "\"bonus-hunts/route\"" || echo "NEW route not in app-paths-manifest"
echo ""

echo "7. Checking routes-manifest for OLD route..."
echo "----------------------------------------"
docker compose exec app cat .next/routes-manifest.json 2>&1 | grep -i "bonus-hunt" | grep -v "\[id\]" | grep -v "overlay" || echo "OLD route not in routes-manifest"
echo ""

echo "8. Checking routes-manifest for NEW route..."
echo "----------------------------------------"
docker compose exec app cat .next/routes-manifest.json 2>&1 | grep -i "bonus-hunts" || echo "NEW route not in routes-manifest"
echo ""

echo "9. Checking git status on server..."
echo "----------------------------------------"
docker compose exec app git status --short 2>&1 | head -10 || echo "Could not check git status"
echo ""

echo "10. Checking last commit on server..."
echo "----------------------------------------"
docker compose exec app git log --oneline -1 2>&1 || echo "Could not check git log"
echo ""

echo "11. Checking if app/api/bonus-hunts directory exists..."
echo "----------------------------------------"
docker compose exec app ls -la app/api/ 2>&1 | grep -i "bonus" || echo "Could not list API directories"
echo ""

echo "12. Checking build timestamp..."
echo "----------------------------------------"
docker compose exec app stat -c "%y" .next/server/app-paths-manifest.json 2>&1 || echo "Could not check build timestamp"
echo ""

echo "=========================================="
echo "Diagnosis complete"
echo "=========================================="
echo ""
echo "If NEW route file doesn't exist:"
echo "  - Run: git pull"
echo "  - Run: ./scripts/update.sh --clean"
echo ""
echo "If NEW route file exists but not in build:"
echo "  - The build might be stale"
echo "  - Run: ./scripts/update.sh --clean"
echo ""
echo "If NEW route is in app-paths-manifest but not in routes-manifest:"
echo "  - This is the routing bug we're trying to fix"
echo "  - The route structure might need to be changed"

