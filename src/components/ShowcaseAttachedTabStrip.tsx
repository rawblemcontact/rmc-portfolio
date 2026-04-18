import React from "react";
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

export type ShowcaseAttachedTabStripProps = {
  activeId: ShowcaseTabId;
  onTabChange: (id: ShowcaseTabId) => void;
  onArchives: () => void;
  /** Optional width wrapper (parent usually sets w-full). */
  className?: string;
  panel?: React.ReactNode;
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
        <header className="shrink-0 border-b border-white/[0.08] bg-black/30 px-3 py-2 text-center sm:px-4 sm:py-2.5">
          <h2 className="m-0 font-heading text-[11px] tracking-btn-caps text-white/88 sm:text-xs">
            FEATURED WRITING
          </h2>
        </header>

        {/* Shelf — minimal flat wash */}
        <div className="relative z-[1] flex shrink-0 flex-col gap-0 bg-black/25 pt-1.5 sm:flex-row sm:items-end sm:justify-between sm:gap-3 sm:pt-2">
          <div
            role="tablist"
            aria-label="Showcase views"
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
                          "border-white/[0.18] text-white",
                          "shadow-[3px_0_10px_-5px_rgba(0,0,0,0.65)]",
                          "mb-[-1px] pb-px",
                        ].join(" ")
                      : [
                          TAB_INACTIVE_SURFACE,
                          "h-7 min-h-[1.75rem] sm:h-8 sm:min-h-[2rem]",
                          "border-white/[0.07] text-white/40",
                          "hover:border-white/[0.11] hover:bg-zinc-900/75 hover:text-white/58",
                        ].join(" "),
                  ].join(" ")}
                >
                  <span className="whitespace-nowrap px-0.5">{TAB_LABEL[id]}</span>
                </button>
              );
            })}
          </div>

          <div className="flex shrink-0 justify-end pb-1 pl-1 pr-3 sm:pb-1.5 sm:pl-0 sm:pr-4">
            <button
              type="button"
              onClick={onArchives}
              className="inline-flex items-center gap-1.5 py-1 font-heading text-[10px] sm:text-xs tracking-btn-caps uppercase text-white/38 transition-colors hover:text-white/75 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-yellow-400/30 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Archives
              <ArrowRight className="h-3 w-3 shrink-0 opacity-55" strokeWidth={1.75} aria-hidden />
            </button>
          </div>
        </div>

        {/* Body — full height from content; no internal scroll */}
        <div
          className={["relative z-[2] flex flex-col overflow-x-hidden overflow-y-visible", TAB_ACTIVE_SURFACE].join(" ")}
          role="region"
          aria-label="Featured writing content"
        >
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
          <div className="px-2.5 pb-3 pt-2.5 sm:px-4 sm:pb-3.5 sm:pt-3">
            <div className="relative z-[1] text-left">{panel != null ? panel : null}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
