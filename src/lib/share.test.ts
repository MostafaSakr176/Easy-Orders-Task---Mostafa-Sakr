import { describe, expect, it } from "vitest";
import { shareUrl } from "./share";

describe("shareUrl", () => {
  it("builds a social link and leaves copy to the clipboard", () => {
    expect(shareUrl("facebook", "Achilles", "https://shop.test/p")).toBe(
      "https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fshop.test%2Fp",
    );
    expect(shareUrl("whatsapp", "Achilles", "https://shop.test/p")).toContain("wa.me");
    expect(shareUrl("copy", "Achilles", "https://shop.test/p")).toBeNull();
  });
});
