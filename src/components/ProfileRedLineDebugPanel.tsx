import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

/** `PROFILE_ACCENT_SOFT` in Home.tsx — `color-mix(..., 56%, rgb(170 170 170))`. */
export const PROFILE_RED_LINE_BASE_RED_MIX = 56;
const PROFILE_RED_LINE_GRAY_MIX = "rgb(170 170 170)";

export type ProfileRedLineDebugValues = {
  /** 0–100 — palette-red % in color-mix (56 = production PROFILE_ACCENT_SOFT). */
  lineRedMix: number;
  /** 0–100 — line opacity. */
  lineOpacity: number;
  /** 50–300 — CSS brightness on the line (boost past 100% to recover from shadow dim). */
  lineBrightness: number;
  /** 0–300 — CSS saturate on the line. */
  lineSaturation: number;
  /** 50–200 — CSS contrast on the line. */
  lineContrast: number;
  /** 0–50 — z-index on the red line span. */
  lineZIndex: number;
  /** 0–100 — metadata pill drop-shadow strength (bleeds over the line). */
  pillShadowStrength: number;
  /** 0–8px — metadata pill backdrop blur below the line. */
  pillBackdropBlur: number;
};

export const PROFILE_RED_LINE_DEBUG_DEFAULTS: ProfileRedLineDebugValues = {
  lineRedMix: PROFILE_RED_LINE_BASE_RED_MIX,
  lineOpacity: 100,
  lineBrightness: 100,
  lineSaturation: 100,
  lineContrast: 100,
  lineZIndex: 0,
  pillShadowStrength: 100,
  pillBackdropBlur: 2,
};

type ProfileRedLineDebugPanelProps = {
  values: ProfileRedLineDebugValues;
  onChange: (patch: Partial<ProfileRedLineDebugValues>) => void;
  onReset: () => void;
};

export function buildProfileRedLineSpanDebugStyle(values: ProfileRedLineDebugValues) {
  return {
    backgroundColor: `color-mix(in srgb, var(--palette-red) ${values.lineRedMix}%, ${PROFILE_RED_LINE_GRAY_MIX})`,
    opacity: values.lineOpacity / 100,
    filter: [
      `brightness(${values.lineBrightness / 100})`,
      `saturate(${values.lineSaturation / 100})`,
      `contrast(${values.lineContrast / 100})`,
    ].join(" "),
    zIndex: values.lineZIndex,
  };
}

export function buildProfileRedLinePillDebugStyle(values: ProfileRedLineDebugValues) {
  const shadowAlpha = 0.9 * (values.pillShadowStrength / 100);
  return {
    boxShadow: `0 18px 48px -28px rgba(0, 0, 0, ${shadowAlpha}), inset 1px 0 0 rgba(255, 255, 255, 0.025), inset -1px 0 0 rgba(255, 255, 255, 0.025)`,
    WebkitBackdropFilter: `blur(${values.pillBackdropBlur}px)`,
    backdropFilter: `blur(${values.pillBackdropBlur}px)`,
  };
}

export function formatProfileRedLineDebugLockIn(values: ProfileRedLineDebugValues) {
  return [
    "PROFILE_RED_LINE_DEBUG_DEFAULTS = {",
    `  lineRedMix: ${values.lineRedMix},`,
    `  lineOpacity: ${values.lineOpacity},`,
    `  lineBrightness: ${values.lineBrightness},`,
    `  lineSaturation: ${values.lineSaturation},`,
    `  lineContrast: ${values.lineContrast},`,
    `  lineZIndex: ${values.lineZIndex},`,
    `  pillShadowStrength: ${values.pillShadowStrength},`,
    `  pillBackdropBlur: ${values.pillBackdropBlur},`,
    "};",
  ].join("\n");
}

export function ProfileRedLineDebugPanel({ values, onChange, onReset }: ProfileRedLineDebugPanelProps) {
  const [open, setOpen] = useState(true);
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");
  const [panelPosition, setPanelPosition] = useState({ x: 12, y: 420 });
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

  const handleCopy = useCallback(() => {
    const snippet = formatProfileRedLineDebugLockIn(values);
    console.info("[Profile Red Line Lock In]\n" + snippet);
    navigator.clipboard?.writeText(snippet).catch(() => {
      // Clipboard writes can fail in some browser contexts.
    });
    setCopyState("copied");
    window.setTimeout(() => setCopyState("idle"), 1400);
  }, [values]);

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
      className="fixed z-[121] hidden w-[min(93vw,22.5rem)] rounded-md border border-white/20 bg-black/85 p-2.5 text-white shadow-[0_14px_38px_rgba(0,0,0,0.45)] backdrop-blur-sm lg:block"
      style={{ left: `${panelPosition.x}px`, top: `${panelPosition.y}px` }}
    >
      <div className="mb-2 flex items-center gap-2">
        <div
          role="button"
          tabIndex={-1}
          onPointerDown={handleDragStart}
          className="flex min-w-0 flex-1 cursor-move items-center rounded-sm border border-white/20 bg-black/65 px-2.5 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-white/90"
        >
          <span className="truncate">Profile red line color / shadow</span>
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
          <p className="font-mono text-[10px] leading-relaxed tracking-[0.08em] text-mono-2/75">
            Match the line to SUMMARY red: start with pill shadow at 0%, then tune red mix / saturation /
            brightness until the line matches.
          </p>

          <label className="block">
            <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-mono-2/80">
              Red mix ({values.lineRedMix}% — production {PROFILE_RED_LINE_BASE_RED_MIX}%)
            </span>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={values.lineRedMix}
              onChange={(event) => onChange({ lineRedMix: Number(event.target.value) })}
              className="h-1.5 w-full accent-zinc-200"
            />
          </label>

          <label className="block">
            <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-mono-2/80">
              Line saturation ({values.lineSaturation}%)
            </span>
            <input
              type="range"
              min={0}
              max={300}
              step={1}
              value={values.lineSaturation}
              onChange={(event) => onChange({ lineSaturation: Number(event.target.value) })}
              className="h-1.5 w-full accent-zinc-200"
            />
          </label>

          <label className="block">
            <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-mono-2/80">
              Line brightness ({values.lineBrightness}%)
            </span>
            <input
              type="range"
              min={50}
              max={300}
              step={1}
              value={values.lineBrightness}
              onChange={(event) => onChange({ lineBrightness: Number(event.target.value) })}
              className="h-1.5 w-full accent-zinc-200"
            />
          </label>

          <label className="block">
            <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-mono-2/80">
              Line contrast ({values.lineContrast}%)
            </span>
            <input
              type="range"
              min={50}
              max={200}
              step={1}
              value={values.lineContrast}
              onChange={(event) => onChange({ lineContrast: Number(event.target.value) })}
              className="h-1.5 w-full accent-zinc-200"
            />
          </label>

          <label className="block">
            <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-mono-2/80">
              Line opacity ({values.lineOpacity}%)
            </span>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={values.lineOpacity}
              onChange={(event) => onChange({ lineOpacity: Number(event.target.value) })}
              className="h-1.5 w-full accent-zinc-200"
            />
          </label>

          <label className="block">
            <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-mono-2/80">
              Line z-index ({values.lineZIndex})
            </span>
            <input
              type="range"
              min={0}
              max={50}
              step={1}
              value={values.lineZIndex}
              onChange={(event) => onChange({ lineZIndex: Number(event.target.value) })}
              className="h-1.5 w-full accent-zinc-200"
            />
          </label>

          <label className="block">
            <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-mono-2/80">
              Pill drop shadow ({values.pillShadowStrength}%)
            </span>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={values.pillShadowStrength}
              onChange={(event) => onChange({ pillShadowStrength: Number(event.target.value) })}
              className="h-1.5 w-full accent-zinc-200"
            />
          </label>

          <label className="block">
            <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-mono-2/80">
              Pill backdrop blur ({values.pillBackdropBlur}px)
            </span>
            <input
              type="range"
              min={0}
              max={8}
              step={0.5}
              value={values.pillBackdropBlur}
              onChange={(event) => onChange({ pillBackdropBlur: Number(event.target.value) })}
              className="h-1.5 w-full accent-zinc-200"
            />
          </label>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onReset}
              className="flex-1 rounded-sm border border-white/20 bg-black/65 px-2.5 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-white/90 transition-colors hover:border-white/35 hover:bg-black/80"
            >
              Reset defaults
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="flex-1 rounded-sm border border-white/20 bg-black/65 px-2.5 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-white/90 transition-colors hover:border-white/35 hover:bg-black/80"
            >
              {copyState === "copied" ? "Copied" : "Copy values"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
