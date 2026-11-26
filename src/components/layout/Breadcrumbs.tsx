import iconArrow from "../../assets/figma/icon-arrow-right.svg";
import { Icon } from "../shared/Icon";
import type { Category } from "../../types/product";

interface BreadcrumbsProps {
  categories: Category[];
  productName: string;
}

export function Breadcrumbs({ categories, productName }: BreadcrumbsProps) {
  const crumbs = ["Homepage", ...categories.slice(0, 2).map((category) => category.name), productName];

  return (
    <nav aria-label="Breadcrumb" className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-2 gap-y-1 px-4 py-4 text-[13px] font-medium leading-[1.5] md:py-7 md:text-[16px] md:leading-[1.6] xl:px-0">
      {crumbs.map((crumb, index) => {
        const last = index === crumbs.length - 1;
        return (
          <span key={`${crumb}-${index}`} className="inline-flex items-center gap-2">
            {index > 0 ? <Icon src={iconArrow} size={12} /> : null}
            {last ? (
              <span className="text-title" aria-current="page">
                {crumb}
              </span>
            ) : (
              <a href="#product" className="text-muted">
                {crumb}
              </a>
            )}
          </span>
        );
      })}
    </nav>
  );
}
