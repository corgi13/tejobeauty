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
exports.AddressValidationController = void 0;
const common_1 = require("@nestjs/common");
const address_validation_service_1 = require("./address-validation.service");
let AddressValidationController = class AddressValidationController {
    constructor(addressValidationService) {
        this.addressValidationService = addressValidationService;
    }
    validateAddress(address) {
        return this.addressValidationService.validateAddress(address);
    }
    formatAddress(address) {
        const formatted = this.addressValidationService.formatAddress(address);
        return { formatted };
    }
    getCroatianCities() {
        return this.addressValidationService.getCroatianCities();
    }
    getCroatianCounties() {
        return this.addressValidationService.getCroatianCounties();
    }
    getPostalCodeSuggestions(city, country = "HR") {
        if (country.toUpperCase() === "HR") {
            const cities = this.addressValidationService.getCroatianCities();
            const suggestions = [];
            for (const [postalCode, cityName] of Object.entries(cities)) {
                if (cityName.toLowerCase().includes(city.toLowerCase())) {
                    suggestions.push(postalCode);
                }
            }
            return { suggestions };
        }
        return { suggestions: [] };
    }
    getCitySuggestions(postalCode, country = "HR") {
        if (country.toUpperCase() === "HR") {
            const cities = this.addressValidationService.getCroatianCities();
            const city = cities[postalCode];
            return { suggestions: city ? [city] : [] };
        }
        return { suggestions: [] };
    }
};
exports.AddressValidationController = AddressValidationController;
__decorate([
    (0, common_1.Post)("validate"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AddressValidationController.prototype, "validateAddress", null);
__decorate([
    (0, common_1.Post)("format"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AddressValidationController.prototype, "formatAddress", null);
__decorate([
    (0, common_1.Get)("croatian-cities"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AddressValidationController.prototype, "getCroatianCities", null);
__decorate([
    (0, common_1.Get)("croatian-counties"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AddressValidationController.prototype, "getCroatianCounties", null);
__decorate([
    (0, common_1.Get)("postal-code-suggestions"),
    __param(0, (0, common_1.Query)("city")),
    __param(1, (0, common_1.Query)("country")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AddressValidationController.prototype, "getPostalCodeSuggestions", null);
__decorate([
    (0, common_1.Get)("city-suggestions"),
    __param(0, (0, common_1.Query)("postalCode")),
    __param(1, (0, common_1.Query)("country")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AddressValidationController.prototype, "getCitySuggestions", null);
exports.AddressValidationController = AddressValidationController = __decorate([
    (0, common_1.Controller)("api/address"),
    __metadata("design:paramtypes", [address_validation_service_1.AddressValidationService])
], AddressValidationController);
//# sourceMappingURL=address-validation.controller.js.map