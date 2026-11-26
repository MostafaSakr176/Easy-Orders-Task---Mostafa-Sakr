import { useEffect, useState } from "react";
import { useUiStore } from "../store/uiStore";

const INSTALL_SEEN_KEY = "easy-orders-install-seen";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isIos() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isMobile() {
  if (isIos() || /Android/i.test(navigator.userAgent)) return true;
  if (typeof window.matchMedia !== "function") return false;
  return window.matchMedia("(pointer: coarse) and (max-width: 1024px)").matches;
}

function isStandalone() {
  const displayMode =
    typeof window.matchMedia === "function" && window.matchMedia("(display-mode: standalone)").matches;
  const iosStandalone = "standalone" in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
  return displayMode || iosStandalone;
}

export function useInstallApp() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(isStandalone);
  const [mobile] = useState(isMobile);
  const [ios] = useState(isIos);
  const setOpen = useUiStore((state) => state.setInstallOpen);

  useEffect(() => {
    if (isStandalone()) return;
    try {
      if (localStorage.getItem(INSTALL_SEEN_KEY) === "1") return;
    } catch {
      return;
    }
    setOpen(true);
  }, [setOpen]);

  useEffect(() => {
    setInstalled(isStandalone());

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setPromptEvent(null);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function install() {
    if (!promptEvent) return "unavailable" as const;
    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    setPromptEvent(null);
    if (choice.outcome === "accepted") setInstalled(true);
    return choice.outcome;
  }

  function dismiss() {
    try {
      localStorage.setItem(INSTALL_SEEN_KEY, "1");
    } catch {
      // Private mode can block storage. Closing the dialog still works.
    }
    setOpen(false);
  }

  return {
    mobile,
    ios,
    installed,
    canPrompt: promptEvent !== null,
    install,
    dismiss,
  };
}
