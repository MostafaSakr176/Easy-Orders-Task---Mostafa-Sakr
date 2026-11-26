import { describe, expect, it } from "vitest";
import type { CatalogCard } from "../data/catalog";
import { recommendProducts } from "./recommendations";

function card(id: string, name: string, brand: string, amount: number, ratingValue: number): CatalogCard {
  return {
    id,
    brand,
    name,
    price: `$${amount}`,
    amount,
    image: "",
    rating: String(ratingValue),
    ratingValue,
    sold: "1 Sold",
  };
}

describe("recommendProducts", () => {
  it("ranks closer names and prices ahead of a higher rating", () => {
    const catalog = [
      card("jeans", "Wide Leg Jeans", "Whistle", 26, 4.9),
      card("sneakers", "Suede Leather Sneakers", "Achilles", 150, 4.2),
    ];
    const ranked = recommendProducts(
      { name: "Achilles Pro Suede Sneakers", brand: "Achilles", price: 160, categories: ["Mules"] },
      catalog,
    );
    expect(ranked.map((item) => item.id)).toEqual(["sneakers", "jeans"]);
  });
});
