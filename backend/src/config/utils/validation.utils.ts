/**
 * Configuration validation utilities
 */

import {
  ConfigType,
  ConfigSchema,
  ValidationResult,
  ConfigError,
  ConfigErrorType,
} from "../interfaces/config-schema.interface";

/**
 * Validates a single configuration value against its schema
 */
export function validateConfigValue(
  value: string | undefined,
  schema: ConfigSchema,
): ConfigError | null {
  // Check if required value is missing
  if (schema.required && (value === undefined || value === "")) {
    return {
      type: ConfigErrorType.MISSING_REQUIRED,
      key: schema.key,
      message: `Missing required environment variable '${schema.key}'`,
      suggestion: `Please set ${schema.key} in your .env file. ${schema.description}`,
    };
  }

  // If value is not provided and not required, it's valid
  if (value === undefined || value === "") {
    return null;
  }

  // Validate based on type
  const typeValidationError = validateType(value, schema.type, schema.key);
  if (typeValidationError) {
    return typeValidationError;
  }

  // Run custom validation if provided
  if (schema.validation && !schema.validation(value)) {
    return {
      type: ConfigErrorType.VALIDATION_FAILED,
      key: schema.key,
      message: `Environment variable '${schema.key}' failed custom validation`,
      suggestion: `Please check the format of ${schema.key}. ${schema.description}`,
    };
  }

  return null;
}

/**
 * Validates a value against a specific type
 */
function validateType(
  value: string,
  type: ConfigType,
  key: string,
): ConfigError | null {
  switch (type) {
    case "string":
      return null; // All values are strings by default

    case "number":
      if (isNaN(Number(value))) {
        return {
          type: ConfigErrorType.INVALID_FORMAT,
          key,
          message: `Environment variable '${key}' must be a valid number`,
          suggestion: `Please provide a numeric value for ${key}`,
        };
      }
      return null;

    case "boolean":
      const lowerValue = value.toLowerCase();
      if (!["true", "false", "1", "0", "yes", "no"].includes(lowerValue)) {
        return {
          type: ConfigErrorType.INVALID_FORMAT,
          key,
          message: `Environment variable '${key}' must be a valid boolean`,
          suggestion: `Please use 'true', 'false', '1', '0', 'yes', or 'no' for ${key}`,
        };
      }
      return null;

    case "url":
      try {
        new URL(value);
        return null;
      } catch {
        return {
          type: ConfigErrorType.INVALID_FORMAT,
          key,
          message: `Environment variable '${key}' must be a valid URL`,
          suggestion: `Please provide a valid URL format for ${key} (e.g., https://example.com)`,
        };
      }

    case "email":
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return {
          type: ConfigErrorType.INVALID_FORMAT,
          key,
          message: `Environment variable '${key}' must be a valid email address`,
          suggestion: `Please provide a valid email format for ${key} (e.g., user@example.com)`,
        };
      }
      return null;

    case "json":
      try {
        JSON.parse(value);
        return null;
      } catch {
        return {
          type: ConfigErrorType.INVALID_FORMAT,
          key,
          message: `Environment variable '${key}' must be valid JSON`,
          suggestion: `Please provide valid JSON format for ${key}`,
        };
      }

    default:
      return null;
  }
}

/**
 * Transforms a string value to the appropriate type
 */
export function transformConfigValue(
  value: string | undefined,
  schema: ConfigSchema,
): any {
  if (value === undefined || value === "") {
    return schema.default;
  }

  switch (schema.type) {
    case "string":
      return value;

    case "number":
      return Number(value);

    case "boolean":
      const lowerValue = value.toLowerCase();
      return ["true", "1", "yes"].includes(lowerValue);

    case "url":
      return value;

    case "email":
      return value;

    case "json":
      try {
        return JSON.parse(value);
      } catch {
        return schema.default;
      }

    default:
      return value;
  }
}

/**
 * Validates multiple configuration schemas
 */
export function validateConfigSchemas(
  envVars: Record<string, string | undefined>,
  schemas: ConfigSchema[],
): ValidationResult {
  const errors: ConfigError[] = [];

  for (const schema of schemas) {
    const value = envVars[schema.key];
    const error = validateConfigValue(value, schema);

    if (error) {
      errors.push(error);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings: [],
  };
}
