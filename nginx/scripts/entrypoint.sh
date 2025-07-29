#!/bin/bash
set -e

echo "Starting Nginx with SSL support..."

# Create SSL directory if it doesn't exist
mkdir -p /etc/nginx/ssl/live/tejo-nails.com

# Check if SSL certificates exist, if not create self-signed ones
if [ ! -f "/etc/nginx/ssl/live/tejo-nails.com/fullchain.pem" ]; then
    echo "SSL certificates not found, creating self-signed certificates..."
    
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout /etc/nginx/ssl/live/tejo-nails.com/privkey.pem \
        -out /etc/nginx/ssl/live/tejo-nails.com/fullchain.pem \
        -subj "/C=HR/ST=Zagreb/L=Zagreb/O=Tejo Nails/CN=tejo-nails.com"
    
    # Create chain file (same as fullchain for self-signed)
    cp /etc/nginx/ssl/live/tejo-nails.com/fullchain.pem /etc/nginx/ssl/live/tejo-nails.com/chain.pem
    
    echo "Self-signed certificates created"
else
    echo "SSL certificates found"
fi

# Test nginx configuration
nginx -t

# Start certificate renewal daemon in background
/usr/local/bin/cert-renewal.sh &

# Start nginx in foreground
exec nginx -g "daemon off;"