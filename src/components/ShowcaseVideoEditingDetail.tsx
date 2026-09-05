import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type Ref } from "react";
import { flushSync } from "react-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import Plyr from "plyr";
import type { Options as PlyrOptions } from "plyr";
import "plyr/dist/plyr.css";
import { directionalArrowIdlePhaseDelaySec } from "@/lib/motion";

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
  "profile-card-surface relative rounded-sm sm:rounded-xl px-3 py-3 sm:px-4 sm:py-3.5";

/**
 * Desktop landscape + large desktop + tablet landscape — info card may grow/shrink,
 * but max-height locks to the main video/player bottom edge.
 * Tablet portrait is excluded so it stays on the mobile natural drawer.
 */
const DETAIL_PLAYER_CAP_MQ =
  "((min-width: 1024px) and (pointer: fine) and (orientation: landscape)), (min-width: 1367px), ((min-width: 768px) and (max-width: 1366px) and (orientation: landscape) and (any-pointer: coarse))";

/**
 * Phone + full tablet portrait band — natural-height drawer (no player cap).
 * Matches FEATURED WRITING compact portrait intent; includes iPad Pro portrait (1024–1366).
 */
const DETAIL_NATURAL_DRAWER_MQ =
  "(max-width: 639.98px), (min-width: 768px) and (max-width: 1366px) and (orientation: portrait)";

const DETAIL_CARD_TAB_IDS = ["overview", "role", "impact", "tools"] as const;
type DetailCardTabId = (typeof DETAIL_CARD_TAB_IDS)[number];

const DETAIL_CARD_TAB_LABEL: Record<DetailCardTabId, string> = {
  overview: "OVERVIEW",
  role: "ROLE",
  impact: "IMPACT",
  tools: "TOOLS",
};

function detailCardTabLabel(tabId: DetailCardTabId, isSlaywire: boolean) {
  if (isSlaywire && tabId === "impact") return "STATUS";
  return DETAIL_CARD_TAB_LABEL[tabId];
}

function renderDetailInlineEm(text: string) {
  const parts = text.split(/(<em>[\s\S]*?<\/em>)/g);
  return parts.map((part, index) => {
    const emMatch = /^<em>([\s\S]*?)<\/em>$/.exec(part);
    if (emMatch) {
      return <em key={`em-${index}`}>{emMatch[1]}</em>;
    }
    return <span key={`txt-${index}`}>{part}</span>;
  });
}

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
const DETAIL_BODY_OUT_MS = Math.round(DETAIL_TAB_BODY_OUT_S * 1000);
/** Yellow underline draw / retract — same length as tab FLIP; starts only after position settles. */
const DETAIL_TAB_UNDERLINE_DUR_MS = Math.round(DETAIL_TAB_SWAP_DUR_S * 1000);
/** Description-card height keyframes stay synchronized with the tab swap. */
const DETAIL_CARD_RESIZE_DUR_MS = DETAIL_TAB_UNDERLINE_DUR_MS;
const DETAIL_CARD_RESIZE_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
/**
 * New tab copy waits until height resize finishes + one paint so clamp/mask
 * can settle while opacity is still 0 (avoids a bottom-edge flicker).
 */
const DETAIL_TAB_BODY_IN_DELAY_S = (DETAIL_CARD_RESIZE_DUR_MS + 32) / 1000;
/**
 * Natural drawers: height waits for tab FLIP to finish (avoids layout+resize screenshake),
 * so enter delay spans (FLIP − body-out) + resize + paint.
 */
const DETAIL_NATURAL_HEIGHT_DELAY_MS = DETAIL_TAB_UNDERLINE_DUR_MS;
const DETAIL_TAB_BODY_IN_DELAY_NATURAL_S =
  (DETAIL_NATURAL_HEIGHT_DELAY_MS - DETAIL_BODY_OUT_MS + DETAIL_CARD_RESIZE_DUR_MS + 32) /
  1000;
/** Thumbnail title reflow completes before its description drawer changes size. */
const DETAIL_TITLE_MOVE_DUR_MS = DETAIL_CARD_RESIZE_DUR_MS;
/**
 * Phone + tablet portrait/landscape + desktop — expanding drawer with resize keyframes.
 * Natural (phone/tablet portrait) also keeps an anti-jump height reserve.
 * Player-cap viewports also clamp max-height.
 */
const DETAIL_COMPACT_DRAWER_MQ = [
  DETAIL_NATURAL_DRAWER_MQ,
  "((min-width: 1024px) and (pointer: fine))",
  "(min-width: 1367px)",
  "((min-width: 768px) and (max-width: 1366px) and (orientation: landscape) and (any-pointer: coarse))",
].join(", ");

function matchesDetailPlayerCapViewport() {
  return typeof window !== "undefined" && window.matchMedia(DETAIL_PLAYER_CAP_MQ).matches;
}

function matchesDetailNaturalDrawerViewport() {
  return typeof window !== "undefined" && window.matchMedia(DETAIL_NATURAL_DRAWER_MQ).matches;
}

function measureDetailCardChromeHeight(
  cardSurface: HTMLElement,
  activeNatural: HTMLElement,
): number {
  const cardH = cardSurface.offsetHeight;
  const naturalH = activeNatural.offsetHeight;
  if (naturalH <= cardH + 0.5) {
    return Math.max(0, cardH - naturalH);
  }
  const tabpanel = cardSurface.querySelector(".video-editing-detail-card-tabpanel");
  if (tabpanel instanceof HTMLElement) {
    return Math.max(0, cardH - tabpanel.clientHeight);
  }
  return Math.max(0, cardH - naturalH);
}

/** Convert visual px (getBoundingClientRect) → layout px (style/offset), accounting for CSS zoom. */
function visualPxToLayoutPx(el: HTMLElement, visualPx: number): number {
  const visualH = el.getBoundingClientRect().height;
  const layoutH = el.offsetHeight;
  if (visualH < 0.5 || layoutH < 0.5) return Math.round(visualPx);
  return Math.round(visualPx * (layoutH / visualH));
}

function measureDetailCardHeightForProbe(
  cardSurface: HTMLElement,
  targetProbe: HTMLElement,
): number {
  const visualBeforeBody =
    targetProbe.getBoundingClientRect().top - cardSurface.getBoundingClientRect().top;
  const layoutBeforeBody = visualPxToLayoutPx(cardSurface, visualBeforeBody);
  const paddingBottom = parseFloat(getComputedStyle(cardSurface).paddingBottom) || 0;
  return Math.ceil(layoutBeforeBody + targetProbe.offsetHeight + paddingBottom);
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
  /** Desktop + tablet landscape — expand/shrink drawer clamped to player bottom. */
  const [isPlayerCappedDrawerViewport, setIsPlayerCappedDrawerViewport] = useState(
    matchesDetailPlayerCapViewport,
  );
  /** Phone + tablet portrait — natural drawer + anti-jump reserve (no player cap). */
  const [isNaturalDrawerViewport, setIsNaturalDrawerViewport] = useState(
    matchesDetailNaturalDrawerViewport,
  );
  /** Phone + tablet + desktop — expanding/shrinking description drawer with keyframes. */
  const [isCompactDrawerViewport, setIsCompactDrawerViewport] = useState(false);
  /** Natural drawer: never shrink the page-height reserve below the tallest tab seen. */
  const detailPanelTallestBodyRef = useRef(0);
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
  /** Player-capped drawer: ceiling at main video card bottom (expand/shrink below this). */
  const [detailCardMaxHeightPx, setDetailCardMaxHeightPx] = useState<number | null>(null);
  const detailCardMaxHeightPxRef = useRef<number | null>(null);
  /** Player-capped drawer: explicit height so tall tabs fill to the video bottom. */
  const [detailCardHeightPx, setDetailCardHeightPx] = useState<number | null>(null);
  const [detailCardContentIsClamped, setDetailCardContentIsClamped] = useState(false);
  const detailCardIsAtMaxHeight =
    isPlayerCappedDrawerViewport && detailCardContentIsClamped;
  const detailTabpanelScrollRef = useRef<HTMLElement | null>(null);
  const [detailTabpanelCutoffFade, setDetailTabpanelCutoffFade] = useState(false);
  /** Hold description copy invisible until box height/title moves finish. */
  const [detailBodyVisible, setDetailBodyVisible] = useState(true);
  const detailBodyVisibleRef = useRef(true);
  const detailBodySwapTimerRef = useRef<number | null>(null);
  const detailBodyRevealTimerRef = useRef<number | null>(null);
  /** Suppress cutoff remasure while a tab swap resize is in flight. */
  const detailTabMaskLockRef = useRef(false);
  const detailTabMaskSettleTimerRef = useRef<number | null>(null);
  /** Pin overflow:hidden during tab resize so the body can’t race-scroll as height changes. */
  const [detailTabpanelScrollFrozen, setDetailTabpanelScrollFrozen] = useState(false);
  /** Compact drawer: reserve the tallest tab outside the natural-height description card. */
  const detailPanelReserveRef = useRef<HTMLDivElement | null>(null);
  const detailTabActiveNaturalRef = useRef<HTMLDivElement | null>(null);
  const detailTabHiddenMeasureRefs = useRef<Record<DetailCardTabId, HTMLDivElement | null>>({
    overview: null,
    role: null,
    impact: null,
    tools: null,
  });
  const detailVideoOverviewMeasureRefs = useRef<Array<HTMLDivElement | null>>([]);
  const detailTitleMeasureRefs = useRef<Array<HTMLDivElement | null>>([]);
  const detailCardChromeHeightRef = useRef<number | null>(null);
  const detailCardResizeAnimationRef = useRef<Animation | null>(null);
  const detailTitleResizeAnimationRef = useRef<Animation | null>(null);
  const detailRootRef = useRef<HTMLDivElement | null>(null);
  const detailCardSurfaceRef = useRef<HTMLElement | null>(null);
  const detailNowPlayingRef = useRef<HTMLDivElement | null>(null);
  /** Natural drawer: unlock section scroll / card hit-testing after a tab resize. */
  const detailNaturalResizeCleanupRef = useRef<(() => void) | null>(null);
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
    const mq = window.matchMedia(DETAIL_PLAYER_CAP_MQ);
    const onChange = () => setIsPlayerCappedDrawerViewport(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia(DETAIL_NATURAL_DRAWER_MQ);
    const onChange = () => {
      const matches = mq.matches;
      setIsNaturalDrawerViewport(matches);
      if (!matches) detailPanelTallestBodyRef.current = 0;
    };
    onChange();
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }
    mq.addListener(onChange);
    return () => mq.removeListener(onChange);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia(DETAIL_COMPACT_DRAWER_MQ);
    const onChange = () => setIsCompactDrawerViewport(mq.matches);
    onChange();
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }
    mq.addListener(onChange);
    return () => mq.removeListener(onChange);
  }, []);

  // Only reset the anti-jump reserve when leaving this project card.
  // Resetting on every media switch collapsed page height mid-transition (mobile/tablet shake).
  useEffect(() => {
    detailPanelTallestBodyRef.current = 0;
    const reserve = detailPanelReserveRef.current;
    if (reserve) reserve.style.minHeight = "";
  }, [card.id]);

  useEffect(() => {
    setActiveDetailCardTab("overview");
    setDetailCardTabOrder([...DETAIL_CARD_TAB_IDS]);
    setUnderlineTabId("overview");
    underlineActiveTabRef.current = "overview";
  }, [activeVideoIndex, card.id]);

  const updateDetailTabpanelCutoffFade = useCallback(() => {
    const panel = detailTabpanelScrollRef.current;
    const content = detailTabActiveNaturalRef.current;
    // While body opacity is transitioning, leave the mask state alone so it
    // dissolves with the copy instead of snapping off like a hard delete.
    if (!detailBodyVisibleRef.current || detailTabMaskLockRef.current) {
      return;
    }
    if (!panel || !content || !detailCardIsAtMaxHeight) {
      setDetailTabpanelCutoffFade(false);
      return;
    }

    const panelRect = panel.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();
    // Fade only while real copy still extends past the visible fold.
    const contentPastFold = contentRect.bottom > panelRect.bottom + 1;
    const canScroll = panel.scrollHeight - panel.clientHeight > 1;
    const atBottom =
      panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 4;
    setDetailTabpanelCutoffFade(canScroll && contentPastFold && !atBottom);
  }, [detailCardIsAtMaxHeight]);

  const syncDetailTabpanelAfterSwitch = useCallback(() => {
    const panel = detailTabpanelScrollRef.current;
    // During a tab resize lock, defer scroll reset until copy is invisible — resetting
    // scrollTop while overview is still fading reads as a rapid upward scroll.
    if (panel && !detailTabMaskLockRef.current) {
      panel.scrollTop = 0;
    }
    if (!detailBodyVisibleRef.current || detailTabMaskLockRef.current) {
      return;
    }
    updateDetailTabpanelCutoffFade();
    requestAnimationFrame(() => {
      updateDetailTabpanelCutoffFade();
      requestAnimationFrame(updateDetailTabpanelCutoffFade);
    });
  }, [updateDetailTabpanelCutoffFade]);

  useLayoutEffect(() => {
    syncDetailTabpanelAfterSwitch();
  }, [
    activeDetailCardTab,
    activeVideoIndex,
    card.id,
    detailCardIsAtMaxHeight,
    detailCardHeightPx,
    detailBodyVisible,
    syncDetailTabpanelAfterSwitch,
  ]);

  useEffect(() => {
    const panel = detailTabpanelScrollRef.current;
    if (!panel || !detailCardIsAtMaxHeight || !detailBodyVisible) {
      return;
    }

    const onScroll = () => updateDetailTabpanelCutoffFade();
    panel.addEventListener("scroll", onScroll, { passive: true });
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => updateDetailTabpanelCutoffFade())
        : null;
    ro?.observe(panel);
    const content = detailTabActiveNaturalRef.current;
    if (content) ro?.observe(content);

    const timerId = window.setTimeout(updateDetailTabpanelCutoffFade, 32);

    return () => {
      panel.removeEventListener("scroll", onScroll);
      ro?.disconnect();
      window.clearTimeout(timerId);
    };
  }, [
    activeDetailCardTab,
    activeVideoIndex,
    card.id,
    detailCardIsAtMaxHeight,
    detailCardHeightPx,
    detailBodyVisible,
    updateDetailTabpanelCutoffFade,
  ]);

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
    if (!isPlayerCappedDrawerViewport) {
      setDetailCardMaxHeightPx(null);
      detailCardMaxHeightPxRef.current = null;
      setDetailCardHeightPx(null);
      setDetailCardContentIsClamped(false);
      return;
    }

    const root = detailRootRef.current;
    if (!root) return;

    const syncDetailCardMaxHeightToPlayer = () => {
      const player = root.querySelector(".video-editing-player");
      const cardEl = detailCardSurfaceRef.current;
      if (!(player instanceof HTMLElement) || !cardEl) return;
      const playerBottom = player.getBoundingClientRect().bottom;
      const cardTop = cardEl.getBoundingClientRect().top;
      const visualCap = Math.max(0, playerBottom - cardTop);
      const next = visualPxToLayoutPx(cardEl, visualCap);
      detailCardMaxHeightPxRef.current = next;
      setDetailCardMaxHeightPx((prev) => (prev === next ? prev : next));
    };

    syncDetailCardMaxHeightToPlayer();
    const raf = window.requestAnimationFrame(syncDetailCardMaxHeightToPlayer);
    const player = root.querySelector(".video-editing-player");
    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => syncDetailCardMaxHeightToPlayer())
        : null;
    if (player && resizeObserver) resizeObserver.observe(player);
    if (detailCardSurfaceRef.current && resizeObserver) {
      resizeObserver.observe(detailCardSurfaceRef.current);
    }
    window.addEventListener("resize", syncDetailCardMaxHeightToPlayer);
    window.addEventListener("orientationchange", syncDetailCardMaxHeightToPlayer);

    return () => {
      window.cancelAnimationFrame(raf);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", syncDetailCardMaxHeightToPlayer);
      window.removeEventListener("orientationchange", syncDetailCardMaxHeightToPlayer);
    };
  }, [
    isPlayerCappedDrawerViewport,
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
      return true;
    },
    [],
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

  const releaseNaturalDrawerResizeLock = useCallback(() => {
    detailNaturalResizeCleanupRef.current?.();
    detailNaturalResizeCleanupRef.current = null;
    const cardSurface = detailCardSurfaceRef.current;
    if (cardSurface) {
      cardSurface.style.pointerEvents = "";
      cardSurface.style.willChange = "";
      cardSurface.style.transform = "";
    }
  }, []);

  /**
   * Keep the page-height reserve from shrinking below the next overview body
   * before a media switch animates (prevents section scroll extent collapse).
   */
  const bumpNaturalDrawerReserveForProbe = useCallback(
    (targetProbe: HTMLElement | null | undefined) => {
      if (!isNaturalDrawerViewport || !targetProbe || targetProbe.offsetHeight <= 0) {
        return;
      }
      const reserve = detailPanelReserveRef.current;
      const cardSurface = detailCardSurfaceRef.current;
      if (!reserve || !cardSurface) return;

      const nextBody = Math.ceil(targetProbe.offsetHeight);
      detailPanelTallestBodyRef.current = Math.max(
        detailPanelTallestBodyRef.current,
        nextBody,
      );
      const activeNatural = detailTabActiveNaturalRef.current;
      const chrome =
        detailCardChromeHeightRef.current ??
        (activeNatural
          ? measureDetailCardChromeHeight(cardSurface, activeNatural)
          : Math.max(0, cardSurface.offsetHeight - nextBody));
      detailCardChromeHeightRef.current = chrome;
      const naturalReserve = Math.ceil(chrome + detailPanelTallestBodyRef.current);
      const currentMin = parseFloat(reserve.style.minHeight) || 0;
      if (naturalReserve > currentMin) {
        reserve.style.minHeight = `${naturalReserve}px`;
      }
    },
    [isNaturalDrawerViewport],
  );

  /** Freeze section scroll + disable card hit-testing while natural height WAAPI runs. */
  const armNaturalDrawerResizeLock = useCallback(
    (cardSurface: HTMLElement) => {
      releaseNaturalDrawerResizeLock();
      /*
       * Touch pans that start on a height-animating element are cancelled / jittered by
       * mobile browsers (same guard as FEATURED WRITING). Route hits through the stable shell.
       */
      cardSurface.style.pointerEvents = "none";
      // Own compositor layer so height/FLIP work doesn’t invalidate the section scroller.
      cardSurface.style.willChange = "height";
      cardSurface.style.transform = "translateZ(0)";

      const scrollParent =
        cardSurface.closest<HTMLElement>('[aria-label^="Section:"]') ??
        (() => {
          let current = cardSurface.parentElement;
          while (current) {
            const style = window.getComputedStyle(current);
            if (/(auto|scroll|overlay)/.test(style.overflowY)) return current;
            current = current.parentElement;
          }
          return null;
        })();

      if (!scrollParent) {
        detailNaturalResizeCleanupRef.current = () => {
          cardSurface.style.pointerEvents = "";
          cardSurface.style.willChange = "";
          cardSurface.style.transform = "";
        };
        return;
      }

      const lockedTop = scrollParent.scrollTop;
      const prevOverflowAnchor = scrollParent.style.overflowAnchor;
      const prevOverscroll = scrollParent.style.overscrollBehaviorY;
      // Pin scroll without toggling overflowY — hiding overflow on iOS/WebKit
      // was itself reading as a one-frame screenshake during media switches.
      scrollParent.style.overflowAnchor = "none";
      scrollParent.style.overscrollBehaviorY = "none";
      scrollParent.scrollTop = lockedTop;

      const pinScroll = () => {
        if (scrollParent.scrollTop !== lockedTop) {
          scrollParent.scrollTop = lockedTop;
        }
      };
      scrollParent.addEventListener("scroll", pinScroll, { passive: true });

      let rafId = 0;
      const pin = () => {
        pinScroll();
        rafId = window.requestAnimationFrame(pin);
      };
      rafId = window.requestAnimationFrame(pin);

      detailNaturalResizeCleanupRef.current = () => {
        window.cancelAnimationFrame(rafId);
        scrollParent.removeEventListener("scroll", pinScroll);
        scrollParent.style.overflowAnchor = prevOverflowAnchor;
        scrollParent.style.overscrollBehaviorY = prevOverscroll;
        scrollParent.scrollTop = lockedTop;
        cardSurface.style.pointerEvents = "";
        cardSurface.style.willChange = "";
        cardSurface.style.transform = "";
      };
    },
    [releaseNaturalDrawerResizeLock],
  );

  useEffect(() => {
    return () => releaseNaturalDrawerResizeLock();
  }, [releaseNaturalDrawerResizeLock]);

  const animateDetailCardToMeasuredBody = useCallback(
    (targetProbe: HTMLElement, delayMs = 0) => {
      const cardSurface = detailCardSurfaceRef.current;
      const activeNatural = detailTabActiveNaturalRef.current;
      if (!cardSurface || !activeNatural || targetProbe.offsetHeight <= 0) return;

      const fromHeightRaw = cardSurface.offsetHeight;
      const maxHeight = detailCardMaxHeightPxRef.current;
      const naturalToHeight = measureDetailCardHeightForProbe(cardSurface, targetProbe);
      detailCardChromeHeightRef.current = naturalToHeight - targetProbe.offsetHeight;
      const toHeight =
        maxHeight != null ? Math.min(naturalToHeight, maxHeight) : naturalToHeight;
      const fromHeight =
        maxHeight != null ? Math.min(fromHeightRaw, maxHeight) : fromHeightRaw;
      setDetailCardContentIsClamped(
        maxHeight != null && naturalToHeight >= maxHeight - 0.5,
      );

      if (!isCompactDrawerViewport || reduceMotion) {
        if (maxHeight != null) {
          cardSurface.style.height = `${toHeight}px`;
          setDetailCardHeightPx(toHeight);
        } else {
          cardSurface.style.height = "";
          cardSurface.style.transition = "";
        }
        return;
      }

      detailCardResizeAnimationRef.current?.cancel();
      detailCardResizeAnimationRef.current = null;
      if (Math.abs(toHeight - fromHeight) <= 0.5) {
        if (maxHeight != null) {
          cardSurface.style.height = `${toHeight}px`;
          setDetailCardHeightPx(toHeight);
        }
        return;
      }

      if (maxHeight != null) {
        setDetailCardHeightPx(fromHeight);
        cardSurface.style.height = `${fromHeight}px`;
      } else {
        cardSurface.style.transition = "none";
        cardSurface.style.height = `${fromHeight}px`;
      }

      const resizeAnimation = cardSurface.animate(
        [{ height: `${fromHeight}px` }, { height: `${toHeight}px` }],
        {
          duration: DETAIL_CARD_RESIZE_DUR_MS,
          delay: delayMs,
          easing: DETAIL_CARD_RESIZE_EASE,
          fill: "both",
        },
      );
      detailCardResizeAnimationRef.current = resizeAnimation;
      const finishResize = () => {
        if (detailCardResizeAnimationRef.current !== resizeAnimation) return;
        if (maxHeight != null) {
          flushSync(() => {
            setDetailCardHeightPx(toHeight);
          });
          cardSurface.style.height = `${toHeight}px`;
          resizeAnimation.cancel();
          detailCardResizeAnimationRef.current = null;
          return;
        }

        // The newly mounted thumbnail copy can resolve a few pixels away from its
        // hidden pre-measure. Re-measure via the probe without releasing to height:auto
        // (auto caused a mobile/tablet reflow screenshake).
        resizeAnimation.cancel();
        const settledHeight = measureDetailCardHeightForProbe(cardSurface, targetProbe);
        cardSurface.style.height = `${toHeight}px`;
        cardSurface.style.transition = "none";

        if (Math.abs(settledHeight - toHeight) > 0.5) {
          const settleAnimation = cardSurface.animate(
            [{ height: `${toHeight}px` }, { height: `${settledHeight}px` }],
            {
              duration: 120,
              easing: DETAIL_CARD_RESIZE_EASE,
              fill: "both",
            },
          );
          detailCardResizeAnimationRef.current = settleAnimation;
          settleAnimation.finished
            .then(() => {
              if (detailCardResizeAnimationRef.current !== settleAnimation) return;
              cardSurface.style.height = `${settledHeight}px`;
              cardSurface.style.transition = "none";
              settleAnimation.cancel();
              detailCardResizeAnimationRef.current = null;
              // Section scroll unlock is owned by the work-switch reveal timer / tab settle.
            })
            .catch(() => {
              // Cancelled by a newer thumbnail or tab selection.
            });
          return;
        }

        detailCardResizeAnimationRef.current = null;
      };
      resizeAnimation.finished.then(finishResize).catch(() => {
        // Cancelled by a newer thumbnail or tab selection.
      });
    },
    [isCompactDrawerViewport, reduceMotion],
  );

  const animateDetailTitleToMeasuredHeight = useCallback(
    (nextIndex: number): number => {
      if (reduceMotion) return 0;

      const titleArea = detailNowPlayingRef.current;
      const targetProbe = detailTitleMeasureRefs.current[nextIndex];
      if (!titleArea || !targetProbe) return 0;

      const fromHeight = titleArea.offsetHeight;
      const toHeight = targetProbe.offsetHeight;
      detailTitleResizeAnimationRef.current?.cancel();
      detailTitleResizeAnimationRef.current = null;
      if (Math.abs(toHeight - fromHeight) <= 0.5) return 0;

      titleArea.style.height = `${fromHeight}px`;
      const titleResizeAnimation = titleArea.animate(
        [{ height: `${fromHeight}px` }, { height: `${toHeight}px` }],
        {
          duration: DETAIL_TITLE_MOVE_DUR_MS,
          easing: DETAIL_CARD_RESIZE_EASE,
          fill: "both",
        },
      );
      detailTitleResizeAnimationRef.current = titleResizeAnimation;
      titleResizeAnimation.finished
        .then(() => {
          if (detailTitleResizeAnimationRef.current !== titleResizeAnimation) return;
          titleArea.style.height = `${toHeight}px`;
          titleResizeAnimation.cancel();
          detailTitleResizeAnimationRef.current = null;
          // Natural drawers: keep explicit height. Clearing to auto reflows the section
          // and reads as screenshake during thumbnail / arrow switches.
          if (isNaturalDrawerViewport) return;
          requestAnimationFrame(() => {
            if (detailTitleResizeAnimationRef.current) return;
            if (detailNowPlayingRef.current === titleArea) {
              titleArea.style.height = "";
            }
          });
        })
        .catch(() => {
          // Cancelled by a newer thumbnail selection.
        });

      return DETAIL_TITLE_MOVE_DUR_MS;
    },
    [isNaturalDrawerViewport, reduceMotion],
  );

  const clearDetailBodySwapTimers = useCallback(() => {
    if (detailBodySwapTimerRef.current !== null) {
      window.clearTimeout(detailBodySwapTimerRef.current);
      detailBodySwapTimerRef.current = null;
    }
    if (detailBodyRevealTimerRef.current !== null) {
      window.clearTimeout(detailBodyRevealTimerRef.current);
      detailBodyRevealTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearDetailBodySwapTimers();
  }, [clearDetailBodySwapTimers]);

  const applyActiveWorkIndex = useCallback(
    (nextIndex: number) => {
      const drawerDelayMs = reduceMotion ? 0 : animateDetailTitleToMeasuredHeight(nextIndex);
      const targetOverviewProbe = detailVideoOverviewMeasureRefs.current[nextIndex];
      if (targetOverviewProbe) {
        animateDetailCardToMeasuredBody(targetOverviewProbe, drawerDelayMs);
      }

      setActiveDetailCardTab("overview");
      setDetailCardTabOrder([...DETAIL_CARD_TAB_IDS]);
      setUnderlineTabId("overview");
      underlineActiveTabRef.current = "overview";
      activeVideoIndexRef.current = nextIndex;
      setActiveVideoIndex(nextIndex);
      // Body is fully hidden here — safe to drop the mask before the new copy mounts.
      setDetailTabpanelCutoffFade(false);

      const revealDelay = reduceMotion
        ? 0
        : drawerDelayMs + DETAIL_CARD_RESIZE_DUR_MS;
      detailBodyRevealTimerRef.current = window.setTimeout(() => {
        detailBodyRevealTimerRef.current = null;
        // Arm the cutoff mask before opacity rises so it doesn’t pop in at the end.
        detailBodyVisibleRef.current = true;
        updateDetailTabpanelCutoffFade();
        setDetailBodyVisible(true);
        // Title + card resize window is done — safe to unlock section scroll.
        releaseNaturalDrawerResizeLock();
        requestAnimationFrame(() => {
          updateDetailTabpanelCutoffFade();
        });
      }, revealDelay);
    },
    [
      animateDetailCardToMeasuredBody,
      animateDetailTitleToMeasuredHeight,
      reduceMotion,
      releaseNaturalDrawerResizeLock,
      updateDetailTabpanelCutoffFade,
    ],
  );

  const commitActiveWorkIndex = useCallback(
    (nextIndex: number) => {
      if (nextIndex === activeVideoIndexRef.current && detailBodyVisible) return;

      clearDetailBodySwapTimers();
      activeVideoIndexRef.current = nextIndex;

      // Hold page-height reserve + freeze section scroll before fade/resize (thumbnail/arrows).
      // Natural (phone/tablet portrait) + coarse tablet landscape — not desktop fine-pointer.
      const freezeSectionForMediaSwitch =
        isNaturalDrawerViewport ||
        (isPlayerCappedDrawerViewport && !usesFinePointerHover());
      if (freezeSectionForMediaSwitch) {
        if (isNaturalDrawerViewport) {
          bumpNaturalDrawerReserveForProbe(
            detailVideoOverviewMeasureRefs.current[nextIndex],
          );
        }
        const lockTarget =
          detailCardSurfaceRef.current ?? detailRootRef.current ?? detailNowPlayingRef.current;
        if (lockTarget) armNaturalDrawerResizeLock(lockTarget);
      }

      if (reduceMotion) {
        detailBodyVisibleRef.current = true;
        setDetailBodyVisible(true);
        applyActiveWorkIndex(nextIndex);
        return;
      }

      const waitForFadeOut = detailBodyVisible;
      detailBodyVisibleRef.current = false;
      setDetailBodyVisible(false);
      // Keep any active cutoff mask through the body opacity out so both fade together.

      detailBodySwapTimerRef.current = window.setTimeout(
        () => {
          detailBodySwapTimerRef.current = null;
          applyActiveWorkIndex(nextIndex);
        },
        waitForFadeOut ? DETAIL_BODY_OUT_MS : 0,
      );
    },
    [
      applyActiveWorkIndex,
      armNaturalDrawerResizeLock,
      bumpNaturalDrawerReserveForProbe,
      clearDetailBodySwapTimers,
      detailBodyVisible,
      isNaturalDrawerViewport,
      isPlayerCappedDrawerViewport,
      reduceMotion,
      usesFinePointerHover,
    ],
  );

  /** Center a works-strip thumb without scrollIntoView (avoids scrolling the section on mobile). */
  const centerWorksStripThumb = useCallback(
    (index: number) => {
      const strip = thumbStripRef.current;
      const thumb = thumbRefs.current[index];
      if (!strip || !thumb) return;
      const stripRect = strip.getBoundingClientRect();
      const thumbRect = thumb.getBoundingClientRect();
      const delta =
        thumbRect.left +
        thumbRect.width / 2 -
        (stripRect.left + stripRect.width / 2);
      const nextLeft = strip.scrollLeft + delta;
      if (reduceMotion || typeof strip.scrollTo !== "function") {
        strip.scrollLeft = nextLeft;
        return;
      }
      strip.scrollTo({ left: nextLeft, behavior: "smooth" });
    },
    [reduceMotion],
  );

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

      commitActiveWorkIndex(nextIndex);

      if (options?.scrollStrip === false) return;

      lockWorksStripScrollSync();
      centerWorksStripThumb(nextIndex);
    },
    [
      centerWorksStripThumb,
      commitActiveWorkIndex,
      lockWorksStripScrollSync,
      triggerWorksArrowFeedback,
    ],
  );

  const syncActiveVideoFromStripScroll = useCallback(() => {
    if (Date.now() < worksStripNavLockUntilRef.current) return;

    const nextIndex = resolveThumbIndexFromStripScroll();
    if (nextIndex === null) return;

    const prevIndex = activeVideoIndexRef.current;
    if (nextIndex === prevIndex) return;

    commitActiveWorkIndex(nextIndex);
  }, [commitActiveWorkIndex, resolveThumbIndexFromStripScroll]);

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
  const activeSelectorTitle =
    activeVideo.selectorTitle?.trim() ||
    (isSlaywire ? card.title : activeVideo.label || "Selected work");
  const activeSelectorSubtitle = activeVideo.selectorSubtitle?.trim() || "";
  const activeDetails = {
    detailOverview: activeVideo.detailOverview?.trim() || card.detailOverview?.trim() || "?",
    detailRole: activeVideo.detailRole?.trim() || card.detailRole?.trim() || "?",
    detailImpact: activeVideo.detailImpact?.trim() || card.detailImpact?.trim() || "?",
    detailTools: activeVideo.detailTools?.length ? activeVideo.detailTools : card.detailTools,
  };

  const worksArrowBtnClass =
    "video-editing-works-arrow absolute top-[2.45rem] z-10 flex h-[1.65rem] w-[1.65rem] items-center justify-center border-0 bg-transparent p-0 text-white/85 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--palette-yellow-projects)] focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:h-[1.925rem] sm:w-[1.925rem]";
  /** Shared wall-clock phase so prev/next (and FEATURED WRITING) idle pulses stay locked. */
  const worksArrowIdleDelay = useMemo(
    () => `${directionalArrowIdlePhaseDelaySec()}s`,
    // Recompute when the detail surface remounts a new card's works strip.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: phase freeze per card
    [card.id],
  );
  const worksArrowIdleStyle = {
    ["--directional-arrow-idle-delay" as string]: worksArrowIdleDelay,
  };
  const worksStripThumbBasisClass = matchInteractiveMediaChrome
    ? "basis-[calc((100%-0.5rem)/2)] sm:basis-[calc((100%-0.625rem)/2)] md:basis-[calc((100%-1.25rem)/3)] lg:basis-[calc((100%-1.25rem)/3)]"
    : "basis-[calc((100%-0.5rem)/2)] sm:basis-[calc((100%-0.625rem)/2)] md:basis-[calc((100%-1.25rem)/3)] lg:basis-[calc((100%-1.875rem)/4)]";
  const worksStripOuterClass =
    videos.length > 1
      ? matchInteractiveMediaChrome
        ? "relative -mx-5 overflow-visible sm:-mx-7"
        : "relative -mx-4 overflow-visible sm:-mx-6"
      : "relative w-full min-w-0";
  const worksStripClass =
    videos.length > 1
      ? matchInteractiveMediaChrome
        ? "mx-5 sm:mx-7"
        : "mx-4 sm:mx-6"
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
          {renderDetailInlineEm(activeDetails.detailOverview)}
        </p>
      );
    }

    if (tabId === "role") {
      const roleLines = activeDetails.detailRole
        .split(/\n+/)
        .map((line) => line.trim())
        .filter(Boolean);
      if (roleLines.length > 1) {
        return (
          <ul className="ml-1 mb-0 list-disc list-outside space-y-1 pl-6 marker:text-mono-2/70 sm:pl-7">
            {roleLines.map((line, index) => (
              <li
                key={`${line}-${index}`}
                className="font-body text-sm leading-snug text-mono-2 sm:text-base"
              >
                {renderDetailInlineEm(line)}
              </li>
            ))}
          </ul>
        );
      }
      return (
        <p className="m-0 whitespace-pre-line font-body text-sm leading-snug text-mono-2 sm:text-base">
          {renderDetailInlineEm(activeDetails.detailRole)}
        </p>
      );
    }

    if (tabId === "impact") {
      const impactLines = activeDetails.detailImpact
        .split(/\n+/)
        .map((line) => line.trim())
        .filter(Boolean);
      if (impactLines.length > 1 || isSlaywire) {
        return (
          <ul className="ml-1 mb-0 list-disc list-outside space-y-1 pl-6 marker:text-mono-2/70 sm:pl-7">
            {impactLines.map((line, index) => (
              <li
                key={`${line}-${index}`}
                className="font-body text-sm leading-snug text-mono-2 sm:text-base"
              >
                {renderDetailInlineEm(line)}
              </li>
            ))}
          </ul>
        );
      }
      return (
        <p className="m-0 whitespace-pre-line font-body text-sm leading-snug text-mono-2 sm:text-base">
          {renderDetailInlineEm(activeDetails.detailImpact)}
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

  const renderDetailCardTabBody = (tabId: DetailCardTabId, _variant: "portrait" | "ipad") => (
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
                delay: isNaturalDrawerViewport
                  ? DETAIL_TAB_BODY_IN_DELAY_NATURAL_S
                  : DETAIL_TAB_BODY_IN_DELAY_S,
                ease: DETAIL_TAB_SWAP_EASE,
              }
        }
        className="video-editing-detail-card-tab-body min-w-0"
      >
        {renderPortraitDetailTabBody(tabId)}
      </motion.div>
    </AnimatePresence>
  );

  const handleDetailCardTabChange = useCallback(
    (nextTabId: DetailCardTabId) => {
      if (nextTabId === activeDetailCardTab) return;

      // Hold scroll/mask chrome through the out fade; settle after resize while copy is opacity 0.
      detailTabMaskLockRef.current = true;
      if (detailTabMaskSettleTimerRef.current != null) {
        window.clearTimeout(detailTabMaskSettleTimerRef.current);
        detailTabMaskSettleTimerRef.current = null;
      }
      // Player-capped only: freeze scrollport before height changes. Natural drawer
      // (phone/tablet portrait) is not a scrollport — flushSync here only caused hitch/shake.
      if (isPlayerCappedDrawerViewport) {
        flushSync(() => {
          setDetailTabpanelScrollFrozen(true);
        });
      }
      const maxHeight = detailCardMaxHeightPxRef.current;

      if (isCompactDrawerViewport && !reduceMotion) {
        const cardSurface = detailCardSurfaceRef.current;
        const activeNatural = detailTabActiveNaturalRef.current;
        const targetProbe = detailTabHiddenMeasureRefs.current[nextTabId];
        // Lock section scroll for the whole FLIP + resize window on natural drawers.
        if (isNaturalDrawerViewport && cardSurface) {
          armNaturalDrawerResizeLock(cardSurface);
        }
        if (cardSurface && activeNatural && targetProbe) {
          const fromHeightRaw = cardSurface.offsetHeight;
          const naturalToHeight = measureDetailCardHeightForProbe(
            cardSurface,
            targetProbe,
          );
          detailCardChromeHeightRef.current =
            naturalToHeight - targetProbe.offsetHeight;
          const toHeight =
            maxHeight != null ? Math.min(naturalToHeight, maxHeight) : naturalToHeight;
          const fromHeight =
            maxHeight != null ? Math.min(fromHeightRaw, maxHeight) : fromHeightRaw;
          const nextClamped =
            maxHeight != null && naturalToHeight >= maxHeight - 0.5;

          const settleMaskAfterResize = () => {
            const panel = detailTabpanelScrollRef.current;
            if (panel) panel.scrollTop = 0;
            // Apply clamp only after the out-fade so we don’t tear off overflow/mask mid-copy.
            flushSync(() => {
              setDetailCardContentIsClamped(nextClamped);
              if (isPlayerCappedDrawerViewport) {
                setDetailTabpanelScrollFrozen(false);
              }
            });
            detailTabMaskLockRef.current = false;
            if (!nextClamped) {
              setDetailTabpanelCutoffFade(false);
              return;
            }
            // Measure with the post-clamp DOM; don’t use the stale callback closure.
            const content = detailTabActiveNaturalRef.current;
            if (!panel || !content) {
              setDetailTabpanelCutoffFade(false);
              return;
            }
            const panelRect = panel.getBoundingClientRect();
            const contentRect = content.getBoundingClientRect();
            const contentPastFold = contentRect.bottom > panelRect.bottom + 1;
            const canScroll = panel.scrollHeight - panel.clientHeight > 1;
            const atBottom =
              panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 4;
            setDetailTabpanelCutoffFade(canScroll && contentPastFold && !atBottom);
          };

          detailCardResizeAnimationRef.current?.cancel();
          detailCardResizeAnimationRef.current = null;
          if (Math.abs(toHeight - fromHeight) > 0.5) {
            // Seed React height to `from` so cancel never snaps to a stale prior tab size.
            if (maxHeight != null) {
              setDetailCardHeightPx(fromHeight);
              cardSurface.style.height = `${fromHeight}px`;
            } else {
              // Natural drawer (phone + tablet portrait): kill CSS transitions that fight WAAPI height.
              cardSurface.style.transition = "none";
              cardSurface.style.height = `${fromHeight}px`;
            }

            // Once copy is fully gone, drop the old mask + reset scroll (invisible).
            detailTabMaskSettleTimerRef.current = window.setTimeout(() => {
              detailTabMaskSettleTimerRef.current = null;
              if (detailTabMaskLockRef.current) {
                const panel = detailTabpanelScrollRef.current;
                if (panel) panel.scrollTop = 0;
                setDetailTabpanelCutoffFade(false);
              }
            }, DETAIL_BODY_OUT_MS);

            const resizeDelayMs = isNaturalDrawerViewport
              ? DETAIL_NATURAL_HEIGHT_DELAY_MS
              : DETAIL_BODY_OUT_MS;

            const resizeAnimation = cardSurface.animate(
              [
                { height: `${fromHeight}px` },
                { height: `${toHeight}px` },
              ],
              {
                duration: DETAIL_CARD_RESIZE_DUR_MS,
                // Desktop: after body out. Natural: after tab FLIP settles (keeps reorder, less shake).
                delay: resizeDelayMs,
                easing: DETAIL_CARD_RESIZE_EASE,
                fill: "both",
              },
            );
            detailCardResizeAnimationRef.current = resizeAnimation;
            const finishResize = () => {
              if (detailCardResizeAnimationRef.current !== resizeAnimation) return;
              // Persist end height in React + DOM before canceling WAAPI so the
              // prior tab height cannot flash for a frame.
              if (maxHeight != null) {
                flushSync(() => {
                  setDetailCardHeightPx(toHeight);
                });
                cardSurface.style.height = `${toHeight}px`;
              } else if (typeof resizeAnimation.commitStyles === "function") {
                resizeAnimation.commitStyles();
              } else {
                cardSurface.style.height = `${toHeight}px`;
              }
              resizeAnimation.cancel();
              detailCardResizeAnimationRef.current = null;
              if (maxHeight == null) {
                // Keep the explicit pixel height on natural drawers. Clearing to
                // auto after WAAPI caused a mobile/tablet reflow screenshake.
                cardSurface.style.height = `${toHeight}px`;
                cardSurface.style.transition = "none";
                releaseNaturalDrawerResizeLock();
              }
              // Enter fade is delayed +32ms past resize end — settle while still opacity 0.
              settleMaskAfterResize();
            };
            resizeAnimation.finished.then(finishResize).catch(() => {
              // Cancelled by a newer tab swap — leave the replacement animation in charge.
            });
          } else if (maxHeight != null) {
            cardSurface.style.height = `${toHeight}px`;
            setDetailCardHeightPx(toHeight);
            detailTabMaskSettleTimerRef.current = window.setTimeout(() => {
              detailTabMaskSettleTimerRef.current = null;
              settleMaskAfterResize();
            }, DETAIL_BODY_OUT_MS);
          } else {
            detailTabMaskSettleTimerRef.current = window.setTimeout(() => {
              detailTabMaskSettleTimerRef.current = null;
              settleMaskAfterResize();
              if (isNaturalDrawerViewport) {
                releaseNaturalDrawerResizeLock();
              }
            }, DETAIL_NATURAL_HEIGHT_DELAY_MS);
          }
        } else {
          detailTabMaskLockRef.current = false;
          setDetailTabpanelScrollFrozen(false);
          if (isNaturalDrawerViewport) {
            releaseNaturalDrawerResizeLock();
          }
        }
      } else {
        if (maxHeight != null) {
          const targetProbe = detailTabHiddenMeasureRefs.current[nextTabId];
          const cardSurface = detailCardSurfaceRef.current;
          if (cardSurface && targetProbe) {
            const naturalToHeight = measureDetailCardHeightForProbe(
              cardSurface,
              targetProbe,
            );
            setDetailCardContentIsClamped(naturalToHeight >= maxHeight - 0.5);
          }
        }
        detailTabMaskLockRef.current = false;
        setDetailTabpanelScrollFrozen(false);
        updateDetailTabpanelCutoffFade();
      }

      setDetailCardTabOrder((prev) => swapDetailTabToFront(prev, nextTabId));
      setActiveDetailCardTab(nextTabId);
    },
    [
      activeDetailCardTab,
      armNaturalDrawerResizeLock,
      isCompactDrawerViewport,
      isNaturalDrawerViewport,
      isPlayerCappedDrawerViewport,
      reduceMotion,
      releaseNaturalDrawerResizeLock,
      updateDetailTabpanelCutoffFade,
    ],
  );

  const focusDetailCardTab = useCallback(
    (tabId: DetailCardTabId) => {
      // Focusing the tab can scroll the section on mobile WebKit even with preventScroll.
      if (isNaturalDrawerViewport || !usesFinePointerHover()) return;
      requestAnimationFrame(() => {
        document.getElementById(`video-detail-tab-${tabId}`)?.focus({ preventScroll: true });
      });
    },
    [isNaturalDrawerViewport, usesFinePointerHover],
  );

  const renderDetailCardTabList = () => (
    // layoutRoot: keep tab FLIP projections from dirtying the section scroller (mobile shake).
    <motion.div layoutRoot className="w-full min-w-0">
      <LayoutGroup id="video-detail-card-tabs">
        <div
          className="video-editing-detail-card-tablist isolate flex w-full min-w-0 shrink-0 items-stretch justify-between gap-0 border-b border-transparent"
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
                  // Prevent focus scroll jump on press; focus runs with preventScroll on click.
                  event.preventDefault();
                }}
                onClick={() => {
                  handleDetailCardTabChange(tabId);
                  focusDetailCardTab(tabId);
                }}
              >
                <span className="relative inline-block w-max pb-2">
                  {detailCardTabLabel(tabId, isSlaywire)}
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
    </motion.div>
  );

  useLayoutEffect(() => {
    const reserve = detailPanelReserveRef.current;
    if (!isCompactDrawerViewport) {
      if (reserve) reserve.style.minHeight = "";
      detailPanelTallestBodyRef.current = 0;
      return;
    }

    const cardSurface = detailCardSurfaceRef.current;
    const activeNatural = detailTabActiveNaturalRef.current;
    if (!reserve || !cardSurface || !activeNatural) return;

    let tallest = 0;
    for (const tabId of DETAIL_CARD_TAB_IDS) {
      const probe = detailTabHiddenMeasureRefs.current[tabId];
      if (!probe) continue;
      tallest = Math.max(tallest, Math.ceil(probe.offsetHeight));
    }
    const activeNaturalH = Math.ceil(activeNatural.offsetHeight);
    if (activeNaturalH > 0) {
      tallest = Math.max(tallest, activeNaturalH);
    }
    const measuredChromeHeight = measureDetailCardChromeHeight(cardSurface, activeNatural);
    if (!detailCardResizeAnimationRef.current) {
      detailCardChromeHeightRef.current = measuredChromeHeight;
    }
    const fixedChromeHeight =
      detailCardChromeHeightRef.current ?? measuredChromeHeight;

    // Phone + tablet portrait: keep page height at the tallest tab ever seen (FEATURED WRITING parity).
    if (isNaturalDrawerViewport && tallest > 0) {
      detailPanelTallestBodyRef.current = Math.max(
        detailPanelTallestBodyRef.current,
        tallest,
      );
    } else if (!isNaturalDrawerViewport) {
      detailPanelTallestBodyRef.current = tallest;
    }

    const reservedBody =
      isNaturalDrawerViewport && detailPanelTallestBodyRef.current > 0
        ? detailPanelTallestBodyRef.current
        : tallest;
    const naturalReserve =
      reservedBody > 0 ? Math.ceil(fixedChromeHeight + reservedBody) : 0;
    const maxHeight = detailCardMaxHeightPx;
    const cappedReserve =
      naturalReserve > 0 && maxHeight != null
        ? Math.min(naturalReserve, maxHeight)
        : naturalReserve;
    // Natural drawers: never shrink the page-height reserve mid-session (media/tab
    // switches). Shrinking scroll extent under a pinned player reads as screenshake.
    if (isNaturalDrawerViewport) {
      const currentMin = parseFloat(reserve.style.minHeight) || 0;
      const nextMin = Math.max(currentMin, cappedReserve);
      reserve.style.minHeight = nextMin > 0 ? `${nextMin}px` : "";
    } else {
      reserve.style.minHeight = cappedReserve > 0 ? `${cappedReserve}px` : "";
    }

    // Height for player-capped drawers is owned by the tab resize animation / onfinish.
    // Remeasuring here after cancel caused a one-frame flash of the wrong size.
  }, [
    activeDetailCardTab,
    activeVideo.id,
    card.id,
    isCompactDrawerViewport,
    isNaturalDrawerViewport,
    detailCardMaxHeightPx,
  ]);

  /** Initial / cap-change height only — tab swaps animate height themselves. */
  useLayoutEffect(() => {
    if (!isPlayerCappedDrawerViewport || detailCardMaxHeightPx == null) {
      return;
    }
    if (detailCardResizeAnimationRef.current) return;

    let nextHeight = detailCardHeightPx;
    if (nextHeight != null) {
      nextHeight = Math.min(nextHeight, detailCardMaxHeightPx);
    } else {
      const cardSurface = detailCardSurfaceRef.current;
      const activeNatural = detailTabActiveNaturalRef.current;
      if (!cardSurface || !activeNatural) {
        nextHeight = detailCardMaxHeightPx;
      } else {
        const chrome =
          detailCardChromeHeightRef.current ??
          measureDetailCardChromeHeight(cardSurface, activeNatural);
        detailCardChromeHeightRef.current = chrome;
        nextHeight = Math.min(
          Math.ceil(chrome + activeNatural.offsetHeight),
          detailCardMaxHeightPx,
        );
      }
    }
    setDetailCardHeightPx(nextHeight);
    setDetailCardContentIsClamped(nextHeight >= detailCardMaxHeightPx - 1);
  }, [
    isPlayerCappedDrawerViewport,
    detailCardMaxHeightPx,
    detailCardHeightPx,
  ]);

  useEffect(() => {
    return () => {
      detailCardResizeAnimationRef.current?.cancel();
      detailCardResizeAnimationRef.current = null;
      detailTitleResizeAnimationRef.current?.cancel();
      detailTitleResizeAnimationRef.current = null;
      const cardSurface = detailCardSurfaceRef.current;
      if (cardSurface) {
        cardSurface.style.height = "";
        cardSurface.style.transition = "";
      }
      if (detailNowPlayingRef.current) {
        detailNowPlayingRef.current.style.height = "";
      }
    };
  }, []);

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
                className={`video-editing-player video-editing-player--plyr group relative overflow-hidden rounded-sm sm:rounded-xl${
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
                <div className={worksStripOuterClass} style={worksArrowIdleStyle}>
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
                      const selectorTitle = video.selectorTitle?.trim() || (isSlaywire ? "" : `Edit ${index + 1}`);
                      const selectorSubtitle =
                        video.selectorSubtitle?.trim() || (isSlaywire ? "" : "Video edit");
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
                            className={`video-editing-works-strip-thumb-art relative block h-[4.9rem] w-full overflow-hidden rounded-sm sm:rounded-xl border transition-colors ${
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
                          {selectorTitle || selectorSubtitle ? (
                            <span className="video-editing-works-strip-thumb-caption">
                              {selectorTitle ? (
                                <span className="mt-1.5 block font-heading text-sm leading-tight uppercase text-white">
                                  {selectorTitle}
                                </span>
                              ) : null}
                              {selectorSubtitle ? (
                                <span className="mt-0.5 block font-body text-[12px] leading-tight text-mono-2">
                                  {selectorSubtitle}
                                </span>
                              ) : null}
                            </span>
                          ) : null}
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
              <div
                ref={detailNowPlayingRef}
                className={`video-editing-detail-now-playing relative w-full min-w-0${
                  isPlayerCappedDrawerViewport ? "" : " mt-3.5 sm:mt-4"
                }`}
              >
                <div className="flex w-full min-w-0 flex-col items-stretch gap-y-1.5 text-left">
                  {videos.map((video, index) => {
                    const selectorTitle =
                      video.selectorTitle?.trim() ||
                      (isSlaywire ? card.title : video.label || "Selected work");
                    const selectorSubtitle = video.selectorSubtitle?.trim() || "";
                    return (
                      <div
                        key={`title-reserve-${video.id}`}
                        ref={(el) => {
                          detailTitleMeasureRefs.current[index] = el;
                        }}
                        className="pointer-events-none absolute left-0 top-0 -z-10 flex w-full min-w-0 flex-col items-stretch gap-y-1.5 overflow-hidden opacity-0 text-left"
                        aria-hidden
                      >
                        <h3 className="m-0 w-full font-display text-2xl md:text-3xl leading-[1.1] tracking-[-0.015em] text-white">
                          {selectorTitle}
                        </h3>
                        {selectorSubtitle ? (
                          <p className="m-0 w-full pl-[2px] font-body text-sm sm:text-base leading-snug text-mono-2">
                            {selectorSubtitle}
                          </p>
                        ) : null}
                      </div>
                    );
                  })}
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
              <div
                ref={detailPanelReserveRef}
                className="w-full min-w-0 [overflow-anchor:none]"
              >
                <section
                  ref={detailCardSurfaceRef}
                  className={`${showcaseDetailCardClass} video-editing-detail-meta-card mt-3.5 flex w-full min-w-0 flex-col overflow-hidden [overflow-anchor:none] sm:mt-4${
                    detailCardMaxHeightPx != null ? " min-h-0" : ""
                  }`}
                  style={
                    detailCardMaxHeightPx != null
                      ? {
                          maxHeight: `${detailCardMaxHeightPx}px`,
                          ...(detailCardHeightPx != null
                            ? { height: `${detailCardHeightPx}px` }
                            : {}),
                        }
                      : undefined
                  }
                >
                  <div
                    className={`video-editing-detail-overview w-full min-w-0${
                      detailCardIsAtMaxHeight ? " flex min-h-0 flex-1 flex-col" : ""
                    }`}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={activeVideo.id}
                        initial={false}
                        className={`video-editing-detail-cards-tabs flex w-full min-w-0 flex-col gap-2.5${
                          detailCardIsAtMaxHeight ? " min-h-0 flex-1" : ""
                        }`}
                      >
                        {renderDetailCardTabList()}
                        <div
                          ref={detailTabpanelScrollRef as Ref<HTMLDivElement>}
                          role="tabpanel"
                          id={`video-detail-panel-${activeDetailCardTab}`}
                          aria-labelledby={`video-detail-tab-${activeDetailCardTab}`}
                          className={`video-editing-detail-card-tabpanel min-w-0 [overflow-anchor:none]${
                            detailCardIsAtMaxHeight
                              ? detailTabpanelScrollFrozen
                                ? " min-h-0 flex-1 overflow-hidden"
                                : " min-h-0 flex-1 overflow-y-auto no-scrollbar"
                              : ""
                          }${
                            detailCardIsAtMaxHeight && detailTabpanelCutoffFade
                              ? " content-cutoff-fade"
                              : ""
                          }`}
                          style={{
                            opacity: detailBodyVisible ? 1 : 0,
                            transition: reduceMotion
                              ? undefined
                              : `opacity ${
                                  detailBodyVisible
                                    ? DETAIL_TAB_BODY_IN_S
                                    : DETAIL_TAB_BODY_OUT_S
                                }s ${DETAIL_CARD_RESIZE_EASE}`,
                          }}
                        >
                          <div className="video-editing-detail-card-tab-surface relative min-w-0 pt-1">
                            <div ref={detailTabActiveNaturalRef} className="min-w-0">
                              {renderDetailCardTabBody(activeDetailCardTab, "portrait")}
                            </div>
                            {isCompactDrawerViewport ? (
                              <div className="pointer-events-none absolute left-0 top-1 -z-10 h-0 w-full overflow-hidden opacity-0" aria-hidden>
                                {DETAIL_CARD_TAB_IDS.map((tabId) => (
                                  <div
                                    key={`measure-${tabId}`}
                                    ref={(el) => {
                                      detailTabHiddenMeasureRefs.current[tabId] = el;
                                    }}
                                    className="absolute left-0 top-0 w-full min-w-0"
                                  >
                                    {renderPortraitDetailTabBody(tabId)}
                                  </div>
                                ))}
                                {videos.map((video, index) => (
                                  <div
                                    key={`measure-video-overview-${video.id}`}
                                    ref={(el) => {
                                      detailVideoOverviewMeasureRefs.current[index] = el;
                                    }}
                                    className="absolute left-0 top-0 w-full min-w-0"
                                  >
                                    <p className="m-0 whitespace-pre-line font-body text-sm leading-snug text-mono-2 sm:text-base">
                                      {renderDetailInlineEm(
                                        video.detailOverview?.trim() ||
                                          card.detailOverview?.trim() ||
                                          "?",
                                      )}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
