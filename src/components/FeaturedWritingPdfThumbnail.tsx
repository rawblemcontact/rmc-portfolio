import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

/** Default height is fixed; width can grow (e.g. to match active tab). */
const DEFAULT_W = 120;
const FIXED_H = 184;

const dataUrlByKey = new Map<string, string>();

function cacheKey(pdfSrc: string, widthPx: number) {
  return `${pdfSrc}\0${Math.round(widthPx)}`;
}

type Props = {
  pdfSrc: string;
  /** Display / raster width in CSS px (e.g. active tab width). */
  widthPx?: number;
  className?: string;
  /** Opens PDF in the in-app loader (e.g. FEATURED WRITING). */
  onActivate?: () => void;
};

/**
 * First-page raster preview for FEATURED WRITING. Results are cached per PDF URL + width.
 */
export function FeaturedWritingPdfThumbnail({
  pdfSrc,
  widthPx = DEFAULT_W,
  className = "",
  onActivate,
}: Props) {
  /** Wider tabs stretch width only; height stays FIXED_H. */
  const layoutW = Math.max(48, Math.min(widthPx, 720));
  const layoutH = FIXED_H;
  const rasterW = Math.min(layoutW, 520);
  const rasterH = FIXED_H;
  const key = cacheKey(pdfSrc, rasterW);

  const [dataUrl, setDataUrl] = useState<string | null>(
    () => dataUrlByKey.get(key) ?? null,
  );
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!pdfSrc.trim()) {
      setDataUrl(null);
      setError(false);
      return;
    }

    const cached = dataUrlByKey.get(key);
    if (cached) {
      setDataUrl(cached);
      setError(false);
      return;
    }

    let cancelled = false;
    setDataUrl(null);
    setError(false);

    void (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
        const loadingTask = pdfjs.getDocument({ url: pdfSrc });
        const doc = await loadingTask.promise;
        if (cancelled) {
          await doc.destroy().catch(() => {});
          return;
        }
        const page = await doc.getPage(1);
        const base = page.getViewport({ scale: 1 });
        const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);
        const fit = Math.min(rasterW / base.width, rasterH / base.height);
        const viewport = page.getViewport({ scale: fit * dpr });

        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.floor(viewport.width));
        canvas.height = Math.max(1, Math.floor(viewport.height));
        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) throw new Error("canvas");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        await doc.destroy().catch(() => {});

        if (cancelled) return;

        const url = canvas.toDataURL("image/jpeg", 0.84);
        dataUrlByKey.set(key, url);
        setDataUrl(url);
      } catch {
        if (!cancelled) setError(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pdfSrc, key, rasterW, rasterH]);

  const isBlank = !pdfSrc.trim();
  const showImg = Boolean(!isBlank && dataUrl && !error);
  const showLoadingShell = !isBlank && !error && !showImg;

  const interactive = typeof onActivate === "function";

  return (
    <div
      className={[
        "featured-writing-raised relative shrink-0 overflow-hidden rounded-[10px] border-0",
        interactive
          ? "cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-portfolio-yellow/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          : "",
        className,
      ].join(" ")}
      style={{ width: layoutW, height: layoutH, maxWidth: "100%" }}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-busy={showLoadingShell}
      aria-label={interactive ? "Open PDF in viewer" : undefined}
      onClick={interactive ? () => onActivate() : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onActivate();
              }
            }
          : undefined
      }
    >
      {isBlank ? (
        <div className="absolute inset-0 z-0 bg-black/35" aria-hidden />
      ) : null}

      {showLoadingShell ? (
        <div
          className="featured-writing-thumb-loading absolute inset-0 z-0"
          aria-hidden
        />
      ) : null}

      {showImg && dataUrl ? (
        <img
          key={key}
          src={dataUrl}
          alt=""
          className="relative z-[1] h-full w-full object-cover object-top"
          draggable={false}
        />
      ) : null}

      {showImg ? (
        <div
          className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[length:8px_8px] opacity-[0.35]"
          aria-hidden
        />
      ) : null}

      {error ? (
        <div className="absolute inset-0 z-[3] flex flex-col items-center justify-center gap-1.5 bg-black/50 px-2 text-center">
          <FileText className="h-7 w-7 text-white/25" strokeWidth={1.25} aria-hidden />
          <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-white/35">Preview</span>
        </div>
      ) : null}
    </div>
  );
}
