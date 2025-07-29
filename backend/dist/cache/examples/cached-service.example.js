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
exports.CachedServiceExample = void 0;
const common_1 = require("@nestjs/common");
const cache_evict_decorator_1 = require("../decorators/cache-evict.decorator");
const cacheable_decorator_1 = require("../decorators/cacheable.decorator");
let CachedServiceExample = class CachedServiceExample {
    async getUserProfile(userId) {
        console.log(`Fetching user profile for ${userId} from database...`);
        return {
            id: userId,
            name: "John Doe",
            email: "john@example.com",
            lastLogin: new Date(),
        };
    }
    async updateUserProfile(userId, profileData) {
        console.log(`Updating user profile for ${userId}...`);
        return {
            id: userId,
            ...profileData,
            updatedAt: new Date(),
        };
    }
    async deleteUser(userId) {
        console.log(`Deleting user ${userId}...`);
        return { deleted: true, userId };
    }
    async resetAllData() {
        console.log("Resetting all data...");
        return { reset: true, timestamp: new Date() };
    }
};
exports.CachedServiceExample = CachedServiceExample;
__decorate([
    (0, cacheable_decorator_1.Cacheable)({
        keyPrefix: "user-profile",
        ttl: 300,
        keyGenerator: (userId) => `user-profile:${userId}`,
        condition: (result) => result !== null,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CachedServiceExample.prototype, "getUserProfile", null);
__decorate([
    (0, cache_evict_decorator_1.CacheEvict)({
        keyGenerator: (userId) => [`user-profile:${userId}`],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CachedServiceExample.prototype, "updateUserProfile", null);
__decorate([
    (0, cache_evict_decorator_1.CacheEvict)({
        keys: ["user-list:active", "user-list:all"],
        keyPrefixes: ["user-profile:"],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CachedServiceExample.prototype, "deleteUser", null);
__decorate([
    (0, cache_evict_decorator_1.CacheEvict)({
        allEntries: true,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CachedServiceExample.prototype, "resetAllData", null);
exports.CachedServiceExample = CachedServiceExample = __decorate([
    (0, common_1.Injectable)()
], CachedServiceExample);
//# sourceMappingURL=cached-service.example.js.map