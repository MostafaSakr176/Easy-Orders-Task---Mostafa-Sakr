import { beforeEach, describe, expect, it } from "vitest";
import { useCompareStore, type CompareItem } from "./compareStore";

function item(id: string): CompareItem {
  return { id, name: id, brand: "Brand", image: "", priceLabel: "$10", ratingLabel: "4.5" };
}

describe("compare store", () => {
  beforeEach(() => {
    localStorage.clear();
    useCompareStore.setState({ items: [] });
  });

  it("keeps at most three products and toggles an existing one off", () => {
    const toggle = useCompareStore.getState().toggle;
    expect(toggle(item("a"))).toBe("added");
    expect(toggle(item("b"))).toBe("added");
    expect(toggle(item("c"))).toBe("added");
    expect(toggle(item("d"))).toBe("limit");
    expect(useCompareStore.getState().items).toHaveLength(3);
    expect(toggle(item("b"))).toBe("removed");
    expect(useCompareStore.getState().items.map((entry) => entry.id)).toEqual(["a", "c"]);
  });
});
