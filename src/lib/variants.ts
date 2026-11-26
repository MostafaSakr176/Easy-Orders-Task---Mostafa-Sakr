import type { Product, ProductVariant, Selection } from "../types/product";

export function isPurchasable(
  product: Pick<Product, "track_stock" | "disable_orders_for_no_stock" | "quantity">,
  variant?: Pick<ProductVariant, "quantity">,
): boolean {
  if (!product.track_stock || !product.disable_orders_for_no_stock) return true;
  const quantity = variant ? variant.quantity : product.quantity;
  return quantity > 0;
}

export function findVariant(product: Product, selection: Selection): ProductVariant | undefined {
  const names = product.variations.map((variation) => variation.name);
  if (names.some((name) => !selection[name])) return undefined;
  return product.variants.find((variant) =>
    names.every((name) =>
      variant.variation_props.some(
        (prop) => prop.variation === name && prop.variation_prop === selection[name],
      ),
    ),
  );
}

export function isOptionAvailable(
  product: Product,
  variationName: string,
  optionName: string,
  selection: Selection,
): boolean {
  const next: Selection = { ...selection, [variationName]: optionName };
  return product.variants.some((variant) => {
    const matches = variant.variation_props.every(
      (prop) => !next[prop.variation] || next[prop.variation] === prop.variation_prop,
    );
    return matches && isPurchasable(product, variant);
  });
}

export function maxQuantity(product: Product, variant?: ProductVariant): number {
  if (product.is_quantity_hidden) return 1;
  if (product.track_stock) {
    const stock = variant ? variant.quantity : product.quantity;
    return Math.max(1, stock);
  }
  return 10;
}

export function gallerySources(product: Product): string[] {
  const sources = [product.thumb, ...product.images];
  for (const variation of product.variations) {
    if (variation.type !== "image") continue;
    for (const prop of variation.props) {
      if (prop.value) sources.push(prop.value);
    }
  }
  return [...new Set(sources.filter(Boolean))];
}

export function imageForSelection(product: Product, selection: Selection): string | undefined {
  for (const variation of product.variations) {
    if (variation.type !== "image") continue;
    const chosen = selection[variation.name];
    const prop = variation.props.find((item) => item.name === chosen);
    if (prop?.value) return prop.value;
  }
  return undefined;
}

export function defaultSelection(product: Product): Selection {
  const selection: Selection = {};
  for (const variation of product.variations) {
    const available = variation.props.find((prop) =>
      isOptionAvailable(product, variation.name, prop.name, selection),
    );
    const fallback = available ?? variation.props[0];
    if (fallback) selection[variation.name] = fallback.name;
  }
  return selection;
}

export function missingSelections(product: Product, selection: Selection): string[] {
  return product.variations
    .map((variation) => variation.name)
    .filter((name) => !selection[name]);
}

export function brandLabel(product: Product): string {
  const split = product.name.split(/\s+-\s+/)[0]?.trim();
  if (split && split.length < product.name.length) return split;
  return product.categories[0]?.name ?? "";
}

export function stockLabel(product: Product, variant?: ProductVariant): string {
  return isPurchasable(product, variant) ? "In stock" : "Out of stock";
}
