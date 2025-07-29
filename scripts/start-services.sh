#!/bin/bash

set -e  # Exit on any error

echo "=== Tejo Nails Platform Startup Script ==="
echo "Starting services with configuration validation..."
echo ""

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Function to wait for service to be ready
wait_for_service() {
    local url=$1
    local service_name=$2
    local max_attempts=30
    local attempt=1
    
    echo "Waiting for $service_name to be ready..."
    while [ $attempt -le $max_attempts ]; do
        if curl -s -f "$url" >/dev/null 2>&1; then
            echo "✓ $service_name is ready!"
            return 0
        fi
        echo "Attempt $attempt/$max_attempts - $service_name not ready yet..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo "✗ $service_name failed to start within timeout"
    return 1
}

# Step 1: Validate environment
echo "Step 1: Validating environment configuration..."
if [ -f "./scripts/validate-env.sh" ]; then
    ./scripts/validate-env.sh
    if [ $? -ne 0 ]; then
        echo "✗ Environment validation failed"
        exit 1
    fi
else
    echo "⚠ Environment validation script not found, skipping..."
fi
echo ""

# Step 2: Check for port conflicts
echo "Step 2: Checking for port conflicts..."
if check_port 3000; then
    echo "⚠ Port 3000 is already in use. Stopping existing process..."
    pkill -f "next dev" || true
    sleep 2
fi

if check_port 3002; then
    echo "⚠ Port 3002 is already in use. Stopping existing process..."
    pkill -f "nest" || true
    sleep 2
fi
echo ""

# Step 3: Install dependencies if needed
echo "Step 3: Checking dependencies..."

# Backend dependencies
if [ ! -d "backend/node_modules" ]; then
    echo "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
else
    echo "✓ Backend dependencies already installed"
fi

# Frontend dependencies
if [ ! -d "frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
else
    echo "✓ Frontend dependencies already installed"
fi
echo ""

# Step 4: Start backend service
echo "Step 4: Starting backend service..."
cd backend
npm run start:dev &
BACKEND_PID=$!
cd ..

# Wait for backend to be ready
if wait_for_service "http://localhost:3002/api/system-health" "Backend API"; then
    echo "✓ Backend started successfully (PID: $BACKEND_PID)"
else
    echo "✗ Backend failed to start"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi
echo ""

# Step 5: Start frontend service
echo "Step 5: Starting frontend service..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Wait for frontend to be ready
if wait_for_service "http://localhost:3000" "Frontend"; then
    echo "✓ Frontend started successfully (PID: $FRONTEND_PID)"
else
    echo "✗ Frontend failed to start"
    kill $FRONTEND_PID 2>/dev/null || true
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi
echo ""

# Step 6: Final validation
echo "Step 6: Final service validation..."
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:3002/api"
echo "API Documentation: http://localhost:3002/api/docs"
echo ""

# Test API connectivity
echo "Testing API connectivity..."
if curl -s -f "http://localhost:3002/api/system-health" >/dev/null 2>&1; then
    echo "✓ API is accessible"
else
    echo "⚠ API connectivity test failed"
fi

echo ""
echo "=== Services Started Successfully ==="
echo "Frontend PID: $FRONTEND_PID"
echo "Backend PID: $BACKEND_PID"
echo ""
echo "To stop services, run:"
echo "kill $FRONTEND_PID $BACKEND_PID"
echo ""
echo "Or use: pkill -f 'next dev' && pkill -f 'nest'"