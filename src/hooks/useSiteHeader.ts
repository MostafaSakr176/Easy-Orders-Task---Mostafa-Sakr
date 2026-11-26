import { useEffect, useId, useState } from "react";
import { track } from "../lib/analytics";
import { selectCartCount, useCartStore } from "../store/cartStore";
import { useUiStore } from "../store/uiStore";
import { useWishlistStore } from "../store/wishlistStore";

export function useSiteHeader() {
  const count = useCartStore((state) => selectCartCount(state.items));
  const wishes = useWishlistStore((state) => state.items.length);
  const openCart = useUiStore((state) => state.openCart);
  const user = useUiStore((state) => state.user);
  const setSignInOpen = useUiStore((state) => state.setSignInOpen);
  const setInstallOpen = useUiStore((state) => state.setInstallOpen);
  const setWishlistOpen = useUiStore((state) => state.setWishlistOpen);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const mobileMenuId = useId();
  const firstName = user ? user.name.split(" ")[0] : "Sign in";

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return {
    count,
    wishes,
    firstName,
    menuId,
    mobileMenuId,
    categoriesOpen,
    searchOpen,
    menuOpen,
    toggleCategories: () => setCategoriesOpen((open) => !open),
    closeCategories: () => setCategoriesOpen(false),
    openSearch: () => setSearchOpen(true),
    closeSearch: () => setSearchOpen(false),
    toggleMenu: () => setMenuOpen((open) => !open),
    closeMenu: () => setMenuOpen(false),
    openCart,
    openInstall: () => {
      setMenuOpen(false);
      setInstallOpen(true);
    },
    openWishlist: () => {
      setMenuOpen(false);
      setWishlistOpen(true);
      track("view_wishlist", { count: wishes });
    },
    signIn: () => setSignInOpen(true),
    signInFromMenu: () => {
      setMenuOpen(false);
      setSignInOpen(true);
    },
  };
}
