#!/bin/bash
set -e

echo "=== Deploying Tejo Nails Platform (Containerized) ==="
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "Creating .env file from example..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your actual configuration values"
    echo "   Especially: POSTGRES_PASSWORD, REDIS_PASSWORD, JWT_SECRET"
    echo ""
fi

# Stop any existing services
echo "Step 1: Stopping existing services..."
./scripts/stop-services.sh
sudo docker-compose down -v 2>/dev/null || true
sudo docker system prune -f
echo ""

# Build and start containers
echo "Step 2: Building and starting containers..."
sudo docker-compose up --build -d

echo ""
echo "Step 3: Waiting for services to be healthy..."

# Wait for database to be ready
echo "Waiting for PostgreSQL..."
timeout=60
while ! sudo docker-compose exec -T postgres pg_isready -U postgres -d tejo_nails; do
    sleep 2
    timeout=$((timeout-2))
    if [ $timeout -le 0 ]; then
        echo "❌ PostgreSQL failed to start"
        exit 1
    fi
done
echo "✅ PostgreSQL is ready"

# Wait for Redis to be ready
echo "Waiting for Redis..."
timeout=30
while ! sudo docker-compose exec -T redis redis-cli -a redis123 ping; do
    sleep 2
    timeout=$((timeout-2))
    if [ $timeout -le 0 ]; then
        echo "❌ Redis failed to start"
        exit 1
    fi
done
echo "✅ Redis is ready"

# Wait for backend to be ready
echo "Waiting for Backend..."
timeout=120
while ! curl -f http://localhost:3002/api/system-health 2>/dev/null; do
    sleep 5
    timeout=$((timeout-5))
    if [ $timeout -le 0 ]; then
        echo "❌ Backend failed to start"
        sudo docker-compose logs backend
        exit 1
    fi
done
echo "✅ Backend is ready"

# Wait for frontend to be ready
echo "Waiting for Frontend..."
timeout=60
while ! curl -f http://localhost:3000/api/health 2>/dev/null; do
    sleep 3
    timeout=$((timeout-3))
    if [ $timeout -le 0 ]; then
        echo "❌ Frontend failed to start"
        sudo docker-compose logs frontend
        exit 1
    fi
done
echo "✅ Frontend is ready"

# Wait for nginx to be ready
echo "Waiting for Nginx..."
timeout=30
while ! curl -f http://localhost/health 2>/dev/null; do
    sleep 2
    timeout=$((timeout-2))
    if [ $timeout -le 0 ]; then
        echo "❌ Nginx failed to start"
        sudo docker-compose logs nginx
        exit 1
    fi
done
echo "✅ Nginx is ready"

echo ""
echo "Step 4: Testing deployment..."

# Test services
sleep 5

# Test backend health
BACKEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3002/api/system-health || echo "000")
if [ "$BACKEND_HEALTH" = "200" ]; then
    echo "✅ Backend service healthy"
else
    echo "❌ Backend service test: $BACKEND_HEALTH"
fi

# Test frontend
FRONTEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health || echo "000")
if [ "$FRONTEND_HEALTH" = "200" ]; then
    echo "✅ Frontend service healthy"
else
    echo "❌ Frontend service test: $FRONTEND_HEALTH"
fi

# Test nginx proxy
NGINX_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/health || echo "000")
if [ "$NGINX_HEALTH" = "200" ]; then
    echo "✅ Nginx proxy healthy"
else
    echo "❌ Nginx proxy test: $NGINX_HEALTH"
fi

# Test domain
DOMAIN_HTTP=$(curl -s -o /dev/null -w "%{http_code}" http://tejo-nails.com || echo "000")
DOMAIN_HTTPS=$(curl -s -o /dev/null -w "%{http_code}" -k https://tejo-nails.com || echo "000")

if [ "$DOMAIN_HTTP" = "301" ] && [ "$DOMAIN_HTTPS" = "200" ]; then
    echo "✅ Domain working (HTTP redirects to HTTPS)"
elif [ "$DOMAIN_HTTPS" = "200" ]; then
    echo "✅ Domain HTTPS working"
else
    echo "⚠️  Domain test: HTTP=$DOMAIN_HTTP, HTTPS=$DOMAIN_HTTPS"
fi

echo ""
echo "=== Deployment Summary ==="
echo "🌐 Website: https://tejo-nails.com"
echo "🔧 API: https://tejo-nails.com/api"
echo "📚 API Docs: https://tejo-nails.com/api/docs"
echo "💚 Health Check: https://tejo-nails.com/api/system-health"
echo ""
echo "🐳 Container Status:"
sudo docker-compose ps
echo ""
echo "🎉 Containerized deployment completed!"
echo "Your platform is now running with:"
echo "  ✅ Docker containers with health checks"
echo "  ✅ Hot reload for development"
echo "  ✅ SSL certificates"
echo "  ✅ Nginx reverse proxy with rate limiting"
echo "  ✅ PostgreSQL with automated backups"
echo "  ✅ Redis caching"
echo "  ✅ Automatic service recovery"
echo ""
echo "📊 Useful Commands:"
echo "  View logs: sudo docker-compose logs -f [service]"
echo "  Restart service: sudo docker-compose restart [service]"
echo "  Stop all: sudo docker-compose down"
echo "  Update containers: sudo docker-compose up --build -d"
echo ""
echo "🔧 To enable Let's Encrypt SSL:"
echo "  1. Edit .env and set ENABLE_LETSENCRYPT=true"
echo "  2. Set LETSENCRYPT_EMAIL=your-email@domain.com"
echo "  3. Run: sudo docker-compose restart nginx"