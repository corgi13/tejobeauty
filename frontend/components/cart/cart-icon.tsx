"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "./cart-provider";

interface CartIconProps {
  className?: string;
}

export default function CartIcon({ className = "" }: CartIconProps) {
  const { itemCount, openCart } = useCart();

  return (
    <button
      onClick={openCart}
      className={`relative p-2 ${className}`}
      aria-label="Open shopping cart"
    >
      <ShoppingCart className="h-6 w-6" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs font-medium text-white">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </button>
  );
}
