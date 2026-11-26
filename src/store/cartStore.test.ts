import { beforeEach, describe, expect, it } from "vitest";
import { selectCartCount, selectCartSubtotal, useCartStore } from "./cartStore";

const line = {
  productId: "prod-1",
  variantId: "v-brown-38",
  name: "Achilles Pro",
  image: "https://example.com/brown.webp",
  unitPrice: 160,
  listPrice: 190,
  maxQuantity: 4,
  currency: "EGP",
  options: [
    { name: "color", value: "brown" },
    { name: "size", value: "38" },
  ],
};

describe("cart store", () => {
  beforeEach(() => {
    localStorage.clear();
    useCartStore.setState({ items: [], hydrated: true });
  });

  it("adds a line and merges a repeat add without passing the stock cap", () => {
    useCartStore.getState().addItem({ ...line, quantity: 2 });
    useCartStore.getState().addItem({ ...line, quantity: 3 });
    const items = useCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0]?.quantity).toBe(4);
    expect(selectCartCount(items)).toBe(4);
    expect(selectCartSubtotal(items)).toBe(640);
  });

  it("adjusts quantity inside bounds and removes a line", () => {
    useCartStore.getState().addItem({ ...line, quantity: 1 });
    const id = useCartStore.getState().items[0]?.id ?? "";
    useCartStore.getState().setQuantity(id, 0);
    expect(useCartStore.getState().items[0]?.quantity).toBe(1);
    useCartStore.getState().setQuantity(id, 3);
    expect(useCartStore.getState().items[0]?.quantity).toBe(3);
    useCartStore.getState().removeItem(id);
    expect(useCartStore.getState().items).toEqual([]);
    expect(selectCartSubtotal([])).toBe(0);
  });
});
