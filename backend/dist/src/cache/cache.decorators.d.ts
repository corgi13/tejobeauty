export declare const Cacheable: (key: string, ttl?: number) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
export declare const CacheTTL: (ttl: number) => import("@nestjs/common").CustomDecorator<string>;
export declare const CacheTags: (tags: string[]) => import("@nestjs/common").CustomDecorator<string>;
export declare const Cache: (options: {
    key: string;
    ttl?: number;
    tags?: string[];
}) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
