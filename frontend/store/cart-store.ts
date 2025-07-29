import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  attributes?: Record<string, string>;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  itemCount: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const { items } = get();
        const existingItemIndex = items.findIndex(
          (i) =>
            i.productId === item.productId && i.variantId === item.variantId,
        );

        if (existingItemIndex !== -1) {
          // If item already exists, update quantity
          const updatedItems = [...items];
          updatedItems[existingItemIndex].quantity += item.quantity;
          set({ items: updatedItems });
        } else {
          // Otherwise add new item
          const newItem = {
            ...item,
            id: `${item.productId}${item.variantId ? `-${item.variantId}` : ""}-${Date.now()}`,
          };
          set({ items: [...items, newItem] });
        }
      },

      updateItemQuantity: (id, quantity) => {
        const { items } = get();
        if (quantity <= 0) {
          // If quantity is 0 or negative, remove the item
          set({ items: items.filter((item) => item.id !== id) });
        } else {
          // Otherwise update the quantity
          set({
            items: items.map((item) =>
              item.id === id ? { ...item, quantity } : item,
            ),
          });
        }
      },

      removeItem: (id) => {
        const { items } = get();
        set({ items: items.filter((item) => item.id !== id) });
      },

      clearCart: () => {
        set({ items: [] });
      },

      itemCount: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },

      subtotal: () => {
        const { items } = get();
        return items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        );
      },
    }),
    {
      name: "tejo-nails-cart",
      // Use localStorage for persistence
      storage:
        typeof window !== "undefined"
          ? (window.localStorage as any)
          : undefined,
    },
  ),
);
