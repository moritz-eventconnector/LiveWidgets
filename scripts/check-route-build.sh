#!/usr/bin/env bash
set -euo pipefail

echo "=========================================="
echo "Route Build Verification"
echo "=========================================="
echo ""

echo "1. Checking if bonus-hunts route file exists in container..."
echo "----------------------------------------"
docker compose exec app ls -la app/api/bonus-hunts/route.ts 2>&1 || echo "Route file not found"
echo ""

echo "2. Checking if bonus-hunts route is in build output..."
echo "----------------------------------------"
docker compose exec app ls -la .next/server/app/api/bonus-hunts/route.js 2>&1 || echo "Route not in build"
echo ""

echo "3. Checking if workspace-settings route is in build (for comparison)..."
echo "----------------------------------------"
docker compose exec app ls -la .next/server/app/api/workspace-settings/route.js 2>&1 || echo "Comparison route not found"
echo ""

echo "4. Checking app-paths-manifest for bonus-hunts..."
echo "----------------------------------------"
docker compose exec app cat .next/server/app-paths-manifest.json 2>&1 | grep -i "bonus-hunts" || echo "Route not in app-paths-manifest"
echo ""

echo "5. Checking routes-manifest for bonus-hunts..."
echo "----------------------------------------"
docker compose exec app cat .next/routes-manifest.json 2>&1 | grep -i "bonus-hunts" || echo "Route not in routes-manifest (THIS IS THE PROBLEM)"
echo ""

echo "6. Checking routes-manifest for workspace-settings (for comparison)..."
echo "----------------------------------------"
docker compose exec app cat .next/routes-manifest.json 2>&1 | grep -i "workspace-settings" || echo "Comparison route not in routes-manifest"
echo ""

echo "7. Checking if route.js file has correct exports..."
echo "----------------------------------------"
if docker compose exec app test -f .next/server/app/api/bonus-hunts/route.js 2>/dev/null; then
  docker compose exec app node -e "
    try {
      const route = require('./.next/server/app/api/bonus-hunts/route.js');
      console.log('Route module loaded successfully');
      console.log('Has routeModule:', typeof route.routeModule !== 'undefined');
      console.log('All exports:', Object.keys(route).join(', '));
    } catch (error) {
      console.error('Error:', error.message);
    }
  " 2>&1
else
  echo "Route.js file not found"
fi
echo ""

echo "=========================================="
echo "Verification complete"
echo "=========================================="

