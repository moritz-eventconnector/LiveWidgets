#!/usr/bin/env bash
set -euo pipefail

echo "=========================================="
echo "Route Diagnosis Script"
echo "=========================================="
echo ""

echo "1. Checking if route file exists in container..."
echo "----------------------------------------"
docker compose exec app ls -la app/api/bonus-hunt/route.ts 2>&1 || echo "File not found in container"
echo ""

echo "2. Checking if route is in build output..."
echo "----------------------------------------"
docker compose exec app ls -la .next/server/app/api/bonus-hunt/ 2>&1 || echo "Route not found in build"
echo ""

echo "3. Checking route.js content (first 50 lines)..."
echo "----------------------------------------"
docker compose exec app head -50 .next/server/app/api/bonus-hunt/route.js 2>&1 || echo "Could not read route.js"
echo ""

echo "4. Checking for route exports in built file..."
echo "----------------------------------------"
docker compose exec app grep -n "export.*GET\|export.*POST" .next/server/app/api/bonus-hunt/route.js 2>&1 || echo "No exports found"
echo ""

echo "5. Checking Next.js runtime logs (last 50 lines)..."
echo "----------------------------------------"
docker compose logs app --tail 50 2>&1 | grep -i "bonus-hunt\|route\|error\|404" || echo "No relevant logs found"
echo ""

echo "6. Checking for TypeScript/build errors..."
echo "----------------------------------------"
docker compose logs app 2>&1 | grep -i "error\|failed\|typescript" | tail -20 || echo "No errors found"
echo ""

echo "7. Testing route directly in container..."
echo "----------------------------------------"
docker compose exec app node -e "
try {
  const route = require('./.next/server/app/api/bonus-hunt/route.js');
  console.log('Route module loaded successfully');
  console.log('GET export:', typeof route.GET);
  console.log('POST export:', typeof route.POST);
  console.log('All exports:', Object.keys(route));
} catch (error) {
  console.error('Error loading route:', error.message);
  console.error('Stack:', error.stack);
}
" 2>&1 || echo "Could not test route module"
echo ""

echo "8. Checking middleware configuration..."
echo "----------------------------------------"
docker compose exec app cat middleware.ts 2>&1 | grep -A 5 -B 5 "api" || echo "Could not read middleware"
echo ""

echo "9. Checking if workspace-settings route works (for comparison)..."
echo "----------------------------------------"
docker compose exec app ls -la .next/server/app/api/workspace-settings/ 2>&1 || echo "Comparison route not found"
echo ""

echo "10. Checking Next.js route manifest..."
echo "----------------------------------------"
docker compose exec app cat .next/routes-manifest.json 2>&1 | grep -i "bonus" || echo "Route not in manifest or file not found"
echo ""

echo "11. Checking app directory structure..."
echo "----------------------------------------"
docker compose exec app find app/api -name "*.ts" -o -name "*.js" 2>&1 | head -20 || echo "Could not list API routes"
echo ""

echo "12. Checking for route registration in Next.js..."
echo "----------------------------------------"
docker compose exec app cat .next/server/app-paths-manifest.json 2>&1 | grep -i "bonus" || echo "Route not in app-paths-manifest"
echo ""

echo "=========================================="
echo "Diagnosis complete"
echo "=========================================="

