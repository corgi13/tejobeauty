"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationError = exports.ERROR_MESSAGES = void 0;
exports.createConfigError = createConfigError;
exports.maskSensitiveValue = maskSensitiveValue;
exports.formatConfigErrorsForLogging = formatConfigErrorsForLogging;
const config_schema_interface_1 = require("../interfaces/config-schema.interface");
exports.ERROR_MESSAGES = {
    [config_schema_interface_1.ConfigErrorType.MISSING_REQUIRED]: (key, service) => `Missing required environment variable '${key}'${service ? ` for ${service} service` : ""}. Please set this variable in your .env file.`,
    [config_schema_interface_1.ConfigErrorType.INVALID_FORMAT]: (key, expected) => `Environment variable '${key}' has invalid format. Expected: ${expected}`,
    [config_schema_interface_1.ConfigErrorType.VALIDATION_FAILED]: (key, reason) => `Environment variable '${key}' validation failed: ${reason}`,
    [config_schema_interface_1.ConfigErrorType.SERVICE_UNAVAILABLE]: (service, reason) => `Service '${service}' is unavailable: ${reason}`,
};
class ConfigurationError extends Error {
    constructor(type, key, message, suggestion, service) {
        super(message);
        this.type = type;
        this.key = key;
        this.suggestion = suggestion;
        this.service = service;
        this.name = "ConfigurationError";
    }
    getFormattedMessage() {
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
exports.ConfigurationError = ConfigurationError;
function createConfigError(type, key, details) {
    let message;
    switch (type) {
        case config_schema_interface_1.ConfigErrorType.MISSING_REQUIRED:
            message = exports.ERROR_MESSAGES[type](key, details?.service);
            break;
        case config_schema_interface_1.ConfigErrorType.INVALID_FORMAT:
            message = exports.ERROR_MESSAGES[type](key, details?.expected || "valid format");
            break;
        case config_schema_interface_1.ConfigErrorType.VALIDATION_FAILED:
            message = exports.ERROR_MESSAGES[type](key, details?.reason || "unknown reason");
            break;
        case config_schema_interface_1.ConfigErrorType.SERVICE_UNAVAILABLE:
            message = exports.ERROR_MESSAGES[type](details?.service || "unknown", details?.reason || "unknown reason");
            break;
        default:
            message = `Configuration error for '${key}'`;
    }
    return new ConfigurationError(type, key, message, details?.suggestion, details?.service);
}
function maskSensitiveValue(value, sensitive = false) {
    if (!sensitive) {
        return value;
    }
    if (value.length <= 4) {
        return "*".repeat(value.length);
    }
    return (value.substring(0, 2) +
        "*".repeat(value.length - 4) +
        value.substring(value.length - 2));
}
function formatConfigErrorsForLogging(errors) {
    if (errors.length === 0) {
        return "No configuration errors";
    }
    const errorMessages = errors.map((error, index) => {
        return `${index + 1}. ${error.getFormattedMessage()}`;
    });
    return `Configuration Errors (${errors.length}):\n${errorMessages.join("\n\n")}`;
}
//# sourceMappingURL=error-messages.utils.js.map