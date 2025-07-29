#!/bin/bash

# Tejo Nails Platform Deployment Script
set -e

echo "🚀 Starting Tejo Nails Platform Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create necessary directories
print_status "Creating necessary directories..."
mkdir -p nginx/ssl
mkdir -p nginx/logs
mkdir -p monitoring/prometheus
mkdir -p monitoring/grafana/dashboards
mkdir -p monitoring/grafana/datasources
mkdir -p backend/uploads

# Set deployment mode
DEPLOYMENT_MODE=${1:-docker}

if [ "$DEPLOYMENT_MODE" = "docker" ]; then
    print_status "Deploying with Docker Compose..."
    
    # Check if .env.production exists
    if [ ! -f .env.production ]; then
        print_warning ".env.production not found. Creating from template..."
        cp .env.production.template .env.production
        print_warning "Please edit .env.production with your actual values before running again."
        exit 1
    fi
    
    # Build and start services
    print_status "Building Docker images..."
    docker-compose -f docker-compose.prod.yml --env-file .env.production build
    
    print_status "Starting services..."
    docker-compose -f docker-compose.prod.yml --env-file .env.production up -d
    
    # Wait for services to be ready
    print_status "Waiting for services to be ready..."
    sleep 30
    
    # Run database migrations
    print_status "Running database migrations..."
    docker-compose -f docker-compose.prod.yml --env-file .env.production exec backend npx prisma migrate deploy
    
    # Generate Prisma client
    print_status "Generating Prisma client..."
    docker-compose -f docker-compose.prod.yml --env-file .env.production exec backend npx prisma generate
    
    print_status "✅ Docker deployment completed!"
    print_status "Frontend: http://138.199.226.201:3000"
    print_status "Backend API: http://138.199.226.201:3001/api"
    print_status "API Docs: http://138.199.226.201:3001/api/docs"
    print_status "pgAdmin: http://138.199.226.201:5050"
    print_status "Redis Commander: http://138.199.226.201:8081"
    print_status "Grafana: http://138.199.226.201:3001"

elif [ "$DEPLOYMENT_MODE" = "k8s" ]; then
    print_status "Deploying with Kubernetes..."
    
    # Check if kubectl is installed
    if ! command -v kubectl &> /dev/null; then
        print_error "kubectl is not installed. Please install kubectl first."
        exit 1
    fi
    
    # Create namespace
    print_status "Creating namespace..."
    kubectl apply -f k8s/namespace.yaml
    
    # Deploy PostgreSQL
    print_status "Deploying PostgreSQL..."
    kubectl apply -f k8s/postgres.yaml
    
    # Deploy Redis
    print_status "Deploying Redis..."
    kubectl apply -f k8s/redis.yaml
    
    # Wait for databases to be ready
    print_status "Waiting for databases to be ready..."
    kubectl wait --for=condition=ready pod -l app=postgres -n tejo-nails --timeout=300s
    kubectl wait --for=condition=ready pod -l app=redis -n tejo-nails --timeout=300s
    
    # Build and push Docker images
    print_status "Building and pushing Docker images..."
    docker build -t tejo-nails/backend:latest -f backend/Dockerfile backend/
    docker build -t tejo-nails/frontend:latest -f frontend/Dockerfile frontend/
    
    # Deploy backend
    print_status "Deploying backend..."
    kubectl apply -f k8s/backend.yaml
    
    # Deploy frontend
    print_status "Deploying frontend..."
    kubectl apply -f k8s/frontend.yaml
    
    # Deploy ingress
    print_status "Deploying ingress..."
    kubectl apply -f k8s/ingress.yaml
    
    # Wait for deployments to be ready
    print_status "Waiting for deployments to be ready..."
    kubectl wait --for=condition=available deployment/backend -n tejo-nails --timeout=300s
    kubectl wait --for=condition=available deployment/frontend -n tejo-nails --timeout=300s
    
    print_status "✅ Kubernetes deployment completed!"
    print_status "Application: https://138.199.226.201"
    print_status "API: https://138.199.226.201/api"

else
    print_error "Invalid deployment mode. Use 'docker' or 'k8s'"
    exit 1
fi

# Health check
print_status "Performing health check..."
sleep 10

if curl -f http://138.199.226.201:3001/api/system-health > /dev/null 2>&1; then
    print_status "✅ Backend health check passed!"
else
    print_warning "⚠️ Backend health check failed. Check logs with: docker-compose -f docker-compose.prod.yml logs backend"
fi

if curl -f http://138.199.226.201:3000 > /dev/null 2>&1; then
    print_status "✅ Frontend health check passed!"
else
    print_warning "⚠️ Frontend health check failed. Check logs with: docker-compose -f docker-compose.prod.yml logs frontend"
fi

print_status "🎉 Deployment completed successfully!"
print_status "Don't forget to:"
print_status "1. Configure SSL certificates"
print_status "2. Set up monitoring alerts"
print_status "3. Configure backups"
print_status "4. Update DNS records if needed"