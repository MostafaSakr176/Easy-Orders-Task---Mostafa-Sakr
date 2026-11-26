import { useMemo, useState } from "react";
import { htmlToText, sanitizeHtml } from "../lib/html";
import { stockLabel } from "../lib/variants";
import type { Product, ProductVariant } from "../types/product";

export function useProductInfo(product: Product, variant?: ProductVariant) {
  const [expanded, setExpanded] = useState(false);
  const [sizeChart, setSizeChart] = useState(false);
  const [deliveryOpen, setDeliveryOpen] = useState(false);
  const description = useMemo(() => htmlToText(product.description), [product.description]);
  const preview = description.length > 220 ? `${description.slice(0, 220).trim()}…` : description;
  const html = useMemo(() => sanitizeHtml(product.description), [product.description]);

  return {
    expanded,
    expand: () => setExpanded(true),
    collapse: () => setExpanded(false),
    canExpand: description.length > 220,
    preview,
    html,
    purchasable: stockLabel(product, variant) === "In stock",
    sizeVariation: product.variations.find((variation) => variation.type === "button"),
    sizeChart,
    openSizeChart: () => setSizeChart(true),
    closeSizeChart: () => setSizeChart(false),
    deliveryOpen,
    openDelivery: () => setDeliveryOpen(true),
    closeDelivery: () => setDeliveryOpen(false),
  };
}
