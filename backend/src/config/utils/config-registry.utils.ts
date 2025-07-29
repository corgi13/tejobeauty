/**
 * Configuration registry for managing service configurations
 */

import { validateConfigSchemas } from "./validation.utils";
import {
  ServiceConfig,
  ValidationResult,
  ConfigError,
} from "../interfaces/config-schema.interface";

/**
 * Configuration registry class for managing service configurations
 */
export class ConfigurationRegistry {
  private static services: Map<string, ServiceConfig> = new Map();

  /**
   * Register a service configuration
   */
  static register(service: ServiceConfig): void {
    this.services.set(service.name, service);
  }

  /**
   * Get a service configuration by name
   */
  static getService(name: string): ServiceConfig | undefined {
    return this.services.get(name);
  }

  /**
   * Get all registered services
   */
  static getAllServices(): ServiceConfig[] {
    return Array.from(this.services.values());
  }

  /**
   * Get all required services (non-optional)
   */
  static getRequiredServices(): ServiceConfig[] {
    return this.getAllServices().filter((service) => !service.optional);
  }

  /**
   * Get all optional services
   */
  static getOptionalServices(): ServiceConfig[] {
    return this.getAllServices().filter((service) => service.optional);
  }

  /**
   * Validate all registered service configurations
   */
  static validate(
    envVars: Record<string, string | undefined>,
  ): ValidationResult {
    const allErrors: ConfigError[] = [];
    const allWarnings: any[] = [];

    for (const service of this.getAllServices()) {
      const result = validateConfigSchemas(envVars, service.schemas);

      // Add service context to errors
      const serviceErrors = result.errors.map((error) => ({
        ...error,
        service: service.name,
      }));

      allErrors.push(...serviceErrors);
      allWarnings.push(...result.warnings);
    }

    return {
      valid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings,
    };
  }

  /**
   * Check if a service is registered
   */
  static hasService(name: string): boolean {
    return this.services.has(name);
  }

  /**
   * Clear all registered services (mainly for testing)
   */
  static clear(): void {
    this.services.clear();
  }

  /**
   * Get service names
   */
  static getServiceNames(): string[] {
    return Array.from(this.services.keys());
  }

  /**
   * Get configuration schema for a specific service
   */
  static getServiceSchemas(
    serviceName: string,
  ): ServiceConfig["schemas"] | undefined {
    const service = this.getService(serviceName);
    return service?.schemas;
  }
}
