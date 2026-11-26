import { useDisplayMoney } from "../../hooks/useDisplayMoney";
import { popularProducts } from "../../data/catalog";
import { useProductPage } from "../../hooks/useProductPage";
import { PageSkeleton } from "./PageSkeleton";
import { Toast } from "../shared/Toast";
import { SiteHeader } from "../layout/SiteHeader";
import { SiteFooter } from "../layout/SiteFooter";
import { Breadcrumbs } from "../layout/Breadcrumbs";
import { ProductGallery } from "./ProductGallery";
import { ProductInfo } from "./ProductInfo";
import { ProductRail } from "../related/ProductRail";
import { ReviewsSection } from "../reviews/ReviewsSection";
import { CartDrawer } from "../cart/CartDrawer";
import { SignInDialog } from "../account/SignInDialog";
import { WishlistDrawer } from "../wishlist/WishlistDrawer";
import { CompareBar } from "../compare/CompareBar";
import { CompareDialog } from "../compare/CompareDialog";
export function ProductPage() {
  const page = useProductPage();
  const displayMoney = useDisplayMoney();
  if (page.status === "pending") return <PageSkeleton />;
  if (page.status === "error") {
    return (
      <main className="grid min-h-screen place-items-center px-6 text-center">
        <div>
          <h1 className="text-3xl font-semibold">We couldn’t load this product</h1>
          <p className="mt-2 text-[#666]">{page.message}</p>
          <button type="button" className="mt-6 h-12 rounded-lg bg-ink px-6 text-white" onClick={page.retry}>
            Retry
          </button>
        </div>
      </main>
    );
  }

  const {
    product,
    price,
    currency,
    images,
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
    brand,
    activeSrc,
    selectOption,
    setQuantity,
    addCurrent,
    checkout,
    toggleWishlist,
    toggleCompare,
  } = page;

  return (
    <div className={`min-h-screen bg-white ${product.is_fixed_bottom_buy ? "pb-24 xl:pb-0" : ""}`}>
      <a href="#product" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:px-3 focus:py-2">
        Skip to product
      </a>
      <a href="#related" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-16 focus:z-50 focus:bg-white focus:px-3 focus:py-2">
        Skip to recommendations
      </a>
      <a href="#reviews" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-28 focus:z-50 focus:bg-white focus:px-3 focus:py-2">
        Skip to reviews
      </a>
      <SiteHeader categories={product.categories} />
      <Breadcrumbs categories={product.categories} productName={product.name} />
      <main id="product" className="mx-auto flex max-w-[1200px] flex-col gap-8 px-4 pb-12 lg:flex-row lg:items-start xl:gap-[135px] lg:pb-16">
        <ProductGallery
          images={images}
          name={product.name}
          activeSrc={activeSrc}
          wished={wished}
          onToggleWish={toggleWishlist}
        />
        <ProductInfo
          product={product}
          brand={brand}
          selection={page.selection}
          onSelect={selectOption}
          variant={variant}
          price={price}
          currency={currency}
          quantity={quantity}
          maxQuantity={limit}
          onQuantity={setQuantity}
          rating={rating}
          reviewCount={reviewSource.length}
          latestReview={reviewSource[0]}
          compared={compared}
          onCompare={toggleCompare}
          notice={notice}
          onAdd={addCurrent}
          onCheckout={checkout}
        />
      </main>
      {product.hide_related_products ? null : (
        <>
          <div className="mx-auto max-w-[1200px] border-t border-dashed border-[#A3A3A3]" />
          <ProductRail id="related" title="Related Product" products={recommendations} />
        </>
      )}
      <div className="mx-auto max-w-[1200px] border-t border-dashed border-[#A3A3A3]" />
      <ReviewsSection reviews={reviewSource} />
      <div className="mx-auto max-w-[1200px] border-t border-dashed border-[#A3A3A3]" />
      <ProductRail id="popular" title="Popular this week" products={popularProducts} />
      <SiteFooter />
      <CartDrawer />
      <WishlistDrawer activeProductId={product.id} onAddActive={addCurrent} />
      <CompareBar raised={product.is_fixed_bottom_buy} />
      <CompareDialog />
      <SignInDialog />
      <Toast />
      {product.is_fixed_bottom_buy ? (
        <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t border-[#ececec] bg-white px-4 py-3 xl:hidden">
          <div>
            <p className="text-xs text-muted">{count} in cart</p>
            <p className="text-lg font-semibold">{displayMoney(price.current, currency)}</p>
          </div>
          <button type="button" className="h-12 rounded-lg bg-ink px-5 font-semibold text-white" onClick={addCurrent}>
            Add To Cart
          </button>
        </div>
      ) : null}
    </div>
  );
}
