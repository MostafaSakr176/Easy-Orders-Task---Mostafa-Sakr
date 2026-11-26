import { useCompare } from "../../hooks/useCompare";

interface CompareBarProps {
  raised: boolean;
}

export function CompareBar({ raised }: CompareBarProps) {
  const compare = useCompare();
  if (compare.items.length === 0) return null;

  return (
    <div className={`fixed inset-x-0 z-40 px-4 ${raised ? "bottom-[4.75rem] xl:bottom-4" : "bottom-4"}`}>
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 rounded-lg bg-ink px-4 py-3 text-white shadow-lg">
        <p className="shrink-0 text-sm">{compare.items.length} to compare</p>
        <ul className="hidden md:flex min-w-0 flex-1 gap-2 overflow-auto">
          {compare.items.map((item) => (
            <li key={item.id}>
              <img src={item.image} alt="" className="size-10 rounded-md object-cover" />
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <button type="button" className="h-10 shrink-0 rounded-lg bg-white px-4 text-sm font-semibold text-ink" onClick={compare.openCompare}>
            Compare products
          </button>
          <button type="button" className="shrink-0 text-sm underline" onClick={compare.clearAll}>
            Clear
          </button>
        </div>

      </div>
    </div>
  );
}
