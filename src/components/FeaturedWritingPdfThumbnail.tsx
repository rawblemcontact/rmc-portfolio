import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FileText } from "lucide-react";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

/** Default height is fixed; width can grow (e.g. to match active tab). */
const DEFAULT_W = 120;
const FIXED_H = 156;

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
  const [thumbVisible, setThumbVisible] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
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

  const showImg = Boolean(dataUrl && !error);
  const showLoadingShell = !error && (!showImg || !thumbVisible);

  // Fade in on every tab / key change: never flip visible in the same frame as reset (cached imgs skip transition otherwise).
  useLayoutEffect(() => {
    if (!dataUrl || error) {
      setThumbVisible(false);
      return;
    }
    setThumbVisible(false);
    let cancelled = false;
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        if (cancelled) return;
        const el = imgRef.current;
        if (el?.complete && el.naturalWidth > 0) {
          setThumbVisible(true);
        }
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [key, dataUrl, error]);

  const interactive = typeof onActivate === "function";

  return (
    <div
      className={[
        "relative shrink-0 overflow-hidden rounded-[10px] border border-white/[0.09] bg-zinc-950/80",
        "ring-1 ring-inset ring-white/[0.04]",
        interactive
          ? "cursor-pointer transition-[border-color] duration-200 ease-out hover:border-yellow-400/35 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-yellow-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
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
      {showLoadingShell ? (
        <div
          className="absolute inset-0 z-0 animate-pulse bg-gradient-to-br from-zinc-800/35 via-zinc-900/25 to-zinc-950 motion-reduce:animate-none motion-reduce:opacity-90"
          aria-hidden
        />
      ) : null}

      {showImg && dataUrl ? (
        <img
          key={key}
          ref={imgRef}
          src={dataUrl}
          alt=""
          className={[
            "relative z-[1] h-full w-full object-cover object-top motion-safe:transition-opacity motion-safe:duration-500 motion-safe:ease-out",
            thumbVisible ? "opacity-100" : "opacity-0",
          ].join(" ")}
          draggable={false}
          onLoad={() => setThumbVisible(true)}
        />
      ) : null}

      {showImg && thumbVisible ? (
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
