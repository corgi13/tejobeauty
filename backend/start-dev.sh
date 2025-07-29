#!/bin/bash

# Tejo Nails Platform - Development Startup Script
echo "🚀 Starting Tejo Nails Platform Backend..."

# Kill any existing processes on port 3002
echo "🔄 Cleaning up existing processes..."
fuser -k 3002/tcp 2>/dev/null || true
pkill -f "nest start" 2>/dev/null || true

# Wait a moment for processes to terminate
sleep 2

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create .env file with required environment variables."
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate --no-engine

# Start the application
echo "🎯 Starting NestJS application on port 3002..."
npm run start:dev