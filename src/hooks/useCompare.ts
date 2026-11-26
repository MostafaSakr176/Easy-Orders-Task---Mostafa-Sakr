import { useEffect } from "react";
import { track } from "../lib/analytics";
import type { CompareItem } from "../store/compareStore";
import { useCompareStore } from "../store/compareStore";
import { useUiStore } from "../store/uiStore";

export function useCompare() {
  const items = useCompareStore((state) => state.items);
  const toggle = useCompareStore((state) => state.toggle);
  const remove = useCompareStore((state) => state.remove);
  const clear = useCompareStore((state) => state.clear);
  const open = useUiStore((state) => state.compareOpen);
  const setOpen = useUiStore((state) => state.setCompareOpen);
  const pushToast = useUiStore((state) => state.pushToast);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  function toggleItem(item: CompareItem) {
    const result = toggle(item);
    if (result === "limit") {
      pushToast("You can compare up to 3 products");
      return result;
    }
    track(result === "added" ? "add_to_compare" : "remove_from_compare", { id: item.id, name: item.name });
    pushToast(result === "added" ? "Added to compare" : "Removed from compare");
    return result;
  }

  return {
    items,
    open,
    toggleItem,
    contains: (id: string) => items.some((item) => item.id === id),
    removeItem: (id: string) => {
      remove(id);
      track("remove_from_compare", { id });
    },
    clearAll: () => {
      clear();
      track("clear_compare", { count: items.length });
      setOpen(false);
    },
    openCompare: () => {
      track("view_compare", { ids: items.map((item) => item.id) });
      setOpen(true);
    },
    close: () => setOpen(false),
  };
}
