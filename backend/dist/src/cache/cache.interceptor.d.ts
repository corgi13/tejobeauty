import { NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { CacheService } from "./cache.service";
export declare const CACHE_KEY_METADATA = "cache_key";
export declare const CACHE_TTL_METADATA = "cache_ttl";
export declare const CACHE_TAGS_METADATA = "cache_tags";
export declare class CacheInterceptor implements NestInterceptor {
    private readonly cacheService;
    private readonly reflector;
    constructor(cacheService: CacheService, reflector: Reflector);
    intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>>;
    private generateDynamicKey;
}
