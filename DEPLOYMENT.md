# Tejo Nails Platform - Deployment Guide

## 🚀 Complete Production Deployment

This guide covers deploying the Tejo Nails Platform using both Docker Compose and Kubernetes on your VPS.

## 📋 Prerequisites

### System Requirements

- Ubuntu 20.04+ or similar Linux distribution
- 4GB+ RAM
- 20GB+ storage
- Docker & Docker Compose
- Kubernetes cluster (optional)

### Required Services

- **PostgreSQL** - Primary database
- **Redis** - Caching and session storage
- **Nginx** - Reverse proxy and load balancer
- **Elasticsearch** - Search functionality (optional)
- **Prometheus + Grafana** - Monitoring (optional)

## 🐳 Docker Deployment (Recommended)

### 1. Quick Start

```bash
# Clone and navigate to project
git clone <your-repo>
cd tejo-nails-platform

# Copy and configure environment
cp .env.production .env
# Edit .env with your actual values

# Deploy with Docker Compose
./scripts/deploy-docker.sh
```

### 2. Manual Docker Deployment

```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Run database migrations
docker-compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy

# Check status
docker-compose -f docker-compose.prod.yml ps
```

## ☸️ Kubernetes Deployment

### 1. Prerequisites

```bash
# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Verify cluster access
kubectl cluster-info
```

### 2. Deploy to Kubernetes

```bash
# Deploy all services
./scripts/deploy-k8s.sh

# Or deploy manually
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/redis.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml
```

## 🔧 Configuration

### Environment Variables (.env.production)

```bash
# Database
POSTGRES_DB=tejo_nails_platform
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password

# Redis
REDIS_PASSWORD=your_redis_password

# Backend
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=sk_live_your_stripe_key

# Frontend
NEXT_PUBLIC_API_URL=https://your-domain.com/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
```

### SSL Certificates

```bash
# Generate self-signed (development)
openssl req -x509 -newkey rsa:4096 -keyout nginx/ssl/key.pem -out nginx/ssl/cert.pem -days 365 -nodes

# Or use Let's Encrypt (production)
certbot certonly --nginx -d your-domain.com
```

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐
│     Nginx       │    │   Kubernetes    │
│  Load Balancer  │    │    Cluster      │
└─────────────────┘    └─────────────────┘
         │                       │
    ┌────▼────┐              ┌───▼───┐
    │Frontend │              │ Pods  │
    │Next.js  │              │       │
    └─────────┘              └───────┘
         │
    ┌────▼────┐         ┌─────────────┐
    │Backend  │◄────────┤ PostgreSQL  │
    │NestJS   │         │  Database   │
    └─────────┘         └─────────────┘
         │
    ┌────▼────┐         ┌─────────────┐
    │ Redis   │         │Elasticsearch│
    │ Cache   │         │   Search    │
    └─────────┘         └─────────────┘
```

## 📊 Services & Ports

| Service       | Port   | URL                         |
| ------------- | ------ | --------------------------- |
| Frontend      | 3000   | https://138.199.226.201     |
| Backend API   | 3002   | https://138.199.226.201/api |
| PostgreSQL    | 5432   | Internal only               |
| Redis         | 6379   | Internal only               |
| Nginx         | 80/443 | https://138.199.226.201     |
| Grafana       | 3001   | http://138.199.226.201:3001 |
| Prometheus    | 9090   | http://138.199.226.201:9090 |
| Elasticsearch | 9200   | Internal only               |

## 🔍 Monitoring & Health Checks

### Health Check Endpoints

- Backend: `GET /api/system-health`
- Frontend: `GET /`
- Database: `pg_isready`
- Redis: `redis-cli ping`

### Monitoring Stack

- **Prometheus**: Metrics collection
- **Grafana**: Dashboards and visualization
- **Nginx**: Access logs and metrics
- **Application**: Custom metrics and logging

## 🛠️ Maintenance Commands

### Docker Commands

```bash
# View logs
docker-compose -f docker-compose.prod.yml logs -f [service]

# Restart service
docker-compose -f docker-compose.prod.yml restart [service]

# Update and redeploy
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d

# Backup database
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U postgres tejo_nails_platform > backup.sql
```

### Kubernetes Commands

```bash
# View pods
kubectl get pods -n tejo-nails

# View logs
kubectl logs -f deployment/backend -n tejo-nails

# Scale deployment
kubectl scale deployment backend --replicas=3 -n tejo-nails

# Update deployment
kubectl set image deployment/backend backend=tejo-nails-backend:v2 -n tejo-nails
```

## 🔒 Security Considerations

### SSL/TLS

- Use Let's Encrypt for production certificates
- Enable HSTS headers
- Configure secure cipher suites

### Database Security

- Use strong passwords
- Enable SSL connections
- Regular security updates

### Application Security

- JWT token expiration
- Rate limiting
- Input validation
- CORS configuration

## 📈 Scaling

### Horizontal Scaling

- Frontend: Multiple Next.js instances
- Backend: Multiple NestJS instances
- Database: Read replicas
- Redis: Redis Cluster

### Vertical Scaling

- Increase CPU/Memory limits
- Optimize database queries
- Implement caching strategies

## 🚨 Troubleshooting

### Common Issues

1. **Port 3002 Connection Refused**

   ```bash
   # Check if backend is running
   docker-compose -f docker-compose.prod.yml ps backend

   # Check logs
   docker-compose -f docker-compose.prod.yml logs backend
   ```

2. **Database Connection Issues**

   ```bash
   # Check PostgreSQL status
   docker-compose -f docker-compose.prod.yml exec postgres pg_isready

   # Check connection string
   echo $DATABASE_URL
   ```

3. **Frontend Build Errors**

   ```bash
   # Clear Next.js cache
   docker-compose -f docker-compose.prod.yml exec frontend rm -rf .next

   # Rebuild
   docker-compose -f docker-compose.prod.yml build frontend
   ```

### Log Locations

- Nginx: `/var/log/nginx/`
- Application: `docker-compose logs`
- System: `/var/log/syslog`

## 🔄 CI/CD Pipeline

### GitHub Actions (Example)

```yaml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to server
        run: |
          ssh user@138.199.226.201 'cd /path/to/app && git pull && ./scripts/deploy-docker.sh'
```

## 📞 Support

For deployment issues:

1. Check service logs
2. Verify environment variables
3. Ensure all ports are accessible
4. Check firewall settings
5. Verify SSL certificates

---

**🎉 Your Tejo Nails Platform is now ready for production!**
