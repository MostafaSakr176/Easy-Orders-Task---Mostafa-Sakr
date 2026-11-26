import { useEffect, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { popularProducts, relatedProducts } from "../data/catalog";
import { track } from "../lib/analytics";

export function useCatalogSearch(onClose: () => void) {
  const [query, setQuery] = useState("");
  const catalog = [...relatedProducts, ...popularProducts];
  const needle = query.trim().toLowerCase();
  const results = catalog.filter((item) => `${item.brand} ${item.name}`.toLowerCase().includes(needle));

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const visible = needle ? results : catalog.slice(0, 5);

  function choose(id: string) {
    track("search", { query: needle, id });
    onClose();
  }

  function onResultKeyDown(event: ReactKeyboardEvent<HTMLAnchorElement>) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    const links = [...(event.currentTarget.closest("ul")?.querySelectorAll("a") ?? [])];
    const index = links.indexOf(event.currentTarget);
    event.preventDefault();
    const next = event.key === "ArrowDown" ? index + 1 : index - 1;
    links[(next + links.length) % links.length]?.focus();
  }

  return {
    query,
    setQuery,
    hasQuery: needle.length > 0,
    results: visible,
    empty: needle.length > 0 && results.length === 0,
    choose,
    onResultKeyDown,
  };
}
