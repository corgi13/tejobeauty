#!/bin/bash

# Certificate renewal daemon
echo "Starting certificate renewal daemon..."

while true; do
    # Check if we should try to get real certificates
    if [ "$ENABLE_LETSENCRYPT" = "true" ] && [ ! -z "$DOMAIN" ]; then
        echo "Checking certificate renewal for $DOMAIN..."
        
        # Try to renew certificates
        certbot renew --webroot --webroot-path=/var/www/certbot --quiet
        
        # If renewal was successful, reload nginx
        if [ $? -eq 0 ]; then
            echo "Certificates renewed, reloading nginx..."
            nginx -s reload
        fi
    fi
    
    # Sleep for 12 hours before next check
    sleep 43200
done