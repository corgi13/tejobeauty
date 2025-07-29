#!/bin/bash

set -e

echo "=== Starting Tejo Nails Platform (Development with Hot Reload) ==="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Step 1: Stop any existing services
print_status "Step 1: Stopping existing services..."
./scripts/stop-services.sh
docker-compose -f docker-compose.yml -f docker-compose.dev.yml down --remove-orphans 2>/dev/null || true
print_success "Existing services stopped"
echo ""

# Step 2: Clean up old containers and volumes if requested
if [ "$1" = "--clean" ]; then
    print_status "Step 2: Cleaning up old containers and volumes..."
    docker system prune -f
    docker volume prune -f
    print_success "Cleanup completed"
    echo ""
fi

# Step 3: Build and start services
print_status "Step 3: Building and starting development services..."
docker-compose -f docker-compose.yml -f docker-compose.dev.yml build --parallel
print_success "Services built successfully"
echo ""

print_status "Starting services with hot reload enabled..."
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
echo ""

# Step 4: Wait for services to be healthy
print_status "Step 4: Waiting for services to be healthy..."

# Function to check service health
check_service_health() {
    local service_name=$1
    local health_url=$2
    local max_attempts=30
    local attempt=1
    
    print_status "Checking $service_name health..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s -f "$health_url" > /dev/null 2>&1; then
            print_success "$service_name is healthy"
            return 0
        fi
        
        if [ $((attempt % 5)) -eq 0 ]; then
            print_status "Waiting for $service_name... (attempt $attempt/$max_attempts)"
        fi
        
        sleep 2
        attempt=$((attempt + 1))
    done
    
    print_error "$service_name failed to become healthy"
    return 1
}

# Wait for database
print_status "Waiting for PostgreSQL..."
sleep 10
if docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec -T postgres pg_isready -U postgres -d tejo_nails_dev > /dev/null 2>&1; then
    print_success "PostgreSQL is ready"
else
    print_warning "PostgreSQL may still be starting up"
fi

# Wait for Redis
print_status "Waiting for Redis..."
if docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec -T redis redis-cli -a redis123 ping > /dev/null 2>&1; then
    print_success "Redis is ready"
else
    print_warning "Redis may still be starting up"
fi

# Wait for backend
check_service_health "Backend API" "http://localhost:3002/api/system-health"

# Wait for frontend
check_service_health "Frontend" "http://localhost:3000/api/health"

# Wait for nginx
check_service_health "Nginx Proxy" "http://localhost/health"

echo ""

# Step 5: Run database migrations and seeding
print_status "Step 5: Setting up database..."
print_status "Running database migrations..."
if docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec -T backend npx prisma migrate dev --name development-setup; then
    print_success "Database migrations completed"
else
    print_warning "Database migrations may have already been applied"
fi

print_status "Seeding database with development data..."
if docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec -T backend npx prisma db seed; then
    print_success "Database seeding completed"
else
    print_warning "Database seeding completed or failed (this is normal if data already exists)"
fi

echo ""

# Step 6: Test all endpoints
print_status "Step 6: Testing all services..."

# Test backend health
BACKEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3002/api/system-health || echo "000")
if [ "$BACKEND_HEALTH" = "200" ]; then
    print_success "Backend API is healthy (HTTP $BACKEND_HEALTH)"
else
    print_error "Backend API test failed (HTTP $BACKEND_HEALTH)"
fi

# Test frontend
FRONTEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 || echo "000")
if [ "$FRONTEND_HEALTH" = "200" ]; then
    print_success "Frontend is healthy (HTTP $FRONTEND_HEALTH)"
else
    print_error "Frontend test failed (HTTP $FRONTEND_HEALTH)"
fi

# Test nginx proxy
NGINX_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/health || echo "000")
if [ "$NGINX_HEALTH" = "200" ]; then
    print_success "Nginx proxy is healthy (HTTP $NGINX_HEALTH)"
else
    print_error "Nginx proxy test failed (HTTP $NGINX_HEALTH)"
fi

# Test domain (if accessible)
DOMAIN_HTTP=$(curl -s -o /dev/null -w "%{http_code}" http://tejo-nails.com/health 2>/dev/null || echo "000")
DOMAIN_HTTPS=$(curl -s -o /dev/null -w "%{http_code}" -k https://tejo-nails.com/health 2>/dev/null || echo "000")

if [ "$DOMAIN_HTTP" = "301" ] && [ "$DOMAIN_HTTPS" = "200" ]; then
    print_success "Domain is working (HTTP redirects to HTTPS)"
elif [ "$DOMAIN_HTTPS" = "200" ]; then
    print_success "Domain HTTPS is working"
elif [ "$DOMAIN_HTTP" = "200" ]; then
    print_warning "Domain HTTP is working (HTTPS may need setup)"
else
    print_warning "Domain test: HTTP=$DOMAIN_HTTP, HTTPS=$DOMAIN_HTTPS (may need DNS/firewall configuration)"
fi

echo ""

# Step 7: Display development information
print_status "Step 7: Development environment ready!"
echo ""
echo "=== Development Environment Summary ==="
echo "🌐 Website: https://tejo-nails.com"
echo "🔧 API: https://tejo-nails.com/api"
echo "📚 API Docs: https://tejo-nails.com/api/docs"
echo "💚 Health Check: https://tejo-nails.com/api/system-health"
echo ""
echo "=== Local Access ==="
echo "🖥️  Frontend: http://localhost:3000"
echo "⚙️  Backend: http://localhost:3002"
echo "🗄️  Database: localhost:5432 (postgres/postgres123)"
echo "🔄 Redis: localhost:6379 (password: redis123)"
echo "🌐 Nginx: http://localhost"
echo ""
echo "=== Hot Reload Features ==="
echo "🔥 Frontend: Changes appear instantly in browser"
echo "🔥 Backend: API restarts automatically on code changes"
echo "🔥 Database: Migrations run automatically on schema changes"
echo "🔥 Nginx: Configuration reloads on changes"
echo ""
echo "=== Development Commands ==="
echo "📊 View logs: docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f [service]"
echo "🔧 Run migrations: docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec backend npx prisma migrate dev"
echo "🌱 Seed database: docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec backend npx prisma db seed"
echo "🛑 Stop services: docker-compose -f docker-compose.yml -f docker-compose.dev.yml down"
echo "🔄 Restart service: docker-compose -f docker-compose.yml -f docker-compose.dev.yml restart [service]"
echo ""
echo "=== File Watching ==="
echo "📁 Frontend files: ./frontend/ (auto-reload enabled)"
echo "📁 Backend files: ./backend/ (auto-restart enabled)"
echo "📁 Database schema: ./backend/prisma/ (auto-migrate enabled)"
echo ""

# Step 8: Start log monitoring in background
print_status "Step 8: Starting log monitoring..."
echo "💡 Tip: Press Ctrl+C to stop log monitoring (services will continue running)"
echo "📋 Logs from all services:"
echo ""

# Follow logs from all services
docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f --tail=50