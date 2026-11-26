import { useEffect, useState } from "react";
import { useUiStore } from "../store/uiStore";

const OFFER_SECONDS = 20 * 60 + 40;

export function usePromoCountdown() {
  const openCart = useUiStore((state) => state.openCart);
  const [remaining, setRemaining] = useState(OFFER_SECONDS);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRemaining((value) => (value > 0 ? value - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return {
    openCart,
    minutes,
    seconds,
    label: `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
  };
}
