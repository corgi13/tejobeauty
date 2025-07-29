#!/bin/bash

echo "=== Setting up SSL certificates for tejo-nails.com ==="

# Install certbot if not already installed
if ! command -v certbot &> /dev/null; then
    echo "Installing certbot..."
    sudo apt update
    sudo apt install -y certbot python3-certbot-nginx
fi

# Create directories for SSL certificates
sudo mkdir -p /etc/nginx/ssl
sudo mkdir -p /var/www/certbot

# Stop nginx if running to avoid port conflicts
sudo systemctl stop nginx 2>/dev/null || true

# Check if domain points to this server
DOMAIN_IP=$(dig +short tejo-nails.com)
SERVER_IP=$(curl -s -4 ifconfig.me)

echo "Domain IP: $DOMAIN_IP"
echo "Server IP: $SERVER_IP"

if [ "$DOMAIN_IP" = "$SERVER_IP" ]; then
    # Generate SSL certificate
    echo "Generating SSL certificate for tejo-nails.com..."
    sudo certbot certonly --standalone \
        --preferred-challenges http \
        -d tejo-nails.com \
        -d www.tejo-nails.com \
        --email admin@tejo-nails.com \
        --agree-tos \
        --non-interactive
else
    echo "⚠ Domain does not point to this server. Skipping Let's Encrypt certificate."
    # Skip Let's Encrypt and go straight to self-signed
    DOMAIN_IP="$SERVER_IP"
fi

# Copy certificates to nginx directory
if [ -f "/etc/letsencrypt/live/tejo-nails.com/fullchain.pem" ]; then
    sudo cp /etc/letsencrypt/live/tejo-nails.com/fullchain.pem /etc/nginx/ssl/
    sudo cp /etc/letsencrypt/live/tejo-nails.com/privkey.pem /etc/nginx/ssl/
    echo "✓ SSL certificates installed successfully"
else
    echo "⚠ SSL certificate generation failed, creating self-signed certificate for testing..."
    sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout /etc/nginx/ssl/privkey.pem \
        -out /etc/nginx/ssl/fullchain.pem \
        -subj "/C=HR/ST=Zagreb/L=Zagreb/O=Tejo Nails/CN=tejo-nails.com"
fi

# Set up auto-renewal
echo "Setting up SSL certificate auto-renewal..."
(sudo crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet --post-hook 'systemctl reload nginx'") | sudo crontab -

echo "✓ SSL setup completed"