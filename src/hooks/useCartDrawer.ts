import { FormEvent, useEffect, useState } from "react";
import { track } from "../lib/analytics";
import { useDisplayMoney } from "./useDisplayMoney";
import { convertMoney } from "../lib/money";
import { selectCartSubtotal, useCartStore } from "../store/cartStore";
import { useUiStore } from "../store/uiStore";

export function useCartDrawer() {
  const open = useUiStore((state) => state.cartOpen);
  const checkout = useUiStore((state) => state.checkout);
  const closeCart = useUiStore((state) => state.closeCart);
  const setCheckout = useUiStore((state) => state.setCheckout);
  const pushToast = useUiStore((state) => state.pushToast);
  const items = useCartStore((state) => state.items);
  const hydrated = useCartStore((state) => state.hydrated);
  const displayMoney = useDisplayMoney();
  const selectedCurrency = useUiStore((state) => state.currency);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clear = useCartStore((state) => state.clear);
  const [placed, setPlaced] = useState(false);
  const subtotal = selectCartSubtotal(items);
  const currency = items[0]?.currency ?? "EGP";

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeCart, open]);

  function placeOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    track("purchase", { subtotal, items: items.length, city: data.get("city") });
    clear();
    setPlaced(true);
    pushToast("Order placed");
  }

  return {
    open,
    checkout,
    closeCart,
    items,
    hydrated,
    subtotal,
    displaySubtotal: items.reduce(
      (total, item) => total + convertMoney(item.unitPrice, item.currency, selectedCurrency) * item.quantity,
      0,
    ),
    selectedCurrency,
    displayMoney,
    currency,
    placed,
    setQuantity,
    remove: (id: string) => {
      removeItem(id);
      track("remove_from_cart", { id });
    },
    beginCheckout: () => {
      track("begin_checkout", { subtotal, items: items.length });
      setCheckout(true);
    },
    placeOrder,
    continueShopping: () => {
      setPlaced(false);
      closeCart();
    },
  };
}
