import React, { useCallback, useLayoutEffect, useRef, useState } from "react";

export type ShowcaseTabId = "tab-1" | "tab-2" | "tab-3" | "tab-4" | "tab-5" | "tab-6";

const TAB_ORDER: ShowcaseTabId[] = ["tab-1", "tab-2", "tab-3", "tab-4", "tab-5", "tab-6"];

const TAB_LABEL: Record<ShowcaseTabId, string> = {
  "tab-1": "Content writing",
  "tab-2": "Screenplay",
  "tab-3": "Graphic novel",
  "tab-4": "Literary analysis",
  "tab-5": "Media analysis",
  "tab-6": "Narrative essay",
};

/** Rail, inactive tabs, active tab, and body share one surface (same as `--portfolio-section-card` / profile card). */
const TAB_PANEL_SURFACE = "featured-writing-panel";

/** Active tab: same `color-mix` for border + label (applied via `style` so values stay in sync). */
const featuredTabSoftYellow = "color-mix(in srgb, var(--palette-yellow-projects) 48%, rgb(186, 186, 186))";

/**
 * Panel inset + preview width always follow this tab so switching tabs does not shift
 * content (same alignment as “Content writing”).
 */
const LAYOUT_ANCHOR_TAB_ID: ShowcaseTabId = "tab-1";

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
  let ml = tr.left - contentLeft;
  let w = tr.width;
  if (ml < 0) ml = 0;
  if (w < 1) w = 0;
  if (ml + w > contentWidth) {
    w = Math.max(1, contentWidth - ml);
  }
  return { ml, w };
}

export type ShowcaseAttachedTabStripProps = {
  activeId: ShowcaseTabId;
  onTabChange: (id: ShowcaseTabId) => void;
  /** Optional width wrapper (parent usually sets w-full). */
  className?: string;
  panel?:
    | React.ReactNode
    | ((ctx: { tabWidthPx: number; tabInsetLeftPx: number }) => React.ReactNode);
};

/** Folder tab shape: rounded top on every tab; shared bottom edge. */
const FOLDER_TAB_TOP =
  "rounded-t-[7px] sm:rounded-t-[8px]";

function applyBodyRuleGap(bodyTopEl: HTMLElement | null, activeTabId: ShowcaseTabId) {
  if (!bodyTopEl) return;
  const tab = bodyTopEl.ownerDocument.getElementById(`showcase-tab-${activeTabId}`) as HTMLElement | null;
  if (!tab) {
    bodyTopEl.style.removeProperty("--fw-rule-skip-start");
    bodyTopEl.style.removeProperty("--fw-rule-skip-end");
    return;
  }
  const br = bodyTopEl.getBoundingClientRect();
  const tr = tab.getBoundingClientRect();
  const skipStart = Math.max(0, tr.left - br.left);
  const skipEnd = Math.min(br.width, tr.right - br.left);
  if (skipEnd <= skipStart) {
    bodyTopEl.style.setProperty("--fw-rule-skip-start", "0px");
    bodyTopEl.style.setProperty("--fw-rule-skip-end", "0px");
    return;
  }
  bodyTopEl.style.setProperty("--fw-rule-skip-start", `${skipStart}px`);
  bodyTopEl.style.setProperty("--fw-rule-skip-end", `${skipEnd}px`);
}

export function ShowcaseAttachedTabStrip({
  activeId,
  onTabChange,
  className = "",
  panel,
}: ShowcaseAttachedTabStripProps) {
  const tabListRef = useRef<HTMLDivElement>(null);
  const bodyPadRef = useRef<HTMLDivElement>(null);
  const bodyRuleTopRef = useRef<HTMLDivElement>(null);
  const [tabGeom, setTabGeom] = useState({ ml: 0, w: 0 });

  const syncFit = useCallback(() => {
    const el = bodyPadRef.current;
    if (!el) return;
    const next = measureTabGeometryForLayout(
      el,
      tabListRef.current,
      LAYOUT_ANCHOR_TAB_ID,
    );
    setTabGeom((prev) =>
      prev.ml === next.ml && prev.w === next.w ? prev : next,
    );
    applyBodyRuleGap(bodyRuleTopRef.current, activeId);
  }, [activeId]);

  useLayoutEffect(() => {
    syncFit();
    const raf = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(syncFit);
    });
    const el = bodyPadRef.current;
    const tl = tabListRef.current;
    const ro = new ResizeObserver(() => syncFit());
    if (el) ro.observe(el);
    if (tl) ro.observe(tl);
    window.addEventListener("resize", syncFit);
    return () => {
      window.cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", syncFit);
    };
  }, [syncFit]);

  const tabInsetLeft = tabGeom.ml;
  const tabWidthPx = tabGeom.w > 0 ? tabGeom.w : 120;
  const resolvedPanel =
    typeof panel === "function"
      ? panel({ tabWidthPx, tabInsetLeftPx: tabInsetLeft })
      : panel;

  return (
    <div className={`flex w-full flex-col ${className}`}>
      <div
        className={[
          "featured-writing-shell flex min-w-0 w-full max-w-full flex-col overflow-hidden rounded-[11px] sm:rounded-xl",
          "shadow-[0_18px_48px_-28px_rgba(0,0,0,0.9)]",
          // lg+: match right edge of SHOWCASE cards (slide basis uses (100%-4px)/2 — Home.tsx).
          "lg:max-w-[calc(100%-4px)]",
        ].join(" ")}
      >
        <header className="featured-writing-inner-rule-header shrink-0 bg-transparent px-3 py-2.5 text-center sm:px-4 sm:py-3">
          <h2 className="m-0 font-display text-sm font-bold leading-snug tracking-eyebrow-tight uppercase text-white">
            FEATURED WRITING
          </h2>
        </header>

        <div className="featured-writing-panel relative flex shrink-0 flex-col gap-0 px-3 pt-3 sm:px-4 sm:pt-4">
          <div
            ref={tabListRef}
            role="tablist"
            aria-label="Showcase views"
            onScroll={syncFit}
            className="flex min-w-0 w-full items-end gap-0.5 overflow-x-auto overflow-y-visible [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {TAB_ORDER.map((id) => {
              const active = activeId === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  id={`showcase-tab-${id}`}
                  aria-selected={active}
                  tabIndex={0}
                  onClick={() => onTabChange(id)}
                  style={
                    active
                      ? { borderColor: featuredTabSoftYellow, color: featuredTabSoftYellow }
                      : undefined
                  }
                  className={[
                    "group relative flex shrink-0 items-center justify-center",
                    FOLDER_TAB_TOP,
                    "min-w-0 border border-b-0 px-2.5 font-heading text-[10px] sm:text-xs tracking-btn-caps uppercase",
                    "motion-safe:transition-[height,box-shadow,background-color,border-color,color] motion-safe:duration-200 motion-safe:ease-out",
                    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-portfolio-yellow/30 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                    active
                      ? [
                          TAB_PANEL_SURFACE,
                          "relative h-10 min-h-[2.5rem] sm:h-11 sm:min-h-[2.75rem]",
                          "shadow-[0_6px_20px_-8px_rgba(0,0,0,0.75),3px_0_10px_-5px_rgba(0,0,0,0.55)]",
                        ].join(" ")
                      : [
                          TAB_PANEL_SURFACE,
                          "featured-writing-tab-idle-edge h-7 min-h-[1.75rem] sm:h-8 sm:min-h-[2rem]",
                          "text-mono-2/42 hover:bg-white/[0.04] hover:text-mono-2/88",
                        ].join(" "),
                  ].join(" ")}
                >
                  <span className="whitespace-nowrap px-0.5 leading-none">{TAB_LABEL[id]}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div
          ref={bodyRuleTopRef}
          className={[
            "featured-writing-inner-rule-body-top relative flex flex-col overflow-x-hidden overflow-y-visible",
            TAB_PANEL_SURFACE,
          ].join(" ")}
          role="region"
          aria-label="Featured writing content"
        >
          <div ref={bodyPadRef} className="px-3 py-3 sm:px-4 sm:py-3.5">
            {/*
             * Inset matches the active tab’s left edge; width fills the folder body so
             * thumbnail + copy are not squeezed to the tab button width (avoids clipping
             * under overflow-hidden).
             */}
            <div
              className="relative min-w-0"
              style={{
                marginLeft: tabInsetLeft,
                width: `calc(100% - ${tabInsetLeft}px)`,
              }}
            >
              {resolvedPanel != null ? resolvedPanel : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
