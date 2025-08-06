"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationRegistry = void 0;
const validation_utils_1 = require("./validation.utils");
class ConfigurationRegistry {
    static register(service) {
        this.services.set(service.name, service);
    }
    static getService(name) {
        return this.services.get(name);
    }
    static getAllServices() {
        return Array.from(this.services.values());
    }
    static getRequiredServices() {
        return this.getAllServices().filter((service) => !service.optional);
    }
    static getOptionalServices() {
        return this.getAllServices().filter((service) => service.optional);
    }
    static validate(envVars) {
        const allErrors = [];
        const allWarnings = [];
        for (const service of this.getAllServices()) {
            const result = (0, validation_utils_1.validateConfigSchemas)(envVars, service.schemas);
            const serviceErrors = result.errors.map((error) => ({
                ...error,
                service: service.name,
            }));
            allErrors.push(...serviceErrors);
            allWarnings.push(...result.warnings);
        }
        return {
            valid: allErrors.length === 0,
            errors: allErrors,
            warnings: allWarnings,
        };
    }
    static hasService(name) {
        return this.services.has(name);
    }
    static clear() {
        this.services.clear();
    }
    static getServiceNames() {
        return Array.from(this.services.keys());
    }
    static getServiceSchemas(serviceName) {
        const service = this.getService(serviceName);
        return service?.schemas;
    }
}
exports.ConfigurationRegistry = ConfigurationRegistry;
ConfigurationRegistry.services = new Map();
//# sourceMappingURL=config-registry.utils.js.map