export type ConfigType = "string" | "number" | "boolean" | "url" | "email" | "json";
export type Environment = "development" | "production" | "test";
export interface ConfigSchema {
    key: string;
    type: ConfigType;
    required: boolean;
    default?: any;
    description: string;
    validation?: (value: any) => boolean;
    sensitive?: boolean;
    environments?: Environment[];
}
export interface ServiceConfig {
    name: string;
    schemas: ConfigSchema[];
    optional?: boolean;
}
export interface ValidationResult {
    valid: boolean;
    errors: ConfigError[];
    warnings: ConfigWarning[];
}
export declare enum ConfigErrorType {
    MISSING_REQUIRED = "MISSING_REQUIRED",
    INVALID_FORMAT = "INVALID_FORMAT",
    VALIDATION_FAILED = "VALIDATION_FAILED",
    SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE"
}
export interface ConfigError {
    type: ConfigErrorType;
    key: string;
    message: string;
    suggestion?: string;
    service?: string;
}
export interface ConfigWarning {
    key: string;
    message: string;
    service?: string;
}
export interface ConfigurationResult {
    success: boolean;
    config: Record<string, any>;
    validation: ValidationResult;
    environment: Environment;
}
