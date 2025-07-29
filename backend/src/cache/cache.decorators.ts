import { SetMetadata } from "@nestjs/common";

import {
  CACHE_KEY_METADATA,
  CACHE_TTL_METADATA,
  CACHE_TAGS_METADATA,
} from "./cache.interceptor";

/**
 * Decorator to enable caching for a method
 * @param key Base cache key
 * @param ttl Time to live in seconds (optional)
 */
export const Cacheable = (key: string, ttl?: number) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    SetMetadata(CACHE_KEY_METADATA, key)(target, propertyKey, descriptor);
    if (ttl) {
      SetMetadata(CACHE_TTL_METADATA, ttl)(target, propertyKey, descriptor);
    }
  };
};

/**
 * Decorator to set cache TTL
 * @param ttl Time to live in seconds
 */
export const CacheTTL = (ttl: number) => SetMetadata(CACHE_TTL_METADATA, ttl);

/**
 * Decorator to set cache tags for easier invalidation
 * @param tags Array of tags
 */
export const CacheTags = (tags: string[]) =>
  SetMetadata(CACHE_TAGS_METADATA, tags);

/**
 * Combined decorator for cache configuration
 * @param options Cache configuration options
 */
export const Cache = (options: {
  key: string;
  ttl?: number;
  tags?: string[];
}) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    SetMetadata(CACHE_KEY_METADATA, options.key)(
      target,
      propertyKey,
      descriptor,
    );
    if (options.ttl) {
      SetMetadata(CACHE_TTL_METADATA, options.ttl)(
        target,
        propertyKey,
        descriptor,
      );
    }
    if (options.tags) {
      SetMetadata(CACHE_TAGS_METADATA, options.tags)(
        target,
        propertyKey,
        descriptor,
      );
    }
  };
};
