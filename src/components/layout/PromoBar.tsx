import { usePromoCountdown } from "../../hooks/usePromoCountdown";

export function PromoBar() {
  const { openCart, minutes, seconds, label } = usePromoCountdown();

  return (
    <div className="bg-black text-white">
      <p className="mx-auto flex min-h-10 max-w-[640px] flex-wrap items-center justify-center gap-x-2 gap-y-1 px-4 py-2 text-center text-[12px] font-medium leading-4 md:text-[13px] md:leading-none">
        <span>
          New season coming! Discount 10% for all product!{" "}
          <button type="button" className="font-medium hover:opacity-80" onClick={openCart}>
            Checkout Now!
          </button>
        </span>
        <span
          role="timer"
          aria-label={`${minutes} minutes and ${seconds} seconds remaining`}
          className="inline-flex h-6 min-w-[52px] items-center justify-center rounded-full bg-[#3a3a3a] px-2.5 text-[12px] font-medium tabular-nums"
        >
          {label}
        </span>
      </p>
    </div>
  );
}
