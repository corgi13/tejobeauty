#!/bin/bash
# deploy-prod.sh - Production deployment script

echo "🚀 Deploying Tejo Nails Platform to Croatian production environment..."
echo "🇭🇷 Configuring for Croatian market (Europe/Zagreb timezone, EUR currency, Croatian language)"

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then
    echo "❌ Please run this script as root or with sudo"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null || ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker and Docker Compose are required for production deployment"
    exit 1
fi

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo "❌ .env.production file is required for production deployment"
    echo "Please create .env.production with production configuration"
    exit 1
fi

# Copy production environment
cp .env.production .env

# Build and start production services
echo "Building and starting production services..."
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be ready
echo "Waiting for services to start..."
sleep 30

# Run database migrations
echo "Running database migrations..."
docker-compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy

# Seed database with Croatian data
echo "Seeding database with Croatian products and settings..."
docker-compose -f docker-compose.prod.yml exec backend npm run seed

# Configure Croatian-specific settings
echo "🇭🇷 Configuring Croatian business features..."
echo "  - Croatian tax rates (PDV): 25% standard, 13% reduced, 5% super reduced"
echo "  - Croatian shipping zones: Zagreb, Dalmatia, Continental regions"
echo "  - Croatian business registration support (OIB validation)"
echo "  - Croatian holiday calendar for shipping calculations"

# Check system health
echo "Checking system health..."
sleep 10
./scripts/system-check.sh

# Setup SSL certificate (if certbot is available)
if command -v certbot &> /dev/null; then
    echo "Setting up SSL certificate..."
    # This would need to be customized based on your domain
    # certbot --nginx -d yourdomain.com
    echo "⚠️  Please configure SSL certificate manually"
fi

# Setup firewall rules
echo "Configuring firewall..."
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 22/tcp
ufw --force enable

echo ""
echo "🎉 Production deployment completed!"
echo ""
echo "Services running:"
docker-compose -f docker-compose.prod.yml ps
echo ""
echo "Access points:"
echo "- Frontend: http://localhost (or your domain)"
echo "- Backend API: http://localhost/api"
echo ""
echo "Monitor logs with:"
echo "docker-compose -f docker-compose.prod.yml logs -f"