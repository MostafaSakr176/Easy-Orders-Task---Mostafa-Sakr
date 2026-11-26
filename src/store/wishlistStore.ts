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
  items: WishItem[];
  toggle: (item: WishItem) => void;
  has: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    immer((set, get) => ({
      items: [],
      toggle: (item) =>
        set((state) => {
          const index = state.items.findIndex((saved) => saved.productId === item.productId);
          if (index >= 0) state.items.splice(index, 1);
          else state.items.push(item);
        }),
      has: (productId) => get().items.some((item) => item.productId === productId),
    })),
    { name: "easy-orders-wishlist", version: 1 },
  ),
);
