import iconStar from "../../assets/figma/icon-star.svg";
import { Icon } from "../shared/Icon";
import { track } from "../../lib/analytics";
import type { ProductReview } from "../../types/product";

interface ReviewSummaryProps {
  rating: number;
  count: number;
  latest?: ProductReview;
}

export function ReviewSummary({ rating, count, latest }: ReviewSummaryProps) {
  return (
    <div className="mt-6 rounded-lg bg-[#f7f7f7] px-4 py-4">
      <div className="flex items-center justify-between gap-3">
        <p className="inline-flex items-center gap-2">
          <Icon src={iconStar} size={20} alt="" />
          <span className="text-lg font-semibold text-ink">{rating.toFixed(1)}</span>
          <span className="text-sm text-[#666]">from {count.toLocaleString("en-US")} reviews</span>
        </p>
        <a href="#reviews" className="text-sm font-medium text-ink underline" onClick={() => track("view_reviews", { count })}>
          Read all reviews
        </a>
      </div>
      {latest ? (
        <blockquote className="mt-3 border-l-2 border-ink pl-3 text-sm leading-6 text-[#525252]">
          <p>{latest.title}</p>
          <footer className="mt-1 text-xs text-[#7a7a7a]">{latest.author}</footer>
        </blockquote>
      ) : null}
    </div>
  );
}
