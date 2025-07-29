# Redis with persistence and backup capabilities
FROM redis:7-alpine

# Install additional tools
RUN apk add --no-cache \
    curl \
    bash \
    gzip \
    aws-cli

# Create backup directory
RUN mkdir -p /backups && chown redis:redis /backups

# Copy custom configuration
COPY redis.conf /etc/redis/redis.conf

# Copy backup scripts
COPY scripts/backup.sh /usr/local/bin/redis-backup.sh
COPY scripts/restore.sh /usr/local/bin/redis-restore.sh

# Make scripts executable
RUN chmod +x /usr/local/bin/redis-backup.sh
RUN chmod +x /usr/local/bin/redis-restore.sh

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD redis-cli ping || exit 1

# Expose port
EXPOSE 6379

# Use custom configuration
CMD ["redis-server", "/etc/redis/redis.conf"]