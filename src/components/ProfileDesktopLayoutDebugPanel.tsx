import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { ProfileDesktopLayoutDebugValues } from "../lib/portfolioDebugMode";

type ProfileDesktopLayoutDebugPanelProps = {
  sectionLabel: string;
  leftLabel: string;
  rightLabel: string;
  values: ProfileDesktopLayoutDebugValues;
  defaults: ProfileDesktopLayoutDebugValues;
  showLeftHeightScale?: boolean;
  showRightHeightScale?: boolean;
  onChange: (patch: Partial<ProfileDesktopLayoutDebugValues>) => void;
  onSave: () => void;
  onReset: () => void;
};

export function ProfileDesktopLayoutDebugPanel({
  sectionLabel,
  leftLabel,
  rightLabel,
  values,
  defaults,
  showLeftHeightScale = false,
  showRightHeightScale = false,
  onChange,
  onSave,
  onReset,
}: ProfileDesktopLayoutDebugPanelProps) {
  const [open, setOpen] = useState(true);
  const [saveState, setSaveState] = useState<"idle" | "saved">("idle");
  const [panelPosition, setPanelPosition] = useState({ x: 12, y: 12 });
  const dragStateRef = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const clampPosition = useCallback((x: number, y: number) => {
    if (typeof window === "undefined") return { x, y };
    const panelWidthPx = 360;
    const panelHeightPx = 80;
    const maxX = Math.max(0, window.innerWidth - panelWidthPx);
    const maxY = Math.max(0, window.innerHeight - panelHeightPx);
    return {
      x: Math.min(Math.max(0, x), maxX),
      y: Math.min(Math.max(0, y), maxY),
    };
  }, []);

  const handleSave = useCallback(() => {
    onSave();
    setSaveState("saved");
    window.setTimeout(() => setSaveState("idle"), 1400);
  }, [onSave]);

  const handleDragStart = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.button !== 0) return;
      const next = clampPosition(panelPosition.x, panelPosition.y);
      setPanelPosition(next);
      dragStateRef.current = {
        startX: event.clientX,
        startY: event.clientY,
        originX: next.x,
        originY: next.y,
      };
      event.preventDefault();
    },
    [clampPosition, panelPosition.x, panelPosition.y],
  );

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const drag = dragStateRef.current;
      if (!drag) return;
      const deltaX = event.clientX - drag.startX;
      const deltaY = event.clientY - drag.startY;
      setPanelPosition(clampPosition(drag.originX + deltaX, drag.originY + deltaY));
    };

    const handlePointerUp = () => {
      dragStateRef.current = null;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [clampPosition]);

  return (
    <div
      className="fixed z-[120] hidden w-[min(93vw,22.5rem)] rounded-md border border-white/20 bg-black/85 p-2.5 text-white shadow-[0_14px_38px_rgba(0,0,0,0.45)] backdrop-blur-sm lg:block"
      style={{ left: `${panelPosition.x}px`, top: `${panelPosition.y}px` }}
    >
      <div className="mb-2 flex items-center gap-2">
        <div
          role="button"
          tabIndex={-1}
          onPointerDown={handleDragStart}
          className="flex min-w-0 flex-1 cursor-move items-center rounded-sm border border-white/20 bg-black/65 px-2.5 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-white/90"
        >
          <span className="truncate">{sectionLabel} desktop L/R tuning</span>
        </div>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-[29px] w-[29px] shrink-0 items-center justify-center rounded-sm border border-white/20 bg-black/65 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-white/90 transition-colors hover:border-white/35 hover:bg-black/80"
          aria-label={open ? "Collapse debug controls" : "Expand debug controls"}
        >
          {open ? "−" : "+"}
        </button>
      </div>

      {open && (
        <div className="mt-2 space-y-3">
          <label className="block">
            <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-mono-2/80">
              {leftLabel} X ({values.leftOffsetX}px)
            </span>
            <input
              type="range"
              min={-220}
              max={220}
              step={1}
              value={values.leftOffsetX}
              onChange={(event) => onChange({ leftOffsetX: Number(event.target.value) })}
              className="h-1.5 w-full accent-zinc-200"
            />
          </label>

          <label className="block">
            <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-mono-2/80">
              {leftLabel} Y ({values.leftOffsetY}px)
            </span>
            <input
              type="range"
              min={-220}
              max={220}
              step={1}
              value={values.leftOffsetY}
              onChange={(event) => onChange({ leftOffsetY: Number(event.target.value) })}
              className="h-1.5 w-full accent-zinc-200"
            />
          </label>

          <label className="block">
            <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-mono-2/80">
              {leftLabel} scale ({values.leftScale.toFixed(2)}x)
            </span>
            <input
              type="range"
              min={0.7}
              max={1.3}
              step={0.01}
              value={values.leftScale}
              onChange={(event) => onChange({ leftScale: Number(event.target.value) })}
              className="h-1.5 w-full accent-zinc-200"
            />
          </label>

          <label className="block">
            <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-mono-2/80">
              {leftLabel} width ({values.leftWidthScale.toFixed(2)}x)
            </span>
            <input
              type="range"
              min={0.7}
              max={1.3}
              step={0.01}
              value={values.leftWidthScale}
              onChange={(event) => onChange({ leftWidthScale: Number(event.target.value) })}
              className="h-1.5 w-full accent-zinc-200"
            />
          </label>

          {showLeftHeightScale ? (
            <label className="block">
              <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-mono-2/80">
                {leftLabel} height ({values.leftHeightScale.toFixed(2)}x)
              </span>
              <input
                type="range"
                min={0.7}
                max={1.3}
                step={0.01}
                value={values.leftHeightScale}
                onChange={(event) => onChange({ leftHeightScale: Number(event.target.value) })}
                className="h-1.5 w-full accent-zinc-200"
              />
            </label>
          ) : null}

          <label className="block">
            <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-mono-2/80">
              {rightLabel} X ({values.rightOffsetX}px)
            </span>
            <input
              type="range"
              min={-220}
              max={220}
              step={1}
              value={values.rightOffsetX}
              onChange={(event) => onChange({ rightOffsetX: Number(event.target.value) })}
              className="h-1.5 w-full accent-zinc-200"
            />
          </label>

          <label className="block">
            <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-mono-2/80">
              {rightLabel} Y ({values.rightOffsetY}px)
            </span>
            <input
              type="range"
              min={-220}
              max={220}
              step={1}
              value={values.rightOffsetY}
              onChange={(event) => onChange({ rightOffsetY: Number(event.target.value) })}
              className="h-1.5 w-full accent-zinc-200"
            />
          </label>

          <label className="block">
            <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-mono-2/80">
              {rightLabel} scale ({values.rightScale.toFixed(2)}x)
            </span>
            <input
              type="range"
              min={0.7}
              max={1.3}
              step={0.01}
              value={values.rightScale}
              onChange={(event) => onChange({ rightScale: Number(event.target.value) })}
              className="h-1.5 w-full accent-zinc-200"
            />
          </label>

          <label className="block">
            <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-mono-2/80">
              {rightLabel} width ({values.rightWidthScale.toFixed(2)}x)
            </span>
            <input
              type="range"
              min={0.7}
              max={1.3}
              step={0.01}
              value={values.rightWidthScale}
              onChange={(event) => onChange({ rightWidthScale: Number(event.target.value) })}
              className="h-1.5 w-full accent-zinc-200"
            />
          </label>

          {showRightHeightScale ? (
            <label className="block">
              <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-mono-2/80">
                {rightLabel} height ({values.rightHeightScale.toFixed(2)}x)
              </span>
              <input
                type="range"
                min={0.7}
                max={1.3}
                step={0.01}
                value={values.rightHeightScale}
                onChange={(event) => onChange({ rightHeightScale: Number(event.target.value) })}
                className="h-1.5 w-full accent-zinc-200"
              />
            </label>
          ) : null}

          <pre className="max-h-24 overflow-auto rounded-sm border border-white/10 bg-black/70 p-2 font-mono text-[10px] leading-relaxed text-mono-2/80">
{`leftOffsetX: ${values.leftOffsetX}
leftOffsetY: ${values.leftOffsetY}
leftScale: ${values.leftScale.toFixed(2)}
leftWidthScale: ${values.leftWidthScale.toFixed(2)}${showLeftHeightScale ? `\nleftHeightScale: ${values.leftHeightScale.toFixed(2)}` : ""}
rightOffsetX: ${values.rightOffsetX}
rightOffsetY: ${values.rightOffsetY}
rightScale: ${values.rightScale.toFixed(2)}
rightWidthScale: ${values.rightWidthScale.toFixed(2)}${showRightHeightScale ? `\nrightHeightScale: ${values.rightHeightScale.toFixed(2)}` : ""}`}
          </pre>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center justify-center border border-white/20 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-mono-2 hover:border-white/45 hover:text-white"
            >
              {saveState === "saved" ? "Saved" : "Save values"}
            </button>
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center justify-center border border-white/20 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-mono-2 hover:border-white/45 hover:text-white"
            >
              Reset
            </button>
          </div>

          <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-mono-2/60">
            Defaults: Lx {defaults.leftOffsetX}px / Ly {defaults.leftOffsetY}px / Ls {defaults.leftScale.toFixed(2)} / Lw {defaults.leftWidthScale.toFixed(2)}
            {showLeftHeightScale ? ` / Lh ${defaults.leftHeightScale.toFixed(2)}` : ""} / Rx {defaults.rightOffsetX}px / Ry {defaults.rightOffsetY}px / Rs {defaults.rightScale.toFixed(2)} / Rw {defaults.rightWidthScale.toFixed(2)}
            {showRightHeightScale ? ` / Rh ${defaults.rightHeightScale.toFixed(2)}` : ""}
          </p>
        </div>
      )}
    </div>
  );
}
