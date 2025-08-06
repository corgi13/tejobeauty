#!/bin/bash

echo "🚀 Starting Tejo Beauty Platform on Ubuntu 22.04"
echo "Backend: http://localhost:3001"
echo "Frontend: http://localhost:3000"
echo "API Docs: http://localhost:3001/api"

# Install dependencies if needed
if [ ! -d "backend/node_modules" ]; then
    echo "Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

# Start backend in background
cd backend
npm run start:dev &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 5

# Start frontend in background
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo "✅ Platform started!"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"

# Keep script running
wait