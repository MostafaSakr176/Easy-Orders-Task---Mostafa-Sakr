import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export const COMPARE_LIMIT = 3;

export interface CompareItem {
  id: string;
  name: string;
  brand: string;
  image: string;
  priceLabel: string;
  ratingLabel: string;
}

interface CompareState {
  items: CompareItem[];
  toggle: (item: CompareItem) => "added" | "removed" | "limit";
  remove: (id: string) => void;
  clear: () => void;
}

export const useCompareStore = create<CompareState>()(
  persist(
    immer((set, get) => ({
      items: [],
      toggle: (item) => {
        const existing = get().items.some((entry) => entry.id === item.id);
        if (!existing && get().items.length >= COMPARE_LIMIT) return "limit";
        set((state) => {
          const index = state.items.findIndex((entry) => entry.id === item.id);
          if (index >= 0) state.items.splice(index, 1);
          else state.items.push(item);
        });
        return existing ? "removed" : "added";
      },
      remove: (id) =>
        set((state) => {
          const index = state.items.findIndex((entry) => entry.id === id);
          if (index >= 0) state.items.splice(index, 1);
        }),
      clear: () =>
        set((state) => {
          state.items = [];
        }),
    })),
    { name: "easy-orders-compare", version: 1 },
  ),
);
