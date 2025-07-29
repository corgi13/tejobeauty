#!/bin/bash
# backup.sh - Backup production data

echo "💾 Creating backup of Tejo Nails Platform..."

# Create backup directory with timestamp
BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "Backup directory: $BACKUP_DIR"

# Backup database
echo "Backing up database..."
if command -v docker-compose &> /dev/null; then
    # Docker environment
    docker-compose -f docker-compose.prod.yml exec -T postgres pg_dump -U postgres tejonails > "$BACKUP_DIR/database.sql"
else
    # Local environment
    pg_dump -U postgres tejonails > "$BACKUP_DIR/database.sql"
fi

if [ $? -eq 0 ]; then
    echo "✅ Database backup completed"
else
    echo "❌ Database backup failed"
    exit 1
fi

# Backup uploaded files (if any)
if [ -d "uploads" ]; then
    echo "Backing up uploaded files..."
    cp -r uploads "$BACKUP_DIR/"
    echo "✅ Files backup completed"
fi

# Backup environment configuration
echo "Backing up configuration..."
cp .env "$BACKUP_DIR/env.backup" 2>/dev/null || echo "⚠️  No .env file found"
cp .env.production "$BACKUP_DIR/env.production.backup" 2>/dev/null || echo "⚠️  No .env.production file found"

# Create backup info file
cat > "$BACKUP_DIR/backup_info.txt" << EOF
Tejo Nails Platform Backup
Created: $(date)
Server: $(hostname)
Git Commit: $(git rev-parse HEAD 2>/dev/null || echo "N/A")
Docker Images:
$(docker images | grep tejo-nails || echo "No Docker images found")
EOF

# Compress backup
echo "Compressing backup..."
tar -czf "${BACKUP_DIR}.tar.gz" -C backups "$(basename "$BACKUP_DIR")"
rm -rf "$BACKUP_DIR"

echo "✅ Backup completed: ${BACKUP_DIR}.tar.gz"

# Clean old backups (keep last 7 days)
echo "Cleaning old backups..."
find backups -name "*.tar.gz" -mtime +7 -delete
echo "✅ Old backups cleaned"

echo "💾 Backup process completed!"