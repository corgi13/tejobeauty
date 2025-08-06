export interface DatabaseConfig {
    url: string;
    maxConnections: number;
    connectionTimeout: number;
    ssl: boolean;
    logging: boolean;
}
export interface CacheConfig {
    host: string;
    port: number;
    password?: string;
    ttl: number;
    maxMemory: string;
}
export interface SearchConfig {
    applicationId: string;
    apiKey: string;
    indexName: string;
    enabled: boolean;
}
export interface PaymentConfig {
    stripePublicKey: string;
    stripeSecretKey: string;
    webhookSecret: string;
    currency: string;
}
export interface EmailConfig {
    host: string;
    port: number;
    username: string;
    password: string;
    secure: boolean;
    from: string;
}
