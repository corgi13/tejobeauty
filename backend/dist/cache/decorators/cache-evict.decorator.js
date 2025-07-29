"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheEvict = exports.CACHE_EVICT_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.CACHE_EVICT_KEY = "cache_evict";
const CacheEvict = (options = {}) => (0, common_1.SetMetadata)(exports.CACHE_EVICT_KEY, options);
exports.CacheEvict = CacheEvict;
//# sourceMappingURL=cache-evict.decorator.js.map