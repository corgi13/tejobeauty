#!/bin/bash
# quick-start.sh - Quick start script for Tejo Nails Platform

echo "🚀 Tejo Nails Platform - Quick Start"
echo "====================================="

# Check if this is the first run
if [ ! -f ".env" ] && [ ! -d "backend/node_modules" ] && [ ! -d "frontend/node_modules" ]; then
    echo "First time setup detected. Running full development setup..."
    ./scripts/dev-setup.sh
    exit $?
fi

echo "Starting development environment..."

# Check if services are already running
BACKEND_RUNNING=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/system-health 2>/dev/null)
FRONTEND_RUNNING=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null)

if [ "$BACKEND_RUNNING" = "200" ] && [ "$FRONTEND_RUNNING" = "200" ]; then
    echo "✅ Services are already running!"
    echo "- Frontend: http://localhost:3000"
    echo "- Backend API: http://localhost:3001/api"
    echo "- API Docs: http://localhost:3001/api/docs"
    exit 0
fi

# Start Docker services if available
if command -v docker-compose &> /dev/null; then
    echo "Starting Docker services..."
    docker-compose up -d postgres redis
    sleep 5
fi

# Start backend in background
if [ "$BACKEND_RUNNING" != "200" ]; then
    echo "Starting backend..."
    cd backend
    npm run start:dev &
    BACKEND_PID=$!
    cd ..
    echo "Backend starting with PID: $BACKEND_PID"
fi

# Start frontend in background
if [ "$FRONTEND_RUNNING" != "200" ]; then
    echo "Starting frontend..."
    cd frontend
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    echo "Frontend starting with PID: $FRONTEND_PID"
fi

# Wait for services to be ready
echo "Waiting for services to start..."
for i in {1..30}; do
    BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/system-health 2>/dev/null)
    FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null)
    
    if [ "$BACKEND_STATUS" = "200" ] && [ "$FRONTEND_STATUS" = "200" ]; then
        echo "✅ All services are ready!"
        break
    fi
    
    echo "Waiting... ($i/30)"
    sleep 2
done

# Final status check
echo ""
echo "🎉 Tejo Nails Platform is ready!"
echo ""
echo "Access points:"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:3001/api"
echo "- API Documentation: http://localhost:3001/api/docs"
echo ""
echo "Default admin credentials:"
echo "- Email: admin@tejonails.com"
echo "- Password: admin123"
echo ""
echo "To stop services:"
echo "- Press Ctrl+C to stop this script"
echo "- Or run: pkill -f 'npm run'"
echo ""
echo "For more options, run: ./scripts/project-info.sh"

# Keep script running to maintain services
trap 'echo "Stopping services..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit' INT

# Wait for user to stop
while true; do
    sleep 1
done