import { useRef, type ReactNode } from "react";
import { useFocusTrap } from "../../hooks/useFocusTrap";

interface InfoDialogProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function InfoDialog({ title, onClose, children }: InfoDialogProps) {
  const panel = useRef<HTMLDivElement>(null);
  useFocusTrap(true, panel);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" role="presentation" onClick={onClose}>
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="max-h-[80vh] w-full max-w-lg overflow-auto rounded-lg bg-white p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button type="button" onClick={onClose} className="text-sm underline">
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
