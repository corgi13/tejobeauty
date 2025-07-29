import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { CacheService } from "./cache.service";
import { PrismaService } from "../prisma.service";

@Injectable()
export class CacheWarmingService implements OnModuleInit {
  constructor(
    private readonly cacheService: CacheService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    // Only warm cache in production or when explicitly enabled
    const shouldWarmCache = this.configService.get<boolean>(
      "CACHE_WARM_ON_START",
      false,
    );

    if (shouldWarmCache) {
      await this.warmCache();
    }
  }

  /**
   * Warm up the cache with commonly accessed data
   */
  async warmCache(): Promise<void> {
    console.log("Starting cache warm-up...");

    try {
      await Promise.all([
        this.warmProductCache(),
        this.warmCategoryCache(),
        this.warmSettingsCache(),
      ]);

      console.log("Cache warm-up completed successfully");
    } catch (error) {
      console.error("Error during cache warm-up:", error);
    }
  }

  /**
   * Warm up product-related cache
   */
  private async warmProductCache(): Promise<void> {
    try {
      // Cache popular products
      const popularProducts = await this.prisma.product.findMany({
        take: 20,
        where: { isActive: true },
        include: {
          images: {
            orderBy: { sortOrder: "asc" },
          },
          category: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      // Cache the product list
      const cacheKey = this.cacheService.generateKey(
        "products",
        "list",
        0,
        20,
        "all",
        "true",
      );
      await this.cacheService.set(cacheKey, popularProducts, 300);

      // Cache individual products
      for (const product of popularProducts) {
        const productCacheKey = this.cacheService.generateKey(
          "product",
          product.id,
        );
        await this.cacheService.set(productCacheKey, product, 300);

        const slugCacheKey = this.cacheService.generateKey(
          "product",
          "slug",
          product.slug,
        );
        await this.cacheService.set(slugCacheKey, product, 300);
      }

      console.log(`Warmed cache for ${popularProducts.length} products`);
    } catch (error) {
      console.error("Error warming product cache:", error);
    }
  }

  /**
   * Warm up category-related cache
   */
  private async warmCategoryCache(): Promise<void> {
    try {
      // Cache all categories
      const categories = await this.prisma.category.findMany({
        where: { isActive: true },
        include: {
          children: true,
          parent: true,
        },
        orderBy: { sortOrder: "asc" },
      });

      const cacheKey = this.cacheService.generateKey(
        "categories",
        "list",
        "all",
      );
      await this.cacheService.set(cacheKey, categories, 600); // Cache for 10 minutes

      // Cache category tree
      const categoryTree = this.buildCategoryTree(categories);
      const treeCacheKey = this.cacheService.generateKey("categories", "tree");
      await this.cacheService.set(treeCacheKey, categoryTree, 600);

      console.log(`Warmed cache for ${categories.length} categories`);
    } catch (error) {
      console.error("Error warming category cache:", error);
    }
  }

  /**
   * Warm up settings cache
   */
  private async warmSettingsCache(): Promise<void> {
    try {
      // Cache common settings (this would depend on your settings implementation)
      const commonSettings = {
        siteName: "Tejo Nails",
        defaultCurrency: "EUR",
        defaultLanguage: "en",
        // Add other commonly accessed settings
      };

      const cacheKey = this.cacheService.generateKey("settings", "common");
      await this.cacheService.set(cacheKey, commonSettings, 1800); // Cache for 30 minutes

      console.log("Warmed cache for common settings");
    } catch (error) {
      console.error("Error warming settings cache:", error);
    }
  }

  /**
   * Build category tree structure
   */
  private buildCategoryTree(categories: any[]): any[] {
    const categoryMap = new Map();
    const rootCategories: any[] = [];

    // Create a map of categories
    categories.forEach((category) => {
      categoryMap.set(category.id, { ...category, children: [] });
    });

    // Build the tree
    categories.forEach((category) => {
      if (category.parentId) {
        const parent = categoryMap.get(category.parentId);
        if (parent) {
          parent.children.push(categoryMap.get(category.id));
        }
      } else {
        rootCategories.push(categoryMap.get(category.id));
      }
    });

    return rootCategories;
  }

  /**
   * Clear all cache
   */
  async clearAllCache(): Promise<void> {
    await this.cacheService.reset();
    console.log("All cache cleared");
  }

  /**
   * Refresh specific cache entries
   */
  async refreshCache(
    type: "products" | "categories" | "settings" | "all",
  ): Promise<void> {
    switch (type) {
      case "products":
        await this.warmProductCache();
        break;
      case "categories":
        await this.warmCategoryCache();
        break;
      case "settings":
        await this.warmSettingsCache();
        break;
      case "all":
        await this.warmCache();
        break;
    }
  }
}
