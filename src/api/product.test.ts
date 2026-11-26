import { describe, expect, it } from "vitest";
import { normalizeProduct } from "./product";

describe("normalizeProduct", () => {
  it("keeps valid nested records and drops the rest", () => {
    const product = normalizeProduct({
      slug: "sneaker",
      name: "Shoe",
      variations: [
        { name: "color", props: [{ name: "red", value: "https://example.com/red.webp" }, { nope: true }, "bad"] },
        { props: [{ name: "orphan" }] },
        null,
      ],
      variants: [
        {
          id: "v1",
          price: 190,
          variation_props: [
            { variation: "color", variation_prop: "red" },
            { variation: "", variation_prop: "red" },
          ],
        },
        { price: 10 },
      ],
      categories: [
        { id: "c1", name: "Mules", slug: "mules" },
        { name: "" },
      ],
      reviews: [{ comment: "Nice", rating: 9 }, { rating: 5 }],
    });

    expect(product.id).toBe("sneaker");
    expect(product.variations).toHaveLength(1);
    expect(product.variations[0]?.props).toHaveLength(1);
    expect(product.variants).toHaveLength(1);
    expect(product.variants[0]?.price).toBe(190);
    expect(product.variants[0]?.variation_props).toHaveLength(1);
    expect(product.categories).toHaveLength(1);
    expect(product.reviews).toHaveLength(2);
    expect(product.reviews[0]?.rating).toBe(5);
  });
});
