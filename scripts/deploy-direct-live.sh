#!/bin/bash

set -e

echo "=== Deploying Tejo Nails Platform Live with Direct DNS ==="
echo ""

# Step 1: Stop any existing services
echo "Step 1: Stopping existing services..."
./scripts/stop-services.sh
sudo systemctl stop nginx 2>/dev/null || true
sudo docker-compose down 2>/dev/null || true
echo ""

# Step 2: Setup SSL certificates
echo "Step 2: Setting up SSL certificates..."
if [ ! -f "/etc/nginx/ssl/fullchain.pem" ]; then
    ./scripts/setup-ssl.sh
else
    echo "✓ SSL certificates already exist"
fi
echo ""

# Step 3: Configure nginx with direct SSL
echo "Step 3: Configuring nginx..."
sudo cp nginx/nginx-direct.conf /etc/nginx/nginx.conf

# Test nginx configuration
sudo nginx -t
if [ $? -ne 0 ]; then
    echo "✗ Nginx configuration test failed"
    exit 1
fi

echo "✓ Nginx configuration is valid"
echo ""

# Step 4: Start development services with live reload
echo "Step 4: Starting development services with live reload..."

# Install dependencies if needed
if [ ! -d "frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

if [ ! -d "backend/node_modules" ]; then
    echo "Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

# Start backend in development mode
echo "Starting backend..."
cd backend
npm run start:dev &
BACKEND_PID=$!
cd ..

# Wait for backend to be ready
echo "Waiting for backend to start..."
sleep 10

# Start frontend in development mode
echo "Starting frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Wait for frontend to be ready
echo "Waiting for frontend to start..."
sleep 5

# Start nginx
echo "Starting nginx..."
sudo systemctl start nginx
sudo systemctl enable nginx

echo ""
echo "Step 5: Testing deployment..."

# Test local services
sleep 5

# Test backend directly
BACKEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3002/api/system-health || echo "000")
if [ "$BACKEND_RESPONSE" = "200" ]; then
    echo "✓ Backend service working"
else
    echo "✗ Backend service test: $BACKEND_RESPONSE"
fi

# Test frontend directly
FRONTEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 || echo "000")
if [ "$FRONTEND_RESPONSE" = "200" ]; then
    echo "✓ Frontend service working"
else
    echo "✗ Frontend service test: $FRONTEND_RESPONSE"
fi

# Test nginx proxy
NGINX_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -k https://localhost/api/system-health || echo "000")
if [ "$NGINX_RESPONSE" = "200" ]; then
    echo "✓ Nginx proxy working"
else
    echo "✗ Nginx proxy test: $NGINX_RESPONSE"
fi

# Test domain (if accessible)
DOMAIN_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -k https://tejo-nails.com || echo "000")
if [ "$DOMAIN_RESPONSE" = "200" ]; then
    echo "✓ Domain working"
else
    echo "⚠ Domain test: $DOMAIN_RESPONSE (may take time to propagate)"
fi

echo ""
echo "=== Deployment Summary ==="
echo "🌐 Website: https://tejo-nails.com"
echo "🔧 API: https://tejo-nails.com/api"
echo "📚 API Docs: https://tejo-nails.com/api/docs"
echo "💚 Health Check: https://tejo-nails.com/api/system-health"
echo ""
echo "Local access:"
echo "🏠 Frontend: http://localhost:3000"
echo "🏠 Backend: http://localhost:3002"
echo "🏠 Via Nginx: https://localhost"
echo ""
echo "Process IDs:"
echo "Frontend PID: $FRONTEND_PID"
echo "Backend PID: $BACKEND_PID"
echo ""
echo "🎉 Live deployment completed!"
echo "Your platform is live with hot reload - changes will be visible immediately!"
echo ""
echo "To stop services, run:"
echo "kill $FRONTEND_PID $BACKEND_PID && sudo systemctl stop nginx"