"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressValidationService = void 0;
const common_1 = require("@nestjs/common");
let AddressValidationService = class AddressValidationService {
    constructor() {
        this.croatianCities = {
            "10000": "Zagreb",
            "20000": "Dubrovnik",
            "21000": "Split",
            "23000": "Zadar",
            "31000": "Osijek",
            "40000": "Čakovec",
            "42000": "Varaždin",
            "44000": "Sisak",
            "47000": "Karlovac",
            "48000": "Koprivnica",
            "49000": "Krapina",
            "51000": "Rijeka",
            "52000": "Pula",
            "53000": "Voćin",
        };
        this.croatianCounties = [
            "Zagrebačka županija",
            "Krapinsko-zagorska županija",
            "Sisačko-moslavačka županija",
            "Karlovačka županija",
            "Varaždinska županija",
            "Koprivničko-križevačka županija",
            "Bjelovarsko-bilogorska županija",
            "Primorsko-goranska županija",
            "Ličko-senjska županija",
            "Virovitičko-podravska županija",
            "Požeško-slavonska županija",
            "Brodsko-posavska županija",
            "Zadarska županija",
            "Osječko-baranjska županija",
            "Šibensko-kninska županija",
            "Vukovarsko-srijemska županija",
            "Splitsko-dalmatinska županija",
            "Istarska županija",
            "Dubrovačko-neretvanska županija",
            "Međimurska županija",
            "Grad Zagreb",
        ];
    }
    validateCroatianPostalCode(postalCode) {
        const cleanCode = postalCode.replace(/\s/g, "");
        const croatianPostalCodeRegex = /^[1-9]\d{4}$/;
        return croatianPostalCodeRegex.test(cleanCode);
    }
    validateUSPostalCode(postalCode) {
        const cleanCode = postalCode.replace(/\s|-/g, "");
        const usPostalCodeRegex = /^\d{5}(\d{4})?$/;
        return usPostalCodeRegex.test(cleanCode);
    }
    validateGermanPostalCode(postalCode) {
        const cleanCode = postalCode.replace(/\s/g, "");
        const germanPostalCodeRegex = /^[0-9]{5}$/;
        return germanPostalCodeRegex.test(cleanCode);
    }
    validateItalianPostalCode(postalCode) {
        const cleanCode = postalCode.replace(/\s/g, "");
        const italianPostalCodeRegex = /^[0-9]{5}$/;
        return italianPostalCodeRegex.test(cleanCode);
    }
    validateCroatianAddress(address) {
        const errors = [];
        const suggestions = {};
        if (!address.street || address.street.trim().length < 3) {
            errors.push("Street address must be at least 3 characters long");
        }
        if (!address.city || address.city.trim().length < 2) {
            errors.push("City must be at least 2 characters long");
        }
        if (!this.validateCroatianPostalCode(address.postalCode)) {
            errors.push("Invalid Croatian postal code. Must be 5 digits (10000-99999)");
        }
        const expectedCity = this.croatianCities[address.postalCode];
        if (expectedCity &&
            address.city.toLowerCase() !== expectedCity.toLowerCase()) {
            errors.push(`Postal code ${address.postalCode} does not match city ${address.city}. Expected: ${expectedCity}`);
            suggestions.city = [expectedCity];
        }
        if (address.city && !expectedCity) {
            const postalCodeSuggestions = this.getCroatianPostalCodeSuggestions(address.city);
            if (postalCodeSuggestions.length > 0) {
                suggestions.postalCode = postalCodeSuggestions;
            }
        }
        return {
            isValid: errors.length === 0,
            errors,
            suggestions: Object.keys(suggestions).length > 0 ? suggestions : undefined,
        };
    }
    validateUSAddress(address) {
        const errors = [];
        if (!address.street || address.street.trim().length < 5) {
            errors.push("Street address must be at least 5 characters long");
        }
        if (!address.city || address.city.trim().length < 2) {
            errors.push("City must be at least 2 characters long");
        }
        if (!address.state || address.state.trim().length < 2) {
            errors.push("State is required");
        }
        if (!this.validateUSPostalCode(address.postalCode)) {
            errors.push("Invalid US postal code. Must be 5 or 9 digits");
        }
        return {
            isValid: errors.length === 0,
            errors,
        };
    }
    validateGermanAddress(address) {
        const errors = [];
        if (!address.street || address.street.trim().length < 3) {
            errors.push("Street address must be at least 3 characters long");
        }
        if (!address.city || address.city.trim().length < 2) {
            errors.push("City must be at least 2 characters long");
        }
        if (!this.validateGermanPostalCode(address.postalCode)) {
            errors.push("Invalid German postal code. Must be 5 digits");
        }
        return {
            isValid: errors.length === 0,
            errors,
        };
    }
    validateItalianAddress(address) {
        const errors = [];
        if (!address.street || address.street.trim().length < 3) {
            errors.push("Street address must be at least 3 characters long");
        }
        if (!address.city || address.city.trim().length < 2) {
            errors.push("City must be at least 2 characters long");
        }
        if (!this.validateItalianPostalCode(address.postalCode)) {
            errors.push("Invalid Italian postal code. Must be 5 digits");
        }
        return {
            isValid: errors.length === 0,
            errors,
        };
    }
    getCroatianPostalCodeSuggestions(cityName) {
        const suggestions = [];
        const lowerCityName = cityName.toLowerCase();
        for (const [postalCode, city] of Object.entries(this.croatianCities)) {
            if (city.toLowerCase().includes(lowerCityName)) {
                suggestions.push(postalCode);
            }
        }
        return suggestions;
    }
    validateAddress(address) {
        switch (address.country.toUpperCase()) {
            case "HR":
            case "CROATIA":
                return this.validateCroatianAddress(address);
            case "US":
            case "USA":
            case "UNITED STATES":
                return this.validateUSAddress(address);
            case "DE":
            case "GERMANY":
            case "DEUTSCHLAND":
                return this.validateGermanAddress(address);
            case "IT":
            case "ITALY":
            case "ITALIA":
                return this.validateItalianAddress(address);
            default:
                const errors = [];
                if (!address.street || address.street.trim().length < 3) {
                    errors.push("Street address is required");
                }
                if (!address.city || address.city.trim().length < 2) {
                    errors.push("City is required");
                }
                if (!address.postalCode || address.postalCode.trim().length < 3) {
                    errors.push("Postal code is required");
                }
                return {
                    isValid: errors.length === 0,
                    errors,
                };
        }
    }
    formatAddress(address) {
        switch (address.country.toUpperCase()) {
            case "HR":
            case "CROATIA":
                return `${address.street}\n${address.postalCode} ${address.city}\n${address.country}`;
            case "US":
            case "USA":
            case "UNITED STATES":
                return `${address.street}\n${address.city}, ${address.state} ${address.postalCode}\n${address.country}`;
            case "DE":
            case "GERMANY":
            case "DEUTSCHLAND":
                return `${address.street}\n${address.postalCode} ${address.city}\n${address.country}`;
            case "IT":
            case "ITALY":
            case "ITALIA":
                return `${address.street}\n${address.postalCode} ${address.city}${address.state ? " (" + address.state + ")" : ""}\n${address.country}`;
            default:
                return `${address.street}\n${address.city}${address.state ? ", " + address.state : ""} ${address.postalCode}\n${address.country}`;
        }
    }
    getCroatianCities() {
        return this.croatianCities;
    }
    getCroatianCounties() {
        return this.croatianCounties;
    }
};
exports.AddressValidationService = AddressValidationService;
exports.AddressValidationService = AddressValidationService = __decorate([
    (0, common_1.Injectable)()
], AddressValidationService);
//# sourceMappingURL=address-validation.service.js.map