import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";

export type HeroAccentLayoutControl = {
  sizePct: number;
  offsetX: number;
  offsetY: number;
};

export type HeroGlobalLayoutControl = {
  offsetX: number;
  offsetY: number;
  scale: number;
  widthScale: number;
  heightScale: number;
};

export type HeroControlledViewport = "desktop" | "ipad" | "desktop+ipad";

export const HERO_GLOBAL_LAYOUT_DEFAULTS: HeroGlobalLayoutControl = {
  offsetX: 0,
  offsetY: 0,
  scale: 1,
  widthScale: 1,
  heightScale: 1,
};

export const HERO_VIDEO_GLOBAL_LAYOUT_DEFAULTS: HeroGlobalLayoutControl = {
  offsetX: 0,
  offsetY: 0,
  scale: 1,
  widthScale: 1,
  heightScale: 0.9,
};

export const HERO_MAIN_GLOBAL_LAYOUT_DEFAULTS: HeroGlobalLayoutControl = {
  offsetX: 55,
  // Keep container-level Y neutral; name-lockup nudges should be handled in
  // the hero text/SVG optical offsets so the whole hero stack doesn't drift.
  offsetY: 0,
  scale: 0.95,
  widthScale: 1,
  heightScale: 1,
};

export const HERO_PORTFOLIO_BUTTON_GLOBAL_LAYOUT_DEFAULTS: HeroGlobalLayoutControl = {
  offsetX: 39,
  offsetY: 3,
  scale: 0.94,
  widthScale: 1,
  heightScale: 0.91,
};

/** Desktop rob-hero SVG lockup — additive to auto video-edge align X. */
export const HERO_SVG_LOCKUP_LAYOUT_DEFAULTS: HeroGlobalLayoutControl = {
  offsetX: 33,
  offsetY: -44,
  scale: 1,
  widthScale: 0.95,
  heightScale: 1,
};

/** Crisp zoom + width/height for hero debug targets (desktop). */
export function buildHeroGlobalLayoutStyle(
  control: HeroGlobalLayoutControl,
  transformOrigin: "left top" | "center center" = "left top",
): CSSProperties {
  const zoom = control.scale * control.heightScale;
  const style: CSSProperties = {
    transform: `translate(${control.offsetX}px, ${control.offsetY}px)`,
    transformOrigin,
    zoom,
  };

  if (control.widthScale !== 1 || control.heightScale !== 1) {
    const widthPercent =
      control.heightScale !== 0 ? (control.widthScale / control.heightScale) * 100 : control.widthScale * 100;
    style.width = `${widthPercent}%`;
  }

  return style;
}

function HeroGlobalLayoutControlsSection({
  title,
  controls,
  onChange,
}: {
  title: string;
  controls: HeroGlobalLayoutControl;
  onChange: (patch: Partial<HeroGlobalLayoutControl>) => void;
}) {
  return (
    <div className="hidden rounded-sm border border-white/10 bg-black/50 p-2 lg:block">
      <p className="mb-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-mono-2/90">{title}</p>
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
      <label className="mt-2 block">
        <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-mono-2/70">
          Width ({controls.widthScale.toFixed(2)}x)
        </span>
        <input
          type="range"
          min={0.7}
          max={1.3}
          step={0.01}
          value={controls.widthScale}
          onChange={(event) => onChange({ widthScale: Number(event.target.value) })}
          className="h-1.5 w-full accent-zinc-200"
        />
      </label>
      <label className="mt-2 block">
        <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-mono-2/70">
          Height ({controls.heightScale.toFixed(2)}x)
        </span>
        <input
          type="range"
          min={0.7}
          max={1.3}
          step={0.01}
          value={controls.heightScale}
          onChange={(event) => onChange({ heightScale: Number(event.target.value) })}
          className="h-1.5 w-full accent-zinc-200"
        />
      </label>
    </div>
  );
}

function formatGlobalDefaults(defaults: HeroGlobalLayoutControl) {
  return `${defaults.offsetX}px / ${defaults.offsetY}px / ${defaults.scale.toFixed(2)} / ${defaults.widthScale.toFixed(2)} / ${defaults.heightScale.toFixed(2)}`;
}

export type HeroAccentIconKey = "first" | "second" | "third";

const HERO_ACCENT_DEBUG_LABELS: Record<HeroAccentIconKey, string> = {
  first: "SVG 1",
  second: "SVG 2",
  third: "SVG 3",
};

const HERO_ACCENT_ICON_KEYS: HeroAccentIconKey[] = ["first", "second", "third"];
const HERO_DEBUG_PANEL_WIDTH_PX = 384;

function defaultHeroDebugPanelPosition() {
  if (typeof window === "undefined") return { x: 12, y: 12 };
  return {
    x: Math.max(12, window.innerWidth - HERO_DEBUG_PANEL_WIDTH_PX - 12),
    y: 12,
  };
}

type HeroAccentLayoutDebugPanelProps = {
  controls: Record<HeroAccentIconKey, HeroAccentLayoutControl>;
  defaults: Record<HeroAccentIconKey, HeroAccentLayoutControl>;
  svgLockupControls: HeroGlobalLayoutControl;
  svgLockupDefaults: HeroGlobalLayoutControl;
  /** Frozen auto-align X (video left edge); debug X is additive. */
  svgAutoAlignX: number;
  videoGlobalControls: HeroGlobalLayoutControl;
  mainGlobalControls: HeroGlobalLayoutControl;
  portfolioButtonGlobalControls: HeroGlobalLayoutControl;
  videoGlobalDefaults: HeroGlobalLayoutControl;
  mainGlobalDefaults: HeroGlobalLayoutControl;
  portfolioButtonGlobalDefaults: HeroGlobalLayoutControl;
  controlledViewport: HeroControlledViewport;
  onControlledViewportChange: (next: HeroControlledViewport) => void;
  onChange: (iconKey: HeroAccentIconKey, patch: Partial<HeroAccentLayoutControl>) => void;
  onSvgLockupChange: (patch: Partial<HeroGlobalLayoutControl>) => void;
  onVideoGlobalChange: (patch: Partial<HeroGlobalLayoutControl>) => void;
  onMainGlobalChange: (patch: Partial<HeroGlobalLayoutControl>) => void;
  onPortfolioButtonGlobalChange: (patch: Partial<HeroGlobalLayoutControl>) => void;
  onReset: () => void;
};

export function HeroAccentLayoutDebugPanel({
  controls,
  defaults,
  svgLockupControls,
  svgLockupDefaults,
  svgAutoAlignX,
  videoGlobalControls,
  mainGlobalControls,
  portfolioButtonGlobalControls,
  videoGlobalDefaults,
  mainGlobalDefaults,
  portfolioButtonGlobalDefaults,
  controlledViewport,
  onControlledViewportChange,
  onChange,
  onSvgLockupChange,
  onVideoGlobalChange,
  onMainGlobalChange,
  onPortfolioButtonGlobalChange,
  onReset,
}: HeroAccentLayoutDebugPanelProps) {
  const [open, setOpen] = useState(true);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");
  const [panelPosition, setPanelPosition] = useState(defaultHeroDebugPanelPosition);
  const dragStateRef = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const clampPosition = useCallback((x: number, y: number) => {
    if (typeof window === "undefined") return { x, y };
    const panelHeightPx = 80;
    const maxX = Math.max(0, window.innerWidth - HERO_DEBUG_PANEL_WIDTH_PX);
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

  const lockInPayload = HERO_ACCENT_ICON_KEYS.map((key) => ({
    key,
    label: HERO_ACCENT_DEBUG_LABELS[key],
    ...controls[key],
  }));

  const lockInCode = [
    `const HERO_CONTROLLED_VIEWPORT = "${controlledViewport}";`,
    "",
    "const HERO_SVG_LOCKUP_LAYOUT = {",
    `  offsetX: ${svgLockupControls.offsetX},`,
    `  offsetY: ${svgLockupControls.offsetY},`,
    `  scale: ${svgLockupControls.scale.toFixed(2)},`,
    `  widthScale: ${svgLockupControls.widthScale.toFixed(2)},`,
    `  heightScale: ${svgLockupControls.heightScale.toFixed(2)},`,
    "};",
    `// autoAlignX (frozen): ${svgAutoAlignX.toFixed(2)}px — debug offsetX is additive`,
    "",
    "const HERO_VIDEO_GLOBAL_LAYOUT = {",
    `  offsetX: ${videoGlobalControls.offsetX},`,
    `  offsetY: ${videoGlobalControls.offsetY},`,
    `  scale: ${videoGlobalControls.scale.toFixed(2)},`,
    `  widthScale: ${videoGlobalControls.widthScale.toFixed(2)},`,
    `  heightScale: ${videoGlobalControls.heightScale.toFixed(2)},`,
    "};",
    "",
    "const HERO_MAIN_GLOBAL_LAYOUT = {",
    `  offsetX: ${mainGlobalControls.offsetX},`,
    `  offsetY: ${mainGlobalControls.offsetY},`,
    `  scale: ${mainGlobalControls.scale.toFixed(2)},`,
    `  widthScale: ${mainGlobalControls.widthScale.toFixed(2)},`,
    `  heightScale: ${mainGlobalControls.heightScale.toFixed(2)},`,
    "};",
    "",
    "const HERO_PORTFOLIO_BUTTON_GLOBAL_LAYOUT = {",
    `  offsetX: ${portfolioButtonGlobalControls.offsetX},`,
    `  offsetY: ${portfolioButtonGlobalControls.offsetY},`,
    `  scale: ${portfolioButtonGlobalControls.scale.toFixed(2)},`,
    `  widthScale: ${portfolioButtonGlobalControls.widthScale.toFixed(2)},`,
    `  heightScale: ${portfolioButtonGlobalControls.heightScale.toFixed(2)},`,
    "};",
    "",
    "const HERO_ACCENT_LAYOUT = {",
    ...HERO_ACCENT_ICON_KEYS.map(
      (key) =>
        `  ${key}: { sizePct: ${controls[key].sizePct}, offsetX: ${controls[key].offsetX}, offsetY: ${controls[key].offsetY} },`,
    ),
    "};",
  ].join("\n");

  const handleCopy = useCallback(async () => {
    const payload = JSON.stringify(lockInPayload, null, 2);
    console.info("[Hero Accent Debug Lock In]", lockInPayload);
    try {
      await navigator.clipboard.writeText(`${lockInCode}\n\n${payload}`);
      setCopyStatus("copied");
      window.setTimeout(() => setCopyStatus("idle"), 1400);
    } catch {
      setCopyStatus("failed");
      window.setTimeout(() => setCopyStatus("idle"), 1400);
    }
  }, [lockInCode, lockInPayload]);

  return (
    <div
      className="fixed z-[120] w-[min(94vw,24rem)] rounded-md border border-white/20 bg-black/85 p-2.5 text-white shadow-[0_14px_38px_rgba(0,0,0,0.45)] backdrop-blur-sm"
      style={{ left: `${panelPosition.x}px`, top: `${panelPosition.y}px` }}
    >
      <div className="mb-2 flex items-center gap-2">
        <div
          role="button"
          tabIndex={-1}
          onPointerDown={handleDragStart}
          className="flex min-w-0 flex-1 cursor-move items-center rounded-sm border border-white/20 bg-black/65 px-2.5 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-white/90"
        >
          <span className="truncate">Hero icon size / position</span>
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
          <div className="space-y-3">
            <div className="rounded-sm border border-white/10 bg-black/50 p-2">
              <p className="mb-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-mono-2/90">
                Controlled viewport
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                {([
                  ["desktop", "Desktop"],
                  ["ipad", "iPad"],
                  ["desktop+ipad", "Both"],
                ] as const).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => onControlledViewportChange(value)}
                    className={`inline-flex items-center justify-center border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors ${
                      controlledViewport === value
                        ? "border-white/55 bg-white/12 text-white"
                        : "border-white/20 bg-black/60 text-mono-2 hover:border-white/35 hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="hidden space-y-1 md:block">
              <HeroGlobalLayoutControlsSection
                title="Rob hero SVG (controlled viewport)"
                controls={svgLockupControls}
                onChange={onSvgLockupChange}
              />
              <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-mono-2/60">
                Auto-align X: {svgAutoAlignX.toFixed(2)}px · total X:{" "}
                {(svgAutoAlignX + svgLockupControls.offsetX).toFixed(2)}px
              </p>
            </div>
            <HeroGlobalLayoutControlsSection
              title="Video card (controlled viewport)"
              controls={videoGlobalControls}
              onChange={onVideoGlobalChange}
            />
            <HeroGlobalLayoutControlsSection
              title="Other content (controlled viewport)"
              controls={mainGlobalControls}
              onChange={onMainGlobalChange}
            />
            <HeroGlobalLayoutControlsSection
              title="Portfolio button (controlled viewport)"
              controls={portfolioButtonGlobalControls}
              onChange={onPortfolioButtonGlobalChange}
            />

          {HERO_ACCENT_ICON_KEYS.map((iconKey) => (
            <div key={iconKey} className="rounded-sm border border-white/10 bg-black/50 p-2">
              <p className="mb-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-mono-2/90">
                {HERO_ACCENT_DEBUG_LABELS[iconKey]}
              </p>
              <label className="block">
                <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-mono-2/70">
                  Size ({controls[iconKey].sizePct}%)
                </span>
                <input
                  type="range"
                  min={40}
                  max={120}
                  step={0.5}
                  value={controls[iconKey].sizePct}
                  onChange={(event) =>
                    onChange(iconKey, { sizePct: Number(event.target.value) })
                  }
                  className="h-1.5 w-full accent-zinc-200"
                />
              </label>
              <label className="mt-2 block">
                <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-mono-2/70">
                  X offset ({controls[iconKey].offsetX}px)
                </span>
                <input
                  type="range"
                  min={-24}
                  max={24}
                  step={1}
                  value={controls[iconKey].offsetX}
                  onChange={(event) =>
                    onChange(iconKey, { offsetX: Number(event.target.value) })
                  }
                  className="h-1.5 w-full accent-zinc-200"
                />
              </label>
              <label className="mt-2 block">
                <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-mono-2/70">
                  Y offset ({controls[iconKey].offsetY}px)
                </span>
                <input
                  type="range"
                  min={-24}
                  max={24}
                  step={1}
                  value={controls[iconKey].offsetY}
                  onChange={(event) =>
                    onChange(iconKey, { offsetY: Number(event.target.value) })
                  }
                  className="h-1.5 w-full accent-zinc-200"
                />
              </label>
            </div>
          ))}

          <pre className="max-h-28 overflow-auto rounded-sm border border-white/10 bg-black/70 p-2 font-mono text-[10px] leading-relaxed text-mono-2/80">
            {lockInCode}
          </pre>

          <div className="flex flex-wrap items-center gap-2">
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

          <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-mono-2/60">
            SVG lockup defaults (desktop): {formatGlobalDefaults(svgLockupDefaults)}
          </p>
          <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-mono-2/60">
            Video defaults (desktop): {formatGlobalDefaults(videoGlobalDefaults)}
          </p>
          <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-mono-2/60">
            Other defaults (desktop): {formatGlobalDefaults(mainGlobalDefaults)}
          </p>
          <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-mono-2/60">
            Portfolio button defaults (desktop): {formatGlobalDefaults(portfolioButtonGlobalDefaults)}
          </p>
          <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-mono-2/60">
            Icon defaults:{" "}
            {HERO_ACCENT_ICON_KEYS.map(
              (key) =>
                `${HERO_ACCENT_DEBUG_LABELS[key]} ${defaults[key].sizePct}/${defaults[key].offsetX}/${defaults[key].offsetY}`,
            ).join(" · ")}
          </p>
          </div>
        </div>
      )}
    </div>
  );
}
