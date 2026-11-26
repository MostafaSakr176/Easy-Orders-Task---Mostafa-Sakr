import { useMemo, useState, type KeyboardEvent } from "react";
import { designReviews } from "../data/catalog";
import { track } from "../lib/analytics";
import type { ProductReview } from "../types/product";

const PAGE_SIZE = 4;
export const reviewFilters = ["All Reviews", "With Photo & Video", "With Description"] as const;
export type ReviewFilter = (typeof reviewFilters)[number];

export function useReviews(reviews: ProductReview[]) {
  const source = reviews.length > 0 ? reviews : designReviews;
  const [ratings, setRatings] = useState<number[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [chip, setChip] = useState<ReviewFilter>("All Reviews");
  const [page, setPage] = useState(1);
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [openGroups, setOpenGroups] = useState({ rating: true, topics: true });
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    return source.filter((review) => {
      if (ratings.length > 0 && !ratings.includes(review.rating)) return false;
      if (topics.length > 0 && !topics.some((topic) => review.topics.includes(topic))) return false;
      if (chip === "With Photo & Video" && !review.hasMedia) return false;
      if (chip === "With Description" && !review.hasDescription) return false;
      return true;
    });
  }, [chip, ratings, source, topics]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const average = source.reduce((total, review) => total + review.rating, 0) / source.length;
  const buckets = [5, 4, 3, 2, 1].map((score) => source.filter((review) => review.rating === score).length);

  function toggleRating(score: number) {
    setPage(1);
    setRatings((current) => (current.includes(score) ? current.filter((item) => item !== score) : [...current, score]));
    track("filter_reviews", { rating: score });
  }

  function toggleTopic(topic: string) {
    setPage(1);
    setTopics((current) => (current.includes(topic) ? current.filter((item) => item !== topic) : [...current, topic]));
    track("filter_reviews", { topic });
  }

  function onChipKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const index = reviewFilters.indexOf(chip);
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % reviewFilters.length;
    if (event.key === "ArrowLeft") next = (index - 1 + reviewFilters.length) % reviewFilters.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = reviewFilters.length - 1;
    const item = reviewFilters[next];
    if (!item) return;
    setChip(item);
    setPage(1);
    track("filter_reviews", { chip: item });
    event.currentTarget.parentElement?.querySelectorAll("button")[next]?.focus();
  }

  return {
    source,
    average,
    buckets,
    maxBucket: Math.max(...buckets, 1),
    ratings,
    topics,
    chip,
    selectChip: (item: ReviewFilter) => {
      setChip(item);
      setPage(1);
      track("filter_reviews", { chip: item });
    },
    onChipKeyDown,
    chipTabIndex: (item: ReviewFilter) => (item === chip ? 0 : -1),
    visible,
    pageCount,
    currentPage,
    setPage,
    nextPage: () => setPage((value) => Math.min(pageCount, value + 1)),
    likes,
    like: (review: ProductReview) => {
      setLikes((current) => ({ ...current, [review.id]: (current[review.id] ?? review.likes) + 1 }));
      track("review_helpful", { id: review.id });
    },
    filtersOpen,
    openFilters: () => setFiltersOpen(true),
    closeFilters: () => setFiltersOpen(false),
    openGroups,
    toggleGroup: (group: "rating" | "topics") => setOpenGroups((state) => ({ ...state, [group]: !state[group] })),
    toggleRating,
    toggleTopic,
  };
}
