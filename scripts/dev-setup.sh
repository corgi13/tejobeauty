#!/bin/bash
# dev-setup.sh - Complete development environment setup

echo "🚀 Setting up Tejo Nails Platform development environment..."

# Check prerequisites
echo "Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please install Node.js 18+."
    exit 1
fi

echo "✅ Node.js $(node -v) is installed"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

echo "✅ npm $(npm -v) is installed"

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
    echo "✅ Backend dependencies installed"
else
    echo "✅ Backend dependencies already installed"
fi

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd ../frontend
if [ ! -d "node_modules" ]; then
    npm install
    echo "✅ Frontend dependencies installed"
else
    echo "✅ Frontend dependencies already installed"
fi

cd ..

# Check if .env file exists
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✅ Created .env file from .env.example"
        echo "⚠️  Please edit .env file with your configuration"
    else
        echo "❌ No .env.example file found. Please create .env file manually."
    fi
else
    echo "✅ .env file already exists"
fi

# Check Docker setup
if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
    echo "✅ Docker and Docker Compose are available"
    
    # Start Docker services
    echo "Starting Docker services..."
    docker-compose up -d postgres redis
    
    # Wait for services to be ready
    echo "Waiting for services to be ready..."
    sleep 10
    
    # Run database migrations
    echo "Running database migrations..."
    cd backend
    npx prisma migrate dev --name init
    
    # Seed database
    echo "Seeding database..."
    npm run seed
    
    cd ..
    
    echo "✅ Database setup completed"
else
    echo "⚠️  Docker not available. Please set up PostgreSQL and Redis manually."
fi

echo ""
echo "🎉 Development environment setup completed!"
echo ""
echo "To start development:"
echo "1. Backend: cd backend && npm run start:dev"
echo "2. Frontend: cd frontend && npm run dev"
echo ""
echo "Access points:"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:3001/api"
echo "- API Docs: http://localhost:3001/api/docs"
echo ""
echo "Test the setup with: ./scripts/system-check.sh"