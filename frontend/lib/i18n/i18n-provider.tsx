"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { getCookie, setCookie } from "cookies-next";
import {
  formatDate,
  formatNumber,
  formatCurrency,
  formatPercentage,
  formatPhoneNumber,
  formatAddress,
  getDateFormat,
  getTimeFormat,
  getDateTimeFormat,
} from "./formatters";

// Define the available locales
export const locales = ["en", "hr", "de", "it", "fr", "es", "pt", "nl"] as const;
export type Locale = (typeof locales)[number];

// Define the context type
type I18nContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string>) => string;
  formatDate: (
    date: Date | string | number,
    options?: Intl.DateTimeFormatOptions,
  ) => string;
  formatNumber: (number: number, options?: Intl.NumberFormatOptions) => string;
  formatCurrency: (amount: number, currency?: string) => string;
  formatPercentage: (value: number, decimals?: number) => string;
  formatPhoneNumber: (phoneNumber: string) => string;
  formatAddress: (address: {
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  }) => string;
  getDateFormat: () => string;
  getTimeFormat: () => string;
  getDateTimeFormat: () => string;
};

// Create the context
const I18nContext = createContext<I18nContextType | null>(null);

// Create a hook to use the i18n context
export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
};

// Define the provider props
type I18nProviderProps = {
  children: ReactNode;
};

// Create the provider component
export function I18nProvider({ children }: I18nProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [locale, setLocaleState] = useState<Locale>("en");
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  // Load translations for the current locale
  useEffect(() => {
    const storedLocale = getCookie("NEXT_LOCALE") as Locale;
    const initialLocale =
      storedLocale && locales.includes(storedLocale) ? storedLocale : "en";

    setLocaleState(initialLocale);

    // Define the translation files to load
    const translationFiles = ["common", "products", "orders", "errors"];

    // Load all translation files
    Promise.all(
      translationFiles.map((file) =>
        fetch(`/locales/${initialLocale}/${file}.json`)
          .then((res) => res.json())
          .catch((err) => {
            console.error(`Failed to load ${file} translations:`, err);
            return {};
          }),
      ),
    )
      .then((results) => {
        // Merge all translation files into a single object
        const mergedTranslations = results.reduce((acc, curr) => {
          return { ...acc, ...curr };
        }, {});

        setTranslations(mergedTranslations);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load translations:", err);
        setLoading(false);
      });
  }, []);

  // Function to change the locale
  const setLocale = (newLocale: Locale) => {
    if (newLocale === locale) return;

    // Set cookie for the new locale
    setCookie("NEXT_LOCALE", newLocale, { maxAge: 60 * 60 * 24 * 365 }); // 1 year

    // Define the translation files to load
    const translationFiles = ["common", "products", "orders", "errors"];

    // Load all translation files for the new locale
    Promise.all(
      translationFiles.map((file) =>
        fetch(`/locales/${newLocale}/${file}.json`)
          .then((res) => res.json())
          .catch((err) => {
            console.error(`Failed to load ${file} translations:`, err);
            return {};
          }),
      ),
    )
      .then((results) => {
        // Merge all translation files into a single object
        const mergedTranslations = results.reduce((acc, curr) => {
          return { ...acc, ...curr };
        }, {});

        setTranslations(mergedTranslations);
        setLocaleState(newLocale);

        // Refresh the page to apply the new locale
        window.location.reload();
      })
      .catch((err) => {
        console.error("Failed to load translations:", err);
      });
  };

  // Translation function
  const t = (key: string, params?: Record<string, string>): string => {
    if (loading) return key;

    // Split the key by dots to access nested properties
    const keys = key.split(".");
    let value = translations;

    // Navigate through the nested properties
    for (const k of keys) {
      if (!value[k]) return key;
      value = value[k];
    }

    // If the value is not a string, return the key
    if (typeof value !== "string") return key;

    // Replace parameters if provided
    if (params) {
      return Object.entries(params).reduce(
        (acc: string, [paramKey, paramValue]) => {
          return acc.replace(
            new RegExp(`{{${paramKey}}}`, "g"),
            String(paramValue),
          );
        },
        value,
      );
    }

    return value;
  };

  // If still loading, render a loading state or the children
  if (loading) {
    return <>{children}</>;
  }

  // Create formatter functions bound to the current locale
  const formatDateWithLocale = (
    date: Date | string | number,
    options?: Intl.DateTimeFormatOptions,
  ) => formatDate(date, locale, options);

  const formatNumberWithLocale = (
    number: number,
    options?: Intl.NumberFormatOptions,
  ) => formatNumber(number, locale, options);

  const formatCurrencyWithLocale = (amount: number, currency?: string) =>
    formatCurrency(amount, locale, currency);

  const formatPercentageWithLocale = (value: number, decimals?: number) =>
    formatPercentage(value, locale, decimals);

  const formatPhoneNumberWithLocale = (phoneNumber: string) =>
    formatPhoneNumber(phoneNumber, locale);

  const formatAddressWithLocale = (address: {
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  }) => formatAddress(address, locale);

  const getDateFormatWithLocale = () => getDateFormat(locale);
  const getTimeFormatWithLocale = () => getTimeFormat(locale);
  const getDateTimeFormatWithLocale = () => getDateTimeFormat(locale);

  return (
    <I18nContext.Provider
      value={{
        locale,
        setLocale,
        t,
        formatDate: formatDateWithLocale,
        formatNumber: formatNumberWithLocale,
        formatCurrency: formatCurrencyWithLocale,
        formatPercentage: formatPercentageWithLocale,
        formatPhoneNumber: formatPhoneNumberWithLocale,
        formatAddress: formatAddressWithLocale,
        getDateFormat: getDateFormatWithLocale,
        getTimeFormat: getTimeFormatWithLocale,
        getDateTimeFormat: getDateTimeFormatWithLocale,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}
