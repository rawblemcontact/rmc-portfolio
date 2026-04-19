import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

export type ShowcaseTabId = "tab-1" | "tab-2" | "tab-3" | "tab-4" | "tab-5";

const TAB_ORDER: ShowcaseTabId[] = ["tab-1", "tab-2", "tab-3", "tab-4", "tab-5"];

const TAB_LABEL: Record<ShowcaseTabId, string> = {
  "tab-1": "Content writing",
  "tab-2": "Screenplay",
  "tab-3": "Graphic novel",
  "tab-4": "Literary analysis",
  "tab-5": "Media analysis",
};

/** Active tab + deck — one surface */
const TAB_ACTIVE_SURFACE = "bg-zinc-950";
/** Inactive folder tabs — slightly recessed */
const TAB_INACTIVE_SURFACE = "bg-zinc-900/55";

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
  onArchives: () => void;
  /** Optional width wrapper (parent usually sets w-full). */
  className?: string;
  panel?:
    | React.ReactNode
    | ((ctx: { tabWidthPx: number; tabInsetLeftPx: number }) => React.ReactNode);
};

/** Folder tab shape: rounded top on every tab; shared bottom edge. */
const FOLDER_TAB_TOP =
  "rounded-t-[7px] sm:rounded-t-[8px]";

export function ShowcaseAttachedTabStrip({
  activeId,
  onTabChange,
  onArchives,
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
  const tabWidthPx = tabGeom.w > 0 ? tabGeom.w : 120;
  const resolvedPanel =
    typeof panel === "function"
      ? panel({ tabWidthPx, tabInsetLeftPx: tabInsetLeft })
      : panel;

  return (
    <div className={`flex w-full flex-col ${className}`}>
      <div
        className={[
          "flex flex-col overflow-hidden rounded-[11px] sm:rounded-xl",
          "border border-white/[0.09]",
          "bg-zinc-950/40",
          "shadow-[0_18px_48px_-28px_rgba(0,0,0,0.9)]",
        ].join(" ")}
      >
        <header className="shrink-0 border-b border-white/[0.08] bg-black/30 px-3 py-2.5 text-center sm:px-4 sm:py-3">
          <h2 className="m-0 font-heading text-sm leading-snug tracking-eyebrow-tight uppercase text-mono-2/90">
            FEATURED WRITING
          </h2>
        </header>

        <div className="relative z-[1] flex shrink-0 flex-col gap-0 border-b border-white/[0.08] bg-black/25 px-3 pt-1.5 sm:flex-row sm:items-end sm:justify-between sm:gap-3 sm:px-4 sm:pt-2">
          <div
            ref={tabListRef}
            role="tablist"
            aria-label="Showcase views"
            onScroll={syncFit}
            className="flex min-w-0 flex-1 items-end overflow-x-auto overflow-y-visible [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {TAB_ORDER.map((id, index) => {
              const active = activeId === id;
              const stackInactive = 4 + index;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  id={`showcase-tab-${id}`}
                  aria-selected={active}
                  tabIndex={0}
                  onClick={() => onTabChange(id)}
                  style={{ zIndex: active ? 28 : stackInactive }}
                  className={[
                    "group relative flex shrink-0 items-center justify-center",
                    FOLDER_TAB_TOP,
                    "min-w-0 border border-b-0 px-2.5 font-heading text-[10px] sm:text-xs tracking-btn-caps uppercase",
                    "motion-safe:transition-[height,box-shadow,background-color,border-color,color] motion-safe:duration-200 motion-safe:ease-out",
                    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-yellow-400/30 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                    index > 0 ? "-ml-px" : "",
                    active
                      ? [
                          TAB_ACTIVE_SURFACE,
                          "relative h-10 min-h-[2.5rem] sm:h-11 sm:min-h-[2.75rem]",
                          "border-white/[0.2] text-yellow-400/90",
                          "shadow-[0_6px_20px_-8px_rgba(0,0,0,0.75),3px_0_10px_-5px_rgba(0,0,0,0.55)]",
                        ].join(" ")
                      : [
                          TAB_INACTIVE_SURFACE,
                          "h-7 min-h-[1.75rem] sm:h-8 sm:min-h-[2rem]",
                          "border-white/[0.07] text-white/40",
                          "hover:border-white/[0.11] hover:bg-zinc-900/75 hover:text-white/58",
                        ].join(" "),
                  ].join(" ")}
                >
                  <span className="whitespace-nowrap px-0.5 leading-none">{TAB_LABEL[id]}</span>
                </button>
              );
            })}
          </div>

          <div className="flex shrink-0 justify-end pb-1 sm:pb-1.5">
            <button
              type="button"
              onClick={onArchives}
              className="group inline-flex items-center gap-1.5 py-1 font-heading text-[10px] sm:text-xs tracking-btn-caps uppercase text-white/38 transition-colors duration-200 ease-out hover:text-yellow-400/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-yellow-400/30 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              MORE
              <ArrowRight
                className="h-3 w-3 shrink-0 opacity-55 transition-opacity duration-200 ease-out group-hover:opacity-100"
                strokeWidth={1.75}
                aria-hidden
              />
            </button>
          </div>
        </div>

        <div
          className={[
            "relative z-[2] flex flex-col overflow-x-hidden overflow-y-visible",
            TAB_ACTIVE_SURFACE,
          ].join(" ")}
          role="region"
          aria-label="Featured writing content"
        >
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
          {/*
           * Tight pt so preview + copy sit close under the tab row (was py-3).
           */}
          <div ref={bodyPadRef} className="px-3 pt-2 pb-3 sm:px-4 sm:pt-2.5 sm:pb-3.5">
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
