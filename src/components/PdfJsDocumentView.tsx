import { useEffect, useRef, useState } from "react";
import useMeasure from "react-use-measure";
import type { PDFDocumentProxy } from "pdfjs-dist";

/** Legacy build polyfills Map.getOrInsertComputed for browsers before Chrome 145. */
import workerUrl from "pdfjs-dist/legacy/build/pdf.worker.min.mjs?url";

import { PdfLoadingIndicator } from "./PdfLoadingIndicator";

type Props = {
  src: string;
  className?: string;
  /** Cap canvas resolution for performance (default 2). */
  maxDpr?: number;
  onReady?: () => void;
  onError?: () => void;
  /** Parent shows loader on grid backdrop (PDF preview dialog). */
  suppressLoadingOverlay?: boolean;
};

/** Max CSS width for a page inside the viewer (readability on large screens). */
const MAX_PAGE_CSS_PX = 920;

/**
 * Renders a PDF with PDF.js in a Google Drive–like layout: gray workspace,
 * centered white sheets with shadow, vertical scroll inside the preview only.
 */
export function PdfJsDocumentView({
  src,
  className = "",
  maxDpr = 2,
  onReady,
  onError,
  suppressLoadingOverlay = false,
}: Props) {
  const pdfSrc = src.trim();
  const isEmpty = pdfSrc.length === 0;

  const [bindMeasureRef, bounds] = useMeasure({ debounce: { scroll: 0, resize: 120 } });
  const pagesHostRef = useRef<HTMLDivElement | null>(null);

  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pagesError, setPagesError] = useState<string | null>(null);
  const [pagesReady, setPagesReady] = useState(isEmpty);

  const viewportWidth = Math.max(0, Math.floor(bounds.width));
  /** Horizontal breathing room inside the gray viewer. */
  const horizontalGutter = viewportWidth >= 640 ? 48 : 24;
  const pageSlotWidth = Math.max(
    24,
    Math.min(MAX_PAGE_CSS_PX, viewportWidth > 0 ? viewportWidth - horizontalGutter : 0),
  );

  useEffect(() => {
    if (!isEmpty) return;
    onReady?.();
  }, [isEmpty, onReady]);

  // Load document when URL changes
  useEffect(() => {
    if (isEmpty) {
      setPdfDoc(null);
      setLoadError(null);
      setPagesError(null);
      setPagesReady(true);
      return;
    }

    let alive = true;
    let docToDestroy: PDFDocumentProxy | null = null;

    setPdfDoc(null);
    setLoadError(null);
    setPagesError(null);
    setPagesReady(false);

    void (async () => {
      try {
        const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
        pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
        const loadingTask = pdfjs.getDocument({ url: pdfSrc });
        const doc = await loadingTask.promise;
        docToDestroy = doc;
        if (!alive) {
          await doc.destroy();
          docToDestroy = null;
          return;
        }
        setPdfDoc(doc);
      } catch (e) {
        if (!alive) return;
        setLoadError(e instanceof Error ? e.message : "Could not load PDF");
      }
    })();

    return () => {
      alive = false;
      void docToDestroy?.destroy();
      docToDestroy = null;
      setPdfDoc(null);
    };
  }, [isEmpty, pdfSrc]);

  // Paint pages when document or slot width changes
  useEffect(() => {
    if (isEmpty) return;

    if (!pdfDoc || pageSlotWidth < 24) {
      setPagesReady(false);
      return;
    }

    const host = pagesHostRef.current;
    if (!host) return;

    let cancelled = false;
    setPagesError(null);
    setPagesReady(false);
    host.replaceChildren();

    const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, maxDpr);

    void (async () => {
      try {
        for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
          if (cancelled) return;
          const page = await pdfDoc.getPage(pageNum);
          const baseViewport = page.getViewport({ scale: 1 });
          const scale = (pageSlotWidth / baseViewport.width) * dpr;
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d", { alpha: false });
          if (!ctx) continue;

          const w = Math.floor(viewport.width);
          const h = Math.floor(viewport.height);
          canvas.width = w;
          canvas.height = h;
          canvas.style.width = `${Math.floor(w / dpr)}px`;
          canvas.style.height = `${Math.floor(h / dpr)}px`;
          canvas.className = "block max-w-full bg-white";
          canvas.setAttribute("role", "img");
          canvas.setAttribute("aria-label", `Page ${pageNum} of ${pdfDoc.numPages}`);

          const row = document.createElement("div");
          row.className = "flex w-full shrink-0 justify-center px-1 sm:px-0";

          const sheet = document.createElement("div");
          sheet.className = [
            "inline-block max-w-full overflow-hidden bg-white",
            "rounded-xl",
            "shadow-[0_1px_0_rgba(255,255,255,0.06)_inset,0_2px_6px_rgba(0,0,0,0.35),0_12px_28px_rgba(0,0,0,0.45)]",
            "ring-1 ring-black/20",
          ].join(" ");

          sheet.appendChild(canvas);
          row.appendChild(sheet);
          host.appendChild(row);

          await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        }
        if (!cancelled) {
          setPagesReady(true);
        }
      } catch (e) {
        if (!cancelled) {
          setPagesError(e instanceof Error ? e.message : "Could not render PDF");
        }
      }
    })();

    return () => {
      cancelled = true;
      host.replaceChildren();
    };
  }, [isEmpty, pdfDoc, pageSlotWidth, maxDpr]);

  const showLoading = !isEmpty && !loadError && (!pdfDoc || !pagesReady);
  const showError = !isEmpty && (loadError ?? pagesError);

  useEffect(() => {
    if (pagesReady) onReady?.();
  }, [pagesReady, onReady]);

  useEffect(() => {
    if (showError) onError?.();
  }, [showError, onError]);

  return (
    <div className={`relative flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden ${className}`}>
      {showLoading && !suppressLoadingOverlay && (
        <div
          className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center"
          aria-busy
          aria-live="polite"
        >
          <PdfLoadingIndicator />
        </div>
      )}

      {showError && (
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2.5 rounded-xl bg-[#3c4043]/5 px-4 py-8 text-center">
          <p className="font-body text-sm text-mono-2">Could not display this PDF in the browser.</p>
          <p className="font-mono text-[0.6875rem] leading-relaxed text-mono-2/70">{showError}</p>
        </div>
      )}

      {!showError && (
        <div
          ref={bindMeasureRef}
          className="no-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden scroll-smooth rounded-xl bg-[#3c4043]/5"
          style={{ WebkitOverflowScrolling: "touch", scrollBehavior: "smooth" }}
          aria-label={isEmpty ? "PDF viewer (no document)" : undefined}
        >
          {!isEmpty ? (
            <div
              ref={pagesHostRef}
              className="flex w-full min-w-0 flex-col items-center gap-6 py-6 pb-12 sm:gap-8 sm:py-8 sm:pb-14"
            />
          ) : (
            <div className="min-h-[min(52vh,28rem)] w-full" aria-hidden />
          )}
        </div>
      )}
    </div>
  );
}
