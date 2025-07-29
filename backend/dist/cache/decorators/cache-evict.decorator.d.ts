export declare const CACHE_EVICT_KEY = "cache_evict";
export interface CacheEvictOptions {
    keys?: string[];
    keyPrefixes?: string[];
    keyGenerator?: (...args: any[]) => string[];
    tags?: string[];
    allEntries?: boolean;
    beforeInvocation?: boolean;
}
export declare const CacheEvict: (options?: CacheEvictOptions) => import("@nestjs/common").CustomDecorator<string>;
