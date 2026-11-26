export interface VariationProp {
  id: string;
  name: string;
  variation_id: string;
  value?: string;
}

export interface Variation {
  id: string;
  name: string;
  product_id: string;
  type: string;
  props: VariationProp[];
}

export interface VariantPropRef {
  id: string;
  variation: string;
  variation_prop: string;
  product_variant_id: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  price: number;
  sale_price: number;
  quantity: number;
  variation_props: VariantPropRef[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  thumb?: string | null;
  show_in_header?: boolean;
}

export interface ProductReview {
  id: string;
  author: string;
  title: string;
  createdAt: string;
  rating: number;
  likes: number;
  avatar?: string;
  topics: string[];
  hasMedia: boolean;
  hasDescription: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  sale_price: number;
  description: string;
  slug: string;
  thumb: string;
  images: string[];
  quantity: number;
  track_stock: boolean;
  disable_orders_for_no_stock: boolean;
  buy_now_text: string;
  is_fixed_bottom_buy: boolean;
  is_quantity_hidden: boolean;
  is_free_shipping: boolean;
  custom_currency: string;
  hide_related_products: boolean;
  fake_visitors_min: number;
  fake_visitors_max: number;
  variations: Variation[];
  variants: ProductVariant[];
  categories: Category[];
  reviews: ProductReview[];
}

export interface PriceQuote {
  list: number;
  current: number;
  onSale: boolean;
}

export interface Selection {
  [variationName: string]: string;
}
