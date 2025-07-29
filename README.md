# Tejo Nails Platform

A complete e-commerce platform for nail care products with professional features.

## 🚀 Quick Start for Croatian Market Development

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose (optional)

### Local Development Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd tejo-nails-platform
   ```

2. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your local configuration
   ```

3. **Install dependencies**

   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

4. **Run database migrations**

   ```bash
   cd backend
   npx prisma migrate dev
   ```

5. **Seed the database**

   ```bash
   npm run seed
   ```

6. **Start development servers**

   ```bash
   # Backend (from backend directory)
   npm run start:dev

   # Frontend (from frontend directory)
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3002/api
   - API Documentation: http://localhost:3002/api/docs

### Docker Development

```bash
# Start all services
docker-compose up -d

# Run migrations
docker-compose exec backend npx prisma migrate dev

# Seed database
docker-compose exec backend npm run seed
```

## 📁 Project Structure

### Backend (NestJS)

```
backend/
├── prisma/            # Database schema and migrations
├── src/
│   ├── address/       # Address validation module
│   ├── analytics/     # Analytics and reporting
│   ├── auth/          # Authentication and authorization
│   ├── cache/         # Caching system
│   ├── categories/    # Product categories
│   ├── common/        # Shared utilities
│   ├── config/        # Configuration
│   ├── email/         # Email service
│   ├── orders/        # Order management
│   ├── payments/      # Payment processing
│   ├── products/      # Product management
│   ├── professional/  # Professional portal
│   ├── search/        # Search functionality
│   ├── system-health/ # Health monitoring
│   ├── users/         # User management
│   ├── app.module.ts  # Main application module
│   └── main.ts        # Application entry point
```

### Frontend (Next.js)

```
frontend/
├── app/               # App Router pages
│   ├── (auth)/        # Authentication pages
│   ├── (shop)/        # Main shop pages
│   ├── admin/         # Admin dashboard
│   └── layout.tsx     # Root layout
├── components/        # Reusable components
├── lib/               # Utilities and hooks
├── public/            # Static assets
└── store/             # State management
```

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Frontend Tests

```bash
cd frontend

# Run tests
npm run test

# Test with coverage
npm run test:coverage
```

## 🚀 Croatian Production Deployment

### Quick Production Deployment for Croatian Market

```bash
# Deploy to Croatian production environment
sudo ./scripts/deploy-prod.sh
```

This will:
- 🇭🇷 Configure Croatian timezone (Europe/Zagreb)
- 💶 Set EUR as default currency
- 🗣️ Set Croatian as default language
- 🏢 Enable Croatian business features (OIB, PDV, shipping zones)
- 🚚 Configure Croatian shipping zones and holiday calendar
- 📊 Set up Croatian tax rates (25% standard PDV)

### Croatian Domain Configuration

Update your DNS to point to your server:
- **Primary**: tejo-nails.hr
- **API**: api.tejo-nails.hr (optional subdomain)

### Croatian SSL Certificate

```bash
# Get SSL certificate for Croatian domain
certbot --nginx -d tejo-nails.hr -d www.tejo-nails.hr
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions.

## 📚 Documentation

- [API Documentation](http://localhost:3002/api/docs) - Swagger UI
- [Database Schema](./backend/prisma/schema.prisma) - Prisma schema
- [Frontend Components](./frontend/components/README.md) - Component documentation

## 🔧 Configuration

The application can be configured using environment variables. See:

- [Backend Configuration](./backend/README.md#configuration)
- [Frontend Configuration](./frontend/README.md#configuration)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.# TEJO-NAILS-PLATFORM

# TEJO-NAILS-PLATFORM
