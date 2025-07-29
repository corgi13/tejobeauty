/**
 * Configuration error message templates and utilities
 */

import { ConfigErrorType } from "../interfaces/config-schema.interface";

/**
 * Error message templates
 */
export const ERROR_MESSAGES = {
  [ConfigErrorType.MISSING_REQUIRED]: (key: string, service?: string) =>
    `Missing required environment variable '${key}'${service ? ` for ${service} service` : ""}. Please set this variable in your .env file.`,

  [ConfigErrorType.INVALID_FORMAT]: (key: string, expected: string) =>
    `Environment variable '${key}' has invalid format. Expected: ${expected}`,

  [ConfigErrorType.VALIDATION_FAILED]: (key: string, reason: string) =>
    `Environment variable '${key}' validation failed: ${reason}`,

  [ConfigErrorType.SERVICE_UNAVAILABLE]: (service: string, reason: string) =>
    `Service '${service}' is unavailable: ${reason}`,
};

/**
 * Configuration error class for better error handling
 */
export class ConfigurationError extends Error {
  constructor(
    public readonly type: ConfigErrorType,
    public readonly key: string,
    message: string,
    public readonly suggestion?: string,
    public readonly service?: string,
  ) {
    super(message);
    this.name = "ConfigurationError";
  }

  /**
   * Creates a formatted error message with suggestions
   */
  getFormattedMessage(): string {
    let message = this.message;

    if (this.suggestion) {
      message += `\n\nSuggestion: ${this.suggestion}`;
    }

    if (this.service) {
      message += `\nService: ${this.service}`;
    }

    return message;
  }
}

/**
 * Creates a configuration error from error details
 */
export function createConfigError(
  type: ConfigErrorType,
  key: string,
  details?: {
    expected?: string;
    reason?: string;
    service?: string;
    suggestion?: string;
  },
): ConfigurationError {
  let message: string;

  switch (type) {
    case ConfigErrorType.MISSING_REQUIRED:
      message = ERROR_MESSAGES[type](key, details?.service);
      break;
    case ConfigErrorType.INVALID_FORMAT:
      message = ERROR_MESSAGES[type](key, details?.expected || "valid format");
      break;
    case ConfigErrorType.VALIDATION_FAILED:
      message = ERROR_MESSAGES[type](key, details?.reason || "unknown reason");
      break;
    case ConfigErrorType.SERVICE_UNAVAILABLE:
      message = ERROR_MESSAGES[type](
        details?.service || "unknown",
        details?.reason || "unknown reason",
      );
      break;
    default:
      message = `Configuration error for '${key}'`;
  }

  return new ConfigurationError(
    type,
    key,
    message,
    details?.suggestion,
    details?.service,
  );
}

/**
 * Masks sensitive values in error messages and logs
 */
export function maskSensitiveValue(
  value: string,
  sensitive: boolean = false,
): string {
  if (!sensitive) {
    return value;
  }

  if (value.length <= 4) {
    return "*".repeat(value.length);
  }

  // Show first 2 and last 2 characters, mask the middle
  return (
    value.substring(0, 2) +
    "*".repeat(value.length - 4) +
    value.substring(value.length - 2)
  );
}

/**
 * Formats configuration errors for logging
 */
export function formatConfigErrorsForLogging(
  errors: ConfigurationError[],
): string {
  if (errors.length === 0) {
    return "No configuration errors";
  }

  const errorMessages = errors.map((error, index) => {
    return `${index + 1}. ${error.getFormattedMessage()}`;
  });

  return `Configuration Errors (${errors.length}):\n${errorMessages.join("\n\n")}`;
}
