# Tejo Nails → Tejo Beauty Migration: Step-by-Step Implementation Guide for VS Code & GitHub Copilot

**Current Date:** 2025-07-22

## Overview
This guide provides specific instructions to transform your Tejo Nails platform into Tejo Beauty - a comprehensive B2B wholesale beauty platform. Each section contains comments to use with GitHub Copilot in VS Code and implementation steps.

## Step 1: Initial Repository Setup

### 1.1 Create a Migration Branch

**Terminal Commands:**
```bash
# Clone the repository if not already done
git clone https://github.com/corgi13/TEJO-NAILS-PLATFORM.git
cd TEJO-NAILS-PLATFORM

# Create and checkout a new branch
git checkout -b feature/tejo-beauty-migration
```

### 1.2 Project Analysis

**In VS Code, create analysis.md and write:**
```markdown
# Tejo Beauty Migration Analysis

/**
 * GitHub Copilot: Analyze the current codebase and generate a report that includes:
 * 1. Main application components and their structure
 * 2. Database schema and relationships
 * 3. User authentication system
 * 4. Current API endpoints
 * 5. Frontend structure and components
 * 6. Identify all branding references to "Tejo Nails" that need to be updated
 */
```

### 1.3 Update Environment Configuration

**In VS Code, create .env.tejo-beauty:**
```bash
# GitHub Copilot: Create a new .env file for Tejo Beauty based on the current .env
# Update APP_NAME to "Tejo Beauty"
# Add Redis, Elasticsearch configuration
# Update domain to tejo-beauty.com
```

## Step 2: Domain & Server Configuration

### 2.1 Domain Purchase & Setup

**External Requirements:**
- Purchase the domain `tejo-beauty.com` from Namecheap, Cloudflare, or GoDaddy (~€10-15/year)

**Create dns-config.md in VS Code:**
```markdown
# DNS Configuration for tejo-beauty.com

/**
 * GitHub Copilot: Create DNS configuration instructions including:
 * 1. A record pointing to our server IP (138.199.226.201)
 * 2. CNAME records for www, api, and admin subdomains
 * 3. MX records for email service
 * 4. Required TXT records for domain verification
 */
```

### 2.2 Nginx Configuration

**Create nginx.conf in VS Code:**
```nginx
# GitHub Copilot: Generate an Nginx configuration file for tejo-beauty.com with:
# 1. HTTPS setup
# 2. HTTP to HTTPS redirect
# 3. API proxy settings
# 4. Static file serving
# 5. Redirect from tejo-nails.com to tejo-beauty.com
```

### 2.3 SSL Certificate Setup

**Create ssl-setup.sh in VS Code:**
```bash
#!/bin/bash
# GitHub Copilot: Create a bash script to:
# 1. Install Certbot
# 2. Generate SSL certificates for tejo-beauty.com
# 3. Set up auto-renewal
# 4. Test the SSL configuration
```

## Step 3: Database Migration & Optimization

### 3.1 Create Database Migration Plan

**Create db-migration-plan.md in VS Code:**
```markdown
# Database Migration Plan

/**
 * GitHub Copilot: Create a comprehensive database migration plan for B2B features including:
 * 1. Updates to existing schema
 * 2. New B2B tables (bulk_pricing, customer_tiers, salon_accounts, etc.)
 * 3. Required indexes
 * 4. Data preservation strategy
 */
```

### 3.2 Implement Prisma Migrations

**In your prisma directory, create schema.prisma:**
```prisma
// GitHub Copilot: Update the Prisma schema to include all B2B tables:
// 1. Add bulk_pricing table with quantity tiers
// 2. Add customer_tiers table with discount levels
// 3. Add salon_accounts table with business details
// 4. Add product_specifications table
// 5. Add suppliers table
// 6. Add warehouse tables
// 7. Update existing tables with new relations
```

### 3.3 PostgreSQL Optimization

**Create postgres-optimize.sql in VS Code:**
```sql
-- GitHub Copilot: Generate PostgreSQL optimization commands:
-- 1. Update configuration parameters for better performance
-- 2. Create indexes for common B2B queries
-- 3. Optimize for bulk operations
```

## Step 4: Infrastructure Services Setup

### 4.1 Redis Installation & Configuration

**Create redis-setup.sh in VS Code:**
```bash
#!/bin/bash
# GitHub Copilot: Create a script to install and configure Redis on our server:
# 1. Install Redis
# 2. Set password protection
# 3. Configure memory limits
# 4. Enable persistence
# 5. Set up as a system service
```

### 4.2 Redis Service Implementation

**Create src/services/cache.service.ts in VS Code:**
```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// GitHub Copilot: Create a CacheService using Redis that:
// 1. Connects to Redis using environment variables
// 2. Provides methods for get/set operations
// 3. Implements cart persistence
// 4. Caches product and search data
// 5. Handles session management
```

### 4.3 Elasticsearch Setup

**Create elasticsearch-setup.sh in VS Code:**
```bash
#!/bin/bash
# GitHub Copilot: Create a script to install and configure Elasticsearch:
# 1. Install Elasticsearch
# 2. Configure memory settings
# 3. Set up security
# 4. Create system service
# 5. Initialize product indices
```

### 4.4 Search Service Implementation

**Create src/services/search.service.ts in VS Code:**
```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@elastic/elasticsearch';
// GitHub Copilot: Create a SearchService using Elasticsearch that:
// 1. Connects to Elasticsearch
// 2. Implements product indexing
// 3. Creates search functionality with filters
// 4. Adds autocomplete
// 5. Includes B2B specific filters
```

## Step 5: Core Application Rebranding

### 5.1 Frontend Rebranding Script

**Create rebrand-frontend.js in VS Code:**
```javascript
// GitHub Copilot: Create a script to update all frontend files:
// 1. Replace "Tejo Nails" with "Tejo Beauty"
// 2. Update color variables in CSS/SCSS files
// 3. Replace logo references
// 4. Update meta tags and titles
// 5. Replace nail-specific terminology
```

### 5.2 Backend Rebranding

**Create rebrand-backend.js in VS Code:**
```javascript
// GitHub Copilot: Create a script to update backend files:
// 1. Replace "Tejo Nails" with "Tejo Beauty"
// 2. Update email templates
// 3. Modify API documentation
// 4. Change database references
// 5. Update configuration files
```

## Step 6: B2B Pricing System Implementation

### 6.1 Pricing Service

**Create src/services/pricing.service.ts in VS Code:**
```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CacheService } from './cache.service';

// GitHub Copilot: Create a PricingService class with methods:
// 1. calculateBulkPrice(productId, quantity, customerId)
// 2. getTierDiscount(customerId)
// 3. generateCustomQuote(items, customerId)
// 4. validateMinimumOrder(cart, customerId)

@Injectable()
export class PricingService {
  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
  ) {}
  
  // Implement methods here...
}
```

### 6.2 Quote Management System

**Create src/services/quote.service.ts in VS Code:**
```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PricingService } from './pricing.service';
import * as puppeteer from 'puppeteer';

// GitHub Copilot: Create a QuoteService class with methods:
// 1. createQuote(customerId, items, notes)
// 2. updateQuoteStatus(quoteId, status)
// 3. convertQuoteToOrder(quoteId)
// 4. generateQuotePDF(quoteId)
// 5. sendQuoteEmail(quoteId)

@Injectable()
export class QuoteService {
  constructor(
    private prisma: PrismaService,
    private pricingService: PricingService,
  ) {}
  
  // Implement methods here...
}
```

## Step 7: Business Account Management

### 7.1 Business Verification System

**Create src/services/verification.service.ts in VS Code:**
```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// GitHub Copilot: Create a VerificationService class with methods:
// 1. submitBusinessDocuments(customerId, documents)
// 2. verifyTaxId(taxId, country)
// 3. validateBusinessLicense(licenseNumber, state)
// 4. performCreditCheck(businessInfo)
// 5. updateVerificationStatus(customerId, status, notes)

@Injectable()
export class VerificationService {
  constructor(
    private prisma: PrismaService,
  ) {}
  
  // Implement methods here...
}
```

### 7.2 Account Management

**Create src/services/account-management.service.ts in VS Code:**
```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// GitHub Copilot: Create an AccountManagementService class with methods:
// 1. assignAccountManager(customerId, managerId)
// 2. getCustomerHistory(customerId)
// 3. scheduleFollowUp(customerId, date)
// 4. generateCustomerReport(customerId)
// 5. trackCustomerInteraction(customerId, type, notes)

@Injectable()
export class AccountManagementService {
  constructor(
    private prisma: PrismaService,
  ) {}
  
  // Implement methods here...
}
```

## Step 8: Enhanced Product Catalog

### 8.1 Product Specification System

**Create src/services/product-catalog.service.ts in VS Code:**
```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { SearchService } from './search.service';

// GitHub Copilot: Create a ProductCatalogService with methods:
// 1. createProductWithSpecs(productData, specifications)
// 2. updateProductAvailability(productId, quantity, leadTime)
// 3. addProductCertification(productId, certificationData)
// 4. linkProductToSupplier(productId, supplierId)
// 5. manageProductCategories(productId, categoryIds)

@Injectable()
export class ProductCatalogService {
  constructor(
    private prisma: PrismaService,
    private searchService: SearchService,
  ) {}
  
  // Implement methods here...
}
```

### 8.2 Import/Export Management

**Create src/services/import-export.service.ts in VS Code:**
```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { HttpService } from '@nestjs/axios';

// GitHub Copilot: Create an ImportExportService with methods:
// 1. calculateImportDuties(products, country)
// 2. generateCommercialInvoice(orderId)
// 3. trackShipmentStatus(trackingNumber)
// 4. validateProductCompliance(productId, country)
// 5. manageHsCodes(productId, hsCode, description)

@Injectable()
export class ImportExportService {
  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
  ) {}
  
  // Implement methods here...
}
```

## Step 9: Advanced B2B Ordering

### 9.1 B2B Order Management

**Create src/services/order-management.service.ts in VS Code:**
```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PricingService } from './pricing.service';

// GitHub Copilot: Create an OrderManagementService with methods:
// 1. createBulkOrder(customerId, items, orderTemplate)
// 2. setupRecurringOrder(customerId, items, schedule)
// 3. processOrderApproval(orderId, approverId)
// 4. generatePickingList(orderId)
// 5. manageOrderTemplates(customerId, template)

@Injectable()
export class OrderManagementService {
  constructor(
    private prisma: PrismaService,
    private pricingService: PricingService,
  ) {}
  
  // Implement methods here...
}
```

### 9.2 Shopping List System

**Create src/services/shopping-list.service.ts in VS Code:**
```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// GitHub Copilot: Create a ShoppingListService with methods:
// 1. createShoppingList(customerId, name, items)
// 2. shareShoppingList(listId, userIds)
// 3. reorderFromHistory(customerId, orderId)
// 4. suggestReorderItems(customerId)
// 5. updateShoppingList(listId, updates)

@Injectable()
export class ShoppingListService {
  constructor(
    private prisma: PrismaService,
  ) {}
  
  // Implement methods here...
}
```

## Step 10: Security Enhancements

### 10.1 OAuth Implementation

**Create src/services/auth.service.ts in VS Code:**
```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { JwtService } from '@nestjs/jwt';

// GitHub Copilot: Create an enhanced AuthService with methods:
// 1. authenticateWithGoogle(code)
// 2. authenticateWithMicrosoft(code)
// 3. authenticateWithLinkedIn(code)
// 4. linkAccountProvider(userId, provider, token)
// 5. manageBusinessVerification(userId, verificationData)

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  
  // Implement methods here...
}
```

### 10.2 API Security

**Create src/services/security.service.ts in VS Code:**
```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CacheService } from './cache.service';

// GitHub Copilot: Create a SecurityService with methods:
// 1. generateApiKey(userId, permissions)
// 2. validateApiKey(key)
// 3. trackApiUsage(userId, endpoint)
// 4. manageRateLimits(userType)
// 5. detectSuspiciousActivity(userId, activity)

@Injectable()
export class SecurityService {
  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
  ) {}
  
  // Implement methods here...
}
```

### 10.3 GDPR Compliance

**Create src/services/gdpr.service.ts in VS Code:**
```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { createObjectCsvWriter } from 'csv-writer';

// GitHub Copilot: Create a GDPRService with methods:
// 1. requestDataExport(userId)
// 2. deleteUserData(userId)
// 3. manageConsents(userId, consentData)
// 4. auditDataAccess(userId, accessDetails)
// 5. generatePrivacyReport(userId)

@Injectable()
export class GDPRService {
  constructor(
    private prisma: PrismaService,
  ) {}
  
  // Implement methods here...
}
```

## Step 11: Mobile Application Development

### 11.1 React Native Setup

**In a new directory, initialize React Native project:**
```bash
# Install React Native CLI
npm install -g @react-native-community/cli

# Create new React Native project
npx react-native init TejoBeautyB2B --template react-native-template-typescript

cd TejoBeautyB2B
```

**In VS Code, create package.json:**
```json
// GitHub Copilot: Update package.json to include these dependencies:
// 1. @react-navigation/native and @react-navigation/stack
// 2. react-native-vector-icons
// 3. react-native-paper
// 4. @react-native-async-storage/async-storage
// 5. react-native-camera
```

### 11.2 Mobile Core Functionality

**Create src/screens/LoginScreen.tsx:**
```tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
// GitHub Copilot: Create a LoginScreen component with:
// 1. Email and password fields
// 2. Remember me option
// 3. Biometric login option
// 4. Forgot password link
// 5. Business login section
```

**Create src/services/mobile-api.service.ts:**
```typescript
// GitHub Copilot: Create a mobile API service with methods:
// 1. login(email, password)
// 2. fetchProducts(filters)
// 3. getOrderHistory(userId)
// 4. placeOrder(cart)
// 5. getAccountDetails(userId)
```

### 11.3 Barcode Scanner Integration

**Create src/services/barcode-scanner.service.ts:**
```typescript
import { Camera } from 'react-native-camera';
// GitHub Copilot: Create a BarcodeScannerService with methods:
// 1. scanProductBarcode()
// 2. lookupProductByBarcode(barcode)
// 3. addScannedProductToCart(barcode, quantity)
// 4. validateBarcodeFormat(barcode)
// 5. manageScanHistory(userId, barcode, product)
```

### 11.4 Offline Functionality

**Create src/services/offline.service.ts:**
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
// GitHub Copilot: Create an OfflineService with methods:
// 1. syncDataOnConnection()
// 2. cacheProductCatalog()
// 3. queueOfflineOrders()
// 4. manageOfflineAuth()
// 5. resolveDataConflicts(localData, serverData)
```

## Step 12: AI & Analytics Implementation

### 12.1 Recommendation Engine

**Create src/services/recommendation.service.ts in VS Code:**
```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// GitHub Copilot: Create a RecommendationEngine with methods:
// 1. getPersonalizedRecommendations(customerId)
// 2. getFrequentlyBoughtTogether(productId)
// 3. getSeasonalRecommendations(customerId, season)
// 4. getCategoryTrends(categoryId)
// 5. trackRecommendationPerformance(recommendationId, action)

@Injectable()
export class RecommendationService {
  constructor(
    private prisma: PrismaService,
  ) {}
  
  // Implement methods here...
}
```

### 12.2 Business Intelligence Dashboard

**Create src/components/analytics/Dashboard.tsx:**
```tsx
import React from 'react';
import { Card, Grid } from '../ui';
import { Chart } from 'chart.js';
// GitHub Copilot: Create an analytics dashboard component with:
// 1. Sales performance charts
// 2. Customer acquisition metrics
// 3. Product performance analysis
// 4. Inventory turnover reporting
// 5. Profit margin visualization
```

**Create src/services/analytics.service.ts:**
```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// GitHub Copilot: Create an AnalyticsService with methods:
// 1. getSalesPerformance(dateRange)
// 2. getCustomerMetrics(filters)
// 3. getProductPerformance(productIds)
// 4. generateInventoryReport()
// 5. exportAnalyticsData(format, filters)

@Injectable()
export class AnalyticsService {
  constructor(
    private prisma: PrismaService,
  ) {}
  
  // Implement methods here...
}
```

## Step 13: Multi-Warehouse Operations

### 13.1 Warehouse Management

**Create src/services/warehouse.service.ts in VS Code:**
```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// GitHub Copilot: Create a WarehouseService with methods:
// 1. allocateInventory(orderId, warehouseStrategy)
// 2. transferStock(fromWarehouse, toWarehouse, productId, quantity)
// 3. performStockAdjustment(warehouseId, adjustments)
// 4. generatePickingList(orderId, warehouseId)
// 5. calculateOptimalFulfillment(orderId, warehouses)

@Injectable()
export class WarehouseService {
  constructor(
    private prisma: PrismaService,
  ) {}
  
  // Implement methods here...
}
```

### 13.2 Dropshipping Integration

**Create src/services/dropship.service.ts in VS Code:**
```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { HttpService } from '@nestjs/axios';

// GitHub Copilot: Create a DropshipService with methods:
// 1. routeOrderToSupplier(orderId, items)
// 2. trackSupplierFulfillment(orderId)
// 3. handleSupplierInventory(supplierId)
// 4. reconcileDropshipOrders()
// 5. generateSupplierReport(supplierId, dateRange)

@Injectable()
export class DropshipService {
  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
  ) {}
  
  // Implement methods here...
}
```

## Step 14: International Features

### 14.1 Multi-Currency Support

**Create src/services/currency.service.ts in VS Code:**
```typescript
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CacheService } from './cache.service';

// GitHub Copilot: Create a CurrencyService with methods:
// 1. convertPrice(amount, fromCurrency, toCurrency)
// 2. updateExchangeRates()
// 3. calculateLocalTaxes(amount, country)
// 4. formatCurrencyDisplay(amount, currency, locale)
// 5. manageRegionalPricing(productId, region, price)

@Injectable()
export class CurrencyService {
  constructor(
    private httpService: HttpService,
    private cacheService: CacheService,
  ) {}
  
  // Implement methods here...
}
```

### 14.2 Localization System

**Create src/services/localization.service.ts in VS Code:**
```typescript
import { Injectable } from '@nestjs/common';
import { CacheService } from './cache.service';
import { I18nService } from 'nestjs-i18n';

// GitHub Copilot: Create a LocalizationService with methods:
// 1. translateContent(key, language, context)
// 2. formatAddress(address, country)
// 3. formatPhoneNumber(number, country)
// 4. validatePostalCode(code, country)
// 5. getLocalizedProductData(productId, locale)

@Injectable()
export class LocalizationService {
  constructor(
    private i18nService: I18nService,
    private cacheService: CacheService,
  ) {}
  
  // Implement methods here...
}
```

## Step 15: Monitoring & Performance

### 15.1 Monitoring Setup

**Create src/services/monitoring.service.ts in VS Code:**
```typescript
import { Injectable } from '@nestjs/common';
import { PrometheusService } from './prometheus.service';

// GitHub Copilot: Create a MonitoringService with methods:
// 1. trackApiResponse(endpoint, responseTime)
// 2. monitorDatabaseQuery(query, executionTime)
// 3. recordUserActivity(userId, activity)
// 4. logError(error, context)
// 5. generateHealthReport()

@Injectable()
export class MonitoringService {
  constructor(
    private prometheusService: PrometheusService,
  ) {}
  
  // Implement methods here...
}
```

### 15.2 Performance Optimization

**Create performance-optimizations.md in VS Code:**
```markdown
# Performance Optimization Plan

/**
 * GitHub Copilot: Create a comprehensive performance optimization plan including:
 * 1. Database query optimization strategies
 * 2. API response caching techniques
 * 3. Frontend bundle optimization methods
 * 4. Image optimization approaches
 * 5. Server-side rendering implementation
 */
```

## Step 16: Deployment & Launch

### 16.1 Deployment Scripts

**Create deploy.sh in VS Code:**
```bash
#!/bin/bash
# GitHub Copilot: Create a deployment script that:
# 1. Backs up the current database
# 2. Runs database migrations
# 3. Deploys the backend API
# 4. Deploys the frontend
# 5. Updates configuration
# 6. Verifies the deployment
```

### 16.2 Launch Plan

**Create launch-plan.md in VS Code:**
```markdown
# Tejo Beauty Launch Plan

/**
 * GitHub Copilot: Create a detailed launch plan including:
 * 1. Pre-launch testing checklist
 * 2. Phased rollout strategy
 * 3. User communication plan
 * 4. Monitoring setup for launch day
 * 5. Support preparation and contingency plans
 */
```

## External Resources Required

1. **Domain & Hosting:**
   - Domain registration account (Namecheap, Cloudflare, GoDaddy)
   - VPS or cloud server access (existing)

2. **Development Services:**
   - Redis Cloud account (free tier available) or self-hosted Redis
   - Elasticsearch Cloud (free tier available) or self-hosted Elasticsearch

3. **Authentication:**
   - Google Cloud Console account (for OAuth)
   - Microsoft Azure account (for OAuth)
   - LinkedIn Developer account (for OAuth)

4. **External APIs:**
   - ExchangeRate-API for currency conversion (free tier available)
   - Address validation API (optional - Google Maps API)
   - Tax calculation API (optional - Avalara, TaxJar)

5. **Mobile Development:**
   - Apple Developer account ($99/year) for iOS app
   - Google Play Developer account ($25 one-time) for Android app

6. **Monitoring:**
   - Sentry.io account for error tracking (free tier available)
   - Google Analytics account (free)

## Implementation Checklist

Use this in your project README.md:

```markdown
# Tejo Beauty Migration Checklist

- [ ] Repository setup and project analysis
- [ ] Domain purchase and server configuration
- [ ] Database migration and optimization
- [ ] Infrastructure services setup (Redis, Elasticsearch)
- [ ] Application rebranding
- [ ] B2B pricing system implementation
- [ ] Business account management
- [ ] Enhanced product catalog
- [ ] Advanced B2B ordering system
- [ ] Security enhancements
- [ ] Mobile application development
- [ ] AI and analytics implementation
- [ ] Multi-warehouse operations
- [ ] International features
- [ ] Monitoring and performance optimization
- [ ] Deployment and launch
```
