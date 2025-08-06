#!/bin/bash

# 1. Back up the current database
echo "Backing up the database..."
cp backend/prisma/dev.db backend/prisma/dev.db.bak

# 2. Run database migrations
echo "Running database migrations..."
cd backend
npx prisma migrate deploy
cd ..

# 3. Deploys the backend API
echo "Deploying the backend API..."
cd backend
npm install --legacy-peer-deps
npm run build
pm2 restart ecosystem.config.js --env production
cd ..

# 4. Deploys the frontend
echo "Deploying the frontend..."
cd frontend
npm install --legacy-peer-deps
npm run build
cd ..

# 5. Updates configuration
echo "Updating configuration..."

# 6. Verifies the deployment
echo "Verifying the deployment..."
curl -I http://localhost:3001/api/health
