import { useRef } from "react";
import { useCatalogSearch } from "../../hooks/useCatalogSearch";
import { useFocusTrap } from "../../hooks/useFocusTrap";

interface SearchDialogProps {
  onClose: () => void;
}

export function SearchDialog({ onClose }: SearchDialogProps) {
  const search = useCatalogSearch(onClose);
  const { query, setQuery, results, empty, choose, onResultKeyDown } = search;
  const panel = useRef<HTMLDivElement>(null);
  useFocusTrap(true, panel);

  return (
    <div className="fixed inset-0 z-40 bg-black/40" role="presentation" onClick={onClose}>
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        className="mx-auto mt-20 w-[min(640px,calc(100%-2rem))] rounded-lg bg-white p-5 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <label className="block text-sm text-muted" htmlFor="site-search">
          Search the edit
        </label>
        <input
          id="site-search"
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search something…"
          className="mt-2 w-full border-b border-[#141414] pb-2 text-lg outline-none"
        />
        <ul className="mt-4 max-h-80 space-y-2 overflow-auto">
          {empty ? <li className="text-sm text-body">No matches.</li> : null}
          {results.map((item) => (
            <li key={item.id}>
              <a href="#related" onClick={() => choose(item.id)} onKeyDown={onResultKeyDown} className="flex items-center gap-3 rounded-lg p-2 hover:bg-[#f2f2f2]">
                <img src={item.image} alt="" className="h-14 w-11 rounded-md object-cover" />
                <span>
                  <span className="block text-sm font-semibold">{item.brand}</span>
                  <span className="block text-sm text-[#7a7a7a]">{item.name}</span>
                </span>
                <span className="ml-auto text-sm font-semibold">{item.price}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
