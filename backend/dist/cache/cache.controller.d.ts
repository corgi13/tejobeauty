import { CacheWarmingService } from "./cache-warming.service";
import { CacheService } from "./cache.service";
export declare class CacheController {
    private readonly cacheService;
    private readonly cacheWarmingService;
    constructor(cacheService: CacheService, cacheWarmingService: CacheWarmingService);
    getCacheStats(): Promise<{
        message: string;
        timestamp: string;
    }>;
    clearCache(): Promise<{
        message: string;
        timestamp: string;
    }>;
    deleteKey(key: string): Promise<{
        message: string;
        timestamp: string;
    }>;
    getKey(key: string): Promise<{
        key: string;
        value: unknown;
        exists: boolean;
        timestamp: string;
    }>;
    invalidateProductCache(): Promise<{
        message: string;
        keysInvalidated: number;
        timestamp: string;
    }>;
    invalidateCategoryCache(): Promise<{
        message: string;
        keysInvalidated: number;
        timestamp: string;
    }>;
    warmUpCache(type?: "products" | "categories" | "settings" | "all"): Promise<{
        message: string;
        type: "products" | "all" | "categories" | "settings";
        timestamp: string;
        error?: undefined;
    } | {
        message: string;
        error: any;
        timestamp: string;
        type?: undefined;
    }>;
}
