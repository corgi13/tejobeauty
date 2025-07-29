#!/bin/bash
set -e

# Database restore script
BACKUP_DIR="/backups"
BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: $0 <backup_file>"
    echo "Available backups:"
    ls -la ${BACKUP_DIR}/tejo_nails_backup_*.sql.gz 2>/dev/null || echo "No backups found"
    exit 1
fi

if [ ! -f "${BACKUP_DIR}/${BACKUP_FILE}" ]; then
    echo "ERROR: Backup file not found: ${BACKUP_DIR}/${BACKUP_FILE}"
    exit 1
fi

echo "Starting database restore from ${BACKUP_FILE} at $(date)"

# Stop all connections to the database
psql -h localhost -U ${POSTGRES_USER} -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${POSTGRES_DB}' AND pid <> pg_backend_pid();"

# Drop and recreate database
psql -h localhost -U ${POSTGRES_USER} -d postgres -c "DROP DATABASE IF EXISTS ${POSTGRES_DB};"
psql -h localhost -U ${POSTGRES_USER} -d postgres -c "CREATE DATABASE ${POSTGRES_DB};"

# Restore from backup
gunzip -c ${BACKUP_DIR}/${BACKUP_FILE} | psql -h localhost -U ${POSTGRES_USER} -d ${POSTGRES_DB}

echo "Database restore completed at $(date)"

# Verify restore
TABLE_COUNT=$(psql -h localhost -U ${POSTGRES_USER} -d ${POSTGRES_DB} -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")
echo "Restored database contains ${TABLE_COUNT} tables"