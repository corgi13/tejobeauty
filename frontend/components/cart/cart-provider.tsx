"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useCartStore, CartItem } from "@/store/cart-store";

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const {
    items,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,
    itemCount: getItemCount,
    subtotal: getSubtotal,
  } = useCartStore();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [itemCount, setItemCount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);

  // Update derived state when cart items change
  useEffect(() => {
    setItemCount(getItemCount());
    setSubtotal(getSubtotal());
  }, [items, getItemCount, getSubtotal]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const value = {
    items,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,
    itemCount,
    subtotal,
    isCartOpen,
    openCart,
    closeCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
