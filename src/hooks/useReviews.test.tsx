import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useReviews } from "./useReviews";

describe("useReviews", () => {
  it("keeps only reviews that match the photo filter and the selected rating", () => {
    const { result } = renderHook(() => useReviews([]));
    const starting = result.current.visible.length;

    act(() => result.current.selectChip("With Photo & Video"));
    expect(result.current.visible.length).toBeGreaterThan(0);
    expect(result.current.visible.every((review) => review.hasMedia)).toBe(true);
    expect(result.current.visible.length).toBeLessThan(starting);

    act(() => result.current.toggleRating(5));
    expect(result.current.visible.every((review) => review.rating === 5 && review.hasMedia)).toBe(true);
  });
});
