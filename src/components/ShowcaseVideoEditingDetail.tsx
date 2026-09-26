import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type Ref } from "react";
import { flushSync } from "react-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import Plyr from "plyr";
import type { Options as PlyrOptions } from "plyr";
import "plyr/dist/plyr.css";
import { directionalArrowIdlePhaseDelaySec, EASE } from "@/lib/motion";
import { afterOrientationSettle } from "@/lib/visualViewport";

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


function facePosterSrc(video: ShowcaseDetailVideo): string | null {
  const src = isImageMedia(video) ? video.url : video.thumbnailSrc;
  if (src && IMAGE_EXT_RE.test(src)) return src;
  const yt = youtubeVideoId(video.url);
  if (yt) return `https://i.ytimg.com/vi/${yt}/hqdefault.jpg`;
  return null;
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
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />
    </div>
  );
}

function VideoEditingPlyrPlayer({
  video,
  className = "",
  onYouTubeLoad,
}: {
  video: ShowcaseDetailVideo;
  className?: string;
  onYouTubeLoad?: () => void;
}) {
  const source = useMemo(() => toPlyrSource(video), [video]);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<Plyr | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !source || source.kind === "youtube") return;

    let cancelled = false;
    let element: HTMLVideoElement | null = null;
    let raf1 = 0;
    let raf2 = 0;

    const teardown = (player: Plyr | null, node: HTMLElement | null) => {
      if (player) {
        try {
          player.destroy();
        } catch {
          // Ignore teardown races from rapid tab / detail transitions.
        }
      }
      if (playerRef.current === player) playerRef.current = null;
      if (node && host.contains(node)) {
        host.removeChild(node);
      }
    };

    // Defer Plyr until the open/back frame has settled — rapid remounts
    // otherwise construct and tear down players in the same tick and lock the tab.
    raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(() => {
        if (cancelled || !hostRef.current || source.kind !== "file") return;
        host.replaceChildren();

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
        host.appendChild(element);

        if (playerRef.current) {
          try {
            playerRef.current.destroy();
          } catch {
            // Ignore teardown races from rapid tab / detail transitions.
          }
          playerRef.current = null;
        }

        const nextPlayer = new Plyr(element, PLRY_OPTIONS);
        playerRef.current = nextPlayer;
      });
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(raf1);
      window.cancelAnimationFrame(raf2);
      teardown(playerRef.current, element);
    };
  }, [source, video.id, video.label]);

  if (!source) return null;
  if (source.kind === "youtube") {
    return (
      <div className={`video-editing-youtube-embed relative h-full w-full min-w-0 ${className}`.trim()}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${source.id}?rel=0&playsinline=1`}
          title={video.selectorTitle?.trim() || video.label}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
          onLoad={() => onYouTubeLoad?.()}
        />
      </div>
    );
  }
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
  if (fromIdx <= 0) return order as DetailCardTabId[];
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
/** Skip height tween only for subpixel / rounding noise. */
const DETAIL_CARD_HEIGHT_EPSILON_PX = 2.5;
const DETAIL_CARD_RESIZE_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
/** Scale resize duration with body delta so tall overviews (Undertale) ease, not snap. */
function detailCardResizeDurationMs(heightDeltaPx: number): number {
  const delta = Math.abs(heightDeltaPx);
  return Math.min(
    Math.round(DETAIL_CARD_RESIZE_DUR_MS * 2.4),
    Math.max(
      DETAIL_CARD_RESIZE_DUR_MS,
      Math.round(DETAIL_CARD_RESIZE_DUR_MS * (delta / 160)),
    ),
  );
}
/**
 * New tab copy waits until height resize finishes + cutoff lead + one paint
 * so the soft edge is already easing when copy fades in (player-capped /
 * scrollable cards on desktop + tablet landscape).
 */
const DETAIL_TAB_BODY_IN_DELAY_S =
  (DETAIL_CARD_RESIZE_DUR_MS + 32 + DETAIL_CUTOFF_LEAD_MS) / 1000;
/**
 * Natural drawers: height waits for tab FLIP to finish (avoids layout+resize screenshake),
 * so enter delay spans (FLIP − body-out) + resize + paint.
 */
const DETAIL_NATURAL_HEIGHT_DELAY_MS = DETAIL_TAB_UNDERLINE_DRAW_DELAY_MS;
const DETAIL_TAB_BODY_IN_DELAY_NATURAL_S =
  (DETAIL_NATURAL_HEIGHT_DELAY_MS - DETAIL_BODY_OUT_MS + DETAIL_CARD_RESIZE_DUR_MS + 32) /
  1000;
/** Thumbnail title + description drawer share one resize beat (not title-then-card). */
const DETAIL_TITLE_MOVE_DUR_MS = DETAIL_CARD_RESIZE_DUR_MS;
/** Now-playing title AnimatePresence crossfade (keep in sync with JSX transition). */
const DETAIL_TITLE_CROSSFADE_MS = 220;
/** Phone / tablet-portrait work-switch: same path, tighter clock (keeps eases). */
const DETAIL_NATURAL_SPEED = 0.72;
const DETAIL_NATURAL_TITLE_CROSSFADE_MS = Math.round(
  DETAIL_TITLE_CROSSFADE_MS * DETAIL_NATURAL_SPEED,
);
const DETAIL_NATURAL_CUTOFF_LEAD_MS = Math.round(
  DETAIL_CUTOFF_LEAD_MS * DETAIL_NATURAL_SPEED,
);
const DETAIL_NATURAL_CARD_RESIZE_DUR_MS = Math.round(
  DETAIL_CARD_RESIZE_DUR_MS * DETAIL_NATURAL_SPEED,
);
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
/** iPad / tablet landscape (coarse) — flush 3-up works strip; do not center-scroll. */
const DETAIL_TABLET_LANDSCAPE_MQ =
  "(min-width: 768px) and (max-width: 1366px) and (orientation: landscape) and (any-pointer: coarse)";

const DETAIL_COMPACT_DRAWER_MQ = [
  DETAIL_NATURAL_DRAWER_MQ,
  "((min-width: 1024px) and (pointer: fine))",
  "(min-width: 1367px)",
  `(${DETAIL_TABLET_LANDSCAPE_MQ})`,
].join(", ");

function matchesDetailPlayerCapViewport() {
  return typeof window !== "undefined" && window.matchMedia(DETAIL_PLAYER_CAP_MQ).matches;
}

function matchesDetailTabletLandscapeViewport() {
  return typeof window !== "undefined" && window.matchMedia(DETAIL_TABLET_LANDSCAPE_MQ).matches;
}

function matchesDetailNaturalDrawerViewport() {
  return typeof window !== "undefined" && window.matchMedia(DETAIL_NATURAL_DRAWER_MQ).matches;
}

/** Phone band (includes 640–767, which natural-drawer MQ skips). */
function matchesDetailPhoneStripViewport() {
  return typeof window !== "undefined" && window.innerWidth < 768;
}

/** Desktop + iPad landscape + phone + iPad portrait — JS translateX strip (no native snap). */
function worksStripUsesTranslatePaging() {
  return (
    matchesDetailPlayerCapViewport() ||
    matchesDetailNaturalDrawerViewport() ||
    matchesDetailPhoneStripViewport()
  );
}

/**
 * Desktop + tablet landscape (player-capped): N-up flush paging.
 * Phone + tablet portrait (natural): free/fluid slide — separate math below.
 */
function worksStripUsesFlushPaging() {
  return matchesDetailPlayerCapViewport();
}

function worksStripPageSize(cardId: string | undefined) {
  if (typeof window !== "undefined" && window.innerWidth < 768) return 2;
  if (cardId === "project-slaywire") {
    return typeof window !== "undefined" && window.innerWidth < 1024 ? 3 : 4;
  }
  return 3;
}

function worksStripTileStep(strip: HTMLElement) {
  const thumbs = strip.querySelectorAll<HTMLElement>(".video-editing-works-strip-thumb");
  const first = thumbs[0];
  const second = thumbs[1];
  if (first && second) return second.offsetLeft - first.offsetLeft;
  return first ? first.offsetWidth + 10 : 0;
}

/** Flush N-up max (peek-safe). Do NOT use clientWidth − content here — strip is calc(100% + 6px). */
function worksStripFlushMaxOffset(strip: HTMLElement, cardId: string | undefined) {
  const pageSize = worksStripPageSize(cardId);
  const count = strip.querySelectorAll(".video-editing-works-strip-thumb").length;
  if (count <= pageSize) return 0;
  const step = worksStripTileStep(strip);
  if (step <= 0) return 0;
  return (count - pageSize) * step;
}

/** Flush page start so thumb[index] sits in the N-up window. */
function worksStripFlushPageOffset(strip: HTMLElement, index: number, cardId: string | undefined) {
  const pageSize = worksStripPageSize(cardId);
  const step = worksStripTileStep(strip);
  if (index < pageSize || step <= 0) return 0;
  return (index - pageSize + 1) * step;
}

/** Fluid (phone / tablet portrait) translateX max: content span vs strip viewport. */
function worksStripContentOverflow(strip: HTMLElement) {
  const thumbs = strip.querySelectorAll<HTMLElement>(".video-editing-works-strip-thumb");
  const first = thumbs[0];
  const last = thumbs[thumbs.length - 1];
  if (!first || !last) return 0;
  const content = last.offsetLeft - first.offsetLeft + last.offsetWidth;
  return Math.max(0, content - strip.clientWidth);
}

function worksStripMaxOffset(strip: HTMLElement, cardId: string | undefined) {
  if (worksStripUsesFlushPaging()) {
    return worksStripFlushMaxOffset(strip, cardId);
  }
  return worksStripContentOverflow(strip);
}

/** Fluid: minimal scroll so thumb[index] is fully visible; keeps X when already in view. */
function worksStripEnsureThumbOffset(
  strip: HTMLElement,
  index: number,
  currentOffset: number,
) {
  const thumbs = strip.querySelectorAll<HTMLElement>(".video-editing-works-strip-thumb");
  const first = thumbs[0];
  const thumb = thumbs[index];
  if (!first || !thumb) return Math.max(0, currentOffset);
  const max = worksStripContentOverflow(strip);
  const view = Math.max(1, strip.clientWidth);
  const thumbLeft = thumb.offsetLeft - first.offsetLeft;
  const thumbRight = thumbLeft + thumb.offsetWidth;
  let next = currentOffset;
  if (thumbLeft < currentOffset - 0.5) {
    next = thumbLeft;
  } else if (thumbRight > currentOffset + view + 0.5) {
    next = thumbRight - view;
  }
  return Math.max(0, Math.min(max, next));
}

/** Fluid soft settle: nearest thumb start within real overflow (not page-window gated). */
function worksStripNearestThumbOffset(
  strip: HTMLElement,
  logicalX: number,
) {
  const thumbs = strip.querySelectorAll<HTMLElement>(".video-editing-works-strip-thumb");
  const first = thumbs[0];
  if (!first) return 0;
  const max = worksStripContentOverflow(strip);
  let best = 0;
  let bestDist = Math.abs(0 - logicalX);
  for (let i = 0; i < thumbs.length; i++) {
    const pos = thumbs[i].offsetLeft - first.offsetLeft;
    if (pos > max + 0.5) break;
    const dist = Math.abs(pos - logicalX);
    if (dist < bestDist) {
      bestDist = dist;
      best = pos;
    }
  }
  if (Math.abs(max - logicalX) < bestDist) {
    return Math.max(0, max);
  }
  return Math.max(0, Math.min(max, best));
}

/** Cache width-matched clone heights — Undertale's long overview is expensive to re-clone. */
const copyBlockMeasureCache = new WeakMap<
  HTMLElement,
  { width: number; textLen: number; height: number }
>();

function measureDetailCardChromeHeight(cardSurface: HTMLElement): number {
  const tabSurface = cardSurface.querySelector(
    ".video-editing-detail-card-tab-surface:not(.video-editing-detail-card-tab-measure)",
  );
  const paddingBottom = parseFloat(getComputedStyle(cardSurface).paddingBottom) || 0;
  const tabSurfacePadBottom =
    tabSurface instanceof HTMLElement
      ? parseFloat(getComputedStyle(tabSurface).paddingBottom) || 0
      : 0;
  if (!(tabSurface instanceof HTMLElement)) {
    return Math.max(0, Math.ceil(paddingBottom));
  }
  // Hidden probes sit in a stacked layer — never use their top for chrome.
  // Tab-surface content box is the same on every tab/work switch.
  const visualBefore =
    tabSurface.getBoundingClientRect().top - cardSurface.getBoundingClientRect().top;
  const padTop = parseFloat(getComputedStyle(tabSurface).paddingTop) || 0;
  const layoutBeforeBody = visualPxToLayoutPx(cardSurface, visualBefore) + padTop;
  return Math.max(0, Math.ceil(layoutBeforeBody + paddingBottom + tabSurfacePadBottom));
}

/** WebKit-style rubber-band: overshoot in px → resisted visual offset. */
function rubberBandOffset(overshoot: number, dimension: number) {
  const dim = Math.max(1, dimension);
  const over = Math.max(0, overshoot);
  return (1 - 1 / ((over * 0.64) / dim + 1)) * dim;
}

/** Map a logical scroll (may be past 0..max) to clamped position + bounce translation. */
function rubberBandRange(logical: number, max: number, dimension: number) {
  if (logical < 0) {
    return { pos: 0, visual: rubberBandOffset(-logical, dimension) };
  }
  if (logical > max) {
    return { pos: max, visual: -rubberBandOffset(logical - max, dimension) };
  }
  return { pos: logical, visual: 0 };
}

/** Convert visual px (getBoundingClientRect) → layout px (style/offset), accounting for CSS zoom. */
function visualPxToLayoutPx(el: HTMLElement, visualPx: number): number {
  const visualH = el.getBoundingClientRect().height;
  const layoutH = el.offsetHeight;
  if (visualH < 0.5 || layoutH < 0.5) return Math.round(visualPx);
  return Math.round(visualPx * (layoutH / visualH));
}

/** Copy height only — flex-stretched tab-body wrappers cannot inflate the drawer. */
function measureCopyBlockHeight(el: HTMLElement): number {
  const copy = el.matches("p, ul")
    ? el
    : el.querySelector(":scope p, :scope ul") ?? el.querySelector("p, ul");
  const node = copy instanceof HTMLElement ? copy : el;
  let height = Math.max(
    node.offsetHeight,
    node.scrollHeight,
    el.offsetHeight,
    el.scrollHeight,
  );

  // Hidden measure shelf is `h-0 overflow-hidden`. Long whitespace-pre-line
  // blocks (e.g. UNDERTALE Forever Home) can under-report scrollHeight there
  // on WebKit, so the drawer snaps instead of tweening. Width-matched clone
  // outside the clip gives a trustworthy destination height.
  const shelf = el.closest(".video-editing-detail-card-tab-measure");
  if (shelf instanceof HTMLElement) {
    const width =
      el.getBoundingClientRect().width ||
      node.getBoundingClientRect().width ||
      shelf.getBoundingClientRect().width;
    if (width > 0) {
      const textLen = (node.textContent ?? "").length;
      const cached = copyBlockMeasureCache.get(node);
      if (
        cached &&
        Math.abs(cached.width - width) < 0.5 &&
        cached.textLen === textLen
      ) {
        height = Math.max(height, cached.height);
      } else {
        const clone = node.cloneNode(true) as HTMLElement;
        // Live meta-card copy is forced to 0.8125rem via
        // `#projects.projects-*-detail-open .video-editing-detail-meta-card
        // .video-editing-detail-card-tab-surface .font-body`. A body clone
        // loses that ancestor chain and falls back to Tailwind `text-sm` /
        // `sm:text-base`, so wrap height is wrong unless we copy computed
        // typography from the in-shelf node before measuring.
        const cs = getComputedStyle(node);
        clone.style.cssText = [
          "position:absolute",
          "visibility:hidden",
          "display:block",
          "left:-10000px",
          "top:0",
          `width:${width}px`,
          "height:auto",
          "max-height:none",
          "overflow:visible",
          "pointer-events:none",
          "z-index:-1",
          `font:${cs.font}`,
          `font-size:${cs.fontSize}`,
          `line-height:${cs.lineHeight}`,
          `letter-spacing:${cs.letterSpacing}`,
          `word-spacing:${cs.wordSpacing}`,
          `white-space:${cs.whiteSpace}`,
          `word-break:${cs.wordBreak}`,
          `overflow-wrap:${cs.overflowWrap}`,
          `text-align:${cs.textAlign}`,
          `padding:${cs.padding}`,
          `box-sizing:${cs.boxSizing}`,
          "margin:0",
        ].join(";");
        document.body.appendChild(clone);
        const clonedH = Math.max(clone.offsetHeight, clone.scrollHeight);
        clone.remove();
        copyBlockMeasureCache.set(node, {
          width,
          textLen,
          height: clonedH,
        });
        height = Math.max(height, clonedH);
      }
    }
  }

  return height;
}

function measureDetailCardHeightForProbe(
  cardSurface: HTMLElement,
  targetProbe: HTMLElement,
): number {
  const bodyH = measureCopyBlockHeight(targetProbe);
  return Math.ceil(measureDetailCardChromeHeight(cardSurface) + bodyH);
}

/**
 * Destination height for a single resize beat.
 * Prefer live wrap when it reports; else hidden probe (clone-accurate).
 * Do NOT take max(live, probe) — that overshoots then needs a shrink beat.
 */
function measureDetailCardDestHeight(
  cardSurface: HTMLElement,
  probe: HTMLElement | null | undefined,
  live: HTMLElement | null | undefined,
): number {
  const liveH =
    live && (live.offsetHeight > 0 || live.scrollHeight > 0)
      ? measureDetailCardHeightForProbe(cardSurface, live)
      : 0;
  if (liveH > DETAIL_CARD_HEIGHT_EPSILON_PX) return liveH;
  if (probe && (probe.offsetHeight > 0 || probe.scrollHeight > 0)) {
    return measureDetailCardHeightForProbe(cardSurface, probe);
  }
  return 0;
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

/**
 * Live tab body for height math — ignores opacity so a single resize beat can
 * measure while copy is still at opacity 0 (out-fade / pre-reveal).
 */
function liveDetailCardBodyElForMeasure(
  container: HTMLElement | null,
): HTMLElement | null {
  if (!container) return null;
  const bodies = container.querySelectorAll(".video-editing-detail-card-tab-body");
  let fallback: HTMLElement | null = null;
  for (const el of bodies) {
    if (!(el instanceof HTMLElement)) continue;
    fallback = el;
    if (el.offsetHeight > 0 || el.scrollHeight > 0) return el;
  }
  return fallback ?? container;
}

/** Pin drawer height instantly — no second ease after the primary resize beat. */
function pinDetailCardHeight(surface: HTMLElement, toHeight: number, maxHeight: number | null) {
  const pinned = maxHeight != null ? Math.min(toHeight, maxHeight) : toHeight;
  surface.classList.remove("video-editing-detail-meta-card--tweening");
  surface.style.minHeight = "0px";
  surface.style.transition = "none";
  if (maxHeight != null) surface.style.maxHeight = `${maxHeight}px`;
  surface.style.height = `${pinned}px`;
  return pinned;
}

/**
 * Silent height correction (no ease). While copy is hidden, pin exactly.
 * While copy is visible, only grow — never shrink (avoids a second motion).
 */
function pinDetailCardHeightQuiet(
  surface: HTMLElement,
  needHeight: number,
  maxHeight: number | null,
  opts?: { allowShrink?: boolean },
): number | null {
  if (needHeight <= 0) return null;
  const cur = surface.offsetHeight;
  const capped =
    maxHeight != null ? Math.min(needHeight, maxHeight) : needHeight;
  const delta = capped - cur;
  if (Math.abs(delta) <= DETAIL_CARD_HEIGHT_EPSILON_PX) return null;
  if (delta < 0 && !opts?.allowShrink) return null;
  return pinDetailCardHeight(surface, capped, maxHeight);
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
  const TOUCH_CLICK_GUARD_MS = 400;
  const videos = useMemo(() => card.detailVideos ?? [], [card.detailVideos]);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  /**
   * Real player/iframe index. For YouTube destinations this lags the face index so the
   * heavy embed does not mount during tab FLIP / early title frames (Undertale lag).
   */
  const [playerVideoIndex, setPlayerVideoIndex] = useState(0);
  /**
   * Visual player face — updates immediately on work-switch (poster for YouTube) so the
   * video card still *appears* to lead while the iframe waits.
   */
  const [playerFaceIndex, setPlayerFaceIndex] = useState(0);
  /**
   * Keep the YouTube face poster up after the iframe mounts until it paints
   * (otherwise the embed is briefly empty and the grid shows through).
   */
  const [youtubeFaceCoverHold, setYoutubeFaceCoverHold] = useState(false);
  const youtubeFaceCoverHoldTimerRef = useRef<number | null>(null);
  /** True while work-switch motion is still running — poster must stay up. */
  const youtubeAwaitingMotionSettleRef = useRef(false);
  /** Iframe painted during the covered wait (safe to lift once settle clears). */
  const youtubePaintedUnderCoverRef = useRef(false);
  /** Desktop + tablet landscape — expand/shrink drawer clamped to player bottom. */
  const [isPlayerCappedDrawerViewport, setIsPlayerCappedDrawerViewport] = useState(
    matchesDetailPlayerCapViewport,
  );
  const [isTabletLandscapeViewport, setIsTabletLandscapeViewport] = useState(
    matchesDetailTabletLandscapeViewport,
  );
  /** Phone + tablet portrait — natural drawer + anti-jump reserve (no player cap). */
  const [isNaturalDrawerViewport, setIsNaturalDrawerViewport] = useState(
    matchesDetailNaturalDrawerViewport,
  );
  /** Phone + tablet + desktop — expanding/shrinking description drawer with keyframes. */
  const [isCompactDrawerViewport, setIsCompactDrawerViewport] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia(DETAIL_COMPACT_DRAWER_MQ).matches
      : false,
  );
  /** Natural drawer: never shrink the page-height reserve below the tallest tab seen. */
  const detailPanelTallestBodyRef = useRef(0);
  const [activeDetailCardTab, setActiveDetailCardTab] = useState<DetailCardTabId>("overview");
  const activeDetailCardTabRef = useRef<DetailCardTabId>("overview");
  activeDetailCardTabRef.current = activeDetailCardTab;
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
  const detailCardHeightPxRef = useRef<number | null>(null);
  detailCardHeightPxRef.current = detailCardHeightPx;
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
   * Inner scroll + cutoff fade only when the drawer is actually at the player
   * ceiling. Short boxes size to content — a scrollport there flips overflow
   * and fights the height tween.
   */
  const detailCardPaintedHeightPx = detailCardHeightTransitioning
    ? (detailCardTransitionHeightRef.current ?? detailCardHeightPx)
    : detailCardHeightPx;
  const detailCardAtPlayerCap = detailCardIsAtPlayerCap(
    detailCardPaintedHeightPx,
    detailCardMaxHeightPx,
  );
  const detailCardUsesInnerScroll =
    isPlayerCappedDrawerViewport && detailCardAtPlayerCap;
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
  /** Desktop + iPad/tablet landscape — hint inside capped desc card (bottom-right) when copy still scrolls. */
  const detailScrollHintEligible =
    (isPlayerCappedDrawerViewport || isTabletLandscapeViewport) &&
    detailCardUsesInnerScroll &&
    detailBodyVisible &&
    /* Keep mounted while mid-scroll ("both") so return-to-top fade can ease. */
    (detailTabpanelCutoffFade === "bottom" || detailTabpanelCutoffFade === "both");
  const detailScrollHintVisible = detailTabpanelCutoffFade === "bottom";
  const showDetailScrollHint = detailScrollHintEligible;
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
  const fitDetailCardToLiveBodyRef = useRef<(opts?: { force?: boolean; allowShrink?: boolean }) => void>(
    () => {},
  );
  const scheduleFitDetailCardToLiveBodyRef = useRef<() => void>(() => {});
  const centerWorksStripThumbRef = useRef<
    (index: number, options?: { instant?: boolean }) => void
  >(() => {});
  const animateDetailCardToMeasuredBodyRef = useRef<
    (
      targetProbe: HTMLElement,
      delayMs?: number,
      options?: {
        onSettled?: () => void;
        snap?: boolean;
        switchEpoch?: number;
        toHeightPx?: number;
      },
    ) => void
  >(() => {});
  const updateDetailTabpanelCutoffFadeRef = useRef<() => void>(() => {});
  const detailCardIdleFitKeyRef = useRef("");
  const detailTitleResizeAnimationRef = useRef<Animation | null>(null);
  const afterTitleResizeRef = useRef<(() => void) | null>(null);
  const afterTitleResizeTimerRef = useRef<number | null>(null);
  const detailCardResizeRafRef = useRef<number | null>(null);
  const detailRootRef = useRef<HTMLDivElement | null>(null);
  const detailCardSurfaceRef = useRef<HTMLElement | null>(null);
  const detailNowPlayingRef = useRef<HTMLDivElement | null>(null);
  /** Natural drawer: unlock section scroll / card hit-testing after a tab resize. */
  const detailNaturalResizeCleanupRef = useRef<(() => void) | null>(null);
  const [pressedWorksArrow, setPressedWorksArrow] = useState<"prev" | "next" | null>(null);
  const thumbRefs = useRef<Array<HTMLElement | null>>([]);
  const thumbStripRef = useRef<HTMLDivElement | null>(null);
  const worksStripTrackRef = useRef<HTMLDivElement | null>(null);
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
  /**
   * Work-switch / tab resize already ran one height beat. Skip post-settle and
   * idle live re-fit so the drawer never plays a second motion.
   */
  const skipWorkSwitchLiveFitRef = useRef(false);
  /** Tab resize used a single live measure — refuse probe→live second tween. */
  const skipTabLiveFitRef = useRef(false);
  const worksArrowReleaseTimerRef = useRef<number | null>(null);
  const worksStripProgrammaticUnlockTimerRef = useRef<number | null>(null);
  const worksStripArrowTweenRafRef = useRef<number | null>(null);
  const stopWorksStripMotionRef = useRef<(() => void) | null>(null);
  const syncWorksStripLogicalXRef = useRef<(x: number) => void>(() => {});
  /** Survives orientation effect remounts so the strip doesn't re-init at 0. */
  const worksStripLogicalXPersistRef = useRef(0);
  const worksStripNavLockUntilRef = useRef(0);
  const stripProgrammaticScrollRef = useRef(false);
  const worksArrowSwipePulseRef = useRef(0);
  const worksArrowTouchRef = useRef<{
    side: "prev" | "next";
    x: number;
    y: number;
  } | null>(null);
  const worksArrowTouchCommitAtRef = useRef(0);
  const detailTabTouchRef = useRef<{
    tabId: DetailCardTabId;
    x: number;
    y: number;
  } | null>(null);
  const detailTabTouchCommitAtRef = useRef(0);
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
    const mq = window.matchMedia(DETAIL_TABLET_LANDSCAPE_MQ);
    const onChange = () => setIsTabletLandscapeViewport(mq.matches);
    onChange();
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }
    mq.addListener(onChange);
    return () => mq.removeListener(onChange);
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

  // Work-switch apply already resets the tab. Only re-arm overview when the
  // project card itself changes — re-running on activeVideoIndex double-FLIP'd tabs.
  useEffect(() => {
    setActiveDetailCardTab("overview");
    setDetailCardTabOrder((prev) => swapDetailTabToFront(prev, "overview"));
  }, [card.id]);

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
    // Use live painted/cap sizes — not React detailCardUsesInnerScroll. A short→tall
    // settle can still close over the pre-cap flag and skip arming until body is
    // already fading (iPad landscape entries that start under the ceiling).
    let next: "none" | "top" | "bottom" | "both" = "none";
    const liveAtPlayerCap = detailCardIsAtPlayerCap(paintedHeight, maxHeight);
    if (panel && content && liveAtPlayerCap) {
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
  }, [detailCardHeightPx, detailCardMaxHeightPx]);

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
    const tabletLandscape = matchesDetailTabletLandscapeViewport();
    const livePanel = () => detailTabpanelScrollRef.current ?? panel;

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

    /** Outer scroll is "hot" after it moves — next inner gesture may need JS claim.
     * iPad bounce/wind-down lasts longer than a short 380ms window. */
    let outerHotUntil = 0;
    const markOuterHot = () => {
      outerHotUntil = performance.now() + 900;
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

    const maxScrollTop = () => {
      const current = livePanel();
      return Math.max(0, current.scrollHeight - current.clientHeight);
    };

    const bounceElOf = (node: HTMLElement) =>
      node.querySelector<HTMLElement>(
        ".video-editing-detail-card-tab-surface:not(.video-editing-detail-card-tab-measure)",
      ) ?? node;
    let bounceEl = bounceElOf(panel);
    let logicalTop = 0;

    const paintDescScroll = () => {
      const current = livePanel();
      bounceEl = bounceElOf(current);
      const max = Math.max(0, current.scrollHeight - current.clientHeight);
      if (!tabletLandscape) {
        const clamped = Math.max(0, Math.min(max, logicalTop));
        current.scrollTop = clamped;
        bounceEl.style.transform = "";
        return clamped;
      }
      const { pos, visual } = rubberBandRange(logicalTop, max, current.clientHeight);
      current.scrollTop = pos;
      bounceEl.style.transform = visual
        ? `translate3d(0, ${visual}px, 0)`
        : "";
      return pos;
    };

    const applyScrollTop = (next: number) => {
      logicalTop = tabletLandscape ? next : Math.max(0, Math.min(maxScrollTop(), next));
      return paintDescScroll();
    };

    const stopMomentum = () => {
      if (momentumRaf) {
        window.cancelAnimationFrame(momentumRaf);
        momentumRaf = 0;
      }
    };

    const springDescToRange = () => {
      const max = maxScrollTop();
      const from = logicalTop;
      const target = Math.max(0, Math.min(max, from));
      if (Math.abs(from - target) < 0.5) {
        logicalTop = target;
        paintDescScroll();
        return;
      }
      stopMomentum();
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / 280);
        const k = 1 - (1 - t) ** 3;
        logicalTop = from + (target - from) * k;
        paintDescScroll();
        if (t < 1) {
          momentumRaf = window.requestAnimationFrame(step);
          return;
        }
        momentumRaf = 0;
        logicalTop = target;
        paintDescScroll();
      };
      momentumRaf = window.requestAnimationFrame(step);
    };

    const startMomentum = () => {
      stopMomentum();
      const max = maxScrollTop();
      if (tabletLandscape && (logicalTop < 0 || logicalTop > max)) {
        springDescToRange();
        return;
      }
      let v = Math.max(-2.8, Math.min(2.8, velocityY));
      if (Math.abs(v) < 0.045) return;

      let prev = performance.now();
      const step = (now: number) => {
        const dt = Math.min(34, Math.max(0, now - prev));
        prev = now;
        v *= Math.exp(-0.0032 * dt);
        if (Math.abs(v) < 0.02) {
          momentumRaf = 0;
          if (tabletLandscape) springDescToRange();
          return;
        }
        applyScrollTop(logicalTop + v * dt);
        if (tabletLandscape && (logicalTop < 0 || logicalTop > max)) {
          v *= 0.55;
          if (Math.abs(v) < 0.08) {
            momentumRaf = 0;
            springDescToRange();
            return;
          }
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
      const from = event.target;
      if (
        from instanceof Element &&
        from.closest(".video-editing-detail-card-tablist")
      ) {
        return;
      }
      const current = livePanel();
      bounceEl = bounceElOf(current);
      if (current.scrollHeight - current.clientHeight <= 1) return;
      const touch = event.changedTouches[0];
      if (!touch) return;
      stopMomentum();
      touchId = touch.identifier;
      lastY = touch.clientY;
      lastMoveTime = performance.now();
      startX = touch.clientX;
      startY = touch.clientY;
      startOuterTop = sectionScroller?.scrollTop ?? 0;
      startInnerTop = current.scrollTop;
      logicalTop = current.scrollTop;
      bounceEl.style.transform = "";
      velocityY = 0;
      // iPad landscape: always JS-drive. Native vs page negotiation needs
      // several tries. Other touch viewports keep rubber-band unless coasting.
      mode =
        tabletLandscape || performance.now() < outerHotUntil
          ? "js"
          : "undecided";
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
        const innerMoved = Math.abs(livePanel().scrollTop - startInnerTop) > 1.5;
        if (outerMoved && !innerMoved && Math.abs(touch.clientY - startY) > 6) {
          // Page ate the gesture — claim for the rest of this touch.
          mode = "js";
        } else {
          return;
        }
      }

      applyScrollTop((tabletLandscape ? logicalTop : livePanel().scrollTop) + delta);
      if (event.cancelable) event.preventDefault();
    };

    // Bind the stable card (tabs remount per work). Do not use capture.
    const hit =
      panel.closest<HTMLElement>(".video-editing-detail-meta-card") ??
      panel.closest<HTMLElement>(".video-editing-detail-card-tabpanel-shell") ??
      panel;
    hit.addEventListener("touchstart", onTouchStart, { passive: true });
    hit.addEventListener("touchmove", onTouchMove, { passive: false });
    hit.addEventListener("touchend", endTouch, { passive: true });
    hit.addEventListener("touchcancel", endTouch, { passive: true });

    return () => {
      stopMomentum();
      bounceEl.style.transform = "";
      sectionScroller?.removeEventListener("scroll", markOuterHot);
      hit.removeEventListener("touchstart", onTouchStart);
      hit.removeEventListener("touchmove", onTouchMove);
      hit.removeEventListener("touchend", endTouch);
      hit.removeEventListener("touchcancel", endTouch);
    };
  }, [
    detailCardUsesInnerScroll,
    detailTabpanelScrollFrozen,
    isPlayerCappedDrawerViewport,
    isTabletLandscapeViewport,
    activeVideoIndex,
    card.id,
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
      if (worksStripArrowTweenRafRef.current != null) {
        window.cancelAnimationFrame(worksStripArrowTweenRafRef.current);
        worksStripArrowTweenRafRef.current = null;
      }
      stopWorksStripMotionRef.current = null;
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
    (_targetProbe: HTMLElement | null | undefined) => {
      if (!isNaturalDrawerViewport) {
        return;
      }
      const reserve = detailPanelReserveRef.current;
      const cardSurface = detailCardSurfaceRef.current;
      if (!reserve || !cardSurface) return;

      // Anti-collapse only: hold page height at the current painted card.
      // Never pre-expand to the next overview probe — measuring tall copy
      // (Undertale Forever Home) and applying it here jumps reserve before
      // the card tween, which reads as a second anim.
      const chrome =
        detailCardChromeHeightRef.current ??
        measureDetailCardChromeHeight(cardSurface);
      detailCardChromeHeightRef.current = chrome;
      const currentCard = Math.ceil(cardSurface.offsetHeight);
      detailPanelTallestBodyRef.current = Math.max(
        detailPanelTallestBodyRef.current,
        Math.max(0, currentCard - chrome),
      );
      const naturalReserve = Math.ceil(
        Math.max(currentCard, chrome + detailPanelTallestBodyRef.current),
      );
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
    if (detailCardResizeRafRef.current != null) {
      window.cancelAnimationFrame(detailCardResizeRafRef.current);
      detailCardResizeRafRef.current = null;
    }
    const surface = detailCardSurfaceRef.current;
    if (surface) {
      surface.style.transition = "none";
      surface.classList.remove("video-editing-detail-meta-card--tweening");
    }
  }, []);

  const beginDetailCardHeightTransition = useCallback(() => {
    const surface = detailCardSurfaceRef.current;
    const maxHeight = detailCardMaxHeightPxRef.current;
    const current =
      surface && surface.offsetHeight > 0
        ? surface.offsetHeight
        : detailCardHeightPxRef.current;
    if (current != null && current > 0) {
      const pinned =
        maxHeight != null ? Math.min(current, maxHeight) : current;
      detailCardTransitionHeightRef.current = pinned;
      if (surface) surface.style.height = `${pinned}px`;
    }
    detailCardHeightTransitioningRef.current = true;
    setDetailCardHeightTransitioning(true);
  }, []);

  const endDetailCardHeightTransition = useCallback((nextHeight: number | null) => {
    detailCardHeightTransitioningRef.current = false;
    if (nextHeight != null) {
      detailCardTransitionHeightRef.current = nextHeight;
      // flushSync forces a sync React+layout pass — fine for capped drawers,
      // but a noticeable hitch after tall natural (Undertale) tweens on mobile.
      if (isPlayerCappedDrawerViewport) {
        flushSync(() => {
          setDetailCardHeightPx(nextHeight);
          setDetailCardHeightTransitioning(false);
        });
      } else {
        setDetailCardHeightPx(nextHeight);
        setDetailCardHeightTransitioning(false);
      }
    } else {
      detailCardTransitionHeightRef.current = null;
      setDetailCardHeightTransitioning(false);
    }
  }, [isPlayerCappedDrawerViewport]);

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
    // Full player-bottom ceiling — scrollable cards use max bottom height.
    const visualCap = Math.max(0, playerBottom - cardTop);
    // Floor so a rounded-up cap cannot tween the drawer 1–2px past the player
    // (then snap back when a later remasure corrects it).
    const next = Math.max(0, Math.floor(visualPxToLayoutPx(cardEl, visualCap)));
    detailCardMaxHeightPxRef.current = next;
    // Always publish — a stale (taller) React maxHeight lets the drawer paint
    // past the player, then the next remasure snaps it back.
    setDetailCardMaxHeightPx((prev) => (prev === next ? prev : next));
    if (cardEl && next > 0) {
      cardEl.style.maxHeight = `${next}px`;
    }

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
    // Ignore 1–3px cap noise so the drawer does not pop off the player after a switch.
    if (liveHeight > next + 3) {
      detailCardTransitionHeightRef.current = next;
      cardEl.style.height = `${next}px`;
      setDetailCardHeightPx((prev) => (prev === next ? prev : next));
    }
    return next;
  }, [isPlayerCappedDrawerViewport]);

  /**
   * Leaving player-capped mode: drop capped height/max leftovers once.
   * Do NOT clear on every tab/work change — that deps list used to live on the
   * same effect and wiped natural-drawer (phone + tablet portrait) mid-tween,
   * so entry switches snapped instead of animating.
   */
  useEffect(() => {
    if (isPlayerCappedDrawerViewport) return;
    const cardEl = detailCardSurfaceRef.current;
    if (cardEl) {
      cardEl.style.maxHeight = "";
      cardEl.style.height = "";
      cardEl.style.minHeight = "";
      cardEl.style.transition = "";
    }
    if (detailNowPlayingRef.current) {
      detailNowPlayingRef.current.style.height = "";
    }
    detailCardTransitionHeightRef.current = null;
    setDetailCardMaxHeightPx(null);
    detailCardMaxHeightPxRef.current = null;
    setDetailCardHeightPx(null);
    detailCardHeightTransitioningRef.current = false;
    setDetailCardHeightTransitioning(false);
  }, [isPlayerCappedDrawerViewport]);

  useEffect(() => {
    if (!isPlayerCappedDrawerViewport) return;

    const root = detailRootRef.current;
    if (!root) return;

    const syncDetailCardMaxHeightToPlayer = () => {
      syncDetailCardMaxHeightNow();
    };

    syncDetailCardMaxHeightToPlayer();
    const raf = window.requestAnimationFrame(syncDetailCardMaxHeightToPlayer);
    const player = root.querySelector(".video-editing-player");
    const titleArea = detailNowPlayingRef.current;
    let capRaf = 0;
    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            if (capRaf) return;
            capRaf = window.requestAnimationFrame(() => {
              capRaf = 0;
              syncDetailCardMaxHeightToPlayer();
            });
          })
        : null;
    if (player && resizeObserver) resizeObserver.observe(player);
    // Title height changes move cardTop; observe so the player-cap ceiling tracks.
    // Do not observe the card — its own height tween retriggers cap remasure.
    if (titleArea && resizeObserver) resizeObserver.observe(titleArea);
    window.addEventListener("resize", syncDetailCardMaxHeightToPlayer);
    window.addEventListener("orientationchange", syncDetailCardMaxHeightToPlayer);

    return () => {
      window.cancelAnimationFrame(raf);
      if (capRaf) window.cancelAnimationFrame(capRaf);
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
        /** Override rAF duration (natural work-switch couples title + card). */
        durationMs?: number;
        /** 0-1 multiplier after duration pick (natural phone speed-up). */
        speedScale?: number;
        /** Natural: bump reserve once, skip per-frame reserve writes (cut layout thrash). */
        freezeReserve?: boolean;
        /**
         * Prefer live body (opacity-agnostic) over the hidden probe so one tween
         * lands on the real wrap — avoids a probe→live second beat.
         */
        preferLiveMeasure?: boolean;
      },
    ) => {
      const onSettled = options?.onSettled;
      const snap = Boolean(options?.snap);
      const switchEpoch = options?.switchEpoch;
      const forcedToHeightPx = options?.toHeightPx;
      const forcedDurationMs = options?.durationMs;
      const preferLiveMeasure = Boolean(options?.preferLiveMeasure);
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
        surface.style.minHeight = "0px";
        surface.style.height = `${fromHeight}px`;
        if (maxHeight == null) {
          surface.style.transition = "none";
        }
      };

      const commitHeight = (surface: HTMLElement, nextHeight: number, maxHeight: number | null) => {
        const pinned =
          maxHeight != null ? Math.min(nextHeight, maxHeight) : nextHeight;
        detailCardTransitionHeightRef.current = pinned;
        if (maxHeight != null) surface.style.maxHeight = `${maxHeight}px`;
        surface.style.height = `${pinned}px`;
        surface.style.transition = "none";
        endDetailCardHeightTransition(pinned);
      };

      const runResize = () => {
        detailCardResizeDelayTimerRef.current = null;
        if (epoch !== detailCardResizeEpochRef.current) return;
        if (isSwitchStale()) {
          endDetailCardHeightTransition(null);
          return;
        }

        const startResize = () => {
          if (epoch !== detailCardResizeEpochRef.current) return;
          if (isSwitchStale()) {
            endDetailCardHeightTransition(null);
            return;
          }

          const surface = detailCardSurfaceRef.current;
          if (
            !surface ||
            (!forcedToHeightPx &&
              targetProbe.offsetHeight <= 0 &&
              targetProbe.scrollHeight <= 0)
          ) {
            endDetailCardHeightTransition(null);
            onSettled?.();
            return;
          }

          // Remeasure after title / layout delay so the player-cap matches the card’s new top.
          syncDetailCardMaxHeightNow();
          const maxHeight = detailCardMaxHeightPxRef.current;
          const naturalToHeight = (() => {
            if (preferLiveMeasure) {
              const liveForMeasure = liveDetailCardBodyElForMeasure(
                detailTabActiveNaturalRef.current,
              );
              const dest = measureDetailCardDestHeight(
                surface,
                targetProbe,
                liveForMeasure,
              );
              if (dest > 0) return dest;
            }
            if (forcedToHeightPx != null) return forcedToHeightPx;
            return measureDetailCardHeightForProbe(surface, targetProbe);
          })();
          detailCardChromeHeightRef.current = measureDetailCardChromeHeight(surface);
          const toHeight =
            maxHeight != null ? Math.min(naturalToHeight, maxHeight) : naturalToHeight;
          if (maxHeight != null) {
            surface.style.maxHeight = `${maxHeight}px`;
          }
          const fromHeightRaw = surface.offsetHeight;
          const fromHeight =
            maxHeight != null ? Math.min(fromHeightRaw, maxHeight) : fromHeightRaw;

          if (snap || reduceMotion) {
            commitHeight(surface, toHeight, maxHeight);
            onSettled?.();
            return;
          }

          if (Math.abs(toHeight - fromHeight) <= DETAIL_CARD_HEIGHT_EPSILON_PX) {
            commitHeight(surface, toHeight, maxHeight);
            onSettled?.();
            return;
          }

          // rAF so we can clamp to the live published cap every frame. WAAPI
          // ignores maxHeight and overshoots; a dest-cap pin does the same.
          if (detailCardResizeRafRef.current != null) {
            window.cancelAnimationFrame(detailCardResizeRafRef.current);
            detailCardResizeRafRef.current = null;
          }
          surface.classList.add("video-editing-detail-meta-card--tweening");
          surface.style.minHeight = "0px";
          surface.style.transition = "none";
          surface.style.height = `${fromHeight}px`;
          detailCardTransitionHeightRef.current = fromHeight;
          const start = performance.now();
          // Large body deltas (Undertale Forever Home) need more time than a tab swap
          // or the 420ms tween reads as a snap. Cap so short switches stay snappy.
          // Natural work-switch may pass durationMs so title WAAPI shares this beat.
          const heightDelta = Math.abs(toHeight - fromHeight);
          // Explicit duration (shared title+card beat) always wins. Otherwise
          // scale with delta so tall overviews ease instead of snapping.
          let resizeDurMs =
            forcedDurationMs != null && forcedDurationMs > 0
              ? forcedDurationMs
              : detailCardResizeDurationMs(heightDelta);
          // Only speed small moves - compressing tall Undertale tweens reads as chop.
          if (
            heightDelta <= 160 &&
            options?.speedScale != null &&
            options.speedScale > 0 &&
            options.speedScale < 1
          ) {
            resizeDurMs = Math.max(
              180,
              Math.round(resizeDurMs * options.speedScale),
            );
          }
          // Tall overviews: don't write reserve every frame (double layout on mobile).
          const throttleReserve = heightDelta > 160;
          const freezeReserve = Boolean(options?.freezeReserve);
          let reserveFrame = 0;
          let lastReserveWritten = -1;
          // Natural: pre-bump page reserve to the destination once so the shell can
          // animate without fighting minHeight writes every frame.
          if (freezeReserve) {
            const reserveEl = detailPanelReserveRef.current;
            if (reserveEl) {
              const destReserve = Math.ceil(Math.max(fromHeight, toHeight));
              const cur = parseFloat(reserveEl.style.minHeight) || 0;
              if (destReserve > cur) {
                reserveEl.style.minHeight = `${destReserve}px`;
                lastReserveWritten = destReserve;
              }
            }
          }
          surface.style.willChange = "height";
          const tick = (now: number) => {
            if (epoch !== detailCardResizeEpochRef.current) return;
            if (isSwitchStale()) {
              detailCardResizeRafRef.current = null;
              surface.style.willChange = "";
              surface.classList.remove("video-editing-detail-meta-card--tweening");
              endDetailCardHeightTransition(null);
              return;
            }
            const t = Math.min(1, (now - start) / resizeDurMs);
            const k = 1 - (1 - t) ** 3;
            const cap = detailCardMaxHeightPxRef.current;
            const dest =
              cap != null ? Math.min(toHeight, cap) : toHeight;
            const h = Math.min(
              fromHeight + (dest - fromHeight) * k,
              cap ?? Number.POSITIVE_INFINITY,
            );
            surface.style.height = `${h}px`;
            if (cap != null) surface.style.maxHeight = `${cap}px`;
            detailCardTransitionHeightRef.current = h;
            // Keep page reserve in lockstep with the card so a post-settle
            // tallest bump isn't a second Undertale jump (esp. tab+work reset).
            // Tall tweens: update reserve every other frame to cut layout thrash.
            // Natural freezeReserve: skip - already pre-bumped above.
            const reserveEl = detailPanelReserveRef.current;
            reserveFrame += 1;
            if (
              reserveEl &&
              !freezeReserve &&
              (t >= 1 || !throttleReserve || reserveFrame % 2 === 0)
            ) {
              const nextReserve = Math.ceil(h);
              if (nextReserve > lastReserveWritten) {
                const cur = parseFloat(reserveEl.style.minHeight) || 0;
                if (nextReserve > cur) {
                  reserveEl.style.minHeight = `${nextReserve}px`;
                  lastReserveWritten = nextReserve;
                }
              }
            }
            if (t < 1) {
              detailCardResizeRafRef.current = window.requestAnimationFrame(tick);
              return;
            }
            detailCardResizeRafRef.current = null;
            surface.style.willChange = "";
            surface.classList.remove("video-editing-detail-meta-card--tweening");
            commitHeight(surface, dest, cap ?? maxHeight);
            onSettled?.();
          };
          detailCardResizeRafRef.current = window.requestAnimationFrame(tick);
        };

        // Live measure: two frames so AnimatePresence can mount the opacity-0 body.
        if (preferLiveMeasure) {
          requestAnimationFrame(() => {
            requestAnimationFrame(startResize);
          });
        } else {
          startResize();
        }
      };

      if (!snap && delayMs > 0) {
        pinFromHeight();
        detailCardResizeDelayTimerRef.current = window.setTimeout(runResize, delayMs);
      } else {
        if (!snap) pinFromHeight();
        runResize();
      }
    },
    [
      beginDetailCardHeightTransition,
      cancelScheduledDetailCardResize,
      endDetailCardHeightTransition,
      reduceMotion,
      syncDetailCardMaxHeightNow,
    ],
  );

  /**
   * Hug live copy with a pin only — never a second height ease.
   * Visible copy: grow-only. Hidden copy: may shrink.
   */
  const fitDetailCardToLiveBody = useCallback((opts?: { force?: boolean; allowShrink?: boolean }) => {
    const force = Boolean(opts?.force);
    const allowShrink = Boolean(opts?.allowShrink) && !detailBodyVisibleRef.current;
    // Primary resize already owns one height beat — refuse a second live ease.
    if (
      skipWorkSwitchLiveFitRef.current ||
      skipTabLiveFitRef.current ||
      workSwitchInFlightRef.current
    ) {
      return;
    }
    if (
      detailTitleResizeAnimationRef.current ||
      detailCardHeightTransitioningRef.current ||
      detailCardResizeAnimationRef.current ||
      detailCardResizeDelayTimerRef.current != null
    ) {
      return;
    }
    const surface = detailCardSurfaceRef.current;
    const live = liveDetailCardBodyEl(detailTabActiveNaturalRef.current);
    if (!surface || !live) return;
    if (!force && !detailBodyVisibleRef.current) return;
    // Tab copy enters after the height tween; fitting to the outgoing body
    // snaps the drawer back (OVERVIEW → TOOLS → OVERVIEW).
    if (detailTabMaskLockRef.current) return;
    const liveH = measureCopyBlockHeight(live);
    if (liveH <= 0) return;
    const next = measureDetailCardHeightForProbe(surface, live);
    if (next <= 0) return;
    const maxHeight = detailCardMaxHeightPxRef.current;
    const pinned = pinDetailCardHeightQuiet(surface, next, maxHeight, {
      allowShrink,
    });
    if (pinned == null) return;
    detailCardTransitionHeightRef.current = pinned;
    endDetailCardHeightTransition(pinned);
  }, [endDetailCardHeightTransition]);

  const scheduleFitDetailCardToLiveBody = useCallback(() => {
    for (const id of detailCardLiveFitTimersRef.current) window.clearTimeout(id);
    detailCardLiveFitTimersRef.current = [];
    // Pin only (fitDetailCardToLiveBody no longer eases). One rAF is enough.
    const run = () => fitDetailCardToLiveBody({ force: true, allowShrink: false });
    requestAnimationFrame(run);
  }, [fitDetailCardToLiveBody]);

  fitDetailCardToLiveBodyRef.current = fitDetailCardToLiveBody;
  scheduleFitDetailCardToLiveBodyRef.current = scheduleFitDetailCardToLiveBody;
  animateDetailCardToMeasuredBodyRef.current = animateDetailCardToMeasuredBody;
  updateDetailTabpanelCutoffFadeRef.current = updateDetailTabpanelCutoffFade;

  const animateDetailTitleToMeasuredHeight = useCallback(
    (nextIndex: number, options?: { snap?: boolean; switchEpoch?: number; durationMs?: number }): number => {
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
      const titleDurMs =
        options?.durationMs != null && options.durationMs > 0
          ? options.durationMs
          : DETAIL_TITLE_MOVE_DUR_MS;
      titleArea.style.height = `${fromHeight}px`;
      const titleResizeAnimation = titleArea.animate(
        [{ height: `${fromHeight}px` }, { height: `${toHeight}px` }],
        {
          duration: titleDurMs,
          easing: DETAIL_CARD_RESIZE_EASE,
          fill: "forwards",
        },
      );
      detailTitleResizeAnimationRef.current = titleResizeAnimation;
      // Player-capped only: keep cap in sync so the card rides the title.
      // Natural drawers: skip this rAF loop (sync is a no-op and burns frames on mobile).
      let titleSyncRaf = 0;
      if (isPlayerCappedDrawerViewport) {
        const syncCapWhileTitleMoves = () => {
          if (detailTitleResizeAnimationRef.current !== titleResizeAnimation) return;
          syncDetailCardMaxHeightNow();
          titleSyncRaf = window.requestAnimationFrame(syncCapWhileTitleMoves);
        };
        titleSyncRaf = window.requestAnimationFrame(syncCapWhileTitleMoves);
      }
      titleResizeAnimation.finished
        .then(() => {
          if (titleSyncRaf) window.cancelAnimationFrame(titleSyncRaf);
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
          if (titleSyncRaf) window.cancelAnimationFrame(titleSyncRaf);
          // Cancelled by a newer thumbnail selection.
        });

      return titleDurMs;
    },
    [isPlayerCappedDrawerViewport, reduceMotion, syncDetailCardMaxHeightNow],
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
    if (youtubeFaceCoverHoldTimerRef.current != null) {
      window.clearTimeout(youtubeFaceCoverHoldTimerRef.current);
      youtubeFaceCoverHoldTimerRef.current = null;
    }
    detailCardResizeEpochRef.current += 1;
    detailTitleResizeAnimationRef.current?.cancel();
    detailTitleResizeAnimationRef.current = null;
    detailCardHeightTransitioningRef.current = false;
    setDetailCardHeightTransitioning(false);
    skipTabLiveFitRef.current = false;
  }, [cancelScheduledDetailCardResize, clearDetailBodySwapTimers]);

  /**
   * Tablet orientation swaps protected drawer modes (natural portrait vs
   * player-capped landscape). Abort mid-flight chrome once, then on each
   * settle pulse unlock interaction + remeasure so mask, scroll, tabs/arrows
   * recover. Works-strip X is preserved (ensure-visible only) — never
   * flush-page recentered to 0.
   */
  const detailDrawerViewportModeKey = [
    isPlayerCappedDrawerViewport ? "cap" : "uncap",
    isNaturalDrawerViewport ? "natural" : "unnamed",
    isTabletLandscapeViewport ? "tl" : "ntp",
    isCompactDrawerViewport ? "compact" : "full",
  ].join(":");
  const detailDrawerViewportModeKeyRef = useRef(detailDrawerViewportModeKey);
  const detailDrawerViewportModeReadyRef = useRef(false);

  useEffect(() => {
    if (!detailDrawerViewportModeReadyRef.current) {
      detailDrawerViewportModeReadyRef.current = true;
      detailDrawerViewportModeKeyRef.current = detailDrawerViewportModeKey;
      return;
    }
    if (detailDrawerViewportModeKeyRef.current === detailDrawerViewportModeKey) {
      return;
    }
    detailDrawerViewportModeKeyRef.current = detailDrawerViewportModeKey;

    // Once per mode change: cancel in-flight work-switch / resize choreography.
    abortWorkSwitchMotion();
    releaseNaturalDrawerResizeLock();
    workSwitchEpochRef.current += 1;
    workSwitchInFlightRef.current = false;

    const restoreDrawerAfterOrientation = () => {
      // Unlock anything that can mute scroll / taps after a mid-flight cancel.
      detailTabMaskLockRef.current = false;
      if (detailTabMaskSettleTimerRef.current != null) {
        window.clearTimeout(detailTabMaskSettleTimerRef.current);
        detailTabMaskSettleTimerRef.current = null;
      }
      detailTabCutoffInstantRef.current = false;
      setDetailTabCutoffInstant(false);
      setDetailTabpanelScrollFrozen(false);
      worksStripNavLockUntilRef.current = 0;
      stripProgrammaticScrollRef.current = false;
      clearWorksStripProgrammaticUnlockTimer();
      stopWorksStripMotionRef.current?.();
      if (worksStripArrowTweenRafRef.current != null) {
        window.cancelAnimationFrame(worksStripArrowTweenRafRef.current);
        worksStripArrowTweenRafRef.current = null;
      }

      const cardEl = detailCardSurfaceRef.current;
      if (cardEl) {
        cardEl.classList.remove("video-editing-detail-meta-card--tweening");
        cardEl.style.transition = "";
      }
      if (detailNowPlayingRef.current) {
        detailNowPlayingRef.current.style.height = "";
      }

      detailBodyVisibleRef.current = true;
      setDetailBodyVisible(true);

      if (!isPlayerCappedDrawerViewport) {
        if (cardEl) {
          cardEl.style.height = "";
          cardEl.style.maxHeight = "";
          cardEl.style.minHeight = "";
        }
        detailCardTransitionHeightRef.current = null;
        detailCardHeightTransitioningRef.current = false;
        setDetailCardHeightTransitioning(false);
        setDetailCardHeightPx(null);
        setDetailCardMaxHeightPx(null);
        detailCardMaxHeightPxRef.current = null;
        const reserve = detailPanelReserveRef.current;
        if (reserve) reserve.style.minHeight = "";
        detailPanelTallestBodyRef.current = 0;
      } else {
        // Snap to the live player-bottom cap. Do not null height on settle
        // pulses (that left the drawer uncapped → no mask / scroll / hint),
        // and prefer snap over tween so later settle pulses are not blocked
        // by detailCardHeightTransitioningRef.
        const maxHeight = syncDetailCardMaxHeightNow();
        const surface = detailCardSurfaceRef.current;
        const live = liveDetailCardBodyEl(detailTabActiveNaturalRef.current);
        if (surface && maxHeight != null && maxHeight > 0) {
          const next =
            live != null ? measureDetailCardHeightForProbe(surface, live) : 0;
          const toHeight =
            next > 0 ? Math.min(next, maxHeight) : maxHeight;
          surface.classList.remove("video-editing-detail-meta-card--tweening");
          surface.style.transition = "none";
          surface.style.minHeight = "0px";
          surface.style.maxHeight = `${maxHeight}px`;
          surface.style.height = `${toHeight}px`;
          detailCardTransitionHeightRef.current = toHeight;
          detailCardHeightTransitioningRef.current = false;
          setDetailCardHeightTransitioning(false);
          setDetailCardHeightPx(toHeight);
        } else {
          scheduleFitDetailCardToLiveBodyRef.current();
        }
      }

      // Persist strip X across orientation remounts.
      // Flush (desktop / iPad landscape): clamp to peek-safe N-up max — never
      // contentOverflow (that undershoots by the +6px bleed and clips thumbs).
      // Fluid (phone / tablet portrait): clamp + soft ensure-visible (no first-page→0).
      const strip = thumbStripRef.current;
      const track = worksStripTrackRef.current;
      const restoreStripX = (stripEl: HTMLElement, trackEl: HTMLElement) => {
        stripEl.scrollLeft = 0;
        stripEl.style.scrollSnapType = "none";
        const match = /translate3d\((-?[\d.]+)px/.exec(trackEl.style.transform);
        const painted = match?.[1] ? Math.max(0, -parseFloat(match[1])) : 0;
        const prior =
          painted > 0.5 ? painted : worksStripLogicalXPersistRef.current;
        let max: number;
        if (worksStripUsesFlushPaging()) {
          max = worksStripFlushMaxOffset(stripEl, card.id);
        } else {
          max = worksStripContentOverflow(stripEl);
        }
        // Settle pulses often fire before strip geometry is ready (max === 0).
        // Keeping prior avoids the phone/tablet snap-to-reset; desktop does not
        // remount through orientation settle the same way.
        if (max <= 0 && prior > 0.5) {
          trackEl.style.transform =
            prior > 0.5 ? `translate3d(${-prior}px, 0, 0)` : "";
          worksStripLogicalXPersistRef.current = prior;
          syncWorksStripLogicalXRef.current(prior);
          return;
        }
        // Clamp only — do not ensure/snap to a thumb; free-slide X must survive.
        const next = Math.max(0, Math.min(max, prior));
        trackEl.style.transform =
          next > 0.5 ? `translate3d(${-next}px, 0, 0)` : "";
        worksStripLogicalXPersistRef.current = next;
        syncWorksStripLogicalXRef.current(next);
      };
      if (strip && track && worksStripUsesTranslatePaging()) {
        restoreStripX(strip, track);
      }

      requestAnimationFrame(() => {
        updateDetailTabpanelCutoffFadeRef.current();
        const strip2 = thumbStripRef.current;
        const track2 = worksStripTrackRef.current;
        if (!strip2 || !track2 || !worksStripUsesTranslatePaging()) return;
        restoreStripX(strip2, track2);
      });
    };

    return afterOrientationSettle(restoreDrawerAfterOrientation);
  }, [
    abortWorkSwitchMotion,
    card.id,
    clearWorksStripProgrammaticUnlockTimer,
    detailDrawerViewportModeKey,
    isPlayerCappedDrawerViewport,
    releaseNaturalDrawerResizeLock,
    syncDetailCardMaxHeightNow,
  ]);


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

      // No snaps (except rapid/reduced-motion). When tabs also reset: FLIP first,
      // THEN title crossfade, THEN one shared title+card height beat.
      const tabAlsoResets = activeDetailCardTabRef.current !== "overview";
      const deferWorkForTabs = !rapid && !reduceMotion && tabAlsoResets;

      const startTitleEase = (): number => {
        if (rapid) {
          animateDetailTitleToMeasuredHeight(nextIndex, {
            snap: true,
            switchEpoch: epoch,
          });
          return 0;
        }
        return animateDetailTitleToMeasuredHeight(nextIndex, {
          switchEpoch: epoch,
          ...(isNaturalDrawerViewport
            ? { durationMs: DETAIL_NATURAL_CARD_RESIZE_DUR_MS }
            : {}),
        });
      };

      /** Title text only — starts crossfade; height + YouTube come later. */
      const commitTitleText = () => {
        activeVideoIndexRef.current = nextIndex;
        setActiveVideoIndex(nextIndex);
      };

      const nextWork = videos[nextIndex];
      const nextIsYouTube = Boolean(nextWork && youtubeVideoId(nextWork.url));

      const clearYoutubeFaceCoverHoldTimer = () => {
        if (youtubeFaceCoverHoldTimerRef.current != null) {
          window.clearTimeout(youtubeFaceCoverHoldTimerRef.current);
          youtubeFaceCoverHoldTimerRef.current = null;
        }
      };

      const armYoutubeFaceCoverHold = () => {
        clearYoutubeFaceCoverHoldTimer();
        setYoutubeFaceCoverHold(true);
      };

      /** After iframe mounts: keep poster until load, with a max hold fallback. */
      const releaseYoutubeFaceCoverHoldSoon = () => {
        clearYoutubeFaceCoverHoldTimer();
        setYoutubeFaceCoverHold(true);
        youtubeFaceCoverHoldTimerRef.current = window.setTimeout(() => {
          youtubeFaceCoverHoldTimerRef.current = null;
          if (epoch !== workSwitchEpochRef.current) return;
          setYoutubeFaceCoverHold(false);
        }, 700);
      };

      const commitPlayer = () => {
        setPlayerVideoIndex(nextIndex);
        setPlayerFaceIndex(nextIndex);
        if (nextIsYouTube) {
          releaseYoutubeFaceCoverHoldSoon();
        } else {
          clearYoutubeFaceCoverHoldTimer();
          setYoutubeFaceCoverHold(false);
        }
      };

      /** Lightweight face only — poster/thumbnail, no iframe mount. */
      const commitPlayerFace = () => {
        setPlayerFaceIndex(nextIndex);
        if (nextIsYouTube) {
          armYoutubeFaceCoverHold();
          const poster = nextWork ? facePosterSrc(nextWork) : null;
          if (poster) {
            const preload = new Image();
            preload.src = poster;
          }
        }
      };

      // Don't pre-pin before the card tween; animateDetailCard pins on start.

      // Hold mask off through the height tween. Snap strength to 0 while hidden
      // so the later arm can ease 0->1 (mask-image class swaps always pop).
      detailTabMaskLockRef.current = true;
      detailTabCutoffInstantRef.current = true;
      setDetailTabCutoffInstant(true);
      detailTabpanelCutoffFadeRef.current = "none";
      setDetailTabpanelCutoffFade("none");
      skipWorkSwitchLiveFitRef.current = true;
      setActiveDetailCardTab("overview");
      setDetailCardTabOrder((prev) => swapDetailTabToFront(prev, "overview"));
      // When deferWorkForTabs: leave title on the old work until FLIP finishes.
      // Video *face* still leads (poster); real YouTube iframe waits until after FLIP.

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
            updateDetailTabpanelCutoffFadeRef.current();
            const showBody = () => {
              if (epoch !== workSwitchEpochRef.current) return;
              detailBodyRevealTimerRef.current = null;

              const continueShowBody = () => {
                if (epoch !== workSwitchEpochRef.current) return;
                // Natural never runs the player-capped idle-fit clearer — without
                // this, skip stays true and later Undertale tab hugs never run.
                if (isNaturalDrawerViewport) {
                  skipWorkSwitchLiveFitRef.current = false;
                }
                // Desktop: YouTube may already be warm under the poster.
                // Natural: mount only now so the expand is not fighting iframe init.
                if (nextIsYouTube) {
                  if (isNaturalDrawerViewport) {
                    youtubeAwaitingMotionSettleRef.current = false;
                    youtubePaintedUnderCoverRef.current = false;
                    setPlayerVideoIndex(nextIndex);
                    setPlayerFaceIndex(nextIndex);
                    armYoutubeFaceCoverHold();
                    releaseYoutubeFaceCoverHoldSoon();
                  } else {
                    youtubeAwaitingMotionSettleRef.current = false;
                    if (youtubePaintedUnderCoverRef.current) {
                      clearYoutubeFaceCoverHoldTimer();
                      setYoutubeFaceCoverHold(false);
                    } else {
                      releaseYoutubeFaceCoverHoldSoon();
                    }
                  }
                }
                setDetailBodyVisible(true);
                releaseNaturalDrawerResizeLock();
                finishWorkSwitch(epoch);
                // Natural: hug reserve to the settled card. Using session-tallest here
                // after Tools→Undertale jumped the page a second time on mobile.
                if (isNaturalDrawerViewport) {
                  const reserveEl = detailPanelReserveRef.current;
                  const surfaceEl = detailCardSurfaceRef.current;
                  if (reserveEl && surfaceEl) {
                    const chrome =
                      detailCardChromeHeightRef.current ??
                      measureDetailCardChromeHeight(surfaceEl);
                    detailCardChromeHeightRef.current = chrome;
                    const surfaceH = Math.ceil(surfaceEl.offsetHeight);
                    const body = Math.max(0, surfaceH - chrome);
                    if (skipWorkSwitchLiveFitRef.current) {
                      detailPanelTallestBodyRef.current = Math.max(
                        detailPanelTallestBodyRef.current,
                        body,
                      );
                      const cur = parseFloat(reserveEl.style.minHeight) || 0;
                      if (surfaceH > cur) reserveEl.style.minHeight = `${surfaceH}px`;
                    } else {
                      const tallestBody = Math.max(
                        detailPanelTallestBodyRef.current,
                        body,
                      );
                      detailPanelTallestBodyRef.current = tallestBody;
                      const next = Math.ceil(chrome + tallestBody);
                      const cur = parseFloat(reserveEl.style.minHeight) || 0;
                      if (next > cur) reserveEl.style.minHeight = `${next}px`;
                    }
                  }
                }
                // Natural drawers already tweened to the live overview wrap. A
                // live re-fit here double-animates. Player-capped used to re-fit
                // for cap drift — that was the second height motion; skip it.
                // Leave skipWorkSwitchLiveFitRef set so the idle-fit effect (body
                // visible key change) also skips — clearing here let it double-beat.
              };

              // While copy is still opacity 0: silent exact pin (grow or shrink).
              // Never ease — keeps one visible motion only.
              const surfaceEl = detailCardSurfaceRef.current;
              const liveBody = liveDetailCardBodyElForMeasure(
                detailTabActiveNaturalRef.current,
              );
              const overviewProbe =
                detailVideoOverviewMeasureRefs.current[nextIndex];
              if (surfaceEl) {
                const need = measureDetailCardDestHeight(
                  surfaceEl,
                  overviewProbe,
                  liveBody,
                );
                const pinned = pinDetailCardHeightQuiet(
                  surfaceEl,
                  need,
                  detailCardMaxHeightPxRef.current,
                  { allowShrink: true },
                );
                if (pinned != null) {
                  detailCardTransitionHeightRef.current = pinned;
                  endDetailCardHeightTransition(pinned);
                }
              }
              continueShowBody();
            };
            // Rapid / reduced-motion: no lead. Otherwise let dissolve start first.
            const leadMs = rapid
              ? 0
              : isNaturalDrawerViewport
                ? DETAIL_NATURAL_CUTOFF_LEAD_MS
                : DETAIL_CUTOFF_LEAD_MS;
            if (leadMs <= 0) {
              showBody();
              return;
            }
            detailBodyRevealTimerRef.current = window.setTimeout(showBody, leadMs);
          });
        });
      };

      let prefetchedCardToHeight: number | undefined;
      const prefetchCardToHeight = () => {
        if (prefetchedCardToHeight != null) return prefetchedCardToHeight;
        const surface = detailCardSurfaceRef.current;
        const probe = detailVideoOverviewMeasureRefs.current[nextIndex];
        if (!surface || !probe) return undefined;
        prefetchedCardToHeight = measureDetailCardHeightForProbe(surface, probe);
        return prefetchedCardToHeight;
      };

      const startCardResize = (coupledDurationMs?: number) => {
        if (epoch !== workSwitchEpochRef.current) return;
        const targetOverviewProbe = detailVideoOverviewMeasureRefs.current[nextIndex];
        if (targetOverviewProbe) {
          // Live wrap only — do not freeze a prefetched probe height (that forced
          // a second hug when wrap disagreed). Remeasure inside the tween start.
          const sharedDur =
            coupledDurationMs != null && coupledDurationMs > 0
              ? coupledDurationMs
              : undefined;
          animateDetailCardToMeasuredBody(targetOverviewProbe, 0, {
            snap: Boolean(reduceMotion),
            switchEpoch: epoch,
            onSettled: revealAfterHeightSettle,
            preferLiveMeasure: true,
            // Shared clock with title when both move; tall overviews still scale up
            // inside animateDetailCardToMeasuredBody (see heightDelta <= 160).
            ...((sharedDur != null ||
              isNaturalDrawerViewport ||
              isTabletLandscapeViewport ||
              tabAlsoResets)
              ? {
                  durationMs: sharedDur != null
                    ? sharedDur
                    : isNaturalDrawerViewport
                      ? DETAIL_NATURAL_CARD_RESIZE_DUR_MS
                      : DETAIL_CARD_RESIZE_DUR_MS,
                  ...(isNaturalDrawerViewport && sharedDur == null
                    ? {
                        speedScale: DETAIL_NATURAL_SPEED,
                        freezeReserve: true,
                      }
                    : isNaturalDrawerViewport
                      ? { freezeReserve: true }
                      : {}),
                }
              : {}),
          });
          return;
        }
        revealAfterHeightSettle();
      };

      const tabFlipWaitMs = deferWorkForTabs
        ? DETAIL_TAB_UNDERLINE_DRAW_DELAY_MS
        : 0;
      const runAfterDelay = (ms: number, fn: () => void) => {
        afterTitleResizeTimerRef.current = window.setTimeout(() => {
          afterTitleResizeTimerRef.current = null;
          if (epoch !== workSwitchEpochRef.current) return;
          fn();
        }, ms);
      };

      /** Title height + desc card height in one beat (not title-then-card). */
      const startTitleAndCardTogether = () => {
        if (epoch !== workSwitchEpochRef.current) return;
        // Title finish must not chain a second card resize.
        afterTitleResizeRef.current = null;
        if (rapid) {
          startTitleEase();
          startCardResize();
          return;
        }

        // Shared clock from the larger of title/card deltas so both ease as one.
        const surface = detailCardSurfaceRef.current;
        const liveBody = liveDetailCardBodyElForMeasure(
          detailTabActiveNaturalRef.current,
        );
        const overviewProbe = detailVideoOverviewMeasureRefs.current[nextIndex];
        let cardDelta = 0;
        if (surface) {
          const toH = measureDetailCardDestHeight(
            surface,
            overviewProbe,
            liveBody,
          );
          if (toH > 0) cardDelta = Math.abs(toH - surface.offsetHeight);
        }
        const titleArea = detailNowPlayingRef.current;
        const titleProbe = detailTitleMeasureRefs.current[nextIndex];
        let titleDelta = 0;
        if (titleArea && titleProbe) {
          titleDelta = Math.abs(
            Math.max(titleProbe.offsetHeight, titleProbe.scrollHeight) -
              titleArea.offsetHeight,
          );
        }
        const cardDur = detailCardResizeDurationMs(cardDelta);
        const titleBase = isNaturalDrawerViewport
          ? DETAIL_NATURAL_CARD_RESIZE_DUR_MS
          : DETAIL_TITLE_MOVE_DUR_MS;
        const sharedMs = Math.max(
          titleDelta > 0.5 ? titleBase : 0,
          cardDelta > DETAIL_CARD_HEIGHT_EPSILON_PX ? cardDur : 0,
        );

        if (sharedMs > 0) {
          animateDetailTitleToMeasuredHeight(nextIndex, {
            switchEpoch: epoch,
            durationMs: sharedMs,
          });
          startCardResize(sharedMs);
          return;
        }
        startTitleEase();
        startCardResize();
      };

      const startTitleFadeThenHeight = () => {
        if (epoch !== workSwitchEpochRef.current) return;
        // After any tab FLIP wait: start title/card. Non-YouTube players are cheap
        // and commit now. YouTube is already mounting under the face poster.
        if (!nextIsYouTube) {
          commitPlayer();
        }
        const beginTitle = () => {
          if (epoch !== workSwitchEpochRef.current) return;
          commitTitleText();
          if (rapid) {
            startTitleAndCardTogether();
            return;
          }
          // Crossfade alone, then one shared title+card height beat.
          runAfterDelay(
            isNaturalDrawerViewport
              ? DETAIL_NATURAL_TITLE_CROSSFADE_MS
              : DETAIL_TITLE_CROSSFADE_MS,
            startTitleAndCardTogether,
          );
        };
        beginTitle();
      };

      /** Mount iframe under the face poster (cover stays until settle + paint). */
      const mountYoutubeUnderPoster = () => {
        if (epoch !== workSwitchEpochRef.current) return;
        youtubeAwaitingMotionSettleRef.current = true;
        youtubePaintedUnderCoverRef.current = false;
        setPlayerVideoIndex(nextIndex);
        setPlayerFaceIndex(nextIndex);
        armYoutubeFaceCoverHold();
      };

      // Prefetch while earlier beats run (not during first FLIP frames).
      if (!rapid) {
        window.setTimeout(() => {
          if (epoch !== workSwitchEpochRef.current) return;
          prefetchCardToHeight();
        }, deferWorkForTabs ? tabFlipWaitMs + 32 : 32);
      }

      if (rapid) {
        commitTitleText();
        commitPlayer();
        startTitleEase();
        startCardResize();
        return;
      }

      // Video card first (visual): face/poster immediately. YouTube iframe mounts
      // under that poster after one paint (and after tab FLIP when tabs reset) so
      // load overlaps title/card motion without a visible fight; cover lifts only
      // after settle + iframe paint.
      commitPlayerFace();
      if (!nextIsYouTube) {
        // Images / file players are cheap — swap the real player with the face.
        commitPlayer();
      }

      if (deferWorkForTabs) {
        runAfterDelay(tabFlipWaitMs, () => {
          // Desktop/tablet-landscape: warm YouTube under poster during title/card.
          // Natural: wait until expand settles to avoid jank.
          if (nextIsYouTube && !isNaturalDrawerViewport) {
            mountYoutubeUnderPoster();
          }
          startTitleFadeThenHeight();
        });
        return;
      }

      if (nextIsYouTube) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (epoch !== workSwitchEpochRef.current) return;
            if (!isNaturalDrawerViewport) {
              mountYoutubeUnderPoster();
            }
            startTitleFadeThenHeight();
          });
        });
        return;
      }

      startTitleFadeThenHeight();
    },
    [
      animateDetailCardToMeasuredBody,
      animateDetailTitleToMeasuredHeight,
      endDetailCardHeightTransition,
      finishWorkSwitch,
      isNaturalDrawerViewport,
      isPlayerCappedDrawerViewport,
      isTabletLandscapeViewport,
      reduceMotion,
      releaseNaturalDrawerResizeLock,
      updateDetailTabpanelCutoffFade,
      videos,
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

  /**
   * Place a works-strip thumb without scrollIntoView (avoids section yank).
   * Flush two-column and stacked phone / iPad portrait: page the track with
   * translateX and keep scrollLeft at 0 — native overflow/snap drifts right.
   */
  const centerWorksStripThumb = useCallback(
    (index: number, options?: { instant?: boolean }) => {
      const strip = thumbStripRef.current;
      if (!strip) return;
      const thumbs = strip.querySelectorAll<HTMLElement>(".video-editing-works-strip-thumb");
      const thumb = thumbRefs.current[index] ?? thumbs[index] ?? null;
      if (!thumb && !worksStripUsesTranslatePaging()) return;

      const track = worksStripTrackRef.current;

      if (worksStripUsesTranslatePaging()) {
        strip.scrollLeft = 0;
        strip.style.scrollSnapType = "none";
        if (track) {
          // Arrow navigation owns the track motion; stop mouse momentum first.
          stopWorksStripMotionRef.current?.();
          if (worksStripArrowTweenRafRef.current != null) {
            window.cancelAnimationFrame(worksStripArrowTweenRafRef.current);
            worksStripArrowTweenRafRef.current = null;
          }
          const match = /translate3d\((-?[\d.]+)px/.exec(track.style.transform);
          const from = match?.[1]
            ? Math.max(0, -parseFloat(match[1]))
            : worksStripLogicalXPersistRef.current;
          // Flush (desktop / iPad landscape): N-up page offset.
          // Fluid (phone / tablet portrait): soft ensure-visible (no first-page→0).
          const to = worksStripUsesFlushPaging()
            ? Math.max(0, Math.round(worksStripFlushPageOffset(strip, index, card.id)))
            : worksStripEnsureThumbOffset(strip, index, from);
          const syncX = (x: number) => {
            worksStripLogicalXPersistRef.current = x;
            syncWorksStripLogicalXRef.current(x);
          };
          if (options?.instant || reduceMotion || Math.abs(to - from) <= 0.5) {
            track.style.transform = to > 0 ? `translate3d(${-to}px, 0, 0)` : "";
            syncX(to);
            return;
          }
          const start = performance.now();
          const duration = 320;
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            const k = 1 - (1 - t) ** 3;
            const x = from + (to - from) * k;
            track.style.transform = x > 0.5 ? `translate3d(${-x}px, 0, 0)` : "";
            syncX(x);
            if (t < 1) {
              worksStripArrowTweenRafRef.current = window.requestAnimationFrame(tick);
              return;
            }
            worksStripArrowTweenRafRef.current = null;
            track.style.transform = to > 0.5 ? `translate3d(${-to}px, 0, 0)` : "";
            syncX(to);
          };
          worksStripArrowTweenRafRef.current = window.requestAnimationFrame(tick);
        }
        return;
      }

      if (track) track.style.transform = "";
      if (!thumb) return;

      const stripRect = strip.getBoundingClientRect();
      const thumbRect = thumb.getBoundingClientRect();
      const nextLeft =
        strip.scrollLeft +
        (thumbRect.left +
          thumbRect.width / 2 -
          (stripRect.left + stripRect.width / 2));

      // Instant on touch: nested smooth scrollTo yanks the section scroller on iOS.
      if (options?.instant || reduceMotion || typeof strip.scrollTo !== "function") {
        strip.scrollLeft = nextLeft;
        return;
      }
      strip.scrollTo({ left: nextLeft, behavior: "smooth" });
    },
    [card.id, reduceMotion],
  );
  centerWorksStripThumbRef.current = centerWorksStripThumb;

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
      // Use one animated settle path for strip paging across breakpoints.
      // (Reduced motion / unsupported smooth-scroll still falls back inside.)
      centerWorksStripThumb(nextIndex);
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
      if (!usesFinePointerHover()) {
        worksArrowTouchRef.current = { side, x: event.clientX, y: event.clientY };
      } else {
        worksArrowTouchRef.current = null;
      }
      triggerWorksArrowFeedback(side, { fromFinePointerArrow: true });
    },
    [triggerWorksArrowFeedback, usesFinePointerHover],
  );

  const handleWorksArrowPointerRelease = useCallback(() => {
    worksArrowTouchRef.current = null;
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

  const handleWorksArrowPointerUp = useCallback(
    (side: "prev" | "next") => (event: React.PointerEvent<HTMLButtonElement>) => {
      if (usesFinePointerHover()) return;
      const start = worksArrowTouchRef.current;
      worksArrowTouchRef.current = null;
      if (
        start &&
        start.side === side &&
        Math.abs(event.clientX - start.x) < STRIP_SWIPE_TAP_CANCEL_PX &&
        Math.abs(event.clientY - start.y) < STRIP_SWIPE_TAP_CANCEL_PX
      ) {
        worksArrowTouchCommitAtRef.current = performance.now();
        handleSelectAdjacentWork(side === "prev" ? -1 : 1, event.currentTarget);
      }
      scheduleWorksArrowRelease();
    },
    [handleSelectAdjacentWork, scheduleWorksArrowRelease, usesFinePointerHover],
  );

  const handleWorksArrowClick = useCallback(
    (direction: -1 | 1) => (event: React.MouseEvent<HTMLButtonElement>) => {
      if (
        !usesFinePointerHover() &&
        performance.now() - worksArrowTouchCommitAtRef.current < TOUCH_CLICK_GUARD_MS
      ) {
        event.preventDefault();
        return;
      }
      handleSelectAdjacentWork(direction, event.currentTarget);
    },
    [handleSelectAdjacentWork, usesFinePointerHover],
  );

  useEffect(() => {
    activeVideoIndexRef.current = activeVideoIndex;
  }, [activeVideoIndex]);

  useEffect(() => {
    const strip = thumbStripRef.current;
    if (!strip || videos.length <= 1) return;
    // iPad landscape + phone / iPad portrait: same JS translateX strip as desktop
    // player-cap (no native overflow/snap — that eats the next tap).
    if (
      matchesDetailTabletLandscapeViewport() ||
      matchesDetailNaturalDrawerViewport() ||
      matchesDetailPhoneStripViewport()
    ) {
      const track = worksStripTrackRef.current;
      strip.scrollLeft = 0;
      strip.style.scrollSnapType = "none";
      if (!track) return;

      let activeTouchId: number | null = null;
      let axisLock: "undecided" | "x" | "y" = "undecided";
      let axisStartX = 0;
      let axisStartY = 0;
      let axisLastX = 0;
      let axisLastY = 0;
      let axisLastMoveTime = 0;
      let startOffset = 0;
      let startOuterTop = 0;
      let velocityX = 0;
      let velocityY = 0;
      let momentumRaf = 0;
      const AXIS_LOCK_PX = 2;
      const phoneStrip = matchesDetailPhoneStripViewport();

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

      const applySectionTop = (next: number) => {
        if (!sectionScroller) return;
        const max = Math.max(0, sectionScroller.scrollHeight - sectionScroller.clientHeight);
        sectionScroller.scrollTop = Math.max(0, Math.min(max, next));
      };

      const startSectionMomentum = () => {
        stopMomentum();
        let v = Math.max(-2.8, Math.min(2.8, velocityY));
        if (Math.abs(v) < 0.045 || !sectionScroller) return;
        let prev = performance.now();
        const step = (now: number) => {
          const dt = Math.min(34, Math.max(0, now - prev));
          prev = now;
          v *= Math.exp(-0.0032 * dt);
          if (Math.abs(v) < 0.02) {
            momentumRaf = 0;
            return;
          }
          const before = sectionScroller.scrollTop;
          applySectionTop(before + v * dt);
          if (Math.abs(sectionScroller.scrollTop - before) < 0.2) {
            momentumRaf = 0;
            return;
          }
          momentumRaf = window.requestAnimationFrame(step);
        };
        momentumRaf = window.requestAnimationFrame(step);
      };

      const flushPaging = worksStripUsesFlushPaging();
      const maxOffset = () => worksStripMaxOffset(strip, card.id);

      const readOffset = () => {
        const match = /translate3d\((-?[\d.]+)px/.exec(track.style.transform);
        if (!match?.[1]) return 0;
        return Math.max(0, -parseFloat(match[1]));
      };

      const readOffsetInit = () => {
        const match = /translate3d\((-?[\d.]+)px/.exec(track.style.transform);
        if (!match?.[1]) return Math.max(0, worksStripLogicalXPersistRef.current);
        return Math.max(0, -parseFloat(match[1]));
      };
      let logicalX = readOffsetInit();

      const paintOffset = () => {
        const max = maxOffset();
        // Mid-orientation / remount: geometry can report max 0 before thumbs
        // lay out. Do not clamp-and-persist that as a real reset to 0.
        if (max <= 0 && logicalX > 0.5) {
          strip.scrollLeft = 0;
          const x = -logicalX;
          track.style.transform = Math.abs(x) > 0.5 ? `translate3d(${x}px, 0, 0)` : "";
          return logicalX;
        }
        const { pos, visual } = rubberBandRange(logicalX, max, strip.clientWidth);
        strip.scrollLeft = 0;
        const x = -pos + visual;
        track.style.transform = Math.abs(x) > 0.5 ? `translate3d(${x}px, 0, 0)` : "";
        worksStripLogicalXPersistRef.current = pos;
        return pos;
      }

      const applyOffset = (next: number) => {
        logicalX = next;
        return paintOffset();
      };

      const stopMomentum = () => {
        if (momentumRaf) {
          window.cancelAnimationFrame(momentumRaf);
          momentumRaf = 0;
        }
      };

      const snapOffset = () => {
        // Free/fluid settle on all touch translate strips (phone, tablet portrait,
        // tablet landscape) — match desktop wheel: only clamp to range, never
        // step/page snap back when the window is not an exact N-up.
        const max = maxOffset();
        if (max <= 0 && logicalX > 0.5) {
          // Layout mid-rotate / not measured yet — keep X, do not stomp persist.
          paintOffset();
          return;
        }
        logicalX = Math.max(0, Math.min(max, logicalX));
        paintOffset();
      };

      const springStripToRange = (then?: () => void) => {
        const max = maxOffset();
        const from = logicalX;
        const target = Math.max(0, Math.min(max, from));
        if (Math.abs(from - target) < 0.5) {
          then ? then() : snapOffset();
          return;
        }
        stopMomentum();
        const start = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / 280);
          const k = 1 - (1 - t) ** 3;
          logicalX = from + (target - from) * k;
          paintOffset();
          if (t < 1) {
            momentumRaf = window.requestAnimationFrame(step);
            return;
          }
          momentumRaf = 0;
          logicalX = target;
          then ? then() : snapOffset();
        };
        momentumRaf = window.requestAnimationFrame(step);
      };

      const startMomentum = () => {
        stopMomentum();
        const max = maxOffset();
        if (logicalX < 0 || logicalX > max) {
          springStripToRange();
          return;
        }
        let v = Math.max(-2.8, Math.min(2.8, velocityX));
        if (Math.abs(v) < 0.045) {
          snapOffset();
          return;
        }
        let prev = performance.now();
        const step = (now: number) => {
          const dt = Math.min(34, Math.max(0, now - prev));
          prev = now;
          v *= Math.exp(-0.0032 * dt);
          if (Math.abs(v) < 0.02) {
            momentumRaf = 0;
            snapOffset();
            return;
          }
          applyOffset(logicalX + v * dt);
          if (logicalX < 0 || logicalX > max) {
            v *= 0.55;
            if (Math.abs(v) < 0.08) {
              momentumRaf = 0;
              springStripToRange();
              return;
            }
          }
          momentumRaf = window.requestAnimationFrame(step);
        };
        momentumRaf = window.requestAnimationFrame(step);
      };

      const findTouchById = (list: TouchList, id: number) => {
        for (let i = 0; i < list.length; i++) {
          if (list[i]?.identifier === id) return list[i];
        }
        return null;
      };

      const onTouchStart = (event: TouchEvent) => {
        const touch = event.changedTouches[0];
        if (!touch) return;
        stopMomentum();
        activeTouchId = touch.identifier;
        axisLock = "undecided";
        axisStartX = touch.clientX;
        axisStartY = touch.clientY;
        axisLastX = touch.clientX;
        axisLastY = touch.clientY;
        axisLastMoveTime = performance.now();
        const maxX = maxOffset();
        const fromPaint = readOffset();
        if (logicalX < 0 || logicalX > maxX) {
          logicalX = Math.max(0, Math.min(maxX, logicalX));
        } else if (Math.abs(fromPaint - logicalX) > 2) {
          logicalX = Math.max(0, Math.min(maxX, fromPaint));
        }
        paintOffset();
        startOffset = logicalX;
        startOuterTop = sectionScroller?.scrollTop ?? 0;
        velocityX = 0;
        velocityY = 0;
        resetStripSwipeArrowGesture(touch.clientX, touch.clientY);
      };

      const onTouchMove = (event: TouchEvent) => {
        if (activeTouchId == null) return;
        const touch = findTouchById(event.touches, activeTouchId);
        if (!touch) return;
        tryFireStripSwipeArrowFromMotion(touch.clientX, touch.clientY);

        if (axisLock === "undecided") {
          const dx = touch.clientX - axisStartX;
          const dy = touch.clientY - axisStartY;
          if (Math.abs(dx) < AXIS_LOCK_PX && Math.abs(dy) < AXIS_LOCK_PX) return;
          axisLock = Math.abs(dx) >= Math.abs(dy) ? "x" : "y";
        }

        const now = performance.now();
        const dt = Math.max(8, now - axisLastMoveTime);
        if (axisLock === "x") {
          const delta = axisLastX - touch.clientX;
          velocityX = velocityX * 0.65 + (delta / dt) * 0.35;
          applyOffset(startOffset + (axisStartX - touch.clientX));
        } else {
          const delta = axisLastY - touch.clientY;
          velocityY = velocityY * 0.65 + (delta / dt) * 0.35;
          applySectionTop(startOuterTop + (axisStartY - touch.clientY));
        }
        axisLastX = touch.clientX;
        axisLastY = touch.clientY;
        axisLastMoveTime = now;
        if (event.cancelable) event.preventDefault();
      };

      const onTouchEnd = (event: TouchEvent) => {
        if (activeTouchId == null) return;
        const touch = findTouchById(event.changedTouches, activeTouchId);
        if (!touch) return;
        const isTap =
          Math.abs(touch.clientX - axisStartX) < STRIP_SWIPE_TAP_CANCEL_PX &&
          Math.abs(touch.clientY - axisStartY) < STRIP_SWIPE_TAP_CANCEL_PX;
        const locked = axisLock;
        activeTouchId = null;
        axisLock = "undecided";
        if (isTap) {
          stopMomentum();
          return;
        }
        if (locked === "x") startMomentum();
        else if (locked === "y") startSectionMomentum();
      };

      const pinScrollLeft = () => {
        if (strip.scrollLeft !== 0) strip.scrollLeft = 0;
      };

      strip.addEventListener("scroll", pinScrollLeft, { passive: true });
      strip.addEventListener("touchstart", onTouchStart, { passive: true });
      strip.addEventListener("touchmove", onTouchMove, { passive: false });
      strip.addEventListener("touchend", onTouchEnd, { passive: true });
      strip.addEventListener("touchcancel", onTouchEnd, { passive: true });

      const stopForThumbTap = () => {
        stopMomentum();
        logicalX = readOffset();
        // Phone: don't paint here — the thumb/arrow tween owns the track.
        // paintOffset() was rewriting mid-tween and leaving a 1–2px nudge.
        if (!phoneStrip) paintOffset();
      };
      stopWorksStripMotionRef.current = stopForThumbTap;
      syncWorksStripLogicalXRef.current = (x) => {
        logicalX = Math.max(0, x);
        worksStripLogicalXPersistRef.current = logicalX;
      };

      return () => {
        stopMomentum();
        if (stopWorksStripMotionRef.current === stopForThumbTap) {
          stopWorksStripMotionRef.current = null;
        }
        syncWorksStripLogicalXRef.current = () => {};
        strip.removeEventListener("scroll", pinScrollLeft);
        strip.removeEventListener("touchstart", onTouchStart);
        strip.removeEventListener("touchmove", onTouchMove);
        strip.removeEventListener("touchend", onTouchEnd);
        strip.removeEventListener("touchcancel", onTouchEnd);
      };
    }

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

    const stopForThumbTap = () => {
      stopMomentum();
      strip.style.scrollSnapType = "";
      const x = strip.scrollLeft;
      strip.scrollLeft = x;
      stripProgrammaticScrollRef.current = false;
    };
    stopWorksStripMotionRef.current = stopForThumbTap;

    return () => {
      stopMomentum();
      if (stopWorksStripMotionRef.current === stopForThumbTap) {
        stopWorksStripMotionRef.current = null;
      }
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
  }, [
    card.id,
    isNaturalDrawerViewport,
    isTabletLandscapeViewport,
    resetStripSwipeArrowGesture,
    tryFireStripSwipeArrowFromMotion,
    videos.length,
  ]);

  useEffect(() => {
    const strip = thumbStripRef.current;
    const track = worksStripTrackRef.current;
    if (!strip || !track || videos.length <= 1) return;
    if (matchesDetailTabletLandscapeViewport()) return;
    if (!matchesDetailPlayerCapViewport() || !usesFinePointerHover()) return;

    let logicalX = (() => {
      const match = /translate3d\((-?[\d.]+)px/.exec(track.style.transform);
      if (match?.[1]) return Math.max(0, -parseFloat(match[1]));
      return Math.max(0, worksStripLogicalXPersistRef.current);
    })();
    let momentumRaf = 0;
    let wheelSnapTimer = 0;
    let dragId: number | null = null;
    let dragStartX = 0;
    let dragStartOffset = 0;
    let lastX = 0;
    let lastMoveTime = 0;
    let velocityX = 0;

    const maxOffset = () => worksStripFlushMaxOffset(strip, card.id);

    const readOffset = () => {
      const match = /translate3d\((-?[\d.]+)px/.exec(track.style.transform);
      if (!match?.[1]) return 0;
      return Math.max(0, -parseFloat(match[1]));
    };

    const paintOffset = () => {
      const max = maxOffset();
      const dim = Math.max(1, strip.clientWidth);
      let pos = logicalX;
      let visual = 0;
      if (logicalX < 0) {
        pos = 0;
        visual = (1 - 1 / ((-logicalX * 0.22) / dim + 1)) * dim;
      } else if (logicalX > max) {
        pos = max;
        visual = -(1 - 1 / (((logicalX - max) * 0.22) / dim + 1)) * dim;
      }
      strip.scrollLeft = 0;
      const x = -pos + visual;
      track.style.transform = Math.abs(x) > 0.5 ? `translate3d(${x}px, 0, 0)` : "";
      worksStripLogicalXPersistRef.current = pos;
      return pos;
    };

    const stopMomentum = () => {
      if (momentumRaf) {
        window.cancelAnimationFrame(momentumRaf);
        momentumRaf = 0;
      }
      if (wheelSnapTimer) {
        window.clearTimeout(wheelSnapTimer);
        wheelSnapTimer = 0;
      }
    };

    const springToRange = () => {
      const max = maxOffset();
      const from = logicalX;
      const target = Math.max(0, Math.min(max, from));
      if (Math.abs(from - target) < 0.5) {
        logicalX = target;
        paintOffset();
        return;
      }
      stopMomentum();
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / 420);
        const k = 1 - (1 - t) ** 4;
        logicalX = from + (target - from) * k;
        paintOffset();
        if (t < 1) {
          momentumRaf = window.requestAnimationFrame(step);
          return;
        }
        momentumRaf = 0;
        logicalX = target;
        paintOffset();
      };
      momentumRaf = window.requestAnimationFrame(step);
    };

    const startMomentum = () => {
      stopMomentum();
      const max = maxOffset();
      if (logicalX < 0 || logicalX > max) {
        springToRange();
        return;
      }
      let v = Math.max(-2.8, Math.min(2.8, velocityX));
      if (Math.abs(v) < 0.045) return;
      let prev = performance.now();
      const step = (now: number) => {
        const dt = Math.min(34, Math.max(0, now - prev));
        prev = now;
        v *= Math.exp(-0.0032 * dt);
        if (Math.abs(v) < 0.02) {
          momentumRaf = 0;
          if (logicalX < 0 || logicalX > max) springToRange();
          return;
        }
        logicalX += v * dt;
        paintOffset();
        if (logicalX < 0 || logicalX > max) {
          v *= 0.45;
          if (Math.abs(v) < 0.08) {
            momentumRaf = 0;
            springToRange();
            return;
          }
        }
        momentumRaf = window.requestAnimationFrame(step);
      };
      momentumRaf = window.requestAnimationFrame(step);
    };

    const onWheel = (event: WheelEvent) => {
      if (stripProgrammaticScrollRef.current) return;
      const absX = Math.abs(event.deltaX);
      const absY = Math.abs(event.deltaY);
      const dx = absX > absY || event.shiftKey ? (absX > absY ? event.deltaX : event.deltaY) : 0;
      if (dx === 0) return;
      event.preventDefault();
      stopMomentum();
      logicalX = readOffset() + dx;
      paintOffset();
      wheelSnapTimer = window.setTimeout(() => {
        wheelSnapTimer = 0;
        springToRange();
      }, 80);
    };

    let dragArmed = false;

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      if (stripProgrammaticScrollRef.current) return;
      if ((event.target as Element | null)?.closest(".video-editing-works-arrow")) return;
      stripSwipeArrowRef.current.suppressTap = false;
      dragId = event.pointerId;
      dragArmed = false;
      dragStartX = event.clientX;
      lastX = event.clientX;
      lastMoveTime = performance.now();
      velocityX = 0;
      logicalX = readOffset();
      dragStartOffset = logicalX;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (dragId == null || event.pointerId !== dragId) return;
      const pulled = Math.abs(event.clientX - dragStartX);
      if (!dragArmed) {
        if (pulled < STRIP_SWIPE_TAP_CANCEL_PX) return;
        dragArmed = true;
        stripSwipeArrowRef.current.suppressTap = true;
        strip.setPointerCapture?.(event.pointerId);
        stopMomentum();
      }
      const now = performance.now();
      const dt = Math.max(8, now - lastMoveTime);
      const delta = lastX - event.clientX;
      velocityX = velocityX * 0.65 + (delta / dt) * 0.35;
      lastX = event.clientX;
      lastMoveTime = now;
      logicalX = dragStartOffset + (dragStartX - event.clientX);
      paintOffset();
    };

    const onPointerUp = (event: PointerEvent) => {
      if (dragId == null || event.pointerId !== dragId) return;
      const wasDrag = dragArmed;
      dragId = null;
      dragArmed = false;
      if (wasDrag) startMomentum();
    };

    strip.addEventListener("wheel", onWheel, { passive: false });
    strip.addEventListener("pointerdown", onPointerDown);
    strip.addEventListener("pointermove", onPointerMove);
    strip.addEventListener("pointerup", onPointerUp);
    strip.addEventListener("pointercancel", onPointerUp);
    const stopMotionForArrowNav = () => {
      stopMomentum();
      logicalX = readOffset();
    };
    stopWorksStripMotionRef.current = stopMotionForArrowNav;

    return () => {
      stopMomentum();
      if (stopWorksStripMotionRef.current === stopMotionForArrowNav) {
        stopWorksStripMotionRef.current = null;
      }
      strip.removeEventListener("wheel", onWheel);
      strip.removeEventListener("pointerdown", onPointerDown);
      strip.removeEventListener("pointermove", onPointerMove);
      strip.removeEventListener("pointerup", onPointerUp);
      strip.removeEventListener("pointercancel", onPointerUp);
    };
  }, [card.id, usesFinePointerHover, videos.length]);

  useEffect(() => {
    activeVideoIndexRef.current = 0;
    setActiveVideoIndex(0);
    setPlayerVideoIndex(0);
    setPlayerFaceIndex(0);
    lockWorksStripScrollSync();
    requestAnimationFrame(() => {
      const strip = thumbStripRef.current;
      if (strip) {
        strip.scrollLeft = 0;
        strip.style.scrollSnapType = worksStripUsesTranslatePaging() ? "none" : "";
      }
      const track = worksStripTrackRef.current;
      if (track) track.style.transform = "";
    });
  }, [card.title, lockWorksStripScrollSync]);

  const handleSelectVideo = useCallback((index: number) => {
    stopWorksStripMotionRef.current?.();
    navigateToWorkIndex(index, {
      scrollStrip: true,
    });
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
  const safePlayerIndex = Math.min(playerVideoIndex, videos.length - 1);
  const playerVideo = videos[safePlayerIndex] ?? activeVideo;
  const safeFaceIndex = Math.min(playerFaceIndex, videos.length - 1);
  const faceVideo = videos[safeFaceIndex] ?? activeVideo;
  /** Poster stand-in while YouTube iframe is deferred, and until it paints. */
  const youtubeFacePending =
    Boolean(youtubeVideoId(faceVideo.url)) &&
    (safeFaceIndex !== safePlayerIndex || youtubeFaceCoverHold);
  const youtubeFacePosterSrc = youtubeFacePending ? facePosterSrc(faceVideo) : null;
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
    ? "basis-[calc((100%-0.5rem-1px)/2)] sm:basis-[calc((100%-0.625rem-1px)/2)] md:basis-[calc((100%-1.25rem-1px)/3)] lg:basis-[calc((100%-1.25rem-1px)/3)]"
    : "basis-[calc((100%-0.5rem-1px)/2)] sm:basis-[calc((100%-0.625rem-1px)/2)] md:basis-[calc((100%-1.25rem-1px)/3)] lg:basis-[calc((100%-1.875rem-1px)/4)]";
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
  const worksStripShellClass = `video-editing-works-strip-shell min-w-0 overflow-x-visible ${worksStripClass}`;
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
          requestAnimationFrame(() => {
            updateDetailTabpanelCutoffFadeRef.current();
          });
          if (isNaturalDrawerViewport) {
            releaseNaturalDrawerResizeLock();
          }
          // While tab copy is settling: silent pin only (no second ease).
          const settleSurface = detailCardSurfaceRef.current;
          const settleLive = liveDetailCardBodyElForMeasure(
            detailTabActiveNaturalRef.current,
          );
          if (settleSurface) {
            const need = measureDetailCardDestHeight(
              settleSurface,
              targetProbe,
              settleLive,
            );
            const pinned = pinDetailCardHeightQuiet(
              settleSurface,
              need,
              detailCardMaxHeightPxRef.current,
              { allowShrink: true },
            );
            if (pinned != null) {
              detailCardTransitionHeightRef.current = pinned;
              endDetailCardHeightTransition(pinned);
            }
          }
          // Stamp idle key so cap sync cannot schedule another height change.
          detailCardIdleFitKeyRef.current = `${card.id}:${nextTabId}:${activeVideoIndexRef.current}:${detailBodyVisibleRef.current}`;
          skipTabLiveFitRef.current = false;
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

          const resizeDelayMs = DETAIL_BODY_OUT_MS;

          skipTabLiveFitRef.current = true;

          // Measure live body when resize starts (after delay) — one height beat.
          animateDetailCardToMeasuredBody(targetProbe, resizeDelayMs, {
            onSettled: settleMaskAfterResize,
            preferLiveMeasure: true,
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
      card.id,
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

  const activateDetailCardTab = useCallback(
    (tabId: DetailCardTabId) => {
      handleDetailCardTabChange(tabId);
      focusDetailCardTab(tabId);
    },
    [focusDetailCardTab, handleDetailCardTabChange],
  );

  const handleDetailCardTabPointerDown = useCallback(
    (tabId: DetailCardTabId) => (event: React.PointerEvent<HTMLButtonElement>) => {
      if (usesFinePointerHover()) return;
      detailTabTouchRef.current = { tabId, x: event.clientX, y: event.clientY };
    },
    [usesFinePointerHover],
  );

  const handleDetailCardTabPointerUp = useCallback(
    (tabId: DetailCardTabId) => (event: React.PointerEvent<HTMLButtonElement>) => {
      if (usesFinePointerHover()) return;
      const start = detailTabTouchRef.current;
      detailTabTouchRef.current = null;
      if (
        !start ||
        start.tabId !== tabId ||
        Math.abs(event.clientX - start.x) >= STRIP_SWIPE_TAP_CANCEL_PX ||
        Math.abs(event.clientY - start.y) >= STRIP_SWIPE_TAP_CANCEL_PX
      ) {
        return;
      }
      detailTabTouchCommitAtRef.current = performance.now();
      // After the pointer gesture — FLIP/underline skip if we swap tabs on pointerup.
      window.setTimeout(() => {
        activateDetailCardTab(tabId);
      }, 0);
    },
    [activateDetailCardTab, usesFinePointerHover],
  );

  const handleDetailCardTabPointerCancel = useCallback(() => {
    detailTabTouchRef.current = null;
  }, []);

  const handleDetailCardTabClick = useCallback(
    (tabId: DetailCardTabId) => () => {
      if (
        !usesFinePointerHover() &&
        performance.now() - detailTabTouchCommitAtRef.current < TOUCH_CLICK_GUARD_MS
      ) {
        return;
      }
      activateDetailCardTab(tabId);
    },
    [activateDetailCardTab, usesFinePointerHover],
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
                onPointerDown={handleDetailCardTabPointerDown(tabId)}
                onPointerUp={handleDetailCardTabPointerUp(tabId)}
                onPointerCancel={handleDetailCardTabPointerCancel}
                onClick={handleDetailCardTabClick(tabId)}
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
    const measuredChromeHeight = measureDetailCardChromeHeight(cardSurface);
    if (!detailCardResizeAnimationRef.current) {
      detailCardChromeHeightRef.current = measuredChromeHeight;
    }
    const fixedChromeHeight =
      detailCardChromeHeightRef.current ?? measuredChromeHeight;
    let activeNaturalH = Math.ceil(activeNatural.offsetHeight);
    // During a work-switch the live body can already be the next (taller)
    // overview while the card is still pinned short. Using full offsetHeight
    // jumps page reserve ahead of the card tween (Undertale double-jump).
    if (
      workSwitchInFlightRef.current ||
      detailCardHeightTransitioningRef.current
    ) {
      const cardBodyBudget = Math.max(
        0,
        Math.ceil(cardSurface.offsetHeight) - fixedChromeHeight,
      );
      activeNaturalH = Math.min(activeNaturalH, cardBodyBudget);
    }
    if (activeNaturalH > 0) {
      tallest = Math.max(tallest, activeNaturalH);
    }

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
    // During work-switch / height tween: anti-collapse only. Probe tallest for the
    // next overview (Undertale) must not expand reserve ahead of the card — that
    // reads as a second height motion before the rAF ease.
    if (isNaturalDrawerViewport) {
      const currentMin = parseFloat(reserve.style.minHeight) || 0;
      if (
        workSwitchInFlightRef.current ||
        detailCardHeightTransitioningRef.current
      ) {
        const hold = Math.max(currentMin, Math.ceil(cardSurface.offsetHeight));
        reserve.style.minHeight = hold > 0 ? `${hold}px` : "";
      } else {
        const nextMin = Math.max(currentMin, cappedReserve);
        reserve.style.minHeight = nextMin > 0 ? `${nextMin}px` : "";
      }
    } else {
      // Same as natural: never expand page reserve ahead of the card tween.
      // Tab+work reset (Tools → Undertale) used to jump reserve first, then the
      // card eased — reads as the Undertale double-jump on desktop/iPad land.
      const currentMin = parseFloat(reserve.style.minHeight) || 0;
      if (
        workSwitchInFlightRef.current ||
        detailCardHeightTransitioningRef.current
      ) {
        const hold = Math.max(currentMin, Math.ceil(cardSurface.offsetHeight));
        reserve.style.minHeight = hold > 0 ? `${hold}px` : "";
      } else {
        reserve.style.minHeight = cappedReserve > 0 ? `${cappedReserve}px` : "";
      }
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

  /**
   * Initial height + one content fit per tab/work/visibility. Do not depend on
   * painted height, cap ticks, or callback identity — those retriggered a
   * probe-vs-live tween loop (e.g. SLAYWIRE OVERVIEW).
   */
  useLayoutEffect(() => {
    if (!isPlayerCappedDrawerViewport) return;
    const maxHeight = detailCardMaxHeightPxRef.current;
    if (maxHeight == null) return;
    // Never stomp an in-flight delayed measure or WAAPI resize (wrong target / flicker).
    if (detailCardHeightTransitioningRef.current) return;
    if (detailCardResizeAnimationRef.current) return;
    if (detailCardResizeDelayTimerRef.current != null) return;
    // Wait until the entry body is showing — same window as the visible grow the user sees.
    if (!detailBodyVisible) return;

    const cardSurface = detailCardSurfaceRef.current;
    const activeNatural = detailTabActiveNaturalRef.current;
    const paintedHeight = detailCardHeightPxRef.current;
    const fitKey = `${card.id}:${activeDetailCardTab}:${activeVideoIndex}:${detailBodyVisible}`;

    if (paintedHeight == null) {
      // Wait for live copy — defaulting to the player cap leaves empty
      // slack on short tabs and stamps the fit key so we never hug.
      if (!cardSurface || !activeNatural || activeNatural.offsetHeight <= 0) {
        return;
      }
      const live = liveDetailCardBodyEl(activeNatural);
      const nextHeight = Math.min(
        measureDetailCardHeightForProbe(cardSurface, live ?? activeNatural),
        maxHeight,
      );
      detailCardChromeHeightRef.current = measureDetailCardChromeHeight(cardSurface);
      detailCardIdleFitKeyRef.current = fitKey;
      setDetailCardHeightPx(nextHeight);
      if (skipTabLiveFitRef.current) {
        skipTabLiveFitRef.current = false;
      } else if (
        !isTabletLandscapeViewport &&
        !skipWorkSwitchLiveFitRef.current &&
        !workSwitchInFlightRef.current
      ) {
        scheduleFitDetailCardToLiveBodyRef.current();
      }
      return;
    }

    if (!cardSurface || !activeNatural) return;

    const settleCutoff = () => {
      requestAnimationFrame(() => {
        updateDetailTabpanelCutoffFadeRef.current();
      });
    };

    // Player cap shrank under the card (title grew / layout moved).
    // Pin only — never a second height ease.
    if (
      paintedHeight > maxHeight + 3 &&
      !skipWorkSwitchLiveFitRef.current &&
      !workSwitchInFlightRef.current &&
      !skipTabLiveFitRef.current
    ) {
      const pinned = pinDetailCardHeightQuiet(
        cardSurface,
        maxHeight,
        maxHeight,
        { allowShrink: true },
      );
      if (pinned != null) {
        detailCardTransitionHeightRef.current = pinned;
        setDetailCardHeightPx(pinned);
      }
      settleCutoff();
      return;
    }

    // Hug copy on first paint of this tab/work. Do not remasure from cap
    // ticks — that retriggered a probe-vs-live tween loop.
    if (detailCardIdleFitKeyRef.current !== fitKey) {
      detailCardIdleFitKeyRef.current = fitKey;
      // Work-switch / tab single-beat already eased once — clear and skip.
      if (skipTabLiveFitRef.current) {
        skipTabLiveFitRef.current = false;
      } else if (skipWorkSwitchLiveFitRef.current) {
        skipWorkSwitchLiveFitRef.current = false;
      } else if (!isTabletLandscapeViewport) {
        scheduleFitDetailCardToLiveBodyRef.current();
      }
    }
  }, [
    isPlayerCappedDrawerViewport,
    isTabletLandscapeViewport,
    detailCardMaxHeightPx,
    activeDetailCardTab,
    activeVideoIndex,
    detailBodyVisible,
    card.id,
  ]);

  // Natural drawers: intentionally no work-switch ResizeObserver live-fit.
  // Probe tween is the sole height destination; a post-settle RO fit caused
  // a second jump when clone vs painted body disagreed (Undertale overview).
  // Do not reintroduce scheduleFitDetailCardToLiveBody / fitDetailCardToLiveBody
  // on natural work-switch settle.

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
                className={`video-editing-player video-editing-player--plyr group relative overflow-hidden rounded-sm bg-black sm:rounded-xl${
                  matchInteractiveMediaChrome
                    ? " border border-solid border-[color:var(--portfolio-glass-stroke)] shadow-[var(--portfolio-glass-shadow)]"
                    : " ring-1 ring-white/[0.09]"
                }${matchInteractiveMediaChrome ? " video-editing-player--interactive-media" : ""}${
                  isImageMedia(playerVideo) ? " video-editing-player--image" : ""
                }`}
              >
                {isImageMedia(playerVideo) ? (
                  <VideoEditingImagePlayer
                    video={playerVideo}
                    focalPoint={card.focalPoint ?? "50% 50%"}
                  />
                ) : (
                  <VideoEditingPlyrPlayer
                    video={playerVideo}
                    onYouTubeLoad={() => {
                      youtubePaintedUnderCoverRef.current = true;
                      if (youtubeAwaitingMotionSettleRef.current) {
                        // Motion still running — keep poster; settle path will lift.
                        return;
                      }
                      if (youtubeFaceCoverHoldTimerRef.current != null) {
                        window.clearTimeout(youtubeFaceCoverHoldTimerRef.current);
                        youtubeFaceCoverHoldTimerRef.current = null;
                      }
                      // One frame after load so the first paint can land under the poster.
                      window.requestAnimationFrame(() => {
                        setYoutubeFaceCoverHold(false);
                      });
                    }}
                  />
                )}
                {youtubeFacePending && youtubeFacePosterSrc ? (
                  <div className="pointer-events-none absolute inset-0 z-[1] bg-black">
                    <img
                      src={youtubeFacePosterSrc}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                      style={{ objectPosition: card.focalPoint ?? "50% 50%" }}
                      decoding="async"
                    />
                  </div>
                ) : null}
                {youtubeVideoId(playerVideo.url) || youtubeFacePending ? null : (
                  <div className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/70 via-black/30 to-transparent px-3 pt-2 pb-8 opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100 group-focus-within:opacity-100 sm:px-3.5 sm:pt-2.5">
                    <p className="truncate font-body text-[12px] leading-none text-white sm:text-[13px]">
                      <span className="font-display tracking-[-0.01em]">{activeSelectorTitle}</span>
                      {activeSelectorSubtitle ? <span className="text-mono-2"> · {activeSelectorSubtitle}</span> : null}
                    </p>
                  </div>
                )}
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
                      onPointerUp={handleWorksArrowPointerUp("prev")}
                      onPointerCancel={handleWorksArrowPointerRelease}
                      onPointerLeave={handleWorksArrowPointerRelease}
                      onClick={handleWorksArrowClick(-1)}
                    >
                      <ChevronLeft className="video-editing-works-arrow-glyph h-[0.9625rem] w-[0.9625rem] sm:h-[1.1rem] sm:w-[1.1rem]" strokeWidth={2.25} aria-hidden />
                    </button>
                  ) : null}
                  <div className={worksStripShellClass}>
                  <div
                    ref={thumbStripRef}
                    className="video-editing-works-strip no-scrollbar flex min-w-0 gap-2 overflow-x-auto pb-0.5 sm:gap-2.5 [overflow-anchor:none] [overscroll-behavior-x:contain] w-full [touch-action:none]"
                  >
                    <div
                      ref={worksStripTrackRef}
                      className="video-editing-works-strip-track contents"
                    >
                    {videos.map((video, index) => {
                      // Face index leads the work switch; keep strip highlight in sync with poster.
                      const active = index === safeFaceIndex;
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
                          className={`video-editing-works-strip-thumb group relative flex shrink-0 flex-col text-left cursor-pointer ${worksStripThumbBasisClass} [touch-action:none] ${
                            active ? "text-white" : "text-mono-2"
                          }`}
                          aria-label={`Select ${isSlaywire ? "media" : "edit"} thumbnail ${index + 1}`}
                          aria-pressed={active}
                          onMouseDown={(event) => {
                            if (usesFinePointerHover()) event.preventDefault();
                          }}
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
                                loading={active ? "eager" : "lazy"}
                                fetchPriority={active ? "high" : "low"}
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
                                <span className="mt-1.5 block font-heading text-sm leading-tight text-white">
                                  {selectorTitle}
                                </span>
                              ) : null}
                              {selectorSubtitle ? (
                                <span className="mt-1 block font-body text-[12px] leading-tight text-mono-2">
                                  {selectorSubtitle}
                                </span>
                              ) : null}
                            </span>
                          ) : null}
                        </div>
                      );
                    })}
                    </div>
                  </div>
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
                      onPointerUp={handleWorksArrowPointerUp("next")}
                      onPointerCancel={handleWorksArrowPointerRelease}
                      onPointerLeave={handleWorksArrowPointerRelease}
                      onClick={handleWorksArrowClick(1)}
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
                  className={`${showcaseDetailCardClass} video-editing-detail-meta-card mt-3.5 flex w-full min-h-0 min-w-0 flex-col overflow-hidden [overflow-anchor:none] sm:mt-4${
                    detailCardAtPlayerCap
                      ? " video-editing-detail-meta-card--capped"
                      : ""
                  }`}
                  style={(() => {
                    const heightPx = detailCardHeightTransitioning
                      ? (detailCardTransitionHeightRef.current ??
                        detailCardHeightPx)
                      : detailCardHeightPx;
                    const next: CSSProperties = {};
                    if (detailCardMaxHeightPx != null) {
                      next.maxHeight = `${detailCardMaxHeightPx}px`;
                    }
                    if (heightPx != null) {
                      next.height = `${
                        detailCardMaxHeightPx != null
                          ? Math.min(heightPx, detailCardMaxHeightPx)
                          : heightPx
                      }px`;
                    }
                    return Object.keys(next).length ? next : undefined;
                  })()}
                >
                  <div
                    className={`video-editing-detail-overview w-full min-w-0${
                      detailCardUsesInnerScroll ? " flex min-h-0 flex-1 flex-col" : ""
                    }`}
                  >
                    <div
                      className={`video-editing-detail-cards-tabs flex w-full min-w-0 flex-col gap-2.5${
                        detailCardUsesInnerScroll ? " min-h-0 flex-1" : ""
                      }`}
                    >
                      {renderDetailCardTabList()}
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                          key={activeVideo.id}
                          initial={false}
                          className={`w-full min-w-0${
                            detailCardUsesInnerScroll ? " flex min-h-0 flex-1 flex-col" : ""
                          }`}
                        >
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
                                  }${
                                    detailTabpanelCutoffFade === "bottom"
                                      ? " is-bottom-fade-tall"
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
                              </div>
                            </div>
                          </div>
                          {isCompactDrawerViewport ? (
                            <div
                              className="video-editing-detail-card-tab-surface video-editing-detail-card-tab-measure pointer-events-none invisible absolute left-0 top-0 -z-10 h-0 w-full overflow-hidden"
                              aria-hidden
                            >
                              {DETAIL_CARD_TAB_IDS.map((tabId) => (
                                <div
                                  key={`measure-${tabId}`}
                                  ref={(el) => {
                                    detailTabHiddenMeasureRefs.current[tabId] = el;
                                  }}
                                  className="relative w-full min-w-0"
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
                                  className="relative w-full min-w-0"
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
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
            <AnimatePresence initial={false}>
              {showDetailScrollHint ? (
                <motion.div
                  key="detail-scroll-hint"
                  className="video-editing-detail-scroll-hint"
                  aria-hidden
                  initial={{ opacity: 0 }}
                  animate={{ opacity: detailScrollHintVisible ? 1 : 0 }}
                  exit={{ opacity: 0 }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { duration: 0.4, ease: EASE.out }
                  }
                >
                  <div
                    className={`video-editing-detail-scroll-hint__float${
                      reduceMotion ? " video-editing-detail-scroll-hint__float--static" : ""
                    }`}
                  >
                    <div
                      className={`video-editing-detail-scroll-hint__breathe font-display${
                        reduceMotion ? " video-editing-detail-scroll-hint__breathe--static" : ""
                      }`}
                    >
                      <span className="video-editing-detail-scroll-hint__arrow video-editing-detail-scroll-hint__arrow-clock">
                        <svg
                          viewBox="0 0 10 6"
                          width="12"
                          height="8"
                          fill="none"
                          aria-hidden
                        >
                          <path
                            d="M1 1.25 L5 4.75 L9 1.25"
                            stroke="currentColor"
                            strokeWidth="1.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
                </section>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
