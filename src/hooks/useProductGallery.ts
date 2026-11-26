import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent } from "react";
import type { Swiper as SwiperInstance } from "swiper";
import { track } from "../lib/analytics";
import { shareUrl, type ShareChannel } from "../lib/share";

export function useProductGallery(images: string[], name: string, activeSrc?: string) {
  const mainRef = useRef<SwiperInstance | null>(null);
  const lightboxRef = useRef<SwiperInstance | null>(null);
  const syncedColor = useRef<string | undefined>(undefined);
  const [thumbs, setThumbs] = useState<SwiperInstance | null>(null);
  const [index, setIndex] = useState(0);
  const [origin, setOrigin] = useState("50% 50%");
  const [zooming, setZooming] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const safeIndex = images.length === 0 ? 0 : index % images.length;
  const src = images[safeIndex];
  const startIndex = Math.max(0, activeSrc ? images.indexOf(activeSrc) : 0);

  useEffect(() => {
    const swiper = mainRef.current;
    if (!activeSrc || !swiper || swiper.destroyed || syncedColor.current === activeSrc) return;
    syncedColor.current = activeSrc;
    const next = images.indexOf(activeSrc);
    if (next >= 0) swiper.slideTo(next);
  }, [activeSrc, images]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightbox(false);
        setShareOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function step(direction: number) {
    const swiper = lightbox ? lightboxRef.current : mainRef.current;
    if (!swiper || swiper.destroyed) return;
    if (direction > 0) swiper.slideNext();
    else swiper.slidePrev();
  }

  async function share(channel: ShareChannel) {
    const url = window.location.href;
    if (channel === "native") {
      if (navigator.share) await navigator.share({ title: name, url }).catch(() => undefined);
      else await navigator.clipboard.writeText(url).catch(() => undefined);
    } else if (channel === "copy") {
      await navigator.clipboard.writeText(url).catch(() => undefined);
    } else {
      const target = shareUrl(channel, name, url);
      if (target) window.open(target, "_blank", "noopener,noreferrer");
    }
    track("share", { channel, name });
    setShareOpen(false);
  }

  function onShareMenuKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    const buttons = [...event.currentTarget.querySelectorAll("button")];
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
    event.preventDefault();
    const next = event.key === "ArrowDown" ? index + 1 : index - 1;
    buttons[(next + buttons.length) % buttons.length]?.focus();
  }

  function zoomAt(event: PointerEvent<HTMLImageElement>) {
    if (event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    setOrigin(`${x}% ${y}%`);
    setZooming(true);
  }

  function onLightboxSlideChange(instance: SwiperInstance) {
    setIndex(instance.activeIndex);
    if (mainRef.current && mainRef.current.activeIndex !== instance.activeIndex) {
      mainRef.current.slideTo(instance.activeIndex, 0);
    }
  }

  return {
    mainRef,
    lightboxRef,
    thumbs,
    setThumbs,
    safeIndex,
    src,
    startIndex,
    zooming,
    origin,
    lightbox,
    shareOpen,
    step,
    share,
    onShareMenuKeyDown,
    canNativeShare: typeof navigator.share === "function",
    zoomAt,
    clearZoom: () => setZooming(false),
    openLightbox: () => setLightbox(true),
    closeLightbox: () => setLightbox(false),
    toggleShare: () => setShareOpen((open) => !open),
    showImage: (imageIndex: number) => mainRef.current?.slideTo(imageIndex),
    onMainSwiper: (instance: SwiperInstance) => {
      mainRef.current = instance;
    },
    onMainSlideChange: (instance: SwiperInstance) => setIndex(instance.activeIndex),
    onLightboxSwiper: (instance: SwiperInstance) => {
      lightboxRef.current = instance;
    },
    onLightboxSlideChange,
  };
}
