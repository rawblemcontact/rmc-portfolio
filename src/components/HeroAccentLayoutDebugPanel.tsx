import { useCallback, useState } from "react";

export type HeroAccentLayoutControl = {
  sizePct: number;
  offsetX: number;
  offsetY: number;
};

export type HeroAccentIconKey = "first" | "second" | "third";

const HERO_ACCENT_DEBUG_LABELS: Record<HeroAccentIconKey, string> = {
  first: "SVG 1",
  second: "SVG 2",
  third: "SVG 3",
};

const HERO_ACCENT_ICON_KEYS: HeroAccentIconKey[] = ["first", "second", "third"];

type HeroAccentLayoutDebugPanelProps = {
  controls: Record<HeroAccentIconKey, HeroAccentLayoutControl>;
  defaults: Record<HeroAccentIconKey, HeroAccentLayoutControl>;
  onChange: (iconKey: HeroAccentIconKey, patch: Partial<HeroAccentLayoutControl>) => void;
  onReset: () => void;
};

export function HeroAccentLayoutDebugPanel({
  controls,
  defaults,
  onChange,
  onReset,
}: HeroAccentLayoutDebugPanelProps) {
  const [open, setOpen] = useState(true);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");

  const lockInPayload = HERO_ACCENT_ICON_KEYS.map((key) => ({
    key,
    label: HERO_ACCENT_DEBUG_LABELS[key],
    ...controls[key],
  }));

  const lockInCode = [
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
    <div className="fixed z-[120] w-[min(94vw,24rem)] rounded-md border border-white/20 bg-black/85 p-2.5 text-white shadow-[0_14px_38px_rgba(0,0,0,0.45)] backdrop-blur-sm top-[max(0.75rem,env(safe-area-inset-top,0px))] right-[max(0.75rem,env(safe-area-inset-right,0px))]">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between rounded-sm border border-white/20 bg-black/65 px-2.5 py-1.5 text-left font-mono text-[0.66rem] uppercase tracking-[0.16em] text-white/90 transition-colors hover:border-white/35 hover:bg-black/80"
      >
        <span>Hero icon size / position</span>
        <span aria-hidden>{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="mt-2 space-y-3">
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
            Defaults:{" "}
            {HERO_ACCENT_ICON_KEYS.map(
              (key) =>
                `${HERO_ACCENT_DEBUG_LABELS[key]} ${defaults[key].sizePct}/${defaults[key].offsetX}/${defaults[key].offsetY}`,
            ).join(" · ")}
          </p>
        </div>
      )}
    </div>
  );
}
