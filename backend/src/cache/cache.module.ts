import { CacheModule as NestCacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { redisStore } from "cache-manager-redis-yet";

import { CacheWarmingService } from "./cache-warming.service";
import { CacheController } from "./cache.controller";
import { CacheService } from "./cache.service";
import { PrismaService } from "../prisma.service";
import { CacheInterceptor } from "./interceptors/cache.interceptor";

@Module({
  imports: [
    NestCacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const redisUrl = configService.get<string>("REDIS_URL");

        if (redisUrl) {
          // Parse Redis URL for Redis Cloud
          const url = new URL(redisUrl);

          return {
            store: redisStore,
            socket: {
              host: url.hostname,
              port: parseInt(url.port),
            },
            username: url.username || "default",
            password: url.password,
            ttl: 300, // 5 minutes default TTL
          };
        } else {
          // Fallback to in-memory cache for development
          console.warn("Redis URL not provided, using in-memory cache");
          return {
            ttl: 300, // 5 minutes default TTL
            max: 1000, // Maximum number of items in cache
          };
        }
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [CacheController],
  providers: [
    CacheService,
    CacheWarmingService,
    CacheInterceptor,
    PrismaService,
  ],
  exports: [CacheService, CacheWarmingService, CacheInterceptor],
})
export class CacheModule {}
