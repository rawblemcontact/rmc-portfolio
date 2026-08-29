import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { featuredTabsArrowNudgePhaseDelaySec } from "@/lib/motion";

export type ShowcaseTabId = "tab-1" | "tab-2" | "tab-3" | "tab-4" | "tab-5" | "tab-6";

/** Matches PROJECT DETAILS works-strip arrow tap feedback duration. */
const FEATURED_ARROW_TAP_FEEDBACK_MS = 260;

const TAB_ORDER: ShowcaseTabId[] = ["tab-1", "tab-2", "tab-3", "tab-4", "tab-5", "tab-6"];

const TAB_LABEL: Record<ShowcaseTabId, string> = {
  "tab-1": "Content Writing",
  "tab-2": "Screenplay",
  "tab-3": "Web Comic",
  "tab-4": "Literary Analysis",
  "tab-5": "Media Analysis",
  "tab-6": "Narrative Essay",
};

/** Rail, inactive tabs, active tab, and body share one surface (same as `--portfolio-section-card` / profile card). */
const TAB_PANEL_SURFACE = "featured-writing-panel";

/** Active tab: same `color-mix` for border + label (applied via `style` so values stay in sync). */
const featuredTabSoftYellow = "var(--palette-yellow-projects)";

/**
 * Panel inset + preview width always follow this tab so switching tabs does not shift
 * content (same alignment as “Content writing”).
 */
const LAYOUT_ANCHOR_TAB_ID: ShowcaseTabId = "tab-1";

/** Equal inset above, left, and below the PDF preview within the anchor tab column. */
export const FEATURED_WRITING_PREVIEW_GUTTER_PX = 8;

function measureTabGeometryForLayout(
  bodyEl: HTMLElement,
  tabListEl: HTMLElement | null,
  anchorTabId: ShowcaseTabId,
): { ml: number; w: number } {
  const tab = tabListEl?.querySelector<HTMLElement>(
    `#showcase-tab-${anchorTabId}`,
  );
  if (!tab) return { ml: 0, w: 0 };
  const br = bodyEl.getBoundingClientRect();
  const cs = getComputedStyle(bodyEl);
  const pl = parseFloat(cs.paddingLeft) || 0;
  const pr = parseFloat(cs.paddingRight) || 0;
  const contentLeft = br.left + pl;
  const contentWidth = Math.max(0, br.width - pl - pr);
  const tr = tab.getBoundingClientRect();
  const tabLeft = tr.left - contentLeft;
  const tabRight = tr.right - contentLeft;
  const ml = Math.round(Math.max(0, tabLeft));
  let w = Math.round(Math.max(0, tabRight - ml));
  if (ml + w > contentWidth) {
    w = Math.max(0, Math.round(contentWidth - ml));
  }
  return { ml, w };
}

export type ShowcaseAttachedTabStripProps = {
  activeId: ShowcaseTabId;
  onTabChange: (id: ShowcaseTabId) => void;
  /**
   * When false, no tab shows active chrome (PROJECTS entrance: FEATURED WRITING lands idle,
   * then Content Writing highlights). Panel content still follows `activeId`.
   */
  highlightActiveTab?: boolean;
  /** Optional width wrapper (parent usually sets w-full). */
  className?: string;
  panel?:
    | React.ReactNode
    | ((ctx: {
        /** Tab id requested for render. */
        tabId: ShowcaseTabId;
        /** Full anchor-tab width for the preview column. */
        previewColumnWidthPx: number;
        /** PDF preview width inside the column gutters. */
        previewWidthPx: number;
        tabInsetLeftPx: number;
        previewGutterPx: number;
        /** Hidden phone-only measurement copy; avoid expensive media work. */
        measureOnly?: boolean;
      }) => React.ReactNode);
};

/** Folder tab shape: rounded top on every tab; the active tab overlaps the body border by 1px. */
const FOLDER_TAB_TOP =
  "rounded-t-[7px] sm:rounded-t-[8px]";

export function ShowcaseAttachedTabStrip({
  activeId,
  onTabChange,
  highlightActiveTab = true,
  className = "",
  panel,
}: ShowcaseAttachedTabStripProps) {
  const tabListRef = useRef<HTMLDivElement>(null);
  const bodyPadRef = useRef<HTMLDivElement>(null);
  const folderRef = useRef<HTMLDivElement>(null);
  /** Phone-only: outer pad keeps page scroll height at tallest tab; card itself stays natural. */
  const panelShellRef = useRef<HTMLDivElement>(null);
  /** Natural (unpadded) active tab content — measured separately from the page-height reserve. */
  const activeNaturalRef = useRef<HTMLDivElement>(null);
  const hiddenPanelMeasureRefs = useRef<Record<ShowcaseTabId, HTMLDivElement | null>>({
    "tab-1": null,
    "tab-2": null,
    "tab-3": null,
    "tab-4": null,
    "tab-5": null,
    "tab-6": null,
  });
  const mobilePanelTallestRef = useRef(0);
  const [tabGeom, setTabGeom] = useState({ ml: 0, w: 0 });
  const [bodyContentWidth, setBodyContentWidth] = useState(0);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [isPhoneViewport, setIsPhoneViewport] = useState(false);
  /**
   * Phone-only: distance from projects panel viewport top to Featured Writing folder top,
   * captured on tab select and restored after layout (belt-and-suspenders with height reserve).
   */
  const folderAnchorOffsetRef = useRef<number | null>(null);
  const [mobileSwitchDir, setMobileSwitchDir] = useState<1 | -1>(1);
  const mobileSwipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const [pressedNavArrow, setPressedNavArrow] = useState<"prev" | "next" | null>(null);
  const navArrowReleaseTimerRef = useRef<number | null>(null);
  const navArrowSwipePulseRef = useRef(0);
  const reduceMotion = useReducedMotion();
  /** Freeze once so re-renders do not restart the idle pulse out of phase. */
  const arrowIdleDelayRef = useRef<string | null>(null);
  if (arrowIdleDelayRef.current == null) {
    arrowIdleDelayRef.current = `${featuredTabsArrowNudgePhaseDelaySec()}s`;
  }
  const arrowIdleDelayStyle = {
    ["--directional-arrow-idle-delay" as string]: arrowIdleDelayRef.current,
  };
  /** Lock preview inset after first stable measure — ignore highlight paint thrash. */
  const insetLockedRef = useRef(false);
  const lastBodyWidthRef = useRef(0);
  const activeTabIndex = TAB_ORDER.indexOf(activeId);
  const canSelectPrev = highlightActiveTab && activeTabIndex > 0;
  const canSelectNext =
    highlightActiveTab && activeTabIndex >= 0 && activeTabIndex < TAB_ORDER.length - 1;

  const usesFinePointerHover = useCallback(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  }, []);

  const syncFit = useCallback(() => {
    const el = bodyPadRef.current;
    if (!el) return;
    const br = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const pl = parseFloat(cs.paddingLeft) || 0;
    const pr = parseFloat(cs.paddingRight) || 0;
    const contentWidth = Math.max(0, br.width - pl - pr);
    setBodyContentWidth((prev) => (Math.abs(prev - contentWidth) < 0.5 ? prev : contentWidth));
    const next = measureTabGeometryForLayout(
      el,
      tabListRef.current,
      LAYOUT_ANCHOR_TAB_ID,
    );
    setTabGeom((prev) => {
      if (next.w <= 0) return prev;
      if (
        insetLockedRef.current &&
        prev.w > 0 &&
        Math.abs(prev.ml - next.ml) < 2 &&
        Math.abs(prev.w - next.w) < 2
      ) {
        return prev;
      }
      if (prev.ml === next.ml && prev.w === next.w) {
        if (next.w > 0) insetLockedRef.current = true;
        return prev;
      }
      if (next.w > 0) insetLockedRef.current = true;
      return next;
    });
  }, []);

  const unlockInsetAndSync = useCallback(() => {
    insetLockedRef.current = false;
    syncFit();
  }, [syncFit]);

  useLayoutEffect(() => {
    syncFit();
    const raf = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(syncFit);
    });
    const el = bodyPadRef.current;
    /** Body width only — tab chrome paint must not unlock preview inset. */
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const w = entry.contentRect.width;
      if (Math.abs(w - lastBodyWidthRef.current) < 1) {
        syncFit();
        return;
      }
      lastBodyWidthRef.current = w;
      unlockInsetAndSync();
    });
    if (el) {
      lastBodyWidthRef.current = el.getBoundingClientRect().width;
      ro.observe(el);
    }
    window.addEventListener("resize", unlockInsetAndSync);
    return () => {
      window.cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", unlockInsetAndSync);
    };
  }, [syncFit, unlockInsetAndSync]);

  /** User tab changes may need a fresh inset; ignore highlight-only toggles. */
  useLayoutEffect(() => {
    insetLockedRef.current = false;
    syncFit();
  }, [activeId, syncFit]);

  useEffect(() => {
    const mq = window.matchMedia(
      "(max-width: 639.98px), (min-width: 768px) and (max-width: 1023.98px) and (orientation: portrait)",
    );
    const apply = () => setIsMobileViewport(mq.matches);
    apply();
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", apply);
      return () => mq.removeEventListener("change", apply);
    }
    mq.addListener(apply);
    return () => mq.removeListener(apply);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639.98px)");
    const apply = () => setIsPhoneViewport(mq.matches);
    apply();
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", apply);
      return () => mq.removeEventListener("change", apply);
    }
    mq.addListener(apply);
    return () => mq.removeListener(apply);
  }, []);

  const captureFolderScrollAnchor = useCallback(() => {
    if (!isPhoneViewport) return;
    const folder = folderRef.current;
    const scrollEl = folder?.closest<HTMLElement>('[aria-label="Section: projects"]');
    if (!folder || !scrollEl) return;
    folderAnchorOffsetRef.current =
      folder.getBoundingClientRect().top - scrollEl.getBoundingClientRect().top;
  }, [isPhoneViewport]);

  const handleSelectPrevTab = useCallback(() => {
    if (!canSelectPrev) return;
    captureFolderScrollAnchor();
    setMobileSwitchDir(-1);
    const previous = TAB_ORDER[activeTabIndex - 1];
    if (previous) onTabChange(previous);
  }, [activeTabIndex, canSelectPrev, captureFolderScrollAnchor, onTabChange]);

  const handleSelectNextTab = useCallback(() => {
    if (!canSelectNext) return;
    captureFolderScrollAnchor();
    setMobileSwitchDir(1);
    const next = TAB_ORDER[activeTabIndex + 1];
    if (next) onTabChange(next);
  }, [activeTabIndex, canSelectNext, captureFolderScrollAnchor, onTabChange]);

  const clearNavArrowReleaseTimer = useCallback(() => {
    if (navArrowReleaseTimerRef.current !== null) {
      window.clearTimeout(navArrowReleaseTimerRef.current);
      navArrowReleaseTimerRef.current = null;
    }
  }, []);

  const scheduleNavArrowRelease = useCallback(() => {
    clearNavArrowReleaseTimer();
    navArrowReleaseTimerRef.current = window.setTimeout(() => {
      setPressedNavArrow(null);
      navArrowReleaseTimerRef.current = null;
    }, reduceMotion ? 0 : FEATURED_ARROW_TAP_FEEDBACK_MS);
  }, [clearNavArrowReleaseTimer, reduceMotion]);

  const triggerNavArrowFeedback = useCallback(
    (side: "prev" | "next", options?: { fromFinePointerArrow?: boolean }) => {
      if (options?.fromFinePointerArrow && usesFinePointerHover()) return;
      clearNavArrowReleaseTimer();
      navArrowSwipePulseRef.current += 1;
      const pulseId = navArrowSwipePulseRef.current;
      setPressedNavArrow(null);
      requestAnimationFrame(() => {
        if (navArrowSwipePulseRef.current !== pulseId) return;
        setPressedNavArrow(side);
        scheduleNavArrowRelease();
      });
    },
    [clearNavArrowReleaseTimer, scheduleNavArrowRelease, usesFinePointerHover],
  );

  const handleNavArrowPointerDown = useCallback(
    (side: "prev" | "next") => () => {
      if (side === "prev" && !canSelectPrev) return;
      if (side === "next" && !canSelectNext) return;
      triggerNavArrowFeedback(side, { fromFinePointerArrow: true });
    },
    [canSelectNext, canSelectPrev, triggerNavArrowFeedback],
  );

  const handleNavArrowPointerRelease = useCallback(() => {
    if (usesFinePointerHover()) return;
    scheduleNavArrowRelease();
  }, [scheduleNavArrowRelease, usesFinePointerHover]);

  useEffect(() => {
    return () => clearNavArrowReleaseTimer();
  }, [clearNavArrowReleaseTimer]);

  const handleSelectTab = useCallback(
    (id: ShowcaseTabId) => {
      captureFolderScrollAnchor();
      onTabChange(id);
    },
    [captureFolderScrollAnchor, onTabChange],
  );

  const handleMobileSelectorTouchStart = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      const touch = event.touches[0];
      if (!touch) return;
      mobileSwipeStartRef.current = { x: touch.clientX, y: touch.clientY };
    },
    [],
  );

  const handleMobileSelectorTouchCancel = useCallback(() => {
    mobileSwipeStartRef.current = null;
  }, []);

  const handleMobileSelectorTouchEnd = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      const start = mobileSwipeStartRef.current;
      mobileSwipeStartRef.current = null;
      if (!start) return;
      const touch = event.changedTouches[0];
      if (!touch) return;

      const dx = touch.clientX - start.x;
      const dy = touch.clientY - start.y;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      // Horizontal-intent swipe only; ignore short drags and vertical pans.
      if (absDx < 38 || absDx < absDy * 1.15) return;
      if (dx < 0) {
        handleSelectNextTab();
      } else {
        handleSelectPrevTab();
      }
    },
    [handleSelectNextTab, handleSelectPrevTab],
  );

  const tabInsetLeft = isMobileViewport ? 0 : tabGeom.ml;
  const previewGutterPx = FEATURED_WRITING_PREVIEW_GUTTER_PX;
  const previewColumnWidthPx =
    isMobileViewport
      ? Math.max(128, Math.floor(bodyContentWidth || tabGeom.w || 128))
      : tabGeom.w > 0
        ? Math.floor(tabGeom.w)
        : 128;
  const previewWidthPx = Math.max(
    48,
    previewColumnWidthPx - previewGutterPx * 2,
  );
  const resolvedPanel =
    typeof panel === "function"
      ? panel({
          tabId: activeId,
          previewColumnWidthPx,
          previewWidthPx,
          tabInsetLeftPx: tabInsetLeft,
          previewGutterPx,
          measureOnly: false,
        })
      : panel;

  /**
   * Phone-only: keep projects scroll height at the tallest Featured Writing panel via
   * paddingBottom on an outer shell. The body card / tab section itself stays content-sized
   * so shorter/longer blurbs shrink or grow naturally without jolting page position.
   */
  useLayoutEffect(() => {
    const shell = panelShellRef.current;
    if (!isPhoneViewport) {
      mobilePanelTallestRef.current = 0;
      if (shell) {
        shell.style.minHeight = "";
        shell.style.paddingBottom = "";
      }
      folderAnchorOffsetRef.current = null;
      return;
    }

    let tallest = 0;
    for (const id of TAB_ORDER) {
      const probe = hiddenPanelMeasureRefs.current[id];
      if (!probe) continue;
      tallest = Math.max(tallest, Math.ceil(probe.getBoundingClientRect().height));
    }
    const activeNatural = activeNaturalRef.current;
    const activeH = activeNatural
      ? Math.ceil(activeNatural.getBoundingClientRect().height)
      : 0;
    if (activeH > 0) {
      tallest = Math.max(tallest, activeH);
    }
    if (tallest > 0) {
      mobilePanelTallestRef.current = Math.max(mobilePanelTallestRef.current, tallest);
    }
    const reserved = mobilePanelTallestRef.current;
    const pad = reserved > 0 && activeH > 0 ? Math.max(0, reserved - activeH) : 0;
    if (shell) {
      shell.style.minHeight = "";
      shell.style.paddingBottom = pad > 0 ? `${pad}px` : "";
    }

    const savedOffset = folderAnchorOffsetRef.current;
    if (savedOffset == null) return;
    const folder = folderRef.current;
    const scrollEl = folder?.closest<HTMLElement>('[aria-label="Section: projects"]');
    if (!folder || !scrollEl) return;

    const newOffset =
      folder.getBoundingClientRect().top - scrollEl.getBoundingClientRect().top;
    scrollEl.scrollTop += newOffset - savedOffset;
    folderAnchorOffsetRef.current =
      folder.getBoundingClientRect().top - scrollEl.getBoundingClientRect().top;
  }, [activeId, isPhoneViewport, previewColumnWidthPx]);

  return (
    <div className={`flex w-full flex-col ${className}`}>
      <div
        className={[
          "featured-writing-shell flex min-w-0 w-full max-w-full flex-col",
        ].join(" ")}
      >
        <div
          ref={folderRef}
          className="featured-writing-folder relative flex min-w-0 w-full flex-col max-lg:overflow-hidden max-sm:rounded-sm sm:max-lg:rounded-xl"
        >
          <div className="relative flex h-[3.5rem] min-h-[3.5rem] shrink-0 flex-col gap-0 overflow-visible pt-3 max-sm:h-[3.95rem] max-sm:min-h-[3.95rem] sm:h-16 sm:min-h-16 sm:pt-4">
            <div
              className="featured-writing-panel featured-tabs-mobile-arrow-clock relative z-[3] -mb-px hidden max-sm:flex h-[3.2rem] min-h-[3.2rem] w-full items-center justify-between rounded-t-[9px] border border-white/[0.14] border-b-0 px-2.5"
              style={arrowIdleDelayStyle}
              onTouchStart={handleMobileSelectorTouchStart}
              onTouchEnd={handleMobileSelectorTouchEnd}
              onTouchCancel={handleMobileSelectorTouchCancel}
            >
              <button
                type="button"
                aria-label="Previous writing category"
                aria-disabled={!canSelectPrev}
                tabIndex={canSelectPrev ? 0 : -1}
                onClick={handleSelectPrevTab}
                onPointerDown={handleNavArrowPointerDown("prev")}
                onPointerUp={handleNavArrowPointerRelease}
                onPointerCancel={handleNavArrowPointerRelease}
                onPointerLeave={handleNavArrowPointerRelease}
                className={`featured-tabs-mobile-nav-btn featured-tabs-mobile-nav-btn--prev flex h-7 w-7 items-center justify-center rounded-full text-mono-2/80${
                  pressedNavArrow === "prev" && canSelectPrev ? " featured-tabs-mobile-nav-btn--pressed" : ""
                }${canSelectPrev ? " hover:text-mono-2/95" : " cursor-default"}`}
              >
                <span className="featured-tabs-mobile-nav-glyph" aria-hidden>
                  <ChevronLeft
                    className="featured-tabs-scroll-hint h-3.5 w-3.5"
                  />
                </span>
              </button>
              <div className="relative min-w-0 flex-1 overflow-hidden px-1">
                <AnimatePresence initial={false} mode="wait" custom={mobileSwitchDir}>
                  <motion.div
                    key={activeId}
                    custom={mobileSwitchDir}
                    initial={{ opacity: 0, x: mobileSwitchDir > 0 ? 14 : -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: mobileSwitchDir > 0 ? -14 : 14 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className="flex min-w-0 flex-col items-center gap-px text-center"
                  >
                    <span
                      className={`max-w-full truncate px-1 font-heading text-[13.5px] font-bold leading-snug tracking-[0.02em]${
                        highlightActiveTab ? "" : " text-mono-2/42"
                      }`}
                      style={
                        highlightActiveTab
                          ? { color: featuredTabSoftYellow }
                          : undefined
                      }
                    >
                      {TAB_LABEL[activeId]}
                    </span>
                    <span className="font-heading text-[0.58rem] leading-tight tracking-[0.08em] text-mono-2/50">
                      {highlightActiveTab
                        ? `${activeTabIndex + 1} / ${TAB_ORDER.length}`
                        : "— / —"}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>
              <button
                type="button"
                aria-label="Next writing category"
                aria-disabled={!canSelectNext}
                tabIndex={canSelectNext ? 0 : -1}
                onClick={handleSelectNextTab}
                onPointerDown={handleNavArrowPointerDown("next")}
                onPointerUp={handleNavArrowPointerRelease}
                onPointerCancel={handleNavArrowPointerRelease}
                onPointerLeave={handleNavArrowPointerRelease}
                className={`featured-tabs-mobile-nav-btn featured-tabs-mobile-nav-btn--next flex h-7 w-7 items-center justify-center rounded-full text-mono-2/80${
                  pressedNavArrow === "next" && canSelectNext ? " featured-tabs-mobile-nav-btn--pressed" : ""
                }${canSelectNext ? " hover:text-mono-2/95" : " cursor-default"}`}
              >
                <span className="featured-tabs-mobile-nav-glyph" aria-hidden>
                  <ChevronRight
                    className="featured-tabs-scroll-hint h-3.5 w-3.5"
                  />
                </span>
              </button>
            </div>
            <button
              type="button"
              aria-label="Previous writing tab"
              aria-disabled={!canSelectPrev}
              tabIndex={canSelectPrev ? 0 : -1}
              onClick={handleSelectPrevTab}
              className={`featured-tabs-mobile-nav-btn featured-tabs-mobile-nav-btn--prev absolute inset-y-0 left-1 z-[5] hidden items-end pb-2 text-mono-2/70${
                canSelectPrev ? " hover:text-mono-2/95" : " cursor-default"
              }`}
            >
              <ChevronLeft className="featured-tabs-scroll-hint h-3.5 w-3.5" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Next writing tab"
              aria-disabled={!canSelectNext}
              tabIndex={canSelectNext ? 0 : -1}
              onClick={handleSelectNextTab}
              className={`featured-tabs-mobile-nav-btn featured-tabs-mobile-nav-btn--next absolute inset-y-0 right-1 z-[5] hidden items-end pb-2 text-mono-2/70${
                canSelectNext ? " hover:text-mono-2/95" : " cursor-default"
              }`}
            >
              <ChevronRight className="featured-tabs-scroll-hint h-3.5 w-3.5" aria-hidden />
            </button>
            <div
              ref={tabListRef}
              role="tablist"
              aria-label="Showcase views"
              onScroll={syncFit}
              className="flex h-full min-w-0 w-full items-end gap-0.5 overflow-visible max-sm:hidden"
            >
              {TAB_ORDER.map((id) => {
                const visuallyActive = highlightActiveTab && id === activeId;
                /**
                 * Entrance: all tabs idle until highlight — then Content Writing grows
                 * idle → active (height + fill + yellow). Tab row is fixed height /
                 * items-end so grow goes up, not into the body.
                 */
                return (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    id={`showcase-tab-${id}`}
                    aria-selected={visuallyActive}
                    tabIndex={0}
                    onClick={() => handleSelectTab(id)}
                    style={
                      visuallyActive
                        ? {
                            color: featuredTabSoftYellow,
                          }
                        : undefined
                    }
                    className={[
                      "group relative flex min-w-0 flex-1 basis-0 items-center justify-center",
                      FOLDER_TAB_TOP,
                      "px-1.5 font-heading text-[13.5px] font-bold tracking-[0.02em] sm:px-2 sm:tracking-[0.03em]",
                      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-portfolio-yellow/30 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                      visuallyActive
                        ? [
                            "featured-writing-tab-active",
                            "relative z-[3] -mb-px",
                          ].join(" ")
                        : [
                            TAB_PANEL_SURFACE,
                            "featured-writing-tab-idle-edge",
                            "text-mono-2/42 hover:bg-white/[0.05] hover:text-mono-2/88",
                          ].join(" "),
                    ].join(" ")}
                  >
                    <span className="relative z-[4] block w-full min-w-0 truncate px-0.5 text-center leading-snug">
                      {TAB_LABEL[id]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div ref={panelShellRef} className="relative min-w-0 w-full">
            <div
              className={[
                "featured-writing-body-card featured-writing-inner-rule-body-top relative z-[1] flex flex-col overflow-visible",
              ].join(" ")}
              role="region"
              aria-label="Featured writing content"
            >
              <div
                ref={bodyPadRef}
                className="profile-card-surface rounded-t-none rounded-b-[11px] px-3 py-3 sm:rounded-b-xl sm:px-4 sm:py-3.5"
              >
                <div
                  className="relative min-w-0"
                  style={{
                    marginLeft: tabInsetLeft,
                    width: `calc(100% - ${tabInsetLeft}px)`,
                  }}
                >
                  <div ref={activeNaturalRef} className="min-w-0">
                    {resolvedPanel != null ? resolvedPanel : null}
                  </div>
                  {isPhoneViewport && typeof panel === "function" ? (
                    <div
                      aria-hidden
                      inert
                      className="pointer-events-none absolute left-0 top-0 -z-10 w-full"
                      style={{ visibility: "hidden" }}
                    >
                      {TAB_ORDER.map((id) => (
                        <div
                          key={`fw-measure-${id}`}
                          ref={(el) => {
                            hiddenPanelMeasureRefs.current[id] = el;
                          }}
                          className="min-w-0 w-full"
                        >
                          {panel({
                            tabId: id,
                            previewColumnWidthPx,
                            previewWidthPx,
                            tabInsetLeftPx: tabInsetLeft,
                            previewGutterPx,
                            measureOnly: true,
                          })}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
