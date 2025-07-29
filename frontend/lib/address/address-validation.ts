/**
 * Address validation utilities for different countries
 */

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
}

/**
 * Croatian postal code validation
 * Croatian postal codes are 5 digits (10000-99999)
 */
export function validateCroatianPostalCode(postalCode: string): boolean {
  const cleanCode = postalCode.replace(/\s/g, "");
  const croatianPostalCodeRegex = /^[1-9]\d{4}$/;
  return croatianPostalCodeRegex.test(cleanCode);
}

/**
 * US postal code validation (ZIP codes)
 * Supports both 5-digit and 9-digit formats
 */
export function validateUSPostalCode(postalCode: string): boolean {
  const cleanCode = postalCode.replace(/\s|-/g, "");
  const usPostalCodeRegex = /^\d{5}(\d{4})?$/;
  return usPostalCodeRegex.test(cleanCode);
}

/**
 * Format Croatian postal code
 */
export function formatCroatianPostalCode(postalCode: string): string {
  const cleanCode = postalCode.replace(/\s/g, "");
  if (validateCroatianPostalCode(cleanCode)) {
    return cleanCode;
  }
  return postalCode;
}

/**
 * Format US postal code
 */
export function formatUSPostalCode(postalCode: string): string {
  const cleanCode = postalCode.replace(/\s|-/g, "");
  if (cleanCode.length === 9) {
    return `${cleanCode.slice(0, 5)}-${cleanCode.slice(5)}`;
  }
  return cleanCode;
}

/**
 * Croatian cities and their postal codes
 * This is a subset - in a real application, you'd have a complete database
 */
export const CROATIAN_CITIES = {
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
  "88000": "Mostar", // Bosnia and Herzegovina, but sometimes used
};

/**
 * Croatian counties (županije)
 */
export const CROATIAN_COUNTIES = [
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
 * Validate Croatian address
 */
export function validateCroatianAddress(
  address: AddressData,
): ValidationResult {
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
  if (!validateCroatianPostalCode(address.postalCode)) {
    errors.push("Invalid Croatian postal code. Must be 5 digits (10000-99999)");
  }

  // Check if postal code matches city (if we have the data)
  const expectedCity =
    CROATIAN_CITIES[address.postalCode as keyof typeof CROATIAN_CITIES];
  if (
    expectedCity &&
    address.city.toLowerCase() !== expectedCity.toLowerCase()
  ) {
    errors.push(
      `Postal code ${address.postalCode} does not match city ${address.city}. Expected: ${expectedCity}`,
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate US address
 */
export function validateUSAddress(address: AddressData): ValidationResult {
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
  if (!validateUSPostalCode(address.postalCode)) {
    errors.push("Invalid US postal code. Must be 5 or 9 digits");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Generic address validation based on country
 */
export function validateAddress(address: AddressData): ValidationResult {
  switch (address.country.toUpperCase()) {
    case "HR":
    case "CROATIA":
      return validateCroatianAddress(address);
    case "US":
    case "USA":
    case "UNITED STATES":
      return validateUSAddress(address);
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
export function formatAddressForDisplay(address: AddressData): string {
  switch (address.country.toUpperCase()) {
    case "HR":
    case "CROATIA":
      // Croatian format: Street, Postal Code City, Country
      return `${address.street}
${formatCroatianPostalCode(address.postalCode)} ${address.city}
${address.country}`;

    case "US":
    case "USA":
    case "UNITED STATES":
      // US format: Street, City, State Postal Code, Country
      return `${address.street}
${address.city}, ${address.state} ${formatUSPostalCode(address.postalCode)}
${address.country}`;

    default:
      // Generic international format
      return `${address.street}
${address.city}${address.state ? ", " + address.state : ""} ${address.postalCode}
${address.country}`;
  }
}

/**
 * Get postal code suggestions for Croatian cities
 */
export function getCroatianPostalCodeSuggestions(cityName: string): string[] {
  const suggestions: string[] = [];
  const lowerCityName = cityName.toLowerCase();

  for (const [postalCode, city] of Object.entries(CROATIAN_CITIES)) {
    if (city.toLowerCase().includes(lowerCityName)) {
      suggestions.push(postalCode);
    }
  }

  return suggestions;
}

/**
 * Get city suggestions for Croatian postal codes
 */
export function getCroatianCitySuggestions(postalCode: string): string[] {
  const city = CROATIAN_CITIES[postalCode as keyof typeof CROATIAN_CITIES];
  return city ? [city] : [];
}
