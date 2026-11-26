import { describe, expect, it } from "vitest";
import { convertMoney, formatMoney } from "./money";

describe("convertMoney", () => {
  it("leaves an amount unchanged when the currencies match", () => {
    expect(convertMoney(160, "EGP", "EGP")).toBe(160);
  });

  it("converts EGP into USD with the display rate", () => {
    expect(convertMoney(160, "EGP", "USD")).toBe(3.27);
    expect(formatMoney(3.27, "USD")).toMatch(/\$\s?3\.27|USD\s?3\.27/);
  });

  it("returns the original amount for an unknown code", () => {
    expect(convertMoney(160, "EGP", "JPY")).toBe(160);
  });
});
