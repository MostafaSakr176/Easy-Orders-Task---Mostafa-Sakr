import { useEffect } from "react";
import { track } from "../lib/analytics";
import { formatMoney } from "../lib/money";
import { useUiStore } from "../store/uiStore";
import { useWishlistStore } from "../store/wishlistStore";

export function useWishlistDrawer(activeProductId?: string, onAddActive?: () => void) {
  const open = useUiStore((state) => state.wishlistOpen);
  const setOpen = useUiStore((state) => state.setWishlistOpen);
  const items = useWishlistStore((state) => state.items);
  const toggle = useWishlistStore((state) => state.toggle);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  return {
    open,
    items,
    close: () => setOpen(false),
    remove: (productId: string) => {
      const item = items.find((entry) => entry.productId === productId);
      if (!item) return;
      toggle(item);
      track("remove_from_wishlist", { id: productId });
    },
    addActive: (productId: string) => {
      if (productId !== activeProductId || !onAddActive) return;
      onAddActive();
      setOpen(false);
    },
    canAdd: (productId: string) => productId === activeProductId && Boolean(onAddActive),
    price: (amount: number, currency: string) => formatMoney(amount, currency),
  };
}
