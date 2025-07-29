export declare const CACHEABLE_KEY = "cacheable";
export interface CacheableOptions {
    keyPrefix?: string;
    ttl?: number;
    keyGenerator?: (...args: any[]) => string;
    condition?: (result: any) => boolean;
    tags?: string[];
}
export declare const Cacheable: (options?: CacheableOptions) => import("@nestjs/common").CustomDecorator<string>;
