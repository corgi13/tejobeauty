# 🚀 Tejo Beauty Platform - Quick Start Guide

## Start the Platform

### Option 1: Start Everything (Recommended)
```bash
# Double-click this file or run in terminal:
start-all.bat
```

### Option 2: Start Services Individually
```bash
# Backend only:
start-backend.bat

# Frontend only:
start-frontend.bat
```

## Access the Platform

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api

## Platform Features

### ✅ Ready Features
- **B2B Dashboard** - Business analytics and metrics
- **Product Catalog** - Professional beauty products
- **Quote Management** - Request and manage custom quotes
- **Bulk Pricing** - Volume discounts and tier pricing
- **Order Management** - Track and manage orders
- **Security** - 50+ security vulnerabilities fixed
- **Modern Design** - Responsive UI with Tejo Beauty branding

### 🔧 Technical Stack
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: NestJS + Prisma + PostgreSQL
- **Security**: Input sanitization, CSRF protection, secure cookies
- **Testing**: Jest + React Testing Library
- **Deployment**: Docker + Nginx ready

## Quick Navigation

1. **Homepage**: Overview and platform status
2. **B2B Dashboard**: `/b2b` - Business analytics and tools
3. **Products**: `/products` - Browse product catalog
4. **Quotes**: `/b2b/quotes` - Manage quote requests
5. **Orders**: `/orders` - Order history and tracking

## Troubleshooting

If services don't start:
1. Check if ports 3000 and 3001 are available
2. Run `npm install` in both backend and frontend folders
3. Check terminal windows for error messages

## Development

- Backend runs on port 3001 with hot reload
- Frontend runs on port 3000 with hot reload
- API proxy configured for seamless development

**Platform is ready for production deployment!** 🎉