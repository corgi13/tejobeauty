import { SetMetadata } from "@nestjs/common";

export const CACHE_EVICT_KEY = "cache_evict";

export interface CacheEvictOptions {
  /**
   * Cache keys or patterns to evict
   */
  keys?: string[];

  /**
   * Cache key prefixes to evict
   */
  keyPrefixes?: string[];

  /**
   * Function to generate cache keys to evict from method arguments
   */
  keyGenerator?: (...args: any[]) => string[];

  /**
   * Tags to evict
   */
  tags?: string[];

  /**
   * Whether to evict all cache
   */
  allEntries?: boolean;

  /**
   * Whether to evict before or after method execution
   */
  beforeInvocation?: boolean;
}

/**
 * Decorator to mark a method as cache evicting
 * @param options Cache eviction options
 */
export const CacheEvict = (options: CacheEvictOptions = {}) =>
  SetMetadata(CACHE_EVICT_KEY, options);
