import { Injectable } from "@nestjs/common";

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

@Injectable()
export class AddressValidationService {
  private readonly croatianCities = {
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

  private readonly croatianCounties = [
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

  /**
   * Validate Croatian postal code
   */
  private validateCroatianPostalCode(postalCode: string): boolean {
    const cleanCode = postalCode.replace(/\s/g, "");
    const croatianPostalCodeRegex = /^[1-9]\d{4}$/;
    return croatianPostalCodeRegex.test(cleanCode);
  }

  /**
   * Validate US postal code
   */
  private validateUSPostalCode(postalCode: string): boolean {
    const cleanCode = postalCode.replace(/\s|-/g, "");
    const usPostalCodeRegex = /^\d{5}(\d{4})?$/;
    return usPostalCodeRegex.test(cleanCode);
  }

  /**
   * Validate German postal code
   */
  private validateGermanPostalCode(postalCode: string): boolean {
    const cleanCode = postalCode.replace(/\s/g, "");
    const germanPostalCodeRegex = /^[0-9]{5}$/;
    return germanPostalCodeRegex.test(cleanCode);
  }

  /**
   * Validate Italian postal code
   */
  private validateItalianPostalCode(postalCode: string): boolean {
    const cleanCode = postalCode.replace(/\s/g, "");
    const italianPostalCodeRegex = /^[0-9]{5}$/;
    return italianPostalCodeRegex.test(cleanCode);
  }

  /**
   * Validate Croatian address
   */
  private validateCroatianAddress(address: AddressData): ValidationResult {
    const errors: string[] = [];
    const suggestions: { postalCode?: string[]; city?: string[] } = {};

    // Validate street
    if (!address.street || address.street.trim().length < 3) {
      errors.push("Street address must be at least 3 characters long");
    }

    // Validate city
    if (!address.city || address.city.trim().length < 2) {
      errors.push("City must be at least 2 characters long");
    }

    // Validate postal code
    if (!this.validateCroatianPostalCode(address.postalCode)) {
      errors.push(
        "Invalid Croatian postal code. Must be 5 digits (10000-99999)",
      );
    }

    // Check if postal code matches city
    const expectedCity =
      this.croatianCities[
        address.postalCode as keyof typeof this.croatianCities
      ];
    if (
      expectedCity &&
      address.city.toLowerCase() !== expectedCity.toLowerCase()
    ) {
      errors.push(
        `Postal code ${address.postalCode} does not match city ${address.city}. Expected: ${expectedCity}`,
      );
      suggestions.city = [expectedCity];
    }

    // Provide postal code suggestions based on city
    if (address.city && !expectedCity) {
      const postalCodeSuggestions = this.getCroatianPostalCodeSuggestions(
        address.city,
      );
      if (postalCodeSuggestions.length > 0) {
        suggestions.postalCode = postalCodeSuggestions;
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      suggestions:
        Object.keys(suggestions).length > 0 ? suggestions : undefined,
    };
  }

  /**
   * Validate US address
   */
  private validateUSAddress(address: AddressData): ValidationResult {
    const errors: string[] = [];

    // Validate street
    if (!address.street || address.street.trim().length < 5) {
      errors.push("Street address must be at least 5 characters long");
    }

    // Validate city
    if (!address.city || address.city.trim().length < 2) {
      errors.push("City must be at least 2 characters long");
    }

    // Validate state
    if (!address.state || address.state.trim().length < 2) {
      errors.push("State is required");
    }

    // Validate postal code
    if (!this.validateUSPostalCode(address.postalCode)) {
      errors.push("Invalid US postal code. Must be 5 or 9 digits");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate German address
   */
  private validateGermanAddress(address: AddressData): ValidationResult {
    const errors: string[] = [];

    // Validate street
    if (!address.street || address.street.trim().length < 3) {
      errors.push("Street address must be at least 3 characters long");
    }

    // Validate city
    if (!address.city || address.city.trim().length < 2) {
      errors.push("City must be at least 2 characters long");
    }

    // Validate postal code
    if (!this.validateGermanPostalCode(address.postalCode)) {
      errors.push("Invalid German postal code. Must be 5 digits");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate Italian address
   */
  private validateItalianAddress(address: AddressData): ValidationResult {
    const errors: string[] = [];

    // Validate street
    if (!address.street || address.street.trim().length < 3) {
      errors.push("Street address must be at least 3 characters long");
    }

    // Validate city
    if (!address.city || address.city.trim().length < 2) {
      errors.push("City must be at least 2 characters long");
    }

    // Validate postal code
    if (!this.validateItalianPostalCode(address.postalCode)) {
      errors.push("Invalid Italian postal code. Must be 5 digits");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get postal code suggestions for Croatian cities
   */
  private getCroatianPostalCodeSuggestions(cityName: string): string[] {
    const suggestions: string[] = [];
    const lowerCityName = cityName.toLowerCase();

    for (const [postalCode, city] of Object.entries(this.croatianCities)) {
      if (city.toLowerCase().includes(lowerCityName)) {
        suggestions.push(postalCode);
      }
    }

    return suggestions;
  }

  /**
   * Validate address based on country
   */
  public validateAddress(address: AddressData): ValidationResult {
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
        // Generic validation for other countries
        const errors: string[] = [];

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

  /**
   * Format address for display based on country
   */
  public formatAddress(address: AddressData): string {
    switch (address.country.toUpperCase()) {
      case "HR":
      case "CROATIA":
        // Croatian format: Street, Postal Code City, Country
        return `${address.street}\n${address.postalCode} ${address.city}\n${address.country}`;

      case "US":
      case "USA":
      case "UNITED STATES":
        // US format: Street, City, State Postal Code, Country
        return `${address.street}\n${address.city}, ${address.state} ${address.postalCode}\n${address.country}`;

      case "DE":
      case "GERMANY":
      case "DEUTSCHLAND":
        // German format: Street, Postal Code City, Country
        return `${address.street}\n${address.postalCode} ${address.city}\n${address.country}`;

      case "IT":
      case "ITALY":
      case "ITALIA":
        // Italian format: Street, Postal Code City (Province), Country
        return `${address.street}\n${address.postalCode} ${address.city}${address.state ? " (" + address.state + ")" : ""}\n${address.country}`;

      default:
        // Generic international format
        return `${address.street}\n${address.city}${address.state ? ", " + address.state : ""} ${address.postalCode}\n${address.country}`;
    }
  }

  /**
   * Get Croatian cities
   */
  public getCroatianCities(): Record<string, string> {
    return this.croatianCities;
  }

  /**
   * Get Croatian counties
   */
  public getCroatianCounties(): string[] {
    return this.croatianCounties;
  }
}
