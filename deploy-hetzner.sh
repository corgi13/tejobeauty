#!/bin/bash

echo "🚀 Deploying Tejo Beauty to Hetzner Ubuntu 22.04"

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install dependencies
echo "Installing backend dependencies..."
cd backend && npm install && cd ..

echo "Installing frontend dependencies..."
cd frontend && npm install && cd ..

# Build applications
echo "Building applications..."
cd backend && npm run build && cd ..
cd frontend && npm run build && cd ..

# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [
    {
      name: 'tejo-beauty-backend',
      cwd: './backend',
      script: 'dist/main.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      }
    },
    {
      name: 'tejo-beauty-frontend',
      cwd: './frontend',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
EOF

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup

echo "✅ Tejo Beauty deployed on Hetzner!"
echo "Backend: http://your-server-ip:3001"
echo "Frontend: http://your-server-ip:3000"