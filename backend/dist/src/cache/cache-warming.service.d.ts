import { OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CacheService } from "./cache.service";
import { PrismaService } from "../prisma.service";
export declare class CacheWarmingService implements OnModuleInit {
    private readonly cacheService;
    private readonly prisma;
    private readonly configService;
    constructor(cacheService: CacheService, prisma: PrismaService, configService: ConfigService);
    onModuleInit(): Promise<void>;
    warmCache(): Promise<void>;
    private warmProductCache;
    private warmCategoryCache;
    private warmSettingsCache;
    private buildCategoryTree;
    clearAllCache(): Promise<void>;
    refreshCache(type: "products" | "categories" | "settings" | "all"): Promise<void>;
}
