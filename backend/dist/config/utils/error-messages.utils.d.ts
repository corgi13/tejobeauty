import { ConfigErrorType } from "../interfaces/config-schema.interface";
export declare const ERROR_MESSAGES: {
    MISSING_REQUIRED: (key: string, service?: string) => string;
    INVALID_FORMAT: (key: string, expected: string) => string;
    VALIDATION_FAILED: (key: string, reason: string) => string;
    SERVICE_UNAVAILABLE: (service: string, reason: string) => string;
};
export declare class ConfigurationError extends Error {
    readonly type: ConfigErrorType;
    readonly key: string;
    readonly suggestion?: string | undefined;
    readonly service?: string | undefined;
    constructor(type: ConfigErrorType, key: string, message: string, suggestion?: string | undefined, service?: string | undefined);
    getFormattedMessage(): string;
}
export declare function createConfigError(type: ConfigErrorType, key: string, details?: {
    expected?: string;
    reason?: string;
    service?: string;
    suggestion?: string;
}): ConfigurationError;
export declare function maskSensitiveValue(value: string, sensitive?: boolean): string;
export declare function formatConfigErrorsForLogging(errors: ConfigurationError[]): string;
