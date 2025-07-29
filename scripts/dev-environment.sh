#!/bin/bash

# Comprehensive development environment manager
# This script provides a complete development experience with hot reload

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${PURPLE}=== $1 ===${NC}"
}

print_status() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${CYAN}ℹ${NC} $1"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  start     Start the development environment with hot reload"
    echo "  stop      Stop all development services"
    echo "  restart   Restart all development services"
    echo "  logs      Show logs from all services"
    echo "  status    Show status of all services"
    echo "  clean     Clean up containers and volumes"
    echo "  migrate   Run database migrations"
    echo "  seed      Seed database with development data"
    echo "  watch     Start file watcher for automatic actions"
    echo "  shell     Open shell in specified container"
    echo "  help      Show this help message"
    echo ""
    echo "Options:"
    echo "  --clean   Clean up before starting (with start command)"
    echo "  --follow  Follow logs (with logs command)"
    echo "  --service Specify service name (with logs/shell commands)"
    echo ""
    echo "Examples:"
    echo "  $0 start --clean          # Start with cleanup"
    echo "  $0 logs --follow          # Follow all logs"
    echo "  $0 logs --service backend # Show backend logs only"
    echo "  $0 shell --service backend # Open shell in backend container"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
}

# Function to start development environment
start_dev() {
    local clean_flag=$1
    
    print_header "Starting Development Environment"
    
    if [ "$clean_flag" = "--clean" ]; then
        print_status "Cleaning up existing containers and volumes..."
        docker-compose -f docker-compose.yml -f docker-compose.dev.yml down -v --remove-orphans
        docker system prune -f
        print_success "Cleanup completed"
    fi
    
    # Start the development environment
    ./scripts/dev-start.sh
}

# Function to stop development environment
stop_dev() {
    print_header "Stopping Development Environment"
    
    print_status "Stopping all services..."
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml down --remove-orphans
    
    # Stop any remaining processes
    ./scripts/stop-services.sh
    
    print_success "All services stopped"
}

# Function to restart development environment
restart_dev() {
    print_header "Restarting Development Environment"
    
    stop_dev
    sleep 2
    start_dev
}

# Function to show logs
show_logs() {
    local follow_flag=$1
    local service=$2
    
    print_header "Service Logs"
    
    if [ -n "$service" ]; then
        print_status "Showing logs for service: $service"
        if [ "$follow_flag" = "--follow" ]; then
            docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f "$service"
        else
            docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs --tail=100 "$service"
        fi
    else
        print_status "Showing logs for all services"
        if [ "$follow_flag" = "--follow" ]; then
            docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f
        else
            docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs --tail=50
        fi
    fi
}

# Function to show service status
show_status() {
    print_header "Service Status"
    
    print_status "Docker containers:"
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml ps
    
    echo ""
    print_status "Service health checks:"
    
    # Check backend
    BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3002/api/system-health 2>/dev/null || echo "000")
    if [ "$BACKEND_STATUS" = "200" ]; then
        print_success "Backend API: Healthy (HTTP $BACKEND_STATUS)"
    else
        print_error "Backend API: Unhealthy (HTTP $BACKEND_STATUS)"
    fi
    
    # Check frontend
    FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health 2>/dev/null || echo "000")
    if [ "$FRONTEND_STATUS" = "200" ]; then
        print_success "Frontend: Healthy (HTTP $FRONTEND_STATUS)"
    else
        print_error "Frontend: Unhealthy (HTTP $FRONTEND_STATUS)"
    fi
    
    # Check nginx
    NGINX_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/health 2>/dev/null || echo "000")
    if [ "$NGINX_STATUS" = "200" ]; then
        print_success "Nginx Proxy: Healthy (HTTP $NGINX_STATUS)"
    else
        print_error "Nginx Proxy: Unhealthy (HTTP $NGINX_STATUS)"
    fi
    
    # Check database
    if docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec -T postgres pg_isready -U postgres -d tejo_nails_dev > /dev/null 2>&1; then
        print_success "PostgreSQL: Healthy"
    else
        print_error "PostgreSQL: Unhealthy"
    fi
    
    # Check Redis
    if docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec -T redis redis-cli -a redis123 ping > /dev/null 2>&1; then
        print_success "Redis: Healthy"
    else
        print_error "Redis: Unhealthy"
    fi
}

# Function to clean up
clean_up() {
    print_header "Cleaning Up Development Environment"
    
    print_status "Stopping all services..."
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml down -v --remove-orphans
    
    print_status "Removing unused containers, networks, and images..."
    docker system prune -f
    
    print_status "Removing unused volumes..."
    docker volume prune -f
    
    print_success "Cleanup completed"
}

# Function to run database migrations
run_migrations() {
    print_header "Running Database Migrations"
    
    print_status "Running Prisma migrations..."
    if docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec backend npx prisma migrate dev; then
        print_success "Database migrations completed"
    else
        print_error "Database migrations failed"
        exit 1
    fi
}

# Function to seed database
seed_database() {
    print_header "Seeding Database"
    
    print_status "Running database seed..."
    if docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec backend npx prisma db seed; then
        print_success "Database seeding completed"
    else
        print_warning "Database seeding completed with warnings (this is normal if data already exists)"
    fi
}

# Function to start file watcher
start_watcher() {
    print_header "Starting File Watcher"
    
    print_status "Starting file watcher for automatic development actions..."
    ./scripts/file-watcher.sh
}

# Function to open shell in container
open_shell() {
    local service=$1
    
    if [ -z "$service" ]; then
        print_error "Please specify a service name with --service option"
        echo "Available services: backend, frontend, postgres, redis, nginx"
        exit 1
    fi
    
    print_header "Opening Shell in $service Container"
    
    if docker-compose -f docker-compose.yml -f docker-compose.dev.yml ps "$service" | grep -q "Up"; then
        print_status "Opening shell in $service container..."
        docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec "$service" /bin/sh
    else
        print_error "Service $service is not running"
        exit 1
    fi
}

# Main script logic
check_docker

case "${1:-help}" in
    "start")
        start_dev "$2"
        ;;
    "stop")
        stop_dev
        ;;
    "restart")
        restart_dev
        ;;
    "logs")
        show_logs "$2" "$3"
        ;;
    "status")
        show_status
        ;;
    "clean")
        clean_up
        ;;
    "migrate")
        run_migrations
        ;;
    "seed")
        seed_database
        ;;
    "watch")
        start_watcher
        ;;
    "shell")
        if [ "$2" = "--service" ]; then
            open_shell "$3"
        else
            print_error "Please specify service with --service option"
            exit 1
        fi
        ;;
    "help"|*)
        show_usage
        ;;
esac