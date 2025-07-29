#!/bin/bash
set -e

# Redis restore script
BACKUP_DIR="/backups"
BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: $0 <backup_file>"
    echo "Available backups:"
    ls -la ${BACKUP_DIR}/redis_backup_*.rdb.gz 2>/dev/null || echo "No backups found"
    exit 1
fi

if [ ! -f "${BACKUP_DIR}/${BACKUP_FILE}" ]; then
    echo "ERROR: Backup file not found: ${BACKUP_DIR}/${BACKUP_FILE}"
    exit 1
fi

echo "Starting Redis restore from ${BACKUP_FILE} at $(date)"

# Stop Redis server
redis-cli -a ${REDIS_PASSWORD} SHUTDOWN NOSAVE || true

# Wait for Redis to stop
sleep 2

# Restore the backup file
gunzip -c ${BACKUP_DIR}/${BACKUP_FILE} > /data/dump.rdb

# Set proper permissions
chown redis:redis /data/dump.rdb

echo "Redis restore completed at $(date)"
echo "Please restart Redis server to load the restored data"