import { AddressValidationService, AddressData } from "./address-validation.service";
export declare class AddressValidationController {
    private readonly addressValidationService;
    constructor(addressValidationService: AddressValidationService);
    validateAddress(address: AddressData): import("./address-validation.service").ValidationResult;
    formatAddress(address: AddressData): {
        formatted: string;
    };
    getCroatianCities(): Record<string, string>;
    getCroatianCounties(): string[];
    getPostalCodeSuggestions(city: string, country?: string): {
        suggestions: string[];
    };
    getCitySuggestions(postalCode: string, country?: string): {
        suggestions: string[];
    };
}
