# Tejo Nails Platform - Scripts Documentation

This document describes all the available scripts in the Tejo Nails Platform project.

## Quick Start

### `quick-start.sh`

**Purpose**: One-command setup and start for development
**Usage**: `./quick-start.sh`
**Description**: Automatically detects if it's the first run and either runs full setup or starts existing services.

## Development Scripts

### `scripts/dev-setup.sh`

**Purpose**: Complete development environment setup
**Usage**: `./scripts/dev-setup.sh`
**Features**:

- Checks prerequisites (Node.js, npm)
- Installs dependencies
- Sets up environment files
- Starts Docker services
- Runs database migrations
- Seeds database with initial data

### `scripts/api-test.sh`

**Purpose**: Test API integration between frontend and backend
**Usage**: `./scripts/api-test.sh`
**Features**:

- Tests backend health endpoint
- Tests authentication endpoints
- Tests products and orders endpoints
- Provides detailed status reports

### `scripts/seed-database.sh`

**Purpose**: Seed database with initial data
**Usage**: `./scripts/seed-database.sh`
**Features**:

- Works in both Docker and local environments
- Creates admin user, categories, and sample products
- Safe to run multiple times (uses upsert operations)

## Production Scripts

### `scripts/deploy-prod.sh`

**Purpose**: Production deployment
**Usage**: `sudo ./scripts/deploy-prod.sh`
**Features**:

- Builds and deploys production Docker containers
- Runs database migrations
- Seeds production database
- Configures firewall
- Sets up SSL certificates (manual step)

### `scripts/backup.sh`

**Purpose**: Create backups of production data
**Usage**: `./scripts/backup.sh`
**Features**:

- Backs up PostgreSQL database
- Backs up uploaded files
- Backs up configuration files
- Creates compressed archives
- Automatically cleans old backups

### `scripts/restore.sh`

**Purpose**: Restore from backup
**Usage**: `./scripts/restore.sh <backup_file.tar.gz>`
**Features**:

- Lists available backups if no file specified
- Confirms before overwriting data
- Restores database, files, and configuration
- Restarts services after restoration

## Monitoring Scripts

### `scripts/monitor.sh`

**Purpose**: System health monitoring
**Usage**: `./scripts/monitor.sh`
**Features**:

- Checks all service health
- Monitors system resources (CPU, memory, disk)
- Sends email alerts for issues
- Logs all activities with timestamps
- Checks SSL certificate expiration

### `scripts/system-check.sh`

**Purpose**: Comprehensive system health check
**Usage**: `./scripts/system-check.sh`
**Features**:

- Checks Docker services
- Tests API endpoints
- Verifies database and Redis connections
- Reports system resource usage

### `scripts/setup-cron.sh`

**Purpose**: Setup automated monitoring and backups
**Usage**: `sudo ./scripts/setup-cron.sh`
**Features**:

- Sets up monitoring every 5 minutes
- Schedules daily backups at 2 AM
- Weekly health checks on Sundays
- Automatic log cleanup

## Information Scripts

### `scripts/project-info.sh`

**Purpose**: Display comprehensive project information
**Usage**: `./scripts/project-info.sh`
**Features**:

- Shows project structure
- Displays Git information
- Lists service status
- Shows system resources
- Lists available scripts
- Shows configuration status

## Script Categories

### 🚀 Getting Started

- `quick-start.sh` - Start here for new developers
- `scripts/dev-setup.sh` - Full development setup

### 🧪 Testing & Development

- `scripts/api-test.sh` - Test API integration
- `scripts/seed-database.sh` - Populate database

### 🏭 Production

- `scripts/deploy-prod.sh` - Deploy to production
- `scripts/backup.sh` - Create backups
- `scripts/restore.sh` - Restore from backup

### 📊 Monitoring

- `scripts/monitor.sh` - Health monitoring
- `scripts/system-check.sh` - System status
- `scripts/setup-cron.sh` - Automated tasks

### ℹ️ Information

- `scripts/project-info.sh` - Project overview

## Usage Examples

### First Time Setup

```bash
# Clone repository
git clone <repository-url>
cd tejo-nails-platform

# Quick start (recommended)
./quick-start.sh

# Or manual setup
./scripts/dev-setup.sh
```

### Development Workflow

```bash
# Start development
./quick-start.sh

# Test API integration
./scripts/api-test.sh

# Check system status
./scripts/system-check.sh

# Get project info
./scripts/project-info.sh
```

### Production Deployment

```bash
# Deploy to production
sudo ./scripts/deploy-prod.sh

# Setup monitoring
sudo ./scripts/setup-cron.sh

# Create backup
./scripts/backup.sh

# Monitor system
./scripts/monitor.sh
```

### Maintenance

```bash
# Check system health
./scripts/system-check.sh

# View project status
./scripts/project-info.sh

# Restore from backup
./scripts/restore.sh backups/20240101_120000.tar.gz
```

## Environment Variables

Some scripts use environment variables for configuration:

- `DOMAIN` - Your domain name (for SSL certificate checks)
- `ALERT_EMAIL` - Email for monitoring alerts
- `BACKUP_RETENTION_DAYS` - How long to keep backups (default: 7)

## Prerequisites

### Development

- Node.js 18+
- npm
- Git

### Production

- Docker & Docker Compose
- sudo access
- Mail command (for alerts)

### Optional

- jq (for JSON parsing)
- tree (for directory listing)

## Troubleshooting

### Common Issues

1. **Permission denied**: Make sure scripts are executable

   ```bash
   chmod +x scripts/*.sh
   chmod +x quick-start.sh
   ```

2. **Port already in use**: Check if services are already running

   ```bash
   ./scripts/system-check.sh
   ```

3. **Database connection failed**: Ensure PostgreSQL is running

   ```bash
   docker-compose up -d postgres
   ```

4. **Environment variables missing**: Copy and edit .env file
   ```bash
   cp .env.example .env
   ```

## Contributing

When adding new scripts:

1. Place them in the `scripts/` directory
2. Make them executable (`chmod +x`)
3. Add proper documentation header
4. Update this SCRIPTS.md file
5. Test in both development and production environments
