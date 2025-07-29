#!/bin/bash
set -e

# Redis backup script
BACKUP_DIR="/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="redis_backup_${TIMESTAMP}.rdb.gz"

echo "Starting Redis backup at $(date)"

# Create backup directory if it doesn't exist
mkdir -p ${BACKUP_DIR}

# Force Redis to save current state
redis-cli -a ${REDIS_PASSWORD} BGSAVE

# Wait for background save to complete
while [ $(redis-cli -a ${REDIS_PASSWORD} LASTSAVE) -eq $(redis-cli -a ${REDIS_PASSWORD} LASTSAVE) ]; do
    echo "Waiting for background save to complete..."
    sleep 1
done

# Compress and copy the dump file
gzip -c /data/dump.rdb > ${BACKUP_DIR}/${BACKUP_FILE}

# Verify backup was created
if [ -f "${BACKUP_DIR}/${BACKUP_FILE}" ]; then
    echo "Backup created successfully: ${BACKUP_FILE}"
    
    # Get file size
    BACKUP_SIZE=$(du -h ${BACKUP_DIR}/${BACKUP_FILE} | cut -f1)
    echo "Backup size: ${BACKUP_SIZE}"
    
    # Upload to cloud storage if configured
    if [ ! -z "${AWS_S3_BUCKET}" ]; then
        echo "Uploading backup to S3..."
        aws s3 cp ${BACKUP_DIR}/${BACKUP_FILE} s3://${AWS_S3_BUCKET}/redis-backups/
        echo "Backup uploaded to S3"
    fi
    
    # Clean up old backups (keep last 7 days)
    find ${BACKUP_DIR} -name "redis_backup_*.rdb.gz" -mtime +7 -delete
    echo "Old backups cleaned up"
    
else
    echo "ERROR: Backup failed!"
    exit 1
fi

echo "Redis backup completed at $(date)"