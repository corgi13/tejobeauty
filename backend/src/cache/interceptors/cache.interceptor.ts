import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";

import { CacheService } from "../cache.service";
import {
  CACHE_EVICT_KEY,
  CacheEvictOptions,
} from "../decorators/cache-evict.decorator";
import {
  CACHEABLE_KEY,
  CacheableOptions,
} from "../decorators/cacheable.decorator";

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(
    private readonly cacheService: CacheService,
    private readonly reflector: Reflector,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const cacheableOptions = this.reflector.get<CacheableOptions>(
      CACHEABLE_KEY,
      context.getHandler(),
    );

    const cacheEvictOptions = this.reflector.get<CacheEvictOptions>(
      CACHE_EVICT_KEY,
      context.getHandler(),
    );

    // Handle cache eviction before method execution
    if (cacheEvictOptions?.beforeInvocation) {
      await this.handleCacheEviction(cacheEvictOptions, context);
    }

    // Handle caching
    if (cacheableOptions) {
      return this.handleCaching(cacheableOptions, context, next);
    }

    // Execute method and handle cache eviction after
    return next.handle().pipe(
      tap(async () => {
        if (cacheEvictOptions && !cacheEvictOptions.beforeInvocation) {
          await this.handleCacheEviction(cacheEvictOptions, context);
        }
      }),
    );
  }

  private async handleCaching(
    options: CacheableOptions,
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const args = context.getArgs();
    const cacheKey = this.generateCacheKey(options, args);

    // Try to get from cache
    const cachedResult = await this.cacheService.get(cacheKey);
    if (cachedResult !== null) {
      return of(cachedResult);
    }

    // Execute method and cache result
    return next.handle().pipe(
      tap(async (result) => {
        // Check condition if provided
        if (options.condition && !options.condition(result)) {
          return;
        }

        await this.cacheService.set(cacheKey, result, options.ttl);
      }),
    );
  }

  private async handleCacheEviction(
    options: CacheEvictOptions,
    context: ExecutionContext,
  ): Promise<void> {
    try {
      if (options.allEntries) {
        await this.cacheService.reset();
        return;
      }

      const args = context.getArgs();
      const keysToEvict: string[] = [];

      // Add explicit keys
      if (options.keys) {
        keysToEvict.push(...options.keys);
      }

      // Generate keys from function
      if (options.keyGenerator) {
        const generatedKeys = options.keyGenerator(...args);
        keysToEvict.push(...generatedKeys);
      }

      // Evict keys
      if (keysToEvict.length > 0) {
        await this.cacheService.deleteMultiple(keysToEvict);
      }

      // Handle key prefixes (would need Redis pattern deletion)
      if (options.keyPrefixes) {
        // For now, we'll just log this as it requires Redis-specific commands
        console.log(
          "Key prefix eviction not implemented yet:",
          options.keyPrefixes,
        );
      }

      // Handle tags (would need a tag-based caching system)
      if (options.tags) {
        console.log("Tag-based eviction not implemented yet:", options.tags);
      }
    } catch (error) {
      console.error("Error in cache eviction:", error);
    }
  }

  private generateCacheKey(options: CacheableOptions, args: any[]): string {
    if (options.keyGenerator) {
      return options.keyGenerator(...args);
    }

    const prefix = options.keyPrefix || "default";
    const argsKey = args.length > 0 ? JSON.stringify(args) : "no-args";

    return this.cacheService.generateKey(prefix, argsKey);
  }
}
