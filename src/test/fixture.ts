import type { Product } from "../types/product";

export const sneaker: Product = {
  id: "prod-1",
  name: "Achilles Pro - Genuine Suede X Leather Sneakers",
  price: 190,
  sale_price: 160,
  description: "<ul><li>Made with cowhide leather</li></ul><p>Shipping information</p><p>We ship all over Egypt.</p>",
  slug: "Sneakers12",
  thumb: "https://example.com/thumb.webp",
  images: ["https://example.com/side.webp"],
  quantity: 0,
  track_stock: true,
  disable_orders_for_no_stock: true,
  buy_now_text: "Go To Checkout",
  is_fixed_bottom_buy: true,
  is_quantity_hidden: false,
  is_free_shipping: false,
  custom_currency: "",
  hide_related_products: false,
  fake_visitors_min: 20,
  fake_visitors_max: 70,
  variations: [
    {
      id: "color",
      name: "color",
      product_id: "prod-1",
      type: "image",
      props: [
        { id: "brown", name: "brown", variation_id: "color", value: "https://example.com/brown.webp" },
        { id: "black", name: "black", variation_id: "color", value: "https://example.com/black.webp" },
      ],
    },
    {
      id: "size",
      name: "size",
      product_id: "prod-1",
      type: "button",
      props: [
        { id: "38", name: "38", variation_id: "size" },
        { id: "40", name: "40", variation_id: "size" },
      ],
    },
  ],
  variants: [
    {
      id: "v-brown-38",
      product_id: "prod-1",
      price: 190,
      sale_price: 0,
      quantity: 4,
      variation_props: [
        { id: "1", variation: "color", variation_prop: "brown", product_variant_id: "v-brown-38" },
        { id: "2", variation: "size", variation_prop: "38", product_variant_id: "v-brown-38" },
      ],
    },
    {
      id: "v-brown-40",
      product_id: "prod-1",
      price: 210,
      sale_price: 180,
      quantity: 0,
      variation_props: [
        { id: "3", variation: "color", variation_prop: "brown", product_variant_id: "v-brown-40" },
        { id: "4", variation: "size", variation_prop: "40", product_variant_id: "v-brown-40" },
      ],
    },
    {
      id: "v-black-38",
      product_id: "prod-1",
      price: 190,
      sale_price: 0,
      quantity: 2,
      variation_props: [
        { id: "5", variation: "color", variation_prop: "black", product_variant_id: "v-black-38" },
        { id: "6", variation: "size", variation_prop: "38", product_variant_id: "v-black-38" },
      ],
    },
    {
      id: "v-black-40",
      product_id: "prod-1",
      price: 190,
      sale_price: 0,
      quantity: 2,
      variation_props: [
        { id: "7", variation: "color", variation_prop: "black", product_variant_id: "v-black-40" },
        { id: "8", variation: "size", variation_prop: "40", product_variant_id: "v-black-40" },
      ],
    },
  ],
  categories: [
    { id: "cat-1", name: "Mules", slug: "sneakers", show_in_header: true },
  ],
  reviews: [],
};
