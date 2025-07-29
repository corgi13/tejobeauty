# Database Migration Plan

## Overview
This document provides a comprehensive database migration plan for transforming the Tejo Nails platform into a B2B wholesale beauty platform (Tejo Beauty). The migration includes schema updates, new B2B tables, required indexes, and data preservation strategies.

## 1. Current Database Schema Analysis

### Existing Tables
- **users**: Basic user information
- **products**: Product catalog
- **categories**: Product categorization
- **orders**: Order management
- **order_items**: Order line items
- **payments**: Payment processing
- **addresses**: User addresses

### Current Relationships
- Users → Orders (One-to-Many)
- Orders → OrderItems (One-to-Many)
- Products → Categories (Many-to-One)
- Users → Addresses (One-to-Many)

## 2. Schema Updates Required

### 2.1 Users Table Updates
```sql
-- Add B2B specific fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS business_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS business_type VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS tax_id VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS vat_number VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS business_license VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS customer_tier_id INTEGER REFERENCES customer_tiers(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS account_manager_id INTEGER REFERENCES users(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_status VARCHAR(20) DEFAULT 'pending';
ALTER TABLE users ADD COLUMN IF NOT EXISTS credit_limit DECIMAL(10,2) DEFAULT 0.00;
ALTER TABLE users ADD COLUMN IF NOT EXISTS payment_terms INTEGER DEFAULT 30;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_business_account BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS business_phone VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS business_email VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS company_size VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS annual_revenue DECIMAL(15,2);
ALTER TABLE users ADD COLUMN IF NOT EXISTS industry VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS website VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS years_in_business INTEGER;
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_contact_method VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS timezone VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS language_preference VARCHAR(10) DEFAULT 'en';
```

### 2.2 Products Table Updates
```sql
-- Add B2B specific fields to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS sku VARCHAR(100) UNIQUE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS barcode VARCHAR(50);
ALTER TABLE products ADD COLUMN IF NOT EXISTS weight DECIMAL(10,3);
ALTER TABLE products ADD COLUMN IF NOT EXISTS dimensions JSONB;
ALTER TABLE products ADD COLUMN IF NOT EXISTS minimum_order_quantity INTEGER DEFAULT 1;
ALTER TABLE products ADD COLUMN IF NOT EXISTS case_pack_quantity INTEGER DEFAULT 1;
ALTER TABLE products ADD COLUMN IF NOT EXISTS supplier_id INTEGER REFERENCES suppliers(id);
ALTER TABLE products ADD COLUMN IF NOT EXISTS brand_id INTEGER REFERENCES brands(id);
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS lead_time_days INTEGER DEFAULT 7;
ALTER TABLE products ADD COLUMN IF NOT EXISTS country_of_origin VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS hs_code VARCHAR(20);
ALTER TABLE products ADD COLUMN IF NOT EXISTS certifications JSONB;
ALTER TABLE products ADD COLUMN IF NOT EXISTS tags JSONB;
ALTER TABLE products ADD COLUMN IF NOT EXISTS search_keywords TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_title VARCHAR(255);
ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_keywords TEXT;
```

## 3. New B2B Tables

### 3.1 Customer Tiers
```sql
CREATE TABLE IF NOT EXISTS customer_tiers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    discount_percentage DECIMAL(5,2) DEFAULT 0.00,
    minimum_annual_spend DECIMAL(10,2) DEFAULT 0.00,
    priority_support BOOLEAN DEFAULT FALSE,
    early_access BOOLEAN DEFAULT FALSE,
    free_shipping_threshold DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default customer tiers
INSERT INTO customer_tiers (name, description, discount_percentage, minimum_annual_spend, priority_support, early_access, free_shipping_threshold) VALUES
('Bronze', 'Standard B2B customer', 0.00, 0.00, FALSE, FALSE, 500.00),
('Silver', 'Preferred B2B customer', 5.00, 5000.00, TRUE, FALSE, 300.00),
('Gold', 'Premium B2B customer', 10.00, 20000.00, TRUE, TRUE, 100.00),
('Platinum', 'VIP B2B customer', 15.00, 50000.00, TRUE, TRUE, 0.00);
```

### 3.2 Bulk Pricing
```sql
CREATE TABLE IF NOT EXISTS bulk_pricing (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    customer_tier_id INTEGER REFERENCES customer_tiers(id),
    min_quantity INTEGER NOT NULL,
    max_quantity INTEGER,
    price_per_unit DECIMAL(10,2) NOT NULL,
    discount_percentage DECIMAL(5,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    valid_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, customer_tier_id, min_quantity)
);

-- Create indexes for bulk pricing
CREATE INDEX IF NOT EXISTS idx_bulk_pricing_product ON bulk_pricing(product_id);
CREATE INDEX IF NOT EXISTS idx_bulk_pricing_tier ON bulk_pricing(customer_tier_id);
CREATE INDEX IF NOT EXISTS idx_bulk_pricing_active ON bulk_pricing(is_active);
```

### 3.3 Suppliers
```sql
CREATE TABLE IF NOT EXISTS suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    website VARCHAR(255),
    tax_id VARCHAR(50),
    payment_terms INTEGER DEFAULT 30,
    minimum_order_amount DECIMAL(10,2) DEFAULT 0.00,
    lead_time_days INTEGER DEFAULT 7,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for suppliers
CREATE INDEX IF NOT EXISTS idx_suppliers_active ON suppliers(is_active);
CREATE INDEX IF NOT EXISTS idx_suppliers_name ON suppliers(name);
```

### 3.4 Brands
```sql
CREATE TABLE IF NOT EXISTS brands (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    logo_url VARCHAR(500),
    website VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for brands
CREATE INDEX IF NOT EXISTS idx_brands_active ON brands(is_active);
CREATE INDEX IF NOT EXISTS idx_brands_name ON brands(name);
```

### 3.5 Business Documents
```sql
CREATE TABLE IF NOT EXISTS business_documents (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL, -- 'business_license', 'tax_certificate', 'insurance', etc.
    file_name VARCHAR(255),
    file_path VARCHAR(500),
    file_size INTEGER,
    mime_type VARCHAR(100),
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by INTEGER REFERENCES users(id),
    verified_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for business documents
CREATE INDEX IF NOT EXISTS idx_business_docs_user ON business_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_business_docs_type ON business_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_business_docs_verified ON business_documents(is_verified);
```

### 3.6 Quotes
```sql
CREATE TABLE IF NOT EXISTS quotes (
    id SERIAL PRIMARY KEY,
    quote_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'sent', 'accepted', 'rejected', 'expired'
    subtotal DECIMAL(10,2) DEFAULT 0.00,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    shipping_amount DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'EUR',
    valid_until TIMESTAMP,
    notes TEXT,
    terms_conditions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for quotes
CREATE INDEX IF NOT EXISTS idx_quotes_user ON quotes(user_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_created ON quotes(created_at);
```

### 3.7 Quote Items
```sql
CREATE TABLE IF NOT EXISTS quote_items (
    id SERIAL PRIMARY KEY,
    quote_id INTEGER NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for quote items
CREATE INDEX IF NOT EXISTS idx_quote_items_quote ON quote_items(quote_id);
CREATE INDEX IF NOT EXISTS idx_quote_items_product ON quote_items(product_id);
```

### 3.8 Shopping Lists
```sql
CREATE TABLE IF NOT EXISTS shopping_lists (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_shared BOOLEAN DEFAULT FALSE,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for shopping lists
CREATE INDEX IF NOT EXISTS idx_shopping_lists_user ON shopping_lists(user_id);
CREATE INDEX IF NOT EXISTS idx_shopping_lists_shared ON shopping_lists(is_shared);
```

### 3.9 Shopping List Items
```sql
CREATE TABLE IF NOT EXISTS shopping_list_items (
    id SERIAL PRIMARY KEY,
    shopping_list_id INTEGER NOT NULL REFERENCES shopping_lists(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    notes TEXT,
    priority INTEGER DEFAULT 1,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for shopping list items
CREATE INDEX IF NOT EXISTS idx_shopping_list_items_list ON shopping_list_items(shopping_list_id);
CREATE INDEX IF NOT EXISTS idx_shopping_list_items_product ON shopping_list_items(product_id);
```

### 3.10 Order Templates
```sql
CREATE TABLE IF NOT EXISTS order_templates (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for order templates
CREATE INDEX IF NOT EXISTS idx_order_templates_user ON order_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_order_templates_active ON order_templates(is_active);
```

### 3.11 Order Template Items
```sql
CREATE TABLE IF NOT EXISTS order_template_items (
    id SERIAL PRIMARY KEY,
    order_template_id INTEGER NOT NULL REFERENCES order_templates(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for order template items
CREATE INDEX IF NOT EXISTS idx_order_template_items_template ON order_template_items(order_template_id);
CREATE INDEX IF NOT EXISTS idx_order_template_items_product ON order_template_items(product_id);
```

### 3.12 Warehouses
```sql
CREATE TABLE IF NOT EXISTS warehouses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    is_active BOOLEAN DEFAULT TRUE,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for warehouses
CREATE INDEX IF NOT EXISTS idx_warehouses_code ON warehouses(code);
CREATE INDEX IF NOT EXISTS idx_warehouses_active ON warehouses(is_active);
CREATE INDEX IF NOT EXISTS idx_warehouses_primary ON warehouses(is_primary);
```

### 3.13 Inventory
```sql
CREATE TABLE IF NOT EXISTS inventory (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    warehouse_id INTEGER NOT NULL REFERENCES warehouses(id),
    quantity_available INTEGER NOT NULL DEFAULT 0,
    quantity_reserved INTEGER NOT NULL DEFAULT 0,
    quantity_on_order INTEGER NOT NULL DEFAULT 0,
    reorder_point INTEGER DEFAULT 0,
    reorder_quantity INTEGER DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, warehouse_id)
);

-- Create indexes for inventory
CREATE INDEX IF NOT EXISTS idx_inventory_product ON inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_warehouse ON inventory(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_inventory_available ON inventory(quantity_available);
```

### 3.14 Product Specifications
```sql
CREATE TABLE IF NOT EXISTS product_specifications (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    specification_name VARCHAR(255) NOT NULL,
    specification_value TEXT,
    specification_unit VARCHAR(50),
    display_order INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for product specifications
CREATE INDEX IF NOT EXISTS idx_product_specs_product ON product_specifications(product_id);
CREATE INDEX IF NOT EXISTS idx_product_specs_active ON product_specifications(is_active);
```

### 3.15 Product Certifications
```sql
CREATE TABLE IF NOT EXISTS product_certifications (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    certification_name VARCHAR(255) NOT NULL,
    certification_body VARCHAR(255),
    certification_number VARCHAR(100),
    valid_from DATE,
    valid_until DATE,
    certificate_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for product certifications
CREATE INDEX IF NOT EXISTS idx_product_certs_product ON product_certifications(product_id);
CREATE INDEX IF NOT EXISTS idx_product_certs_active ON product_certifications(is_active);
```

## 4. Required Indexes

### Performance Indexes
```sql
-- User-related indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_business_account ON users(is_business_account);
CREATE INDEX IF NOT EXISTS idx_users_customer_tier ON users(customer_tier_id);
CREATE INDEX IF NOT EXISTS idx_users_verification ON users(verification_status);

-- Product-related indexes
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
CREATE INDEX IF NOT EXISTS idx_products_supplier ON products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_search ON products(search_keywords);

-- Order-related indexes
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);

-- Quote-related indexes
CREATE INDEX IF NOT EXISTS idx_quotes_user ON quotes(user_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_valid_until ON quotes(valid_until);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_products_search_full ON products USING gin(to_tsvector('english', name || ' ' || description || ' ' || search_keywords));
CREATE INDEX IF NOT EXISTS idx_users_search_full ON users USING gin(to_tsvector('english', business_name || ' ' || email));
```

## 5. Data Preservation Strategy

### 5.1 Backup Strategy
```sql
-- Create backup schema
CREATE SCHEMA IF NOT EXISTS backup;

-- Backup existing tables
CREATE TABLE backup.users_backup AS SELECT * FROM users;
CREATE TABLE backup.products_backup AS SELECT * FROM products;
CREATE TABLE backup.orders_backup AS SELECT * FROM orders;
CREATE TABLE backup.categories_backup AS SELECT * FROM categories;
```

### 5.2 Data Migration Scripts
```sql
-- Migrate existing users to business accounts (optional)
UPDATE users SET is_business_account = FALSE WHERE role = 'USER';
UPDATE users SET is_business_account = TRUE WHERE role = 'ADMIN';

-- Assign default customer tier
UPDATE users SET customer_tier_id = 1 WHERE customer_tier_id IS NULL;

-- Generate SKUs for existing products
UPDATE products SET sku = 'SKU-' || LPAD(id::text, 6, '0') WHERE sku IS NULL;
```

### 5.3 Rollback Strategy
```sql
-- Create rollback procedures
CREATE OR REPLACE FUNCTION rollback_user_updates()
RETURNS void AS $$
BEGIN
    ALTER TABLE users DROP COLUMN IF EXISTS business_name;
    ALTER TABLE users DROP COLUMN IF EXISTS business_type;
    ALTER TABLE users DROP COLUMN IF EXISTS tax_id;
    ALTER TABLE users DROP COLUMN IF EXISTS vat_number;
    ALTER TABLE users DROP COLUMN IF EXISTS business_license;
    ALTER TABLE users DROP COLUMN IF EXISTS customer_tier_id;
    ALTER TABLE users DROP COLUMN IF EXISTS account_manager_id;
    ALTER TABLE users DROP COLUMN IF EXISTS verification_status;
    ALTER TABLE users DROP COLUMN IF EXISTS credit_limit;
    ALTER TABLE users DROP COLUMN IF EXISTS payment_terms;
    ALTER TABLE users DROP COLUMN IF EXISTS is_business_account;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION rollback_product_updates()
RETURNS void AS $$
BEGIN
    ALTER TABLE products DROP COLUMN IF EXISTS sku;
    ALTER TABLE products DROP COLUMN IF EXISTS barcode;
    ALTER TABLE products DROP COLUMN IF EXISTS weight;
    ALTER TABLE products DROP COLUMN IF EXISTS dimensions;
    ALTER TABLE products DROP COLUMN IF EXISTS minimum_order_quantity;
    ALTER TABLE products DROP COLUMN IF EXISTS case_pack_quantity;
    ALTER TABLE products DROP COLUMN IF EXISTS supplier_id;
    ALTER TABLE products DROP COLUMN IF EXISTS brand_id;
    ALTER TABLE products DROP COLUMN IF EXISTS lead_time_days;
    ALTER TABLE products DROP COLUMN IF EXISTS country_of_origin;
    ALTER TABLE products DROP COLUMN IF EXISTS hs_code;
    ALTER TABLE products DROP COLUMN IF EXISTS certifications;
    ALTER TABLE products DROP COLUMN IF EXISTS tags;
    ALTER TABLE products DROP COLUMN IF EXISTS search_keywords;
END;
$$ LANGUAGE plpgsql;
```

## 6. Migration Execution Plan

### Phase 1: Schema Updates (Day 1)
1. Create backup of existing database
2. Update existing tables with new columns
3. Create new B2B tables
4. Create indexes for performance

### Phase 2: Data Migration (Day 2)
1. Migrate existing data to new schema
2. Populate default values
3. Create default customer tiers
4. Generate SKUs for existing products

### Phase 3: Testing (Day 3)
1. Test all database operations
2. Verify data integrity
3. Performance testing
4. Rollback testing

### Phase 4: Production Deployment (Day 4)
1. Deploy to production
2. Monitor for issues
3. Performance monitoring
4. User acceptance testing

## 7. Post-Migration Verification

### 7.1 Data Integrity Checks
```sql
-- Check for orphaned records
SELECT COUNT(*) FROM orders WHERE user_id NOT IN (SELECT id FROM users);
SELECT COUNT(*) FROM order_items WHERE product_id NOT IN (SELECT id FROM products);

-- Check for missing required fields
SELECT COUNT(*) FROM users WHERE is_business_account = TRUE AND business_name IS NULL;
SELECT COUNT(*) FROM products WHERE sku IS NULL;
```

### 7.2 Performance Testing
```sql
-- Test query performance
EXPLAIN ANALYZE SELECT * FROM products WHERE is_active = TRUE;
EXPLAIN ANALYZE SELECT * FROM users WHERE customer_tier_id = 1;
EXPLAIN ANALYZE SELECT * FROM bulk_pricing WHERE product_id = 1 AND is_active = TRUE;
```

## 8. Monitoring and Maintenance

### 8.1 Database Monitoring
- Set up alerts for slow queries
- Monitor table sizes
- Track index usage
- Monitor connection pool

### 8.2 Regular Maintenance
- Update statistics
- Rebuild indexes
- Clean up old data
- Backup verification

## 9. Security Considerations

### 9.1 Data Security
- Encrypt sensitive business information
- Implement row-level security for B2B data
- Audit trail for data changes
- Access control for different user types

### 9.2 Compliance
- GDPR compliance for EU customers
- PCI DSS compliance for payment data
- SOX compliance for financial data
- Industry-specific regulations