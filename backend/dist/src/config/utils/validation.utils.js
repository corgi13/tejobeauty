"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateConfigValue = validateConfigValue;
exports.transformConfigValue = transformConfigValue;
exports.validateConfigSchemas = validateConfigSchemas;
const config_schema_interface_1 = require("../interfaces/config-schema.interface");
function validateConfigValue(value, schema) {
    if (schema.required && (value === undefined || value === "")) {
        return {
            type: config_schema_interface_1.ConfigErrorType.MISSING_REQUIRED,
            key: schema.key,
            message: `Missing required environment variable '${schema.key}'`,
            suggestion: `Please set ${schema.key} in your .env file. ${schema.description}`,
        };
    }
    if (value === undefined || value === "") {
        return null;
    }
    const typeValidationError = validateType(value, schema.type, schema.key);
    if (typeValidationError) {
        return typeValidationError;
    }
    if (schema.validation && !schema.validation(value)) {
        return {
            type: config_schema_interface_1.ConfigErrorType.VALIDATION_FAILED,
            key: schema.key,
            message: `Environment variable '${schema.key}' failed custom validation`,
            suggestion: `Please check the format of ${schema.key}. ${schema.description}`,
        };
    }
    return null;
}
function validateType(value, type, key) {
    switch (type) {
        case "string":
            return null;
        case "number":
            if (isNaN(Number(value))) {
                return {
                    type: config_schema_interface_1.ConfigErrorType.INVALID_FORMAT,
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
                    type: config_schema_interface_1.ConfigErrorType.INVALID_FORMAT,
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
            }
            catch {
                return {
                    type: config_schema_interface_1.ConfigErrorType.INVALID_FORMAT,
                    key,
                    message: `Environment variable '${key}' must be a valid URL`,
                    suggestion: `Please provide a valid URL format for ${key} (e.g., https://example.com)`,
                };
            }
        case "email":
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                return {
                    type: config_schema_interface_1.ConfigErrorType.INVALID_FORMAT,
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
            }
            catch {
                return {
                    type: config_schema_interface_1.ConfigErrorType.INVALID_FORMAT,
                    key,
                    message: `Environment variable '${key}' must be valid JSON`,
                    suggestion: `Please provide valid JSON format for ${key}`,
                };
            }
        default:
            return null;
    }
}
function transformConfigValue(value, schema) {
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
            }
            catch {
                return schema.default;
            }
        default:
            return value;
    }
}
function validateConfigSchemas(envVars, schemas) {
    const errors = [];
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
//# sourceMappingURL=validation.utils.js.map