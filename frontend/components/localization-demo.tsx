"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/i18n-provider";

export default function LocalizationDemo() {
  const {
    t,
    locale,
    formatDate,
    formatNumber,
    formatCurrency,
    formatPercentage,
    formatPhoneNumber,
    formatAddress,
    getDateFormat,
    getTimeFormat,
    getDateTimeFormat,
  } = useI18n();

  const now = new Date();
  const sampleNumber = 1234567.89;
  const samplePercentage = 75.5;
  const samplePrice = 99.99;
  const samplePhoneUS = "12025550179";
  const samplePhoneHR = "385915557890";

  const sampleAddressUS = {
    street: "123 Main St",
    city: "New York",
    state: "NY",
    postalCode: "10001",
    country: "United States",
  };

  const sampleAddressHR = {
    street: "Ilica 123",
    city: "Zagreb",
    postalCode: "10000",
    country: "Croatia",
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto my-8">
      <h2 className="text-2xl font-bold mb-6">
        {t("common.language")}:{" "}
        {locale === "en" ? t("common.english") : t("common.croatian")}
      </h2>

      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-semibold mb-2">Date & Time Formatting</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500">Date Format:</p>
              <p className="font-medium">{getDateFormat()}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500">Time Format:</p>
              <p className="font-medium">{getTimeFormat()}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500">Date & Time Format:</p>
              <p className="font-medium">{getDateTimeFormat()}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500">Current Date:</p>
              <p className="font-medium">{formatDate(now)}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500">Short Date:</p>
              <p className="font-medium">
                {formatDate(now, {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500">Time Only:</p>
              <p className="font-medium">
                {formatDate(now, { hour: "numeric", minute: "numeric" })}
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">Number Formatting</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500">Number:</p>
              <p className="font-medium">{formatNumber(sampleNumber)}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500">Currency:</p>
              <p className="font-medium">{formatCurrency(samplePrice)}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500">Percentage:</p>
              <p className="font-medium">
                {formatPercentage(samplePercentage)}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500">Compact Number:</p>
              <p className="font-medium">
                {formatNumber(1_000_000, { notation: "compact" })}
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">
            Phone Number Formatting
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500">US Phone:</p>
              <p className="font-medium">{formatPhoneNumber(samplePhoneUS)}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500">Croatian Phone:</p>
              <p className="font-medium">{formatPhoneNumber(samplePhoneHR)}</p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">Address Formatting</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500">US Address:</p>
              <p className="font-medium whitespace-pre-line">
                {formatAddress(sampleAddressUS)}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500">Croatian Address:</p>
              <p className="font-medium whitespace-pre-line">
                {formatAddress(sampleAddressHR)}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
