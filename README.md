# Easy Orders product page

A product detail page for the Achilles Pro sneaker. The layout follows the John Lewis desktop frame and the mobile product frame. Product data comes from the EasyOrders API. Related products, the popular rail, and the review list fall back to local design data when the API does not supply them.

The page includes a gallery, variation selection, a persistent cart, a wishlist, product comparison, reviews, recommendations, sharing, keyboard support, analytics, and an installable web app.

## Stack

| Piece | Choice |
| --- | --- |
| UI | React 19, TypeScript strict |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 |
| Server state | TanStack Query |
| Client state | Zustand 5 with Immer |
| Gallery | Swiper 14 |
| Tests | Vitest, Testing Library, jsdom |

Node.js 20 or newer is required. There are no path aliases. Imports are relative.

## Setup

```bash
npm install
```

Create a local env file:

```bash
# macOS and Linux
cp .env.example .env

# Windows
copy .env.example .env
```

Start the dev server:

```bash
npm run dev
```

Vite prints a local URL, usually `http://127.0.0.1:5173/`. The page requests:

`GET /api/v1/products/slug/clear-theme/Sneakers12?join=reviews`

Other scripts:

| Script | What it does |
| --- | --- |
| `npm test` | Type-free unit and component tests, one run |
| `npm run test:watch` | The same tests, watching for file changes |
| `npm run build` | Typecheck with `tsc -p tsconfig.app.json --noEmit`, then a production Vite build |
| `npm run preview` | Serve the built `dist/` folder |

## Environment

All three variables are optional. Defaults match the task product.

| Variable | Default | Role |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `https://api.easy-orders.net/api/v1` | API origin and version prefix |
| `VITE_STORE_THEME` | `clear-theme` | Theme segment in the product URL |
| `VITE_PRODUCT_SLUG` | `Sneakers12` | Product slug |

Vite inlines `VITE_*` values at build time. Change them before `npm run build` when the hosted product should differ from the defaults. The product API sends `Access-Control-Allow-Origin: *`, so the browser can call it directly.

## Architecture

```
src/
  api/product.ts            fetch, 12s timeout, cache key, nested-field normalizer
  hooks/                    page, cart, gallery, reviews, search, money, install
  store/cartStore.ts        cart lines, persisted
  store/wishlistStore.ts    saved products, persisted
  store/compareStore.ts     comparison list, three items at most, persisted
  store/uiStore.ts          drawers, toast, sign-in, display currency and language
  lib/variants.ts           combination matching, stock, gallery sources
  lib/money.ts              currency code, sale price, display conversion
  lib/html.ts               description sanitizer
  lib/recommendations.ts    related-product scoring
  lib/share.ts              share intent URLs
  lib/analytics.ts          in-memory log, sessionStorage, dataLayer
  components/product        gallery, buy box, page composition
  components/cart           slide-out cart and checkout step
  components/reviews        summary, filters, list
  components/compare        comparison bar and dialog
  components/wishlist       wishlist drawer
  components/layout         header, promo bar, footer, search, policy dialog
  components/pwa            install popup
  components/shared         Icon and QuantityStepper
  data/catalog.ts           design rails and the review fallback
  types/product.ts          API shapes used by the page
public/
  sw.js                     service worker
  manifest.webmanifest      install metadata
  icons/                    192, 512, and maskable icons
```

`App` renders `ProductPage` and `InstallApp`. `InstallApp` stays mounted so the browser install event is registered even while the popup is closed.

Screen components stay in their feature folders. Logic lives in `src/hooks`. `Icon` and `QuantityStepper` live in `src/components/shared` because more than one feature uses them.

React Query loads the product once and treats it as fresh for five minutes. Window-focus refetch is off, and a failed query retries once. The request aborts after 12 seconds with the message `The product request timed out.` A non-OK response throws `Could not load the product (${status}).` The page shows that message with a retry button.

Selection and quantity stay in `useProductPage`. They are not written to storage. Cart, wishlist, comparison, currency, language, and the signed-in name are the pieces that survive a reload.

## Product data

`normalizeProduct` accepts an unknown payload and returns a `Product`. Nested records are checked field by field. A variation needs a name. A variation option needs a name. A variant needs an id, and each of its `variation_props` needs both `variation` and `variation_prop`. A category needs a name. Anything else in those arrays is dropped. Reviews still go through `normalizeReview`: the rating is clamped to 1–5, and a review with no usable text is dropped. If the payload has no id, the slug is used, then the literal `product`.

Descriptions are HTML. `sanitizeHtml` parses them with `DOMParser` and keeps only `a`, `b`, `br`, `div`, `em`, `h1`–`h4`, `i`, `li`, `ol`, `p`, `span`, `strong`, and `ul`. Event-handler attributes, `style`, and `javascript:` links are removed. Links get `rel="noreferrer"` and `target="_blank"`. If `DOMParser` is missing, a string fallback strips `script`, `style`, event handlers, and `javascript:`.

## Price and currency

The product currency is `custom_currency` when that value is a 3-letter code. Otherwise it is EGP.

`resolvePrice` picks the amount:

1. The variant list price wins when it is greater than 0. Otherwise the product list price is used.
2. A variant `sale_price` greater than 0 wins. Otherwise the product `sale_price` is used when it is greater than 0.
3. The sale price is shown only when it is lower than the list price.

The footer select changes the display currency among EGP, USD, and GBP. Stored line prices stay in the currency they were added in. `convertMoney` converts for display with this fixed table, expressed as how many EGP one unit is worth:

| Code | EGP per 1 unit |
| --- | --- |
| EGP | 1 |
| USD | 49 |
| GBP | 62 |

An unknown code is left unchanged. The result is rounded to two decimal places. `formatMoney` uses `Intl` with zero fraction digits for whole amounts and two digits otherwise. The default display currency is EGP. A currency already saved in this browser is kept.

Catalog cards on the related and popular rails keep their designed dollar labels. The live product, the cart, the wishlist, and the comparison dialog follow the selected currency.

## Variations, stock, and the cart

Every variation must be selected before Add to cart or Checkout Now. The page starts from `defaultSelection`, which picks the first option that can still be purchased.

A combination is unavailable only when all three are true: `track_stock` is true, `disable_orders_for_no_stock` is true, and that variant’s quantity is 0 or less. The live sneaker does not track stock, so every color and size can be bought. The test fixture tracks stock and marks brown / 40 as sold out until black is selected.

Quantity starts at 1. The upper bound is the tracked stock when `track_stock` is true, and 10 when it is not. If `is_quantity_hidden` is true, the maximum is 1.

A cart line id is `${productId}:${variantId}`. Adding the same pair again increases quantity up to `maxQuantity` and refreshes the price and image. `setQuantity` clamps between 1 and that maximum.

Add to cart shows an “Added to cart” toast. The toast offers View cart and clears itself after 2.8 seconds. Checkout Now adds the current selection and opens the cart on the checkout step. The checkout form records a `purchase` event, clears the cart, and shows “Order placed”. It does not call a payment API.

When `is_fixed_bottom_buy` is true, a sticky buy bar stays at the bottom of the viewport and the comparison bar sits above it.

## Gallery

Images come from `thumb`, `images`, and image-type variation values. Swiper drives the main slide, the thumbnails, and the lightbox. The main slider uses `spaceBetween={16}` and does not receive a Swiper `breakpoints` map, because that map calls `matchMedia` and the jsdom tests do not provide it. Keyboard control is limited to the slider while it is in view. There is no loop.

Choosing a color moves the gallery to that color’s image. A manual swipe or thumbnail click is left alone until the selected color actually changes.

On large screens the gallery column is `lg:sticky lg:top-6`. It stays in view while the buy box is taller, and it releases when the product section ends so the full-width rails are not covered. An ancestor with `overflow` other than `visible` would break that stickiness.

Hover zooms the image on a fine pointer. Click opens the lightbox. Arrow keys move between frames there.

## Wishlist

The heart on the gallery and on each product card toggles a wish. The filled heart is a second SVG, because the outline icon is an image and CSS `fill` cannot change it. The header heart stays an outline and shows a count badge.

`WishItem` stores `productId`, `name`, `image`, `price`, and `currency`. The drawer lists those items. From the current product’s row, Move to cart runs the same add path as the buy box and closes the drawer.

## Comparison

Compare holds at most three products. The fourth add is rejected with a toast. The bar button is named “Compare products” so it does not collide with “Add to compare”.

Each saved item keeps a `priceLabel` plus numeric `amount` and `currency` when they are known. The dialog formats `amount` in the selected display currency. Older saved rows that only have `priceLabel` keep that label.

The bar is fixed. It uses `bottom-[4.75rem]` while the sticky buy bar is on, and `bottom-4` otherwise.

## Recommendations, search, and reviews

`recommendProducts` scores the local catalog against the live product:

- token overlap on name, brand, and categories, weighted by 4
- `ratingValue * 2`
- a small score that shrinks as the catalog price moves away from the product price

The related rail uses that order, five cards. Popular this week stays in the design order. Card images scale to 1.1 on hover. The rating row is pinned to the bottom of the stretched card.

Search matches the catalog and links to `#${card.id}` on the matching card. Arrow keys move through the results.

If `join=reviews` returns reviews, those are shown. This product currently returns none, so the reviews block uses the four designed reviews. Chips are All Reviews, With Photo & Video, and With Description. Rating and topic filters combine with the chip. The list pages four reviews at a time. Helpful votes update the count on the client. “Read all reviews” scrolls to `#reviews`.

## Sharing

The gallery share menu opens Facebook, WhatsApp, Pinterest, and X with intent URLs from `shareUrl`. Copy link writes the page URL to the clipboard. When `navigator.share` exists, Share… uses the native sheet. Arrow keys move inside the menu. Escape closes it.

## Promo bar

A black bar at the top reads “New season coming! Discount 10% for all product! Checkout Now!” The countdown starts at 20:40 and ticks down once per second for the life of the page. It is not persisted. Checkout Now opens the cart.

## Keyboard and focus

- Skip links jump to the product, the recommendations (`#related`), and the reviews.
- Variation groups use a roving tabindex. Arrow keys, Home, and End move among options that can be purchased and focus `[data-option]`.
- Review chips are a toolbar with the same arrow, Home, and End behavior.
- Search results and the share menu move with the arrow keys.
- Focus is trapped in the cart, wishlist, comparison, sign-in, search, info, install, mobile menu, policy, and review-filter sheet. Tab wraps inside the open surface. Escape closes it. Focus returns to the control that opened the surface.
- Closed drawers stay in the document with `pointer-events-none`, `aria-hidden`, and `inert`, so they do not take clicks or focus.

`matchMedia` and `CSS.escape` are guarded because jsdom does not provide them.

## Analytics

`track(event, payload)` appends a record to an in-memory log capped at 50. Each call also:

- writes the log to `sessionStorage` under `easy-orders-analytics`
- pushes `{ event, ...payload }` onto `window.dataLayer`, creating the array if needed
- logs through `console.info` in development
- dispatches a `CustomEvent` named `eo-analytics`

`getAnalyticsLog` and `clearAnalytics` are exported for tests. There is no third-party analytics script.

| Event | When |
| --- | --- |
| `view_item` | The product finishes loading |
| `view_item_list` | The recommended rail is shown |
| `select_variant` | A color or size changes |
| `select_recommendation` | A catalog card is chosen |
| `add_to_cart` | A line is added |
| `remove_from_cart` | A line is removed |
| `begin_checkout` | Checkout Now or the cart checkout step starts |
| `purchase` | The checkout form is submitted |
| `add_to_wishlist` / `remove_from_wishlist` | A heart toggles |
| `view_wishlist` | The wishlist opens from the header or footer |
| `add_to_compare` / `remove_from_compare` | A product enters or leaves the comparison |
| `view_compare` | The comparison dialog opens |
| `clear_compare` | Clear comparison is used |
| `share` | A share channel is used |
| `view_reviews` | Read all reviews is used |
| `filter_reviews` | A rating, topic, or chip changes |
| `review_helpful` | A helpful vote is toggled |
| `search` | A search result is chosen |
| `newsletter_signup` | The footer form is submitted with an address that contains `@` |

## Installable app

`index.html` links `manifest.webmanifest` and the Apple web-app tags. Icons are `public/icons/icon-192.png`, `icon-512.png`, and `icon-maskable-512.png`. Display is `standalone`. Theme color is `#141414`.

On the first visit, and only when the page is not already running standalone, the install popup opens by itself. Closing it with Close, the backdrop, or Escape writes `easy-orders-install-seen` to `localStorage`. Later visits do not open it automatically. The Install control in the header and the mobile menu still opens it.

The popup offers one choice for the current device. A phone sees Mobile app. A computer sees Desktop app. A phone is detected from an iOS or Android user agent, or from a coarse pointer and a viewport at most 1024px wide. iOS never receives `beforeinstallprompt`, so the popup explains Safari’s Share, then Add to Home Screen path. On other devices, a captured `beforeinstallprompt` calls `prompt()`. If the browser has not offered install yet, the popup explains the address-bar install icon in Chrome or Edge.

`main.tsx` registers `/sw.js` on `window` `load` in every environment, including localhost, so the origin can be installable. The worker calls `skipWaiting` and `clients.claim`. Its cache name is `easy-orders-v1`. On `localhost` and `127.0.0.1` the fetch handler is network-only, so Vite hot reload is not served from cache. Elsewhere it is network-first, then cache, and a failed navigation falls back to `/`. Cross-origin requests, including the product API, are not intercepted.

## Layout notes

- The desktop gallery and buy box follow the wide John Lewis frame. Below the `xl` breakpoint the page follows the mobile frame: stacked gallery, buy box, and rails.
- The mobile menu uses the same drawer motion as the cart: a dimmed backdrop and a panel that slides in from the right, up to 420px wide. On a 390px screen the panel is full width.
- Footer policy links open `PolicyDialog` with a short explanation. Shop links open the wishlist, cart, or sign-in dialog. Social links leave the site.
- The language control toggles the label between English and العربية. It does not translate the page.
- Sign-in stores a name and email in the UI store. It does not call an account API.

## State and browser storage

Immer writes the cart, wishlist, comparison, and UI updates. `persist` saves only the data fields. `hydrated` starts false and becomes true when the saved list is merged back, including when storage is empty. Badges and drawers wait for that flag, so a saved cart is not treated as empty during the first paint. With `localStorage` the merge finishes before the first React render.

| Key | Storage | Contents |
| --- | --- | --- |
| `easy-orders-cart` | localStorage | Cart `items` only. Version 1. |
| `easy-orders-wishlist` | localStorage | Wishlist `items` only. Version 1. |
| `easy-orders-compare` | localStorage | Comparison `items` only. Version 1. |
| `easy-orders-ui` | localStorage | `currency`, `language`, and `user`. Drawers, the toast, and the install popup are not saved. |
| `easy-orders-install-seen` | localStorage | `"1"` after the install popup is dismissed. |
| `easy-orders-analytics` | sessionStorage | The current analytics log. |

## Hooks

| Hook | Responsibility |
| --- | --- |
| `useProductPage` | Query, selection, quantity, wishlist and compare actions, recommendations |
| `useProductInfo` | Description toggle and stock label for the buy box |
| `useProductGallery` | Slides, lightbox, zoom, share menu |
| `useDisplayMoney` | Format an amount in the selected display currency |
| `useCartDrawer` | Cart lines, converted subtotal, checkout |
| `useWishlistDrawer` | Wishlist list and move-to-cart |
| `useCompare` | Comparison dialog, limit toast, clear |
| `useCatalogCard` | Card wishlist, compare, and recommendation click |
| `useReviews` | Filters, paging, helpful votes |
| `useVariationGroup` | Roving tabindex for a variation |
| `useFocusTrap` | Tab cycle and focus restore for a dialog |
| `useCatalogSearch` | Search query and result arrow keys |
| `useSiteHeader` | Menu, badges, cart, wishlist, install |
| `useSiteFooter` | Newsletter, currency, language, policy dialog |
| `usePromoCountdown` | 20:40 offer timer |
| `useQuantityStep` | Shared stepper bounds |
| `useSignIn` | Name and email form |
| `useInstallApp` | Install prompt, first-run popup, dismiss flag |

## Components

| Component | Role |
| --- | --- |
| `ProductPage` | Composes the page from the ready, pending, and error states |
| `ProductGallery` | Main image, thumbnails, zoom, lightbox, share, wishlist |
| `ProductInfo` | Price, description, variations, quantity, calls to action |
| `VariationOptions` | Color and size groups |
| `QuantityStepper` | Min and max quantity in the buy box and the cart |
| `CartDrawer` | Edit, remove, subtotal, checkout, empty and loading states |
| `WishlistDrawer` | Saved products |
| `CompareBar` / `CompareDialog` | The comparison tray and the side-by-side dialog |
| `ReviewsSection` | Chart, filters, list, pagination |
| `ReviewSummary` | Average, count, and the latest review near the price |
| `ProductRail` / `ProductCard` | Related Product and Popular this week |
| `SiteHeader` / `SiteFooter` | Store chrome, search, categories, newsletter, policies |
| `PromoBar` | Announcement and countdown |
| `SearchDialog` | Catalog search |
| `PolicyDialog` | Short policy copy |
| `InstallApp` | Device-specific install popup |
| `SignInDialog` | Local name and email |
| `Toast` | Confirmation after add to cart and other actions |
| `Icon` | Shared SVG image |

## Tests

`npm test` runs Vitest in jsdom. The suite covers:

| File | What it checks |
| --- | --- |
| `src/lib/variants.test.ts` | Purchasable combinations, matching, gallery sources, quantity cap |
| `src/store/cartStore.test.ts` | Merge on repeat add, stock cap, quantity edit, removal |
| `src/store/wishlistStore.test.ts` | Toggle in and out |
| `src/store/compareStore.test.ts` | The three-item limit |
| `src/lib/recommendations.test.ts` | Sneaker tokens rank above an unrelated product |
| `src/lib/analytics.test.ts` | `dataLayer` and `sessionStorage` |
| `src/lib/share.test.ts` | Facebook, WhatsApp, and copy |
| `src/lib/money.test.ts` | Same-currency amounts, EGP to USD, unknown codes |
| `src/lib/html.test.ts` | Allowed markup kept, script and event handlers removed |
| `src/api/product.test.ts` | Invalid nested variations, variants, categories, and review ratings |
| `src/hooks/useReviews.test.tsx` | Photo chip and rating filter |
| `src/components/product/ProductPage.test.tsx` | Load, sold-out size, add, quantity, remove, wishlist, compare, and size arrow keys |

The product-page test uses `src/test/fixture.ts`. That sneaker has colors brown and black and sizes 38 and 40. Brown / 40 has quantity 0. Prices are asserted as `EGP 160`. Add to cart is the first button of that name because the sticky bar repeats it. The two product-page tests allow 15 seconds.

The service worker and the fetch timeout path are not covered by the suite.

## Deployment

`npm run build` writes a static `dist/` folder. Host it on any static host. The app is one page, so unknown paths should serve `index.html`. Set the `VITE_*` variables in the build environment.

The service worker is part of that build because it lives in `public/`. A production host should be HTTPS. Chrome and Edge use that, plus the manifest and the registered worker, to offer install. iOS uses Safari’s Add to Home Screen flow instead.

## Fonts and color

The page uses Clash Grotesk and Raleway. Recurring colors are ink `#141414`, title `#292929`, muted `#8f8f8f`, body `#666`, soft background `#f2f2f2`, star `#FFA439`, and grey `#818b9c`.
