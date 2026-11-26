import iconStar from "../../assets/figma/icon-star.svg";
import iconLike from "../../assets/figma/icon-like.svg";
import iconDislike from "../../assets/figma/icon-dislike.svg";
import iconChevron from "../../assets/figma/icon-chevron.svg";
import { Icon } from "../shared/Icon";
import type { ProductReview } from "../../types/product";
import { FilterGroups } from "./FilterGroups";
import iconFilter from "../../assets/figma/icon-filter.svg";
import { useRef } from "react";
import { reviewFilters, useReviews } from "../../hooks/useReviews";
import { useFocusTrap } from "../../hooks/useFocusTrap";

interface ReviewsSectionProps {
  reviews: ProductReview[];
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const reviewState = useReviews(reviews);
  const {
    source,
    average,
    buckets,
    maxBucket,
    ratings,
    topics,
    chip,
    selectChip,
    onChipKeyDown,
    chipTabIndex,
    visible,
    pageCount,
    currentPage,
    setPage,
    nextPage,
    likes,
    like,
    filtersOpen,
    openFilters,
    closeFilters,
    openGroups,
    toggleGroup,
    toggleRating,
    toggleTopic,
  } = reviewState;
  const filterPanel = useRef<HTMLDivElement>(null);
  useFocusTrap(filtersOpen, filterPanel);

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="mx-auto max-w-[1200px] px-4 py-10 md:py-16 xl:px-0">
      <h2 id="reviews-title" className="text-[22px] font-semibold leading-[1.2] text-ink md:text-[28px]">
        Product Reviews
      </h2>
      <div className="mt-4 flex flex-col gap-8 rounded-lg border border-dashed border-[#B8B8B8] p-6 lg:flex-row lg:items-center">
        <div className="flex items-center gap-4">
          <div
            className="grid size-[84px] place-items-center rounded-full"
            style={{ background: `conic-gradient(#ffa439 ${(average / 5) * 100}%, #e4e9ee 0)` }}
            aria-hidden="true"
          >
            <div className="grid size-[74px] place-items-center rounded-full bg-white text-[20px] font-semibold leading-[1.4] text-[#0b0f0e]">
              {average.toFixed(1)}
            </div>
          </div>
          <div>
            <div className="flex gap-1">
              {Array.from({ length: 5 }, (_, index) => (
                <Icon key={index} src={iconStar} size={20} alt="" />
              ))}
            </div>
            <p className="mt-2 text-[16px] leading-[1.6] text-[#525252]">from {source.length.toLocaleString("en-US")} reviews</p>
          </div>
        </div>
        <ul className="flex-1 space-y-3">
          {buckets.map((count, index) => (
            <li key={5 - index} className="flex items-center gap-4 text-[16px] font-medium leading-[1.6] text-[#0b0f0e]">
              <span className="inline-flex w-12 items-center gap-1">
                {(5 - index).toFixed(1)}
                <Icon src={iconStar} size={20} alt="" />
              </span>
              <span className="relative h-2 flex-1 rounded-full bg-[#e4e9ee]">
                <span className="absolute inset-y-0 left-0 rounded-full bg-[#292929]" style={{ width: `${(count / maxBucket) * 100}%` }} />
              </span>
              <span className="w-10 text-right">{count}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-8 grid gap-10 lg:grid-cols-[278px_1fr]">
        <aside className="hidden h-fit rounded-lg border border-dashed border-[#B8B8B8] p-6 lg:block">
          <h3 className="text-[20px] font-semibold leading-[1.4] tracking-[-0.2px] text-title">Reviews Filter</h3>
          <hr className="my-4 border-dashed border-[#A3A3A3]" />
          <FilterGroups
            ratings={ratings}
            topics={topics}
            openGroups={openGroups}
            onToggleRating={toggleRating}
            onToggleTopic={toggleTopic}
            onToggleGroup={toggleGroup}
          />
        </aside>
        <div>
          <h3 className="text-[20px] font-semibold text-title">Review Lists</h3>
          <div className="mt-4 flex items-start gap-3">
            <div className="flex flex-1 flex-wrap gap-3" role="toolbar" aria-label="Review list filters">
            {reviewFilters.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={chip === item}
                tabIndex={chipTabIndex(item)}
                onKeyDown={onChipKeyDown}
                onClick={() => selectChip(item)}
                className={`rounded-lg px-4 py-2.5 text-sm font-medium ${
                  chip === item ? "border border-[#333] bg-[#ebebeb] text-ink" : "border border-[#e6e6e6] text-ink"
                }`}
              >
                {item}
              </button>
            ))}
            </div>
            <button
              type="button"
              className="grid size-10 shrink-0 place-items-center rounded-lg border border-[#e6e6e6] lg:hidden"
              aria-label="Reviews filter"
              aria-expanded={filtersOpen}
              onClick={openFilters}
            >
              <Icon src={iconFilter} size={18} alt="" />
            </button>
          </div>
          {filtersOpen ? (
            <div className="fixed inset-0 z-50 bg-black/40 lg:hidden" role="presentation" onClick={closeFilters}>
              <div
                ref={filterPanel}
                role="dialog"
                aria-modal="true"
                aria-label="Reviews Filter"
                className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-auto rounded-t-2xl bg-white p-6"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-[20px] font-semibold text-title">Reviews Filter</h3>
                  <button type="button" className="text-sm underline" onClick={closeFilters}>
                    Close
                  </button>
                </div>
                <FilterGroups
                  ratings={ratings}
                  topics={topics}
                  openGroups={openGroups}
                  onToggleRating={toggleRating}
                  onToggleTopic={toggleTopic}
                  onToggleGroup={toggleGroup}
                />
              </div>
            </div>
          ) : null}
          {visible.length === 0 ? (
            <p className="mt-10 text-[#666]">No reviews match these filters.</p>
          ) : (
            <ul className="mt-8">
              {visible.map((review) => (
                <li key={review.id} className="flex items-end justify-between gap-3 border-b border-dashed border-[#A3A3A3] py-6">
                  <div>
                    <div className="flex gap-1" aria-label={`${review.rating} out of 5 stars`}>
                      {Array.from({ length: 5 }, (_, index) => (
                        <span key={index} className={index < review.rating ? "" : "opacity-25"}>
                          <Icon src={iconStar} size={20} alt="" />
                        </span>
                      ))}
                    </div>
                    <p className="mt-4 text-[18px] font-semibold leading-[1.4] tracking-[-0.2px] text-ink">{review.title}</p>
                    <p className="mt-1 text-[16px] leading-[1.6] text-grey">
                      {new Date(review.createdAt).toLocaleString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="mt-6 flex items-center gap-3 text-[16px] font-medium text-[#0b0f0e]">
                      {review.avatar ? (
                        <img src={review.avatar} alt="" className="size-8 rounded-full object-cover" />
                      ) : (
                        <span className="grid size-8 place-items-center rounded-full bg-[#f2f2f2] text-xs">
                          {review.author.slice(0, 1)}
                        </span>
                      )}
                      {review.author}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2 sm:gap-4">
                    <button
                      type="button"
                      className="inline-flex h-10 min-w-16 items-center justify-center gap-2 rounded-lg border border-[#e4e9ee] px-2 sm:h-[50px] sm:min-w-20 sm:px-3"
                      onClick={() => like(review)}
                    >
                      <Icon src={iconLike} size={24} alt="" />
                      <span>{likes[review.id] ?? review.likes}</span>
                    </button>
                    <button type="button" aria-label="Mark review unhelpful" className="grid size-10 place-items-center rounded-lg border border-[#e4e9ee] sm:size-[50px]">
                      <Icon src={iconDislike} size={24} className="rotate-180" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-8 flex flex-wrap justify-center gap-2 lg:justify-end">
            {Array.from({ length: pageCount }, (_, index) => index + 1)
              .filter((number) => number === 1 || number === pageCount || Math.abs(number - currentPage) < 2)
              .map((number, index, list) => {
                const previous = list[index - 1];
                return (
                  <span key={number} className="flex gap-2">
                    {previous && number - previous > 1 ? (
                      <span className="grid size-11 place-items-center rounded-lg border border-[#e4e9ee] text-sm text-[#7a7a7a]">...</span>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => setPage(number)}
                      className={`grid size-11 place-items-center rounded-lg text-sm font-medium ${
                        number === currentPage ? "border border-[#333] text-ink" : "border border-[#e4e9ee] text-[#7a7a7a]"
                      }`}
                    >
                      {number}
                    </button>
                  </span>
                );
              })}
            <button
              type="button"
              aria-label="Next page"
              disabled={currentPage >= pageCount}
              onClick={nextPage}
              className="grid size-11 place-items-center disabled:opacity-40"
            >
              <Icon src={iconChevron} size={24} className="rotate-90" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
