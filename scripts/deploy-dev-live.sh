#!/bin/bash

set -e

echo "=== Deploying Tejo Nails Platform in Development Mode (Live Changes) ==="
echo ""

# Step 1: Stop any existing services
echo "Step 1: Stopping existing services..."
./scripts/stop-services.sh
sudo docker-compose down 2>/dev/null || true
echo ""

# Step 2: Setup SSL certificates if needed
echo "Step 2: Checking SSL certificates..."
if [ ! -f "/etc/nginx/ssl/fullchain.pem" ]; then
    ./scripts/setup-ssl.sh
else
    echo "✓ SSL certificates already exist"
fi
echo ""

# Step 3: Start development services with live reload
echo "Step 3: Starting development services with live reload..."

# Install dependencies if needed
if [ ! -d "frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

if [ ! -d "backend/node_modules" ]; then
    echo "Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

# Start services in development mode but accessible via domain
echo "Starting development services..."

# Start backend in development mode
cd backend
npm run start:dev &
BACKEND_PID=$!
cd ..

# Wait for backend to be ready
echo "Waiting for backend to start..."
sleep 10

# Start frontend in development mode
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Wait for frontend to be ready
echo "Waiting for frontend to start..."
sleep 5

# Start nginx proxy
echo "Starting nginx proxy..."
sudo docker-compose up -d nginx

echo ""
echo "Step 4: Testing development deployment..."

# Test the deployment
sleep 5

# Test HTTPS
HTTPS_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -k https://tejo-nails.com || echo "000")
if [ "$HTTPS_RESPONSE" = "200" ]; then
    echo "✓ HTTPS working"
else
    echo "⚠ HTTPS test: $HTTPS_RESPONSE"
fi

# Test API
API_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -k https://tejo-nails.com/api/system-health || echo "000")
if [ "$API_RESPONSE" = "200" ]; then
    echo "✓ API working"
else
    echo "⚠ API test: $API_RESPONSE"
fi

echo ""
echo "=== Development Deployment Summary ==="
echo "🌐 Website: https://tejo-nails.com (with live reload)"
echo "🔧 API: https://tejo-nails.com/api (with live reload)"
echo "📚 API Docs: https://tejo-nails.com/api/docs"
echo "💚 Health Check: https://tejo-nails.com/api/system-health"
echo ""
echo "Process IDs:"
echo "Frontend PID: $FRONTEND_PID"
echo "Backend PID: $BACKEND_PID"
echo ""
echo "🎉 Development deployment completed!"
echo "Your platform is live with hot reload - changes will be visible immediately!"
echo ""
echo "To stop services, run:"
echo "kill $FRONTEND_PID $BACKEND_PID && sudo docker-compose down"