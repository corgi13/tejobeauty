import { ValidationResult } from "./config-schema.interface";
export interface IConfigService {
    get<T>(key: string): T;
    getOrDefault<T>(key: string, defaultValue: T): T;
    has(key: string): boolean;
    isProduction(): boolean;
    isDevelopment(): boolean;
    getEnvironment(): string;
    validateConfiguration(): ValidationResult;
}
export interface IConfigLoader {
    loadConfiguration(): Promise<ConfigurationResult>;
    validateSchema(schemas: ServiceConfig[]): ValidationResult;
}
import { ConfigurationResult, ServiceConfig } from "./config-schema.interface";
