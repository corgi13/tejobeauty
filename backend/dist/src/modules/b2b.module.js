"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.B2BModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const pricing_service_1 = require("../services/pricing.service");
const quote_service_1 = require("../services/quote.service");
const sanitization_service_1 = require("../utils/sanitization.service");
const cache_service_1 = require("../cache/cache.service");
let B2BModule = class B2BModule {
};
exports.B2BModule = B2BModule;
exports.B2BModule = B2BModule = __decorate([
    (0, common_1.Module)({
        providers: [
            prisma_service_1.PrismaService,
            pricing_service_1.PricingService,
            quote_service_1.QuoteService,
            sanitization_service_1.SanitizationService,
            cache_service_1.CacheService,
        ],
        exports: [pricing_service_1.PricingService, quote_service_1.QuoteService],
    })
], B2BModule);
//# sourceMappingURL=b2b.module.js.map