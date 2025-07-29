"use client";

import { useState, useEffect } from "react";
import {
  CreditCard,
  Plus,
  Trash2,
  Star,
  Shield,
  Calendar,
  User,
} from "lucide-react";

// Types
interface PaymentMethod {
  id: string;
  type: "card" | "paypal" | "bank";
  brand: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  holderName: string;
  isDefault: boolean;
  createdAt: string;
}

// Mock data - in a real app, this would come from Stripe/payment provider
const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "pm_1234567890",
    type: "card",
    brand: "visa",
    last4: "4242",
    expiryMonth: 12,
    expiryYear: 2025,
    holderName: "John Doe",
    isDefault: true,
    createdAt: "2023-01-15",
  },
  {
    id: "pm_0987654321",
    type: "card",
    brand: "mastercard",
    last4: "5555",
    expiryMonth: 8,
    expiryYear: 2026,
    holderName: "John Doe",
    isDefault: false,
    createdAt: "2023-06-20",
  },
];

const cardBrandLogos: { [key: string]: string } = {
  visa: "💳",
  mastercard: "💳",
  amex: "💳",
  discover: "💳",
  diners: "💳",
  jcb: "💳",
};

export default function PaymentMethodsPage() {
  const [paymentMethods, setPaymentMethods] =
    useState<PaymentMethod[]>(mockPaymentMethods);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvc: "",
    holderName: "",
    isDefault: false,
  });

  useEffect(() => {
    // TODO: Fetch payment methods from Stripe/API
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const formatCardNumber = (value: string) => {
    // Remove all non-digit characters
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    // Add spaces every 4 digits
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setFormData((prev) => ({ ...prev, cardNumber: formatted }));
  };

  const openModal = () => {
    setFormData({
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvc: "",
      holderName: "",
      isDefault: false,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvc: "",
      holderName: "",
      isDefault: false,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Integrate with Stripe to create payment method
      // This would involve:
      // 1. Create Stripe payment method
      // 2. Attach to customer
      // 3. Save to backend

      // Mock implementation
      const newPaymentMethod: PaymentMethod = {
        id: `pm_${Date.now()}`,
        type: "card",
        brand: "visa", // Would be determined by Stripe
        last4: formData.cardNumber.slice(-4),
        expiryMonth: parseInt(formData.expiryMonth),
        expiryYear: parseInt(formData.expiryYear),
        holderName: formData.holderName,
        isDefault: formData.isDefault,
        createdAt: new Date().toISOString(),
      };

      setPaymentMethods((prev) => {
        if (formData.isDefault) {
          return [
            ...prev.map((pm) => ({ ...pm, isDefault: false })),
            newPaymentMethod,
          ];
        }
        return [...prev, newPaymentMethod];
      });

      closeModal();
    } catch (error) {
      console.error("Error adding payment method:", error);
      // TODO: Show error message to user
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (paymentMethodId: string) => {
    if (
      window.confirm("Are you sure you want to remove this payment method?")
    ) {
      try {
        // TODO: Call Stripe API to detach payment method
        setPaymentMethods((prev) =>
          prev.filter((pm) => pm.id !== paymentMethodId),
        );
      } catch (error) {
        console.error("Error removing payment method:", error);
      }
    }
  };

  const handleSetDefault = async (paymentMethodId: string) => {
    try {
      // TODO: Update default payment method in backend
      setPaymentMethods((prev) =>
        prev.map((pm) => ({
          ...pm,
          isDefault: pm.id === paymentMethodId,
        })),
      );
    } catch (error) {
      console.error("Error setting default payment method:", error);
    }
  };

  const getBrandName = (brand: string) => {
    const brandNames: { [key: string]: string } = {
      visa: "Visa",
      mastercard: "Mastercard",
      amex: "American Express",
      discover: "Discover",
      diners: "Diners Club",
      jcb: "JCB",
    };
    return brandNames[brand] || brand.toUpperCase();
  };

  const formatExpiry = (month: number, year: number) => {
    return `${month.toString().padStart(2, "0")}/${year.toString().slice(-2)}`;
  };

  const isExpired = (month: number, year: number) => {
    const now = new Date();
    const expiry = new Date(year, month - 1);
    return expiry < now;
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Methods</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your saved payment methods
          </p>
        </div>
        <button
          onClick={openModal}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Payment Method
        </button>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Shield className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Your payment information is secure
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                We use industry-standard encryption and work with trusted
                payment processors to keep your financial information safe. We
                never store your full card details.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods List */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {paymentMethods.map((paymentMethod) => (
          <div
            key={paymentMethod.id}
            className={`relative bg-white overflow-hidden shadow rounded-lg border-2 ${
              paymentMethod.isDefault ? "border-indigo-500" : "border-gray-200"
            }`}
          >
            {paymentMethod.isDefault && (
              <div className="absolute top-0 right-0 -mt-1 -mr-1">
                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  <Star className="h-3 w-3 mr-1" />
                  Default
                </div>
              </div>
            )}

            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="text-2xl">
                    {cardBrandLogos[paymentMethod.brand] || "💳"}
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">
                      {getBrandName(paymentMethod.brand)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      •••• •••• •••• {paymentMethod.last4}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center text-sm text-gray-600">
                  <User className="h-4 w-4 mr-1" />
                  <span>{paymentMethod.holderName}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>
                    Expires{" "}
                    {formatExpiry(
                      paymentMethod.expiryMonth,
                      paymentMethod.expiryYear,
                    )}
                    {isExpired(
                      paymentMethod.expiryMonth,
                      paymentMethod.expiryYear,
                    ) && (
                      <span className="ml-2 text-red-600 font-medium">
                        Expired
                      </span>
                    )}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => handleDelete(paymentMethod.id)}
                  className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Remove
                </button>
                {!paymentMethod.isDefault && (
                  <button
                    onClick={() => handleSetDefault(paymentMethod.id)}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Set as Default
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {paymentMethods.length === 0 && (
          <div className="col-span-full">
            <div className="text-center py-12">
              <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No payment methods
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Add a payment method to make checkout faster.
              </p>
              <div className="mt-6">
                <button
                  onClick={openModal}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment Method
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Payment Method Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={closeModal}
            />

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        Add Payment Method
                      </h3>

                      <div className="space-y-4">
                        {/* Card Holder Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Cardholder Name *
                          </label>
                          <input
                            type="text"
                            name="holderName"
                            value={formData.holderName}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="John Doe"
                          />
                        </div>

                        {/* Card Number */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Card Number *
                          </label>
                          <input
                            type="text"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleCardNumberChange}
                            required
                            maxLength={19}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="1234 5678 9012 3456"
                          />
                        </div>

                        {/* Expiry and CVC */}
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Month *
                            </label>
                            <select
                              name="expiryMonth"
                              value={formData.expiryMonth}
                              onChange={handleInputChange}
                              required
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            >
                              <option value="">MM</option>
                              {months.map((month) => (
                                <option key={month} value={month}>
                                  {month.toString().padStart(2, "0")}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Year *
                            </label>
                            <select
                              name="expiryYear"
                              value={formData.expiryYear}
                              onChange={handleInputChange}
                              required
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            >
                              <option value="">YYYY</option>
                              {years.map((year) => (
                                <option key={year} value={year}>
                                  {year}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              CVC *
                            </label>
                            <input
                              type="text"
                              name="cvc"
                              value={formData.cvc}
                              onChange={handleInputChange}
                              required
                              maxLength={4}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="123"
                            />
                          </div>
                        </div>

                        {/* Default Payment Method */}
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            name="isDefault"
                            checked={formData.isDefault}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label className="ml-2 block text-sm text-gray-900">
                            Set as default payment method
                          </label>
                        </div>
                      </div>

                      {/* Security Notice */}
                      <div className="mt-4 p-3 bg-gray-50 rounded-md">
                        <div className="flex">
                          <Shield className="h-5 w-5 text-gray-400 flex-shrink-0" />
                          <div className="ml-2">
                            <p className="text-xs text-gray-600">
                              Your payment information is encrypted and secure.
                              We use Stripe to process payments and never store
                              your full card details.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {isSubmitting ? "Adding..." : "Add Payment Method"}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
