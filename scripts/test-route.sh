#!/usr/bin/env bash
set -euo pipefail

echo "=========================================="
echo "Route Test Script"
echo "=========================================="
echo ""

echo "1. Testing bonus-hunts route via Node.js..."
echo "----------------------------------------"
docker compose exec app node -e "
const http = require('http');
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/bonus-hunts',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', JSON.stringify(res.headers, null, 2));
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data.substring(0, 200));
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
});

req.end();
" 2>&1 || echo "Could not test route"
echo ""

echo "2. Testing workspace-settings route for comparison..."
echo "----------------------------------------"
docker compose exec app node -e "
const http = require('http');
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/workspace-settings',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', JSON.stringify(res.headers, null, 2));
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data.substring(0, 200));
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
});

req.end();
" 2>&1 || echo "Could not test route"
echo ""

echo "3. Checking Next.js server logs for route access..."
echo "----------------------------------------"
docker compose logs app --tail 20 2>&1 | grep -i "bonus-hunts\|workspace-settings\|404\|error" || echo "No relevant logs found"
echo ""

echo "=========================================="
echo "Test complete"
echo "=========================================="

