# PostgreSQL with custom configuration and backup capabilities
FROM postgres:15-alpine

# Install additional tools
RUN apk add --no-cache \
    curl \
    bash \
    gzip \
    aws-cli

# Create backup directory
RUN mkdir -p /backups && chown postgres:postgres /backups

# Copy custom configuration
COPY postgresql.conf /etc/postgresql/postgresql.conf
COPY pg_hba.conf /etc/postgresql/pg_hba.conf

# Copy backup scripts
COPY scripts/backup.sh /usr/local/bin/backup.sh
COPY scripts/restore.sh /usr/local/bin/restore.sh
COPY scripts/init-db.sh /docker-entrypoint-initdb.d/

# Make scripts executable
RUN chmod +x /usr/local/bin/backup.sh
RUN chmod +x /usr/local/bin/restore.sh
RUN chmod +x /docker-entrypoint-initdb.d/init-db.sh

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD pg_isready -U $POSTGRES_USER -d $POSTGRES_DB || exit 1

# Expose port
EXPOSE 5432

# Use custom configuration
CMD ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf"]