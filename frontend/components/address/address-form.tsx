"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n/i18n-provider";
import {
  validateAddress,
  formatCroatianPostalCode,
  formatUSPostalCode,
  getCroatianPostalCodeSuggestions,
  getCroatianCitySuggestions,
  CROATIAN_COUNTIES,
  AddressData,
  ValidationResult,
} from "@/lib/address/address-validation";

interface AddressFormProps {
  initialData?: Partial<AddressData>;
  onSubmit: (address: AddressData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  submitLabel?: string;
  showCountrySelector?: boolean;
}

const COUNTRIES = [
  { code: "HR", name: "Croatia", nameHr: "Hrvatska" },
  { code: "US", name: "United States", nameHr: "Sjedinjene Američke Države" },
  { code: "DE", name: "Germany", nameHr: "Njemačka" },
  { code: "IT", name: "Italy", nameHr: "Italija" },
  { code: "AT", name: "Austria", nameHr: "Austrija" },
  { code: "SI", name: "Slovenia", nameHr: "Slovenija" },
  { code: "HU", name: "Hungary", nameHr: "Mađarska" },
  { code: "RS", name: "Serbia", nameHr: "Srbija" },
  { code: "BA", name: "Bosnia and Herzegovina", nameHr: "Bosna i Hercegovina" },
];

const US_STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];

export default function AddressForm({
  initialData = {},
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel,
  showCountrySelector = true,
}: AddressFormProps) {
  const { t, locale } = useI18n();

  const [formData, setFormData] = useState<AddressData>({
    street: initialData.street || "",
    city: initialData.city || "",
    state: initialData.state || "",
    postalCode: initialData.postalCode || "",
    country: initialData.country || (locale === "hr" ? "HR" : "US"),
  });

  const [validation, setValidation] = useState<ValidationResult>({
    isValid: true,
    errors: [],
  });
  const [postalCodeSuggestions, setPostalCodeSuggestions] = useState<string[]>(
    [],
  );
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);

  // Validate form data whenever it changes
  useEffect(() => {
    const result = validateAddress(formData);
    setValidation(result);
  }, [formData]);

  // Handle postal code suggestions for Croatian addresses
  useEffect(() => {
    if (formData.country === "HR" && formData.city.length >= 2) {
      const suggestions = getCroatianPostalCodeSuggestions(formData.city);
      setPostalCodeSuggestions(suggestions);
    } else {
      setPostalCodeSuggestions([]);
    }
  }, [formData.city, formData.country]);

  // Handle city suggestions for Croatian addresses
  useEffect(() => {
    if (formData.country === "HR" && formData.postalCode.length === 5) {
      const suggestions = getCroatianCitySuggestions(formData.postalCode);
      setCitySuggestions(suggestions);
    } else {
      setCitySuggestions([]);
    }
  }, [formData.postalCode, formData.country]);

  const handleInputChange = (field: keyof AddressData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePostalCodeChange = (value: string) => {
    let formattedValue = value;

    if (formData.country === "HR") {
      formattedValue = formatCroatianPostalCode(value);
    } else if (formData.country === "US") {
      formattedValue = formatUSPostalCode(value);
    }

    handleInputChange("postalCode", formattedValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validation.isValid) {
      onSubmit(formData);
    }
  };

  const getCountryName = (countryCode: string): string => {
    const country = COUNTRIES.find((c) => c.code === countryCode);
    if (!country) return countryCode;

    return locale === "hr" ? country.nameHr : country.name;
  };

  const isFieldRequired = (field: string): boolean => {
    if (field === "state") {
      return formData.country === "US";
    }
    return true;
  };

  const getFieldLabel = (field: string): string => {
    const labels = {
      street: t("checkout.address"),
      city: t("checkout.city"),
      state:
        formData.country === "HR"
          ? locale === "hr"
            ? "Županija"
            : "County"
          : t("checkout.state"),
      postalCode: t("checkout.postalCode"),
      country: t("checkout.country"),
    };

    return labels[field as keyof typeof labels] || field;
  };

  const getFieldPlaceholder = (field: string): string => {
    if (formData.country === "HR") {
      const placeholders = {
        street: locale === "hr" ? "Ulica i broj" : "Street and number",
        city: locale === "hr" ? "Grad" : "City",
        state: locale === "hr" ? "Odaberite županiju" : "Select county",
        postalCode: "10000",
        country: locale === "hr" ? "Država" : "Country",
      };
      return placeholders[field as keyof typeof placeholders] || "";
    } else {
      const placeholders = {
        street: "123 Main Street",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        country: "Country",
      };
      return placeholders[field as keyof typeof placeholders] || "";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Country Selector */}
      {showCountrySelector && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {getFieldLabel("country")} *
          </label>
          <select
            value={formData.country}
            onChange={(e) => handleInputChange("country", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          >
            {COUNTRIES.map((country) => (
              <option key={country.code} value={country.code}>
                {getCountryName(country.code)}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Street Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {getFieldLabel("street")} *
        </label>
        <input
          type="text"
          value={formData.street}
          onChange={(e) => handleInputChange("street", e.target.value)}
          placeholder={getFieldPlaceholder("street")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          required
        />
      </div>

      {/* City and Postal Code */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {getFieldLabel("city")} *
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
            placeholder={getFieldPlaceholder("city")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
          {citySuggestions.length > 0 && (
            <div className="mt-1">
              <p className="text-xs text-gray-500">
                {locale === "hr" ? "Predloženo:" : "Suggested:"}{" "}
                {citySuggestions.join(", ")}
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {getFieldLabel("postalCode")} *
          </label>
          <input
            type="text"
            value={formData.postalCode}
            onChange={(e) => handlePostalCodeChange(e.target.value)}
            placeholder={getFieldPlaceholder("postalCode")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
          {postalCodeSuggestions.length > 0 && (
            <div className="mt-1">
              <p className="text-xs text-gray-500">
                {locale === "hr"
                  ? "Predloženi poštanski brojevi:"
                  : "Suggested postal codes:"}{" "}
                {postalCodeSuggestions.join(", ")}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* State/County (conditional) */}
      {(formData.country === "US" || formData.country === "HR") && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {getFieldLabel("state")} {isFieldRequired("state") ? "*" : ""}
          </label>
          {formData.country === "US" ? (
            <select
              value={formData.state}
              onChange={(e) => handleInputChange("state", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required={isFieldRequired("state")}
            >
              <option value="">
                {locale === "hr" ? "Odaberite državu" : "Select state"}
              </option>
              {US_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          ) : (
            <select
              value={formData.state}
              onChange={(e) => handleInputChange("state", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">
                {locale === "hr" ? "Odaberite županiju" : "Select county"}
              </option>
              {CROATIAN_COUNTIES.map((county) => (
                <option key={county} value={county}>
                  {county}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* Validation Errors */}
      {!validation.isValid && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <h4 className="text-sm font-medium text-red-800 mb-2">
            {t("errors.validation.invalidFormat")}
          </h4>
          <ul className="text-sm text-red-700 space-y-1">
            {validation.errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {t("common.cancel")}
          </button>
        )}
        <button
          type="submit"
          disabled={!validation.isValid || isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? t("common.loading") : submitLabel || t("common.save")}
        </button>
      </div>
    </form>
  );
}
