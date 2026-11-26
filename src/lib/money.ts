import type { Product, PriceQuote, ProductVariant } from "../types/product";

export function currencyCode(product: Pick<Product, "custom_currency">): string {
  const code = product.custom_currency?.trim();
  return code && code.length === 3 ? code.toUpperCase() : "EGP";
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
