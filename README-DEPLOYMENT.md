# Tejo Nails Platform - Production Deployment Guide

## 🚀 Complete Production Setup with Docker & Kubernetes

This guide covers deploying the full Tejo Nails Platform with all services including PostgreSQL, Redis, monitoring, and more.

## 📋 Prerequisites

### For Docker Deployment:

- Docker 20.10+
- Docker Compose 2.0+
- 4GB+ RAM
- 20GB+ disk space

### For Kubernetes Deployment:

- Kubernetes cluster (1.20+)
- kubectl configured
- Helm 3.0+ (optional)
- 8GB+ RAM
- 50GB+ disk space

## 🛠 Services Included

### Core Services:

- **Frontend**: Next.js 14 application
- **Backend**: NestJS API server
- **PostgreSQL**: Primary database
- **Redis**: Caching and sessions

### Additional Services:

- **Nginx**: Reverse proxy and load balancer
- **pgAdmin**: Database management UI
- **Redis Commander**: Redis management UI
- **Elasticsearch**: Advanced search (optional)
- **Kibana**: Search analytics (optional)
- **Prometheus**: Metrics collection
- **Grafana**: Monitoring dashboards

## 🚀 Quick Start

### 1. Clone and Configure

```bash
git clone <repository-url>
cd tejo-nails-platform

# Copy and edit environment variables
cp .env.production.template .env.production
nano .env.production  # Edit with your actual values
```

### 2. Deploy with Docker

```bash
# Make deployment script executable
chmod +x deploy.sh

# Deploy with Docker Compose
./deploy.sh docker
```

### 3. Deploy with Kubernetes

```bash
# Deploy with Kubernetes
./deploy.sh k8s
```

## 🔧 Configuration

### Environment Variables (.env.production)

```bash
# Database
POSTGRES_PASSWORD=your-secure-postgres-password
REDIS_PASSWORD=your-secure-redis-password

# Security
JWT_SECRET=your-super-secure-jwt-secret-key

# External Services
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Search & Storage
ALGOLIA_APP_ID=your_algolia_app_id
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```

## 📊 Service URLs

After deployment, access services at:

- **Frontend**: http://138.199.226.201:3000
- **Backend API**: http://138.199.226.201:3001/api
- **API Documentation**: http://138.199.226.201:3001/api/docs
- **pgAdmin**: http://138.199.226.201:5050
- **Redis Commander**: http://138.199.226.201:8081
- **Grafana**: http://138.199.226.201:3001
- **Prometheus**: http://138.199.226.201:9090
- **Elasticsearch**: http://138.199.226.201:9200
- **Kibana**: http://138.199.226.201:5601

## 🔒 Security Features

### SSL/TLS Configuration

- Automatic HTTPS redirect
- Modern TLS protocols (1.2, 1.3)
- Security headers (HSTS, CSP, etc.)
- Rate limiting

### Network Security

- Internal Docker network isolation
- Kubernetes network policies
- Service-to-service authentication
- Database connection encryption

## 📈 Monitoring & Observability

### Metrics Collection

- Application metrics via Prometheus
- Database performance monitoring
- Redis cache hit rates
- Nginx access logs and metrics

### Dashboards

- Grafana dashboards for all services
- Real-time performance monitoring
- Alert configuration
- Custom business metrics

## 🔄 Scaling

### Docker Compose Scaling

```bash
# Scale backend instances
docker-compose -f docker-compose.prod.yml up -d --scale backend=3

# Scale frontend instances
docker-compose -f docker-compose.prod.yml up -d --scale frontend=2
```

### Kubernetes Auto-scaling

- Horizontal Pod Autoscaler (HPA) configured
- CPU and memory-based scaling
- Custom metrics scaling support

## 🛡 Backup Strategy

### Database Backups

```bash
# Manual backup
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U postgres tejo_nails_platform > backup.sql

# Automated backups (add to cron)
0 2 * * * /path/to/backup-script.sh
```

### Redis Backups

```bash
# Redis persistence is enabled with AOF
# Backups are automatic via volume mounts
```

## 🚨 Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3000, 3001, 5432, 6379 are available
2. **Memory issues**: Increase Docker memory limits
3. **Database connection**: Check DATABASE_URL format
4. **SSL certificates**: Configure Let's Encrypt or upload certificates

### Health Checks

```bash
# Check all services
docker-compose -f docker-compose.prod.yml ps

# Check logs
docker-compose -f docker-compose.prod.yml logs backend
docker-compose -f docker-compose.prod.yml logs frontend

# Test API health
curl http://138.199.226.201:3001/api/system-health
```

### Kubernetes Debugging

```bash
# Check pod status
kubectl get pods -n tejo-nails

# Check logs
kubectl logs -f deployment/backend -n tejo-nails
kubectl logs -f deployment/frontend -n tejo-nails

# Describe resources
kubectl describe deployment backend -n tejo-nails
```

## 🔄 Updates & Maintenance

### Rolling Updates

```bash
# Docker Compose
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d

# Kubernetes
kubectl set image deployment/backend backend=tejo-nails/backend:v2.0.0 -n tejo-nails
kubectl set image deployment/frontend frontend=tejo-nails/frontend:v2.0.0 -n tejo-nails
```

### Database Migrations

```bash
# Run migrations
docker-compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy

# Or in Kubernetes
kubectl exec -it deployment/backend -n tejo-nails -- npx prisma migrate deploy
```

## 📞 Support

For deployment issues:

1. Check the troubleshooting section
2. Review service logs
3. Verify environment variables
4. Check network connectivity
5. Validate SSL certificates

## 🎯 Performance Optimization

### Recommended Settings

- **CPU**: 2+ cores per service
- **Memory**: 512MB+ per service
- **Storage**: SSD recommended
- **Network**: 1Gbps+ for production

### Caching Strategy

- Redis for session storage
- Application-level caching
- CDN for static assets
- Database query optimization

## 🔐 Production Checklist

- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] Database backups scheduled
- [ ] Monitoring alerts configured
- [ ] Security headers enabled
- [ ] Rate limiting configured
- [ ] Log rotation setup
- [ ] Health checks working
- [ ] Auto-scaling configured
- [ ] Disaster recovery plan

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [NestJS Production Guide](https://docs.nestjs.com/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [PostgreSQL Administration](https://www.postgresql.org/docs/)
- [Redis Administration](https://redis.io/documentation)
