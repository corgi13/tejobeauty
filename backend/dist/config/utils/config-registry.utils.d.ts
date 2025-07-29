import { ServiceConfig, ValidationResult } from "../interfaces/config-schema.interface";
export declare class ConfigurationRegistry {
    private static services;
    static register(service: ServiceConfig): void;
    static getService(name: string): ServiceConfig | undefined;
    static getAllServices(): ServiceConfig[];
    static getRequiredServices(): ServiceConfig[];
    static getOptionalServices(): ServiceConfig[];
    static validate(envVars: Record<string, string | undefined>): ValidationResult;
    static hasService(name: string): boolean;
    static clear(): void;
    static getServiceNames(): string[];
    static getServiceSchemas(serviceName: string): ServiceConfig["schemas"] | undefined;
}
