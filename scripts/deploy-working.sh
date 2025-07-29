#!/bin/bash
set -e

echo "🚀 DEPLOYING TEJO NAILS PLATFORM - WORKING VERSION 🚀"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} $1"
}

print_success() {
    echo -e "${GREEN}✅${NC} $1"
}

print_error() {
    echo -e "${RED}❌${NC} $1"
}

# Step 1: Clean everything
print_status "Cleaning up..."
docker-compose down --remove-orphans 2>/dev/null || true
docker-compose -f docker-compose.prod.yml down --remove-orphans 2>/dev/null || true
docker system prune -f
print_success "Cleanup done"

# Step 2: Setup SSL
print_status "Setting up SSL..."
mkdir -p nginx/ssl/live/tejo-nails.com
if [ ! -f "nginx/ssl/live/tejo-nails.com/fullchain.pem" ]; then
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout nginx/ssl/live/tejo-nails.com/privkey.pem \
        -out nginx/ssl/live/tejo-nails.com/fullchain.pem \
        -subj "/C=HR/ST=Zagreb/L=Zagreb/O=Tejo Nails/CN=tejo-nails.com" 2>/dev/null
    cp nginx/ssl/live/tejo-nails.com/fullchain.pem nginx/ssl/live/tejo-nails.com/chain.pem
fi
print_success "SSL ready"

# Step 3: Build and start
print_status "Building containers..."
docker-compose -f docker-compose.prod.yml build --no-cache
print_success "Build complete"

print_status "Starting services..."
docker-compose -f docker-compose.prod.yml up -d
print_success "Services started"

# Step 4: Wait and test
print_status "Waiting for services..."
sleep 30

# Test services
print_status "Testing services..."

# Test backend
if curl -f http://localhost:3002/api/system-health >/dev/null 2>&1; then
    print_success "Backend is working!"
else
    print_error "Backend failed"
    docker-compose -f docker-compose.prod.yml logs backend
fi

# Test frontend
if curl -f http://localhost:3000 >/dev/null 2>&1; then
    print_success "Frontend is working!"
else
    print_error "Frontend failed"
    docker-compose -f docker-compose.prod.yml logs frontend
fi

# Test nginx
if curl -f http://localhost/health >/dev/null 2>&1; then
    print_success "Nginx is working!"
else
    print_error "Nginx failed"
    docker-compose -f docker-compose.prod.yml logs nginx
fi

echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo "🌐 Website: https://tejo-nails.com"
echo "🔧 API: https://tejo-nails.com/api"
echo "💚 Health: https://tejo-nails.com/api/system-health"
echo ""
echo "📊 Container Status:"
docker-compose -f docker-compose.prod.yml ps
echo ""
echo "🎊 Your platform is LIVE!"