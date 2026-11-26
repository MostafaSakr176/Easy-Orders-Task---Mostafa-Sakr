import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProduct, productQueryKey } from "../api/product";
import { currencyCode, formatMoney, resolvePrice } from "../lib/money";
import { track } from "../lib/analytics";
import { recommendProducts } from "../lib/recommendations";
import { useCompareStore } from "../store/compareStore";
import {
  brandLabel,
  defaultSelection,
  findVariant,
  gallerySources,
  imageForSelection,
  maxQuantity,
  missingSelections,
} from "../lib/variants";
import { selectCartCount, useCartStore } from "../store/cartStore";
import { useUiStore } from "../store/uiStore";
import { useWishlistStore } from "../store/wishlistStore";
import { designReviews, relatedProducts } from "../data/catalog";
import type { PriceQuote, Product, ProductVariant, Selection } from "../types/product";

interface ReadyProduct {
  status: "ready";
  product: Product;
  price: PriceQuote;
  currency: string;
  images: string[];
  selection: Selection;
  variant?: ProductVariant;
  quantity: number;
  limit: number;
  notice?: string;
  rating: number;
  reviewSource: Product["reviews"];
  recommendations: ReturnType<typeof recommendProducts>;
  wished: boolean;
  compared: boolean;
  count: number;
  brand: string;
  activeSrc?: string;
  selectOption: (variation: string, option: string) => void;
  setQuantity: (value: number) => void;
  addCurrent: () => void;
  checkout: () => void;
  toggleWishlist: () => void;
  toggleCompare: () => void;
}

type ProductPageState =
  | { status: "pending" }
  | { status: "error"; message: string; retry: () => void }
  | ReadyProduct;

export function useProductPage(): ProductPageState {
  const query = useQuery({
    queryKey: productQueryKey,
    queryFn: ({ signal }) => fetchProduct(signal),
    staleTime: 5 * 60 * 1000,
  });
  const product = query.data;
  const [selection, setSelection] = useState<Selection>({});
  const [quantity, setQuantity] = useState(1);
  const [notice, setNotice] = useState<string>();
  const addItem = useCartStore((state) => state.addItem);
  const count = useCartStore((state) => selectCartCount(state.items));
  const setCheckout = useUiStore((state) => state.setCheckout);
  const pushToast = useUiStore((state) => state.pushToast);
  const wished = useWishlistStore((state) => (product ? state.items.some((item) => item.productId === product.id) : false));
  const toggleWish = useWishlistStore((state) => state.toggle);
  const compared = useCompareStore((state) => (product ? state.items.some((item) => item.id === product.id) : false));
  const toggleCompareItem = useCompareStore((state) => state.toggle);

  useEffect(() => {
    if (!product) return;
    setSelection(defaultSelection(product));
    track("view_item", { id: product.id, name: product.name });
  }, [product]);

  const variant = useMemo(() => (product ? findVariant(product, selection) : undefined), [product, selection]);
  const price = useMemo(() => (product ? resolvePrice(product, variant) : undefined), [product, variant]);
  const recommendations = useMemo(() => {
    if (!product || !price) return relatedProducts;
    return recommendProducts(
      {
        name: product.name,
        brand: brandLabel(product),
        price: price.current,
        categories: product.categories.map((category) => category.name),
      },
      relatedProducts,
    );
  }, [price, product]);

  useEffect(() => {
    if (!product || recommendations === relatedProducts) return;
    track("view_item_list", { list: "recommended", ids: recommendations.map((item) => item.id) });
  }, [product, recommendations]);
  const images = useMemo(() => (product ? gallerySources(product) : []), [product]);
  const limit = product ? maxQuantity(product, variant) : 1;

  useEffect(() => {
    setQuantity((current) => Math.min(current, limit));
  }, [limit]);

  function selectOption(variation: string, option: string) {
    setNotice(undefined);
    setSelection((current) => ({ ...current, [variation]: option }));
    track("select_variant", { variation, option, id: product?.id });
  }

  function requireSelection(): boolean {
    if (!product) return false;
    const missing = missingSelections(product, selection);
    if (missing.length > 0) {
      setNotice(`Choose ${missing.join(" and ")} before continuing.`);
      return false;
    }
    if (!variant) {
      setNotice("That combination is unavailable.");
      return false;
    }
    setNotice(undefined);
    return true;
  }

  function addCurrent() {
    if (!product || !price || !requireSelection() || !variant) return;
    const image = imageForSelection(product, selection) ?? product.thumb;
    addItem({
      productId: product.id,
      variantId: variant.id,
      name: product.name,
      image,
      unitPrice: price.current,
      listPrice: price.list,
      quantity,
      maxQuantity: limit,
      currency: currencyCode(product),
      options: product.variations.map((variation) => ({
        name: variation.name,
        value: selection[variation.name] ?? "",
      })),
    });
    track("add_to_cart", { id: product.id, variant: variant.id, quantity, price: price.current });
    pushToast("Added to cart");
  }

  function checkout() {
    if (!requireSelection()) return;
    addCurrent();
    setCheckout(true);
  }

  if (query.isPending) return { status: "pending" };
  if (query.isError || !product || !price) {
    return {
      status: "error",
      message: query.error instanceof Error ? query.error.message : "Try again in a moment.",
      retry: () => void query.refetch(),
    };
  }

  const currency = currencyCode(product);
  const reviewSource = product.reviews.length > 0 ? product.reviews : designReviews;
  const rating = reviewSource.reduce((total, review) => total + review.rating, 0) / reviewSource.length;

  function toggleWishlist() {
    if (!product || !price) return;
    toggleWish({
      productId: product.id,
      name: product.name,
      image: product.thumb,
      price: price.current,
      currency,
    });
    track(wished ? "remove_from_wishlist" : "add_to_wishlist", { id: product.id });
    pushToast(wished ? "Removed from wishlist" : "Saved to wishlist");
  }

  function toggleCompare() {
    if (!product || !price) return;
    const result = toggleCompareItem({
      id: product.id,
      name: product.name,
      brand: brandLabel(product),
      image: product.thumb,
      priceLabel: formatMoney(price.current, currency),
      amount: price.current,
      currency,
      ratingLabel: rating.toFixed(1),
    });
    if (result === "limit") {
      pushToast("You can compare up to 3 products");
      return;
    }
    track(result === "added" ? "add_to_compare" : "remove_from_compare", { id: product.id });
    pushToast(result === "added" ? "Added to compare" : "Removed from compare");
  }

  return {
    status: "ready",
    product,
    price,
    currency,
    images,
    selection,
    variant,
    quantity,
    limit,
    notice,
    rating,
    reviewSource,
    recommendations,
    wished,
    compared,
    count,
    brand: brandLabel(product),
    activeSrc: imageForSelection(product, selection),
    selectOption,
    setQuantity,
    addCurrent,
    checkout,
    toggleWishlist,
    toggleCompare,
  };
}

export function useToast() {
  const toast = useUiStore((state) => state.toast);
  const openCart = useUiStore((state) => state.openCart);
  return { toast, openCart };
}
