#!/bin/bash
set -e

DOMAIN=${1:-tejo-nails.com}
EMAIL=${2:-admin@tejo-nails.com}

echo "Setting up Let's Encrypt certificate for $DOMAIN..."

# Stop nginx temporarily
nginx -s stop || true

# Get certificate
certbot certonly \
    --standalone \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    --domains $DOMAIN,www.$DOMAIN

# Copy certificates to nginx directory
cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem /etc/nginx/ssl/live/$DOMAIN/
cp /etc/letsencrypt/live/$DOMAIN/privkey.pem /etc/nginx/ssl/live/$DOMAIN/
cp /etc/letsencrypt/live/$DOMAIN/chain.pem /etc/nginx/ssl/live/$DOMAIN/

# Set proper permissions
chown -R nginx:nginx /etc/nginx/ssl/

echo "Let's Encrypt certificate installed successfully!"

# Start nginx
nginx