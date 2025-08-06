export declare class CacheService {
    private cache;
    getOrSet<T>(key: string, factory: () => Promise<T>, ttlSeconds?: number): Promise<T>;
    delete(key: string): void;
    clear(): void;
}
