import { ConfigSchema, ValidationResult, ConfigError } from "../interfaces/config-schema.interface";
export declare function validateConfigValue(value: string | undefined, schema: ConfigSchema): ConfigError | null;
export declare function transformConfigValue(value: string | undefined, schema: ConfigSchema): any;
export declare function validateConfigSchemas(envVars: Record<string, string | undefined>, schemas: ConfigSchema[]): ValidationResult;
