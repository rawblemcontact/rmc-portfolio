import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { createPortal } from "react-dom";
import { EASE } from "@/lib/motion";

/** VISUAL DESIGN detail gallery slide (matches `detailGallery` on project-visual-design). */
export type VisualDesignGallerySlide = {
  readonly id: string;
  readonly src?: string;
  readonly alt?: string;
  readonly focalPoint?: string;
};

const LIGHTBOX_FADE_S = 0.18;

const TILE_SHELL =
  "relative aspect-square min-w-0 overflow-hidden bg-[var(--portfolio-section-card-raised)] lg:aspect-[4/5]";

type VisualDesignProfileGalleryProps = {
  readonly slides: readonly VisualDesignGallerySlide[];
};

const VisualDesignProfileLightbox = ({
  slides,
  openableIndices,
  activeIndex,
  reduceMotion,
  onClose,
  onActiveIndexChange,
}: {
  slides: readonly VisualDesignGallerySlide[];
  openableIndices: readonly number[];
  activeIndex: number;
  reduceMotion: boolean | null;
  onClose: () => void;
  onActiveIndexChange: (index: number) => void;
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: false,
    skipSnaps: false,
    dragFree: false,
  });

  const activeOpenablePos = openableIndices.indexOf(activeIndex);
  const activeSlide = slides[activeIndex];
  const hasPrev = activeOpenablePos > 0;
  const hasNext =
    activeOpenablePos >= 0 && activeOpenablePos < openableIndices.length - 1;

  const lightboxLabel =
    activeSlide?.alt?.trim() ||
    (activeIndex != null ? `Illustration ${activeIndex + 1}` : "Illustration preview");

  const handleShowPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const handleShowNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    if (!emblaApi || activeOpenablePos < 0) return;
    if (emblaApi.selectedScrollSnap() !== activeOpenablePos) {
      emblaApi.scrollTo(activeOpenablePos, true);
    }
  }, [activeOpenablePos, emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const syncActiveIndex = () => {
      const snap = emblaApi.selectedScrollSnap();
      const nextIndex = openableIndices[snap];
      if (nextIndex != null && nextIndex !== activeIndex) {
        onActiveIndexChange(nextIndex);
      }
    };
    syncActiveIndex();
    emblaApi.on("select", syncActiveIndex);
    emblaApi.on("reInit", syncActiveIndex);
    return () => {
      emblaApi.off("select", syncActiveIndex);
      emblaApi.off("reInit", syncActiveIndex);
    };
  }, [activeIndex, emblaApi, onActiveIndexChange, openableIndices]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        handleShowPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        handleShowNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleShowNext, handleShowPrev, onClose]);

  if (!activeSlide?.src?.trim()) return null;

  return (
    <motion.div
      key="visual-design-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={lightboxLabel}
      className="fixed inset-0 z-[100] flex flex-col bg-black"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: reduceMotion ? 0 : LIGHTBOX_FADE_S,
        ease: EASE.out,
      }}
    >
      <button
        type="button"
        className="absolute inset-0 z-[1] cursor-default border-0 bg-transparent p-0"
        aria-label="Close preview"
        onClick={onClose}
      />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <header className="relative flex shrink-0 items-center justify-between gap-3 border-b border-white/[0.1] bg-black px-4 py-3.5 sm:px-5">
          <button
            type="button"
            aria-label="Close preview"
            onClick={onClose}
            className="pdf-viewer-chrome-btn"
          >
            <X aria-hidden />
          </button>
          <div className="pointer-events-none absolute left-1/2 top-1/2 w-[min(72%,34rem)] -translate-x-1/2 -translate-y-1/2 px-2 text-center">
            <p className="font-display text-[0.95rem] leading-snug tracking-tight text-white sm:text-base">
              {lightboxLabel}
            </p>
            {openableIndices.length > 1 ? (
              <p className="font-heading mt-1 text-[0.65rem] uppercase tracking-eyebrow-tight text-mono-2/80 sm:text-[0.7rem]">
                {activeOpenablePos + 1} / {openableIndices.length}
              </p>
            ) : null}
          </div>
          <span className="inline-block h-10 w-10 shrink-0" aria-hidden />
        </header>

        <div
          className="relative flex min-h-0 flex-1 flex-col"
          onClick={(event) => event.stopPropagation()}
        >
          {hasPrev ? (
            <button
              type="button"
              aria-label="Previous"
              onClick={handleShowPrev}
              className="pdf-viewer-chrome-btn absolute left-3 top-1/2 z-20 -translate-y-1/2 sm:left-5"
            >
              <ArrowLeft aria-hidden />
            </button>
          ) : null}

          <div
            ref={emblaRef}
            className="min-h-0 flex-1 overflow-hidden touch-pan-y [-webkit-touch-callout:none]"
            aria-roledescription="carousel"
          >
            <div className="flex h-full min-h-[min(78dvh,920px)] touch-pan-y [-webkit-touch-callout:none]">
              {openableIndices.map((slideIndex) => {
                const slide = slides[slideIndex]!;
                const label = slide.alt?.trim() || `Illustration ${slideIndex + 1}`;

                return (
                  <div
                    key={slide.id}
                    className="flex h-full min-w-0 flex-[0_0_100%] items-center justify-center px-4 py-4 sm:px-6 sm:py-6"
                    aria-label={label}
                  >
                    <img
                      src={slide.src}
                      alt={label}
                      className="max-h-[min(78dvh,920px)] w-auto max-w-[min(96vw,72rem)] object-contain object-center select-none"
                      draggable={false}
                      decoding="async"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {hasNext ? (
            <button
              type="button"
              aria-label="Next"
              onClick={handleShowNext}
              className="pdf-viewer-chrome-btn absolute right-3 top-1/2 z-20 -translate-y-1/2 sm:right-5"
            >
              <ArrowRight aria-hidden />
            </button>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
};

/**
 * VISUAL DESIGN gallery — 2×2 squares on mobile, 3×3 portrait tiles on desktop (lg+).
 * Click opens full-screen viewer (Embla + keyboard).
 */
export const VisualDesignProfileGallery = ({ slides }: VisualDesignProfileGalleryProps) => {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const openableIndices = useMemo(
    () =>
      slides.reduce<number[]>((indices, slide, index) => {
        if (slide.src?.trim()) indices.push(index);
        return indices;
      }, []),
    [slides],
  );

  const handleCloseLightbox = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const handleActiveIndexChange = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  if (!slides.length) return null;

  return (
    <>
      <div
        role="list"
        aria-label="Illustrations"
        className="grid w-full min-w-0 grid-cols-2 gap-px lg:grid-cols-3"
      >
        {slides.map((slide, index) => {
          const label =
            slide.src?.trim()
              ? slide.alt?.trim() || `Illustration ${index + 1}`
              : `Illustration slot ${index + 1}`;

          if (!slide.src?.trim()) {
            return (
              <div
                key={slide.id}
                role="listitem"
                className={TILE_SHELL}
                aria-label={label}
              />
            );
          }

          return (
            <button
              key={slide.id}
              type="button"
              role="listitem"
              className={`${TILE_SHELL} group w-full cursor-pointer border-0 p-0 text-left transition-opacity duration-200 ease-out hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_srgb,var(--palette-yellow-projects)_48%,rgb(186_186_186))] focus-visible:ring-offset-2 focus-visible:ring-offset-black`}
              aria-label={`View ${label}`}
              onClick={() => setActiveIndex(index)}
            >
              <img
                src={slide.src}
                alt={slide.alt?.trim() || `Illustration ${index + 1}`}
                className="absolute inset-0 h-full w-full object-cover object-center"
                style={{ objectPosition: slide.focalPoint ?? "50% 50%" }}
                loading="lazy"
                decoding="async"
              />
            </button>
          );
        })}
      </div>

      {typeof document !== "undefined" && activeIndex != null
        ? createPortal(
            <AnimatePresence>
              {openableIndices.includes(activeIndex) ? (
                <VisualDesignProfileLightbox
                  slides={slides}
                  openableIndices={openableIndices}
                  activeIndex={activeIndex}
                  reduceMotion={reduceMotion}
                  onClose={handleCloseLightbox}
                  onActiveIndexChange={handleActiveIndexChange}
                />
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  );
};
