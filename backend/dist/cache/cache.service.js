"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
const cache_manager_1 = require("@nestjs/cache-manager");
const common_1 = require("@nestjs/common");
let CacheService = class CacheService {
    constructor(cacheManager) {
        this.cacheManager = cacheManager;
    }
    async get(key) {
        try {
            const result = await this.cacheManager.get(key);
            return result !== undefined ? result : null;
        }
        catch (error) {
            console.error(`Error getting cache key ${key}:`, error);
            return null;
        }
    }
    async set(key, value, ttl) {
        try {
            if (ttl) {
                await this.cacheManager.set(key, value, ttl * 1000);
            }
            else {
                await this.cacheManager.set(key, value);
            }
        }
        catch (error) {
            console.error(`Error setting cache key ${key}:`, error);
        }
    }
    async del(key) {
        try {
            await this.cacheManager.del(key);
        }
        catch (error) {
            console.error(`Error deleting cache key ${key}:`, error);
        }
    }
    async reset() {
        try {
            if (typeof this.cacheManager.clear === "function") {
                await this.cacheManager.clear();
            }
            else {
                console.warn("Cache reset not supported, using alternative method");
            }
        }
        catch (error) {
            console.error("Error clearing cache:", error);
        }
    }
    async getOrSet(key, factory, ttl) {
        try {
            const cached = await this.get(key);
            if (cached !== null) {
                return cached;
            }
            const value = await factory();
            await this.set(key, value, ttl);
            return value;
        }
        catch (error) {
            console.error(`Error in getOrSet for key ${key}:`, error);
            return await factory();
        }
    }
    async increment(key, increment = 1, ttl) {
        try {
            const current = (await this.get(key)) || 0;
            const newValue = current + increment;
            await this.set(key, newValue, ttl);
            return newValue;
        }
        catch (error) {
            console.error(`Error incrementing cache key ${key}:`, error);
            return increment;
        }
    }
    async exists(key) {
        try {
            const value = await this.get(key);
            return value !== null;
        }
        catch (error) {
            console.error(`Error checking existence of cache key ${key}:`, error);
            return false;
        }
    }
    async setMultiple(keyValuePairs, ttl) {
        try {
            const promises = Object.entries(keyValuePairs).map(([key, value]) => this.set(key, value, ttl));
            await Promise.all(promises);
        }
        catch (error) {
            console.error("Error setting multiple cache values:", error);
        }
    }
    async getMultiple(keys) {
        try {
            const promises = keys.map(async (key) => ({
                key,
                value: await this.get(key),
            }));
            const results = await Promise.all(promises);
            return results.reduce((acc, { key, value }) => {
                acc[key] = value;
                return acc;
            }, {});
        }
        catch (error) {
            console.error("Error getting multiple cache values:", error);
            return keys.reduce((acc, key) => {
                acc[key] = null;
                return acc;
            }, {});
        }
    }
    async deleteMultiple(keys) {
        try {
            const promises = keys.map((key) => this.del(key));
            await Promise.all(promises);
        }
        catch (error) {
            console.error("Error deleting multiple cache keys:", error);
        }
    }
    generateKey(prefix, ...parts) {
        return `${prefix}:${parts.join(":")}`;
    }
};
exports.CacheService = CacheService;
exports.CacheService = CacheService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object])
], CacheService);
//# sourceMappingURL=cache.service.js.map