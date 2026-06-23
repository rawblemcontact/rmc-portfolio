import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";

export type MainMenuGlobalLayoutControl = {
  offsetX: number;
  offsetY: number;
  scale: number;
};

export const MAIN_MENU_GLOBAL_LAYOUT_DEFAULTS: MainMenuGlobalLayoutControl = {
  offsetX: 0,
  offsetY: 0,
  scale: 0.94,
};

/** Crisp zoom + translate for main menu content (excludes grid bg). */
export function buildMainMenuGlobalLayoutStyle(control: MainMenuGlobalLayoutControl): CSSProperties {
  return {
    transform: `translate(${control.offsetX}px, ${control.offsetY}px)`,
    transformOrigin: "left top",
    zoom: control.scale,
  };
}

const MAIN_MENU_DEBUG_PANEL_WIDTH_PX = 320;

function defaultMainMenuDebugPanelPosition() {
  if (typeof window === "undefined") return { x: 12, y: 12 };
  return {
    x: 12,
    y: Math.max(12, window.innerHeight - 320),
  };
}

type MainMenuLayoutDebugPanelProps = {
  controls: MainMenuGlobalLayoutControl;
  defaults: MainMenuGlobalLayoutControl;
  onChange: (patch: Partial<MainMenuGlobalLayoutControl>) => void;
  onReset: () => void;
};

export function MainMenuLayoutDebugPanel({
  controls,
  defaults,
  onChange,
  onReset,
}: MainMenuLayoutDebugPanelProps) {
  const [open, setOpen] = useState(true);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");
  const [panelPosition, setPanelPosition] = useState(defaultMainMenuDebugPanelPosition);
  const dragStateRef = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const clampPosition = useCallback((x: number, y: number) => {
    if (typeof window === "undefined") return { x, y };
    const panelHeightPx = 80;
    const maxX = Math.max(0, window.innerWidth - MAIN_MENU_DEBUG_PANEL_WIDTH_PX);
    const maxY = Math.max(0, window.innerHeight - panelHeightPx);
    return {
      x: Math.min(Math.max(0, x), maxX),
      y: Math.min(Math.max(0, y), maxY),
    };
  }, []);

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

  const lockInCode = [
    "const MAIN_MENU_GLOBAL_LAYOUT = {",
    `  offsetX: ${controls.offsetX},`,
    `  offsetY: ${controls.offsetY},`,
    `  scale: ${controls.scale.toFixed(2)},`,
    "};",
  ].join("\n");

  const handleCopy = useCallback(async () => {
    console.info("[Main Menu Layout Debug Lock In]\n" + lockInCode);
    try {
      await navigator.clipboard.writeText(lockInCode);
      setCopyStatus("copied");
      window.setTimeout(() => setCopyStatus("idle"), 1400);
    } catch {
      setCopyStatus("failed");
      window.setTimeout(() => setCopyStatus("idle"), 1400);
    }
  }, [lockInCode]);

  return (
    <div
      className="fixed z-[120] w-[min(94vw,20rem)] rounded-md border border-white/20 bg-black/85 p-2.5 text-white shadow-[0_14px_38px_rgba(0,0,0,0.45)] backdrop-blur-sm"
      style={{ left: `${panelPosition.x}px`, top: `${panelPosition.y}px` }}
    >
      <div className="mb-2 flex items-center gap-2">
        <div
          role="button"
          tabIndex={-1}
          onPointerDown={handleDragStart}
          className="flex min-w-0 flex-1 cursor-move items-center rounded-sm border border-white/20 bg-black/65 px-2.5 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-white/90"
        >
          <span className="truncate">Main menu layout</span>
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
        <div className="mt-2 max-h-[min(72vh,calc(100svh-5rem))] overflow-y-auto pr-1 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/25">
          <div className="rounded-sm border border-white/10 bg-black/50 p-2">
            <p className="mb-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-mono-2/90">
              Global content
            </p>
            <label className="block">
              <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-mono-2/70">
                X ({controls.offsetX}px)
              </span>
              <input
                type="range"
                min={-220}
                max={220}
                step={1}
                value={controls.offsetX}
                onChange={(event) => onChange({ offsetX: Number(event.target.value) })}
                className="h-1.5 w-full accent-zinc-200"
              />
            </label>
            <label className="mt-2 block">
              <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-mono-2/70">
                Y ({controls.offsetY}px)
              </span>
              <input
                type="range"
                min={-220}
                max={220}
                step={1}
                value={controls.offsetY}
                onChange={(event) => onChange({ offsetY: Number(event.target.value) })}
                className="h-1.5 w-full accent-zinc-200"
              />
            </label>
            <label className="mt-2 block">
              <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-mono-2/70">
                Scale ({controls.scale.toFixed(2)}x)
              </span>
              <input
                type="range"
                min={0.7}
                max={1.3}
                step={0.01}
                value={controls.scale}
                onChange={(event) => onChange({ scale: Number(event.target.value) })}
                className="h-1.5 w-full accent-zinc-200"
              />
            </label>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center justify-center border border-white/20 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-mono-2 hover:border-white/45 hover:text-white"
            >
              {copyStatus === "copied"
                ? "Copied"
                : copyStatus === "failed"
                  ? "Copy failed"
                  : "Lock in + copy"}
            </button>
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center justify-center border border-white/20 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-mono-2 hover:border-white/45 hover:text-white"
            >
              Reset
            </button>
          </div>

          <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.1em] text-mono-2/60">
            Defaults: {defaults.offsetX}px / {defaults.offsetY}px / {defaults.scale.toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
}
