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
exports.CacheController = void 0;
const common_1 = require("@nestjs/common");
const cache_warming_service_1 = require("./cache-warming.service");
const cache_service_1 = require("./cache.service");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
let CacheController = class CacheController {
    constructor(cacheService, cacheWarmingService) {
        this.cacheService = cacheService;
        this.cacheWarmingService = cacheWarmingService;
    }
    async getCacheStats() {
        return {
            message: "Cache is operational",
            timestamp: new Date().toISOString(),
        };
    }
    async clearCache() {
        await this.cacheService.reset();
        return {
            message: "Cache cleared successfully",
            timestamp: new Date().toISOString(),
        };
    }
    async deleteKey(key) {
        await this.cacheService.del(key);
        return {
            message: `Cache key '${key}' deleted successfully`,
            timestamp: new Date().toISOString(),
        };
    }
    async getKey(key) {
        const value = await this.cacheService.get(key);
        return {
            key,
            value,
            exists: value !== null,
            timestamp: new Date().toISOString(),
        };
    }
    async invalidateProductCache() {
        const keysToInvalidate = [
            "products:list:0:10:all:all",
            "products:list:0:20:all:all",
            "products:list:0:10:all:true",
            "products:list:0:20:all:true",
        ];
        for (const key of keysToInvalidate) {
            await this.cacheService.del(key);
        }
        return {
            message: "Product cache invalidated successfully",
            keysInvalidated: keysToInvalidate.length,
            timestamp: new Date().toISOString(),
        };
    }
    async invalidateCategoryCache() {
        const keysToInvalidate = ["categories:list:all", "categories:tree"];
        for (const key of keysToInvalidate) {
            await this.cacheService.del(key);
        }
        return {
            message: "Category cache invalidated successfully",
            keysInvalidated: keysToInvalidate.length,
            timestamp: new Date().toISOString(),
        };
    }
    async warmUpCache(type) {
        const cacheType = type || "all";
        try {
            await this.cacheWarmingService.refreshCache(cacheType);
            return {
                message: `Cache warm-up completed for: ${cacheType}`,
                type: cacheType,
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            return {
                message: `Cache warm-up failed for: ${cacheType}`,
                error: error.message,
                timestamp: new Date().toISOString(),
            };
        }
    }
};
exports.CacheController = CacheController;
__decorate([
    (0, common_1.Get)("stats"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CacheController.prototype, "getCacheStats", null);
__decorate([
    (0, common_1.Delete)("clear"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CacheController.prototype, "clearCache", null);
__decorate([
    (0, common_1.Delete)("key/:key"),
    __param(0, (0, common_1.Param)("key")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CacheController.prototype, "deleteKey", null);
__decorate([
    (0, common_1.Get)("key/:key"),
    __param(0, (0, common_1.Param)("key")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CacheController.prototype, "getKey", null);
__decorate([
    (0, common_1.Post)("invalidate/products"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CacheController.prototype, "invalidateProductCache", null);
__decorate([
    (0, common_1.Post)("invalidate/categories"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CacheController.prototype, "invalidateCategoryCache", null);
__decorate([
    (0, common_1.Post)("warm-up"),
    __param(0, (0, common_1.Query)("type")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CacheController.prototype, "warmUpCache", null);
exports.CacheController = CacheController = __decorate([
    (0, common_1.Controller)("api/cache"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    __metadata("design:paramtypes", [cache_service_1.CacheService,
        cache_warming_service_1.CacheWarmingService])
], CacheController);
//# sourceMappingURL=cache.controller.js.map