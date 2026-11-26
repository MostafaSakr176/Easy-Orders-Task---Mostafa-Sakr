import { beforeEach, describe, expect, it } from "vitest";
import { clearAnalytics, getAnalyticsLog, track } from "./analytics";

describe("analytics", () => {
  beforeEach(() => {
    clearAnalytics();
    delete (window as Window & { dataLayer?: unknown[] }).dataLayer;
  });

  it("records an event in memory and on the data layer", () => {
    track("add_to_wishlist", { id: "sku-1" });
    expect(getAnalyticsLog()).toEqual([
      expect.objectContaining({ event: "add_to_wishlist", payload: { id: "sku-1" } }),
    ]);
    expect((window as Window & { dataLayer?: Array<Record<string, unknown>> }).dataLayer?.[0]).toMatchObject({
      event: "add_to_wishlist",
      id: "sku-1",
    });
    expect(sessionStorage.getItem("easy-orders-analytics")).toContain("add_to_wishlist");
  });
});
