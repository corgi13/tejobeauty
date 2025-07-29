"use client";

import { useI18n } from "@/lib/i18n/i18n-provider";
import {
  formatAddressForDisplay,
  AddressData,
} from "@/lib/address/address-validation";

interface AddressDisplayProps {
  address: AddressData;
  showLabel?: boolean;
  label?: string;
  className?: string;
  compact?: boolean;
}

export default function AddressDisplay({
  address,
  showLabel = false,
  label,
  className = "",
  compact = false,
}: AddressDisplayProps) {
  const { t, locale } = useI18n();

  const getCountryName = (countryCode: string): string => {
    const countries = {
      HR: locale === "hr" ? "Hrvatska" : "Croatia",
      US: locale === "hr" ? "Sjedinjene Američke Države" : "United States",
      DE: locale === "hr" ? "Njemačka" : "Germany",
      IT: locale === "hr" ? "Italija" : "Italy",
      AT: locale === "hr" ? "Austrija" : "Austria",
      SI: locale === "hr" ? "Slovenija" : "Slovenia",
      HU: locale === "hr" ? "Mađarska" : "Hungary",
      RS: locale === "hr" ? "Srbija" : "Serbia",
      BA: locale === "hr" ? "Bosna i Hercegovina" : "Bosnia and Herzegovina",
    };

    return countries[countryCode as keyof typeof countries] || countryCode;
  };

  const formatAddressLines = (): string[] => {
    const lines: string[] = [];

    // Street address
    lines.push(address.street);

    // City and postal code formatting based on country
    if (address.country === "HR") {
      // Croatian format: Postal Code City
      lines.push(`${address.postalCode} ${address.city}`);
      if (address.state) {
        lines.push(address.state);
      }
    } else if (address.country === "US") {
      // US format: City, State Postal Code
      lines.push(`${address.city}, ${address.state} ${address.postalCode}`);
    } else {
      // Generic international format
      lines.push(
        `${address.city}${address.state ? ", " + address.state : ""} ${address.postalCode}`,
      );
    }

    // Country (only show if not the user's default country)
    const defaultCountry = locale === "hr" ? "HR" : "US";
    if (address.country !== defaultCountry) {
      lines.push(getCountryName(address.country));
    }

    return lines;
  };

  const addressLines = formatAddressLines();

  if (compact) {
    return (
      <div className={className}>
        {showLabel && (
          <span className="text-sm font-medium text-gray-700 mr-2">
            {label || t("checkout.address")}:
          </span>
        )}
        <span className="text-sm text-gray-900">{addressLines.join(", ")}</span>
      </div>
    );
  }

  return (
    <div className={className}>
      {showLabel && (
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          {label || t("checkout.address")}
        </h4>
      )}
      <div className="text-sm text-gray-900">
        {addressLines.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
    </div>
  );
}
