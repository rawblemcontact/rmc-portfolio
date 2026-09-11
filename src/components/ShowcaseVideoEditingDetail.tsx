import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type Ref } from "react";
import { flushSync } from "react-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import Plyr from "plyr";
import type { Options as PlyrOptions } from "plyr";
import "plyr/dist/plyr.css";
import { directionalArrowIdlePhaseDelaySec, EASE } from "@/lib/motion";

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
/**
 * After height settles, arm the cutoff dissolve briefly before body opacity
 * so the soft edge is already easing when copy fades in.
 */
const DETAIL_CUTOFF_LEAD_MS = 200;
/**
 * Wait for tab FLIP to settle before drawing the new underline (avoids scaling
 * while the parent is still translating).
 */
const DETAIL_TAB_UNDERLINE_DRAW_DELAY_MS = Math.round(DETAIL_TAB_SWAP_DUR_S * 1000);
/**
 * Center-out scaleX — same ease family as hero / PROJECTS accent.
 * Close is shorter + fades so the old bar clears before the new one draws.
 */
const DETAIL_TAB_UNDERLINE_DUR_S = 0.28;
const DETAIL_TAB_UNDERLINE_CLOSE_DUR_S = 0.08;
const DETAIL_TAB_UNDERLINE_EASE = EASE.out;
/** Description-card height keyframes stay synchronized with the tab swap. */
const DETAIL_CARD_RESIZE_DUR_MS = Math.round(DETAIL_TAB_SWAP_DUR_S * 1000);
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
const DETAIL_NATURAL_HEIGHT_DELAY_MS = DETAIL_TAB_UNDERLINE_DRAW_DELAY_MS;
const DETAIL_TAB_BODY_IN_DELAY_NATURAL_S =
  (DETAIL_NATURAL_HEIGHT_DELAY_MS - DETAIL_BODY_OUT_MS + DETAIL_CARD_RESIZE_DUR_MS + 32) /
  1000;
/** Thumbnail title reflow completes before its description drawer changes size. */
const DETAIL_TITLE_MOVE_DUR_MS = DETAIL_CARD_RESIZE_DUR_MS;
/**
 * Clicks closer than this are "rapid": abort/coalesce and snap instead of stacking
 * the full title→card→reveal choreography.
 */
const WORK_SWITCH_RAPID_IDLE_MS = 180;
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
  const visualBeforeBody =
    activeNatural.getBoundingClientRect().top - cardSurface.getBoundingClientRect().top;
  const layoutBeforeBody = visualPxToLayoutPx(cardSurface, visualBeforeBody);
  const paddingBottom = parseFloat(getComputedStyle(cardSurface).paddingBottom) || 0;
  const tabSurface = cardSurface.querySelector(".video-editing-detail-card-tab-surface");
  const tabSurfacePadBottom =
    tabSurface instanceof HTMLElement
      ? parseFloat(getComputedStyle(tabSurface).paddingBottom) || 0
      : 0;
  return Math.max(0, Math.ceil(layoutBeforeBody + paddingBottom + tabSurfacePadBottom));
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
  // Tab-surface bottom padding sits below the natural body but inside the card —
  // omit it and short tabs (e.g. TOOLS) settle a few px short with a false fade.
  const tabSurface = cardSurface.querySelector(".video-editing-detail-card-tab-surface");
  const tabSurfacePadBottom =
    tabSurface instanceof HTMLElement
      ? parseFloat(getComputedStyle(tabSurface).paddingBottom) || 0
      : 0;
  // scrollHeight catches cases where offsetHeight under-reports (stacked measure layer).
  const bodyH = Math.max(targetProbe.offsetHeight, targetProbe.scrollHeight);
  return Math.ceil(layoutBeforeBody + bodyH + paddingBottom + tabSurfacePadBottom);
}

function liveDetailCardBodyEl(container: HTMLElement | null): HTMLElement | null {
  if (!container) return null;
  const bodies = container.querySelectorAll(".video-editing-detail-card-tab-body");
  let fallback: HTMLElement | null = null;
  for (const el of bodies) {
    if (!(el instanceof HTMLElement)) continue;
    fallback = el;
    const opacity = parseFloat(getComputedStyle(el).opacity);
    if (el.offsetHeight > 0 && opacity > 0.5) return el;
  }
  return fallback ?? container;
}

/** True when the drawer is painted at the player-aligned ceiling (tolerance for subpixels). */
function detailCardIsAtPlayerCap(
  heightPx: number | null | undefined,
  maxHeightPx: number | null | undefined,
): boolean {
  return (
    heightPx != null &&
    maxHeightPx != null &&
    heightPx >= maxHeightPx - 1
  );
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
   * Yellow underline: deselected tab retracts + fades immediately; selected tab
   * draws from center only after FLIP settles. `null` = no bar mid-transition.
   */
  const [underlineTabId, setUnderlineTabId] = useState<DetailCardTabId | null>("overview");
  const underlineActiveTabRef = useRef<DetailCardTabId>("overview");
  /** Player-capped drawer: ceiling at main video card bottom (expand/shrink below this). */
  const [detailCardMaxHeightPx, setDetailCardMaxHeightPx] = useState<number | null>(null);
  const detailCardMaxHeightPxRef = useRef<number | null>(null);
  /** Player-capped drawer: explicit height so tall tabs fill to the video bottom. */
  const [detailCardHeightPx, setDetailCardHeightPx] = useState<number | null>(null);
  /**
   * While WAAPI owns height, keep React from re-applying a stale `height` style on
   * unrelated re-renders (that snapped TOOLS→OVERVIEW back to the old target).
   * Still always paint *some* height — clearing it to "" flashed the card (RAWBLEM).
   */
  const [detailCardHeightTransitioning, setDetailCardHeightTransitioning] =
    useState(false);
  const detailCardHeightTransitioningRef = useRef(false);
  /** Height React should keep applied while transitioning (pinned from-height). */
  const detailCardTransitionHeightRef = useRef<number | null>(null);
  /**
   * Player-capped drawers always pin an explicit height under the video. Inner scroll +
   * cutoff fade must arm whenever that height is active — not only when height == max.
   * Otherwise a stale short height (below the player cap) hard-clips tall OVERVIEW copy
   * with overflow:hidden and no scroll/fade.
   */
  const detailCardUsesInnerScroll =
    isPlayerCappedDrawerViewport &&
    detailCardMaxHeightPx != null &&
    detailCardHeightPx != null;
  const detailTabpanelScrollRef = useRef<HTMLElement | null>(null);
  const [detailTabpanelCutoffFade, setDetailTabpanelCutoffFade] = useState<
    "none" | "top" | "bottom" | "both"
  >("none");
  const detailTabpanelCutoffFadeRef = useRef(detailTabpanelCutoffFade);
  detailTabpanelCutoffFadeRef.current = detailTabpanelCutoffFade;
  /** Snap cutoff strength (no CSS ease) while height/copy are mid-swap. */
  const [detailTabCutoffInstant, setDetailTabCutoffInstant] = useState(false);
  const detailTabCutoffInstantRef = useRef(false);
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
  /** Bumps on every new card resize so delayed/stale WAAPI finishes cannot apply. */
  const detailCardResizeEpochRef = useRef(0);
  /** Delay timer before card resize — target height is measured when this fires, not when scheduled. */
  const detailCardResizeDelayTimerRef = useRef<number | null>(null);
  const detailCardLiveFitTimersRef = useRef<number[]>([]);
  const fitDetailCardToLiveBodyRef = useRef<(opts?: { force?: boolean }) => void>(() => {});
  const scheduleFitDetailCardToLiveBodyRef = useRef<() => void>(() => {});
  const detailTitleResizeAnimationRef = useRef<Animation | null>(null);
  const afterTitleResizeRef = useRef<(() => void) | null>(null);
  const afterTitleResizeTimerRef = useRef<number | null>(null);
  const detailRootRef = useRef<HTMLDivElement | null>(null);
  const detailCardSurfaceRef = useRef<HTMLElement | null>(null);
  const detailNowPlayingRef = useRef<HTMLDivElement | null>(null);
  /** Natural drawer: unlock section scroll / card hit-testing after a tab resize. */
  const detailNaturalResizeCleanupRef = useRef<(() => void) | null>(null);
  const [pressedWorksArrow, setPressedWorksArrow] = useState<"prev" | "next" | null>(null);
  const thumbRefs = useRef<Array<HTMLElement | null>>([]);
  const thumbStripRef = useRef<HTMLDivElement | null>(null);
  const activeVideoIndexRef = useRef(0);
  /**
   * Whole entry-switch generation. Title/card/reveal completions no-op when stale.
   * Distinct from detailCardResizeEpochRef (height-only).
   */
  const workSwitchEpochRef = useRef(0);
  /** True from commit until body reveal (or snap) finishes. */
  const workSwitchInFlightRef = useRef(false);
  /** Last commit timestamp — gaps under WORK_SWITCH_RAPID_IDLE_MS use the snap path. */
  const workSwitchLastCommitAtRef = useRef(0);
  const worksArrowReleaseTimerRef = useRef<number | null>(null);
  const worksStripProgrammaticUnlockTimerRef = useRef<number | null>(null);
  const worksStripNavLockUntilRef = useRef(0);
  const stripProgrammaticScrollRef = useRef(false);
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

  // Keep the section from re-anchoring while the drawer resizes — pinning scrollTop
  // during thumb/arrow switches yanks the page if the user is also panning.
  useLayoutEffect(() => {
    const surface = detailCardSurfaceRef.current;
    const scrollParent = surface?.closest<HTMLElement>('[aria-label^="Section:"]');
    if (!scrollParent) return;
    const prevOverflowAnchor = scrollParent.style.overflowAnchor;
    scrollParent.style.overflowAnchor = "none";
    return () => {
      scrollParent.style.overflowAnchor = prevOverflowAnchor;
    };
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
    // While the drawer height is still WAAPI-settling, skip mask updates — mid-tween
    // "not at cap" → none → final bottom reads as an end flicker (e.g. RAWBLEM.COM).
    if (
      detailCardHeightTransitioningRef.current ||
      detailCardResizeAnimationRef.current ||
      detailCardResizeDelayTimerRef.current != null
    ) {
      return;
    }
    const surface = detailCardSurfaceRef.current;
    const paintedHeight = surface?.offsetHeight ?? detailCardHeightPx;
    const maxHeight = detailCardMaxHeightPxRef.current ?? detailCardMaxHeightPx;
    // Fade is only for drawers actually at the player ceiling. Below-max cards
    // size to content — no dissolve over the last line (e.g. TOOLS → Audacity).
    let next: "none" | "top" | "bottom" | "both" = "none";
    if (
      panel &&
      content &&
      detailCardUsesInnerScroll &&
      detailCardIsAtPlayerCap(paintedHeight, maxHeight)
    ) {
      const panelRect = panel.getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();
      const panelH = panel.clientHeight;
      const contentH = Math.max(content.offsetHeight, content.scrollHeight);
      // Prefer layout sizes over scroll metrics — scrollHeight can lag one frame
      // after a height commit and briefly under-report (mask arms late → snap).
      const canScroll =
        panel.scrollHeight - panelH > 1 || contentH - panelH > 1;
      const contentPastFold =
        contentRect.bottom > panelRect.bottom + 1 || contentH > panelH + 1;
      const atTop = panel.scrollTop <= 1;
      const atBottom =
        panel.scrollTop + panelH >= Math.max(panel.scrollHeight, contentH) - 4;
      // Top dissolve while scrolled: softens the clip at the body-start inset
      // (all tabs). Keep it at the true bottom so a mid-line isn't hard-cut.
      const showTop = canScroll && !atTop;
      const showBottom = canScroll && contentPastFold && !atBottom;
      next =
        showTop && showBottom
          ? "both"
          : showTop
            ? "top"
            : showBottom
              ? "bottom"
              : "none";
    }
    if (next === detailTabpanelCutoffFadeRef.current) return;
    detailTabpanelCutoffFadeRef.current = next;
    setDetailTabpanelCutoffFade(next);
  }, [detailCardHeightPx, detailCardMaxHeightPx, detailCardUsesInnerScroll]);

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
  }, [updateDetailTabpanelCutoffFade]);

  useLayoutEffect(() => {
    syncDetailTabpanelAfterSwitch();
  }, [
    activeDetailCardTab,
    activeVideoIndex,
    card.id,
    detailCardUsesInnerScroll,
    detailCardHeightPx,
    detailBodyVisible,
    syncDetailTabpanelAfterSwitch,
  ]);

  useEffect(() => {
    const panel = detailTabpanelScrollRef.current;
    if (!panel || !detailCardUsesInnerScroll || !detailBodyVisible) {
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
    detailCardUsesInnerScroll,
    detailCardHeightPx,
    detailBodyVisible,
    updateDetailTabpanelCutoffFade,
  ]);

  /**
   * Tablet / touch: only JS-claim the body while the section scroller is coasting
   * (so inner + page stay usable together). Idle gestures stay fully native so
   * overflowing tabs keep the same rubber-band feel as short ones (e.g. TOOLS).
   * Mask stays on the fade-host, not this node.
   */
  useEffect(() => {
    if (!detailCardUsesInnerScroll || !isPlayerCappedDrawerViewport) return;
    if (usesFinePointerHover()) return;

    const panel = detailTabpanelScrollRef.current;
    if (!panel) return;

    const sectionScroller =
      panel.closest<HTMLElement>('[aria-label^="Section:"]') ??
      (() => {
        let current = panel.parentElement;
        while (current) {
          const style = window.getComputedStyle(current);
          if (/(auto|scroll|overlay)/.test(style.overflowY) && current !== panel) {
            return current;
          }
          current = current.parentElement;
        }
        return null;
      })();

    /** Outer scroll is "hot" briefly after it moves — next inner gesture may need JS claim. */
    let outerHotUntil = 0;
    const markOuterHot = () => {
      outerHotUntil = performance.now() + 380;
    };
    sectionScroller?.addEventListener("scroll", markOuterHot, { passive: true });

    let touchId: number | null = null;
    let lastY = 0;
    let lastMoveTime = 0;
    let startX = 0;
    let startY = 0;
    let startOuterTop = 0;
    let startInnerTop = 0;
    /** px/ms — positive scrolls content upward (finger moving up). */
    let velocityY = 0;
    let momentumRaf = 0;
    /** undecided | native (rubber-band) | js (dual-scroll claim) | ignore */
    let mode: "undecided" | "native" | "js" | "ignore" = "undecided";

    const maxScrollTop = () =>
      Math.max(0, panel.scrollHeight - panel.clientHeight);

    const applyScrollTop = (next: number) => {
      const clamped = Math.max(0, Math.min(maxScrollTop(), next));
      panel.scrollTop = clamped;
      return clamped;
    };

    const stopMomentum = () => {
      if (momentumRaf) {
        window.cancelAnimationFrame(momentumRaf);
        momentumRaf = 0;
      }
    };

    const startMomentum = () => {
      stopMomentum();
      let v = Math.max(-2.8, Math.min(2.8, velocityY));
      if (Math.abs(v) < 0.045) return;

      let prev = performance.now();
      const step = (now: number) => {
        const dt = Math.min(34, Math.max(0, now - prev));
        prev = now;
        v *= Math.exp(-0.0032 * dt);
        if (Math.abs(v) < 0.02) {
          momentumRaf = 0;
          return;
        }
        const before = panel.scrollTop;
        const after = applyScrollTop(before + v * dt);
        if (
          after === before ||
          after <= 0 ||
          after >= maxScrollTop() - 0.5
        ) {
          momentumRaf = 0;
          return;
        }
        momentumRaf = window.requestAnimationFrame(step);
      };
      momentumRaf = window.requestAnimationFrame(step);
    };

    const endTouch = (event: TouchEvent) => {
      if (touchId == null) return;
      for (let i = 0; i < event.changedTouches.length; i++) {
        if (event.changedTouches[i]?.identifier === touchId) {
          const wasJs = mode === "js";
          touchId = null;
          mode = "undecided";
          // Only continue JS inertia when we claimed the gesture; native keeps its own.
          if (wasJs) startMomentum();
          return;
        }
      }
    };

    const onTouchStart = (event: TouchEvent) => {
      if (detailTabpanelScrollFrozen) return;
      if (panel.scrollHeight - panel.clientHeight <= 1) return;
      const touch = event.changedTouches[0];
      if (!touch) return;
      stopMomentum();
      touchId = touch.identifier;
      lastY = touch.clientY;
      lastMoveTime = performance.now();
      startX = touch.clientX;
      startY = touch.clientY;
      startOuterTop = sectionScroller?.scrollTop ?? 0;
      startInnerTop = panel.scrollTop;
      velocityY = 0;
      // Prefer native rubber-band unless the page is still coasting.
      mode = performance.now() < outerHotUntil ? "js" : "undecided";
    };

    const onTouchMove = (event: TouchEvent) => {
      if (touchId == null || mode === "ignore") return;
      let touch: Touch | null = null;
      for (let i = 0; i < event.touches.length; i++) {
        const candidate = event.touches[i];
        if (candidate && candidate.identifier === touchId) {
          touch = candidate;
          break;
        }
      }
      if (!touch) return;

      if (mode === "undecided") {
        const dx = touch.clientX - startX;
        const dy = touch.clientY - startY;
        if (Math.abs(dx) < 3 && Math.abs(dy) < 3) return;
        if (Math.abs(dx) > Math.abs(dy)) {
          mode = "ignore";
          return;
        }
        // Default to native (ROLE/TOOLS rubber-band). Escalate to JS only if the
        // section steals the pan while the body should be scrolling.
        mode = "native";
      }

      const now = performance.now();
      const delta = lastY - touch.clientY;
      const dt = Math.max(8, now - lastMoveTime);
      const instant = delta / dt;
      velocityY = velocityY * 0.65 + instant * 0.35;
      lastY = touch.clientY;
      lastMoveTime = now;

      if (mode === "native") {
        const outerMoved =
          sectionScroller != null &&
          Math.abs(sectionScroller.scrollTop - startOuterTop) > 1.5;
        const innerMoved = Math.abs(panel.scrollTop - startInnerTop) > 1.5;
        if (outerMoved && !innerMoved && Math.abs(touch.clientY - startY) > 10) {
          // Page ate the gesture — claim for the rest of this touch.
          mode = "js";
        } else {
          return;
        }
      }

      applyScrollTop(panel.scrollTop + delta);
      if (event.cancelable) event.preventDefault();
    };

    panel.addEventListener("touchstart", onTouchStart, { passive: true });
    panel.addEventListener("touchmove", onTouchMove, { passive: false });
    panel.addEventListener("touchend", endTouch, { passive: true });
    panel.addEventListener("touchcancel", endTouch, { passive: true });

    return () => {
      stopMomentum();
      sectionScroller?.removeEventListener("scroll", markOuterHot);
      panel.removeEventListener("touchstart", onTouchStart);
      panel.removeEventListener("touchmove", onTouchMove);
      panel.removeEventListener("touchend", endTouch);
      panel.removeEventListener("touchcancel", endTouch);
    };
  }, [
    detailCardUsesInnerScroll,
    detailTabpanelScrollFrozen,
    isPlayerCappedDrawerViewport,
    usesFinePointerHover,
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
    }, DETAIL_TAB_UNDERLINE_DRAW_DELAY_MS);

    return () => window.clearTimeout(timerId);
  }, [activeDetailCardTab, reduceMotion]);

  const clearWorksArrowReleaseTimer = useCallback(() => {
    if (worksArrowReleaseTimerRef.current !== null) {
      window.clearTimeout(worksArrowReleaseTimerRef.current);
      worksArrowReleaseTimerRef.current = null;
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
      clearWorksStripProgrammaticUnlockTimer();
    };
  }, [clearWorksArrowReleaseTimer, clearWorksStripProgrammaticUnlockTimer]);

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

  const releaseNaturalDrawerResizeLock = useCallback(() => {
    detailNaturalResizeCleanupRef.current?.();
    detailNaturalResizeCleanupRef.current = null;
    const cardSurface = detailCardSurfaceRef.current;
    if (cardSurface) {
      cardSurface.style.pointerEvents = "";
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

  /** Disable card hits while height WAAPI runs. Do not pin scrollTop or
   * will-change/transform — those yank the page if the user pans during thumb/arrow. */
  const armNaturalDrawerResizeLock = useCallback(
    (cardSurface: HTMLElement) => {
      releaseNaturalDrawerResizeLock();
      cardSurface.style.pointerEvents = "none";

      detailNaturalResizeCleanupRef.current = () => {
        cardSurface.style.pointerEvents = "";
      };
    },
    [releaseNaturalDrawerResizeLock],
  );

  useEffect(() => {
    return () => releaseNaturalDrawerResizeLock();
  }, [releaseNaturalDrawerResizeLock]);

  const cancelScheduledDetailCardResize = useCallback(() => {
    if (detailCardResizeDelayTimerRef.current != null) {
      window.clearTimeout(detailCardResizeDelayTimerRef.current);
      detailCardResizeDelayTimerRef.current = null;
    }
    detailCardResizeAnimationRef.current?.cancel();
    detailCardResizeAnimationRef.current = null;
  }, []);

  const beginDetailCardHeightTransition = useCallback(() => {
    const surface = detailCardSurfaceRef.current;
    const maxHeight = detailCardMaxHeightPxRef.current;
    const current =
      surface && surface.offsetHeight > 0
        ? surface.offsetHeight
        : detailCardHeightPx;
    if (current != null && current > 0) {
      const pinned =
        maxHeight != null ? Math.min(current, maxHeight) : current;
      detailCardTransitionHeightRef.current = pinned;
      if (surface) surface.style.height = `${pinned}px`;
    }
    detailCardHeightTransitioningRef.current = true;
    setDetailCardHeightTransitioning(true);
  }, [detailCardHeightPx]);

  const endDetailCardHeightTransition = useCallback((nextHeight: number | null) => {
    detailCardHeightTransitioningRef.current = false;
    if (nextHeight != null) {
      detailCardTransitionHeightRef.current = nextHeight;
      flushSync(() => {
        setDetailCardHeightPx(nextHeight);
        setDetailCardHeightTransitioning(false);
      });
    } else {
      detailCardTransitionHeightRef.current = null;
      setDetailCardHeightTransitioning(false);
    }
  }, []);

  /** Fresh player-bottom cap — title moves change cardTop without resizing the card. */
  const syncDetailCardMaxHeightNow = useCallback(() => {
    if (!isPlayerCappedDrawerViewport) return null;
    const root = detailRootRef.current;
    const cardEl = detailCardSurfaceRef.current;
    if (!root || !cardEl) return detailCardMaxHeightPxRef.current;
    const player = root.querySelector(".video-editing-player");
    if (!(player instanceof HTMLElement)) return detailCardMaxHeightPxRef.current;
    const playerBottom = player.getBoundingClientRect().bottom;
    const cardTop = cardEl.getBoundingClientRect().top;
    const visualCap = Math.max(0, playerBottom - cardTop);
    const next = visualPxToLayoutPx(cardEl, visualCap);
    detailCardMaxHeightPxRef.current = next;
    setDetailCardMaxHeightPx((prev) => (prev === next ? prev : next));

    // When the title grows, cardTop drops and the ceiling shrinks. Do not snap the
    // drawer here while title/card height is tweening — that skips the desc anim
    // on two-line titles (e.g. ANIMATION BREAKDOWN - SHINING RING).
    // Title wrap (extra line) lowers cardTop and shrinks this cap. Never snap the
    // drawer to the new ceiling during a work switch — that skips the height tween.
    if (
      workSwitchInFlightRef.current ||
      detailTitleResizeAnimationRef.current ||
      detailCardHeightTransitioningRef.current ||
      detailCardResizeAnimationRef.current ||
      detailCardResizeDelayTimerRef.current != null
    ) {
      return next;
    }
    const liveHeight =
      detailCardTransitionHeightRef.current ?? cardEl.offsetHeight;
    if (liveHeight > next) {
      detailCardTransitionHeightRef.current = next;
      cardEl.style.height = `${next}px`;
      setDetailCardHeightPx((prev) => (prev === next ? prev : next));
    }
    return next;
  }, [isPlayerCappedDrawerViewport]);

  useEffect(() => {
    if (!isPlayerCappedDrawerViewport) {
      setDetailCardMaxHeightPx(null);
      detailCardMaxHeightPxRef.current = null;
      setDetailCardHeightPx(null);
      detailCardHeightTransitioningRef.current = false;
      setDetailCardHeightTransitioning(false);
      return;
    }

    const root = detailRootRef.current;
    if (!root) return;

    const syncDetailCardMaxHeightToPlayer = () => {
      syncDetailCardMaxHeightNow();
    };

    syncDetailCardMaxHeightToPlayer();
    const raf = window.requestAnimationFrame(syncDetailCardMaxHeightToPlayer);
    const player = root.querySelector(".video-editing-player");
    const titleArea = detailNowPlayingRef.current;
    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => syncDetailCardMaxHeightToPlayer())
        : null;
    if (player && resizeObserver) resizeObserver.observe(player);
    if (detailCardSurfaceRef.current && resizeObserver) {
      resizeObserver.observe(detailCardSurfaceRef.current);
    }
    // Title height changes move cardTop; observe so the player-cap ceiling tracks.
    if (titleArea && resizeObserver) resizeObserver.observe(titleArea);
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
    syncDetailCardMaxHeightNow,
  ]);

  /**
   * Animate the info card to a probe’s height. Target height is measured when the
   * resize actually starts (after `delayMs`), so title moves / player-cap shifts
   * cannot leave a stale toHeight from schedule time.
   */
  const animateDetailCardToMeasuredBody = useCallback(
    (
      targetProbe: HTMLElement,
      delayMs = 0,
      options?: {
        onSettled?: () => void;
        /** Skip WAAPI — pin measured height immediately (rapid work switches). */
        snap?: boolean;
        /** When set, settle no-ops if the whole work-switch epoch moved on. */
        switchEpoch?: number;
        /** Force destination height (still clamped to the player cap when present). */
        toHeightPx?: number;
      },
    ) => {
      const onSettled = options?.onSettled;
      const snap = Boolean(options?.snap);
      const switchEpoch = options?.switchEpoch;
      const forcedToHeightPx = options?.toHeightPx;
      const cardSurface = detailCardSurfaceRef.current;
      const activeNatural = detailTabActiveNaturalRef.current;
      const probeReady =
        targetProbe.offsetHeight > 0 ||
        targetProbe.scrollHeight > 0 ||
        forcedToHeightPx != null;
      if (!cardSurface || !activeNatural || !probeReady) {
        onSettled?.();
        return;
      }

      const epoch = ++detailCardResizeEpochRef.current;
      cancelScheduledDetailCardResize();
      if (!snap) {
        beginDetailCardHeightTransition();
      }

      const isSwitchStale = () =>
        switchEpoch != null && switchEpoch !== workSwitchEpochRef.current;

      const pinFromHeight = () => {
        const surface = detailCardSurfaceRef.current;
        if (!surface) return;
        const maxHeight = detailCardMaxHeightPxRef.current;
        const fromHeightRaw = surface.offsetHeight;
        const fromHeight =
          maxHeight != null ? Math.min(fromHeightRaw, maxHeight) : fromHeightRaw;
        detailCardTransitionHeightRef.current = fromHeight;
        surface.style.height = `${fromHeight}px`;
        if (maxHeight == null) {
          surface.style.transition = "none";
        }
      };

      const commitHeight = (surface: HTMLElement, nextHeight: number, maxHeight: number | null) => {
        detailCardTransitionHeightRef.current = nextHeight;
        surface.style.height = `${nextHeight}px`;
        if (maxHeight == null) {
          surface.style.transition = "none";
        }
        endDetailCardHeightTransition(maxHeight != null ? nextHeight : null);
      };

      const runResize = () => {
        detailCardResizeDelayTimerRef.current = null;
        if (epoch !== detailCardResizeEpochRef.current) return;
        if (isSwitchStale()) {
          endDetailCardHeightTransition(null);
          return;
        }

        const surface = detailCardSurfaceRef.current;
        if (!surface || (!forcedToHeightPx && targetProbe.offsetHeight <= 0 && targetProbe.scrollHeight <= 0)) {
          endDetailCardHeightTransition(null);
          onSettled?.();
          return;
        }

        // Remeasure after title / layout delay so the player-cap matches the card’s new top.
        syncDetailCardMaxHeightNow();
        const maxHeight = detailCardMaxHeightPxRef.current;
        const naturalToHeight =
          forcedToHeightPx != null
            ? forcedToHeightPx
            : measureDetailCardHeightForProbe(surface, targetProbe);
        const probeBodyH = Math.max(targetProbe.offsetHeight, targetProbe.scrollHeight);
        if (forcedToHeightPx == null && probeBodyH > 0) {
          detailCardChromeHeightRef.current = Math.max(0, naturalToHeight - probeBodyH);
        }
        const toHeight =
          maxHeight != null ? Math.min(naturalToHeight, maxHeight) : naturalToHeight;
        const fromHeightRaw = surface.offsetHeight;
        const fromHeight =
          maxHeight != null ? Math.min(fromHeightRaw, maxHeight) : fromHeightRaw;

        if (snap || !isCompactDrawerViewport || reduceMotion) {
          if (maxHeight != null) {
            commitHeight(surface, toHeight, maxHeight);
          } else {
            surface.style.height = `${toHeight}px`;
            surface.style.transition = "none";
            endDetailCardHeightTransition(null);
          }
          onSettled?.();
          scheduleFitDetailCardToLiveBodyRef.current();
          return;
        }

        if (Math.abs(toHeight - fromHeight) <= 0.5) {
          commitHeight(surface, toHeight, maxHeight);
          onSettled?.();
          scheduleFitDetailCardToLiveBodyRef.current();
          return;
        }

        surface.style.height = `${fromHeight}px`;
        detailCardTransitionHeightRef.current = fromHeight;
        if (maxHeight == null) {
          surface.style.transition = "none";
        }

        const resizeAnimation = surface.animate(
          [{ height: `${fromHeight}px` }, { height: `${toHeight}px` }],
          {
            duration: DETAIL_CARD_RESIZE_DUR_MS,
            easing: DETAIL_CARD_RESIZE_EASE,
            // forwards (not both): avoid a finished fill fighting React after settle.
            fill: "forwards",
          },
        );
        detailCardResizeAnimationRef.current = resizeAnimation;
        let finishOnce = false;

        const clearThisAnimation = () => {
          if (detailCardResizeAnimationRef.current === resizeAnimation) {
            detailCardResizeAnimationRef.current = null;
          }
          try {
            if (typeof resizeAnimation.commitStyles === "function") {
              resizeAnimation.commitStyles();
            }
          } catch {
            // commitStyles can throw if the animation already canceled.
          }
          try {
            resizeAnimation.cancel();
          } catch {
            // ignore
          }
          // Scrub leftover finished height animations (fill artifacts in some engines).
          try {
            for (const anim of surface.getAnimations()) {
              const effect = anim.effect;
              const keyframes =
                effect && "getKeyframes" in effect
                  ? (effect as KeyframeEffect).getKeyframes()
                  : null;
              const touchesHeight = Array.isArray(keyframes)
                ? keyframes.some((frame) => frame.height != null)
                : false;
              if (!touchesHeight) continue;
              try {
                if (typeof anim.commitStyles === "function") anim.commitStyles();
              } catch {
                // ignore
              }
              anim.cancel();
            }
          } catch {
            // ignore
          }
        };

        const finishResize = () => {
          if (finishOnce) return;
          finishOnce = true;

          if (epoch !== detailCardResizeEpochRef.current || isSwitchStale()) {
            clearThisAnimation();
            return;
          }

          clearThisAnimation();

          if (maxHeight != null) {
            // Commit the height we actually animated to. Re-probing here caused a
            // visible end flicker (RAWBLEM) when the settle measure disagreed by a few px.
            syncDetailCardMaxHeightNow();
            const latestMax = detailCardMaxHeightPxRef.current;
            const settledTo =
              latestMax != null ? Math.min(toHeight, latestMax) : toHeight;
            commitHeight(surface, settledTo, latestMax);
            onSettled?.();
            scheduleFitDetailCardToLiveBodyRef.current();
            return;
          }

          // Natural drawers: prefer the painted body over hidden probes (probes can wrap short).
          const live = liveDetailCardBodyEl(detailTabActiveNaturalRef.current);
          const liveH = live ? Math.max(live.offsetHeight, live.scrollHeight) : 0;
          const settledHeight =
            liveH > 0
              ? measureDetailCardHeightForProbe(surface, live)
              : measureDetailCardHeightForProbe(surface, targetProbe);
          surface.style.height = `${toHeight}px`;
          surface.style.transition = "none";

          if (Math.abs(settledHeight - toHeight) > 0.5) {
            const settleAnimation = surface.animate(
              [{ height: `${toHeight}px` }, { height: `${settledHeight}px` }],
              {
                duration: 120,
                easing: DETAIL_CARD_RESIZE_EASE,
                fill: "forwards",
              },
            );
            detailCardResizeAnimationRef.current = settleAnimation;
            let settleOnce = false;
            const finishSettle = () => {
              if (settleOnce) return;
              settleOnce = true;
              if (detailCardResizeAnimationRef.current === settleAnimation) {
                detailCardResizeAnimationRef.current = null;
              }
              try {
                if (typeof settleAnimation.commitStyles === "function") {
                  settleAnimation.commitStyles();
                }
              } catch {
                // ignore
              }
              settleAnimation.cancel();
              if (epoch !== detailCardResizeEpochRef.current || isSwitchStale()) return;
              surface.style.height = `${settledHeight}px`;
              surface.style.transition = "none";
              endDetailCardHeightTransition(null);
              onSettled?.();
              scheduleFitDetailCardToLiveBodyRef.current();
            };
            settleAnimation.onfinish = finishSettle;
            settleAnimation.finished.then(finishSettle).catch(() => {
              // Cancelled by a newer thumbnail or tab selection.
            });
            return;
          }

          endDetailCardHeightTransition(null);
          onSettled?.();
          scheduleFitDetailCardToLiveBodyRef.current();
        };

        resizeAnimation.onfinish = finishResize;
        resizeAnimation.finished.then(finishResize).catch(() => {
          if (detailCardResizeAnimationRef.current === resizeAnimation) {
            detailCardResizeAnimationRef.current = null;
          }
        });
        window.setTimeout(() => {
          if (epoch !== detailCardResizeEpochRef.current) return;
          if (finishOnce) return;
          finishResize();
        }, DETAIL_CARD_RESIZE_DUR_MS + 48);
      };

      if (!snap && delayMs > 0) {
        pinFromHeight();
        detailCardResizeDelayTimerRef.current = window.setTimeout(runResize, delayMs);
      } else {
        runResize();
      }
    },
    [
      beginDetailCardHeightTransition,
      cancelScheduledDetailCardResize,
      endDetailCardHeightTransition,
      isCompactDrawerViewport,
      reduceMotion,
      syncDetailCardMaxHeightNow,
    ],
  );

  /** After copy is painted, size the drawer to the live body — hidden probes can wrap short. */
  const fitDetailCardToLiveBody = useCallback((opts?: { force?: boolean }) => {
    const force = Boolean(opts?.force);
    if (
      detailTitleResizeAnimationRef.current ||
      (!force &&
        (detailCardHeightTransitioningRef.current ||
          detailCardResizeAnimationRef.current ||
          detailCardResizeDelayTimerRef.current != null))
    ) {
      return;
    }
    const surface = detailCardSurfaceRef.current;
    const live = liveDetailCardBodyEl(detailTabActiveNaturalRef.current);
    if (!surface || !live) return;
    if (!force && !detailBodyVisibleRef.current) return;
    const liveH = Math.max(live.offsetHeight, live.scrollHeight);
    if (liveH <= 0) return;
    const next = measureDetailCardHeightForProbe(surface, live);
    if (next <= 0) return;
    const maxHeight = detailCardMaxHeightPxRef.current;
    const clamped = maxHeight != null ? Math.min(next, maxHeight) : next;
    if (Math.abs(surface.offsetHeight - clamped) <= 1) return;
    surface.style.height = `${clamped}px`;
    surface.style.transition = "none";
    if (maxHeight != null) {
      detailCardTransitionHeightRef.current = clamped;
      setDetailCardHeightPx((prev) => (prev === clamped ? prev : clamped));
    }
  }, []);

  const scheduleFitDetailCardToLiveBody = useCallback(() => {
    for (const id of detailCardLiveFitTimersRef.current) window.clearTimeout(id);
    detailCardLiveFitTimersRef.current = [];
    const run = () => fitDetailCardToLiveBody({ force: true });
    requestAnimationFrame(() => {
      run();
      requestAnimationFrame(run);
    });
    detailCardLiveFitTimersRef.current.push(
      window.setTimeout(run, 80),
      window.setTimeout(run, 220),
    );
  }, [fitDetailCardToLiveBody]);

  fitDetailCardToLiveBodyRef.current = fitDetailCardToLiveBody;
  scheduleFitDetailCardToLiveBodyRef.current = scheduleFitDetailCardToLiveBody;

  const animateDetailTitleToMeasuredHeight = useCallback(
    (nextIndex: number, options?: { snap?: boolean; switchEpoch?: number }): number => {
      const titleArea = detailNowPlayingRef.current;
      const targetProbe = detailTitleMeasureRefs.current[nextIndex];
      if (!titleArea || !targetProbe) return 0;

      const fromHeight = titleArea.offsetHeight;
      const toHeight = Math.max(targetProbe.offsetHeight, targetProbe.scrollHeight);
      detailTitleResizeAnimationRef.current?.cancel();
      detailTitleResizeAnimationRef.current = null;
      if (Math.abs(toHeight - fromHeight) <= 0.5) {
        titleArea.style.height = `${toHeight}px`;
        syncDetailCardMaxHeightNow();
        return 0;
      }

      if (options?.snap || reduceMotion) {
        titleArea.style.height = `${toHeight}px`;
        syncDetailCardMaxHeightNow();
        return 0;
      }

      const switchEpoch = options?.switchEpoch;
      titleArea.style.height = `${fromHeight}px`;
      const titleResizeAnimation = titleArea.animate(
        [{ height: `${fromHeight}px` }, { height: `${toHeight}px` }],
        {
          duration: DETAIL_TITLE_MOVE_DUR_MS,
          easing: DETAIL_CARD_RESIZE_EASE,
          fill: "forwards",
        },
      );
      detailTitleResizeAnimationRef.current = titleResizeAnimation;
      titleResizeAnimation.finished
        .then(() => {
          if (detailTitleResizeAnimationRef.current !== titleResizeAnimation) return;
          if (
            switchEpoch != null &&
            switchEpoch !== workSwitchEpochRef.current
          ) {
            titleResizeAnimation.cancel();
            detailTitleResizeAnimationRef.current = null;
            return;
          }
          try {
            if (typeof titleResizeAnimation.commitStyles === "function") {
              titleResizeAnimation.commitStyles();
            }
          } catch {
            // ignore
          }
          titleArea.style.height = `${toHeight}px`;
          titleResizeAnimation.cancel();
          detailTitleResizeAnimationRef.current = null;
          // Title height settled — remeasure player-cap (cardTop moved).
          syncDetailCardMaxHeightNow();
          const pending = afterTitleResizeRef.current;
          afterTitleResizeRef.current = null;
          if (afterTitleResizeTimerRef.current != null) {
            window.clearTimeout(afterTitleResizeTimerRef.current);
            afterTitleResizeTimerRef.current = null;
          }
          pending?.();
        })
        .catch(() => {
          // Cancelled by a newer thumbnail selection.
        });

      return DETAIL_TITLE_MOVE_DUR_MS;
    },
    [reduceMotion, syncDetailCardMaxHeightNow],
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

  /** Hard-abort title/card/body timers so a new switch starts from a clean slate. */
  const abortWorkSwitchMotion = useCallback(() => {
    clearDetailBodySwapTimers();
    cancelScheduledDetailCardResize();
    for (const id of detailCardLiveFitTimersRef.current) window.clearTimeout(id);
    detailCardLiveFitTimersRef.current = [];
    afterTitleResizeRef.current = null;
    if (afterTitleResizeTimerRef.current != null) {
      window.clearTimeout(afterTitleResizeTimerRef.current);
      afterTitleResizeTimerRef.current = null;
    }
    detailCardResizeEpochRef.current += 1;
    detailTitleResizeAnimationRef.current?.cancel();
    detailTitleResizeAnimationRef.current = null;
    detailCardHeightTransitioningRef.current = false;
    setDetailCardHeightTransitioning(false);
  }, [cancelScheduledDetailCardResize, clearDetailBodySwapTimers]);

  useEffect(() => {
    return () => {
      clearDetailBodySwapTimers();
      workSwitchEpochRef.current += 1;
      workSwitchInFlightRef.current = false;
    };
  }, [clearDetailBodySwapTimers]);

  const finishWorkSwitch = useCallback((epoch: number) => {
    if (epoch !== workSwitchEpochRef.current) return;
    workSwitchInFlightRef.current = false;
  }, []);

  const applyActiveWorkIndex = useCallback(
    (nextIndex: number, epoch: number, options?: { rapid?: boolean }) => {
      if (epoch !== workSwitchEpochRef.current) return;

      const rapid = Boolean(options?.rapid) || Boolean(reduceMotion);
      const titleMoveMs = rapid
        ? 0
        : animateDetailTitleToMeasuredHeight(nextIndex, {
            switchEpoch: epoch,
          });
      if (rapid) {
        animateDetailTitleToMeasuredHeight(nextIndex, {
          snap: true,
          switchEpoch: epoch,
        });
      }

      // Hold mask off through the height tween. Snap strength to 0 while hidden
      // so the later arm can ease 0→1 (mask-image class swaps always pop).
      detailTabMaskLockRef.current = true;
      detailTabCutoffInstantRef.current = true;
      setDetailTabCutoffInstant(true);
      detailTabpanelCutoffFadeRef.current = "none";
      setDetailTabpanelCutoffFade("none");

      setActiveDetailCardTab("overview");
      setDetailCardTabOrder([...DETAIL_CARD_TAB_IDS]);
      setUnderlineTabId("overview");
      underlineActiveTabRef.current = "overview";
      activeVideoIndexRef.current = nextIndex;
      setActiveVideoIndex(nextIndex);

      const revealAfterHeightSettle = () => {
        if (epoch !== workSwitchEpochRef.current) return;
        detailBodyRevealTimerRef.current = null;
        requestAnimationFrame(() => {
          if (epoch !== workSwitchEpochRef.current) return;
          // Measure/arm while opacity is still 0.
          detailBodyVisibleRef.current = true;
          detailTabMaskLockRef.current = false;
          detailTabCutoffInstantRef.current = false;
          flushSync(() => {
            setDetailTabCutoffInstant(false);
          });
          requestAnimationFrame(() => {
            if (epoch !== workSwitchEpochRef.current) return;
            updateDetailTabpanelCutoffFade();
            const showBody = () => {
              if (epoch !== workSwitchEpochRef.current) return;
              detailBodyRevealTimerRef.current = null;
              setDetailBodyVisible(true);
              releaseNaturalDrawerResizeLock();
              finishWorkSwitch(epoch);
              scheduleFitDetailCardToLiveBody();
            };
            // Rapid / reduced-motion: no lead. Otherwise let dissolve start first.
            const leadMs = rapid ? 0 : DETAIL_CUTOFF_LEAD_MS;
            if (leadMs <= 0) {
              showBody();
              return;
            }
            detailBodyRevealTimerRef.current = window.setTimeout(showBody, leadMs);
          });
        });
      };

      const startCardResize = () => {
        if (epoch !== workSwitchEpochRef.current) return;
        const targetOverviewProbe = detailVideoOverviewMeasureRefs.current[nextIndex];
        if (targetOverviewProbe) {
          animateDetailCardToMeasuredBody(targetOverviewProbe, 0, {
            snap: rapid,
            switchEpoch: epoch,
            onSettled: revealAfterHeightSettle,
          });
          return;
        }
        revealAfterHeightSettle();
      };

      if (rapid || titleMoveMs <= 0) {
        startCardResize();
        return;
      }

      afterTitleResizeRef.current = startCardResize;
      afterTitleResizeTimerRef.current = window.setTimeout(() => {
        afterTitleResizeTimerRef.current = null;
        const pending = afterTitleResizeRef.current;
        afterTitleResizeRef.current = null;
        pending?.();
      }, titleMoveMs + 64);
    },
    [
      animateDetailCardToMeasuredBody,
      animateDetailTitleToMeasuredHeight,
      finishWorkSwitch,
      reduceMotion,
      releaseNaturalDrawerResizeLock,
      updateDetailTabpanelCutoffFade,
      scheduleFitDetailCardToLiveBody,
    ],
  );

  const commitActiveWorkIndex = useCallback(
    (nextIndex: number, opts?: { forceRapid?: boolean }) => {
      const now = Date.now();
      const rapidGap =
        workSwitchLastCommitAtRef.current > 0 &&
        now - workSwitchLastCommitAtRef.current < WORK_SWITCH_RAPID_IDLE_MS;
      workSwitchLastCommitAtRef.current = now;

      // Same entry already showing and idle — ignore.
      if (
        nextIndex === activeVideoIndexRef.current &&
        detailBodyVisibleRef.current &&
        !workSwitchInFlightRef.current
      ) {
        return;
      }

      // Coalesce-to-latest + hard abort: cancel residual title/card/timers, then
      // start fresh for this index (snap under rapid input).
      const epoch = ++workSwitchEpochRef.current;
      abortWorkSwitchMotion();
      workSwitchInFlightRef.current = true;
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
          detailCardSurfaceRef.current ??
          detailRootRef.current ??
          detailNowPlayingRef.current;
        if (lockTarget) armNaturalDrawerResizeLock(lockTarget);
      }

      const rapid =
        Boolean(opts?.forceRapid) || rapidGap || Boolean(reduceMotion);
      if (rapid) {
        detailBodyVisibleRef.current = false;
        setDetailBodyVisible(false);
        applyActiveWorkIndex(nextIndex, epoch, { rapid: true });
        return;
      }

      const waitForFadeOut = detailBodyVisibleRef.current;
      detailBodyVisibleRef.current = false;
      setDetailBodyVisible(false);
      // Keep any active cutoff mask through the body opacity out so both fade together.

      detailBodySwapTimerRef.current = window.setTimeout(
        () => {
          detailBodySwapTimerRef.current = null;
          if (epoch !== workSwitchEpochRef.current) return;
          applyActiveWorkIndex(nextIndex, epoch, { rapid: false });
        },
        waitForFadeOut ? DETAIL_BODY_OUT_MS : 0,
      );
    },
    [
      abortWorkSwitchMotion,
      applyActiveWorkIndex,
      armNaturalDrawerResizeLock,
      bumpNaturalDrawerReserveForProbe,
      isNaturalDrawerViewport,
      isPlayerCappedDrawerViewport,
      reduceMotion,
      usesFinePointerHover,
    ],
  );

  /** Center a works-strip thumb without scrollIntoView (avoids scrolling the section on mobile). */
  const centerWorksStripThumb = useCallback(
    (index: number, options?: { instant?: boolean }) => {
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
      // Instant on touch: nested smooth scrollTo yanks the section scroller on iOS.
      if (options?.instant || reduceMotion || typeof strip.scrollTo !== "function") {
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
      centerWorksStripThumb(nextIndex, { instant: !usesFinePointerHover() });
    },
    [
      centerWorksStripThumb,
      commitActiveWorkIndex,
      lockWorksStripScrollSync,
      triggerWorksArrowFeedback,
      usesFinePointerHover,
    ],
  );

  const handleWorksArrowPointerDown = useCallback(
    (side: "prev" | "next") => (event: React.PointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
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

    let activeTouchId: number | null = null;
    let pointerArrowTracking = false;
    let activePointerId: number | null = null;
    /** Section still coasting — JS-assist horizontal strip pans (native often ignores them). */
    let outerHotUntil = 0;
    let windDownAssist = false;
    let axisLock: "undecided" | "x" | "y" = "undecided";
    let axisStartX = 0;
    let axisStartY = 0;
    let axisLastX = 0;
    let axisLastMoveTime = 0;
    /** px/ms — positive scrolls content left (finger moving left). */
    let velocityX = 0;
    let momentumRaf = 0;
    const AXIS_LOCK_PX = 4;

    const sectionScroller =
      strip.closest<HTMLElement>('[aria-label^="Section:"]') ??
      (() => {
        let current = strip.parentElement;
        while (current) {
          const style = window.getComputedStyle(current);
          if (/(auto|scroll|overlay)/.test(style.overflowY)) return current;
          current = current.parentElement;
        }
        return null;
      })();

    const markOuterHot = () => {
      // Keep arming for the whole coast (scroll events keep firing while winding down).
      outerHotUntil = performance.now() + 900;
    };

    const maxScrollLeft = () =>
      Math.max(0, strip.scrollWidth - strip.clientWidth);

    const applyScrollLeft = (next: number) => {
      const clamped = Math.max(0, Math.min(maxScrollLeft(), next));
      strip.scrollLeft = clamped;
      return clamped;
    };

    const stopMomentum = () => {
      if (momentumRaf) {
        window.cancelAnimationFrame(momentumRaf);
        momentumRaf = 0;
      }
    };

    /** Nearest snap-start thumb — same settle language as idle native snap-x. */
    const settleSnap = () => {
      strip.style.scrollSnapType = "";
      const thumbs = strip.querySelectorAll<HTMLElement>(".video-editing-works-strip-thumb");
      if (!thumbs.length) return;
      const stripRect = strip.getBoundingClientRect();
      let best = strip.scrollLeft;
      let bestDist = Number.POSITIVE_INFINITY;
      thumbs.forEach((thumb) => {
        const target =
          strip.scrollLeft + (thumb.getBoundingClientRect().left - stripRect.left);
        const dist = Math.abs(target - strip.scrollLeft);
        if (dist < bestDist) {
          bestDist = dist;
          best = target;
        }
      });
      if (typeof strip.scrollTo === "function") {
        strip.scrollTo({ left: best, behavior: "smooth" });
      } else {
        strip.scrollLeft = best;
      }
    };

    const startMomentum = () => {
      stopMomentum();
      let v = Math.max(-2.8, Math.min(2.8, velocityX));
      if (Math.abs(v) < 0.045) {
        settleSnap();
        return;
      }

      let prev = performance.now();
      const step = (now: number) => {
        const dt = Math.min(34, Math.max(0, now - prev));
        prev = now;
        // Match PROJECT DETAILS body coast damping so the fling reads the same.
        v *= Math.exp(-0.0032 * dt);
        if (Math.abs(v) < 0.02) {
          momentumRaf = 0;
          settleSnap();
          return;
        }
        const before = strip.scrollLeft;
        const after = applyScrollLeft(before + v * dt);
        if (after === before || after <= 0 || after >= maxScrollLeft() - 0.5) {
          momentumRaf = 0;
          settleSnap();
          return;
        }
        momentumRaf = window.requestAnimationFrame(step);
      };
      momentumRaf = window.requestAnimationFrame(step);
    };

    const findTouchById = (list: TouchList, id: number) => {
      for (let index = 0; index < list.length; index += 1) {
        if (list[index]?.identifier === id) return list[index];
      }
      return null;
    };

    // Strip may still scroll/snap freely; do not commit a new work from settle position.
    const onScrollEnd = () => {
      stripProgrammaticScrollRef.current = false;
    };

    const runMotionFromPointerEvent = (event: PointerEvent) => {
      const coalescedEvents =
        typeof event.getCoalescedEvents === "function" ? event.getCoalescedEvents() : [event];
      for (const coalesced of coalescedEvents) {
        if (tryFireStripSwipeArrowFromMotion(coalesced.clientX, coalesced.clientY)) break;
      }
    };

    const endStripTouch = (wasHorizontalAssist: boolean) => {
      activeTouchId = null;
      windDownAssist = false;
      axisLock = "undecided";
      if (wasHorizontalAssist) {
        startMomentum();
      } else {
        strip.style.scrollSnapType = "";
      }
    };

    const handleWindowTouchMotion = (event: TouchEvent) => {
      if (activeTouchId === null) return;
      const touch = findTouchById(event.touches, activeTouchId);
      if (!touch) return;
      tryFireStripSwipeArrowFromMotion(touch.clientX, touch.clientY);
    };

    const onStripTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      stopMomentum();
      activeTouchId = touch.identifier;
      windDownAssist = performance.now() < outerHotUntil;
      axisLock = "undecided";
      axisStartX = touch.clientX;
      axisStartY = touch.clientY;
      axisLastX = touch.clientX;
      axisLastMoveTime = performance.now();
      velocityX = 0;
      resetStripSwipeArrowGesture(touch.clientX, touch.clientY);
    };

    const onStripTouchMove = (event: TouchEvent) => {
      if (activeTouchId === null) return;
      const touch = findTouchById(event.touches, activeTouchId);
      if (!touch) return;
      tryFireStripSwipeArrowFromMotion(touch.clientX, touch.clientY);

      // Idle: leave fully native pan-x pan-y. Only assist while section is winding down.
      if (!windDownAssist) return;

      if (axisLock === "undecided") {
        const dx = touch.clientX - axisStartX;
        const dy = touch.clientY - axisStartY;
        if (Math.abs(dx) < AXIS_LOCK_PX && Math.abs(dy) < AXIS_LOCK_PX) return;
        axisLock = Math.abs(dx) >= Math.abs(dy) ? "x" : "y";
        if (axisLock === "x") {
          strip.style.scrollSnapType = "none";
        }
      }

      if (axisLock !== "x") return;

      const now = performance.now();
      const delta = axisLastX - touch.clientX;
      const dt = Math.max(8, now - axisLastMoveTime);
      const instant = delta / dt;
      velocityX = velocityX * 0.65 + instant * 0.35;
      axisLastX = touch.clientX;
      axisLastMoveTime = now;
      applyScrollLeft(strip.scrollLeft + delta);
      // Claim this gesture's default so the strip moves; do not touch section overflow/momentum.
      if (event.cancelable) event.preventDefault();
    };

    const onWindowTouchEnd = (event: TouchEvent) => {
      if (activeTouchId === null) return;
      const touch = findTouchById(event.changedTouches, activeTouchId);
      if (!touch) return;
      tryFireStripSwipeArrowFromMotion(touch.clientX, touch.clientY);
      const wasHorizontalAssist = windDownAssist && axisLock === "x";
      endStripTouch(wasHorizontalAssist);
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

    sectionScroller?.addEventListener("scroll", markOuterHot, { passive: true });
    strip.addEventListener("scrollend", onScrollEnd, { passive: true });
    strip.addEventListener("touchstart", onStripTouchStart, { passive: true });
    strip.addEventListener("touchmove", onStripTouchMove, { passive: false });
    strip.addEventListener("pointerdown", onPointerDown, { passive: true });
    strip.addEventListener("pointermove", onPointerMove, { passive: true });
    strip.addEventListener("pointerup", onPointerUp, { passive: true });
    strip.addEventListener("pointercancel", onPointerUp, { passive: true });
    window.addEventListener("touchmove", handleWindowTouchMotion, { passive: true });
    window.addEventListener("touchend", onWindowTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onWindowTouchEnd, { passive: true });

    return () => {
      stopMomentum();
      strip.style.scrollSnapType = "";
      sectionScroller?.removeEventListener("scroll", markOuterHot);
      strip.removeEventListener("scrollend", onScrollEnd);
      strip.removeEventListener("touchstart", onStripTouchStart);
      strip.removeEventListener("touchmove", onStripTouchMove);
      strip.removeEventListener("pointerdown", onPointerDown);
      strip.removeEventListener("pointermove", onPointerMove);
      strip.removeEventListener("pointerup", onPointerUp);
      strip.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("touchmove", handleWindowTouchMotion);
      window.removeEventListener("touchend", onWindowTouchEnd);
      window.removeEventListener("touchcancel", onWindowTouchEnd);
    };
  }, [resetStripSwipeArrowGesture, tryFireStripSwipeArrowFromMotion, videos.length]);

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
      detailTabCutoffInstantRef.current = true;
      setDetailTabCutoffInstant(true);
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

      if (isCompactDrawerViewport && !reduceMotion) {
        const cardSurface = detailCardSurfaceRef.current;
        const targetProbe = detailTabHiddenMeasureRefs.current[nextTabId];
        // Lock section scroll for the whole FLIP + resize window on natural drawers.
        if (isNaturalDrawerViewport && cardSurface) {
          armNaturalDrawerResizeLock(cardSurface);
        }

        const settleMaskAfterResize = () => {
          const panel = detailTabpanelScrollRef.current;
          if (panel) panel.scrollTop = 0;
          // Unfreeze scrollport after the out-fade so we don’t tear mid-copy.
          if (isPlayerCappedDrawerViewport) {
            flushSync(() => {
              setDetailTabpanelScrollFrozen(false);
            });
          }
          detailTabMaskLockRef.current = false;
          detailTabCutoffInstantRef.current = false;
          flushSync(() => {
            setDetailTabCutoffInstant(false);
          });
          // Next frame: ease strength 0→1 (same host already painted at 0).
          requestAnimationFrame(() => {
            updateDetailTabpanelCutoffFade();
          });
          if (isNaturalDrawerViewport) {
            releaseNaturalDrawerResizeLock();
          }
          requestAnimationFrame(() => {
            scheduleFitDetailCardToLiveBody();
          });
        };

        if (cardSurface && targetProbe && targetProbe.offsetHeight > 0) {
          // Once copy is fully gone, drop the old mask + reset scroll (invisible).
          detailTabMaskSettleTimerRef.current = window.setTimeout(() => {
            detailTabMaskSettleTimerRef.current = null;
            if (detailTabMaskLockRef.current) {
              const panel = detailTabpanelScrollRef.current;
              if (panel) panel.scrollTop = 0;
              setDetailTabpanelCutoffFade("none");
            }
          }, DETAIL_BODY_OUT_MS);

          const resizeDelayMs = isNaturalDrawerViewport
            ? DETAIL_NATURAL_HEIGHT_DELAY_MS
            : DETAIL_BODY_OUT_MS;

          // Measure target when resize starts (after delay), not at click time.
          animateDetailCardToMeasuredBody(targetProbe, resizeDelayMs, {
            onSettled: settleMaskAfterResize,
          });
        } else {
          detailTabMaskLockRef.current = false;
          detailTabCutoffInstantRef.current = false;
          setDetailTabCutoffInstant(false);
          setDetailTabpanelScrollFrozen(false);
          if (isNaturalDrawerViewport) {
            releaseNaturalDrawerResizeLock();
          }
        }
      } else {
        detailTabMaskLockRef.current = false;
        detailTabCutoffInstantRef.current = false;
        setDetailTabCutoffInstant(false);
        setDetailTabpanelScrollFrozen(false);
        updateDetailTabpanelCutoffFade();
      }

      setDetailCardTabOrder((prev) => swapDetailTabToFront(prev, nextTabId));
      setActiveDetailCardTab(nextTabId);
    },
    [
      activeDetailCardTab,
      animateDetailCardToMeasuredBody,
      armNaturalDrawerResizeLock,
      isCompactDrawerViewport,
      isNaturalDrawerViewport,
      isPlayerCappedDrawerViewport,
      reduceMotion,
      releaseNaturalDrawerResizeLock,
      updateDetailTabpanelCutoffFade,
      scheduleFitDetailCardToLiveBody,
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
                  <motion.span
                    className="video-editing-detail-card-tab-underline pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[color:var(--palette-yellow-projects)]"
                    style={{ transformOrigin: "center center" }}
                    initial={false}
                    animate={
                      underlineActive
                        ? { scaleX: 1, opacity: 1 }
                        : { scaleX: 0, opacity: 0 }
                    }
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : underlineActive
                          ? {
                              scaleX: {
                                duration: DETAIL_TAB_UNDERLINE_DUR_S,
                                ease: DETAIL_TAB_UNDERLINE_EASE,
                              },
                              opacity: { duration: 0 },
                            }
                          : {
                              scaleX: {
                                duration: DETAIL_TAB_UNDERLINE_CLOSE_DUR_S,
                                ease: DETAIL_TAB_UNDERLINE_EASE,
                              },
                              opacity: {
                                duration: DETAIL_TAB_UNDERLINE_CLOSE_DUR_S,
                                ease: "easeOut",
                              },
                            }
                    }
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

  /** Initial / cap-change height only — tab/thumb swaps own height via animateDetailCardToMeasuredBody. */
  useLayoutEffect(() => {
    if (!isPlayerCappedDrawerViewport || detailCardMaxHeightPx == null) {
      return;
    }
    // Never stomp an in-flight delayed measure or WAAPI resize (wrong target / flicker).
    if (detailCardHeightTransitioningRef.current) return;
    if (detailCardResizeAnimationRef.current) return;
    if (detailCardResizeDelayTimerRef.current != null) return;
    // Wait until the entry body is showing — same window as the visible grow the user sees.
    if (!detailBodyVisible) return;

    const cardSurface = detailCardSurfaceRef.current;
    const activeNatural = detailTabActiveNaturalRef.current;

    if (detailCardHeightPx == null) {
      let nextHeight = detailCardMaxHeightPx;
      if (cardSurface && activeNatural && activeNatural.offsetHeight > 0) {
        const chrome =
          detailCardChromeHeightRef.current ??
          measureDetailCardChromeHeight(cardSurface, activeNatural);
        detailCardChromeHeightRef.current = chrome;
        nextHeight = Math.min(
          Math.ceil(chrome + Math.max(activeNatural.offsetHeight, activeNatural.scrollHeight)),
          detailCardMaxHeightPx,
        );
      }
      setDetailCardHeightPx(nextHeight);
      return;
    }

    if (!cardSurface || !activeNatural) return;

    const overviewProbe =
      activeDetailCardTab === "overview"
        ? detailVideoOverviewMeasureRefs.current[activeVideoIndex]
        : null;
    const probe =
      overviewProbe ??
      detailTabHiddenMeasureRefs.current[activeDetailCardTab] ??
      activeNatural;

    const settleCutoff = () => {
      // Apply once after height is idle — avoid thrashing mask classes during settle.
      requestAnimationFrame(() => {
        updateDetailTabpanelCutoffFade();
      });
    };

    // Player cap shrank under the card (title grew / layout moved).
    if (detailCardHeightPx > detailCardMaxHeightPx + 0.5) {
      animateDetailCardToMeasuredBody(probe, 0, {
        toHeightPx: detailCardMaxHeightPx,
        onSettled: settleCutoff,
      });
      return;
    }

    // Size to content (clamped by the player cap) — grow OR shrink. Do not force max
    // just because the panel reports a 1px overflow; that left short entries (e.g.
    // FugitiveFilms) stuck at the full ceiling.
    let naturalHeight = 0;
    if (probe && (probe.offsetHeight > 0 || probe.scrollHeight > 0)) {
      naturalHeight = measureDetailCardHeightForProbe(cardSurface, probe);
    } else {
      const bodyH = Math.max(activeNatural.offsetHeight, activeNatural.scrollHeight);
      if (bodyH <= 0) return;
      const chrome =
        detailCardChromeHeightRef.current ??
        measureDetailCardChromeHeight(cardSurface, activeNatural);
      detailCardChromeHeightRef.current = chrome;
      naturalHeight = Math.ceil(chrome + bodyH);
    }

    const panel = detailTabpanelScrollRef.current;
    const panelOverflows =
      Boolean(panel) && panel!.scrollHeight - panel!.clientHeight > 1;
    if (panelOverflows) {
      // Probe can under-read while live copy still clips — take the larger need,
      // still capped at max (so short copy never jumps to the ceiling).
      const liveHeight = measureDetailCardHeightForProbe(cardSurface, activeNatural);
      naturalHeight = Math.max(naturalHeight, liveHeight);
    }

    const nextHeight = Math.min(naturalHeight, detailCardMaxHeightPx);
    if (Math.abs(nextHeight - detailCardHeightPx) <= 0.5) return;

    animateDetailCardToMeasuredBody(probe, 0, {
      toHeightPx: nextHeight,
      onSettled: settleCutoff,
    });
  }, [
    animateDetailCardToMeasuredBody,
    isPlayerCappedDrawerViewport,
    detailCardMaxHeightPx,
    detailCardHeightPx,
    activeDetailCardTab,
    activeVideoIndex,
    detailBodyVisible,
    updateDetailTabpanelCutoffFade,
  ]);

  useEffect(() => {
    if (!isCompactDrawerViewport || !detailBodyVisible) return;
    const live = detailTabActiveNaturalRef.current;
    if (!live || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => scheduleFitDetailCardToLiveBody());
    ro.observe(live);
    const timerId = window.setTimeout(scheduleFitDetailCardToLiveBody, 32);
    return () => {
      ro.disconnect();
      window.clearTimeout(timerId);
    };
  }, [
    activeDetailCardTab,
    activeVideoIndex,
    card.id,
    detailBodyVisible,
    scheduleFitDetailCardToLiveBody,
    isCompactDrawerViewport,
  ]);

  useEffect(() => {
    return () => {
      detailCardResizeEpochRef.current += 1;
      if (detailCardResizeDelayTimerRef.current != null) {
        window.clearTimeout(detailCardResizeDelayTimerRef.current);
        detailCardResizeDelayTimerRef.current = null;
      }
      detailCardResizeAnimationRef.current?.cancel();
      detailCardResizeAnimationRef.current = null;
      for (const id of detailCardLiveFitTimersRef.current) window.clearTimeout(id);
      detailCardLiveFitTimersRef.current = [];
      detailCardHeightTransitioningRef.current = false;
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
                      onMouseDown={(event) => event.preventDefault()}
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
                    className={`video-editing-works-strip no-scrollbar flex min-w-0 snap-x snap-mandatory gap-2 overflow-x-auto pb-0.5 sm:gap-2.5 [touch-action:pan-x_pan-y] [overflow-anchor:none] [overscroll-behavior-x:contain] ${worksStripClass}`}
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
                          className={`video-editing-works-strip-thumb group relative flex shrink-0 snap-start flex-col text-left [touch-action:pan-x_pan-y] cursor-pointer ${worksStripThumbBasisClass} ${
                            active ? "text-white" : "text-mono-2"
                          }`}
                          aria-label={`Select ${isSlaywire ? "media" : "edit"} thumbnail ${index + 1}`}
                          aria-pressed={active}
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={(event) => {
                            handleThumbSelect(index);
                            event.currentTarget.blur();
                          }}
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
                      onMouseDown={(event) => event.preventDefault()}
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
                className={`video-editing-detail-now-playing relative w-full min-w-0${
                  isPlayerCappedDrawerViewport ? "" : " mt-3.5 sm:mt-4"
                }`}
              >
                <div
                  ref={detailNowPlayingRef}
                  className="relative w-full min-w-0 overflow-hidden"
                >
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
                <div
                  className="pointer-events-none invisible absolute left-0 top-0 -z-10 w-full overflow-visible"
                  aria-hidden
                >
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
                        className="flex w-full min-w-0 flex-col items-stretch gap-y-1.5 text-left"
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
                          // Always keep a height painted. During WAAPI, pin the from-height
                          // in React so omitting `height` cannot flash to auto (RAWBLEM).
                          ...(() => {
                            const heightPx = detailCardHeightTransitioning
                              ? (detailCardTransitionHeightRef.current ??
                                detailCardHeightPx)
                              : detailCardHeightPx;
                            return heightPx != null
                              ? { height: `${heightPx}px` }
                              : {};
                          })(),
                        }
                      : undefined
                  }
                >
                  <div
                    className={`video-editing-detail-overview w-full min-w-0${
                      detailCardUsesInnerScroll ? " flex min-h-0 flex-1 flex-col" : ""
                    }`}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={activeVideo.id}
                        initial={false}
                        className={`video-editing-detail-cards-tabs flex w-full min-w-0 flex-col gap-2.5${
                          detailCardUsesInnerScroll ? " min-h-0 flex-1" : ""
                        }`}
                      >
                        {renderDetailCardTabList()}
                        <div
                          className={`video-editing-detail-card-tabpanel-shell relative min-w-0${
                            detailCardUsesInnerScroll ? " flex min-h-0 flex-1 flex-col" : ""
                          }`}
                        >
                          <div
                            className={`video-editing-detail-card-tabpanel-fade-host min-w-0${
                              detailCardUsesInnerScroll
                                ? ` video-editing-detail-card-tabpanel-fade-host--scroll min-h-0 flex-1 overflow-hidden${
                                    detailTabCutoffInstant || reduceMotion
                                      ? " is-cutoff-instant"
                                      : ""
                                  }`
                                : ""
                            }`}
                            style={
                              detailCardUsesInnerScroll
                                ? ({
                                    ["--detail-cutoff-top" as string]:
                                      detailTabpanelCutoffFade === "top" ||
                                      detailTabpanelCutoffFade === "both"
                                        ? 1
                                        : 0,
                                    ["--detail-cutoff-bottom" as string]:
                                      detailTabpanelCutoffFade === "bottom" ||
                                      detailTabpanelCutoffFade === "both"
                                        ? 1
                                        : 0,
                                  } as CSSProperties)
                                : undefined
                            }
                          >
                            <div
                              ref={detailTabpanelScrollRef as Ref<HTMLDivElement>}
                              role="tabpanel"
                              id={`video-detail-panel-${activeDetailCardTab}`}
                              aria-labelledby={`video-detail-tab-${activeDetailCardTab}`}
                              className={`video-editing-detail-card-tabpanel min-w-0 [overflow-anchor:none]${
                                detailCardUsesInnerScroll
                                  ? detailTabpanelScrollFrozen
                                    ? " h-full min-h-0 overflow-hidden"
                                    : " h-full min-h-0 overflow-y-auto overscroll-y-auto touch-pan-y no-scrollbar"
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
                                  <div className="pointer-events-none invisible absolute left-0 top-1 -z-10 w-full overflow-visible" aria-hidden>
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
