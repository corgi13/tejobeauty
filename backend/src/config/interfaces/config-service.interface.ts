/**
 * Configuration service interfaces
 */

import { ValidationResult } from "./config-schema.interface";

/**
 * Main configuration service interface
 */
export interface IConfigService {
  /**
   * Get a configuration value with type safety
   */
  get<T>(key: string): T;

  /**
   * Get a configuration value with a default fallback
   */
  getOrDefault<T>(key: string, defaultValue: T): T;

  /**
   * Check if a configuration key exists
   */
  has(key: string): boolean;

  /**
   * Check if running in production environment
   */
  isProduction(): boolean;

  /**
   * Check if running in development environment
   */
  isDevelopment(): boolean;

  /**
   * Get current environment
   */
  getEnvironment(): string;

  /**
   * Validate current configuration
   */
  validateConfiguration(): ValidationResult;
}

/**
 * Configuration loader interface
 */
export interface IConfigLoader {
  /**
   * Load and validate configuration
   */
  loadConfiguration(): Promise<ConfigurationResult>;

  /**
   * Validate configuration against schemas
   */
  validateSchema(schemas: ServiceConfig[]): ValidationResult;
}

/**
 * Import required types
 */
import { ConfigurationResult, ServiceConfig } from "./config-schema.interface";
