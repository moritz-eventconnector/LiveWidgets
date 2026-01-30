#!/usr/bin/env bash
set -euo pipefail

echo "=========================================="
echo "Route Check Script"
echo "=========================================="
echo ""

echo "1. Checking if route is in routes-manifest.json..."
echo "----------------------------------------"
docker compose exec app cat .next/routes-manifest.json 2>&1 | grep -i "bonus-hunt" || echo "Route not in routes-manifest"
echo ""

echo "2. Checking if route is in app-paths-manifest.json..."
echo "----------------------------------------"
docker compose exec app cat .next/server/app-paths-manifest.json 2>&1 | grep -i "bonus-hunt" || echo "Route not in app-paths-manifest"
echo ""

echo "3. Checking Next.js server process..."
echo "----------------------------------------"
docker compose exec app ps aux | grep -i "next\|node" | head -5 || echo "No Next.js process found"
echo ""

echo "4. Checking if Next.js server needs restart..."
echo "----------------------------------------"
echo "If the route is in app-paths-manifest but not in routes-manifest,"
echo "Next.js might need to be restarted to pick up the route."
echo ""

echo "5. Testing route directly..."
echo "----------------------------------------"
docker compose exec app curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/bonus-hunt 2>&1 || echo "Could not test route"
echo ""

echo "=========================================="
echo "Check complete"
echo "=========================================="
echo ""
echo "If the route is in app-paths-manifest but returns 404,"
echo "try restarting the Next.js server:"
echo "  docker compose restart app"

