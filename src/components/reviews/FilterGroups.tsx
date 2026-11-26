import iconStar from "../../assets/figma/icon-star.svg";
import { Icon } from "../shared/Icon";
import { reviewTopics } from "../../data/catalog";
import { FilterGroup } from "./FilterGroup";

interface FilterGroupsProps {
  ratings: number[];
  topics: string[];
  openGroups: { rating: boolean; topics: boolean };
  onToggleRating: (score: number) => void;
  onToggleTopic: (topic: string) => void;
  onToggleGroup: (group: "rating" | "topics") => void;
}

export function FilterGroups({ ratings, topics, openGroups, onToggleRating, onToggleTopic, onToggleGroup }: FilterGroupsProps) {
  return (
    <>
      <FilterGroup title="Rating" open={openGroups.rating} onToggle={() => onToggleGroup("rating")}>
        {[5, 4, 3, 2, 1].map((score) => (
          <label key={score} className="flex items-center gap-2 text-[16px] font-semibold text-grey">
            <input type="checkbox" checked={ratings.includes(score)} onChange={() => onToggleRating(score)} className="size-[18px] accent-ink" />
            <Icon src={iconStar} size={18} alt="" />
            {score}
          </label>
        ))}
      </FilterGroup>
      <hr className="my-6 border-dashed border-[#B8B8B8]" />
      <FilterGroup title="Review Topics" open={openGroups.topics} onToggle={() => onToggleGroup("topics")}>
        {reviewTopics.map((topic) => (
          <label key={topic} className="flex items-center gap-2 text-[16px] font-semibold text-grey">
            <input type="checkbox" checked={topics.includes(topic)} onChange={() => onToggleTopic(topic)} className="size-[18px] accent-ink" />
            {topic}
          </label>
        ))}
      </FilterGroup>
    </>
  );
}
