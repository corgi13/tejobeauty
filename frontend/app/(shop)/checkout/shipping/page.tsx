"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/cart-provider";
import Breadcrumb from "@/components/layout/breadcrumb";

interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
}

export default function CheckoutShippingPage() {
  const router = useRouter();
  const { items, subtotal } = useCart();
  const [selectedShipping, setSelectedShipping] = useState<string>("");

  const shippingMethods: ShippingMethod[] = [
    {
      id: "standard",
      name: "Standard Shipping",
      description: "Delivery in 5-7 business days",
      price: 5.99,
      estimatedDays: "5-7 business days",
    },
    {
      id: "express",
      name: "Express Shipping",
      description: "Delivery in 2-3 business days",
      price: 12.99,
      estimatedDays: "2-3 business days",
    },
    {
      id: "overnight",
      name: "Overnight Shipping",
      description: "Next business day delivery",
      price: 24.99,
      estimatedDays: "Next business day",
    },
  ];

  const selectedMethod = shippingMethods.find(
    (method) => method.id === selectedShipping,
  );
  const shippingCost = selectedMethod?.price || 0;
  const tax = (subtotal + shippingCost) * 0.08; // 8% tax rate
  const total = subtotal + shippingCost + tax;

  // Create breadcrumb items
  const breadcrumbItems = [
    { label: "Home", href: "/", isCurrent: false },
    { label: "Cart", href: "/cart", isCurrent: false },
    { label: "Checkout", href: "/checkout", isCurrent: false },
    { label: "Shipping", href: "/checkout/shipping", isCurrent: true },
  ];

  const handleContinue = () => {
    if (!selectedShipping) {
      alert("Please select a shipping method");
      return;
    }
    router.push("/checkout/payment");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <h1 className="text-3xl font-bold mb-8">Shipping Method</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping methods */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">
              Choose Shipping Method
            </h2>

            <div className="space-y-4">
              {shippingMethods.map((method) => (
                <div
                  key={method.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedShipping === method.id
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onClick={() => setSelectedShipping(method.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id={method.id}
                        name="shipping"
                        value={method.id}
                        checked={selectedShipping === method.id}
                        onChange={() => setSelectedShipping(method.id)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <div className="ml-3">
                        <label
                          htmlFor={method.id}
                          className="block text-sm font-medium text-gray-900 cursor-pointer"
                        >
                          {method.name}
                        </label>
                        <p className="text-sm text-gray-500">
                          {method.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ${method.price.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {method.estimatedDays}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={() => router.push("/checkout")}
                className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Back to Information
              </button>
              <button
                onClick={handleContinue}
                disabled={!selectedShipping}
                className="px-6 py-3 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Continue to Payment
              </button>
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-lg font-medium mb-4">Order Summary</h2>

            {/* Order items */}
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        layout="fill"
                        objectFit="cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-xs text-gray-500">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-sm font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Order totals */}
            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {selectedMethod
                    ? `$${shippingCost.toFixed(2)}`
                    : "Select method"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
