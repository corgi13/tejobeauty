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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.B2BController = void 0;
const common_1 = require("@nestjs/common");
const pricing_service_1 = require("../services/pricing.service");
const quote_service_1 = require("../services/quote.service");
const tier_service_1 = require("../services/tier.service");
let B2BController = class B2BController {
    constructor(pricingService, quoteService, tierService) {
        this.pricingService = pricingService;
        this.quoteService = quoteService;
        this.tierService = tierService;
    }
    async calculateBulkPrice(body) {
        const price = await this.pricingService.calculateBulkPrice(body.productId, body.quantity, body.customerId);
        return { price };
    }
    async generateQuote(body) {
        const quote = await this.pricingService.generateCustomQuote(body.items, body.customerId);
        return quote;
    }
    async validateMinimumOrder(body) {
        const isValid = await this.pricingService.validateMinimumOrder({ total: body.total }, body.customerId);
        return { isValid };
    }
    async createQuote(createQuoteDto) {
        return this.quoteService.createQuote(createQuoteDto.userId, createQuoteDto.items);
    }
    async getQuote(id) {
        return this.quoteService.getQuote(id);
    }
    async getUserQuotes(userId) {
        return this.quoteService.getUserQuotes(userId);
    }
    async updateQuoteStatus(id, body) {
        return this.quoteService.updateQuoteStatus(id, body.status);
    }
    async deleteQuote(id) {
        return this.quoteService.deleteQuote(id);
    }
    async convertQuoteToOrder(id) {
        return this.quoteService.convertQuoteToOrder(id);
    }
    async createTier(createTierDto) {
        return this.tierService.createTier(createTierDto);
    }
    async getAllTiers() {
        return this.tierService.getAllTiers();
    }
    async getTier(id) {
        return this.tierService.getTierById(id);
    }
    async updateTier(id, updateTierDto) {
        return this.tierService.updateTier(id, updateTierDto);
    }
    async deleteTier(id) {
        return this.tierService.deleteTier(id);
    }
    async assignUserToTier(userId, tierId) {
        return this.tierService.assignUserToTier(userId, tierId);
    }
    async removeUserFromTier(userId) {
        return this.tierService.removeUserFromTier(userId);
    }
    async getUserTier(userId) {
        return this.tierService.getUserTier(userId);
    }
    async calculateUserDiscount(userId, body) {
        const discount = await this.tierService.calculateUserDiscount(userId, body.orderTotal);
        return { discount };
    }
    async getQualifyingTier(body) {
        return this.tierService.getQualifyingTier(body.orderTotal);
    }
    async suggestTierUpgrade(userId, body) {
        return this.tierService.suggestTierUpgrade(userId, body.currentOrderTotal);
    }
};
exports.B2BController = B2BController;
__decorate([
    (0, common_1.Post)('pricing/bulk-price'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], B2BController.prototype, "calculateBulkPrice", null);
__decorate([
    (0, common_1.Post)('pricing/quote'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], B2BController.prototype, "generateQuote", null);
__decorate([
    (0, common_1.Post)('pricing/validate-minimum'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], B2BController.prototype, "validateMinimumOrder", null);
__decorate([
    (0, common_1.Post)('quotes'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], B2BController.prototype, "createQuote", null);
__decorate([
    (0, common_1.Get)('quotes/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], B2BController.prototype, "getQuote", null);
__decorate([
    (0, common_1.Get)('users/:userId/quotes'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], B2BController.prototype, "getUserQuotes", null);
__decorate([
    (0, common_1.Put)('quotes/:id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], B2BController.prototype, "updateQuoteStatus", null);
__decorate([
    (0, common_1.Delete)('quotes/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], B2BController.prototype, "deleteQuote", null);
__decorate([
    (0, common_1.Post)('quotes/:id/convert-to-order'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], B2BController.prototype, "convertQuoteToOrder", null);
__decorate([
    (0, common_1.Post)('tiers'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], B2BController.prototype, "createTier", null);
__decorate([
    (0, common_1.Get)('tiers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], B2BController.prototype, "getAllTiers", null);
__decorate([
    (0, common_1.Get)('tiers/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], B2BController.prototype, "getTier", null);
__decorate([
    (0, common_1.Put)('tiers/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], B2BController.prototype, "updateTier", null);
__decorate([
    (0, common_1.Delete)('tiers/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], B2BController.prototype, "deleteTier", null);
__decorate([
    (0, common_1.Post)('users/:userId/tier/:tierId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('tierId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], B2BController.prototype, "assignUserToTier", null);
__decorate([
    (0, common_1.Delete)('users/:userId/tier'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], B2BController.prototype, "removeUserFromTier", null);
__decorate([
    (0, common_1.Get)('users/:userId/tier'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], B2BController.prototype, "getUserTier", null);
__decorate([
    (0, common_1.Post)('users/:userId/discount'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], B2BController.prototype, "calculateUserDiscount", null);
__decorate([
    (0, common_1.Post)('tiers/qualify'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], B2BController.prototype, "getQualifyingTier", null);
__decorate([
    (0, common_1.Post)('users/:userId/tier-upgrade-suggestion'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], B2BController.prototype, "suggestTierUpgrade", null);
exports.B2BController = B2BController = __decorate([
    (0, common_1.Controller)('b2b'),
    __metadata("design:paramtypes", [pricing_service_1.PricingService,
        quote_service_1.QuoteService,
        tier_service_1.TierService])
], B2BController);
//# sourceMappingURL=b2b.controller.js.map