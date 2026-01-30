#!/usr/bin/env bash
set -euo pipefail

echo "=========================================="
echo "Direct Route Test"
echo "=========================================="
echo ""

echo "1. Testing bonus-hunts route with authentication cookie..."
echo "----------------------------------------"
# Get a session cookie from the browser request
COOKIE="__Secure-next-auth.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..XbgS1EV_aqQxtE_0.pCmJyFZ2NKb8_p7jFlODkmmhxU9LD01FHKVuwdawavpi70o4FYexyKKEzdEQ8-b2GOxo7PrrLhE2jWE5QrWN51bPEHLhtf2AEN_CuOXpj6rY8nSdePqq5sdh43OGS28MMkrVXIFqWsBRgaWHsc6CZtSATpws05r-Dk2SVyaetE6lHK5DQxRXHyn5jeJzVLLLJMfc9o6VMe5DpZ32U8TKfYFpGW5xc3gIy9X4hDsp_U2Y2qhXpA9bxfka-NStrbDjC625wvNuSrkkXUs0YHzA.BUjYbBGWkicHrlyICqZH3g"

docker compose exec app node -e "
const http = require('http');
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/bonus-hunts',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Cookie': '${COOKIE}'
  }
};

const req = http.request(options, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Status Message:', res.statusMessage);
  console.log('Headers:', JSON.stringify(res.headers, null, 2));
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data.substring(0, 500));
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
});

req.end();
" 2>&1 || echo "Could not test route"
echo ""

echo "2. Checking Next.js route handler registration..."
echo "----------------------------------------"
docker compose exec app node -e "
try {
  const fs = require('fs');
  const manifest = JSON.parse(fs.readFileSync('.next/server/app-paths-manifest.json', 'utf8'));
  const route = Object.keys(manifest).find(key => key.includes('bonus-hunts'));
  if (route) {
    console.log('Route found in manifest:', route);
    console.log('Route file:', manifest[route]);
    const routeFile = manifest[route];
    if (fs.existsSync(routeFile)) {
      console.log('Route file exists:', routeFile);
      const stats = fs.statSync(routeFile);
      console.log('Route file size:', stats.size, 'bytes');
      console.log('Route file modified:', stats.mtime);
    } else {
      console.log('Route file NOT found:', routeFile);
    }
  } else {
    console.log('Route NOT found in manifest');
  }
} catch (error) {
  console.error('Error:', error.message);
}
" 2>&1
echo ""

echo "3. Checking if route is accessible via Next.js internal routing..."
echo "----------------------------------------"
docker compose exec app node -e "
try {
  // Try to require the route module directly
  const route = require('./.next/server/app/api/bonus-hunts/route.js');
  console.log('Route module loaded successfully');
  console.log('Has routeModule:', typeof route.routeModule !== 'undefined');
  if (route.routeModule) {
    console.log('Route module definition:', JSON.stringify(route.routeModule.definition, null, 2).substring(0, 500));
  }
} catch (error) {
  console.error('Error loading route:', error.message);
  console.error('Stack:', error.stack);
}
" 2>&1
echo ""

echo "=========================================="
echo "Test complete"
echo "=========================================="

