#!/bin/bash
# restore.sh - Restore from backup

if [ $# -eq 0 ]; then
    echo "Usage: $0 <backup_file.tar.gz>"
    echo "Available backups:"
    ls -la backups/*.tar.gz 2>/dev/null || echo "No backups found"
    exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Backup file not found: $BACKUP_FILE"
    exit 1
fi

echo "🔄 Restoring from backup: $BACKUP_FILE"

# Extract backup
TEMP_DIR=$(mktemp -d)
tar -xzf "$BACKUP_FILE" -C "$TEMP_DIR"
BACKUP_DIR=$(find "$TEMP_DIR" -maxdepth 1 -type d | tail -n 1)

echo "Extracted to: $BACKUP_DIR"

# Confirm restoration
echo "⚠️  This will overwrite current data. Are you sure? (y/N)"
read -r confirmation
if [[ ! $confirmation =~ ^[Yy]$ ]]; then
    echo "Restoration cancelled"
    rm -rf "$TEMP_DIR"
    exit 0
fi

# Stop services
echo "Stopping services..."
if command -v docker-compose &> /dev/null; then
    docker-compose -f docker-compose.prod.yml down
fi

# Restore database
echo "Restoring database..."
if [ -f "$BACKUP_DIR/database.sql" ]; then
    if command -v docker-compose &> /dev/null; then
        # Start only database
        docker-compose -f docker-compose.prod.yml up -d postgres
        sleep 10
        
        # Drop and recreate database
        docker-compose -f docker-compose.prod.yml exec -T postgres psql -U postgres -c "DROP DATABASE IF EXISTS tejonails;"
        docker-compose -f docker-compose.prod.yml exec -T postgres psql -U postgres -c "CREATE DATABASE tejonails;"
        
        # Restore data
        docker-compose -f docker-compose.prod.yml exec -T postgres psql -U postgres tejonails < "$BACKUP_DIR/database.sql"
    else
        # Local environment
        dropdb -U postgres tejonails 2>/dev/null || true
        createdb -U postgres tejonails
        psql -U postgres tejonails < "$BACKUP_DIR/database.sql"
    fi
    
    if [ $? -eq 0 ]; then
        echo "✅ Database restored"
    else
        echo "❌ Database restoration failed"
        exit 1
    fi
else
    echo "⚠️  No database backup found"
fi

# Restore files
if [ -d "$BACKUP_DIR/uploads" ]; then
    echo "Restoring uploaded files..."
    rm -rf uploads
    cp -r "$BACKUP_DIR/uploads" .
    echo "✅ Files restored"
fi

# Restore configuration (with confirmation)
if [ -f "$BACKUP_DIR/env.backup" ]; then
    echo "Restore environment configuration? (y/N)"
    read -r env_confirmation
    if [[ $env_confirmation =~ ^[Yy]$ ]]; then
        cp "$BACKUP_DIR/env.backup" .env
        echo "✅ Environment configuration restored"
    fi
fi

# Start services
echo "Starting services..."
if command -v docker-compose &> /dev/null; then
    docker-compose -f docker-compose.prod.yml up -d
    sleep 30
fi

# Clean up
rm -rf "$TEMP_DIR"

echo "✅ Restoration completed!"
echo "Please verify the system is working correctly."