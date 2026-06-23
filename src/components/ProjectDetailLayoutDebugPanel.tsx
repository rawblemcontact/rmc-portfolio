import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";

export type ProjectDetailLayoutDebugValues = {
  offsetX: number;
  offsetY: number;
  scale: number;
  widthScale: number;
  heightScale: number;
};

export const PROJECT_DETAIL_LAYOUT_DEBUG_DEFAULTS: ProjectDetailLayoutDebugValues = {
  offsetX: 0,
  offsetY: 0,
  scale: 1,
  widthScale: 1,
  heightScale: 1,
};

/** Locked desktop layout shared by video-style project details (Jun 2026). */
export const PROJECT_VIDEO_STYLE_DETAIL_LAYOUT_DEFAULTS: ProjectDetailLayoutDebugValues = {
  offsetX: 0,
  offsetY: 8,
  scale: 0.94,
  widthScale: 1,
  heightScale: 0.95,
};

/** Locked desktop VISUAL DESIGN layout (Jun 2026). */
export const PROJECT_VISUAL_DESIGN_DETAIL_LAYOUT_DEFAULTS: ProjectDetailLayoutDebugValues = {
  offsetX: 0,
  offsetY: 118,
  scale: 0.86,
  widthScale: 1,
  heightScale: 0.98,
};

const PROJECT_DETAIL_LAYOUT_LOCKED_DEFAULTS_BY_PROJECT: Partial<
  Record<string, ProjectDetailLayoutDebugValues>
> = {
  "project-visual-design": PROJECT_VISUAL_DESIGN_DETAIL_LAYOUT_DEFAULTS,
  "project-video-editing": PROJECT_VIDEO_STYLE_DETAIL_LAYOUT_DEFAULTS,
  "project-interactive-media": PROJECT_VIDEO_STYLE_DETAIL_LAYOUT_DEFAULTS,
  "project-slaywire": PROJECT_VIDEO_STYLE_DETAIL_LAYOUT_DEFAULTS,
};

export function projectDetailLayoutDefaultsForProject(
  projectId: string,
): ProjectDetailLayoutDebugValues {
  return PROJECT_DETAIL_LAYOUT_LOCKED_DEFAULTS_BY_PROJECT[projectId] ?? PROJECT_DETAIL_LAYOUT_DEBUG_DEFAULTS;
}

export function projectDetailLayoutHasLockedDefaults(projectId: string) {
  return projectId in PROJECT_DETAIL_LAYOUT_LOCKED_DEFAULTS_BY_PROJECT;
}

/** Crisp project-detail tuning: zoom handles size so text/media do not blur from transform scaling. */
export function buildProjectDetailLayoutStyle(
  values: ProjectDetailLayoutDebugValues,
): CSSProperties {
  const zoom = values.scale * values.heightScale;
  const widthPercent =
    values.heightScale !== 0
      ? (values.widthScale / values.heightScale) * 100
      : values.widthScale * 100;

  return {
    transform: `translate(${values.offsetX}px, ${values.offsetY}px)`,
    transformOrigin: "top center",
    zoom,
    width: `${widthPercent}%`,
    maxWidth: "none",
  };
}

function defaultProjectDetailDebugPanelPosition() {
  if (typeof window === "undefined") return { x: 12, y: 12 };
  return {
    x: Math.max(12, window.innerWidth - 360 - 12),
    y: 12,
  };
}

type ProjectDetailLayoutDebugPanelProps = {
  projectLabel: string;
  values: ProjectDetailLayoutDebugValues;
  defaults: ProjectDetailLayoutDebugValues;
  onChange: (patch: Partial<ProjectDetailLayoutDebugValues>) => void;
  onSave: () => void;
  onReset: () => void;
};

export function ProjectDetailLayoutDebugPanel({
  projectLabel,
  values,
  defaults,
  onChange,
  onSave,
  onReset,
}: ProjectDetailLayoutDebugPanelProps) {
  const [open, setOpen] = useState(true);
  const [saveState, setSaveState] = useState<"idle" | "saved">("idle");
  const [panelPosition, setPanelPosition] = useState(defaultProjectDetailDebugPanelPosition);
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
          <span className="truncate">Project detail tuning // {projectLabel}</span>
        </div>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-[29px] w-[29px] shrink-0 items-center justify-center rounded-sm border border-white/20 bg-black/65 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-white/90 transition-colors hover:border-white/35 hover:bg-black/80"
          aria-label={open ? "Collapse debug controls" : "Expand debug controls"}
        >
          {open ? "-" : "+"}
        </button>
      </div>

      {open && (
        <div className="mt-2 space-y-3">
          <label className="block">
            <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-mono-2/80">
              X ({values.offsetX}px)
            </span>
            <input
              type="range"
              min={-260}
              max={260}
              step={1}
              value={values.offsetX}
              onChange={(event) => onChange({ offsetX: Number(event.target.value) })}
              className="h-1.5 w-full accent-zinc-200"
            />
          </label>

          <label className="block">
            <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-mono-2/80">
              Y ({values.offsetY}px)
            </span>
            <input
              type="range"
              min={-260}
              max={260}
              step={1}
              value={values.offsetY}
              onChange={(event) => onChange({ offsetY: Number(event.target.value) })}
              className="h-1.5 w-full accent-zinc-200"
            />
          </label>

          <label className="block">
            <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-mono-2/80">
              Scale ({values.scale.toFixed(2)}x)
            </span>
            <input
              type="range"
              min={0.7}
              max={1.3}
              step={0.01}
              value={values.scale}
              onChange={(event) => onChange({ scale: Number(event.target.value) })}
              className="h-1.5 w-full accent-zinc-200"
            />
          </label>

          <label className="block">
            <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-mono-2/80">
              Width ({values.widthScale.toFixed(2)}x)
            </span>
            <input
              type="range"
              min={0.7}
              max={1.3}
              step={0.01}
              value={values.widthScale}
              onChange={(event) => onChange({ widthScale: Number(event.target.value) })}
              className="h-1.5 w-full accent-zinc-200"
            />
          </label>

          <label className="block">
            <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-mono-2/80">
              Height ({values.heightScale.toFixed(2)}x)
            </span>
            <input
              type="range"
              min={0.7}
              max={1.3}
              step={0.01}
              value={values.heightScale}
              onChange={(event) => onChange({ heightScale: Number(event.target.value) })}
              className="h-1.5 w-full accent-zinc-200"
            />
          </label>

          <pre className="max-h-24 overflow-auto rounded-sm border border-white/10 bg-black/70 p-2 font-mono text-[10px] leading-relaxed text-mono-2/80">
{`offsetX: ${values.offsetX}
offsetY: ${values.offsetY}
scale: ${values.scale.toFixed(2)}
widthScale: ${values.widthScale.toFixed(2)}
heightScale: ${values.heightScale.toFixed(2)}`}
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
            Defaults: X {defaults.offsetX}px / Y {defaults.offsetY}px / S{" "}
            {defaults.scale.toFixed(2)} / W {defaults.widthScale.toFixed(2)} / H{" "}
            {defaults.heightScale.toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
}
