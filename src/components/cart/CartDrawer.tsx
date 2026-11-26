import { useRef } from "react";
import { QuantityStepper } from "../shared/QuantityStepper";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { formatMoney } from "../../lib/money";
import { useCartDrawer } from "../../hooks/useCartDrawer";

export function CartDrawer() {
  const cart = useCartDrawer();
  const { open, checkout, closeCart, items, subtotal, currency, placed, setQuantity, remove, beginCheckout, placeOrder, continueShopping } = cart;
  const panel = useRef<HTMLElement>(null);
  useFocusTrap(open, panel);

  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open} inert={!open ? true : undefined}>
      <button
        type="button"
        aria-label="Close cart"
        className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        onClick={closeCart}
      />
      <aside
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Cart"
        className={`absolute right-0 top-0 flex h-full w-full max-w-[420px] flex-col bg-white shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-[#ececec] px-5 py-4">
          <h2 className="text-xl font-semibold">{checkout ? "Checkout" : "Cart"}</h2>
          <button type="button" onClick={closeCart} className="text-sm underline">
            Close
          </button>
        </header>
        {placed ? (
          <div className="grid flex-1 place-items-center px-6 text-center">
            <div>
              <p className="text-2xl font-semibold">Thank you</p>
              <p className="mt-2 text-[#666]">Your order is saved on this device. We’ll follow the delivery window in the product terms.</p>
              <button
                type="button"
                className="mt-6 h-12 rounded-lg bg-ink px-6 text-white"
                onClick={continueShopping}
              >
                Continue shopping
              </button>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="grid flex-1 place-items-center px-6 text-center">
            <div>
              <p className="text-2xl font-semibold">Your cart is empty</p>
              <p className="mt-2 text-[#666]">Choose a color and size, then add the pair to your cart.</p>
              <button type="button" className="mt-6 h-12 rounded-lg bg-ink px-6 text-white" onClick={closeCart}>
                Browse product
              </button>
            </div>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-4 overflow-auto px-5 py-5">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3 border-b border-[#f2f2f2] pb-4">
                  <img src={item.image} alt="" className="h-24 w-[72px] rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold leading-snug">{item.name}</p>
                    <p className="mt-1 text-sm capitalize text-[#666]">
                      {item.options.map((option) => `${option.name}: ${option.value}`).join(" · ")}
                    </p>
                    <p className="mt-2 font-semibold">{formatMoney(item.unitPrice, item.currency)}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <QuantityStepper value={item.quantity} max={item.maxQuantity} onChange={(value) => setQuantity(item.id, value)} />
                      <button
                        type="button"
                        className="text-sm underline"
                        onClick={() => remove(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <footer className="border-t border-[#ececec] px-5 py-5">
              <p className="flex items-center justify-between text-lg">
                <span>Subtotal</span>
                <span className="font-semibold">{formatMoney(subtotal, currency)}</span>
              </p>
              {checkout ? (
                <form className="mt-4 space-y-3" onSubmit={placeOrder}>
                  <input required name="name" placeholder="Full name" className="h-11 w-full rounded-lg border border-[#e6e6e6] px-3" />
                  <input required name="phone" placeholder="Phone" className="h-11 w-full rounded-lg border border-[#e6e6e6] px-3" />
                  <input required name="city" placeholder="City" className="h-11 w-full rounded-lg border border-[#e6e6e6] px-3" />
                  <textarea required name="address" placeholder="Address" className="w-full rounded-lg border border-[#e6e6e6] px-3 py-2" rows={3} />
                  <button type="submit" className="h-[52px] w-full rounded-lg bg-ink font-semibold text-white">
                    Place order
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  className="mt-4 h-[52px] w-full rounded-lg bg-ink font-semibold text-white"
                  onClick={beginCheckout}
                >
                  Checkout
                </button>
              )}
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
