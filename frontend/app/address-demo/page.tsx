"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/i18n-provider";
import AddressForm from "@/components/address/address-form";
import AddressDisplay from "@/components/address/address-display";
import LanguageSwitcher from "@/components/language-switcher";
import { AddressData } from "@/lib/address/address-validation";

const SAMPLE_ADDRESSES: AddressData[] = [
  {
    street: "Ilica 123",
    city: "Zagreb",
    state: "Grad Zagreb",
    postalCode: "10000",
    country: "HR",
  },
  {
    street: "Riva 12",
    city: "Split",
    state: "Splitsko-dalmatinska županija",
    postalCode: "21000",
    country: "HR",
  },
  {
    street: "Korzo 5",
    city: "Rijeka",
    state: "Primorsko-goranska županija",
    postalCode: "51000",
    country: "HR",
  },
  {
    street: "123 Main Street",
    city: "New York",
    state: "NY",
    postalCode: "10001",
    country: "US",
  },
];

export default function AddressDemoPage() {
  const { t, locale } = useI18n();
  const [selectedAddress, setSelectedAddress] = useState<AddressData | null>(
    null,
  );
  const [showForm, setShowForm] = useState(false);
  const [addresses, setAddresses] = useState<AddressData[]>(SAMPLE_ADDRESSES);

  const handleAddressSubmit = (address: AddressData) => {
    if (selectedAddress) {
      // Update existing address
      setAddresses((prev) =>
        prev.map((addr) => (addr === selectedAddress ? address : addr)),
      );
    } else {
      // Add new address
      setAddresses((prev) => [...prev, address]);
    }

    setShowForm(false);
    setSelectedAddress(null);
  };

  const handleEditAddress = (address: AddressData) => {
    setSelectedAddress(address);
    setShowForm(true);
  };

  const handleDeleteAddress = (address: AddressData) => {
    setAddresses((prev) => prev.filter((addr) => addr !== address));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            {locale === "hr" ? "Demo adresa" : "Address Demo"}
          </h1>
          <LanguageSwitcher />
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {locale === "hr" ? "Formatiranje adresa" : "Address Formatting"}
          </h2>
          <p className="mb-4">
            {locale === "hr"
              ? "Ova stranica demonstrira formatiranje adresa za različite zemlje, s posebnim naglaskom na hrvatske adrese."
              : "This page demonstrates address formatting for different countries, with special focus on Croatian addresses."}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3">
                {locale === "hr" ? "Hrvatska adresa" : "Croatian Address"}
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <AddressDisplay
                  address={SAMPLE_ADDRESSES[0]}
                  showLabel={true}
                  label={
                    locale === "hr" ? "Adresa za dostavu" : "Shipping Address"
                  }
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {locale === "hr"
                  ? "Format: Ulica, Poštanski broj Grad, Županija"
                  : "Format: Street, Postal Code City, County"}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">
                {locale === "hr" ? "Američka adresa" : "US Address"}
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <AddressDisplay
                  address={SAMPLE_ADDRESSES[3]}
                  showLabel={true}
                  label={
                    locale === "hr" ? "Adresa za dostavu" : "Shipping Address"
                  }
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {locale === "hr"
                  ? "Format: Ulica, Grad, Država Poštanski broj"
                  : "Format: Street, City, State Postal Code"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {locale === "hr" ? "Upravljanje adresama" : "Address Management"}
            </h2>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {locale === "hr" ? "Dodaj adresu" : "Add Address"}
            </button>
          </div>

          {showForm && (
            <div className="mb-6 p-4 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-medium mb-4">
                {selectedAddress
                  ? locale === "hr"
                    ? "Uredi adresu"
                    : "Edit Address"
                  : locale === "hr"
                    ? "Dodaj novu adresu"
                    : "Add New Address"}
              </h3>
              <AddressForm
                initialData={selectedAddress || {}}
                onSubmit={handleAddressSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setSelectedAddress(null);
                }}
                submitLabel={
                  selectedAddress
                    ? locale === "hr"
                      ? "Ažuriraj"
                      : "Update"
                    : locale === "hr"
                      ? "Dodaj"
                      : "Add"
                }
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((address, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <AddressDisplay address={address} />
                <div className="mt-3 flex space-x-2">
                  <button
                    onClick={() => handleEditAddress(address)}
                    className="text-sm text-primary-600 hover:text-primary-800"
                  >
                    {t("common.edit")}
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(address)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    {t("common.delete")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            {locale === "hr" ? "Validacija adresa" : "Address Validation"}
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">
                {locale === "hr" ? "Hrvatske adrese" : "Croatian Addresses"}
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>
                  •{" "}
                  {locale === "hr"
                    ? "Poštanski broj mora biti 5 znamenki (10000-99999)"
                    : "Postal code must be 5 digits (10000-99999)"}
                </li>
                <li>
                  •{" "}
                  {locale === "hr"
                    ? "Automatska provjera podudaranja grada i poštanskog broja"
                    : "Automatic city and postal code matching"}
                </li>
                <li>
                  •{" "}
                  {locale === "hr"
                    ? "Predloženi poštanski brojevi na temelju naziva grada"
                    : "Suggested postal codes based on city name"}
                </li>
                <li>
                  •{" "}
                  {locale === "hr"
                    ? "Popis hrvatskih županija"
                    : "List of Croatian counties"}
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">
                {locale === "hr" ? "Američke adrese" : "US Addresses"}
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>
                  •{" "}
                  {locale === "hr"
                    ? "Poštanski broj može biti 5 ili 9 znamenki"
                    : "Postal code can be 5 or 9 digits"}
                </li>
                <li>
                  •{" "}
                  {locale === "hr"
                    ? "Obavezno polje za državu"
                    : "State field is required"}
                </li>
                <li>
                  •{" "}
                  {locale === "hr"
                    ? "Automatsko formatiranje ZIP kodova"
                    : "Automatic ZIP code formatting"}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
