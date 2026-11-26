import { useRef } from "react";
import { useFocusTrap } from "../../hooks/useFocusTrap";

interface PolicyDialogProps {
  title: string | null;
  text: string;
  onClose: () => void;
}

export function PolicyDialog({ title, text, onClose }: PolicyDialogProps) {
  const panel = useRef<HTMLDivElement>(null);
  useFocusTrap(Boolean(title), panel);
  if (!title) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" role="presentation" onClick={onClose}>
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-md rounded-lg bg-white p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-[#666]">{text}</p>
        <button type="button" className="mt-6 text-sm underline" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
