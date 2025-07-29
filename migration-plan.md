# Tejo Nails Platform Migration Plan

## 1. Frontend Migration (Next.js 14/15 with App Router)

### New Structure

```
tejo-nails-platform/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── verify-email/page.tsx
│   ├── (shop)/
│   │   ├── page.tsx                      # Home page
│   │   ├── products/
│   │   │   ├── page.tsx                  # Product listing
│   │   │   └── [slug]/page.tsx           # Product detail
│   │   ├── categories/
│   │   │   ├── page.tsx                  # Categories listing
│   │   │   └── [slug]/page.tsx           # Category detail
│   │   ├── search/page.tsx               # Search results
│   │   ├── cart/page.tsx                 # Shopping cart
│   │   └── checkout/
│   │       ├── page.tsx                  # Checkout entry
│   │       ├── shipping/page.tsx         # Shipping info
│   │       ├── payment/page.tsx          # Payment info
│   │       └── confirmation/page.tsx     # Order confirmation
│   ├── account/
│   │   ├── page.tsx                      # Account dashboard
│   │   ├── orders/page.tsx               # Order history
│   │   ├── wishlist/page.tsx             # Wishlist
│   │   ├── addresses/page.tsx            # Address management
│   │   └── payment-methods/page.tsx      # Payment methods
│   ├── professional/
│   │   ├── page.tsx                      # Professional dashboard
│   │   ├── orders/page.tsx               # Bulk orders
│   │   ├── commissions/page.tsx          # Commission tracking
│   │   └── profile/page.tsx              # Professional profile
│   ├── admin/
│   │   ├── page.tsx                      # Admin dashboard
│   │   ├── products/page.tsx             # Product management
│   │   ├── orders/page.tsx               # Order management
│   │   ├── users/page.tsx                # User management
│   │   ├── analytics/page.tsx            # Analytics dashboard
│   │   └── settings/page.tsx             # System settings
│   ├── info/
│   │   ├── about/page.tsx                # About us
│   │   ├── contact/page.tsx              # Contact
│   │   ├── faq/page.tsx                  # FAQ
│   │   ├── shipping/page.tsx             # Shipping info
│   │   ├── returns/page.tsx              # Returns policy
│   │   ├── privacy/page.tsx              # Privacy policy
│   │   └── terms/page.tsx                # Terms of service
│   ├── layout.tsx                        # Root layout
│   └── page.tsx                          # Home page
├── components/
│   ├── ui/                               # Base UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── modal.tsx
│   │   └── ...
│   ├── forms/                            # Form components
│   │   ├── login-form.tsx
│   │   ├── register-form.tsx
│   │   └── ...
│   ├── product/                          # Product components
│   │   ├── product-card.tsx
│   │   ├── product-gallery.tsx
│   │   └── ...
│   ├── cart/                             # Cart components
│   │   ├── cart-item.tsx
│   │   ├── cart-summary.tsx
│   │   └── ...
│   ├── layout/                           # Layout components
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── navigation.tsx
│   │   └── ...
│   └── analytics/                        # Analytics components
│       ├── sales-chart.tsx
│       ├── user-growth.tsx
│       └── ...
├── lib/
│   ├── utils.ts                          # Utility functions
│   ├── hooks/                            # Custom hooks
│   │   ├── use-cart.ts
│   │   ├── use-auth.ts
│   │   └── ...
│   └── validations/                      # Zod schemas
│       ├── auth.ts
│       ├── product.ts
│       └── ...
├── store/                                # Zustand stores
│   ├── cart-store.ts
│   ├── auth-store.ts
│   └── ...
├── public/
│   ├── images/
│   ├── fonts/
│   └── ...
├── styles/                               # Global styles
│   └── globals.css
├── types/                                # TypeScript types
│   ├── product.ts
│   ├── user.ts
│   └── ...
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
└── tsconfig.json
```

## 2. Backend Migration (NestJS)

### New Structure

```
backend/
├── src/
│   ├── main.ts                           # Entry point
│   ├── app.module.ts                     # Root module
│   ├── auth/                             # Authentication module
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── strategies/
│   │   │   ├── jwt.strategy.ts
│   │   │   └── local.strategy.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   └── dto/
│   │       ├── login.dto.ts
│   │       └── register.dto.ts
│   ├── products/                         # Products module
│   │   ├── products.module.ts
│   │   ├── products.controller.ts
│   │   ├── products.service.ts
│   │   └── dto/
│   │       ├── create-product.dto.ts
│   │       └── update-product.dto.ts
│   ├── categories/                       # Categories module
│   │   ├── categories.module.ts
│   │   ├── categories.controller.ts
│   │   ├── categories.service.ts
│   │   └── dto/
│   │       ├── create-category.dto.ts
│   │       └── update-category.dto.ts
│   ├── orders/                           # Orders module
│   │   ├── orders.module.ts
│   │   ├── orders.controller.ts
│   │   ├── orders.service.ts
│   │   └── dto/
│   │       ├── create-order.dto.ts
│   │       └── update-order.dto.ts
│   ├── users/                            # Users module
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── dto/
│   │       ├── create-user.dto.ts
│   │       └── update-user.dto.ts
│   ├── payments/                         # Payments module
│   │   ├── payments.module.ts
│   │   ├── payments.controller.ts
│   │   ├── payments.service.ts
│   │   └── dto/
│   │       └── payment-intent.dto.ts
│   ├── search/                           # Search module
│   │   ├── search.module.ts
│   │   ├── search.controller.ts
│   │   └── search.service.ts
│   ├── email/                            # Email module
│   │   ├── email.module.ts
│   │   ├── email.service.ts
│   │   └── templates/
│   │       ├── order-confirmation.hbs
│   │       └── welcome.hbs
│   ├── analytics/                        # Analytics module
│   │   ├── analytics.module.ts
│   │   ├── analytics.controller.ts
│   │   └── analytics.service.ts
│   ├── professional/                     # Professional portal module
│   │   ├── professional.module.ts
│   │   ├── professional.controller.ts
│   │   ├── professional.service.ts
│   │   └── dto/
│   │       ├── bulk-order.dto.ts
│   │       └── commission.dto.ts
│   └── common/                           # Shared resources
│       ├── decorators/
│       ├── filters/
│       ├── guards/
│       ├── interceptors/
│       └── pipes/
├── prisma/                               # Prisma ORM
│   ├── schema.prisma                     # Database schema
│   └── migrations/                       # Database migrations
├── test/                                 # Tests
│   ├── e2e/
│   └── unit/
├── nest-cli.json
├── package.json
├── tsconfig.json
└── docker-compose.yml
```

## 3. Database Migration (PostgreSQL + Prisma)

### Prisma Schema

```prisma
// Key models from the schema.prisma file

model User {
  id                String    @id @default(uuid())
  email             String    @unique
  password          String?
  firstName         String?
  lastName          String?
  role              Role      @default(CUSTOMER)
  isEmailVerified   Boolean   @default(false)
  mfaEnabled        Boolean   @default(false)
  mfaSecret         String?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  // Relations
  addresses         Address[]
  orders            Order[]
  reviews           Review[]
  wishlistItems     WishlistItem[]
  professionalProfile Professional?

  @@map("users")
}

model Professional {
  id                String    @id @default(uuid())
  userId            String    @unique
  user              User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  businessName      String
  taxId             String
  isVerified        Boolean   @default(false)
  commissionRate    Float     @default(0)

  // Relations
  commissions       Commission[]
  bulkOrders        BulkOrder[]

  @@map("professionals")
}

model Product {
  id                String    @id @default(uuid())
  name              String
  slug              String    @unique
  description       String
  price             Float
  compareAtPrice    Float?
  sku               String    @unique
  barcode           String?
  weight            Float?
  inventory         Int       @default(0)
  isActive          Boolean   @default(true)
  categoryId        String
  category          Category  @relation(fields: [categoryId], references: [id])
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  // Relations
  variants          ProductVariant[]
  images            ProductImage[]
  reviews           Review[]
  orderItems        OrderItem[]
  wishlistItems     WishlistItem[]

  @@map("products")
}

model Category {
  id                String    @id @default(uuid())
  name              String
  slug              String    @unique
  description       String?
  parentId          String?
  parent            Category? @relation("CategoryToCategory", fields: [parentId], references: [id])
  children          Category[] @relation("CategoryToCategory")

  // Relations
  products          Product[]

  @@map("categories")
}

model Order {
  id                String    @id @default(uuid())
  orderNumber       String    @unique
  userId            String
  user              User      @relation(fields: [userId], references: [id])
  status            OrderStatus @default(PENDING)
  total             Float
  subtotal          Float
  tax               Float
  shipping          Float
  discount          Float     @default(0)
  shippingAddressId String
  shippingAddress   Address   @relation("ShippingAddress", fields: [shippingAddressId], references: [id])
  billingAddressId  String?
  billingAddress    Address?  @relation("BillingAddress", fields: [billingAddressId], references: [id])
  paymentIntentId   String?
  paymentStatus     PaymentStatus @default(PENDING)
  trackingNumber    String?
  notes             String?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  // Relations
  items             OrderItem[]
  transactions      Transaction[]

  @@map("orders")
}

// Additional models would be defined for:
// - ProductVariant
// - ProductImage
// - Review
// - Address
// - OrderItem
// - Transaction
// - WishlistItem
// - Commission
// - BulkOrder
// - etc.

enum Role {
  CUSTOMER
  PROFESSIONAL
  MANAGER
  ADMIN
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  RETURNED
}

enum PaymentStatus {
  PENDING
  AUTHORIZED
  PAID
  REFUNDED
  FAILED
}
```

## 4. Implementation Phases

### Phase 1: Setup & Infrastructure

- Set up Next.js frontend with TypeScript and Tailwind
- Set up NestJS backend with TypeScript
- Configure PostgreSQL database with Prisma
- Set up Docker and Docker Compose
- Configure CI/CD with GitHub Actions

### Phase 2: Core Features

- Implement authentication system with Clerk
- Build product catalog and category management
- Create shopping cart functionality
- Implement checkout process
- Set up Stripe payment integration

### Phase 3: Advanced Features

- Implement search with Algolia
- Build user account dashboard
- Create professional portal
- Implement admin panel
- Set up email notifications with Resend

### Phase 4: Optimization & Localization

- Implement Croatian localization
- Optimize performance with Redis caching
- Set up image optimization with Cloudinary
- Implement PWA capabilities
- Configure CDN

### Phase 5: Testing & Deployment

- Write unit and integration tests
- Perform security audits
- Set up monitoring and logging
- Deploy to production environment
- Configure backup and disaster recovery
