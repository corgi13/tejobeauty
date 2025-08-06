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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheInterceptor = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const cache_service_1 = require("../cache.service");
const cache_evict_decorator_1 = require("../decorators/cache-evict.decorator");
const cacheable_decorator_1 = require("../decorators/cacheable.decorator");
let CacheInterceptor = class CacheInterceptor {
    constructor(cacheService, reflector) {
        this.cacheService = cacheService;
        this.reflector = reflector;
    }
    async intercept(context, next) {
        const cacheableOptions = this.reflector.get(cacheable_decorator_1.CACHEABLE_KEY, context.getHandler());
        const cacheEvictOptions = this.reflector.get(cache_evict_decorator_1.CACHE_EVICT_KEY, context.getHandler());
        if (cacheEvictOptions?.beforeInvocation) {
            await this.handleCacheEviction(cacheEvictOptions, context);
        }
        if (cacheableOptions) {
            return this.handleCaching(cacheableOptions, context, next);
        }
        return next.handle().pipe((0, operators_1.tap)(async () => {
            if (cacheEvictOptions && !cacheEvictOptions.beforeInvocation) {
                await this.handleCacheEviction(cacheEvictOptions, context);
            }
        }));
    }
    async handleCaching(options, context, next) {
        const args = context.getArgs();
        const cacheKey = this.generateCacheKey(options, args);
        const cachedResult = await this.cacheService.get(cacheKey);
        if (cachedResult !== null) {
            return (0, rxjs_1.of)(cachedResult);
        }
        return next.handle().pipe((0, operators_1.tap)(async (result) => {
            if (options.condition && !options.condition(result)) {
                return;
            }
            await this.cacheService.set(cacheKey, result, options.ttl);
        }));
    }
    async handleCacheEviction(options, context) {
        try {
            if (options.allEntries) {
                await this.cacheService.reset();
                return;
            }
            const args = context.getArgs();
            const keysToEvict = [];
            if (options.keys) {
                keysToEvict.push(...options.keys);
            }
            if (options.keyGenerator) {
                const generatedKeys = options.keyGenerator(...args);
                keysToEvict.push(...generatedKeys);
            }
            if (keysToEvict.length > 0) {
                await this.cacheService.deleteMultiple(keysToEvict);
            }
            if (options.keyPrefixes) {
                console.log("Key prefix eviction not implemented yet:", options.keyPrefixes);
            }
            if (options.tags) {
                console.log("Tag-based eviction not implemented yet:", options.tags);
            }
        }
        catch (error) {
            console.error("Error in cache eviction:", error);
        }
    }
    generateCacheKey(options, args) {
        if (options.keyGenerator) {
            return options.keyGenerator(...args);
        }
        const prefix = options.keyPrefix || "default";
        const argsKey = args.length > 0 ? JSON.stringify(args) : "no-args";
        return this.cacheService.generateKey(prefix, argsKey);
    }
};
exports.CacheInterceptor = CacheInterceptor;
exports.CacheInterceptor = CacheInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cache_service_1.CacheService,
        core_1.Reflector])
], CacheInterceptor);
//# sourceMappingURL=cache.interceptor.js.map