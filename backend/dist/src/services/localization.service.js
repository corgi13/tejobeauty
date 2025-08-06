"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalizationService = void 0;
const common_1 = require("@nestjs/common");
const cache_service_1 = require("../cache/cache.service");
const nestjs_i18n_1 = require("nestjs-i18n");
let LocalizationService = class LocalizationService {
    constructor(i18nService, cacheService) {
        this.i18nService = i18nService;
        this.cacheService = cacheService;
    }
    async translateContent(key, language, context) {
        return this.i18nService.translate(key, { lang: language, args: context });
    }
    async formatAddress(address, country) {
        return `${address.address1}, ${address.city}, ${address.postalCode}, ${country}`;
    }
    async formatPhoneNumber(number, country) {
        return `+${number}`;
    }
    async validatePostalCode(code, country) {
        return true;
    }
    async getLocalizedProductData(productId, locale) {
        return { name: 'Localized Product Name', description: 'Localized Product Description' };
    }
};
exports.LocalizationService = LocalizationService;
exports.LocalizationService = LocalizationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof nestjs_i18n_1.I18nService !== "undefined" && nestjs_i18n_1.I18nService) === "function" ? _a : Object, cache_service_1.CacheService])
], LocalizationService);
//# sourceMappingURL=localization.service.js.map