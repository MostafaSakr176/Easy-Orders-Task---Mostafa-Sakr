import { describe, expect, it } from "vitest";
import { sneaker } from "../test/fixture";
import {
  defaultSelection,
  findVariant,
  isOptionAvailable,
  maxQuantity,
  missingSelections,
} from "./variants";
import { resolvePrice } from "./money";

describe("variant selection", () => {
  it("picks the first purchasable options", () => {
    expect(defaultSelection(sneaker)).toEqual({ color: "brown", size: "38" });
  });

  it("disables a size that is out of stock for the selected color", () => {
    expect(isOptionAvailable(sneaker, "size", "40", { color: "brown" })).toBe(false);
    expect(isOptionAvailable(sneaker, "size", "40", { color: "black" })).toBe(true);
  });

  it("finds the matching variant and its price", () => {
    const variant = findVariant(sneaker, { color: "black", size: "40" });
    expect(variant?.id).toBe("v-black-40");
    expect(resolvePrice(sneaker, variant)).toEqual({ list: 190, current: 160, onSale: true });
  });

  it("uses a variant sale price when the variant sets one", () => {
    const variant = findVariant(sneaker, { color: "brown", size: "40" });
    expect(resolvePrice(sneaker, variant)).toEqual({ list: 210, current: 180, onSale: true });
  });

  it("reports missing variation names and caps quantity to stock", () => {
    expect(missingSelections(sneaker, { color: "brown" })).toEqual(["size"]);
    const variant = findVariant(sneaker, { color: "brown", size: "38" });
    expect(maxQuantity(sneaker, variant)).toBe(4);
  });
});
