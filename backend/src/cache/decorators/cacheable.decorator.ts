import { SetMetadata } from "@nestjs/common";

export const CACHEABLE_KEY = "cacheable";

export interface CacheableOptions {
  /**
   * Cache key prefix
   */
  keyPrefix?: string;

  /**
   * Time to live in seconds
   */
  ttl?: number;

  /**
   * Function to generate cache key from method arguments
   */
  keyGenerator?: (...args: any[]) => string;

  /**
   * Condition to determine if result should be cached
   */
  condition?: (result: any) => boolean;

  /**
   * Tags for cache invalidation
   */
  tags?: string[];
}

/**
 * Decorator to mark a method as cacheable
 * @param options Caching options
 */
export const Cacheable = (options: CacheableOptions = {}) =>
  SetMetadata(CACHEABLE_KEY, options);
