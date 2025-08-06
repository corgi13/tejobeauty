"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheModule = void 0;
const cache_manager_1 = require("@nestjs/cache-manager");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cache_manager_redis_yet_1 = require("cache-manager-redis-yet");
const cache_warming_service_1 = require("./cache-warming.service");
const cache_controller_1 = require("./cache.controller");
const cache_service_1 = require("./cache.service");
const prisma_service_1 = require("../prisma.service");
const cache_interceptor_1 = require("./interceptors/cache.interceptor");
let CacheModule = class CacheModule {
};
exports.CacheModule = CacheModule;
exports.CacheModule = CacheModule = __decorate([
    (0, common_1.Module)({
        imports: [
            cache_manager_1.CacheModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => {
                    const redisUrl = configService.get("REDIS_URL");
                    if (redisUrl) {
                        const url = new URL(redisUrl);
                        return {
                            store: cache_manager_redis_yet_1.redisStore,
                            socket: {
                                host: url.hostname,
                                port: parseInt(url.port),
                            },
                            username: url.username || "default",
                            password: url.password,
                            ttl: 300,
                        };
                    }
                    else {
                        console.warn("Redis URL not provided, using in-memory cache");
                        return {
                            ttl: 300,
                            max: 1000,
                        };
                    }
                },
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [cache_controller_1.CacheController],
        providers: [
            cache_service_1.CacheService,
            cache_warming_service_1.CacheWarmingService,
            cache_interceptor_1.CacheInterceptor,
            prisma_service_1.PrismaService,
        ],
        exports: [cache_service_1.CacheService, cache_warming_service_1.CacheWarmingService, cache_interceptor_1.CacheInterceptor],
    })
], CacheModule);
//# sourceMappingURL=cache.module.js.map