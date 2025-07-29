#!/bin/bash
set -e

# Database initialization script
echo "Initializing Tejo Nails database..."

# Create extensions
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Enable required extensions
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
    CREATE EXTENSION IF NOT EXISTS "pg_trgm";
    
    -- Create backup user for automated backups
    CREATE USER backup_user WITH PASSWORD '${BACKUP_USER_PASSWORD:-backup123}';
    GRANT CONNECT ON DATABASE ${POSTGRES_DB} TO backup_user;
    GRANT USAGE ON SCHEMA public TO backup_user;
    GRANT SELECT ON ALL TABLES IN SCHEMA public TO backup_user;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO backup_user;
    
    -- Create monitoring user for health checks
    CREATE USER monitor_user WITH PASSWORD '${MONITOR_USER_PASSWORD:-monitor123}';
    GRANT CONNECT ON DATABASE ${POSTGRES_DB} TO monitor_user;
    GRANT pg_monitor TO monitor_user;
EOSQL

echo "Database initialization completed"