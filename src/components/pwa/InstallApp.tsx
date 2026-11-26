import { useEffect, useRef, useState } from "react";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { useInstallApp } from "../../hooks/useInstallApp";
import { useUiStore } from "../../store/uiStore";

export function InstallApp() {
  const open = useUiStore((state) => state.installOpen);
  const setOpen = useUiStore((state) => state.setInstallOpen);
  const { mobile, ios, installed, canPrompt, install } = useInstallApp();
  const [guide, setGuide] = useState<"desktop" | "mobile" | null>(null);
  const [copied, setCopied] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  useFocusTrap(open, panel);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  useEffect(() => {
    if (!open) {
      setGuide(null);
      setCopied(false);
    }
  }, [open]);

  async function choose(target: "desktop" | "mobile") {
    const onThisDevice = target === "mobile" ? mobile : !mobile;
    if (onThisDevice && canPrompt && !(target === "mobile" && ios)) {
      await install();
      setGuide(null);
      return;
    }
    setGuide(target);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/40 p-4" role="presentation" onClick={() => setOpen(false)}>
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
            <p className="mt-1 text-sm text-[#666]">Use it as a mobile app or a desktop app.</p>
          </div>
          <button type="button" className="text-sm underline" onClick={() => setOpen(false)}>
            Close
          </button>
        </div>
        {installed ? <p className="mt-4 rounded-lg bg-[#f2f2f2] px-3 py-2 text-sm">Easy Orders is already installed on this device.</p> : null}
        <div className="mt-5 grid gap-3">
          <button type="button" className="rounded-lg border border-[#e6e6e6] px-4 py-4 text-left hover:bg-[#f7f7f7]" onClick={() => void choose("mobile")}>
            <span className="block font-semibold">Mobile app</span>
            <span className="mt-1 block text-sm text-[#666]">Adds an icon to your phone home screen.</span>
          </button>
          <button type="button" className="rounded-lg border border-[#e6e6e6] px-4 py-4 text-left hover:bg-[#f7f7f7]" onClick={() => void choose("desktop")}>
            <span className="block font-semibold">Desktop app</span>
            <span className="mt-1 block text-sm text-[#666]">Opens in its own window on your computer.</span>
          </button>
        </div>
        {guide === "mobile" ? (
          <div className="mt-4 text-sm leading-6 text-[#525252]">
            {ios ? (
              <p>In Safari, tap Share, then Add to Home Screen.</p>
            ) : mobile ? (
              <p>Open this page in Chrome, then choose Mobile app again to confirm the install.</p>
            ) : (
              <p>Open this page on your phone in Chrome or Safari, then choose Mobile app.</p>
            )}
            <button type="button" className="mt-2 underline" onClick={() => void copyLink()}>
              {copied ? "Link copied" : "Copy page link"}
            </button>
          </div>
        ) : null}
        {guide === "desktop" ? (
          <p className="mt-4 text-sm leading-6 text-[#525252]">
            {mobile
              ? "Open this page on a computer in Chrome or Edge, then choose Desktop app."
              : "In Chrome or Edge, use the install icon in the address bar, or choose Desktop app again after the browser offers to install."}
          </p>
        ) : null}
      </div>
    </div>
  );
}
