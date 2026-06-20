import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Plyr from "plyr";
import type { Options as PlyrOptions } from "plyr";
import "plyr/dist/plyr.css";

export type ShowcaseDetailVideo = {
  readonly id: string;
  readonly url: string;
  readonly label: string;
  readonly thumbnailSrc?: string;
  readonly selectorTitle?: string;
  readonly selectorSubtitle?: string;
  readonly selectorDuration?: string;
  readonly detailOverview?: string;
  readonly detailRole?: string;
  readonly detailTools?: readonly string[];
  readonly detailImpact?: string;
};

const YOUTUBE_ID_RE =
  /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/;
const VIDEO_EXT_RE = /\.(mp4|webm|ogg|m4v)(?:[?#].*)?$/i;
const IMAGE_EXT_RE = /\.(png|jpe?g|webp|gif|svg)(?:[?#].*)?$/i;

const PLRY_OPTIONS: PlyrOptions = {
  ratio: "16:9",
  fullscreen: { enabled: true },
  youtube: {
    noCookie: true,
    rel: 0,
    showinfo: 0,
    iv_load_policy: 3,
    modestbranding: 1,
  },
};

function youtubeVideoId(url: string): string | null {
  return url.match(YOUTUBE_ID_RE)?.[1] ?? null;
}

type ResolvedPlyrSource =
  | { kind: "youtube"; id: string }
  | { kind: "file"; url: string; mime: "video/mp4" };

function toPlyrSource(video: ShowcaseDetailVideo): ResolvedPlyrSource | null {
  const id = youtubeVideoId(video.url);
  if (id) {
    return { kind: "youtube", id };
  }
  if (!VIDEO_EXT_RE.test(video.url)) return null;
  return { kind: "file", url: video.url, mime: "video/mp4" };
}

function VideoEditingPlyrPlayer({
  video,
  className = "",
}: {
  video: ShowcaseDetailVideo;
  className?: string;
}) {
  const source = useMemo(() => toPlyrSource(video), [video]);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<Plyr | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !source) return;

    host.replaceChildren();

    let element: HTMLVideoElement | HTMLDivElement;
    if (source.kind === "youtube") {
      const youtubeHost = document.createElement("div");
      youtubeHost.setAttribute("data-plyr-provider", "youtube");
      youtubeHost.setAttribute("data-plyr-embed-id", source.id);
      youtubeHost.setAttribute("aria-label", video.label);
      element = youtubeHost;
    } else {
      const videoEl = document.createElement("video");
      videoEl.controls = true;
      videoEl.playsInline = true;
      videoEl.preload = "metadata";
      videoEl.setAttribute("aria-label", video.label);
      const sourceEl = document.createElement("source");
      sourceEl.src = source.url;
      sourceEl.type = source.mime;
      videoEl.appendChild(sourceEl);
      element = videoEl;
    }
    host.appendChild(element);

    if (playerRef.current) {
      try {
        playerRef.current.destroy();
      } catch {
        // Ignore teardown races from rapid tab / detail transitions.
      } finally {
        playerRef.current = null;
      }
    }

    const nextPlayer = new Plyr(element, PLRY_OPTIONS);
    playerRef.current = nextPlayer;

    return () => {
      if (playerRef.current !== nextPlayer) return;
      try {
        nextPlayer.destroy();
      } catch {
        // Ignore teardown races from rapid tab / detail transitions.
      } finally {
        playerRef.current = null;
        if (host.contains(element)) {
          host.removeChild(element);
        }
      }
    };
  }, [source, video.id]);

  if (!source) return null;
  return <div ref={hostRef} className={`w-full min-w-0 ${className}`.trim()} />;
}

type ShowcaseVideoEditingDetailProps = {
  card: {
    readonly id?: string;
    readonly title: string;
    readonly tagline: string;
    readonly detailOverview?: string;
    readonly detailRole?: string;
    readonly detailTools?: readonly string[];
    readonly detailImpact?: string;
    readonly detailVideos?: readonly ShowcaseDetailVideo[];
  };
  reduceMotion: boolean | null;
  detailHdrReveal: boolean;
  detailRuleReveal: boolean;
  detailPlayerReveal: boolean;
  detailHdrOpacityMs: number;
  detailHdrSlideMs: number;
  detailHdrSlidePx: number;
  detailRuleExpandMs: number;
  detailPlayerOpacityMs: number;
  detailFadeCubic: string;
  detailSlideCubic: string;
};

const showcaseDetailCardClass =
  "profile-card-surface relative rounded-[11px] sm:rounded-xl px-3 py-3 sm:px-4 sm:py-3.5";

export function ShowcaseVideoEditingDetail({
  card,
  reduceMotion,
  detailHdrReveal,
  detailRuleReveal,
  detailPlayerReveal,
  detailHdrOpacityMs,
  detailHdrSlideMs,
  detailHdrSlidePx,
  detailRuleExpandMs,
  detailPlayerOpacityMs,
  detailFadeCubic,
  detailSlideCubic,
}: ShowcaseVideoEditingDetailProps) {
  const WORKS_ARROW_TAP_FEEDBACK_MS = 260;
  const WORKS_STRIP_SCROLL_SYNC_MS = 220;
  const WORKS_STRIP_PROGRAMMATIC_LOCK_MS = 750;
  const STRIP_SWIPE_ARROW_THRESHOLD_PX = 3;
  const STRIP_SWIPE_TAP_CANCEL_PX = 10;
  const videos = useMemo(() => card.detailVideos ?? [], [card.detailVideos]);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [pressedWorksArrow, setPressedWorksArrow] = useState<"prev" | "next" | null>(null);
  const thumbRefs = useRef<Array<HTMLElement | null>>([]);
  const thumbStripRef = useRef<HTMLDivElement | null>(null);
  const activeVideoIndexRef = useRef(0);
  const worksArrowReleaseTimerRef = useRef<number | null>(null);
  const worksStripScrollSyncTimerRef = useRef<number | null>(null);
  const worksStripNavLockUntilRef = useRef(0);
  const stripProgrammaticScrollRef = useRef(false);
  const worksStripSupportsScrollEndRef = useRef(false);
  const worksArrowSwipePulseRef = useRef(0);
  const stripSwipeArrowRef = useRef({
    gestureId: 0,
    arrowFiredForGestureId: -1,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    suppressTap: false,
  });

  const usesFinePointerHover = useCallback(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  }, []);


  const clearWorksArrowReleaseTimer = useCallback(() => {
    if (worksArrowReleaseTimerRef.current !== null) {
      window.clearTimeout(worksArrowReleaseTimerRef.current);
      worksArrowReleaseTimerRef.current = null;
    }
  }, []);

  const clearWorksStripScrollSyncTimer = useCallback(() => {
    if (worksStripScrollSyncTimerRef.current !== null) {
      window.clearTimeout(worksStripScrollSyncTimerRef.current);
      worksStripScrollSyncTimerRef.current = null;
    }
  }, []);

  const scheduleWorksArrowRelease = useCallback(() => {
    clearWorksArrowReleaseTimer();
    worksArrowReleaseTimerRef.current = window.setTimeout(() => {
      setPressedWorksArrow(null);
      worksArrowReleaseTimerRef.current = null;
    }, reduceMotion ? 0 : WORKS_ARROW_TAP_FEEDBACK_MS);
  }, [clearWorksArrowReleaseTimer, reduceMotion]);

  const triggerWorksArrowFeedback = useCallback(
    (side: "prev" | "next", options?: { fromFinePointerArrow?: boolean }) => {
      if (options?.fromFinePointerArrow && usesFinePointerHover()) return;
      clearWorksArrowReleaseTimer();
      worksArrowSwipePulseRef.current += 1;
      const pulseId = worksArrowSwipePulseRef.current;
      setPressedWorksArrow(null);
      requestAnimationFrame(() => {
        if (worksArrowSwipePulseRef.current !== pulseId) return;
        setPressedWorksArrow(side);
        scheduleWorksArrowRelease();
      });
    },
    [clearWorksArrowReleaseTimer, scheduleWorksArrowRelease, usesFinePointerHover],
  );

  const lockWorksStripScrollSync = useCallback(() => {
    worksStripNavLockUntilRef.current = Date.now() + WORKS_STRIP_PROGRAMMATIC_LOCK_MS;
    stripProgrammaticScrollRef.current = true;
    window.setTimeout(() => {
      stripProgrammaticScrollRef.current = false;
    }, WORKS_STRIP_PROGRAMMATIC_LOCK_MS);
  }, []);

  const resetStripSwipeArrowGesture = useCallback((clientX: number, clientY: number) => {
    const ref = stripSwipeArrowRef.current;
    ref.gestureId += 1;
    ref.startX = clientX;
    ref.startY = clientY;
    ref.lastX = clientX;
    ref.lastY = clientY;
    ref.suppressTap = false;
  }, []);

  const tryFireStripSwipeArrowFromMotion = useCallback(
    (clientX: number, clientY: number) => {
      if (stripProgrammaticScrollRef.current) return false;

      const ref = stripSwipeArrowRef.current;
      if (ref.arrowFiredForGestureId === ref.gestureId) return false;

      ref.lastX = clientX;
      ref.lastY = clientY;

      const dx = clientX - ref.startX;
      const dy = clientY - ref.startY;
      if (Math.abs(dx) >= STRIP_SWIPE_TAP_CANCEL_PX || Math.abs(dy) >= STRIP_SWIPE_TAP_CANCEL_PX) {
        ref.suppressTap = true;
      }
      if (Math.abs(dx) < STRIP_SWIPE_ARROW_THRESHOLD_PX) return false;
      if (Math.abs(dx) < Math.abs(dy)) return false;

      ref.arrowFiredForGestureId = ref.gestureId;
      ref.suppressTap = true;
      triggerWorksArrowFeedback(dx < 0 ? "next" : "prev");
      return true;
    },
    [triggerWorksArrowFeedback],
  );

  const resolveThumbIndexFromStripScroll = useCallback((): number | null => {
    const strip = thumbStripRef.current;
    if (!strip || videos.length <= 1) return null;

    const stripRect = strip.getBoundingClientRect();
    const stripCenter = stripRect.left + stripRect.width / 2;
    let bestIndex = 0;
    let bestDistance = Number.POSITIVE_INFINITY;

    thumbRefs.current.forEach((thumb, index) => {
      if (!thumb) return;
      const thumbRect = thumb.getBoundingClientRect();
      const thumbCenter = thumbRect.left + thumbRect.width / 2;
      const distance = Math.abs(thumbCenter - stripCenter);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = index;
      }
    });

    return bestIndex;
  }, [videos.length]);

  const navigateToWorkIndex = useCallback(
    (
      nextIndex: number,
      options?: {
        arrowSide?: "prev" | "next";
        fromFinePointerArrow?: boolean;
        scrollStrip?: boolean;
        skipArrowFeedback?: boolean;
      },
    ) => {
      const prevIndex = activeVideoIndexRef.current;
      if (nextIndex === prevIndex) return;

      if (options?.arrowSide && !options.skipArrowFeedback) {
        triggerWorksArrowFeedback(options.arrowSide, {
          fromFinePointerArrow: options.fromFinePointerArrow,
        });
      }

      activeVideoIndexRef.current = nextIndex;
      setActiveVideoIndex(nextIndex);

      if (options?.scrollStrip === false) return;

      lockWorksStripScrollSync();
      thumbRefs.current[nextIndex]?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "nearest",
        inline: "center",
      });
    },
    [lockWorksStripScrollSync, reduceMotion, triggerWorksArrowFeedback],
  );

  const syncActiveVideoFromStripScroll = useCallback(() => {
    if (Date.now() < worksStripNavLockUntilRef.current) return;

    const nextIndex = resolveThumbIndexFromStripScroll();
    if (nextIndex === null) return;

    const prevIndex = activeVideoIndexRef.current;
    if (nextIndex === prevIndex) return;

    activeVideoIndexRef.current = nextIndex;
    setActiveVideoIndex(nextIndex);
  }, [resolveThumbIndexFromStripScroll]);

  const queueWorksStripScrollSync = useCallback(() => {
    clearWorksStripScrollSyncTimer();
    worksStripScrollSyncTimerRef.current = window.setTimeout(() => {
      worksStripScrollSyncTimerRef.current = null;
      syncActiveVideoFromStripScroll();
    }, WORKS_STRIP_SCROLL_SYNC_MS);
  }, [clearWorksStripScrollSyncTimer, syncActiveVideoFromStripScroll]);

  const handleWorksArrowPointerDown = useCallback(
    (side: "prev" | "next") => () => {
      triggerWorksArrowFeedback(side, { fromFinePointerArrow: true });
    },
    [triggerWorksArrowFeedback],
  );

  const handleWorksArrowPointerRelease = useCallback(() => {
    if (usesFinePointerHover()) return;
    scheduleWorksArrowRelease();
  }, [scheduleWorksArrowRelease, usesFinePointerHover]);

  const handleSelectAdjacentWork = useCallback(
    (direction: -1 | 1, trigger?: HTMLButtonElement | null) => {
      const prevIndex = activeVideoIndexRef.current;
      const nextIndex = (prevIndex + direction + videos.length) % videos.length;
      navigateToWorkIndex(nextIndex, {
        arrowSide: direction === -1 ? "prev" : "next",
        fromFinePointerArrow: Boolean(trigger),
        skipArrowFeedback: Boolean(trigger) && !usesFinePointerHover(),
      });
      trigger?.blur();
    },
    [navigateToWorkIndex, usesFinePointerHover, videos.length],
  );

  useEffect(() => {
    activeVideoIndexRef.current = activeVideoIndex;
  }, [activeVideoIndex]);

  useEffect(() => {
    const strip = thumbStripRef.current;
    if (!strip || videos.length <= 1) return;

    worksStripSupportsScrollEndRef.current = "onscrollend" in window;

    let activeTouchId: number | null = null;
    let pointerArrowTracking = false;
    let activePointerId: number | null = null;

    const findTouchById = (list: TouchList, id: number) => {
      for (let index = 0; index < list.length; index += 1) {
        if (list[index]?.identifier === id) return list[index];
      }
      return null;
    };

    const onScroll = () => {
      if (Date.now() < worksStripNavLockUntilRef.current) return;
      if (!worksStripSupportsScrollEndRef.current) {
        queueWorksStripScrollSync();
      }
    };

    const onScrollEnd = () => {
      stripProgrammaticScrollRef.current = false;
      queueWorksStripScrollSync();
    };

    const runMotionFromPointerEvent = (event: PointerEvent) => {
      const coalescedEvents =
        typeof event.getCoalescedEvents === "function" ? event.getCoalescedEvents() : [event];
      for (const coalesced of coalescedEvents) {
        if (tryFireStripSwipeArrowFromMotion(coalesced.clientX, coalesced.clientY)) break;
      }
    };

    const handleTouchMotion = (event: TouchEvent) => {
      if (activeTouchId === null) return;
      const touch = findTouchById(event.touches, activeTouchId);
      if (!touch) return;
      tryFireStripSwipeArrowFromMotion(touch.clientX, touch.clientY);
    };

    const onStripTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      activeTouchId = touch.identifier;
      resetStripSwipeArrowGesture(touch.clientX, touch.clientY);
    };

    const onWindowTouchEnd = (event: TouchEvent) => {
      if (activeTouchId === null) return;
      const touch = findTouchById(event.changedTouches, activeTouchId);
      if (!touch) return;
      tryFireStripSwipeArrowFromMotion(touch.clientX, touch.clientY);
      activeTouchId = null;
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" || event.pointerType === "touch") return;
      pointerArrowTracking = true;
      activePointerId = event.pointerId;
      resetStripSwipeArrowGesture(event.clientX, event.clientY);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      if (!pointerArrowTracking || event.pointerId !== activePointerId) return;
      runMotionFromPointerEvent(event);
    };

    const onPointerUp = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      if (event.pointerId !== activePointerId) return;
      tryFireStripSwipeArrowFromMotion(event.clientX, event.clientY);
      pointerArrowTracking = false;
      activePointerId = null;
    };

    strip.addEventListener("scroll", onScroll, { passive: true });
    strip.addEventListener("scrollend", onScrollEnd, { passive: true });
    strip.addEventListener("touchstart", onStripTouchStart, { passive: true });
    strip.addEventListener("touchmove", handleTouchMotion, { passive: true });
    strip.addEventListener("pointerdown", onPointerDown, { passive: true });
    strip.addEventListener("pointermove", onPointerMove, { passive: true });
    strip.addEventListener("pointerup", onPointerUp, { passive: true });
    strip.addEventListener("pointercancel", onPointerUp, { passive: true });
    window.addEventListener("touchmove", handleTouchMotion, { passive: true });
    window.addEventListener("touchend", onWindowTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onWindowTouchEnd, { passive: true });

    return () => {
      strip.removeEventListener("scroll", onScroll);
      strip.removeEventListener("scrollend", onScrollEnd);
      strip.removeEventListener("touchstart", onStripTouchStart);
      strip.removeEventListener("touchmove", handleTouchMotion);
      strip.removeEventListener("pointerdown", onPointerDown);
      strip.removeEventListener("pointermove", onPointerMove);
      strip.removeEventListener("pointerup", onPointerUp);
      strip.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("touchmove", handleTouchMotion);
      window.removeEventListener("touchend", onWindowTouchEnd);
      window.removeEventListener("touchcancel", onWindowTouchEnd);
    };
  }, [
    queueWorksStripScrollSync,
    resetStripSwipeArrowGesture,
    tryFireStripSwipeArrowFromMotion,
    videos.length,
  ]);

  useEffect(() => {
    return () => {
      clearWorksArrowReleaseTimer();
      clearWorksStripScrollSyncTimer();
    };
  }, [clearWorksArrowReleaseTimer, clearWorksStripScrollSyncTimer]);

  useEffect(() => {
    activeVideoIndexRef.current = 0;
    setActiveVideoIndex(0);
    lockWorksStripScrollSync();
    requestAnimationFrame(() => {
      thumbStripRef.current?.scrollTo({ left: 0, behavior: "auto" });
    });
  }, [card.title, lockWorksStripScrollSync]);

  const handleSelectVideo = useCallback((index: number) => {
    navigateToWorkIndex(index, { scrollStrip: false });
  }, [navigateToWorkIndex]);

  const handleThumbSelect = useCallback(
    (index: number) => {
      if (stripSwipeArrowRef.current.suppressTap) return;
      handleSelectVideo(index);
    },
    [handleSelectVideo],
  );

  const handleThumbKeyDown = useCallback(
    (index: number) => (event: React.KeyboardEvent<HTMLElement>) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      handleThumbSelect(index);
    },
    [handleThumbSelect],
  );

  if (!videos.length) return null;

  const safeIndex = Math.min(activeVideoIndex, videos.length - 1);
  const activeVideo = videos[safeIndex] ?? videos[0];
  const activeSelectorTitle = activeVideo.selectorTitle?.trim() || activeVideo.label || "Selected work";
  const activeSelectorSubtitle = activeVideo.selectorSubtitle?.trim() || "";
  const activeDetails = {
    detailOverview: activeVideo.detailOverview?.trim() || card.detailOverview?.trim() || "?",
    detailRole: activeVideo.detailRole?.trim() || card.detailRole?.trim() || "?",
    detailImpact: activeVideo.detailImpact?.trim() || card.detailImpact?.trim() || "?",
    detailTools: activeVideo.detailTools?.length ? activeVideo.detailTools : card.detailTools,
  };

  const worksArrowBtnClass =
    "video-editing-works-arrow absolute top-[2.45rem] z-10 flex h-[1.65rem] w-[1.65rem] items-center justify-center border-0 bg-transparent p-0 text-white/85 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[color:color-mix(in_srgb,var(--palette-yellow-projects)_48%,rgb(186_186_186))] focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:h-[1.925rem] sm:w-[1.925rem]";
  const isInteractiveMedia = card.id === "project-interactive-media";

  return (
    <>
      <motion.div
        className="order-1 mt-0 flex w-full flex-col items-stretch gap-y-1.5 text-left"
        style={
          reduceMotion
            ? { opacity: detailHdrReveal ? 1 : 0 }
            : {
                opacity: detailHdrReveal ? 1 : 0,
                transform: detailHdrReveal
                  ? "translate3d(0,0,0)"
                  : `translate3d(0,${detailHdrSlidePx}px,0)`,
                transition: `opacity ${detailHdrOpacityMs}ms ${detailFadeCubic}, transform ${detailHdrSlideMs}ms ${detailSlideCubic}`,
              }
        }
      >
        <p className="m-0 w-full font-heading text-sm sm:text-base leading-snug tracking-eyebrow-tight uppercase text-[color:color-mix(in_srgb,var(--palette-yellow-projects)_48%,rgb(186_186_186))]">
          Project details
        </p>
        <h3 className="m-0 w-full font-display text-2xl md:text-3xl leading-[1.1] tracking-[-0.015em] text-white">
          {card.title}
        </h3>
        <p className="m-0 w-full pl-[2px] font-body text-sm sm:text-base leading-snug text-mono-2">
          {card.tagline}
        </p>
      </motion.div>
      <motion.div
        className="video-editing-detail order-3 mt-[calc(0.75rem+1px)] w-full min-w-0 max-w-full overflow-x-visible sm:mt-[calc(1rem+1px)] md:mt-[calc(1.25rem+1px)]"
        style={
          reduceMotion
            ? { opacity: detailPlayerReveal ? 1 : 0 }
            : {
                opacity: detailPlayerReveal ? 1 : 0,
                transform: detailPlayerReveal
                  ? "translate3d(0,0,0)"
                  : `translate3d(0,${detailHdrSlidePx}px,0)`,
                transition: `opacity ${detailPlayerOpacityMs}ms ${detailFadeCubic}, transform ${detailHdrSlideMs}ms ${detailSlideCubic}`,
              }
        }
      >
        <div className="video-editing-carousel video-editing-carousel--solo" role="group" aria-label="Featured edits">
          <div className="video-editing-player video-editing-player--plyr group relative overflow-hidden rounded-[11px] ring-1 ring-white/[0.09] sm:rounded-xl">
            <VideoEditingPlyrPlayer
              video={activeVideo}
              className={isInteractiveMedia ? "video-editing-player--interactive-media" : ""}
            />
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/70 via-black/30 to-transparent px-3 pt-2 pb-8 opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100 group-focus-within:opacity-100 sm:px-3.5 sm:pt-2.5">
              <p className="truncate font-body text-[12px] leading-none text-white sm:text-[13px]">
                <span className="font-display tracking-[-0.01em]">{activeSelectorTitle}</span>
                {activeSelectorSubtitle ? <span className="text-mono-2"> · {activeSelectorSubtitle}</span> : null}
              </p>
            </div>
          </div>
          <div className="mt-3 w-full min-w-0 overflow-x-visible">
            <div
              className={
                videos.length > 1
                  ? "relative -mx-4 w-[calc(100%+2rem)] overflow-visible sm:-mx-6 sm:w-[calc(100%+3rem)]"
                  : "relative w-full min-w-0"
              }
            >
              {videos.length > 1 ? (
                <button
                  type="button"
                  className={`${worksArrowBtnClass} video-editing-works-arrow--prev -left-2.5 sm:-left-2${
                    pressedWorksArrow === "prev" ? " video-editing-works-arrow--pressed" : ""
                  }`}
                  aria-label="Previous selected work"
                  onPointerDown={handleWorksArrowPointerDown("prev")}
                  onPointerUp={handleWorksArrowPointerRelease}
                  onPointerCancel={handleWorksArrowPointerRelease}
                  onPointerLeave={handleWorksArrowPointerRelease}
                  onClick={(event) => handleSelectAdjacentWork(-1, event.currentTarget)}
                >
                  <ChevronLeft className="video-editing-works-arrow-glyph h-[0.9625rem] w-[0.9625rem] sm:h-[1.1rem] sm:w-[1.1rem]" strokeWidth={2.25} aria-hidden />
                </button>
              ) : null}
            <div
              ref={thumbStripRef}
              className={`video-editing-works-strip no-scrollbar flex min-w-0 snap-x snap-mandatory gap-2 overflow-x-auto pb-0.5 sm:gap-2.5 touch-pan-x ${
                videos.length > 1
                  ? "mx-4 w-[calc(100%-2rem)] sm:mx-6 sm:w-[calc(100%-3rem)]"
                  : "w-full"
              }`}
            >
              {videos.map((video, index) => {
                const active = index === safeIndex;
                const selectorTitle = video.selectorTitle?.trim() || `Edit ${index + 1}`;
                const selectorSubtitle = video.selectorSubtitle?.trim() || "Video edit";
                const selectorDuration = video.selectorDuration?.trim() || "";
                return (
                  <div
                    key={video.id}
                    ref={(el) => {
                      thumbRefs.current[index] = el;
                    }}
                    role="button"
                    tabIndex={0}
                    className={`video-editing-works-strip-thumb group relative flex shrink-0 snap-start flex-col text-left touch-pan-x cursor-pointer basis-[calc((100%-0.5rem)/2)] sm:basis-[calc((100%-0.625rem)/2)] md:basis-[calc((100%-1.25rem)/3)] lg:basis-[calc((100%-1.875rem)/4)] ${
                      active
                        ? "text-white"
                        : "text-mono-2"
                    }`}
                    aria-label={`Select edit thumbnail ${index + 1}`}
                    aria-pressed={active}
                    onClick={() => handleThumbSelect(index)}
                    onKeyDown={handleThumbKeyDown(index)}
                  >
                    <span
                      className={`relative block h-[4.9rem] w-full overflow-hidden rounded-[10px] border transition-colors ${
                        active
                          ? "border-[color:color-mix(in_srgb,var(--palette-yellow-projects)_70%,white)]"
                          : "border-white/[0.14]"
                      }`}
                    >
                      {video.thumbnailSrc && IMAGE_EXT_RE.test(video.thumbnailSrc) ? (
                        <img
                          src={video.thumbnailSrc}
                          className="absolute inset-0 h-full w-full object-cover"
                          alt=""
                          loading="lazy"
                          decoding="async"
                          aria-hidden
                        />
                      ) : VIDEO_EXT_RE.test(video.thumbnailSrc ?? video.url) ? (
                        <video
                          src={video.thumbnailSrc ?? video.url}
                          className="absolute inset-0 h-full w-full object-cover"
                          muted
                          preload="metadata"
                          playsInline
                          aria-hidden
                        />
                      ) : (
                        <span className="absolute inset-0 bg-black/45" aria-hidden />
                      )}
                      {selectorDuration ? (
                        <span className="absolute right-1.5 bottom-1.5 rounded bg-black/70 px-1 py-[2px] font-mono text-[10px] leading-none text-white">
                          {selectorDuration}
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-1.5 block font-heading text-sm leading-tight uppercase text-white">
                      {selectorTitle}
                    </span>
                    <span className="mt-0.5 block font-body text-[12px] leading-tight text-mono-2">
                      {selectorSubtitle}
                    </span>
                  </div>
                );
              })}
            </div>
              {videos.length > 1 ? (
                <button
                  type="button"
                  className={`${worksArrowBtnClass} video-editing-works-arrow--next -right-2.5 sm:-right-2${
                    pressedWorksArrow === "next" ? " video-editing-works-arrow--pressed" : ""
                  }`}
                  aria-label="Next selected work"
                  onPointerDown={handleWorksArrowPointerDown("next")}
                  onPointerUp={handleWorksArrowPointerRelease}
                  onPointerCancel={handleWorksArrowPointerRelease}
                  onPointerLeave={handleWorksArrowPointerRelease}
                  onClick={(event) => handleSelectAdjacentWork(1, event.currentTarget)}
                >
                  <ChevronRight className="video-editing-works-arrow-glyph h-[0.9625rem] w-[0.9625rem] sm:h-[1.1rem] sm:w-[1.1rem]" strokeWidth={2.25} aria-hidden />
                </button>
              ) : null}
            </div>
            <motion.div className="w-full pt-2.5 sm:pt-3" aria-hidden>
              <motion.div
                className="mx-auto block h-px w-full max-w-full shrink-0 bg-white/[0.09]"
                style={{
                  clipPath: detailRuleReveal ? "inset(0 0 0 0)" : "inset(0 50% 0 50%)",
                  ...(reduceMotion
                    ? {}
                    : detailRuleReveal
                      ? {
                          transitionProperty: "clip-path",
                          transitionDuration: `${detailRuleExpandMs}ms`,
                          transitionTimingFunction: detailSlideCubic,
                        }
                      : {}),
                }}
              />
            </motion.div>
          </div>
          <div className="mt-3.5 w-full min-w-0 sm:mt-4">
            <div className="flex w-full min-w-0 flex-col items-stretch gap-y-1.5 text-left">
              <p className="m-0 w-full font-heading text-sm sm:text-base leading-snug tracking-eyebrow-tight uppercase text-[color:color-mix(in_srgb,var(--palette-yellow-projects)_48%,rgb(186_186_186))]">
                Now playing
              </p>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeVideo.id}
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0 }}
                  transition={
                    reduceMotion
                      ? undefined
                      : {
                          duration: 0.22,
                          ease: [0.22, 1, 0.36, 1],
                        }
                  }
                  className="flex w-full min-w-0 flex-col items-stretch gap-y-1.5 text-left"
                >
                  <h3 className="m-0 w-full font-display text-2xl md:text-3xl leading-[1.1] tracking-[-0.015em] text-white">
                    {activeSelectorTitle}
                  </h3>
                  {activeSelectorSubtitle ? (
                    <p className="m-0 w-full pl-[2px] font-body text-sm sm:text-base leading-snug text-mono-2">
                      {activeSelectorSubtitle}
                    </p>
                  ) : null}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
        <div className="mt-3.5 w-full min-w-0 sm:mt-4">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeVideo.id}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
              transition={
                reduceMotion
                  ? undefined
                  : {
                      duration: 0.22,
                      ease: [0.22, 1, 0.36, 1],
                    }
              }
              className="flex flex-col gap-2 sm:gap-3"
            >
              <div className="grid grid-cols-1 gap-2 sm:gap-3 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                <section className={`${showcaseDetailCardClass} min-w-0`}>
                  <p className="mb-1.5 font-heading text-xs leading-snug tracking-eyebrow-tight uppercase text-[color:color-mix(in_srgb,var(--palette-yellow-projects)_48%,rgb(186_186_186))]">
                    OVERVIEW
                  </p>
                  <p className="whitespace-pre-line font-body text-sm leading-snug text-mono-2 sm:text-base">
                    {activeDetails.detailOverview}
                  </p>
                </section>
                <section className={`${showcaseDetailCardClass} min-w-0`}>
                  <p className="mb-1.5 font-heading text-xs leading-snug tracking-eyebrow-tight uppercase text-[color:color-mix(in_srgb,var(--palette-yellow-projects)_48%,rgb(186_186_186))]">
                    ROLE
                  </p>
                  <p className="whitespace-pre-line font-body text-sm leading-snug text-mono-2 sm:text-base">
                    {activeDetails.detailRole}
                  </p>
                </section>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:gap-3 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                <section className={`${showcaseDetailCardClass} min-w-0`}>
                  <p className="mb-1.5 font-heading text-xs leading-snug tracking-eyebrow-tight uppercase text-[color:color-mix(in_srgb,var(--palette-yellow-projects)_48%,rgb(186_186_186))]">
                    IMPACT
                  </p>
                  <p className="whitespace-pre-line font-body text-sm leading-snug text-mono-2 sm:text-base">
                    {activeDetails.detailImpact}
                  </p>
                </section>
                <section className={`${showcaseDetailCardClass} min-w-0`}>
                  <p className="mb-1.5 font-heading text-xs leading-snug tracking-eyebrow-tight uppercase text-[color:color-mix(in_srgb,var(--palette-yellow-projects)_48%,rgb(186_186_186))]">
                    TOOLS
                  </p>
                  {activeDetails.detailTools?.length ? (
                    <ul className="ml-1 list-disc list-outside space-y-1 pl-6 marker:text-mono-2/70 sm:pl-7">
                      {activeDetails.detailTools.map((tool, index) => (
                        <li key={`${tool}-${index}`} className="font-body text-sm leading-snug text-mono-2 sm:text-base">
                          {tool}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="font-body text-sm text-mono-2/55 sm:text-base">?</p>
                  )}
                </section>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}
