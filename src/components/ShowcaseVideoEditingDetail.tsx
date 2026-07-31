import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
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

function isImageMedia(video: ShowcaseDetailVideo): boolean {
  return IMAGE_EXT_RE.test(video.url);
}

function VideoEditingImagePlayer({
  video,
  focalPoint = "50% 50%",
  className = "",
}: {
  video: ShowcaseDetailVideo;
  focalPoint?: string;
  className?: string;
}) {
  const src = isImageMedia(video) ? video.url : video.thumbnailSrc;
  if (!src || !IMAGE_EXT_RE.test(src)) return null;

  return (
    <div className={`relative aspect-video w-full ${className}`.trim()}>
      <img
        src={src}
        alt={video.selectorTitle?.trim() || video.label}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: focalPoint }}
        decoding="async"
      />
    </div>
  );
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
    readonly focalPoint?: string;
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

/** Desktop + iPad landscape use the same tabbed right-column detail treatment. */
const PROJECTS_TABBED_DETAIL_MQ =
  "((min-width: 1024px) and (pointer: fine)), (min-width: 1367px), ((min-width: 768px) and (max-width: 1366px) and (orientation: landscape))";

const DETAIL_CARD_TAB_IDS = ["overview", "role", "impact", "tools"] as const;
type DetailCardTabId = (typeof DETAIL_CARD_TAB_IDS)[number];

const DETAIL_CARD_TAB_LABEL: Record<DetailCardTabId, string> = {
  overview: "OVERVIEW",
  role: "ROLE",
  impact: "IMPACT",
  tools: "TOOLS",
};

/** Move `nextTabId` to index 0; the previous first tab takes its vacated slot. */
function swapDetailTabToFront(
  order: readonly DetailCardTabId[],
  nextTabId: DetailCardTabId,
): DetailCardTabId[] {
  const fromIdx = order.indexOf(nextTabId);
  if (fromIdx <= 0) return [...order];
  const next = [...order];
  const displaced = next[0]!;
  next[0] = nextTabId;
  next[fromIdx] = displaced;
  return next;
}

/** Tab header FLIP travel — slightly longer / softer than DUR.fast. */
const DETAIL_TAB_SWAP_DUR_S = 0.42;
const DETAIL_TAB_SWAP_EASE = [0.22, 1, 0.36, 1] as const;
/**
 * Body copy fades out while headers start travelling.
 * Fade-in is delayed (mode="wait" exit + this delay) so copy appears only after headers settle.
 */
const DETAIL_TAB_BODY_OUT_S = 0.16;
const DETAIL_TAB_BODY_IN_S = 0.24;
const DETAIL_TAB_BODY_IN_DELAY_S = Math.max(0, DETAIL_TAB_SWAP_DUR_S - DETAIL_TAB_BODY_OUT_S);
/** Yellow underline draw / retract — same length as tab FLIP; starts only after position settles. */
const DETAIL_TAB_UNDERLINE_DUR_MS = Math.round(DETAIL_TAB_SWAP_DUR_S * 1000);

/** iPad landscape filler — sized to fill the tab card down to the video player bottom. */
const IPAD_DETAIL_CARD_LOREM: Record<DetailCardTabId, string> = {
  overview:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nInteger vitae justo eget magna fermentum iaculis eu non diam. Pharetra diam sit amet nisl suscipit adipiscing bibendum est ultricies. Dictumst quisque sagittis purus sit amet volutpat consequat mauris nunc.\n\nMorbi tincidunt ornare massa eget egestas purus viverra accumsan. Nisl rhoncus mattis rhoncus urna neque viverra justo nec ultrices. Amet nisl suscipit adipiscing bibendum est ultricies integer quis.",
  role:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lectus magna fringilla urna porttitor rhoncus dolor purus non enim.\n\nPraesent elementum facilisis leo vel fringilla est ullamcorper eget nulla. Nunc scelerisque viverra mauris in aliquam sem fringilla ut. Eget nullam non nisi est sit amet facilisis magna etiam.\n\nViverra nam libero justo laoreet sit amet cursus sit. Mattis ullamcorper velit sed ullamcorper morbi tincidunt ornare massa eget.\n\nFeugiat in fermentum posuere urna nec tincidunt praesent semper feugiat. Tellus mauris a diam maecenas sed enim ut sem. Tristique et egestas quis ipsum suspendisse ultrices gravida dictum fusce.",
  impact:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Facilisis volutpat est velit egestas dui id ornare arcu odio. Semper auctor neque vitae tempus quam pellentesque nec nam.\n\nTurpis egestas maecenas pharetra convallis posuere morbi leo urna molestie. Amet venenatis urna cursus eget nunc scelerisque viverra mauris. Id ornare arcu odio ut sem nulla pharetra diam.\n\nSit amet nisl suscipit adipiscing bibendum est ultricies integer. Volutpat ac tincidunt vitae semper quis lectus nulla at volutpat.\n\nElit eget gravida cum sociis natoque penatibus et magnis dis. Faucibus ornare suspendisse sed nisi lacus sed viverra tellus. Netus et malesuada fames ac turpis egestas integer eget aliquet.",
  tools:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ultrices gravida dictum fusce ut placerat orci nulla pellentesque dignissim.\n\nEnim ut tellus elementum sagittis vitae et leo duis ut. Aenean et tortor at risus viverra adipiscing at in. Tempus imperdiet nulla malesuada pellentesque elit eget gravida cum sociis.",
};

const IPAD_DETAIL_TOOLS_LOREM = [
  "Lorem ipsum dolor sit",
  "Consectetur adipiscing elit",
  "Sed do eiusmod tempor",
  "Ut labore et dolore magna",
  "Quis nostrud exercitation",
  "Ullamco laboris nisi",
] as const;

function matchesProjectsTabbedDetailViewport() {
  return typeof window !== "undefined" && window.matchMedia(PROJECTS_TABBED_DETAIL_MQ).matches;
}

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
  const [isIpadLandscapeViewport, setIsIpadLandscapeViewport] = useState(
    matchesProjectsTabbedDetailViewport,
  );
  const [activeDetailCardTab, setActiveDetailCardTab] = useState<DetailCardTabId>("overview");
  const [detailCardTabOrder, setDetailCardTabOrder] = useState<DetailCardTabId[]>(() => [
    ...DETAIL_CARD_TAB_IDS,
  ]);
  /**
   * Yellow underline: deselected tab retracts immediately; selected tab draws only after FLIP settles.
   * `null` = no bar (mid-transition after deselection).
   */
  const [underlineTabId, setUnderlineTabId] = useState<DetailCardTabId | null>("overview");
  const underlineActiveTabRef = useRef<DetailCardTabId>("overview");
  const [detailCardMinHeightPx, setDetailCardMinHeightPx] = useState<number | null>(null);
  const detailRootRef = useRef<HTMLDivElement | null>(null);
  const detailCardSurfaceRef = useRef<HTMLElement | null>(null);
  const pendingPortraitTabAnchorRef = useRef<{
    scrollParent: HTMLElement;
    offset: number;
  } | null>(null);
  const [pressedWorksArrow, setPressedWorksArrow] = useState<"prev" | "next" | null>(null);
  const thumbRefs = useRef<Array<HTMLElement | null>>([]);
  const thumbStripRef = useRef<HTMLDivElement | null>(null);
  const activeVideoIndexRef = useRef(0);
  const worksArrowReleaseTimerRef = useRef<number | null>(null);
  const worksStripScrollSyncTimerRef = useRef<number | null>(null);
  const worksStripProgrammaticUnlockTimerRef = useRef<number | null>(null);
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

  useEffect(() => {
    const mq = window.matchMedia(PROJECTS_TABBED_DETAIL_MQ);
    const onChange = () => setIsIpadLandscapeViewport(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    setActiveDetailCardTab("overview");
    setDetailCardTabOrder([...DETAIL_CARD_TAB_IDS]);
    setUnderlineTabId("overview");
    underlineActiveTabRef.current = "overview";
  }, [activeVideoIndex, card.id]);

  useEffect(() => {
    if (reduceMotion) {
      underlineActiveTabRef.current = activeDetailCardTab;
      setUnderlineTabId(activeDetailCardTab);
      return;
    }

    if (underlineActiveTabRef.current === activeDetailCardTab) return;
    underlineActiveTabRef.current = activeDetailCardTab;

    // Deselected tab: start closing the bar immediately while it travels.
    setUnderlineTabId(null);

    const timerId = window.setTimeout(() => {
      setUnderlineTabId(activeDetailCardTab);
    }, DETAIL_TAB_UNDERLINE_DUR_MS);

    return () => window.clearTimeout(timerId);
  }, [activeDetailCardTab, reduceMotion]);

  useEffect(() => {
    if (!isIpadLandscapeViewport) {
      setDetailCardMinHeightPx(null);
      return;
    }

    const root = detailRootRef.current;
    if (!root) return;

    const syncDetailCardHeightToPlayer = () => {
      const player = root.querySelector(".video-editing-player");
      const cardEl = detailCardSurfaceRef.current;
      if (!player || !cardEl) return;
      const playerBottom = player.getBoundingClientRect().bottom;
      const cardTop = cardEl.getBoundingClientRect().top;
      const next = Math.max(0, Math.round(playerBottom - cardTop));
      setDetailCardMinHeightPx((prev) => (prev === next ? prev : next));
    };

    syncDetailCardHeightToPlayer();
    const raf = window.requestAnimationFrame(syncDetailCardHeightToPlayer);
    const player = root.querySelector(".video-editing-player");
    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => syncDetailCardHeightToPlayer())
        : null;
    if (player && resizeObserver) resizeObserver.observe(player);
    if (detailCardSurfaceRef.current && resizeObserver) {
      resizeObserver.observe(detailCardSurfaceRef.current);
    }
    window.addEventListener("resize", syncDetailCardHeightToPlayer);
    window.addEventListener("orientationchange", syncDetailCardHeightToPlayer);

    return () => {
      window.cancelAnimationFrame(raf);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", syncDetailCardHeightToPlayer);
      window.removeEventListener("orientationchange", syncDetailCardHeightToPlayer);
    };
  }, [
    isIpadLandscapeViewport,
    activeDetailCardTab,
    activeVideoIndex,
    detailPlayerReveal,
    card.id,
  ]);

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

  const clearWorksStripProgrammaticUnlockTimer = useCallback(() => {
    if (worksStripProgrammaticUnlockTimerRef.current !== null) {
      window.clearTimeout(worksStripProgrammaticUnlockTimerRef.current);
      worksStripProgrammaticUnlockTimerRef.current = null;
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
    clearWorksStripProgrammaticUnlockTimer();
    worksStripProgrammaticUnlockTimerRef.current = window.setTimeout(() => {
      stripProgrammaticScrollRef.current = false;
      worksStripProgrammaticUnlockTimerRef.current = null;
    }, WORKS_STRIP_PROGRAMMATIC_LOCK_MS);
  }, [clearWorksStripProgrammaticUnlockTimer]);

  useEffect(() => {
    return () => {
      clearWorksArrowReleaseTimer();
      clearWorksStripScrollSyncTimer();
      clearWorksStripProgrammaticUnlockTimer();
    };
  }, [
    clearWorksArrowReleaseTimer,
    clearWorksStripProgrammaticUnlockTimer,
    clearWorksStripScrollSyncTimer,
  ]);

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

  const isInteractiveMedia = card.id === "project-interactive-media";
  const matchInteractiveMediaChrome =
    isInteractiveMedia || card.id === "project-video-editing";
  const isSlaywire = card.id === "project-slaywire";

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
    "video-editing-works-arrow absolute top-[2.45rem] z-10 flex h-[1.65rem] w-[1.65rem] items-center justify-center border-0 bg-transparent p-0 text-white/85 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--palette-yellow-projects)] focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:h-[1.925rem] sm:w-[1.925rem]";
  const worksStripThumbBasisClass = matchInteractiveMediaChrome
    ? "basis-[calc((100%-0.5rem)/2)] sm:basis-[calc((100%-0.625rem)/2)] md:basis-[calc((100%-1.25rem)/3)] lg:basis-[calc((100%-1.25rem)/3)]"
    : "basis-[calc((100%-0.5rem)/2)] sm:basis-[calc((100%-0.625rem)/2)] md:basis-[calc((100%-1.25rem)/3)] lg:basis-[calc((100%-1.875rem)/4)]";
  const worksStripOuterClass =
    videos.length > 1
      ? matchInteractiveMediaChrome
        ? "relative -mx-5 w-[calc(100%+2.5rem)] overflow-visible sm:-mx-7 sm:w-[calc(100%+3.5rem)]"
        : "relative -mx-4 w-[calc(100%+2rem)] overflow-visible sm:-mx-6 sm:w-[calc(100%+3rem)]"
      : "relative w-full min-w-0";
  const worksStripClass =
    videos.length > 1
      ? matchInteractiveMediaChrome
        ? "mx-5 w-[calc(100%-2.5rem)] sm:mx-7 sm:w-[calc(100%-3.5rem)]"
        : "mx-4 w-[calc(100%-2rem)] sm:mx-6 sm:w-[calc(100%-3rem)]"
      : "w-full";
  const worksArrowPrevOffsetClass = matchInteractiveMediaChrome
    ? "left-[-6px] sm:left-0"
    : "-left-[14px] sm:-left-2";
  const worksArrowNextOffsetClass = matchInteractiveMediaChrome
    ? "right-[-6px] sm:right-0"
    : "-right-[14px] sm:-right-2";

  const renderPortraitDetailTabBody = (tabId: DetailCardTabId) => {
    if (tabId === "overview") {
      return (
        <p className="m-0 whitespace-pre-line font-body text-sm leading-snug text-mono-2 sm:text-base">
          {activeDetails.detailOverview}
        </p>
      );
    }

    if (tabId === "role") {
      return (
        <p className="m-0 whitespace-pre-line font-body text-sm leading-snug text-mono-2 sm:text-base">
          {activeDetails.detailRole}
        </p>
      );
    }

    if (tabId === "impact") {
      return (
        <p className="m-0 whitespace-pre-line font-body text-sm leading-snug text-mono-2 sm:text-base">
          {activeDetails.detailImpact}
        </p>
      );
    }

    if (activeDetails.detailTools?.length) {
      return (
        <ul className="ml-1 mb-0 list-disc list-outside space-y-1 pl-6 marker:text-mono-2/70 sm:pl-7">
          {activeDetails.detailTools.map((tool, index) => (
            <li
              key={`${tool}-${index}`}
              className="font-body text-sm leading-snug text-mono-2 sm:text-base"
            >
              {tool}
            </li>
          ))}
        </ul>
      );
    }

    return <p className="m-0 font-body text-sm text-mono-2/55 sm:text-base">?</p>;
  };

  const renderIpadDetailTabBody = (tabId: DetailCardTabId) => {
    if (tabId === "tools") {
      return (
        <>
          <p className="mb-2 whitespace-pre-line font-body text-sm leading-snug text-mono-2 sm:text-base">
            {IPAD_DETAIL_CARD_LOREM.tools}
          </p>
          <ul className="ml-1 mb-0 list-disc list-outside space-y-1 pl-6 marker:text-mono-2/70 sm:pl-7">
            {IPAD_DETAIL_TOOLS_LOREM.map((tool, index) => (
              <li
                key={`${tool}-${index}`}
                className="font-body text-sm leading-snug text-mono-2 sm:text-base"
              >
                {tool}
              </li>
            ))}
          </ul>
        </>
      );
    }

    return (
      <p className="m-0 whitespace-pre-line font-body text-sm leading-snug text-mono-2 sm:text-base">
        {IPAD_DETAIL_CARD_LOREM[tabId]}
      </p>
    );
  };

  const renderDetailCardTabBody = (tabId: DetailCardTabId, variant: "portrait" | "ipad") => (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={tabId}
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={
          reduceMotion
            ? undefined
            : {
                opacity: 0,
                transition: {
                  duration: DETAIL_TAB_BODY_OUT_S,
                  ease: DETAIL_TAB_SWAP_EASE,
                },
              }
        }
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                duration: DETAIL_TAB_BODY_IN_S,
                delay: DETAIL_TAB_BODY_IN_DELAY_S,
                ease: DETAIL_TAB_SWAP_EASE,
              }
        }
        className="video-editing-detail-card-tab-body min-w-0"
      >
        {variant === "ipad" ? renderIpadDetailTabBody(tabId) : renderPortraitDetailTabBody(tabId)}
      </motion.div>
    </AnimatePresence>
  );

  const capturePortraitTabScrollAnchor = useCallback(() => {
    if (isIpadLandscapeViewport) {
      pendingPortraitTabAnchorRef.current = null;
      return;
    }

    const anchorEl = detailCardSurfaceRef.current ?? detailRootRef.current;
    if (!anchorEl) {
      pendingPortraitTabAnchorRef.current = null;
      return;
    }

    const scrollParent =
      anchorEl.closest<HTMLElement>('[aria-label^="Section:"]') ??
      (() => {
        let current = anchorEl.parentElement;
        while (current) {
          const style = window.getComputedStyle(current);
          if (/(auto|scroll|overlay)/.test(style.overflowY)) {
            return current;
          }
          current = current.parentElement;
        }
        return document.scrollingElement instanceof HTMLElement
          ? document.scrollingElement
          : null;
      })();

    if (!scrollParent) {
      pendingPortraitTabAnchorRef.current = null;
      return;
    }

    pendingPortraitTabAnchorRef.current = {
      scrollParent,
      offset:
        anchorEl.getBoundingClientRect().top - scrollParent.getBoundingClientRect().top,
    };
  }, [isIpadLandscapeViewport]);

  const handleDetailCardTabChange = useCallback(
    (nextTabId: DetailCardTabId) => {
      if (nextTabId === activeDetailCardTab) return;

      setDetailCardTabOrder((prev) => swapDetailTabToFront(prev, nextTabId));

      if (isIpadLandscapeViewport) {
        setActiveDetailCardTab(nextTabId);
        return;
      }

      capturePortraitTabScrollAnchor();
      setActiveDetailCardTab(nextTabId);
    },
    [activeDetailCardTab, capturePortraitTabScrollAnchor, isIpadLandscapeViewport],
  );

  const focusDetailCardTab = useCallback((tabId: DetailCardTabId) => {
    requestAnimationFrame(() => {
      document.getElementById(`video-detail-tab-${tabId}`)?.focus({ preventScroll: true });
    });
  }, []);

  const renderDetailCardTabList = () => (
    <LayoutGroup id="video-detail-card-tabs">
      <div
        className="video-editing-detail-card-tablist flex w-full min-w-0 shrink-0 items-stretch justify-between gap-0 border-b border-transparent"
        role="tablist"
        aria-label="Project detail sections"
        onKeyDown={(event) => {
          const idx = detailCardTabOrder.findIndex((id) => id === activeDetailCardTab);
          if (idx < 0) return;
          let next = idx;
          if (event.key === "ArrowRight" || event.key === "ArrowDown") {
            next = (idx + 1) % detailCardTabOrder.length;
          } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
            next = (idx - 1 + detailCardTabOrder.length) % detailCardTabOrder.length;
          } else if (event.key === "Home") {
            next = 0;
          } else if (event.key === "End") {
            next = detailCardTabOrder.length - 1;
          } else {
            return;
          }
          event.preventDefault();
          const nextId = detailCardTabOrder[next];
          if (!nextId) return;
          handleDetailCardTabChange(nextId);
          focusDetailCardTab(nextId);
        }}
      >
        {detailCardTabOrder.map((tabId) => {
          const selected = activeDetailCardTab === tabId;
          const underlineActive = underlineTabId === tabId;
          return (
            <motion.button
              key={tabId}
              type="button"
              role="tab"
              id={`video-detail-tab-${tabId}`}
              aria-selected={selected}
              aria-controls={`video-detail-panel-${tabId}`}
              tabIndex={selected ? 0 : -1}
              layout={reduceMotion ? false : "position"}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : {
                      layout: {
                        type: "tween",
                        duration: DETAIL_TAB_SWAP_DUR_S,
                        ease: DETAIL_TAB_SWAP_EASE,
                      },
                    }
              }
              className={`video-editing-detail-card-tab relative flex min-w-0 flex-none items-end justify-center px-0.5 pb-0 pt-0.5 text-center font-heading text-[0.625rem] leading-none tracking-eyebrow-tight uppercase transition-colors duration-[420ms] ease-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--palette-yellow-projects)] focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:text-[0.6875rem] ${
                selected
                  ? "text-[color:var(--palette-yellow-projects)]"
                  : "text-mono-2/70 hover:text-[color:var(--palette-yellow-projects)]"
              }`}
              onMouseDown={(event) => {
                if (event.button !== 0) return;
                capturePortraitTabScrollAnchor();
                event.preventDefault();
              }}
              onClick={() => {
                handleDetailCardTabChange(tabId);
                focusDetailCardTab(tabId);
              }}
            >
              <span className="relative inline-block w-max pb-2">
                {DETAIL_CARD_TAB_LABEL[tabId]}
                <span
                  className={`video-editing-detail-card-tab-underline pointer-events-none absolute inset-x-0 bottom-0 h-px origin-center bg-[color:var(--palette-yellow-projects)] ease-out ${
                    underlineActive ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                  }`}
                  style={{
                    // Always list both so close can fade; open uses 0ms opacity (scale only).
                    transitionProperty: "transform, opacity",
                    transitionDuration: reduceMotion
                      ? "0ms, 0ms"
                      : underlineActive
                        ? `${DETAIL_TAB_UNDERLINE_DUR_MS}ms, 0ms`
                        : `${DETAIL_TAB_UNDERLINE_DUR_MS}ms, ${DETAIL_TAB_UNDERLINE_DUR_MS}ms`,
                  }}
                  aria-hidden
                />
              </span>
            </motion.button>
          );
        })}
      </div>
    </LayoutGroup>
  );

  useLayoutEffect(() => {
    if (isIpadLandscapeViewport) {
      pendingPortraitTabAnchorRef.current = null;
      return;
    }

    const pending = pendingPortraitTabAnchorRef.current;
    if (!pending) return;

    const applyAnchorCorrection = () => {
      const anchorEl = detailCardSurfaceRef.current;
      if (!anchorEl) return;
      const newOffset =
        anchorEl.getBoundingClientRect().top - pending.scrollParent.getBoundingClientRect().top;
      const delta = newOffset - pending.offset;
      if (Math.abs(delta) > 0.5) {
        pending.scrollParent.scrollTop += delta;
      }
      pending.offset =
        anchorEl.getBoundingClientRect().top - pending.scrollParent.getBoundingClientRect().top;
    };

    applyAnchorCorrection();

    let raf2 = 0;
    const raf1 = window.requestAnimationFrame(() => {
      applyAnchorCorrection();
      raf2 = window.requestAnimationFrame(() => {
        applyAnchorCorrection();
        pendingPortraitTabAnchorRef.current = null;
      });
    });

    return () => {
      window.cancelAnimationFrame(raf1);
      window.cancelAnimationFrame(raf2);
    };
  }, [activeDetailCardTab, isIpadLandscapeViewport]);

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
        <p className="project-detail-main-eyebrow m-0 w-full font-heading text-sm sm:text-base leading-snug tracking-eyebrow-tight uppercase text-[color:var(--palette-yellow-projects)]">
          Project details
        </p>
        <h3 className="m-0 w-full font-display text-2xl md:text-3xl leading-[1.1] tracking-[-0.015em] text-white">
          {card.title}
        </h3>
        <p className="project-detail-main-subtitle m-0 w-full font-body text-sm sm:text-base leading-snug text-mono-2">
          {card.tagline}
        </p>
      </motion.div>
      <motion.div
        ref={detailRootRef}
        className={`video-editing-detail order-3 mt-[calc(0.75rem+1px)] w-full min-w-0 max-w-full overflow-x-visible sm:mt-[calc(1rem+1px)] md:mt-[calc(1.25rem+1px)]${
          isInteractiveMedia ? " video-editing-detail--interactive-media" : ""
        }${isSlaywire ? " video-editing-detail--slaywire" : ""}`}
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
        <div
          className="video-editing-carousel video-editing-carousel--solo"
          role="group"
          aria-label={isSlaywire ? "Selected media" : "Featured edits"}
        >
          <div className="video-editing-detail-body">
            <div className="video-editing-detail-media-col min-w-0">
              <div
                className={`video-editing-player video-editing-player--plyr group relative overflow-hidden rounded-[11px] sm:rounded-xl${
                  matchInteractiveMediaChrome
                    ? " border border-solid border-[color:var(--portfolio-glass-stroke)] shadow-[var(--portfolio-glass-shadow)]"
                    : " ring-1 ring-white/[0.09]"
                }${matchInteractiveMediaChrome ? " video-editing-player--interactive-media" : ""}${
                  isImageMedia(activeVideo) ? " video-editing-player--image" : ""
                }`}
              >
                {isImageMedia(activeVideo) ? (
                  <VideoEditingImagePlayer
                    video={activeVideo}
                    focalPoint={card.focalPoint ?? "50% 50%"}
                  />
                ) : (
                  <VideoEditingPlyrPlayer video={activeVideo} />
                )}
                <div className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/70 via-black/30 to-transparent px-3 pt-2 pb-8 opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100 group-focus-within:opacity-100 sm:px-3.5 sm:pt-2.5">
                  <p className="truncate font-body text-[12px] leading-none text-white sm:text-[13px]">
                    <span className="font-display tracking-[-0.01em]">{activeSelectorTitle}</span>
                    {activeSelectorSubtitle ? <span className="text-mono-2"> · {activeSelectorSubtitle}</span> : null}
                  </p>
                </div>
              </div>
              <div className="video-editing-detail-works mt-3 w-full min-w-0 overflow-x-visible">
                <div className={worksStripOuterClass}>
                  {videos.length > 1 ? (
                    <button
                      type="button"
                      className={`${worksArrowBtnClass} video-editing-works-arrow--prev ${worksArrowPrevOffsetClass}${
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
                    className={`video-editing-works-strip no-scrollbar flex min-w-0 snap-x snap-mandatory gap-2 overflow-x-auto pb-0.5 sm:gap-2.5 touch-pan-x ${worksStripClass}`}
                  >
                    {videos.map((video, index) => {
                      const active = index === safeIndex;
                      const selectorTitle = video.selectorTitle?.trim() || `Edit ${index + 1}`;
                      const selectorSubtitle =
                        video.selectorSubtitle?.trim() || (isSlaywire ? "Illustration" : "Video edit");
                      const selectorDuration = video.selectorDuration?.trim() || "";
                      return (
                        <div
                          key={video.id}
                          ref={(el) => {
                            thumbRefs.current[index] = el;
                          }}
                          role="button"
                          tabIndex={0}
                          className={`video-editing-works-strip-thumb group relative flex shrink-0 snap-start flex-col text-left touch-pan-x cursor-pointer ${worksStripThumbBasisClass} ${
                            active ? "text-white" : "text-mono-2"
                          }`}
                          aria-label={`Select ${isSlaywire ? "media" : "edit"} thumbnail ${index + 1}`}
                          aria-pressed={active}
                          onClick={() => handleThumbSelect(index)}
                          onKeyDown={handleThumbKeyDown(index)}
                        >
                          <span
                            className={`video-editing-works-strip-thumb-art relative block h-[4.9rem] w-full overflow-hidden rounded-[10px] border transition-colors ${
                              active
                                ? "border-[color:var(--palette-yellow-projects)]"
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
                          <span className="video-editing-works-strip-thumb-caption">
                            <span className="mt-1.5 block font-heading text-sm leading-tight uppercase text-white">
                              {selectorTitle}
                            </span>
                            <span className="mt-0.5 block font-body text-[12px] leading-tight text-mono-2">
                              {selectorSubtitle}
                            </span>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  {videos.length > 1 ? (
                    <button
                      type="button"
                      className={`${worksArrowBtnClass} video-editing-works-arrow--next ${worksArrowNextOffsetClass}${
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
              </div>
            </div>

            <div className="video-editing-detail-meta-col w-full min-w-0">
              <motion.div className="video-editing-detail-divider-wrap w-full pt-2.5 sm:pt-3" aria-hidden>
                <motion.div
                  className="video-editing-detail-divider mx-auto block h-px w-full max-w-full shrink-0 bg-white/[0.09]"
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
              {isIpadLandscapeViewport ? (
                <>
                  <div className="video-editing-detail-now-playing w-full min-w-0">
                    <div className="flex w-full min-w-0 flex-col items-stretch gap-y-1.5 text-left">
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
                <section
                  ref={detailCardSurfaceRef}
                  className={`${showcaseDetailCardClass} video-editing-detail-meta-card mt-3.5 flex min-h-0 w-full min-w-0 flex-col overflow-hidden px-0 py-0 sm:mt-4 sm:px-0 sm:py-0`}
                  style={
                    detailCardMinHeightPx != null
                      ? {
                          height: `${detailCardMinHeightPx}px`,
                          minHeight: `${detailCardMinHeightPx}px`,
                          maxHeight: `${detailCardMinHeightPx}px`,
                        }
                      : undefined
                  }
                >
                  <div className="video-editing-detail-overview w-full min-w-0">
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
                        className="video-editing-detail-cards-tabs flex min-h-0 w-full min-w-0 flex-1 flex-col gap-2.5"
                      >
                        {renderDetailCardTabList()}
                        <div
                          role="tabpanel"
                          id={`video-detail-panel-${activeDetailCardTab}`}
                          aria-labelledby={`video-detail-tab-${activeDetailCardTab}`}
                          className="video-editing-detail-card-tabpanel min-h-0 min-w-0 flex-1 overflow-y-auto no-scrollbar"
                        >
                          <div className="video-editing-detail-card-tab-surface min-w-0">
                            {renderDetailCardTabBody(activeDetailCardTab, "ipad")}
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </section>
                </>
              ) : (
                <>
              <div className="video-editing-detail-now-playing mt-3.5 w-full min-w-0 sm:mt-4">
                <div className="flex w-full min-w-0 flex-col items-stretch gap-y-1.5 text-left">
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
              <section
                ref={detailCardSurfaceRef}
                className={`${showcaseDetailCardClass} video-editing-detail-meta-card mt-3.5 flex w-full min-w-0 flex-col overflow-hidden [overflow-anchor:none] sm:mt-4`}
              >
                <div className="video-editing-detail-overview w-full min-w-0">
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
                      className="video-editing-detail-cards-tabs flex w-full min-w-0 flex-col gap-2.5"
                    >
                      {renderDetailCardTabList()}
                      <div
                        role="tabpanel"
                        id={`video-detail-panel-${activeDetailCardTab}`}
                        aria-labelledby={`video-detail-tab-${activeDetailCardTab}`}
                        className="video-editing-detail-card-tabpanel min-w-0"
                      >
                        <div className="video-editing-detail-card-tab-surface min-w-0 pt-1">
                          {renderDetailCardTabBody(activeDetailCardTab, "portrait")}
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </section>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
