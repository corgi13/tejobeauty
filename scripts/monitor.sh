#!/bin/bash

echo "=== Tejo Nails Platform Status ==="
echo ""

# Production status
echo "Production Services:"
if sudo docker-compose -f docker-compose.production.yml ps | grep -q "Up"; then
    echo "✓ Production is running"
    sudo docker-compose -f docker-compose.production.yml ps
else
    echo "✗ Production is down"
fi

echo ""

# Development status
echo "Development Services:"
if sudo docker-compose -f docker-compose.dev.yml ps | grep -q "Up"; then
    echo "✓ Development databases are running"
    sudo docker-compose -f docker-compose.dev.yml ps
else
    echo "✗ Development databases are down"
fi

# Check development processes
if pgrep -f "nest start --watch" > /dev/null; then
    echo "✓ Development backend is running"
else
    echo "✗ Development backend is down"
fi

if pgrep -f "next dev" > /dev/null; then
    echo "✓ Development frontend is running"
else
    echo "✗ Development frontend is down"
fi

echo ""

# Website status
echo "Website Status:"
PROD_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://tejo-nails.com || echo "000")
echo "Production: https://tejo-nails.com ($PROD_STATUS)"

DEV_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001 || echo "000")
echo "Development: http://localhost:3001 ($DEV_STATUS)"
