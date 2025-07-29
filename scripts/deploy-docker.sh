#!/bin/bash

# Tejo Nails Platform - Docker Deployment Script

set -e

echo "🚀 Starting Tejo Nails Platform deployment..."

# Check if Docker and Docker Compose are installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p nginx/ssl
mkdir -p monitoring/prometheus
mkdir -p monitoring/grafana/dashboards
mkdir -p monitoring/grafana/datasources

# Generate SSL certificates (self-signed for development)
if [ ! -f nginx/ssl/cert.pem ]; then
    echo "🔐 Generating SSL certificates..."
    openssl req -x509 -newkey rsa:4096 -keyout nginx/ssl/key.pem -out nginx/ssl/cert.pem -days 365 -nodes \
        -subj "/C=HR/ST=Zagreb/L=Zagreb/O=Tejo Nails/CN=138.199.226.201"
fi

# Create Prometheus configuration
cat > monitoring/prometheus.yml << EOF
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'backend'
    static_configs:
      - targets: ['backend:3001']
    metrics_path: '/api/metrics'
    
  - job_name: 'frontend'
    static_configs:
      - targets: ['frontend:3000']
    metrics_path: '/metrics'
    
  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres:5432']
      
  - job_name: 'redis'
    static_configs:
      - targets: ['redis:6379']
EOF

# Load environment variables
if [ -f .env.production ]; then
    echo "📋 Loading production environment variables..."
    export $(cat .env.production | grep -v '^#' | xargs)
else
    echo "⚠️  .env.production file not found. Using default values."
fi

# Build and start services
echo "🏗️  Building and starting services..."
docker-compose -f docker-compose.prod.yml down --remove-orphans
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Run database migrations
echo "🗄️  Running database migrations..."
docker-compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy
docker-compose -f docker-compose.prod.yml exec backend npx prisma generate

# Check service health
echo "🏥 Checking service health..."
services=("postgres" "redis" "backend" "frontend" "nginx")

for service in "${services[@]}"; do
    if docker-compose -f docker-compose.prod.yml ps $service | grep -q "Up"; then
        echo "✅ $service is running"
    else
        echo "❌ $service is not running"
        docker-compose -f docker-compose.prod.yml logs $service
    fi
done

# Display service URLs
echo ""
echo "🎉 Deployment completed!"
echo ""
echo "📊 Service URLs:"
echo "   Frontend:    https://138.199.226.201"
echo "   Backend API: https://138.199.226.201/api"
echo "   API Docs:    https://138.199.226.201/api/docs"
echo "   Grafana:     http://138.199.226.201:3001 (admin/admin123)"
echo "   Prometheus:  http://138.199.226.201:9090"
echo ""
echo "📝 To view logs: docker-compose -f docker-compose.prod.yml logs -f [service-name]"
echo "🛑 To stop: docker-compose -f docker-compose.prod.yml down"
echo ""