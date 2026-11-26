import type { CatalogCard } from "../data/catalog";

export interface RecommendationSource {
  name: string;
  brand: string;
  price: number;
  categories: string[];
}

function tokens(value: string): Set<string> {
  return new Set(value.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length > 2));
}

export function recommendProducts(source: RecommendationSource, catalog: CatalogCard[], limit = 5): CatalogCard[] {
  const words = tokens(`${source.name} ${source.brand} ${source.categories.join(" ")}`);
  return catalog
    .map((card) => {
      const cardWords = tokens(`${card.name} ${card.brand}`);
      let overlap = 0;
      cardWords.forEach((word) => {
        if (words.has(word)) overlap += 1;
      });
      const priceScore = 1 / (1 + Math.abs(card.amount - source.price) / 40);
      const score = card.ratingValue * 2 + overlap * 4 + priceScore;
      return { card, score };
    })
    .sort((left, right) => right.score - left.score || left.card.name.localeCompare(right.card.name))
    .slice(0, limit)
    .map((entry) => entry.card);
}
