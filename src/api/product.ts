import type { Product, ProductReview } from "../types/product";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://api.easy-orders.net/api/v1";
const STORE_THEME = import.meta.env.VITE_STORE_THEME ?? "clear-theme";
const PRODUCT_SLUG = import.meta.env.VITE_PRODUCT_SLUG ?? "Sneakers12";

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function normalizeReview(raw: unknown, index: number): ProductReview | null {
  if (!raw || typeof raw !== "object") return null;
  const record = raw as Record<string, unknown>;
  const title = asString(record.title || record.comment || record.review || record.body || record.content);
  const author = asString(
    record.author || record.user_name || record.name || record.customer_name,
    "Customer",
  );
  if (!title && !author) return null;
  const rating = asNumber(record.rating ?? record.rate ?? record.stars, 5);
  return {
    id: asString(record.id, `review-${index}`),
    author,
    title: title || "Review",
    createdAt: asString(record.created_at || record.createdAt || record.date),
    rating: Math.min(5, Math.max(1, Math.round(rating))),
    likes: asNumber(record.likes ?? record.helpful, 0),
    avatar: asString(record.avatar || record.image) || undefined,
    topics: Array.isArray(record.topics) ? record.topics.filter((topic) => typeof topic === "string") : [],
    hasMedia: Boolean(record.hasMedia || record.image || record.images),
    hasDescription: Boolean(title),
  };
}

export function normalizeProduct(raw: unknown): Product {
  const record = (raw ?? {}) as Record<string, unknown>;
  const reviewsRaw = record.reviews;
  const reviews = Array.isArray(reviewsRaw)
    ? reviewsRaw
        .map((review, index) => normalizeReview(review, index))
        .filter((review): review is ProductReview => review !== null)
    : [];

  return {
    id: asString(record.id),
    name: asString(record.name, "Product"),
    price: asNumber(record.price),
    sale_price: asNumber(record.sale_price),
    description: asString(record.description),
    slug: asString(record.slug),
    thumb: asString(record.thumb),
    images: Array.isArray(record.images) ? record.images.filter((item) => typeof item === "string") : [],
    quantity: asNumber(record.quantity),
    track_stock: Boolean(record.track_stock),
    disable_orders_for_no_stock: Boolean(record.disable_orders_for_no_stock),
    buy_now_text: asString(record.buy_now_text, "Checkout Now"),
    is_fixed_bottom_buy: Boolean(record.is_fixed_bottom_buy),
    is_quantity_hidden: Boolean(record.is_quantity_hidden),
    is_free_shipping: Boolean(record.is_free_shipping),
    custom_currency: asString(record.custom_currency),
    hide_related_products: Boolean(record.hide_related_products),
    fake_visitors_min: asNumber(record.fake_visitors_min),
    fake_visitors_max: asNumber(record.fake_visitors_max),
    variations: Array.isArray(record.variations) ? (record.variations as Product["variations"]) : [],
    variants: Array.isArray(record.variants) ? (record.variants as Product["variants"]) : [],
    categories: Array.isArray(record.categories) ? (record.categories as Product["categories"]) : [],
    reviews,
  };
}

export function productUrl(): string {
  return `${BASE_URL}/products/slug/${STORE_THEME}/${PRODUCT_SLUG}?join=reviews`;
}

export async function fetchProduct(signal?: AbortSignal): Promise<Product> {
  const response = await fetch(productUrl(), { signal });
  if (!response.ok) {
    throw new Error(`Could not load the product (${response.status}).`);
  }
  return normalizeProduct(await response.json());
}

export const productQueryKey = ["product", STORE_THEME, PRODUCT_SLUG] as const;
