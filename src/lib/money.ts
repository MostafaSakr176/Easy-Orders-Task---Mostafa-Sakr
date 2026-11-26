import type { Product, PriceQuote, ProductVariant } from "../types/product";

export function currencyCode(product: Pick<Product, "custom_currency">): string {
  const code = product.custom_currency?.trim();
  return code && code.length === 3 ? code.toUpperCase() : "EGP";
}

const UNIT_IN_EGP: Record<string, number> = {
  EGP: 1,
  USD: 49,
  GBP: 62,
};

export function convertMoney(amount: number, from: string, to: string): number {
  const source = from.trim().toUpperCase();
  const target = to.trim().toUpperCase();
  if (source === target) return amount;
  const fromRate = UNIT_IN_EGP[source];
  const toRate = UNIT_IN_EGP[target];
  if (!fromRate || !toRate) return amount;
  return Math.round(((amount * fromRate) / toRate) * 100) / 100;
}

export function formatMoney(amount: number, currency: string): string {
  const digits = Number.isInteger(amount) ? 0 : 2;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: digits,
      minimumFractionDigits: digits,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(digits)}`;
  }
}

export function resolvePrice(
  product: Pick<Product, "price" | "sale_price">,
  variant?: Pick<ProductVariant, "price" | "sale_price">,
): PriceQuote {
  const list = variant && variant.price > 0 ? variant.price : product.price;
  const variantSale = variant && variant.sale_price > 0 ? variant.sale_price : 0;
  const productSale = product.sale_price > 0 ? product.sale_price : 0;
  const sale = variantSale || productSale;
  const current = sale > 0 && sale < list ? sale : list;
  return { list, current, onSale: current < list };
}
