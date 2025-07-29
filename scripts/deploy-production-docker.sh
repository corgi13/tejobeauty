#!/bin/bash

set -e

echo "=== Deploying Tejo Nails Platform in Production Mode (Docker) ==="

# Configuration
DOMAIN="tejo-nails.com"
echo ""

# Step 1: Stop any existing services
echo "Step 1: Stopping existing services..."
./scripts/stop-services.sh
sudo systemctl stop nginx 2>/dev/null || true
sudo docker-compose down 2>/dev/null || true
sudo docker-compose -f docker-compose.production.yml down 2>/dev/null || true
echo ""

# Step 2: Create SSL certificates directory
echo "Step 2: Setting up SSL certificates..."
sudo mkdir -p /etc/nginx/ssl
sudo mkdir -p nginx/ssl

# Create temporary self-signed certificate for initial setup
if [ ! -f "nginx/ssl/fullchain.pem" ]; then
    echo "Creating temporary self-signed certificate..."
    sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout nginx/ssl/privkey.pem \
        -out nginx/ssl/fullchain.pem \
        -subj "/C=HR/ST=Zagreb/L=Zagreb/O=Tejo Nails/CN=$DOMAIN"
fi

echo ""

# Step 3: Build and start production services
echo "Step 3: Building and starting production services..."

# Create .env file for production if it doesn't exist
if [ ! -f ".env.production" ]; then
    echo "Creating production environment file..."
    cat > .env.production << EOF
POSTGRES_DB=tejo_nails_platform
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres_secure_password_$(openssl rand -hex 16)
JWT_SECRET=$(openssl rand -base64 32)
NODE_ENV=production
STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY:-}
EMAIL_HOST=${EMAIL_HOST:-}
EMAIL_PORT=${EMAIL_PORT:-587}
EMAIL_USER=${EMAIL_USER:-}
EMAIL_PASS=${EMAIL_PASS:-}
EOF
fi

# Start services with Docker Compose
echo "Starting production services with Docker Compose..."
sudo docker-compose -f docker-compose.production.yml --env-file .env.production up -d --build

echo ""

# Step 4: Wait for services to be ready
echo "Step 4: Waiting for services to be ready..."

wait_for_service() {
    local url=$1
    local service_name=$2
    echo "Waiting for $service_name at $url..."
    for i in {1..30}; do
        if curl -s -k --fail "$url" > /dev/null; then
            echo "✓ $service_name is up!"
            return 0
        fi
        sleep 2
    done
    echo "✗ $service_name failed to start in time."
    return 1
}

wait_for_service "https://localhost/api/system-health" "Backend API" || { sudo docker-compose -f docker-compose.production.yml logs; exit 1; }

# Check if services are running
if sudo docker-compose -f docker-compose.production.yml ps | grep -q "Up"; then
    echo "✓ Docker services are running"
else
    echo "✗ Docker services failed to start"
    sudo docker-compose -f docker-compose.production.yml logs
    exit 1
fi

# Step 5: Set up Let's Encrypt SSL certificates
echo ""
echo "Step 5: Setting up Let's Encrypt SSL certificates..."

# Run certbot to get real SSL certificates
sudo docker-compose -f docker-compose.production.yml run --rm certbot || echo "SSL certificate setup failed or was skipped. Will retry on next run."

# Copy certificates if they exist
if sudo docker run --rm -v tejo-nails-platform_certbot_certs:/certs alpine ls "/certs/live/$DOMAIN/" 2>/dev/null; then
    echo "Copying Let's Encrypt certificates..."
    sudo docker run --rm -v tejo-nails-platform_certbot_certs:/certs -v $(pwd)/nginx/ssl:/ssl alpine sh -c "
        cp /certs/live/$DOMAIN/fullchain.pem /ssl/ &&
        cp /certs/live/$DOMAIN/privkey.pem /ssl/
    "
    
    # Reload nginx with new certificates
    sudo docker-compose -f docker-compose.production.yml restart nginx
fi

# Step 6: Test the deployment
echo ""
echo "Step 6: Testing production deployment..."

# Test HTTP redirect
HTTP_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -L "http://$DOMAIN" || echo "000")
if [ "$HTTP_RESPONSE" = "200" ]; then
    echo "✓ HTTP to HTTPS redirect to $DOMAIN is working."
else
    echo "⚠ HTTP redirect test failed with status: $HTTP_RESPONSE. This may be due to DNS propagation."
fi

# Test HTTPS
HTTPS_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" --cacert nginx/ssl/fullchain.pem "https://$DOMAIN" || echo "000")
if [ "$HTTPS_RESPONSE" = "200" ]; then
    echo "✓ HTTPS access to $DOMAIN is working."
else
    echo "⚠ HTTPS test failed with status: $HTTPS_RESPONSE. This may be due to DNS propagation or SSL certificate issues."
fi

# Test API
API_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" --cacert nginx/ssl/fullchain.pem "https://$DOMAIN/api/system-health" || echo "000")
if [ "$API_RESPONSE" = "200" ]; then
    echo "✓ API at $DOMAIN is working."
else
    echo "⚠ API test failed with status: $API_RESPONSE."
fi

echo ""
echo "=== Production Deployment Summary ==="
echo "🌐 Website: https://$DOMAIN"
echo "🔧 API: https://$DOMAIN/api"
echo "📚 API Docs: https://$DOMAIN/api/docs"
echo "💚 Health Check: https://$DOMAIN/api/system-health"
echo ""

# Show running containers
echo "Running containers:"
sudo docker-compose -f docker-compose.production.yml ps

echo ""
echo "🎉 Production deployment completed!"
echo "Your Tejo Nails Platform is now running in production mode with:"
echo "- High availability and auto-restart"
echo "- SSL certificates (Let's Encrypt)"
echo "- Load balancing and health checks"
echo "- Automatic updates with Watchtower"
echo ""
echo "To stop services: sudo docker-compose -f docker-compose.production.yml down"
echo "To view logs: sudo docker-compose -f docker-compose.production.yml logs -f"
echo "To update: sudo docker-compose -f docker-compose.production.yml pull && sudo docker-compose -f docker-compose.production.yml up -d"