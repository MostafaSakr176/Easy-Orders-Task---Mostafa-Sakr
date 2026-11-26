import logo from "../../assets/figma/logo.png";
import iconSearch from "../../assets/figma/icon-search.svg";
import iconChevron from "../../assets/figma/icon-chevron.svg";
import iconUser from "../../assets/figma/icon-user.svg";
import iconHeart from "../../assets/figma/icon-heart.svg";
import iconCart from "../../assets/figma/icon-cart.svg";
import { Icon } from "../shared/Icon";
import type { Category } from "../../types/product";
import { useRef } from "react";
import { MenuIcon } from "./MenuIcon";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { PromoBar } from "./PromoBar";
import { SearchDialog } from "./SearchDialog";
import { useSiteHeader } from "../../hooks/useSiteHeader";

interface SiteHeaderProps {
  categories: Category[];
}

export function SiteHeader({ categories }: SiteHeaderProps) {
  const header = useSiteHeader();
  const {
    count,
    cartReady,
    wishes,
    wishesReady,
    firstName,
    menuId,
    mobileMenuId,
    categoriesOpen,
    searchOpen,
    menuOpen,
    toggleCategories,
    closeCategories,
    openSearch,
    closeSearch,
    toggleMenu,
    closeMenu,
    openCart,
    openInstall,
    openWishlist,
    signIn,
    signInFromMenu,
  } = header;
  const menuPanel = useRef<HTMLElement>(null);
  useFocusTrap(menuOpen, menuPanel);

  return (
    <header className="relative bg-white">
      <PromoBar />
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 border-b border-dashed border-[#A3A3A3] px-4 md:h-[100px] xl:px-0">
        <a href="#product" className="shrink-0" aria-label="John Lewis & Partners home">
          <img src={logo} alt="John Lewis & Partners" className="h-7 w-[148px] object-contain object-left md:h-8 md:w-[170px]" />
        </a>
        <div className="flex items-center gap-1 md:hidden">
          <button type="button" className="grid size-10 place-items-center" aria-label="Search" aria-expanded={searchOpen} onClick={openSearch}>
            <Icon src={iconSearch} size={20} />
          </button>
          <button type="button" className="relative inline-flex md:hidden" aria-label={`Cart, ${count} items`} onClick={openCart}>
            <Icon src={iconCart} size={20} />
            {cartReady && count > 0 ? (
              <span className="absolute -right-1 -top-1 grid size-[13px] place-items-center rounded-full bg-ink text-[8px] leading-none text-white">
                {count > 9 ? "9+" : count}
              </span>
            ) : null}
          </button>
          <button
            type="button"
            className="grid size-10 place-items-center"
            aria-label="Menu"
            aria-expanded={menuOpen}
            aria-controls={mobileMenuId}
            onClick={toggleMenu}
          >
            <MenuIcon />
          </button>
        </div>
          <nav className="hidden items-center gap-6 text-[16px] font-medium leading-[1.6] text-ink md:flex" aria-label="Primary">
            <button
              type="button"
              className="inline-flex size-5 items-center justify-center"
              aria-label="Search"
              aria-expanded={searchOpen}
              onClick={openSearch}
            >
              <Icon src={iconSearch} size={20} />
            </button>
            <div className="relative hidden md:block">
              <button
                type="button"
                className="inline-flex items-center gap-1"
                aria-expanded={categoriesOpen}
                aria-controls={menuId}
                onClick={toggleCategories}
              >
                Categories
                <Icon src={iconChevron} size={20} className={categoriesOpen ? "" : "rotate-180"} />
              </button>
              {categoriesOpen ? (
                <div
                  id={menuId}
                  role="menu"
                  className="absolute right-0 top-[calc(100%+12px)] z-30 min-w-48 rounded-lg border border-[#e6e6e6] bg-white p-2 shadow-lg"
                >
                  {categories.length === 0 ? (
                    <p className="px-3 py-2 text-sm text-body">No categories</p>
                  ) : (
                    categories.map((category) => (
                      <a
                        key={category.id}
                        role="menuitem"
                        href="#product"
                        className="block rounded-md px-3 py-2 text-sm hover:bg-[#f2f2f2]"
                        onClick={closeCategories}
                      >
                        {category.name}
                      </a>
                    ))
                  )}
                </div>
              ) : null}
            </div>
            
            <button type="button" className="inline-flex items-center gap-1" onClick={signIn}>
              <Icon src={iconUser} size={20} />
              <span className="hidden max-w-[7.5rem] truncate sm:inline-block">{firstName}</span>
            </button>
            <button type="button" className="relative inline-flex" aria-label={`Wishlist, ${wishes} saved`} onClick={openWishlist}>
              <Icon src={iconHeart} size={20} />
              {wishesReady && wishes > 0 ? (
                <span className="absolute -right-1 -top-1 grid size-[13px] place-items-center rounded-full bg-ink text-[8px] leading-none text-white">
                  {wishes}
                </span>
              ) : null}
            </button>
            <button type="button" className="relative inline-flex" aria-label={`Cart, ${count} items`} onClick={openCart}>
              <Icon src={iconCart} size={20} />
              {cartReady && count > 0 ? (
                <span className="absolute -right-1 -top-1 grid size-[13px] place-items-center rounded-full bg-ink text-[8px] leading-none text-white">
                  {count > 9 ? "9+" : count}
                </span>
              ) : null}
            </button>
          </nav>
      </div>
      <div className={`fixed inset-0 z-50 md:hidden ${menuOpen ? "" : "pointer-events-none"}`} aria-hidden={!menuOpen} inert={!menuOpen ? true : undefined}>
        <button
          type="button"
          aria-label="Close menu"
          className={`absolute inset-0 bg-black/40 transition-opacity ${menuOpen ? "opacity-100" : "opacity-0"}`}
          onClick={closeMenu}
        />
        <aside
          ref={menuPanel}
          id={mobileMenuId}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className={`absolute right-0 top-0 flex h-full w-full max-w-[420px] flex-col bg-white shadow-2xl transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <header className="flex items-center justify-between border-b border-[#ececec] px-5 py-4">
            <h2 className="text-xl font-semibold">Menu</h2>
            <button type="button" onClick={closeMenu} className="text-sm underline">
              Close
            </button>
          </header>
          <div className="flex-1 overflow-auto px-5 py-5">
            <p className="text-sm font-semibold text-ink">Categories</p>
            <ul className="mt-2">
              {categories.length === 0 ? (
                <li className="py-2 text-sm text-body">No categories</li>
              ) : (
                categories.map((category) => (
                  <li key={category.id}>
                    <a href="#product" className="block py-2 text-sm" onClick={closeMenu}>
                      {category.name}
                    </a>
                  </li>
                ))
              )}
            </ul>
            <div className="mt-3 flex flex-col border-t border-[#ececec] pt-3 text-sm font-medium">
              <button type="button" className="py-2 text-left" onClick={openInstall}>
                Install app
              </button>
              <button type="button" className="flex items-center gap-2 py-2 text-left" onClick={openWishlist}>
                <Icon src={iconHeart} size={20} />
                Wishlist{wishesReady && wishes > 0 ? ` (${wishes})` : ""}
              </button>
              <button type="button" className="flex items-center gap-2 py-2 text-left" onClick={signInFromMenu}>
                <Icon src={iconUser} size={20} />
                <span className="min-w-0 flex-1 truncate">{firstName}</span>
              </button>
            </div>
          </div>
        </aside>
      </div>
      {searchOpen ? <SearchDialog onClose={closeSearch} /> : null}
    </header>
  );
}
