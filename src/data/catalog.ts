import related1 from "../assets/figma/related-1.png";
import related2 from "../assets/figma/related-2.png";
import related3 from "../assets/figma/related-3.png";
import related4 from "../assets/figma/related-4.png";
import related5 from "../assets/figma/related-5.png";
import popular1 from "../assets/figma/popular-1.png";
import popular2 from "../assets/figma/popular-2.png";
import popular3 from "../assets/figma/popular-3.png";
import popular4 from "../assets/figma/popular-4.png";
import popular5 from "../assets/figma/popular-5.png";
import avatar from "../assets/figma/review-avatar.png";
import type { ProductReview } from "../types/product";

export interface CatalogCard {
  id: string;
  brand: string;
  name: string;
  price: string;
  amount: number;
  image: string;
  rating: string;
  ratingValue: number;
  sold: string;
}

const relatedCopy: Omit<CatalogCard, "id" | "image">[] = [
  {
    brand: "Whistle",
    name: "Wide Leg Cropped Jeans, Denim",
    price: "$26",
    amount: 26,
    rating: "4,8",
    ratingValue: 4.8,
    sold: "1,238 Sold",
  },
  {
    brand: "John Lewis ANYDAY",
    name: "Long Sleeve Utility Shirt, Navy, 6",
    price: "$26",
    amount: 26,
    rating: "4,8",
    ratingValue: 4.8,
    sold: "1,238 Sold",
  },
  {
    brand: "John Lewis ANYDAY",
    name: "Stripe Curved Hem Shirt, Blue",
    price: "$32",
    amount: 32,
    rating: "4,5",
    ratingValue: 4.5,
    sold: "620 Sold",
  },
  {
    brand: "John Lewis ANYDAY",
    name: "Denim Overshirt, Mid Wash",
    price: "$40",
    amount: 40,
    rating: "4,6",
    ratingValue: 4.6,
    sold: "238 Sold",
  },
  {
    brand: "John Lewis",
    name: "Linen Blazer, Navy",
    price: "$79",
    amount: 79,
    rating: "4,8",
    ratingValue: 4.8,
    sold: "1,238 Sold",
  },
];

function cards(prefix: string, images: string[]): CatalogCard[] {
  return relatedCopy.map((item, index) => ({
    ...item,
    id: `${prefix}-${index + 1}`,
    image: images[index] ?? images[0],
  }));
}

export const relatedProducts = cards("related", [related1, related2, related3, related4, related5]);
export const popularProducts = cards("popular", [popular1, popular2, popular3, popular4, popular5]);

export const designReviews: ProductReview[] = [
  {
    id: "rev-1",
    author: "Darrell Steward",
    title: "This is amazing product I have.",
    createdAt: "2020-07-02T15:29:00.000Z",
    rating: 5,
    likes: 128,
    avatar,
    topics: ["Product Quality"],
    hasMedia: true,
    hasDescription: true,
  },
  {
    id: "rev-2",
    author: "Courtney Henry",
    title: "This is amazing product I have.",
    createdAt: "2020-06-18T11:04:00.000Z",
    rating: 5,
    likes: 82,
    topics: ["Seller Services"],
    hasMedia: false,
    hasDescription: true,
  },
  {
    id: "rev-3",
    author: "Esther Howard",
    title: "This is amazing product I have.",
    createdAt: "2020-05-09T18:41:00.000Z",
    rating: 4,
    likes: 9,
    topics: ["Product Price"],
    hasMedia: false,
    hasDescription: true,
  },
  {
    id: "rev-4",
    author: "Cameron Williamson",
    title: "This is amazing product I have.",
    createdAt: "2020-04-21T09:15:00.000Z",
    rating: 5,
    likes: 124,
    topics: ["Shipment", "Match with Description"],
    hasMedia: true,
    hasDescription: true,
  },
];

export const reviewTopics = [
  "Product Quality",
  "Seller Services",
  "Product Price",
  "Shipment",
  "Match with Description",
];
