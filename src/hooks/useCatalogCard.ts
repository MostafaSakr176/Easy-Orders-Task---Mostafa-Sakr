import { track } from "../lib/analytics";
import type { CatalogCard } from "../data/catalog";
import { useCompareStore } from "../store/compareStore";
import { useUiStore } from "../store/uiStore";
import { useWishlistStore } from "../store/wishlistStore";

export function useCatalogCard(product: CatalogCard, list: string) {
  const wished = useWishlistStore((state) => state.items.some((item) => item.productId === product.id));
  const toggleWish = useWishlistStore((state) => state.toggle);
  const compared = useCompareStore((state) => state.items.some((item) => item.id === product.id));
  const toggleCompareItem = useCompareStore((state) => state.toggle);
  const pushToast = useUiStore((state) => state.pushToast);

  function toggleWishlist() {
    toggleWish({
      productId: product.id,
      name: product.name,
      image: product.image,
      price: product.amount,
      currency: "USD",
    });
    track(wished ? "remove_from_wishlist" : "add_to_wishlist", { id: product.id, list });
    pushToast(wished ? "Removed from wishlist" : "Saved to wishlist");
  }

  function toggleCompare() {
    const result = toggleCompareItem({
      id: product.id,
      name: product.name,
      brand: product.brand,
      image: product.image,
      priceLabel: product.price,
      amount: product.amount,
      currency: "USD",
      ratingLabel: product.rating,
    });
    if (result === "limit") {
      pushToast("You can compare up to 3 products");
      return;
    }
    track(result === "added" ? "add_to_compare" : "remove_from_compare", { id: product.id, list });
    pushToast(result === "added" ? "Added to compare" : "Removed from compare");
  }

  function select() {
    track("select_recommendation", { id: product.id, list, name: product.name });
  }

  return { wished, compared, toggleWishlist, toggleCompare, select };
}
