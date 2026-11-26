import { useVariationGroup } from "../../hooks/useVariationGroup";

interface VariationOption {
  id: string;
  name: string;
  value?: string;
  available: boolean;
}

interface VariationOptionsProps {
  name: string;
  image: boolean;
  options: VariationOption[];
  selected?: string;
  onSelect: (option: string) => void;
}

export function VariationOptions({ name, image, options, selected, onSelect }: VariationOptionsProps) {
  const enabled = options.filter((option) => option.available).map((option) => option.name);
  const group = useVariationGroup(enabled, selected, onSelect);

  return (
    <div className="mt-[18px] flex flex-wrap gap-x-[14px] gap-y-3" role="radiogroup" aria-label={name} onKeyDown={group.onKeyDown}>
      {options.map((option) => {
        const active = selected === option.name;
        if (image) {
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              data-option={option.name}
              aria-checked={active}
              aria-label={option.name}
              tabIndex={group.tabIndex(option.name, option.available)}
              disabled={!option.available}
              onClick={() => onSelect(option.name)}
              className={`h-10 w-[75px] overflow-hidden rounded-lg bg-[#f2f2f2] disabled:cursor-not-allowed disabled:opacity-40 ${
                active ? "border border-ink bg-white p-[5px]" : ""
              }`}
            >
              {option.value ? (
                <img src={option.value} alt="" className={`h-full w-full object-cover ${active ? "rounded-md" : ""}`} />
              ) : (
                <span className="text-xs capitalize">{option.name}</span>
              )}
            </button>
          );
        }
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            data-option={option.name}
            aria-checked={active}
            tabIndex={group.tabIndex(option.name, option.available)}
            disabled={!option.available}
            onClick={() => onSelect(option.name)}
            className={`h-10 min-w-[74px] rounded-lg px-4 text-[20px] font-semibold leading-[1.2] disabled:cursor-not-allowed disabled:opacity-40 ${
              active ? "border border-[#333] bg-[#ebebeb] text-ink" : "border border-[#e6e6e6] text-[#525252]"
            }`}
          >
            {option.name}
          </button>
        );
      })}
    </div>
  );
}
