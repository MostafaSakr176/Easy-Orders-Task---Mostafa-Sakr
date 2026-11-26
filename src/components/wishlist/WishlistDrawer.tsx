import { useRef } from "react";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { useWishlistDrawer } from "../../hooks/useWishlistDrawer";

interface WishlistDrawerProps {
  activeProductId?: string;
  onAddActive?: () => void;
}

export function WishlistDrawer({ activeProductId, onAddActive }: WishlistDrawerProps) {
  const drawer = useWishlistDrawer(activeProductId, onAddActive);
  const panel = useRef<HTMLElement>(null);
  useFocusTrap(drawer.open, panel);
  const { open, items, close, remove, addActive, canAdd, price } = drawer;

  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open} inert={!open ? true : undefined}>
      <button
        type="button"
        aria-label="Close wishlist"
        className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        onClick={close}
      />
      <aside
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Wishlist"
        className={`absolute right-0 top-0 flex h-full w-full max-w-[420px] flex-col bg-white shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-[#ececec] px-5 py-4">
          <h2 className="text-xl font-semibold">Wishlist</h2>
          <button type="button" onClick={close} className="text-sm underline">
            Close
          </button>
        </header>
        {items.length === 0 ? (
          <div className="grid flex-1 place-items-center px-6 text-center">
            <div>
              <p className="text-2xl font-semibold">Your wishlist is empty</p>
              <p className="mt-2 text-[#666]">Save products with the heart, then come back to them here.</p>
              <button type="button" className="mt-6 h-12 rounded-lg bg-ink px-6 text-white" onClick={close}>
                Browse product
              </button>
            </div>
          </div>
        ) : (
          <ul className="flex-1 space-y-4 overflow-auto px-5 py-5">
            {items.map((item) => (
              <li key={item.productId} className="flex gap-3 border-b border-[#f2f2f2] pb-4">
                <img src={item.image} alt="" className="h-24 w-[72px] rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold leading-snug">{item.name}</p>
                  <p className="mt-2 font-semibold">{price(item.price, item.currency)}</p>
                  <div className="mt-3 flex items-center gap-4">
                    {canAdd(item.productId) ? (
                      <button type="button" className="text-sm font-semibold underline" onClick={() => addActive(item.productId)}>
                        Move to cart
                      </button>
                    ) : null}
                    <button type="button" className="text-sm underline" onClick={() => remove(item.productId)}>
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  );
}
