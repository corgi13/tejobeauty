#!/bin/bash
# api-test.sh - Test API integration between frontend and backend

echo "🧪 Testing API Integration"

# Check if backend is running
echo "Checking backend health..."
BACKEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3002/api/system-health)

if [ "$BACKEND_HEALTH" == "200" ]; then
  echo "✅ Backend is healthy"
else
  echo "❌ Backend is not responding correctly (Status: $BACKEND_HEALTH)"
  echo "Starting backend in development mode..."
  cd backend && npm run start:dev &
  sleep 10
fi

# Test authentication endpoints
echo "Testing authentication endpoints..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tejonails.com","password":"admin123"}')

if [[ $LOGIN_RESPONSE == *"accessToken"* ]]; then
  echo "✅ Authentication endpoint working"
  # Extract token for further tests
  TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
else
  echo "❌ Authentication endpoint failed"
fi

# Test products endpoint
echo "Testing products endpoint..."
PRODUCTS_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3002/api/products)

if [ "$PRODUCTS_RESPONSE" == "200" ]; then
  echo "✅ Products endpoint working"
else
  echo "❌ Products endpoint failed (Status: $PRODUCTS_RESPONSE)"
fi

# Test orders endpoint (requires authentication)
if [ ! -z "$TOKEN" ]; then
  echo "Testing orders endpoint (authenticated)..."
  ORDERS_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
    -H "Authorization: Bearer $TOKEN" \
    http://localhost:3002/api/orders)
  
  if [ "$ORDERS_RESPONSE" == "200" ]; then
    echo "✅ Orders endpoint working"
  else
    echo "❌ Orders endpoint failed (Status: $ORDERS_RESPONSE)"
  fi
fi

echo "API integration test completed!"