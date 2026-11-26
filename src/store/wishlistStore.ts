import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export interface WishItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  currency: string;
}

interface WishlistState {
  hydrated: boolean;
  items: WishItem[];
  toggle: (item: WishItem) => void;
  has: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    immer((set, get) => ({
      hydrated: false,
      items: [],
      toggle: (item) =>
        set((state) => {
          const index = state.items.findIndex((saved) => saved.productId === item.productId);
          if (index >= 0) state.items.splice(index, 1);
          else state.items.push(item);
        }),
      has: (productId) => get().items.some((item) => item.productId === productId),
    })),
    {
      name: "easy-orders-wishlist",
      version: 1,
      partialize: (state) => ({ items: state.items }),
      merge: (persisted, current) => ({
        ...current,
        ...(persisted as Partial<WishlistState>),
        hydrated: true,
      }),
    },
  ),
);
