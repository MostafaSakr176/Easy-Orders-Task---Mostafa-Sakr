import { FormEvent, useState } from "react";
import { track } from "../lib/analytics";
import { useUiStore } from "../store/uiStore";

export function useSiteFooter() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const currency = useUiStore((state) => state.currency);
  const language = useUiStore((state) => state.language);
  const setCurrency = useUiStore((state) => state.setCurrency);
  const setLanguage = useUiStore((state) => state.setLanguage);
  const openCart = useUiStore((state) => state.openCart);
  const setSignInOpen = useUiStore((state) => state.setSignInOpen);
  const setWishlistOpen = useUiStore((state) => state.setWishlistOpen);

  function subscribe(event: FormEvent) {
    event.preventDefault();
    if (!email.includes("@")) return;
    setJoined(true);
    setEmail("");
    track("newsletter_signup", {});
  }

  function handles(link: string) {
    return link === "Wishlist" || link === "Cart" || link === "Login" || link === "My account";
  }

  function activate(link: string) {
    if (link === "Wishlist") {
      setWishlistOpen(true);
      track("view_wishlist", {});
      return true;
    }
    if (link === "Cart") {
      openCart();
      return true;
    }
    if (link === "Login" || link === "My account") {
      setSignInOpen(true);
      return true;
    }
    return false;
  }

  return {
    email,
    setEmail,
    joined,
    subscribe,
    currency,
    language,
    setCurrency,
    toggleLanguage: () => setLanguage(language === "English" ? "العربية" : "English"),
    handles,
    activate,
  };
}
