"use client";

import { useI18n } from "@/lib/i18n/i18n-provider";
import LocalizationDemo from "@/components/localization-demo";
import LanguageSwitcher from "@/components/language-switcher";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function LocalizationPage() {
  const { t } = useI18n();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            {t("common.language")} {t("common.settings")}
          </h1>
          <LanguageSwitcher />
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {t("common.language")} {t("common.settings")}
          </h2>
          <p className="mb-4">
            {t("common.language") === "en"
              ? "This page demonstrates the localization features of the application. You can switch between English and Croatian using the language switcher above."
              : "Ova stranica demonstrira značajke lokalizacije aplikacije. Možete prebacivati između engleskog i hrvatskog jezika pomoću izbornika jezika iznad."}
          </p>
          <p>
            {t("common.language") === "en"
              ? "The application supports localized text, date formats, number formats, currency formats, and more."
              : "Aplikacija podržava lokalizirani tekst, formate datuma, formate brojeva, formate valuta i više."}
          </p>
        </div>

        <LocalizationDemo />
      </div>
    </div>
  );
}
