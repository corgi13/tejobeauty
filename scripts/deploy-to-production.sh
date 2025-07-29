#!/bin/bash

set -e

echo "=== Deploying Changes to Production ==="
echo ""

# Build new images
echo "Building new Docker images..."
sudo docker-compose -f docker-compose.production.yml build --no-cache

# Rolling update (zero downtime)
echo "Performing rolling update..."
sudo docker-compose -f docker-compose.production.yml up -d

# Wait for services to be healthy
echo "Waiting for services to be healthy..."
sleep 30

# Test deployment
echo "Testing deployment..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://tejo-nails.com/api/system-health || echo "000")
if [ "$RESPONSE" = "200" ]; then
    echo "✓ Deployment successful!"
else
    echo "✗ Deployment failed (HTTP $RESPONSE)"
    echo "Rolling back..."
    sudo docker-compose -f docker-compose.production.yml restart
    exit 1
fi

echo ""
echo "🎉 Production updated successfully!"
echo "Changes are now live at https://tejo-nails.com"
