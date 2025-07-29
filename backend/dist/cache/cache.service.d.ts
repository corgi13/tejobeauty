import { Cache } from "cache-manager";
export declare class CacheService {
    private cacheManager;
    constructor(cacheManager: Cache);
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T, ttl?: number): Promise<void>;
    del(key: string): Promise<void>;
    reset(): Promise<void>;
    getOrSet<T>(key: string, factory: () => Promise<T>, ttl?: number): Promise<T>;
    increment(key: string, increment?: number, ttl?: number): Promise<number>;
    exists(key: string): Promise<boolean>;
    setMultiple<T>(keyValuePairs: Record<string, T>, ttl?: number): Promise<void>;
    getMultiple<T>(keys: string[]): Promise<Record<string, T | null>>;
    deleteMultiple(keys: string[]): Promise<void>;
    generateKey(prefix: string, ...parts: (string | number)[]): string;
}
