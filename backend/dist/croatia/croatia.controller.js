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
exports.CroatiaController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const croatia_tax_service_1 = require("./croatia-tax.service");
const croatia_business_service_1 = require("./croatia-business.service");
const croatia_shipping_service_1 = require("./croatia-shipping.service");
let CroatiaController = class CroatiaController {
    constructor(taxService, businessService, shippingService) {
        this.taxService = taxService;
        this.businessService = businessService;
        this.shippingService = shippingService;
    }
    getTaxRates() {
        return {
            success: true,
            data: this.taxService.getTaxRates(),
            description: 'Croatian PDV (VAT) rates for different product categories'
        };
    }
    calculateTax(body) {
        const calculation = this.taxService.calculatePDV(body.subtotal, body.category || 'cosmetic');
        return {
            success: true,
            data: calculation,
            formatted: this.taxService.formatPDVForInvoice(calculation)
        };
    }
    calculateMultiItemTax(body) {
        const calculation = this.taxService.calculateMultiItemPDV(body.items);
        return {
            success: true,
            data: calculation,
            formatted: this.taxService.formatPDVForInvoice(calculation)
        };
    }
    validateOIB(oib) {
        const validation = this.businessService.validateOIB(oib);
        return {
            success: true,
            data: validation
        };
    }
    getCroatianCounties() {
        return {
            success: true,
            data: this.businessService.getCroatianCounties()
        };
    }
    getCitiesByCounty(code) {
        return {
            success: true,
            data: this.businessService.getCitiesByCounty(code)
        };
    }
    getBeautyActivityCodes() {
        return {
            success: true,
            data: this.businessService.getBeautyIndustryActivityCodes()
        };
    }
    validateBusinessRegistration(businessData) {
        const validation = this.businessService.validateBusinessRegistration(businessData);
        return {
            success: true,
            data: validation
        };
    }
    getRegistrationRequirements(type) {
        return {
            success: true,
            data: this.businessService.getRegistrationRequirements(type)
        };
    }
    getBeautyLicenseRequirements() {
        return {
            success: true,
            data: this.businessService.getBeautyLicenseRequirements()
        };
    }
    getShippingZones() {
        return {
            success: true,
            data: this.shippingService.getAllShippingZones()
        };
    }
    calculateShipping(city, orderValue, method = 'standard') {
        const calculation = this.shippingService.calculateShipping(city, parseFloat(orderValue), method);
        if (!calculation) {
            return {
                success: false,
                error: 'Shipping zone not found for the specified city'
            };
        }
        return {
            success: true,
            data: calculation
        };
    }
    getShippingOptions(city, orderValue) {
        const options = this.shippingService.getShippingOptions(city, parseFloat(orderValue));
        return {
            success: true,
            data: options,
            sameDayAvailable: this.shippingService.isSameDayDeliveryAvailable(city),
            freeShippingThreshold: this.shippingService.getFreeShippingThreshold(city)
        };
    }
    getCroatianHolidays() {
        return {
            success: true,
            data: this.shippingService.getCroatianHolidays()
        };
    }
    checkHoliday(date) {
        const holiday = this.shippingService.isHoliday(date);
        return {
            success: true,
            data: {
                isHoliday: !!holiday,
                holiday: holiday || null
            }
        };
    }
    checkTaxBenefits(businessType, annualRevenue) {
        const benefits = this.taxService.checkTaxBenefits(businessType, parseFloat(annualRevenue));
        return {
            success: true,
            data: benefits
        };
    }
};
exports.CroatiaController = CroatiaController;
__decorate([
    (0, common_1.Get)('tax/rates'),
    (0, swagger_1.ApiOperation)({ summary: 'Get Croatian tax rates (PDV)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Croatian tax rates' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CroatiaController.prototype, "getTaxRates", null);
__decorate([
    (0, common_1.Post)('tax/calculate'),
    (0, swagger_1.ApiOperation)({ summary: 'Calculate Croatian PDV for order' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tax calculation result' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CroatiaController.prototype, "calculateTax", null);
__decorate([
    (0, common_1.Post)('tax/calculate-multi'),
    (0, swagger_1.ApiOperation)({ summary: 'Calculate Croatian PDV for multiple items' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Multi-item tax calculation' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CroatiaController.prototype, "calculateMultiItemTax", null);
__decorate([
    (0, common_1.Get)('business/oib/validate/:oib'),
    (0, swagger_1.ApiOperation)({ summary: 'Validate Croatian OIB' }),
    (0, swagger_1.ApiParam)({ name: 'oib', description: 'Croatian OIB to validate' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'OIB validation result' }),
    __param(0, (0, common_1.Param)('oib')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CroatiaController.prototype, "validateOIB", null);
__decorate([
    (0, common_1.Get)('business/counties'),
    (0, swagger_1.ApiOperation)({ summary: 'Get Croatian counties and cities' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of Croatian counties' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CroatiaController.prototype, "getCroatianCounties", null);
__decorate([
    (0, common_1.Get)('business/counties/:code/cities'),
    (0, swagger_1.ApiOperation)({ summary: 'Get cities by county code' }),
    (0, swagger_1.ApiParam)({ name: 'code', description: 'County code (e.g., ZG, ST, RI)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of cities in county' }),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CroatiaController.prototype, "getCitiesByCounty", null);
__decorate([
    (0, common_1.Get)('business/activity-codes'),
    (0, swagger_1.ApiOperation)({ summary: 'Get beauty industry activity codes' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Beauty industry activity codes' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CroatiaController.prototype, "getBeautyActivityCodes", null);
__decorate([
    (0, common_1.Post)('business/validate-registration'),
    (0, swagger_1.ApiOperation)({ summary: 'Validate Croatian business registration data' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Business registration validation' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CroatiaController.prototype, "validateBusinessRegistration", null);
__decorate([
    (0, common_1.Get)('business/registration-requirements/:type'),
    (0, swagger_1.ApiOperation)({ summary: 'Get business registration requirements by type' }),
    (0, swagger_1.ApiParam)({ name: 'type', description: 'Business type (obrt, doo, jdoo, ad)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Registration requirements' }),
    __param(0, (0, common_1.Param)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CroatiaController.prototype, "getRegistrationRequirements", null);
__decorate([
    (0, common_1.Get)('business/beauty-license-requirements'),
    (0, swagger_1.ApiOperation)({ summary: 'Get beauty industry licensing requirements' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Beauty license requirements' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CroatiaController.prototype, "getBeautyLicenseRequirements", null);
__decorate([
    (0, common_1.Get)('shipping/zones'),
    (0, swagger_1.ApiOperation)({ summary: 'Get Croatian shipping zones' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of shipping zones' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CroatiaController.prototype, "getShippingZones", null);
__decorate([
    (0, common_1.Get)('shipping/calculate'),
    (0, swagger_1.ApiOperation)({ summary: 'Calculate shipping cost for Croatian city' }),
    (0, swagger_1.ApiQuery)({ name: 'city', description: 'Croatian city name' }),
    (0, swagger_1.ApiQuery)({ name: 'orderValue', description: 'Order value in EUR' }),
    (0, swagger_1.ApiQuery)({ name: 'method', description: 'Shipping method', enum: ['standard', 'express'], required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Shipping calculation' }),
    __param(0, (0, common_1.Query)('city')),
    __param(1, (0, common_1.Query)('orderValue')),
    __param(2, (0, common_1.Query)('method')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], CroatiaController.prototype, "calculateShipping", null);
__decorate([
    (0, common_1.Get)('shipping/options'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all shipping options for Croatian city' }),
    (0, swagger_1.ApiQuery)({ name: 'city', description: 'Croatian city name' }),
    (0, swagger_1.ApiQuery)({ name: 'orderValue', description: 'Order value in EUR' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'All shipping options' }),
    __param(0, (0, common_1.Query)('city')),
    __param(1, (0, common_1.Query)('orderValue')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CroatiaController.prototype, "getShippingOptions", null);
__decorate([
    (0, common_1.Get)('holidays'),
    (0, swagger_1.ApiOperation)({ summary: 'Get Croatian holidays for 2025' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of Croatian holidays' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CroatiaController.prototype, "getCroatianHolidays", null);
__decorate([
    (0, common_1.Get)('holidays/check/:date'),
    (0, swagger_1.ApiOperation)({ summary: 'Check if date is Croatian holiday' }),
    (0, swagger_1.ApiParam)({ name: 'date', description: 'Date in YYYY-MM-DD format' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Holiday check result' }),
    __param(0, (0, common_1.Param)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CroatiaController.prototype, "checkHoliday", null);
__decorate([
    (0, common_1.Get)('tax/benefits'),
    (0, swagger_1.ApiOperation)({ summary: 'Check Croatian tax benefits for business' }),
    (0, swagger_1.ApiQuery)({ name: 'businessType', description: 'Business type' }),
    (0, swagger_1.ApiQuery)({ name: 'annualRevenue', description: 'Annual revenue in EUR' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tax benefits information' }),
    __param(0, (0, common_1.Query)('businessType')),
    __param(1, (0, common_1.Query)('annualRevenue')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CroatiaController.prototype, "checkTaxBenefits", null);
exports.CroatiaController = CroatiaController = __decorate([
    (0, swagger_1.ApiTags)('Croatia'),
    (0, common_1.Controller)('croatia'),
    __metadata("design:paramtypes", [croatia_tax_service_1.CroatiaTaxService,
        croatia_business_service_1.CroatiaBusinessService,
        croatia_shipping_service_1.CroatiaShippingService])
], CroatiaController);
//# sourceMappingURL=croatia.controller.js.map