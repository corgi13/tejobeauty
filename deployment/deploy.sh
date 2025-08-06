#!/bin/bash

# Tejo Beauty Deployment Script
# This script handles the complete deployment process

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="tejo-beauty"
BACKUP_DIR="./backups"
LOG_FILE="./deployment.log"
DOCKER_COMPOSE_FILE="./docker-compose.yml"

# Functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

success() {
    echo -e "${GREEN}✓${NC} $1" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}⚠${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}✗${NC} $1" | tee -a "$LOG_FILE"
    exit 1
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed"
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed"
    fi
    
    if [ ! -f "$DOCKER_COMPOSE_FILE" ]; then
        error "Docker Compose file not found: $DOCKER_COMPOSE_FILE"
    fi
    
    if [ ! -f ".env" ]; then
        error ".env file not found. Please create it from .env.example"
    fi
    
    success "Prerequisites check passed"
}

# Create backup
create_backup() {
    log "Creating backup..."
    
    mkdir -p "$BACKUP_DIR"
    
    BACKUP_NAME="backup_$(date +'%Y%m%d_%H%M%S')"
    BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"
    
    # Database backup
    if docker ps | grep -q "${PROJECT_NAME}-postgres"; then
        log "Backing up database..."
        docker exec "${PROJECT_NAME}-postgres" pg_dump -U tejo_beauty_user tejo_beauty > "$BACKUP_PATH.sql"
        success "Database backup created: $BACKUP_PATH.sql"
    else
        warning "Database container not running, skipping database backup"
    fi
    
    # Files backup
    if [ -d "../uploads" ]; then
        log "Backing up uploaded files..."
        tar -czf "$BACKUP_PATH.tar.gz" -C .. uploads
        success "Files backup created: $BACKUP_PATH.tar.gz"
    fi
}

# Build and deploy
deploy() {
    log "Starting deployment..."
    
    # Pull latest images
    log "Pulling latest Docker images..."
    docker-compose -f "$DOCKER_COMPOSE_FILE" pull
    
    # Build custom images
    log "Building application images..."
    docker-compose -f "$DOCKER_COMPOSE_FILE" build --no-cache
    
    # Stop existing containers
    log "Stopping existing containers..."
    docker-compose -f "$DOCKER_COMPOSE_FILE" down
    
    # Start new containers
    log "Starting new containers..."
    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d
    
    success "Deployment completed"
}

# Run database migrations
run_migrations() {
    log "Running database migrations..."
    
    # Wait for database to be ready
    log "Waiting for database to be ready..."
    sleep 30
    
    # Run Prisma migrations
    docker exec "${PROJECT_NAME}-backend" npx prisma migrate deploy
    
    # Generate Prisma client
    docker exec "${PROJECT_NAME}-backend" npx prisma generate
    
    success "Database migrations completed"
}

# Verify deployment
verify_deployment() {
    log "Verifying deployment..."
    
    # Check container health
    CONTAINERS=("${PROJECT_NAME}-postgres" "${PROJECT_NAME}-redis" "${PROJECT_NAME}-elasticsearch" "${PROJECT_NAME}-backend" "${PROJECT_NAME}-frontend" "${PROJECT_NAME}-nginx")
    
    for container in "${CONTAINERS[@]}"; do
        if docker ps | grep -q "$container"; then
            success "$container is running"
        else
            error "$container is not running"
        fi
    done
    
    # Check application health
    log "Checking application health..."
    sleep 10
    
    if curl -f http://localhost/health > /dev/null 2>&1; then
        success "Application health check passed"
    else
        error "Application health check failed"
    fi
    
    # Check API health
    if curl -f http://localhost/api/health > /dev/null 2>&1; then
        success "API health check passed"
    else
        error "API health check failed"
    fi
}

# Cleanup old images and containers
cleanup() {
    log "Cleaning up old Docker images and containers..."
    
    # Remove unused images
    docker image prune -f
    
    # Remove unused containers
    docker container prune -f
    
    # Remove unused volumes (be careful with this)
    # docker volume prune -f
    
    success "Cleanup completed"
}

# Show logs
show_logs() {
    log "Showing recent logs..."
    docker-compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50
}

# Main deployment process
main() {
    log "Starting Tejo Beauty deployment process..."
    
    case "${1:-deploy}" in
        "deploy")
            check_prerequisites
            create_backup
            deploy
            run_migrations
            verify_deployment
            cleanup
            success "Deployment completed successfully!"
            ;;
        "backup")
            create_backup
            ;;
        "logs")
            show_logs
            ;;
        "verify")
            verify_deployment
            ;;
        "cleanup")
            cleanup
            ;;
        "restart")
            log "Restarting services..."
            docker-compose -f "$DOCKER_COMPOSE_FILE" restart
            verify_deployment
            ;;
        "stop")
            log "Stopping services..."
            docker-compose -f "$DOCKER_COMPOSE_FILE" down
            ;;
        "start")
            log "Starting services..."
            docker-compose -f "$DOCKER_COMPOSE_FILE" up -d
            verify_deployment
            ;;
        *)
            echo "Usage: $0 {deploy|backup|logs|verify|cleanup|restart|stop|start}"
            echo ""
            echo "Commands:"
            echo "  deploy   - Full deployment process (default)"
            echo "  backup   - Create backup only"
            echo "  logs     - Show recent logs"
            echo "  verify   - Verify deployment health"
            echo "  cleanup  - Clean up old Docker resources"
            echo "  restart  - Restart all services"
            echo "  stop     - Stop all services"
            echo "  start    - Start all services"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"