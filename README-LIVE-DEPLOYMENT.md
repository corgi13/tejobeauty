# Live Deployment Guide for Tejo Nails Platform

This guide explains how to deploy and manage the Tejo Nails Platform on your VPS with the domain tejo-nails.com.

## Prerequisites

- VPS with Ubuntu/Debian
- Domain name (tejo-nails.com) with DNS configured to point to your VPS IP
- Node.js and npm installed
- Nginx installed

## Deployment Options

### 1. Development Mode with Live Changes

This mode runs the frontend and backend in development mode with hot reload, so changes are visible immediately.

```bash
./scripts/deploy-direct-live.sh
```

**Features:**

- Hot reload for both frontend and backend
- Changes visible immediately
- SSL via self-signed certificate or Let's Encrypt
- Accessible via domain name or IP address

### 2. Production Mode

This mode builds the frontend and backend for production and runs them in Docker containers.

```bash
./scripts/deploy-live.sh
```

**Features:**

- Optimized production builds
- Docker containerization
- SSL via Let's Encrypt
- High performance and stability

## Managing the Deployment

### Stopping Services

```bash
./scripts/stop-services.sh
```

### Checking Status

```bash
# Check if services are running
ps aux | grep node

# Check nginx status
sudo systemctl status nginx

# Check logs
sudo journalctl -u nginx
```

### SSL Certificates

```bash
# Set up or renew SSL certificates
./scripts/setup-ssl.sh
```

## Accessing the Platform

- **Website**: https://tejo-nails.com
- **API**: https://tejo-nails.com/api
- **API Documentation**: https://tejo-nails.com/api/docs
- **Health Check**: https://tejo-nails.com/api/system-health

## Development Workflow

1. Make changes to the code
2. If running in development mode, changes will be applied automatically
3. If running in production mode, redeploy using `./scripts/deploy-live.sh`

## Troubleshooting

### Common Issues

1. **Cannot access the site**
   - Check if nginx is running: `sudo systemctl status nginx`
   - Check nginx logs: `sudo journalctl -u nginx`
   - Verify DNS configuration: `nslookup tejo-nails.com`

2. **SSL certificate issues**
   - Run `./scripts/setup-ssl.sh` to regenerate certificates
   - Check if domain points to correct IP: `nslookup tejo-nails.com`

3. **Backend API not responding**
   - Check if backend is running: `ps aux | grep node`
   - Check backend logs in the terminal where it's running

4. **Frontend not loading**
   - Check if frontend is running: `ps aux | grep next`
   - Check frontend logs in the terminal where it's running

## Updating the Platform

To update the platform with the latest code:

1. Pull the latest code: `git pull`
2. Redeploy using the appropriate script:
   - Development: `./scripts/deploy-direct-live.sh`
   - Production: `./scripts/deploy-live.sh`
