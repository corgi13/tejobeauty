# Nginx reverse proxy with SSL and security features
FROM nginx:alpine

# Install additional tools
RUN apk add --no-cache \
    curl \
    bash \
    openssl \
    certbot \
    certbot-nginx

# Create necessary directories
RUN mkdir -p /var/log/nginx \
    /var/cache/nginx \
    /etc/nginx/ssl \
    /etc/letsencrypt \
    /var/www/certbot

# Copy configuration files
COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d/ /etc/nginx/conf.d/
COPY ssl/ /etc/nginx/ssl/
COPY scripts/ /usr/local/bin/

# Make scripts executable
RUN chmod +x /usr/local/bin/*.sh

# Create nginx user and set permissions
RUN chown -R nginx:nginx /var/log/nginx /var/cache/nginx /etc/nginx/ssl

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

# Expose ports
EXPOSE 80 443

# Start nginx with custom entrypoint
CMD ["/usr/local/bin/entrypoint.sh"]