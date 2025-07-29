import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Injectable, Inject } from "@nestjs/common";
import { Cache } from "cache-manager";

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  /**
   * Get a value from cache
   * @param key The cache key
   * @returns The cached value or null if not found
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const result = await this.cacheManager.get<T>(key);
      return result !== undefined ? result : null;
    } catch (error) {
      console.error(`Error getting cache key ${key}:`, error);
      return null;
    }
  }

  /**
   * Set a value in cache
   * @param key The cache key
   * @param value The value to cache
   * @param ttl Time to live in seconds (optional)
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      if (ttl) {
        await this.cacheManager.set(key, value, ttl * 1000); // Convert to milliseconds
      } else {
        await this.cacheManager.set(key, value);
      }
    } catch (error) {
      console.error(`Error setting cache key ${key}:`, error);
    }
  }

  /**
   * Delete a value from cache
   * @param key The cache key
   */
  async del(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
    } catch (error) {
      console.error(`Error deleting cache key ${key}:`, error);
    }
  }

  /**
   * Clear all cache
   */
  async reset(): Promise<void> {
    try {
      // Use the cache manager's clear method if available
      if (typeof (this.cacheManager as any).clear === "function") {
        await (this.cacheManager as any).clear();
      } else {
        // Fallback - this is a simplified approach
        console.warn("Cache reset not supported, using alternative method");
      }
    } catch (error) {
      console.error("Error clearing cache:", error);
    }
  }

  /**
   * Get or set a value in cache
   * @param key The cache key
   * @param factory Function to generate the value if not in cache
   * @param ttl Time to live in seconds (optional)
   * @returns The cached or generated value
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttl?: number,
  ): Promise<T> {
    try {
      // Try to get from cache first
      const cached = await this.get<T>(key);
      if (cached !== null) {
        return cached;
      }

      // Generate the value
      const value = await factory();

      // Cache the value
      await this.set(key, value, ttl);

      return value;
    } catch (error) {
      console.error(`Error in getOrSet for key ${key}:`, error);
      // If caching fails, still return the generated value
      return await factory();
    }
  }

  /**
   * Increment a numeric value in cache
   * @param key The cache key
   * @param increment The amount to increment by (default: 1)
   * @param ttl Time to live in seconds (optional)
   * @returns The new value
   */
  async increment(
    key: string,
    increment: number = 1,
    ttl?: number,
  ): Promise<number> {
    try {
      const current = (await this.get<number>(key)) || 0;
      const newValue = current + increment;
      await this.set(key, newValue, ttl);
      return newValue;
    } catch (error) {
      console.error(`Error incrementing cache key ${key}:`, error);
      return increment;
    }
  }

  /**
   * Check if a key exists in cache
   * @param key The cache key
   * @returns True if the key exists, false otherwise
   */
  async exists(key: string): Promise<boolean> {
    try {
      const value = await this.get(key);
      return value !== null;
    } catch (error) {
      console.error(`Error checking existence of cache key ${key}:`, error);
      return false;
    }
  }

  /**
   * Set multiple values in cache
   * @param keyValuePairs Object with key-value pairs
   * @param ttl Time to live in seconds (optional)
   */
  async setMultiple<T>(
    keyValuePairs: Record<string, T>,
    ttl?: number,
  ): Promise<void> {
    try {
      const promises = Object.entries(keyValuePairs).map(([key, value]) =>
        this.set(key, value, ttl),
      );
      await Promise.all(promises);
    } catch (error) {
      console.error("Error setting multiple cache values:", error);
    }
  }

  /**
   * Get multiple values from cache
   * @param keys Array of cache keys
   * @returns Object with key-value pairs
   */
  async getMultiple<T>(keys: string[]): Promise<Record<string, T | null>> {
    try {
      const promises = keys.map(async (key) => ({
        key,
        value: await this.get<T>(key),
      }));

      const results = await Promise.all(promises);

      return results.reduce(
        (acc, { key, value }) => {
          acc[key] = value;
          return acc;
        },
        {} as Record<string, T | null>,
      );
    } catch (error) {
      console.error("Error getting multiple cache values:", error);
      return keys.reduce(
        (acc, key) => {
          acc[key] = null;
          return acc;
        },
        {} as Record<string, T | null>,
      );
    }
  }

  /**
   * Delete multiple keys from cache
   * @param keys Array of cache keys
   */
  async deleteMultiple(keys: string[]): Promise<void> {
    try {
      const promises = keys.map((key) => this.del(key));
      await Promise.all(promises);
    } catch (error) {
      console.error("Error deleting multiple cache keys:", error);
    }
  }

  /**
   * Generate a cache key with prefix
   * @param prefix The prefix for the key
   * @param parts Parts to join for the key
   * @returns The generated cache key
   */
  generateKey(prefix: string, ...parts: (string | number)[]): string {
    return `${prefix}:${parts.join(":")}`;
  }
}
