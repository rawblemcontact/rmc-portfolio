import React, { useCallback, useLayoutEffect, useRef, useState } from "react";

export type ShowcaseTabId = "tab-1" | "tab-2" | "tab-3" | "tab-4" | "tab-5" | "tab-6";

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
const featuredTabSoftYellow = "color-mix(in srgb, var(--palette-yellow-projects) 48%, rgb(186, 186, 186))";

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
  const ml = Math.max(0, tabLeft);
  let w = Math.max(0, tabRight - ml);
  if (ml + w > contentWidth) {
    w = Math.max(0, contentWidth - ml);
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
    | ((ctx: {
        /** Full anchor-tab width for the preview column. */
        previewColumnWidthPx: number;
        /** PDF preview width inside the column gutters. */
        previewWidthPx: number;
        tabInsetLeftPx: number;
        previewGutterPx: number;
      }) => React.ReactNode);
};

/** Folder tab shape: rounded top on every tab; the active tab overlaps the body border by 1px. */
const FOLDER_TAB_TOP =
  "rounded-t-[7px] sm:rounded-t-[8px]";

export function ShowcaseAttachedTabStrip({
  activeId,
  onTabChange,
  className = "",
  panel,
}: ShowcaseAttachedTabStripProps) {
  const tabListRef = useRef<HTMLDivElement>(null);
  const bodyPadRef = useRef<HTMLDivElement>(null);
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
  }, []);

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
  const previewGutterPx = FEATURED_WRITING_PREVIEW_GUTTER_PX;
  const previewColumnWidthPx =
    tabGeom.w > 0 ? Math.floor(tabGeom.w) : 128;
  const previewWidthPx = Math.max(
    48,
    previewColumnWidthPx - previewGutterPx * 2,
  );
  const resolvedPanel =
    typeof panel === "function"
      ? panel({
          previewColumnWidthPx,
          previewWidthPx,
          tabInsetLeftPx: tabInsetLeft,
          previewGutterPx,
        })
      : panel;

  return (
    <div className={`flex w-full flex-col ${className}`}>
      <div
        className={[
          "featured-writing-shell flex min-w-0 w-full max-w-full flex-col",
        ].join(" ")}
      >
        <div className="featured-writing-folder relative isolate flex min-w-0 w-full flex-col">
          <div className="relative flex h-[3.5rem] min-h-[3.5rem] shrink-0 flex-col gap-0 overflow-visible pt-3 sm:h-16 sm:min-h-16 sm:pt-4">
            <div
              ref={tabListRef}
              role="tablist"
              aria-label="Showcase views"
              onScroll={syncFit}
              className="flex h-full min-w-0 w-full items-end gap-0.5 overflow-visible"
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
                      active
                        ? [
                            "featured-writing-tab-active",
                            "relative z-[3] -mb-px",
                          ].join(" ")
                        : [
                            TAB_PANEL_SURFACE,
                            "featured-writing-tab-idle-edge",
                            "text-mono-2/50 hover:bg-white/[0.05] hover:text-mono-2/88",
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

          <div
            className={[
              "featured-writing-body-card featured-writing-inner-rule-body-top relative z-[1] flex flex-col overflow-visible",
            ].join(" ")}
            role="region"
            aria-label="Featured writing content"
          >
            <div
              ref={bodyPadRef}
              className={[
                TAB_PANEL_SURFACE,
                "overflow-x-hidden overflow-y-visible px-3 py-3 sm:px-4 sm:py-3.5",
              ].join(" ")}
            >
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
    </div>
  );
}