"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cache = exports.CacheTags = exports.CacheTTL = exports.Cacheable = void 0;
const common_1 = require("@nestjs/common");
const cache_interceptor_1 = require("./cache.interceptor");
const Cacheable = (key, ttl) => {
    return (target, propertyKey, descriptor) => {
        (0, common_1.SetMetadata)(cache_interceptor_1.CACHE_KEY_METADATA, key)(target, propertyKey, descriptor);
        if (ttl) {
            (0, common_1.SetMetadata)(cache_interceptor_1.CACHE_TTL_METADATA, ttl)(target, propertyKey, descriptor);
        }
    };
};
exports.Cacheable = Cacheable;
const CacheTTL = (ttl) => (0, common_1.SetMetadata)(cache_interceptor_1.CACHE_TTL_METADATA, ttl);
exports.CacheTTL = CacheTTL;
const CacheTags = (tags) => (0, common_1.SetMetadata)(cache_interceptor_1.CACHE_TAGS_METADATA, tags);
exports.CacheTags = CacheTags;
const Cache = (options) => {
    return (target, propertyKey, descriptor) => {
        (0, common_1.SetMetadata)(cache_interceptor_1.CACHE_KEY_METADATA, options.key)(target, propertyKey, descriptor);
        if (options.ttl) {
            (0, common_1.SetMetadata)(cache_interceptor_1.CACHE_TTL_METADATA, options.ttl)(target, propertyKey, descriptor);
        }
        if (options.tags) {
            (0, common_1.SetMetadata)(cache_interceptor_1.CACHE_TAGS_METADATA, options.tags)(target, propertyKey, descriptor);
        }
    };
};
exports.Cache = Cache;
//# sourceMappingURL=cache.decorators.js.map