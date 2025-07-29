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
