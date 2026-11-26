import { useRef } from "react";
import { useCompare } from "../../hooks/useCompare";
import { useDisplayMoney } from "../../hooks/useDisplayMoney";
import { useFocusTrap } from "../../hooks/useFocusTrap";

export function CompareDialog() {
  const compare = useCompare();
  const displayMoney = useDisplayMoney();
  const panel = useRef<HTMLDivElement>(null);
  useFocusTrap(compare.open, panel);
  if (!compare.open) return null;
  const { items, close, removeItem, clearAll } = compare;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" role="presentation" onClick={close}>
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Compare products"
        className="max-h-[85vh] w-full max-w-4xl overflow-auto rounded-lg bg-white p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">Compare products</h2>
          <button type="button" className="text-sm underline" onClick={close}>
            Close
          </button>
        </div>
        {items.length < 2 ? (
          <p className="mt-4 text-sm text-[#666]">Add at least two products to see them side by side.</p>
        ) : (
          <div className={`mt-5 grid gap-4`} style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
            {items.map((item) => (
              <article key={item.id} className="min-w-0">
                <img src={item.image} alt="" className="aspect-[3/4] w-full rounded-lg object-cover" />
                <h3 className="mt-3 text-sm font-semibold leading-snug">{item.name}</h3>
                <dl className="mt-3 space-y-2 text-sm">
                  <div>
                    <dt className="text-[#7a7a7a]">Brand</dt>
                    <dd>{item.brand}</dd>
                  </div>
                  <div>
                    <dt className="text-[#7a7a7a]">Price</dt>
                    <dd className="font-semibold">
                      {typeof item.amount === "number" && item.currency ? displayMoney(item.amount, item.currency) : item.priceLabel}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#7a7a7a]">Rating</dt>
                    <dd>{item.ratingLabel}</dd>
                  </div>
                </dl>
                <button type="button" className="mt-4 text-sm underline" onClick={() => removeItem(item.id)}>
                  Remove
                </button>
              </article>
            ))}
          </div>
        )}
        <button type="button" className="mt-6 text-sm underline" onClick={clearAll}>
          Clear comparison
        </button>
      </div>
    </div>
  );
}
