import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Dev-only draggable horizontal/vertical ruler overlay (cyan Y, magenta X).
 * Re-enable: set `SHOW_DEBUG_RULER_TOOL = true` in `src/App.tsx`.
 */

type DragMode = "cross" | "horizontal" | "vertical" | null;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function DebugRulerTool() {
  const [enabled, setEnabled] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);
  const [showHorizontal, setShowHorizontal] = useState(true);
  const [showVertical, setShowVertical] = useState(true);
  const [position, setPosition] = useState(() => ({
    x: Math.round(window.innerWidth / 2),
    y: Math.round(window.innerHeight / 2),
  }));
  const dragModeRef = useRef<DragMode>(null);

  const handlePointerMove = useCallback((event: PointerEvent) => {
    const mode = dragModeRef.current;
    if (!mode) return;

    if (mode === "cross") {
      setPosition({
        x: clamp(Math.round(event.clientX), 0, window.innerWidth),
        y: clamp(Math.round(event.clientY), 0, window.innerHeight),
      });
      return;
    }

    if (mode === "horizontal") {
      setPosition((prev) => ({
        ...prev,
        y: clamp(Math.round(event.clientY), 0, window.innerHeight),
      }));
      return;
    }

    setPosition((prev) => ({
      ...prev,
      x: clamp(Math.round(event.clientX), 0, window.innerWidth),
    }));
  }, []);

  const stopDragging = useCallback(() => {
    dragModeRef.current = null;
  }, []);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopDragging);
    window.addEventListener("pointercancel", stopDragging);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopDragging);
      window.removeEventListener("pointercancel", stopDragging);
    };
  }, [enabled, handlePointerMove, stopDragging]);

  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => ({
        x: clamp(prev.x, 0, window.innerWidth),
        y: clamp(prev.y, 0, window.innerHeight),
      }));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const startDrag = (mode: DragMode) => (event: React.PointerEvent) => {
    event.preventDefault();
    dragModeRef.current = mode;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const centerRulers = () => {
    setPosition({
      x: Math.round(window.innerWidth / 2),
      y: Math.round(window.innerHeight / 2),
    });
  };

  return (
    <>
      <div className="fixed z-[130] bottom-[max(0.75rem,env(safe-area-inset-bottom,0px))] left-[max(0.75rem,env(safe-area-inset-left,0px))]">
        <button
          type="button"
          onClick={() => setEnabled((value) => !value)}
          className="rounded-sm border border-cyan-400/40 bg-black/85 px-2.5 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-cyan-200 shadow-[0_10px_28px_rgba(0,0,0,0.45)] backdrop-blur-sm hover:border-cyan-300/70 hover:text-white"
        >
          {enabled ? "Ruler on" : "Ruler off"}
        </button>

        {enabled && (
          <div className="mt-2 w-[min(92vw,16rem)] rounded-md border border-white/20 bg-black/85 p-2.5 text-white shadow-[0_14px_38px_rgba(0,0,0,0.45)] backdrop-blur-sm">
            <button
              type="button"
              onClick={() => setPanelOpen((value) => !value)}
              className="flex w-full items-center justify-between rounded-sm border border-white/20 bg-black/65 px-2 py-1.5 text-left font-mono text-[0.62rem] uppercase tracking-[0.14em] text-white/90"
            >
              <span>H / V ruler</span>
              <span aria-hidden>{panelOpen ? "−" : "+"}</span>
            </button>

            {panelOpen && (
              <div className="mt-2 space-y-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-mono-2/80">
                  X {position.x}px · Y {position.y}px
                </p>
                <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-mono-2/80">
                  <input
                    type="checkbox"
                    checked={showHorizontal}
                    onChange={(event) => setShowHorizontal(event.target.checked)}
                    className="accent-cyan-300"
                  />
                  Horizontal
                </label>
                <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-mono-2/80">
                  <input
                    type="checkbox"
                    checked={showVertical}
                    onChange={(event) => setShowVertical(event.target.checked)}
                    className="accent-fuchsia-300"
                  />
                  Vertical
                </label>
                <p className="font-mono text-[9px] leading-relaxed text-mono-2/60">
                  Drag the crosshair, cyan line (Y), or magenta line (X).
                </p>
                <button
                  type="button"
                  onClick={centerRulers}
                  className="inline-flex items-center justify-center border border-white/20 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-mono-2 hover:border-white/45 hover:text-white"
                >
                  Center
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {enabled && (
        <div className="pointer-events-none fixed inset-0 z-[125]">
          {showHorizontal && (
            <div
              className="pointer-events-auto absolute left-0 right-0 h-3 -translate-y-1/2 cursor-ns-resize"
              style={{ top: position.y }}
              onPointerDown={startDrag("horizontal")}
            >
              <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-cyan-400/90 shadow-[0_0_8px_rgba(34,211,238,0.55)]" />
              <span className="absolute left-2 top-1/2 -translate-y-1/2 rounded-sm bg-black/75 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-cyan-200">
                Y {position.y}
              </span>
            </div>
          )}

          {showVertical && (
            <div
              className="pointer-events-auto absolute bottom-0 top-0 w-3 -translate-x-1/2 cursor-ew-resize"
              style={{ left: position.x }}
              onPointerDown={startDrag("vertical")}
            >
              <div className="absolute bottom-0 top-0 left-1/2 w-px -translate-x-1/2 bg-fuchsia-400/90 shadow-[0_0_8px_rgba(232,121,249,0.55)]" />
              <span className="absolute left-3 top-2 rounded-sm bg-black/75 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-fuchsia-200">
                X {position.x}
              </span>
            </div>
          )}

          {showHorizontal && showVertical && (
            <button
              type="button"
              aria-label={`Ruler crosshair at ${position.x} by ${position.y}`}
              className="pointer-events-auto absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/80 bg-black/80 shadow-[0_0_0_2px_rgba(255,255,255,0.15)] cursor-move"
              style={{ left: position.x, top: position.y }}
              onPointerDown={startDrag("cross")}
            />
          )}
        </div>
      )}
    </>
  );
}
