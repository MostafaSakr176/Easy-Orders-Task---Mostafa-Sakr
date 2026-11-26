import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export interface CartOption {
  name: string;
  value: string;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  name: string;
  image: string;
  unitPrice: number;
  listPrice: number;
  quantity: number;
  maxQuantity: number;
  currency: string;
  options: CartOption[];
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id" | "quantity"> & { quantity?: number }) => void;
  setQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
}

export function cartLineId(productId: string, variantId: string): string {
  return `${productId}:${variantId}`;
}

export const selectCartCount = (items: CartItem[]): number =>
  items.reduce((total, item) => total + item.quantity, 0);

export const selectCartSubtotal = (items: CartItem[]): number =>
  items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);

export const useCartStore = create<CartState>()(
  persist(
    immer((set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const id = cartLineId(item.productId, item.variantId);
          const quantity = Math.max(1, item.quantity ?? 1);
          const existing = state.items.find((line) => line.id === id);
          if (existing) {
            existing.quantity = Math.min(existing.maxQuantity, existing.quantity + quantity);
            existing.unitPrice = item.unitPrice;
            existing.listPrice = item.listPrice;
            existing.maxQuantity = item.maxQuantity;
            existing.image = item.image;
            return;
          }
          state.items.push({
            ...item,
            id,
            quantity: Math.min(item.maxQuantity, quantity),
          });
        }),
      setQuantity: (id, quantity) =>
        set((state) => {
          const line = state.items.find((item) => item.id === id);
          if (!line) return;
          line.quantity = Math.min(line.maxQuantity, Math.max(1, quantity));
        }),
      removeItem: (id) =>
        set((state) => {
          state.items = state.items.filter((item) => item.id !== id);
        }),
      clear: () =>
        set((state) => {
          state.items = [];
        }),
    })),
    { name: "easy-orders-cart", version: 1 },
  ),
);
