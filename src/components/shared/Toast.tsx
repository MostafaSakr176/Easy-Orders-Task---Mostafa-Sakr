import { useToast } from "../../hooks/useProductPage";

export function Toast() {
  const { toast, openCart } = useToast();
  if (!toast) return null;
  return (
    <div className="toast-in fixed top-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-lg bg-ink px-4 py-3 text-sm text-white shadow-lg xl:top-8">
      <span>{toast.text}</span>
      <button type="button" className="underline" onClick={openCart}>
        View cart
      </button>
    </div>
  );
}
