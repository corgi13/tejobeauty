/**
 * Core configuration schema interfaces for the Environment Configuration Management system
 */

export type ConfigType =
  | "string"
  | "number"
  | "boolean"
  | "url"
  | "email"
  | "json";
export type Environment = "development" | "production" | "test";

/**
 * Configuration schema definition for individual environment variables
 */
export interface ConfigSchema {
  /** Environment variable key */
  key: string;

  /** Data type for validation and transformation */
  type: ConfigType;

  /** Whether this configuration is required */
  required: boolean;

  /** Default value if not provided */
  default?: any;

  /** Human-readable description */
  description: string;

  /** Custom validation function */
  validation?: (value: any) => boolean;

  /** Whether this value contains sensitive information */
  sensitive?: boolean;

  /** Environments where this configuration applies */
  environments?: Environment[];
}

/**
 * Service-specific configuration definition
 */
export interface ServiceConfig {
  /** Service name */
  name: string;

  /** Configuration schemas for this service */
  schemas: ConfigSchema[];

  /** Whether this service is optional */
  optional?: boolean;
}

/**
 * Configuration validation result
 */
export interface ValidationResult {
  /** Whether validation passed */
  valid: boolean;

  /** Validation errors */
  errors: ConfigError[];

  /** Warnings (non-blocking issues) */
  warnings: ConfigWarning[];
}

/**
 * Configuration error types
 */
export enum ConfigErrorType {
  MISSING_REQUIRED = "MISSING_REQUIRED",
  INVALID_FORMAT = "INVALID_FORMAT",
  VALIDATION_FAILED = "VALIDATION_FAILED",
  SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",
}

/**
 * Configuration error details
 */
export interface ConfigError {
  /** Error type */
  type: ConfigErrorType;

  /** Environment variable key */
  key: string;

  /** Error message */
  message: string;

  /** Suggestion for fixing the error */
  suggestion?: string;

  /** Service name if applicable */
  service?: string;
}

/**
 * Configuration warning details
 */
export interface ConfigWarning {
  /** Environment variable key */
  key: string;

  /** Warning message */
  message: string;

  /** Service name if applicable */
  service?: string;
}

/**
 * Configuration loading result
 */
export interface ConfigurationResult {
  /** Whether configuration loading was successful */
  success: boolean;

  /** Loaded configuration values */
  config: Record<string, any>;

  /** Validation result */
  validation: ValidationResult;

  /** Current environment */
  environment: Environment;
}
