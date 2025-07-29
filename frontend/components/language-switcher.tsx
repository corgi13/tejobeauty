"use client";

import { useState } from "react";
import { useI18n, Locale, locales } from "@/lib/i18n/i18n-provider";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const changeLanguage = (newLocale: Locale) => {
    setLocale(newLocale);
    setIsOpen(false);
  };

  const getLanguageName = (localeCode: Locale) => {
    switch (localeCode) {
      case "en":
        return t("common.english");
      case "hr":
        return t("common.croatian");
      case "de":
        return t("common.german");
      case "it":
        return t("common.italian");
      case "fr":
        return t("common.french");
      case "es":
        return t("common.spanish");
      case "pt":
        return t("common.portuguese");
      case "nl":
        return t("common.dutch");
      default:
        return localeCode;
    }
  };

  return (
    <div className="relative">
      <button
        className="flex items-center space-x-1 text-sm text-gray-700 hover:text-gray-900"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe className="h-4 w-4" />
        <span>{getLanguageName(locale)}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {locales.map((localeOption) => (
              <button
                key={localeOption}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  locale === localeOption
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => changeLanguage(localeOption)}
                role="menuitem"
              >
                {getLanguageName(localeOption)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
