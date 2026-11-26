import iconStar from "../../assets/figma/icon-star.svg";
import { Icon } from "../shared/Icon";
import { QuantityStepper } from "../shared/QuantityStepper";
import { formatMoney } from "../../lib/money";
import { isOptionAvailable, stockLabel } from "../../lib/variants";
import { InfoDialog } from "./InfoDialog";
import { VariationOptions } from "./VariationOptions";
import { ReviewSummary } from "../reviews/ReviewSummary";
import { useProductInfo } from "../../hooks/useProductInfo";
import type { PriceQuote, Product, ProductReview, ProductVariant, Selection } from "../../types/product";

interface ProductInfoProps {
  product: Product;
  brand: string;
  selection: Selection;
  onSelect: (variation: string, option: string) => void;
  variant?: ProductVariant;
  price: PriceQuote;
  currency: string;
  quantity: number;
  maxQuantity: number;
  onQuantity: (value: number) => void;
  rating: number | null;
  reviewCount: number;
  latestReview?: ProductReview;
  compared: boolean;
  onCompare: () => void;
  onAdd: () => void;
  onCheckout: () => void;
  notice?: string;
}

export function ProductInfo({
  product,
  brand,
  selection,
  onSelect,
  variant,
  price,
  currency,
  quantity,
  maxQuantity,
  onQuantity,
  rating,
  reviewCount,
  latestReview,
  compared,
  onCompare,
  onAdd,
  onCheckout,
  notice,
}: ProductInfoProps) {
  const info = useProductInfo(product, variant);
  const { expanded, preview, purchasable, sizeVariation, sizeChart, deliveryOpen, html, canExpand } = info;

  return (
    <div className="w-full xl:w-[520px]">
      <p className="text-[16px] font-medium leading-[1.2] tracking-[0.16px] text-muted">{brand}</p>
      <h1 className="mt-3 text-[22px] font-semibold leading-[1.2] tracking-[-0.18px] text-title sm:text-[28px] xl:text-[36px]">
        {product.name}
      </h1>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-4">
          {price.onSale ? (
            <span className="text-[18px] font-medium leading-[1.2] text-[#666] line-through">
              {formatMoney(price.list, currency)}
            </span>
          ) : null}
          <span className="text-[22px] font-semibold leading-[1.2] text-ink sm:text-[28px]">{formatMoney(price.current, currency)}</span>
        </p>
        <p className="flex items-center gap-2 text-[#666]">
          <span className={`text-[14px] leading-none sm:text-[20px] ${purchasable ? "" : "text-[#9a3b32]"}`}>
            {stockLabel(product, variant)}
          </span>
          {rating !== null ? (
            <>
              <span className="size-1.5 rounded-full bg-[#666]" aria-hidden="true" />
              <span className="inline-flex items-center gap-1">
                <Icon src={iconStar} size={20} alt="" />
                <span className="text-[16px] font-semibold leading-none text-ink sm:text-[24px]">{rating.toFixed(1)}</span>
              </span>
            </>
          ) : null}
        </p>
      </div>
      {product.categories.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {product.categories.map((category) => (
            <li key={category.id} className="rounded-full bg-[#f2f2f2] px-3 py-1 text-xs font-medium text-[#525252]">
              {category.name}
            </li>
          ))}
        </ul>
      ) : null}
      {rating !== null ? <ReviewSummary rating={rating} count={reviewCount} latest={latestReview} /> : null}
      <hr className="mt-7 border-[#ececec]" />
      <div className="mt-7">
        <h2 className="font-[family-name:var(--font-label)] text-[20px] font-bold leading-[1.2] text-title">Description:</h2>
        {expanded ? (
          <div
            className="description-html mt-2.5 text-[16px] leading-[1.3] text-[#666]"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <p className="mt-2.5 text-[16px] leading-[1.3] text-[#666]">
            {preview}{" "}
            {canExpand ? (
              <button type="button" className="font-medium text-black" onClick={info.expand}>
                See More....
              </button>
            ) : null}
          </p>
        )}
        {expanded ? (
          <button type="button" className="mt-2 font-medium text-black" onClick={info.collapse}>
            See less
          </button>
        ) : null}
      </div>
      <div className="mt-10 space-y-10">
        {product.variations.map((variation) => {
          const selected = selection[variation.name];
          const isImage = variation.type === "image";
          return (
            <fieldset key={variation.id}>
              <legend className="flex w-full items-center justify-between gap-3 text-[16px] leading-[1.2] sm:text-[20px]">
                <span>
                  <span className="font-medium capitalize text-muted">{variation.name}: </span>
                  <span className="font-semibold capitalize text-title">{selected}</span>
                </span>
                {!isImage && sizeVariation?.id === variation.id ? (
                  <button type="button" className="text-[16px] font-medium text-[#525252] underline" onClick={info.openSizeChart}>
                    View Size Chart
                  </button>
                ) : null}
              </legend>
              <VariationOptions
                name={variation.name}
                image={isImage}
                selected={selected}
                onSelect={(option) => onSelect(variation.name, option)}
                options={variation.props.map((prop) => ({
                  id: prop.id,
                  name: prop.name,
                  value: prop.value,
                  available: isOptionAvailable(product, variation.name, prop.name, selection),
                }))}
              />
            </fieldset>
          );
        })}
      </div>
      {product.is_quantity_hidden ? null : (
        <div className="mt-10 flex items-center justify-between">
          <p className="text-[16px] font-medium text-muted sm:text-[20px]">
            Quantity: <span className="font-semibold text-title">{quantity}</span>
          </p>
          <QuantityStepper value={quantity} max={maxQuantity} onChange={onQuantity} />
        </div>
      )}
      {notice ? (
        <p role="alert" className="mt-4 text-sm text-[#9a3b32]">
          {notice}
        </p>
      ) : null}
      <div className="mt-8 flex flex-col gap-3 md:flex-row md:gap-6">
        <button
          type="button"
          onClick={onAdd}
          disabled={!purchasable}
          className="h-[52px] md:flex-1 rounded-lg bg-ink text-[18px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40 sm:h-[58px] sm:text-[20px] md:max-w-[296px]"
        >
          Add To Cart
        </button>
        <button
          type="button"
          onClick={onCheckout}
          disabled={!purchasable}
          className="h-[52px] md:flex-1 rounded-lg border border-[#b8b8b8] bg-white text-[18px] font-medium text-[#333] disabled:cursor-not-allowed disabled:opacity-40 sm:h-[58px] sm:text-[20px] md:max-w-[200px]"
        >
          Checkout Now
        </button>
      </div>
      <button type="button" className="mt-4 text-[16px] font-medium text-ink underline" onClick={onCompare}>
        {compared ? "Remove from compare" : "Add to compare"}
      </button>
      <button type="button" className="mx-4 mt-[38px] text-[16px] font-medium text-[#7a7a7a] underline" onClick={info.openDelivery}>
        Delivery T&C
      </button>
      {product.is_free_shipping ? <p className="mt-2 text-sm text-[#525252]">Free shipping on this item.</p> : null}
      {sizeChart ? (
        <InfoDialog title="Size chart" onClose={info.closeSizeChart}>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#e6e6e6]">
                <th className="py-2 font-semibold">EU</th>
                <th className="py-2 font-semibold">UK</th>
                <th className="py-2 font-semibold">Foot length</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["38", "5", "24.0 cm"],
                ["40", "6.5", "25.5 cm"],
                ["42", "8", "26.5 cm"],
              ].map((row) => (
                <tr key={row[0]} className="border-b border-[#f2f2f2]">
                  {row.map((cell) => (
                    <td key={cell} className="py-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </InfoDialog>
      ) : null}
      {deliveryOpen ? (
        <InfoDialog title="Delivery T&C" onClose={info.closeDelivery}>
          <div className="description-html text-sm leading-6 text-[#525252]" dangerouslySetInnerHTML={{ __html: html }} />
        </InfoDialog>
      ) : null}
    </div>
  );
}
