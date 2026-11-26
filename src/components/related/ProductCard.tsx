import { memo } from "react";
import iconStar from "../../assets/figma/icon-star.svg";
import iconHeart from "../../assets/figma/icon-heart.svg";
import iconHeartFilled from "../../assets/figma/icon-heart-filled.svg";
import { Icon } from "../shared/Icon";
import { useCatalogCard } from "../../hooks/useCatalogCard";
import type { CatalogCard } from "../../data/catalog";

export const ProductCard = memo(function ProductCard({ product, list }: { product: CatalogCard; list: string }) {
  const card = useCatalogCard(product, list);
  return (
    <li id={product.id} className="group flex min-w-0 xl:w-[212px] xl:shrink-0">
      <div className="flex h-full w-full flex-col">
        <div className="relative">
          <a href="#product" onClick={card.select} className="block aspect-[3/4] overflow-hidden rounded-lg bg-[#f2f2f2] xl:aspect-auto xl:h-[284px]">
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-110"
            />
          </a>
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            <button
              type="button"
              aria-label={`${card.wished ? "Remove" : "Save"} ${product.name} ${card.wished ? "from" : "to"} wishlist`}
              aria-pressed={card.wished}
              onClick={card.toggleWishlist}
              className="grid size-9 place-items-center rounded-lg bg-white shadow-sm"
            >
              <Icon src={card.wished ? iconHeartFilled : iconHeart} size={16} />
            </button>
            <button
              type="button"
              aria-pressed={card.compared}
              aria-label={`${card.compared ? "Remove" : "Add"} ${product.name} ${card.compared ? "from" : "to"} compare`}
              onClick={card.toggleCompare}
              className={`grid size-9 place-items-center rounded-lg text-xs font-semibold shadow-sm ${card.compared ? "bg-ink text-white" : "bg-white text-ink"}`}
            >
              vs
            </button>
          </div>
        </div>
        <a href="#product" onClick={card.select} className="mt-3 text-[15px] font-semibold leading-[1.3] tracking-[-0.2px] text-title xl:mt-4 xl:text-[18px] xl:leading-[1.4]">
          {product.brand}
        </a>
        <p className="mt-1 text-[16px] font-semibold leading-[1.3] tracking-[-0.2px] text-ink xl:mt-1.5 xl:text-[20px] xl:leading-[1.4]">{product.price}</p>
        <p className="mt-1 text-[13px] leading-[1.3] text-[#7a7a7a] xl:mt-1.5 xl:text-[16px] xl:leading-[1.2]">{product.name}</p>
        <p className="mt-auto flex items-center gap-2 pt-2 text-[16px] leading-[1.6]">
          <Icon src={iconStar} size={24} alt="" />
          <span className="text-[#0b0f0e]">{product.rating}</span>
          <span className="size-1 rounded-full bg-[#666]" aria-hidden="true" />
          <span className="text-[#666]">{product.sold}</span>
        </p>
      </div>
    </li>
  );
});
