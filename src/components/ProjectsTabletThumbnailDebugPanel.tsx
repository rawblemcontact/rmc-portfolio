import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";

export const PROJECTS_TABLET_THUMBNAIL_IDS = [
  "project-visual-design",
  "project-video-editing",
  "project-interactive-media",
  "project-slaywire",
] as const;

export type ProjectsTabletThumbnailId =
  (typeof PROJECTS_TABLET_THUMBNAIL_IDS)[number];

/** Crop of full source media — maps to PROJECT_CARDS `focalPoint` + `zoom`. */
export type ProjectsTabletThumbnailControl = {
  focalX: number;
  focalY: number;
  zoom: number;
};

export type ProjectsTabletThumbnailDebugValues = Record<
  ProjectsTabletThumbnailId,
  ProjectsTabletThumbnailControl
>;

const STORAGE_KEY = "portfolio.debug.projectsTabletThumbnails.v2";

export const PROJECTS_TABLET_THUMBNAIL_LABELS: Record<
  ProjectsTabletThumbnailId,
  string
> = {
  "project-visual-design": "Visual Design",
  "project-video-editing": "Video Editing",
  "project-interactive-media": "Interactive Media",
  "project-slaywire": "Slaywire",
};

const DEFAULT_CONTROL: ProjectsTabletThumbnailControl = {
  focalX: 50,
  focalY: 50,
  zoom: 1,
};

export const PROJECTS_TABLET_THUMBNAIL_DEFAULTS: ProjectsTabletThumbnailDebugValues =
  {
    "project-visual-design": { ...DEFAULT_CONTROL },
    "project-video-editing": { ...DEFAULT_CONTROL },
    "project-interactive-media": { ...DEFAULT_CONTROL },
    "project-slaywire": { ...DEFAULT_CONTROL },
  };

function sanitizeNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : fallback;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function parseProjectsTabletFocalPoint(value?: string): {
  focalX: number;
  focalY: number;
} {
  if (!value) return { focalX: 50, focalY: 50 };
  const [xRaw, yRaw] = value.split(" ");
  const x = Number.parseFloat((xRaw ?? "50").replace("%", ""));
  const y = Number.parseFloat((yRaw ?? "50").replace("%", ""));
  return {
    focalX: Number.isFinite(x) ? clamp(x, 0, 100) : 50,
    focalY: Number.isFinite(y) ? clamp(y, 0, 100) : 50,
  };
}

export function formatProjectsTabletFocalPoint(
  control: Pick<ProjectsTabletThumbnailControl, "focalX" | "focalY">,
) {
  return `${Math.round(control.focalX)}% ${Math.round(control.focalY)}%`;
}

export function seedProjectsTabletThumbnailDefaultsFromCards(
  cards: readonly {
    id: string;
    focalPoint?: string;
    zoom?: number;
  }[],
): ProjectsTabletThumbnailDebugValues {
  const next = { ...PROJECTS_TABLET_THUMBNAIL_DEFAULTS };
  for (const id of PROJECTS_TABLET_THUMBNAIL_IDS) {
    const card = cards.find((entry) => entry.id === id);
    const focal = parseProjectsTabletFocalPoint(card?.focalPoint);
    next[id] = {
      focalX: focal.focalX,
      focalY: focal.focalY,
      zoom: clamp(card?.zoom ?? 1, 0.6, 1.6),
    };
  }
  return next;
}

export function readProjectsTabletThumbnailDebugValues(
  seed?: ProjectsTabletThumbnailDebugValues,
): ProjectsTabletThumbnailDebugValues {
  const defaults = seed ?? PROJECTS_TABLET_THUMBNAIL_DEFAULTS;
  if (typeof window === "undefined") return defaults;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as Partial<
      Record<ProjectsTabletThumbnailId, Partial<ProjectsTabletThumbnailControl>>
    >;

    return Object.fromEntries(
      PROJECTS_TABLET_THUMBNAIL_IDS.map((id) => {
        const candidate = parsed[id];
        const fallback = defaults[id];
        return [
          id,
          {
            focalX: clamp(
              sanitizeNumber(candidate?.focalX, fallback.focalX),
              0,
              100,
            ),
            focalY: clamp(
              sanitizeNumber(candidate?.focalY, fallback.focalY),
              0,
              100,
            ),
            zoom: clamp(
              sanitizeNumber(candidate?.zoom, fallback.zoom),
              0.6,
              1.6,
            ),
          },
        ];
      }),
    ) as ProjectsTabletThumbnailDebugValues;
  } catch {
    return defaults;
  }
}

export function saveProjectsTabletThumbnailDebugValues(
  values: ProjectsTabletThumbnailDebugValues,
) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
}

/**
 * Crop full source via object-position + zoom (matches hero card media tuning).
 */
export function buildProjectsTabletThumbnailStyle(
  control: ProjectsTabletThumbnailControl,
): CSSProperties {
  const focal = formatProjectsTabletFocalPoint(control);
  return {
    objectPosition: focal,
    transform: `scale(${control.zoom})`,
    transformOrigin: focal,
    willChange: "transform",
  };
}

export function buildProjectsTabletThumbnailLockInSnippet(
  values: ProjectsTabletThumbnailDebugValues,
) {
  const rows = PROJECTS_TABLET_THUMBNAIL_IDS.map((id) => {
    const value = values[id];
    return `  // ${PROJECTS_TABLET_THUMBNAIL_LABELS[id]}\n  //   focalPoint: "${formatProjectsTabletFocalPoint(value)}",\n  //   zoom: ${value.zoom.toFixed(2)},`;
  });
  return [
    "// Paste into matching PROJECT_CARDS entries:",
    ...rows,
  ].join("\n");
}

type ProjectsTabletThumbnailDebugPanelProps = {
  values: ProjectsTabletThumbnailDebugValues;
  selectedId: ProjectsTabletThumbnailId;
  onSelectedIdChange: (id: ProjectsTabletThumbnailId) => void;
  onChange: (patch: Partial<ProjectsTabletThumbnailControl>) => void;
  onReset: () => void;
  onLockIn: () => void;
};

export function ProjectsTabletThumbnailDebugPanel({
  values,
  selectedId,
  onSelectedIdChange,
  onChange,
  onReset,
  onLockIn,
}: ProjectsTabletThumbnailDebugPanelProps) {
  const [open, setOpen] = useState(true);
  const [lockState, setLockState] = useState<"idle" | "locked">("idle");
  const [panelPosition, setPanelPosition] = useState(() => ({
    x: typeof window === "undefined" ? 12 : Math.max(8, window.innerWidth - 276),
    y: 72,
  }));
  const dragStateRef = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);
  const selected = values[selectedId];
  const focalString = formatProjectsTabletFocalPoint(selected);

  const clampPosition = useCallback((x: number, y: number) => {
    if (typeof window === "undefined") return { x, y };
    const panelWidthPx = 268;
    const panelHeaderHeightPx = 42;
    return {
      x: Math.min(Math.max(0, x), Math.max(0, window.innerWidth - panelWidthPx)),
      y: Math.min(
        Math.max(0, y),
        Math.max(0, window.innerHeight - panelHeaderHeightPx),
      ),
    };
  }, []);

  const handleDragStart = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.button !== 0) return;
      const next = clampPosition(panelPosition.x, panelPosition.y);
      dragStateRef.current = {
        startX: event.clientX,
        startY: event.clientY,
        originX: next.x,
        originY: next.y,
      };
      event.currentTarget.setPointerCapture(event.pointerId);
      event.preventDefault();
    },
    [clampPosition, panelPosition.x, panelPosition.y],
  );

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const drag = dragStateRef.current;
      if (!drag) return;
      setPanelPosition(
        clampPosition(
          drag.originX + event.clientX - drag.startX,
          drag.originY + event.clientY - drag.startY,
        ),
      );
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

  const handleLockIn = useCallback(() => {
    onLockIn();
    setLockState("locked");
    window.setTimeout(() => setLockState("idle"), 1600);
  }, [onLockIn]);

  return (
    <aside
      aria-label="Projects tablet thumbnail controls"
      className="fixed z-[150] w-[16.75rem] max-w-[calc(100vw-1rem)] overflow-hidden rounded-[7px] border border-white/20 bg-black/90 text-white shadow-[0_18px_52px_rgba(0,0,0,0.58)] backdrop-blur-sm"
      style={{ left: panelPosition.x, top: panelPosition.y }}
    >
      <div className="flex items-center gap-2 border-b border-white/12 p-2">
        <div
          role="button"
          tabIndex={-1}
          onPointerDown={handleDragStart}
          className="min-w-0 flex-1 cursor-move touch-none border border-white/15 bg-white/[0.035] px-2 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-white/85"
        >
          PROJECTS // SOURCE CROP
        </div>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex h-7 w-7 shrink-0 items-center justify-center border border-white/15 font-mono text-xs text-white/80"
          aria-label={open ? "Collapse thumbnail controls" : "Expand thumbnail controls"}
        >
          {open ? "−" : "+"}
        </button>
      </div>

      {open ? (
        <div className="max-h-[calc(100svh-8rem)] space-y-3 overflow-y-auto p-2.5 no-scrollbar">
          <div className="grid grid-cols-2 gap-1">
            {PROJECTS_TABLET_THUMBNAIL_IDS.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => onSelectedIdChange(id)}
                className={`min-w-0 border px-2 py-1.5 text-left font-mono text-[8px] uppercase tracking-[0.08em] ${
                  selectedId === id
                    ? "border-portfolio-yellow/55 bg-portfolio-yellow/10 text-white"
                    : "border-white/12 text-mono-2/65"
                }`}
              >
                {PROJECTS_TABLET_THUMBNAIL_LABELS[id]}
              </button>
            ))}
          </div>

          <DebugRange
            label="Focus X"
            valueLabel={`${Math.round(selected.focalX)}%`}
            min={0}
            max={100}
            step={1}
            value={selected.focalX}
            onChange={(value) => onChange({ focalX: value })}
          />
          <DebugRange
            label="Focus Y"
            valueLabel={`${Math.round(selected.focalY)}%`}
            min={0}
            max={100}
            step={1}
            value={selected.focalY}
            onChange={(value) => onChange({ focalY: value })}
          />
          <DebugRange
            label="Size"
            valueLabel={`${selected.zoom.toFixed(2)}x`}
            min={0.6}
            max={1.6}
            step={0.01}
            value={selected.zoom}
            onChange={(value) => onChange({ zoom: value })}
          />

          <pre className="overflow-x-auto border border-white/10 bg-black/70 p-2 font-mono text-[9px] leading-relaxed text-mono-2/75">
{`focalPoint: "${focalString}"
zoom: ${selected.zoom.toFixed(2)}`}
          </pre>

          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={handleLockIn}
              className="flex-1 border border-portfolio-yellow/45 px-2 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-portfolio-yellow"
            >
              {lockState === "locked" ? "Locked" : "Lock in"}
            </button>
            <button
              type="button"
              onClick={onReset}
              className="border border-white/15 px-2 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-mono-2/75"
            >
              Reset all
            </button>
          </div>

          <p className="font-mono text-[8px] uppercase leading-relaxed tracking-[0.08em] text-mono-2/45">
            Crops full source via object-position. Double-tap grid to close.
          </p>
        </div>
      ) : null}
    </aside>
  );
}

function DebugRange({
  label,
  valueLabel,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string;
  valueLabel: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.11em] text-mono-2/75">
        <span>{label}</span>
        <span className="text-white/90">{valueLabel}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-5 w-full touch-pan-x accent-zinc-100"
      />
    </label>
  );
}
