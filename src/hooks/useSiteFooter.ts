import { FormEvent, useEffect, useState } from "react";
import { track } from "../lib/analytics";
import { useUiStore } from "../store/uiStore";

const POLICIES: Record<string, string> = {
  "Shipping Policy": "Orders ship across Egypt. Delivery time depends on the city and the courier.",
  "Returns & Refunds": "You can request a return within 14 days of delivery if the item is unused.",
  "Cookies Policy": "This shop stores your cart, wishlist, and display currency in this browser.",
  "Frequently asked": "Choose a colour and size, then add the product to the cart. The sticky bar stays available while you scroll.",
  "About us": "Easy Orders is a storefront for browsing a product, comparing it, and checking out.",
  "Privacy Policy": "Account details stay in this browser. The product request is the only call to the shop API.",
  "Terms & Conditions": "Prices follow the currency you select. Stock rules come from the product.",
  "Contact Us": "Write to hello@example.com and include the product name in the message.",
};

export function useSiteFooter() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const [policy, setPolicy] = useState<string | null>(null);
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

  useEffect(() => {
    if (!policy) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPolicy(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [policy]);

  function handles(link: string) {
    return Boolean(POLICIES[link]) || link === "Wishlist" || link === "Cart" || link === "Login" || link === "My account";
  }

  function activate(link: string) {
    if (POLICIES[link]) {
      setPolicy(link);
      return true;
    }
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
    policy,
    policyText: policy ? POLICIES[policy] : "",
    closePolicy: () => setPolicy(null),
  };
}
