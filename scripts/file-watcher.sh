#!/bin/bash

# File watcher script for automatic development actions
# This script monitors file changes and triggers appropriate actions

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Check if inotify-tools is installed
if ! command -v inotifywait &> /dev/null; then
    print_status "Installing inotify-tools for file watching..."
    apt-get update && apt-get install -y inotify-tools
    print_success "inotify-tools installed"
fi

print_status "Starting file watcher for development automation..."
echo ""
echo "Monitoring the following directories:"
echo "📁 ./backend/prisma/ - Database schema changes"
echo "📁 ./backend/src/ - Backend code changes"
echo "📁 ./frontend/src/ - Frontend code changes"
echo "📁 ./nginx/ - Nginx configuration changes"
echo "📁 ./docker-compose*.yml - Docker configuration changes"
echo ""

# Function to handle database schema changes
handle_schema_change() {
    local file=$1
    print_status "Database schema change detected: $file"
    
    if [[ "$file" == *".prisma" ]]; then
        print_status "Running database migration..."
        if docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec -T backend npx prisma migrate dev --name "auto-$(date +%Y%m%d_%H%M%S)"; then
            print_success "Database migration completed"
            
            # Generate Prisma client
            print_status "Regenerating Prisma client..."
            if docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec -T backend npx prisma generate; then
                print_success "Prisma client regenerated"
            else
                print_error "Failed to regenerate Prisma client"
            fi
        else
            print_error "Database migration failed"
        fi
    fi
}

# Function to handle backend code changes
handle_backend_change() {
    local file=$1
    print_status "Backend code change detected: $file"
    
    # The backend container already has hot reload via nodemon
    # Just log the change for visibility
    print_success "Backend will auto-restart via nodemon"
}

# Function to handle frontend code changes
handle_frontend_change() {
    local file=$1
    print_status "Frontend code change detected: $file"
    
    # The frontend container already has hot reload via Next.js
    # Just log the change for visibility
    print_success "Frontend will auto-reload via Next.js"
}

# Function to handle nginx configuration changes
handle_nginx_change() {
    local file=$1
    print_status "Nginx configuration change detected: $file"
    
    print_status "Reloading nginx configuration..."
    if docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec nginx nginx -t; then
        if docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec nginx nginx -s reload; then
            print_success "Nginx configuration reloaded"
        else
            print_error "Failed to reload nginx configuration"
        fi
    else
        print_error "Nginx configuration test failed"
    fi
}

# Function to handle docker configuration changes
handle_docker_change() {
    local file=$1
    print_status "Docker configuration change detected: $file"
    
    print_warning "Docker configuration changed. You may need to rebuild containers:"
    echo "  docker-compose -f docker-compose.yml -f docker-compose.dev.yml build"
    echo "  docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d"
}

# Function to handle package.json changes
handle_package_change() {
    local file=$1
    print_status "Package configuration change detected: $file"
    
    if [[ "$file" == *"backend/package.json"* ]]; then
        print_status "Backend dependencies changed. Rebuilding backend container..."
        docker-compose -f docker-compose.yml -f docker-compose.dev.yml build backend
        docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d backend
        print_success "Backend container rebuilt"
    elif [[ "$file" == *"frontend/package.json"* ]]; then
        print_status "Frontend dependencies changed. Rebuilding frontend container..."
        docker-compose -f docker-compose.yml -f docker-compose.dev.yml build frontend
        docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d frontend
        print_success "Frontend container rebuilt"
    fi
}

# Main file watching loop
inotifywait -m -r -e modify,create,delete,move \
    --include '\.(js|ts|tsx|jsx|json|prisma|conf|yml|yaml)$' \
    ./backend/prisma/ \
    ./backend/src/ \
    ./frontend/src/ \
    ./nginx/ \
    ./docker-compose*.yml \
    ./backend/package.json \
    ./frontend/package.json \
    2>/dev/null | while read -r directory events filename; do
    
    # Skip temporary files and node_modules
    if [[ "$filename" == *"~"* ]] || [[ "$filename" == *".tmp"* ]] || [[ "$directory" == *"node_modules"* ]] || [[ "$directory" == *".next"* ]] || [[ "$directory" == *"dist"* ]]; then
        continue
    fi
    
    full_path="$directory$filename"
    
    # Handle different types of file changes
    case "$directory" in
        *"backend/prisma/"*)
            handle_schema_change "$full_path"
            ;;
        *"backend/src/"*)
            handle_backend_change "$full_path"
            ;;
        *"frontend/src/"*)
            handle_frontend_change "$full_path"
            ;;
        *"nginx/"*)
            handle_nginx_change "$full_path"
            ;;
        *"docker-compose"*)
            handle_docker_change "$full_path"
            ;;
        *"package.json"*)
            handle_package_change "$full_path"
            ;;
    esac
    
    echo ""
done