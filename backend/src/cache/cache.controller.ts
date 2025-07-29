import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  Query,
} from "@nestjs/common";

import { CacheWarmingService } from "./cache-warming.service";
import { CacheService } from "./cache.service";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";

@Controller("api/cache")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
export class CacheController {
  constructor(
    private readonly cacheService: CacheService,
    private readonly cacheWarmingService: CacheWarmingService,
  ) {}

  @Get("stats")
  async getCacheStats() {
    // This would require additional Redis commands to get stats
    // For now, return a simple response
    return {
      message: "Cache is operational",
      timestamp: new Date().toISOString(),
    };
  }

  @Delete("clear")
  async clearCache() {
    await this.cacheService.reset();
    return {
      message: "Cache cleared successfully",
      timestamp: new Date().toISOString(),
    };
  }

  @Delete("key/:key")
  async deleteKey(@Param("key") key: string) {
    await this.cacheService.del(key);
    return {
      message: `Cache key '${key}' deleted successfully`,
      timestamp: new Date().toISOString(),
    };
  }

  @Get("key/:key")
  async getKey(@Param("key") key: string) {
    const value = await this.cacheService.get(key);
    return {
      key,
      value,
      exists: value !== null,
      timestamp: new Date().toISOString(),
    };
  }

  @Post("invalidate/products")
  async invalidateProductCache() {
    // Invalidate common product cache keys
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

  @Post("invalidate/categories")
  async invalidateCategoryCache() {
    // Invalidate common category cache keys
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

  @Post("warm-up")
  async warmUpCache(
    @Query("type") type?: "products" | "categories" | "settings" | "all",
  ) {
    const cacheType = type || "all";

    try {
      await this.cacheWarmingService.refreshCache(cacheType);

      return {
        message: `Cache warm-up completed for: ${cacheType}`,
        type: cacheType,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        message: `Cache warm-up failed for: ${cacheType}`,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
