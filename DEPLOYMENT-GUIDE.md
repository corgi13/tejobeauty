# Tejo Beauty - Complete Deployment Guide

## 🚀 Overview

This guide provides step-by-step instructions for deploying the complete Tejo Beauty B2B platform with all advanced features.

## 📋 Prerequisites

### System Requirements
- **Server**: Ubuntu 20.04+ or CentOS 8+ (minimum 4GB RAM, 2 CPU cores)
- **Domain**: tejo-beauty.com (purchased and configured)
- **SSL Certificate**: Let's Encrypt or commercial SSL
- **Docker**: Version 20.10+
- **Docker Compose**: Version 2.0+

### Required Accounts & APIs
- **Database**: PostgreSQL 15+
- **Cache**: Redis 7+
- **Search**: Elasticsearch 8+
- **Email**: SMTP provider (Gmail, SendGrid, etc.)
- **Payment**: Stripe account
- **Storage**: AWS S3 or compatible
- **Monitoring**: Sentry.io (optional)

## 🛠️ Installation Steps

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install additional tools
sudo apt install -y nginx certbot python3-certbot-nginx git curl wget
```

### 2. Project Setup

```bash
# Clone repository
git clone https://github.com/your-username/tejo-beauty-platform.git
cd tejo-beauty-platform

# Create environment file
cp .env.tejo-beauty .env

# Edit environment variables
nano .env
```

### 3. Environment Configuration

Update `.env` file with your actual values:

```bash
# Application
APP_NAME="Tejo Beauty"
APP_URL="https://tejo-beauty.com"
APP_ENV="production"

# Database
DATABASE_URL="postgresql://tejo_beauty_user:YOUR_SECURE_PASSWORD@localhost:5432/tejo_beauty"
POSTGRES_PASSWORD="YOUR_SECURE_PASSWORD"

# Redis
REDIS_PASSWORD="YOUR_REDIS_PASSWORD"

# Security
JWT_SECRET="YOUR_JWT_SECRET_KEY_MINIMUM_32_CHARS"
CSRF_SECRET="YOUR_CSRF_SECRET_KEY"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="noreply@tejo-beauty.com"
SMTP_PASSWORD="YOUR_EMAIL_PASSWORD"

# Payment
STRIPE_PUBLIC_KEY="pk_live_YOUR_STRIPE_PUBLIC_KEY"
STRIPE_SECRET_KEY="sk_live_YOUR_STRIPE_SECRET_KEY"

# AWS S3
AWS_ACCESS_KEY_ID="YOUR_AWS_ACCESS_KEY"
AWS_SECRET_ACCESS_KEY="YOUR_AWS_SECRET_KEY"
AWS_S3_BUCKET="tejo-beauty-assets"

# External APIs
GOOGLE_MAPS_API_KEY="YOUR_GOOGLE_MAPS_API_KEY"
EXCHANGE_RATE_API_KEY="YOUR_EXCHANGE_RATE_API_KEY"
```

### 4. SSL Certificate Setup

```bash
# Install SSL certificate
sudo certbot --nginx -d tejo-beauty.com -d www.tejo-beauty.com -d api.tejo-beauty.com -d admin.tejo-beauty.com

# Verify auto-renewal
sudo certbot renew --dry-run
```

### 5. Database Migration

```bash
# Run complete rebranding
node rebrand-complete.js

# Initialize database
cd deployment
chmod +x deploy.sh
./deploy.sh deploy
```

### 6. Domain Configuration

Update your DNS records:

```
A     tejo-beauty.com          → YOUR_SERVER_IP
A     www.tejo-beauty.com      → YOUR_SERVER_IP
A     api.tejo-beauty.com      → YOUR_SERVER_IP
A     admin.tejo-beauty.com    → YOUR_SERVER_IP
CNAME cdn.tejo-beauty.com      → YOUR_CDN_URL
```

## 🔧 Advanced Configuration

### Multi-Warehouse Setup

```bash
# Enable multi-warehouse in environment
echo "ENABLE_MULTI_WAREHOUSE=true" >> .env
echo "DEFAULT_WAREHOUSE_ID=warehouse_zagreb_001" >> .env

# Configure warehouse locations
docker exec tejo-beauty-backend npx prisma db seed --preview-feature
```

### Elasticsearch Configuration

```bash
# Configure search indices
docker exec tejo-beauty-elasticsearch curl -X PUT "localhost:9200/tejo_beauty_products" -H 'Content-Type: application/json' -d'
{
  "mappings": {
    "properties": {
      "name": { "type": "text", "analyzer": "standard" },
      "description": { "type": "text" },
      "sku": { "type": "keyword" },
      "price": { "type": "float" },
      "category": { "type": "keyword" },
      "tags": { "type": "keyword" }
    }
  }
}'
```

### Redis Configuration

```bash
# Configure Redis for optimal performance
docker exec tejo-beauty-redis redis-cli CONFIG SET maxmemory-policy allkeys-lru
docker exec tejo-beauty-redis redis-cli CONFIG SET save "900 1 300 10 60 10000"
```

## 📱 Mobile App Deployment

### iOS Deployment

```bash
# Navigate to mobile directory
cd mobile/ios

# Install dependencies
pod install

# Build for production
xcodebuild -workspace TejoBeauty.xcworkspace -scheme TejoBeauty -configuration Release -archivePath TejoBeauty.xcarchive archive

# Upload to App Store Connect
# Use Xcode or Application Loader
```

### Android Deployment

```bash
# Navigate to mobile directory
cd mobile/android

# Build release APK
./gradlew assembleRelease

# Sign APK (configure keystore first)
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore tejo-beauty.keystore app-release-unsigned.apk tejo-beauty

# Upload to Google Play Console
```

## 🔍 Monitoring & Analytics

### Prometheus & Grafana Setup

```bash
# Start monitoring stack
docker-compose -f monitoring/docker-compose.yml up -d

# Access Grafana
# URL: http://your-server:3002
# Default: admin/admin (change immediately)
```

### Log Management

```bash
# Configure log rotation
sudo nano /etc/logrotate.d/tejo-beauty

# Add configuration:
/var/log/tejo-beauty/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        docker-compose restart nginx
    endscript
}
```

## 🔒 Security Hardening

### Firewall Configuration

```bash
# Configure UFW firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### Security Headers

```bash
# Verify security headers
curl -I https://tejo-beauty.com

# Should include:
# Strict-Transport-Security: max-age=63072000
# X-Frame-Options: SAMEORIGIN
# X-Content-Type-Options: nosniff
# X-XSS-Protection: 1; mode=block
```

### Database Security

```bash
# Secure PostgreSQL
docker exec tejo-beauty-postgres psql -U postgres -c "ALTER USER tejo_beauty_user WITH PASSWORD 'NEW_SECURE_PASSWORD';"

# Update connection string in .env
sed -i 's/OLD_PASSWORD/NEW_SECURE_PASSWORD/g' .env
```

## 📊 Performance Optimization

### Database Optimization

```sql
-- Connect to database
docker exec -it tejo-beauty-postgres psql -U tejo_beauty_user -d tejo_beauty

-- Create indexes for better performance
CREATE INDEX CONCURRENTLY idx_products_category_active ON products(category_id, is_active);
CREATE INDEX CONCURRENTLY idx_orders_user_status ON orders(user_id, status);
CREATE INDEX CONCURRENTLY idx_quotes_user_status ON quotes(user_id, status);
CREATE INDEX CONCURRENTLY idx_bulk_orders_business_status ON bulk_orders(business_profile_id, status);

-- Analyze tables
ANALYZE;
```

### Redis Optimization

```bash
# Configure Redis memory optimization
docker exec tejo-beauty-redis redis-cli CONFIG SET maxmemory 1gb
docker exec tejo-beauty-redis redis-cli CONFIG SET maxmemory-policy allkeys-lru
```

### CDN Setup

```bash
# Configure CloudFlare or AWS CloudFront
# Point cdn.tejo-beauty.com to your CDN
# Configure caching rules for static assets
```

## 🔄 Backup & Recovery

### Automated Backups

```bash
# Create backup script
cat > /usr/local/bin/tejo-beauty-backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backups/tejo-beauty"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Database backup
docker exec tejo-beauty-postgres pg_dump -U tejo_beauty_user tejo_beauty > $BACKUP_DIR/db_$DATE.sql

# Files backup
tar -czf $BACKUP_DIR/files_$DATE.tar.gz /var/lib/docker/volumes/tejo-beauty_uploads

# Upload to S3 (optional)
aws s3 cp $BACKUP_DIR/ s3://tejo-beauty-backups/ --recursive

# Cleanup old backups (keep 30 days)
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
EOF

chmod +x /usr/local/bin/tejo-beauty-backup.sh

# Add to crontab
echo "0 2 * * * /usr/local/bin/tejo-beauty-backup.sh" | crontab -
```

### Recovery Process

```bash
# Stop services
./deploy.sh stop

# Restore database
docker exec -i tejo-beauty-postgres psql -U tejo_beauty_user tejo_beauty < backup_file.sql

# Restore files
tar -xzf files_backup.tar.gz -C /var/lib/docker/volumes/tejo-beauty_uploads/

# Start services
./deploy.sh start
```

## 🚀 Go Live Checklist

### Pre-Launch
- [ ] All environment variables configured
- [ ] SSL certificates installed and working
- [ ] Database migrations completed
- [ ] Search indices created and populated
- [ ] Email templates tested
- [ ] Payment processing tested
- [ ] Mobile apps submitted to stores
- [ ] DNS records configured
- [ ] CDN configured
- [ ] Monitoring setup
- [ ] Backup system tested

### Launch Day
- [ ] Final deployment executed
- [ ] Health checks passing
- [ ] Performance monitoring active
- [ ] Error tracking configured
- [ ] Customer support ready
- [ ] Social media updated
- [ ] Press release sent (if applicable)

### Post-Launch
- [ ] Monitor application performance
- [ ] Check error logs regularly
- [ ] Verify backup system
- [ ] Update documentation
- [ ] Plan feature updates
- [ ] Collect user feedback

## 📞 Support & Maintenance

### Regular Maintenance Tasks

```bash
# Weekly tasks
./deploy.sh verify
./deploy.sh cleanup
docker system prune -f

# Monthly tasks
sudo certbot renew
apt update && apt upgrade
docker-compose pull && docker-compose up -d

# Quarterly tasks
Review and update dependencies
Security audit
Performance optimization
Backup system verification
```

### Troubleshooting

```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs -f [service_name]

# Restart specific service
docker-compose restart [service_name]

# Database connection issues
docker exec tejo-beauty-postgres pg_isready -U tejo_beauty_user

# Redis connection issues
docker exec tejo-beauty-redis redis-cli ping

# Elasticsearch issues
curl http://localhost:9200/_cluster/health
```

## 📈 Scaling Considerations

### Horizontal Scaling

```bash
# Load balancer configuration
# Multiple backend instances
# Database read replicas
# Redis clustering
# CDN optimization
```

### Vertical Scaling

```bash
# Increase server resources
# Optimize database queries
# Implement caching strategies
# Use connection pooling
```

---

**🎉 Congratulations!** Your Tejo Beauty B2B platform is now live and ready to serve customers worldwide.

For additional support, please refer to the technical documentation or contact the development team.