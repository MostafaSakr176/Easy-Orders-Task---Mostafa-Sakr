import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Keyboard, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import iconShare from "../../assets/figma/icon-share.svg";
import iconHeart from "../../assets/figma/icon-heart.svg";
import iconHeartFilled from "../../assets/figma/icon-heart-filled.svg";
import iconChevron from "../../assets/figma/icon-chevron.svg";
import { Icon } from "../shared/Icon";
import { IconButton } from "../shared/IconButton";
import { ShareMenu } from "../shared/ShareMenu";
import { useProductGallery } from "../../hooks/useProductGallery";

interface ProductGalleryProps {
  images: string[];
  name: string;
  activeSrc?: string;
  wished: boolean;
  onToggleWish: () => void;
}

export function ProductGallery({ images, name, activeSrc, wished, onToggleWish }: ProductGalleryProps) {
  const gallery = useProductGallery(images, name, activeSrc);
  const {
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
    canNativeShare,
    zoomAt,
    clearZoom,
    openLightbox,
    closeLightbox,
    toggleShare,
    showImage,
    onMainSwiper,
    onMainSlideChange,
    onLightboxSwiper,
    onLightboxSlideChange,
  } = gallery;

  return (
    <div className="flex items-start gap-4 lg:sticky lg:top-6 xl:gap-[35px]">
      <div className="w-full max-w-[460px]">
        <div className="gallery-main aspect-[4/5] flex gap-4 overflow-hidden rounded-lg sm:aspect-auto sm:h-[520px] xl:h-[610px]">
          <Swiper
            className="h-full bg-[#f2f2f2]"
            modules={[Thumbs, Keyboard]}
            thumbs={{ swiper: thumbs && !thumbs.destroyed ? thumbs : null }}
            keyboard={{ enabled: true, onlyInViewport: true }}
            initialSlide={startIndex}
            speed={450}
            onSwiper={onMainSwiper}
            onSlideChange={onMainSlideChange}
          >
            {images.map((image, imageIndex) => (
              <SwiperSlide key={image} className="!h-full">
                <img
                  src={image}
                  alt={imageIndex === safeIndex ? name : ""}
                  className="h-full w-full object-contain transition-transform duration-300 ease-out"
                  style={{
                    transform: zooming && imageIndex === safeIndex ? "scale(1.75)" : "scale(1)",
                    transformOrigin: origin,
                  }}
                  onPointerMove={zoomAt}
                  onPointerLeave={clearZoom}
                  onClick={openLightbox}
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="flex flex-col gap-2 justify-between lg:hidden">
            <div className="flex flex-col gap-2">
              <div className="relative">
                <IconButton compact label="Share" onClick={toggleShare}>
                  <Icon src={iconShare} size={18} />
                </IconButton>
                {shareOpen ? (
                  <ShareMenu native={canNativeShare} onKeyDown={onShareMenuKeyDown} onShare={(channel) => void share(channel)} />
                ) : null}
              </div>
              <IconButton compact label={wished ? "Remove from wishlist" : "Save to wishlist"} pressed={wished} onClick={onToggleWish}>
                <Icon src={wished ? iconHeartFilled : iconHeart} size={18} />
              </IconButton>
            </div>
            <div className="flex flex-col gap-2">
              <IconButton compact label="Previous image" onClick={() => step(-1)}>
                <Icon src={iconChevron} size={18} className="-rotate-90" />
              </IconButton>
              <IconButton compact label="Next image" onClick={() => step(1)}>
                <Icon src={iconChevron} size={18} className="rotate-90" />
              </IconButton>
            </div>
          </div>
        </div>
        <Swiper
          className="gallery-thumbs mt-6"
          modules={[FreeMode, Thumbs]}
          onSwiper={setThumbs}
          slidesPerView="auto"
          spaceBetween={16}
          freeMode
          watchSlidesProgress
        >
          {images.map((image, imageIndex) => {
            const selected = imageIndex === safeIndex;
            return (
              <SwiperSlide key={image} className="!w-16 sm:!w-[76px]">
                <button
                  type="button"
                  aria-label={`Show image ${imageIndex + 1}`}
                  aria-current={selected ? "true" : undefined}
                  onClick={() => showImage(imageIndex)}
                  className={`h-20 w-16 overflow-hidden rounded-lg bg-[#f2f2f2] sm:h-[100px] sm:w-[76px] ${selected ? "border-2 border-ink" : ""}`}
                >
                  <img src={image} alt="" loading="lazy" className="h-full w-full object-cover" />
                </button>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
      <div className="hidden h-[610px] w-[52px] flex-col justify-between lg:flex">
        <div className="flex flex-col gap-5">
          <div className="relative">
            <IconButton label="Share" onClick={toggleShare}>
              <Icon src={iconShare} size={20} />
            </IconButton>
            {shareOpen ? (
              <ShareMenu align="left" native={canNativeShare} onKeyDown={onShareMenuKeyDown} onShare={(channel) => void share(channel)} />
            ) : null}
          </div>
          <IconButton label={wished ? "Remove from wishlist" : "Save to wishlist"} pressed={wished} onClick={onToggleWish}>
            <Icon src={wished ? iconHeartFilled : iconHeart} size={20} />
          </IconButton>
        </div>
        <div className="flex flex-col gap-5">
          <IconButton label="Previous image" onClick={() => step(-1)}>
            <Icon src={iconChevron} size={20} className="-rotate-90" />
          </IconButton>
          <IconButton label="Next image" onClick={() => step(1)}>
            <Icon src={iconChevron} size={20} className="rotate-90" />
          </IconButton>
        </div>
      </div>
      {lightbox && src ? (
        <div className="fixed inset-0 z-50 bg-black/80" role="dialog" aria-modal="true" aria-label="Expanded product image">
          <button type="button" className="absolute right-6 top-6 z-10 text-white" onClick={closeLightbox}>
            Close
          </button>
          <button type="button" className="absolute left-6 top-1/2 z-10 -translate-y-1/2 text-3xl text-white" aria-label="Previous image" onClick={() => step(-1)}>
            ‹
          </button>
          <Swiper
            className="h-full"
            modules={[Keyboard]}
            keyboard={{ enabled: true }}
            initialSlide={safeIndex}
            speed={450}
            onSwiper={onLightboxSwiper}
            onSlideChange={onLightboxSlideChange}
          >
            {images.map((image) => (
              <SwiperSlide key={image} className="!flex !h-full items-center justify-center">
                <img src={image} alt={name} className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain" />
              </SwiperSlide>
            ))}
          </Swiper>
          <button type="button" className="absolute right-6 top-1/2 z-10 -translate-y-1/2 text-3xl text-white" aria-label="Next image" onClick={() => step(1)}>
            ›
          </button>
        </div>
      ) : null}
    </div>
  );
}
