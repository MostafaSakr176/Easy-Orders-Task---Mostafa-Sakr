# Easy Orders product page

Pixel-matched product detail page for the John Lewis layout, with live product data from the EasyOrders API. The page covers the gallery, variation selection, a persistent cart, reviews, and the related-product rails from the design.

## Setup

Requirements: Node.js 20 or newer.

```bash
npm install
cp .env.example .env
npm run dev
```

The dev server prints a local URL. The page loads this product:

`GET /api/v1/products/slug/clear-theme/Sneakers12?join=reviews`

Override the endpoint with:

| Variable | Default |
| --- | --- |
| `VITE_API_BASE_URL` | `https://api.easy-orders.net/api/v1` |
| `VITE_STORE_THEME` | `clear-theme` |
| `VITE_PRODUCT_SLUG` | `Sneakers12` |

```bash
npm test
npm run build
npm run preview
```

## Architecture

```
src/
  api/product.ts          fetch, cache key, response normalizer
  store/cartStore.ts      Zustand + Immer cart, persisted
  store/wishlistStore.ts  persisted wishlist
  store/uiStore.ts        cart drawer, toast, sign-in, currency
  lib/variants.ts         combination matching, stock, gallery
  lib/money.ts            currency and sale-price resolution
  components/product      gallery, buy box, page composition
  components/cart         slide-out cart and checkout step
  components/reviews      summary, filters, list
  components/layout       header, breadcrumbs, footer
  data/catalog.ts         design rails and review fallback
```

React Query fetches the product once and keeps it fresh for five minutes. Selection and quantity stay in the page. The cart, wishlist, and account chrome live in Zustand stores. Immer writes the cart and wishlist updates. `persist` writes them to `localStorage` under `easy-orders-cart` and `easy-orders-wishlist`.

A line is keyed by `productId:variantId`. Adding the same pair again increases quantity up to the stock cap (10 when the product does not track stock).

## Product behavior

- Gallery images come from `thumb`, `images`, and image variations. Hover zooms on a mouse, click opens a lightbox, and the arrow keys move between frames. Choosing a color jumps to that color’s image.
- A combination is disabled when stock is tracked, orders are blocked at zero, and that variant’s quantity is 0.
- The displayed price uses the variant sale price when it is set, otherwise the product sale price when it is lower than the list price.
- Currency is `custom_currency` when the API sends a 3-letter code, otherwise EGP.
- Add to cart requires every variation. Success shows a toast and updates the cart badge. Checkout Now adds the current selection and opens the cart in the checkout step.
- The joined `reviews` array is rendered when the API returns one. This product currently does not, so the reviews block uses the four reviews from the Figma frame and says so by rendering that designed list.

## Components

| Component | Role |
| --- | --- |
| `ProductPage` | Loads the product, owns selection, and wires cart actions |
| `ProductGallery` | Main image, thumbnails, zoom, share, wishlist |
| `ProductInfo` | Price, description, variations, quantity, calls to action |
| `QuantityStepper` | Min/max quantity used in the buy box and the cart |
| `CartDrawer` | Persistent drawer: edit, remove, subtotal, checkout, empty state |
| `ReviewsSection` | Rating chart, topic filters, helpful votes, pagination |
| `ProductRail` | Related Product and Popular this week |
| `SiteHeader` / `SiteFooter` | Store chrome, search, categories, newsletter |

## Deployment

`npm run build` emits a static `dist/` folder. Host it on any static host. The app is a single page, so serve `index.html` for `/`. Set the `VITE_*` variables at build time. The product API allows browser requests (`Access-Control-Allow-Origin: *`).

## Tests

Vitest covers variant pricing, cart actions, and the add-to-cart path through the drawer (including a sold-out size and removal back to the empty state).
