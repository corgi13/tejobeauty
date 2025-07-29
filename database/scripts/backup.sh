#!/bin/bash
set -e

# Database backup script
BACKUP_DIR="/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="tejo_nails_backup_${TIMESTAMP}.sql.gz"

echo "Starting database backup at $(date)"

# Create backup directory if it doesn't exist
mkdir -p ${BACKUP_DIR}

# Create database dump
pg_dump -h localhost -U ${POSTGRES_USER} -d ${POSTGRES_DB} | gzip > ${BACKUP_DIR}/${BACKUP_FILE}

# Verify backup was created
if [ -f "${BACKUP_DIR}/${BACKUP_FILE}" ]; then
    echo "Backup created successfully: ${BACKUP_FILE}"
    
    # Get file size
    BACKUP_SIZE=$(du -h ${BACKUP_DIR}/${BACKUP_FILE} | cut -f1)
    echo "Backup size: ${BACKUP_SIZE}"
    
    # Upload to cloud storage if configured
    if [ ! -z "${AWS_S3_BUCKET}" ]; then
        echo "Uploading backup to S3..."
        aws s3 cp ${BACKUP_DIR}/${BACKUP_FILE} s3://${AWS_S3_BUCKET}/database-backups/
        echo "Backup uploaded to S3"
    fi
    
    # Clean up old backups (keep last 7 days)
    find ${BACKUP_DIR} -name "tejo_nails_backup_*.sql.gz" -mtime +7 -delete
    echo "Old backups cleaned up"
    
else
    echo "ERROR: Backup failed!"
    exit 1
fi

echo "Backup completed at $(date)"