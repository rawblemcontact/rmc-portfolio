import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
/** Legacy build — same worker path as PdfJsDocumentView (Map polyfills for older WebKit). */
import workerUrl from "pdfjs-dist/legacy/build/pdf.worker.min.mjs?url";

/** Default height is fixed; width can grow (e.g. to match active tab). */
const DEFAULT_W = 120;
const FIXED_H = 216;
/** When false, skip PDF.js raster and show the FileText placeholder on all viewports. */
const FEATURED_WRITING_PDF_PREVIEW_ENABLED = false;

const dataUrlByKey = new Map<string, string>();

function cacheKey(pdfSrc: string, widthPx: number, dpr: number) {
  return `${pdfSrc}\0${Math.round(widthPx)}\0${dpr.toFixed(2)}`;
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
 * First-page raster preview for FEATURED WRITING.
 * Renders at cover scale × device DPR, then crops to the box (sharp object-cover / object-top).
 * Results are cached per PDF URL + width + DPR.
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
  const dpr =
    typeof window !== "undefined"
      ? Math.min(Math.max(window.devicePixelRatio || 1, 1), 3)
      : 1;
  const key = cacheKey(pdfSrc, layoutW, dpr);

  const [dataUrl, setDataUrl] = useState<string | null>(
    () => dataUrlByKey.get(key) ?? null,
  );
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!FEATURED_WRITING_PDF_PREVIEW_ENABLED || !pdfSrc.trim()) {
      setDataUrl(null);
      setError(!FEATURED_WRITING_PDF_PREVIEW_ENABLED && Boolean(pdfSrc.trim()));
      return;
    }

    const cached = dataUrlByKey.get(key);
    if (cached) {
      setDataUrl(cached);
      setError(false);
      return;
    }

    let cancelled = false;
    let loadingTask: { destroy: () => Promise<unknown> } | null = null;
    setDataUrl(null);
    setError(false);

    void (async () => {
      try {
        const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
        pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
        loadingTask = pdfjs.getDocument({ url: pdfSrc });
        const doc = await loadingTask.promise;
        if (cancelled) {
          await doc.destroy().catch(() => {});
          return;
        }
        const page = await doc.getPage(1);
        const base = page.getViewport({ scale: 1 });
        /** Cover the preview box at DPR, then crop — no contain→object-cover upscale blur. */
        const cover = Math.max(layoutW / base.width, layoutH / base.height);
        const viewport = page.getViewport({ scale: cover * dpr });

        const fullCanvas = document.createElement("canvas");
        fullCanvas.width = Math.max(1, Math.floor(viewport.width));
        fullCanvas.height = Math.max(1, Math.floor(viewport.height));
        const fullCtx = fullCanvas.getContext("2d", { alpha: false });
        if (!fullCtx) throw new Error("canvas");
        fullCtx.fillStyle = "#ffffff";
        fullCtx.fillRect(0, 0, fullCanvas.width, fullCanvas.height);
        await page.render({
          canvasContext: fullCtx,
          viewport,
          canvas: fullCanvas,
        }).promise;
        await doc.destroy().catch(() => {});

        if (cancelled) return;

        const outW = Math.max(1, Math.floor(layoutW * dpr));
        const outH = Math.max(1, Math.floor(layoutH * dpr));
        const out = document.createElement("canvas");
        out.width = outW;
        out.height = outH;
        const outCtx = out.getContext("2d", { alpha: false });
        if (!outCtx) throw new Error("canvas");
        const sx = Math.max(0, Math.floor((fullCanvas.width - outW) / 2));
        const sy = 0;
        outCtx.drawImage(fullCanvas, sx, sy, outW, outH, 0, 0, outW, outH);

        const url = out.toDataURL("image/jpeg", 0.92);
        dataUrlByKey.set(key, url);
        setDataUrl(url);
      } catch {
        if (!cancelled) setError(true);
      }
    })();

    return () => {
      cancelled = true;
      void loadingTask?.destroy().catch(() => {});
    };
  }, [pdfSrc, key, layoutW, layoutH, dpr]);

  const isBlank = !pdfSrc.trim();
  const forcePlaceholder =
    !FEATURED_WRITING_PDF_PREVIEW_ENABLED && !isBlank;
  const showImg = Boolean(
    !forcePlaceholder && !isBlank && dataUrl && !error,
  );
  const showLoadingShell =
    !forcePlaceholder && !isBlank && !error && !showImg;
  const showPlaceholder = forcePlaceholder || error;

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
      role={interactive && !isBlank ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-busy={showLoadingShell}
      aria-label={interactive && !isBlank ? "Open PDF in viewer" : undefined}
      onClick={interactive && !isBlank ? () => onActivate() : undefined}
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

      {showPlaceholder ? (
        <div className="absolute inset-0 z-[3] flex flex-col items-center justify-center gap-1.5 bg-black/50 px-2 text-center">
          <FileText className="h-7 w-7 text-white/25" strokeWidth={1.25} aria-hidden />
          <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-white/35">
            Preview
          </span>
        </div>
      ) : null}
    </div>
  );
}
