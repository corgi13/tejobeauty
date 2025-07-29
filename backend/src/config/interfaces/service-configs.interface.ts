/**
 * Service-specific configuration interfaces
 */

/**
 * Database configuration interface
 */
export interface DatabaseConfig {
  /** Database connection URL */
  url: string;

  /** Maximum number of connections */
  maxConnections: number;

  /** Connection timeout in milliseconds */
  connectionTimeout: number;

  /** Whether to use SSL */
  ssl: boolean;

  /** Whether to enable query logging */
  logging: boolean;
}

/**
 * Cache configuration interface
 */
export interface CacheConfig {
  /** Redis host */
  host: string;

  /** Redis port */
  port: number;

  /** Redis password (optional) */
  password?: string;

  /** Default TTL in seconds */
  ttl: number;

  /** Maximum memory usage */
  maxMemory: string;
}

/**
 * Search configuration interface
 */
export interface SearchConfig {
  /** Algolia application ID */
  applicationId: string;

  /** Algolia API key */
  apiKey: string;

  /** Search index name */
  indexName: string;

  /** Whether search is enabled */
  enabled: boolean;
}

/**
 * Payment configuration interface
 */
export interface PaymentConfig {
  /** Stripe public key */
  stripePublicKey: string;

  /** Stripe secret key */
  stripeSecretKey: string;

  /** Stripe webhook secret */
  webhookSecret: string;

  /** Default currency */
  currency: string;
}

/**
 * Email configuration interface
 */
export interface EmailConfig {
  /** SMTP host */
  host: string;

  /** SMTP port */
  port: number;

  /** SMTP username */
  username: string;

  /** SMTP password */
  password: string;

  /** Whether to use TLS */
  secure: boolean;

  /** From email address */
  from: string;
}
