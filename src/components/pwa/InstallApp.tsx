import { useEffect, useRef, useState } from "react";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { useInstallApp } from "../../hooks/useInstallApp";
import { useUiStore } from "../../store/uiStore";

export function InstallApp() {
  const open = useUiStore((state) => state.installOpen);
  const { mobile, ios, installed, canPrompt, install, dismiss } = useInstallApp();
  const [guide, setGuide] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  useFocusTrap(open, panel);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dismiss, open]);

  useEffect(() => {
    if (!open) setGuide(false);
  }, [open]);

  async function choose() {
    if (canPrompt && !(mobile && ios)) {
      await install();
      setGuide(false);
      return;
    }
    setGuide(true);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/40 p-4" role="presentation" onClick={dismiss}>
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Install app"
        className="w-full max-w-md rounded-lg bg-white p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Install Easy Orders</h2>
            <p className="mt-1 text-sm text-[#666]">
              {mobile ? "Add it to your home screen." : "Install it on this computer."}
            </p>
          </div>
          <button type="button" className="text-sm underline" onClick={dismiss}>
            Close
          </button>
        </div>
        {installed ? <p className="mt-4 rounded-lg bg-[#f2f2f2] px-3 py-2 text-sm">Easy Orders is already installed on this device.</p> : null}
        <div className="mt-5">
          <button type="button" className="w-full rounded-lg border border-[#e6e6e6] px-4 py-4 text-left hover:bg-[#f7f7f7]" onClick={() => void choose()}>
            <span className="block font-semibold">{mobile ? "Mobile app" : "Desktop app"}</span>
            <span className="mt-1 block text-sm text-[#666]">
              {mobile ? "Adds an icon to your phone home screen." : "Opens in its own window on your computer."}
            </span>
          </button>
        </div>
        {guide ? (
          <p className="mt-4 text-sm leading-6 text-[#525252]">
            {mobile
              ? ios
                ? "In Safari, tap Share, then Add to Home Screen."
                : "Open this page in Chrome, then choose Mobile app again to confirm the install."
              : "In Chrome or Edge, use the install icon in the address bar, or choose Desktop app again after the browser offers to install."}
          </p>
        ) : null}
      </div>
    </div>
  );
}
