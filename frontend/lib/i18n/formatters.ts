import { Locale } from "./i18n-provider";

/**
 * Format a date according to the locale
 * @param date The date to format
 * @param locale The locale to use
 * @param options Additional options for the formatter
 * @returns The formatted date string
 */
export function formatDate(
  date: Date | string | number,
  locale: Locale,
  options?: Intl.DateTimeFormatOptions,
): string {
  const dateObj =
    typeof date === "string" || typeof date === "number"
      ? new Date(date)
      : date;

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const localeMap = {
    en: "en-US",
    hr: "hr-HR",
    de: "de-DE",
    it: "it-IT",
    fr: "fr-FR",
    es: "es-ES",
    pt: "pt-PT",
    nl: "nl-NL"
  };

  return new Intl.DateTimeFormat(
    localeMap[locale] || "en-US",
    options || defaultOptions,
  ).format(dateObj);
}

/**
 * Format a number according to the locale
 * @param number The number to format
 * @param locale The locale to use
 * @param options Additional options for the formatter
 * @returns The formatted number string
 */
export function formatNumber(
  number: number,
  locale: Locale,
  options?: Intl.NumberFormatOptions,
): string {
  const localeMap = {
    en: "en-US",
    hr: "hr-HR",
    de: "de-DE",
    it: "it-IT",
    fr: "fr-FR",
    es: "es-ES",
    pt: "pt-PT",
    nl: "nl-NL"
  };

  return new Intl.NumberFormat(
    localeMap[locale] || "en-US",
    options,
  ).format(number);
}

/**
 * Format a currency amount according to the locale
 * @param amount The amount to format
 * @param locale The locale to use
 * @param currency The currency code (default: EUR for Croatian, USD for English)
 * @returns The formatted currency string
 */
export function formatCurrency(
  amount: number,
  locale: Locale,
  currency?: string,
): string {
  const localeMap = {
    en: "en-US",
    hr: "hr-HR",
    de: "de-DE",
    it: "it-IT",
    fr: "fr-FR",
    es: "es-ES",
    pt: "pt-PT",
    nl: "nl-NL"
  };

  const currencyMap = {
    en: "USD",
    hr: "EUR",
    de: "EUR",
    it: "EUR",
    fr: "EUR",
    es: "EUR",
    pt: "EUR",
    nl: "EUR"
  };

  const currencyCode = currency || currencyMap[locale] || "EUR";

  return new Intl.NumberFormat(localeMap[locale] || "en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(amount);
}

/**
 * Format a percentage according to the locale
 * @param value The value to format as a percentage
 * @param locale The locale to use
 * @param decimals The number of decimal places
 * @returns The formatted percentage string
 */
export function formatPercentage(
  value: number,
  locale: Locale,
  decimals: number = 2,
): string {
  const localeMap = {
    en: "en-US",
    hr: "hr-HR",
    de: "de-DE",
    it: "it-IT",
    fr: "fr-FR",
    es: "es-ES",
    pt: "pt-PT",
    nl: "nl-NL"
  };

  return new Intl.NumberFormat(localeMap[locale] || "en-US", {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}

/**
 * Format a phone number according to the locale
 * @param phoneNumber The phone number to format
 * @param locale The locale to use
 * @returns The formatted phone number
 */
export function formatPhoneNumber(phoneNumber: string, locale: Locale): string {
  // Remove all non-digit characters
  const digits = phoneNumber.replace(/\D/g, "");

  switch (locale) {
    case "hr":
      // Croatian phone number format: +385 XX XXX XXXX
      if (digits.startsWith("385")) {
        return digits.replace(/^(\d{3})(\d{2})(\d{3})(\d{3,4})$/, "+$1 $2 $3 $4");
      } else if (digits.startsWith("0")) {
        // Convert 0XX to +385 XX
        return digits.replace(/^0(\d{2})(\d{3})(\d{3,4})$/, "+385 $1 $2 $3");
      } else {
        return "+" + digits;
      }

    case "de":
      // German phone number format: +49 XXX XXXXXXX
      if (digits.startsWith("49")) {
        return digits.replace(/^(\d{2})(\d{3,4})(\d{6,7})$/, "+$1 $2 $3");
      } else if (digits.startsWith("0")) {
        // Convert 0XXX to +49 XXX
        return digits.replace(/^0(\d{3,4})(\d{6,7})$/, "+49 $1 $2");
      } else {
        return "+" + digits;
      }

    case "it":
      // Italian phone number format: +39 XXX XXX XXXX
      if (digits.startsWith("39")) {
        return digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})$/, "+$1 $2 $3 $4");
      } else if (digits.startsWith("0")) {
        // Convert 0XXX to +39 XXX
        return digits.replace(/^0(\d{3})(\d{3})(\d{4})$/, "+39 $1 $2 $3");
      } else {
        return "+" + digits;
      }

    case "fr":
      // French phone number format: +33 X XX XX XX XX
      if (digits.startsWith("33")) {
        return digits.replace(/^(\d{2})(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})$/, "+$1 $2 $3 $4 $5 $6");
      } else if (digits.startsWith("0")) {
        // Convert 0X to +33 X
        return digits.replace(/^0(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})$/, "+33 $1 $2 $3 $4 $5");
      } else {
        return "+" + digits;
      }

    case "es":
      // Spanish phone number format: +34 XXX XXX XXX
      if (digits.startsWith("34")) {
        return digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{3})$/, "+$1 $2 $3 $4");
      } else if (digits.startsWith("0")) {
        // Convert 0XXX to +34 XXX
        return digits.replace(/^0(\d{3})(\d{3})(\d{3})$/, "+34 $1 $2 $3");
      } else {
        return "+" + digits;
      }

    case "pt":
      // Portuguese phone number format: +351 XXX XXX XXX
      if (digits.startsWith("351")) {
        return digits.replace(/^(\d{3})(\d{3})(\d{3})(\d{3})$/, "+$1 $2 $3 $4");
      } else if (digits.startsWith("0")) {
        // Convert 0XXX to +351 XXX
        return digits.replace(/^0(\d{3})(\d{3})(\d{3})$/, "+351 $1 $2 $3");
      } else {
        return "+" + digits;
      }

    case "nl":
      // Dutch phone number format: +31 XX XXX XXXX
      if (digits.startsWith("31")) {
        return digits.replace(/^(\d{2})(\d{2})(\d{3})(\d{4})$/, "+$1 $2 $3 $4");
      } else if (digits.startsWith("0")) {
        // Convert 0XX to +31 XX
        return digits.replace(/^0(\d{2})(\d{3})(\d{4})$/, "+31 $1 $2 $3");
      } else {
        return "+" + digits;
      }

    default:
      // US phone number format: (XXX) XXX-XXXX
      if (digits.length === 10) {
        return digits.replace(/^(\d{3})(\d{3})(\d{4})$/, "($1) $2-$3");
      } else if (digits.startsWith("1") && digits.length === 11) {
        return digits.replace(/^1(\d{3})(\d{3})(\d{4})$/, "+1 ($1) $2-$3");
      } else {
        return "+" + digits;
      }
  }
}

/**
 * Format an address according to the locale
 * @param address The address object
 * @param locale The locale to use
 * @returns The formatted address string
 */
export function formatAddress(
  address: {
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  },
  locale: Locale,
): string {
  switch (locale) {
    case "hr":
      // Croatian address format
      return `${address.street}
${address.postalCode} ${address.city}
${address.country}`;

    case "de":
      // German address format
      return `${address.street}
${address.postalCode} ${address.city}
${address.country}`;

    case "it":
      // Italian address format
      return `${address.street}
${address.postalCode} ${address.city}${address.state ? " (" + address.state + ")" : ""}
${address.country}`;

    case "fr":
      // French address format
      return `${address.street}
${address.postalCode} ${address.city}
${address.country}`;

    case "es":
      // Spanish address format
      return `${address.street}
${address.postalCode} ${address.city}${address.state ? ", " + address.state : ""}
${address.country}`;

    case "pt":
      // Portuguese address format
      return `${address.street}
${address.postalCode} ${address.city}
${address.country}`;

    case "nl":
      // Dutch address format
      return `${address.street}
${address.postalCode} ${address.city}
${address.country}`;

    default:
      // US/International address format
      return `${address.street}
${address.city}${address.state ? ", " + address.state : ""} ${address.postalCode}
${address.country}`;
  }
}

/**
 * Get the appropriate date format for a specific locale
 * @param locale The locale
 * @returns The date format pattern
 */
export function getDateFormat(locale: Locale): string {
  const formatMap = {
    en: "MM/DD/YYYY",
    hr: "DD.MM.YYYY.",
    de: "DD.MM.YYYY",
    it: "DD/MM/YYYY",
    fr: "DD/MM/YYYY",
    es: "DD/MM/YYYY",
    pt: "DD/MM/YYYY",
    nl: "DD-MM-YYYY"
  };
  return formatMap[locale] || "MM/DD/YYYY";
}

/**
 * Get the appropriate time format for a specific locale
 * @param locale The locale
 * @returns The time format pattern
 */
export function getTimeFormat(locale: Locale): string {
  const formatMap = {
    en: "h:mm A",
    hr: "HH:mm",
    de: "HH:mm",
    it: "HH:mm",
    fr: "HH:mm",
    es: "HH:mm",
    pt: "HH:mm",
    nl: "HH:mm"
  };
  return formatMap[locale] || "h:mm A";
}

/**
 * Get the appropriate date-time format for a specific locale
 * @param locale The locale
 * @returns The date-time format pattern
 */
export function getDateTimeFormat(locale: Locale): string {
  const formatMap = {
    en: "MM/DD/YYYY h:mm A",
    hr: "DD.MM.YYYY. HH:mm",
    de: "DD.MM.YYYY HH:mm",
    it: "DD/MM/YYYY HH:mm",
    fr: "DD/MM/YYYY HH:mm",
    es: "DD/MM/YYYY HH:mm",
    pt: "DD/MM/YYYY HH:mm",
    nl: "DD-MM-YYYY HH:mm"
  };
  return formatMap[locale] || "MM/DD/YYYY h:mm A";
}
