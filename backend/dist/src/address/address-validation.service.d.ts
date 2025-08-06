export interface AddressData {
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
}
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    suggestions?: {
        postalCode?: string[];
        city?: string[];
    };
}
export declare class AddressValidationService {
    private readonly croatianCities;
    private readonly croatianCounties;
    private validateCroatianPostalCode;
    private validateUSPostalCode;
    private validateGermanPostalCode;
    private validateItalianPostalCode;
    private validateCroatianAddress;
    private validateUSAddress;
    private validateGermanAddress;
    private validateItalianAddress;
    private getCroatianPostalCodeSuggestions;
    validateAddress(address: AddressData): ValidationResult;
    formatAddress(address: AddressData): string;
    getCroatianCities(): Record<string, string>;
    getCroatianCounties(): string[];
}
