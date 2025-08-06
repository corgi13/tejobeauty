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
exports.CacheInterceptor = exports.CACHE_TAGS_METADATA = exports.CACHE_TTL_METADATA = exports.CACHE_KEY_METADATA = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const cache_service_1 = require("./cache.service");
exports.CACHE_KEY_METADATA = "cache_key";
exports.CACHE_TTL_METADATA = "cache_ttl";
exports.CACHE_TAGS_METADATA = "cache_tags";
let CacheInterceptor = class CacheInterceptor {
    constructor(cacheService, reflector) {
        this.cacheService = cacheService;
        this.reflector = reflector;
    }
    async intercept(context, next) {
        const cacheKey = this.reflector.get(exports.CACHE_KEY_METADATA, context.getHandler());
        if (!cacheKey) {
            return next.handle();
        }
        const ttl = this.reflector.get(exports.CACHE_TTL_METADATA, context.getHandler());
        const tags = this.reflector.get(exports.CACHE_TAGS_METADATA, context.getHandler());
        const request = context.switchToHttp().getRequest();
        const dynamicKey = this.generateDynamicKey(cacheKey, request);
        const cachedResult = await this.cacheService.get(dynamicKey);
        if (cachedResult !== null) {
            return (0, rxjs_1.of)(cachedResult);
        }
        return next.handle().pipe((0, operators_1.tap)(async (result) => {
            if (tags) {
                await this.cacheService.set(dynamicKey, result, ttl);
            }
            else {
                await this.cacheService.set(dynamicKey, result, ttl);
            }
        }));
    }
    generateDynamicKey(baseKey, request) {
        const { params, query, user } = request;
        const keyParts = [baseKey];
        if (user?.id) {
            keyParts.push(`user:${user.id}`);
        }
        if (params && Object.keys(params).length > 0) {
            const paramString = Object.entries(params)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([key, value]) => `${key}:${value}`)
                .join(",");
            keyParts.push(`params:${paramString}`);
        }
        if (query && Object.keys(query).length > 0) {
            const queryString = Object.entries(query)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([key, value]) => `${key}:${value}`)
                .join(",");
            keyParts.push(`query:${queryString}`);
        }
        return keyParts.join(":");
    }
};
exports.CacheInterceptor = CacheInterceptor;
exports.CacheInterceptor = CacheInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cache_service_1.CacheService,
        core_1.Reflector])
], CacheInterceptor);
//# sourceMappingURL=cache.interceptor.js.map