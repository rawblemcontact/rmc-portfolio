import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

/** CSS pixels — fixed footprint so layout does not shift (load uses same box as skeleton). */
const THUMB_W = 120;
const THUMB_H = 156;

const dataUrlBySrc = new Map<string, string>();

type Props = {
  pdfSrc: string;
  className?: string;
};

/**
 * First-page raster preview for FEATURED WRITING. Results are cached per PDF URL.
 */
export function FeaturedWritingPdfThumbnail({ pdfSrc, className = "" }: Props) {
  const [dataUrl, setDataUrl] = useState<string | null>(() => dataUrlBySrc.get(pdfSrc) ?? null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const cached = dataUrlBySrc.get(pdfSrc);
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
        const fit = Math.min(THUMB_W / base.width, THUMB_H / base.height);
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
        dataUrlBySrc.set(pdfSrc, url);
        setDataUrl(url);
      } catch {
        if (!cancelled) setError(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pdfSrc]);

  const showImg = dataUrl && !error;

  return (
    <div
      className={[
        "relative shrink-0 overflow-hidden rounded-[10px] border border-white/[0.09] bg-zinc-950/80 shadow-[0_14px_36px_-20px_rgba(0,0,0,0.88)]",
        "ring-1 ring-inset ring-white/[0.04]",
        className,
      ].join(" ")}
      style={{ width: THUMB_W, height: THUMB_H }}
    >
      {/* Subtle command-ui grid — thematic, low contrast */}
      <div
        className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[length:8px_8px] opacity-[0.35]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-1/3 bg-gradient-to-t from-black/55 to-transparent"
        aria-hidden
      />

      {showImg ? (
        <img
          src={dataUrl}
          alt=""
          className="relative z-[1] h-full w-full object-cover object-top"
          draggable={false}
        />
      ) : null}

      {!showImg && !error ? (
        <div className="absolute inset-0 z-[1] animate-pulse bg-gradient-to-br from-zinc-800/50 via-zinc-900/40 to-black/60" />
      ) : null}

      {error ? (
        <div className="absolute inset-0 z-[1] flex flex-col items-center justify-center gap-1.5 bg-black/50 px-2 text-center">
          <FileText className="h-7 w-7 text-white/25" strokeWidth={1.25} aria-hidden />
          <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-white/35">Preview</span>
        </div>
      ) : null}

      <span className="pointer-events-none absolute bottom-1.5 right-2 z-[3] font-mono text-[9px] tabular-nums tracking-tight text-white/45">
        01
      </span>
    </div>
  );
}
