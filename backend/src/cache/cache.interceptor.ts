import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";

import { CacheService } from "./cache.service";

export const CACHE_KEY_METADATA = "cache_key";
export const CACHE_TTL_METADATA = "cache_ttl";
export const CACHE_TAGS_METADATA = "cache_tags";

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
    const cacheKey = this.reflector.get<string>(
      CACHE_KEY_METADATA,
      context.getHandler(),
    );

    if (!cacheKey) {
      return next.handle();
    }

    const ttl = this.reflector.get<number>(
      CACHE_TTL_METADATA,
      context.getHandler(),
    );

    const tags = this.reflector.get<string[]>(
      CACHE_TAGS_METADATA,
      context.getHandler(),
    );

    // Generate dynamic cache key based on request parameters
    const request = context.switchToHttp().getRequest();
    const dynamicKey = this.generateDynamicKey(cacheKey, request);

    // Try to get from cache
    const cachedResult = await this.cacheService.get(dynamicKey);
    if (cachedResult !== null) {
      return of(cachedResult);
    }

    // If not in cache, execute the handler and cache the result
    return next.handle().pipe(
      tap(async (result) => {
        if (tags) {
          await this.cacheService.set(dynamicKey, result, ttl);
        } else {
          await this.cacheService.set(dynamicKey, result, ttl);
        }
      }),
    );
  }

  private generateDynamicKey(baseKey: string, request: any): string {
    const { params, query, user } = request;
    const keyParts = [baseKey];

    // Add user ID if available
    if (user?.id) {
      keyParts.push(`user:${user.id}`);
    }

    // Add route parameters
    if (params && Object.keys(params).length > 0) {
      const paramString = Object.entries(params)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}:${value}`)
        .join(",");
      keyParts.push(`params:${paramString}`);
    }

    // Add query parameters (sorted for consistency)
    if (query && Object.keys(query).length > 0) {
      const queryString = Object.entries(query)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}:${value}`)
        .join(",");
      keyParts.push(`query:${queryString}`);
    }

    return keyParts.join(":");
  }
}
