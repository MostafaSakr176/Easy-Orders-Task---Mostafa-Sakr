import { beforeEach, describe, expect, it } from "vitest";
import { useWishlistStore } from "./wishlistStore";

const wish = {
  productId: "prod-1",
  name: "Achilles Pro",
  image: "https://example.com/brown.webp",
  price: 160,
  currency: "EGP",
};

describe("wishlist store", () => {
  beforeEach(() => {
    localStorage.clear();
    useWishlistStore.setState({ items: [], hydrated: true });
  });

  it("toggles a product in and out", () => {
    useWishlistStore.getState().toggle(wish);
    expect(useWishlistStore.getState().has("prod-1")).toBe(true);
    useWishlistStore.getState().toggle(wish);
    expect(useWishlistStore.getState().items).toHaveLength(0);
  });
});
