import type { CatalogCard } from "../../data/catalog";
import { ProductCard } from "./ProductCard";

interface ProductRailProps {
  id: string;
  title: string;
  products: CatalogCard[];
}

export function ProductRail({ id, title, products }: ProductRailProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="mx-auto max-w-[1200px] px-4 py-10 md:py-16 xl:px-0">
      <div className="flex items-end justify-between">
        <h2 id={`${id}-title`} className="text-[22px] font-semibold leading-[1.2] text-ink md:text-[28px]">
          {title}
        </h2>
        <a href={`#${id}`} className="text-[16px] font-medium text-[#525252] underline">
          View All
        </a>
      </div>
      <ul className="mt-6 grid grid-cols-2 items-stretch gap-x-4 gap-y-8 xl:flex xl:gap-[35px] xl:overflow-x-auto xl:pb-2">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} list={id} />
        ))}
      </ul>
    </section>
  );
}
