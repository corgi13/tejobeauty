"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "./cart-provider";

export default function CartDrawer() {
  const {
    items,
    updateItemQuantity,
    removeItem,
    subtotal,
    isCartOpen,
    closeCart,
  } = useCart();

  const drawerRef = useRef<HTMLDivElement>(null);

  // Close the cart when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node) &&
        isCartOpen
      ) {
        closeCart();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCartOpen, closeCart]);

  // Prevent scrolling when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  if (!isCartOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
      <div
        ref={drawerRef}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out"
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
            <h2 className="text-lg font-medium">Shopping Cart</h2>
            <button
              onClick={closeCart}
              className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Cart items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center">
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-900">
                    Your cart is empty
                  </p>
                  <p className="mt-1 text-gray-500">
                    Looks like you haven't added any products to your cart yet.
                  </p>
                  <button
                    onClick={closeCart}
                    className="mt-6 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {items.map((item) => (
                  <li key={item.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      {/* Product image */}
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gray-100">
                            <span className="text-xs text-gray-500">
                              No image
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Product details */}
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between">
                          <h3 className="text-sm font-medium text-gray-900">
                            {item.name}
                          </h3>
                          <p className="text-sm font-medium text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>

                        {item.attributes &&
                          Object.keys(item.attributes).length > 0 && (
                            <p className="mt-1 text-xs text-gray-500">
                              {Object.entries(item.attributes)
                                .map(([key, value]) => `${key}: ${value}`)
                                .join(", ")}
                            </p>
                          )}

                        <div className="mt-2 flex items-center justify-between">
                          {/* Quantity controls */}
                          <div className="flex items-center border border-gray-300 rounded-md">
                            <button
                              onClick={() =>
                                updateItemQuantity(item.id, item.quantity - 1)
                              }
                              className="p-1 text-gray-500 hover:text-gray-700"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-2 text-sm">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateItemQuantity(item.id, item.quantity + 1)
                              }
                              className="p-1 text-gray-500 hover:text-gray-700"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Remove button */}
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-sm text-red-600 hover:text-red-800"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 p-4">
              <div className="flex justify-between py-2">
                <p className="text-base font-medium text-gray-900">Subtotal</p>
                <p className="text-base font-medium text-gray-900">
                  ${subtotal.toFixed(2)}
                </p>
              </div>
              <p className="text-sm text-gray-500">
                Shipping and taxes calculated at checkout
              </p>
              <div className="mt-4 space-y-2">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="flex w-full items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
                >
                  Checkout
                </Link>
                <button
                  onClick={closeCart}
                  className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
