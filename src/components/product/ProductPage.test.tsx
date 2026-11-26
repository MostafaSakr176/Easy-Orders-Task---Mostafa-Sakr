import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { sneaker } from "../../test/fixture";
import { useCartStore } from "../../store/cartStore";
import { useCompareStore } from "../../store/compareStore";
import { useUiStore } from "../../store/uiStore";
import { useWishlistStore } from "../../store/wishlistStore";
import { ProductPage } from "./ProductPage";

function renderPage() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <ProductPage />
    </QueryClientProvider>,
  );
}

describe("product page cart flow", () => {
  beforeEach(() => {
    localStorage.clear();
    useCartStore.setState({ items: [], hydrated: true });
    useWishlistStore.setState({ items: [], hydrated: true });
    useCompareStore.setState({ items: [], hydrated: true });
    useUiStore.setState({ cartOpen: false, wishlistOpen: false, compareOpen: false, checkout: false, toast: null, currency: "EGP" });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => sneaker,
      }),
    );
  });

  it("loads the product, blocks a sold-out size, and manages the cart", async () => {
    const user = userEvent.setup();
    renderPage();

    expect(await screen.findByRole("heading", { name: sneaker.name })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "40" })).toBeDisabled();
    expect(screen.getAllByText(/EGP\s?160/).length).toBeGreaterThan(0);

    await user.click(screen.getByRole("radio", { name: "black" }));
    expect(screen.getByRole("radio", { name: "40" })).toBeEnabled();
    await user.click(screen.getByRole("radio", { name: "40" }));
    await user.click(screen.getAllByRole("button", { name: "Add To Cart" })[0]!);

    expect(await screen.findByText("Added to cart")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "View cart" }));

    const dialog = await screen.findByRole("dialog", { name: "Cart" });
    expect(within(dialog).getByText("color: black · size: 40")).toBeInTheDocument();
    await user.click(within(dialog).getByRole("button", { name: "Increase quantity" }));
    expect(within(dialog).getByText("2")).toBeInTheDocument();
    await user.click(within(dialog).getByRole("button", { name: "Remove" }));
    expect(within(dialog).getByText("Your cart is empty")).toBeInTheDocument();
  }, 15000);

  it("saves a wish, compares two products, and moves sizes with the keyboard", async () => {
    const user = userEvent.setup();
    renderPage();

    expect(await screen.findByRole("heading", { name: sneaker.name })).toBeInTheDocument();
    expect(screen.getAllByText(/from 4 reviews/).length).toBeGreaterThan(0);

    await user.click(screen.getAllByRole("button", { name: "Save to wishlist" })[0]!);
    await user.click(screen.getByRole("button", { name: "Wishlist, 1 saved" }));
    const wishlist = await screen.findByRole("dialog", { name: "Wishlist" });
    expect(within(wishlist).getByText(sneaker.name)).toBeInTheDocument();
    await user.click(within(wishlist).getByRole("button", { name: "Close" }));

    await user.click(screen.getByRole("button", { name: "Add to compare" }));
    await user.click(screen.getAllByRole("button", { name: "Add Wide Leg Cropped Jeans, Denim to compare" })[0]!);
    await user.click(screen.getByRole("button", { name: "Compare products" }));
    const compare = await screen.findByRole("dialog", { name: "Compare products" });
    expect(within(compare).getByText(sneaker.name)).toBeInTheDocument();
    expect(within(compare).getByText("Wide Leg Cropped Jeans, Denim")).toBeInTheDocument();

    compare.querySelector("button")?.focus();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog", { name: "Compare products" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("radio", { name: "black" }));
    screen.getByRole("radio", { name: "38" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "40" })).toHaveAttribute("aria-checked", "true");
  }, 15000);
});
