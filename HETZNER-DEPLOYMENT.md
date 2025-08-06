# 🚀 Tejo Beauty - Hetzner Ubuntu 22.04 Deployment

## Quick Deploy

```bash
# Upload project to server
scp -r tejobeauty/ root@your-server-ip:/opt/

# SSH to server
ssh root@your-server-ip

# Navigate and deploy
cd /opt/tejobeauty
chmod +x deploy-hetzner.sh
./deploy-hetzner.sh
```

## Manual Setup

### 1. Install Node.js 18
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Install PM2
```bash
sudo npm install -g pm2
```

### 3. Install Dependencies
```bash
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### 4. Build Applications
```bash
cd backend && npm run build && cd ..
cd frontend && npm run build && cd ..
```

### 5. Start with PM2
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Access URLs

- **Frontend**: http://your-server-ip:3000
- **Backend**: http://your-server-ip:3001
- **API Docs**: http://your-server-ip:3001/api

## PM2 Commands

```bash
pm2 status          # Check status
pm2 logs            # View logs
pm2 restart all     # Restart all
pm2 stop all        # Stop all
pm2 delete all      # Delete all
```

## Firewall Setup

```bash
sudo ufw allow 3000
sudo ufw allow 3001
sudo ufw enable
```

**Platform ready for Hetzner Ubuntu 22.04!** 🎉