#!/bin/bash

set -e

echo "=== Development Workflow Setup ==="
echo "This script sets up a development environment that works alongside production"
echo ""

# Step 1: Check if production is running
echo "Step 1: Checking production status..."
if sudo docker-compose -f docker-compose.production.yml ps | grep -q "Up"; then
    echo "✓ Production services are running"
    PROD_RUNNING=true
else
    echo "⚠ Production services are not running"
    PROD_RUNNING=false
fi

echo ""

# Step 2: Set up development environment
echo "Step 2: Setting up development environment..."

# Create development docker-compose for isolated development
cat > docker-compose.dev.yml << EOF
version: '3.8'

services:
  # Development PostgreSQL (separate from production)
  postgres-dev:
    image: postgres:15-alpine
    container_name: tejo-nails-postgres-dev
    restart: unless-stopped
    environment:
      POSTGRES_DB: tejo_nails_platform_dev
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5433:5432"  # Different port to avoid conflict
    volumes:
      - postgres_dev_data:/var/lib/postgresql/data
    networks:
      - tejo-nails-dev-network

  # Development Redis (separate from production)
  redis-dev:
    image: redis:7-alpine
    container_name: tejo-nails-redis-dev
    restart: unless-stopped
    ports:
      - "6380:6379"  # Different port to avoid conflict
    volumes:
      - redis_dev_data:/data
    networks:
      - tejo-nails-dev-network

volumes:
  postgres_dev_data:
  redis_dev_data:

networks:
  tejo-nails-dev-network:
    driver: bridge
EOF

# Start development databases
echo "Starting development databases..."
sudo docker-compose -f docker-compose.dev.yml up -d

# Wait for databases to be ready
sleep 10

# Step 3: Set up development environment variables
echo ""
echo "Step 3: Setting up development environment..."

# Create development .env file
cat > .env.development << EOF
# Development Database (separate from production)
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/tejo_nails_platform_dev?schema=public"
REDIS_URL="redis://localhost:6380"

# Development settings
NODE_ENV=development
PORT=3003  # Different port for dev backend
FRONTEND_URL=http://localhost:3001  # Different port for dev frontend

# Same secrets as production (for consistency)
JWT_SECRET=$(grep JWT_SECRET .env.production 2>/dev/null | cut -d'=' -f2 || echo "dev-jwt-secret")
STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY:-}
EMAIL_HOST=${EMAIL_HOST:-}
EMAIL_PORT=${EMAIL_PORT:-587}
EMAIL_USER=${EMAIL_USER:-}
EMAIL_PASS=${EMAIL_PASS:-}
EOF

# Create development frontend .env
cat > frontend/.env.development << EOF
NEXT_PUBLIC_API_URL=http://localhost:3003/api
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3001
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:-}
EOF

# Step 4: Create development startup script
echo ""
echo "Step 4: Creating development startup script..."

cat > scripts/start-dev.sh << 'EOF'
#!/bin/bash

echo "=== Starting Development Environment ==="
echo ""

# Start development databases if not running
if ! sudo docker-compose -f docker-compose.dev.yml ps | grep -q "Up"; then
    echo "Starting development databases..."
    sudo docker-compose -f docker-compose.dev.yml up -d
    sleep 10
fi

# Load development environment
export $(cat .env.development | xargs)

# Start backend in development mode
echo "Starting backend in development mode (port 3003)..."
cd backend
npm run start:dev &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 10

# Start frontend in development mode
echo "Starting frontend in development mode (port 3001)..."
cd frontend
PORT=3001 npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "=== Development Environment Started ==="
echo "🏠 Frontend: http://localhost:3001"
echo "🏠 Backend: http://localhost:3003"
echo "🏠 API: http://localhost:3003/api"
echo "🏠 API Docs: http://localhost:3003/api/docs"
echo ""
echo "Production site remains live at: https://tejo-nails.com"
echo ""
echo "Process IDs:"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "To stop development:"
echo "kill $BACKEND_PID $FRONTEND_PID"
echo "sudo docker-compose -f docker-compose.dev.yml down"
EOF

chmod +x scripts/start-dev.sh

# Step 5: Create hot reload deployment script
echo ""
echo "Step 5: Creating hot reload deployment script..."

cat > scripts/deploy-to-production.sh << 'EOF'
#!/bin/bash

set -e

echo "=== Deploying Changes to Production ==="
echo ""

# Build new images
echo "Building new Docker images..."
sudo docker-compose -f docker-compose.production.yml build --no-cache

# Rolling update (zero downtime)
echo "Performing rolling update..."
sudo docker-compose -f docker-compose.production.yml up -d

# Wait for services to be healthy
echo "Waiting for services to be healthy..."
sleep 30

# Test deployment
echo "Testing deployment..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://tejo-nails.com/api/system-health || echo "000")
if [ "$RESPONSE" = "200" ]; then
    echo "✓ Deployment successful!"
else
    echo "✗ Deployment failed (HTTP $RESPONSE)"
    echo "Rolling back..."
    sudo docker-compose -f docker-compose.production.yml restart
    exit 1
fi

echo ""
echo "🎉 Production updated successfully!"
echo "Changes are now live at https://tejo-nails.com"
EOF

chmod +x scripts/deploy-to-production.sh

# Step 6: Create monitoring script
echo ""
echo "Step 6: Creating monitoring script..."

cat > scripts/monitor.sh << 'EOF'
#!/bin/bash

echo "=== Tejo Nails Platform Status ==="
echo ""

# Production status
echo "Production Services:"
if sudo docker-compose -f docker-compose.production.yml ps | grep -q "Up"; then
    echo "✓ Production is running"
    sudo docker-compose -f docker-compose.production.yml ps
else
    echo "✗ Production is down"
fi

echo ""

# Development status
echo "Development Services:"
if sudo docker-compose -f docker-compose.dev.yml ps | grep -q "Up"; then
    echo "✓ Development databases are running"
    sudo docker-compose -f docker-compose.dev.yml ps
else
    echo "✗ Development databases are down"
fi

# Check development processes
if pgrep -f "nest start --watch" > /dev/null; then
    echo "✓ Development backend is running"
else
    echo "✗ Development backend is down"
fi

if pgrep -f "next dev" > /dev/null; then
    echo "✓ Development frontend is running"
else
    echo "✗ Development frontend is down"
fi

echo ""

# Website status
echo "Website Status:"
PROD_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://tejo-nails.com || echo "000")
echo "Production: https://tejo-nails.com ($PROD_STATUS)"

DEV_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001 || echo "000")
echo "Development: http://localhost:3001 ($DEV_STATUS)"
EOF

chmod +x scripts/monitor.sh

echo ""
echo "=== Development Workflow Setup Complete ==="
echo ""
echo "🎯 Available Commands:"
echo ""
echo "Start development environment:"
echo "  ./scripts/start-dev.sh"
echo ""
echo "Deploy changes to production:"
echo "  ./scripts/deploy-to-production.sh"
echo ""
echo "Monitor all services:"
echo "  ./scripts/monitor.sh"
echo ""
echo "🔄 Development Workflow:"
echo "1. Make changes to your code"
echo "2. Test in development (http://localhost:3001)"
echo "3. Deploy to production (./scripts/deploy-to-production.sh)"
echo "4. Production stays live at https://tejo-nails.com"
echo ""
echo "📊 Current Status:"
if [ "$PROD_RUNNING" = true ]; then
    echo "✓ Production is running at https://tejo-nails.com"
else
    echo "⚠ Production needs to be started with ./scripts/deploy-production-docker.sh"
fi