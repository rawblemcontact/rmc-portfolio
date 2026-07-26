import { motion } from "framer-motion";
import { Download, ExternalLink, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { PdfJsDocumentView } from "./PdfJsDocumentView";
import { PDF_FOLD_LOADER_CYCLE_MS } from "./PdfFoldLoader";
import { PdfLoadingIndicator, PDF_LOADING_FADE_IN_S } from "./PdfLoadingIndicator";
import { PdfViewerGridBackdrop } from "./PdfViewerGridBackdrop";
import { EASE, SPRING, TAP } from "@/lib/motion";

export type SupportingPdfPreviewItem = {
  id: string;
  title: string;
  subtitle: string;
  href?: string;
};

type Props = {
  item: SupportingPdfPreviewItem;
  pdfSrc: string;
  onClose: () => void;
  isClosing: boolean;
  reduceMotion: boolean | null;
  /** True once PDF pages are ready — then the card mounts/fades in. */
  showFrame: boolean;
  onFrameReady: () => void;
  /** Card fade on dismiss (grid stays visible). */
  closeFadeS: number;
  /** Card fade when appearing after load. */
  openFadeS: number;
  onCloseAnimationComplete?: () => void;
};

/**
 * Full-screen in-app PDF preview (Supporting archive + FEATURED WRITING on PROJECTS).
 * Grid backdrop does not participate in open/close opacity — only the card animates.
 */
export function SupportingPdfPreviewDialog({
  item,
  pdfSrc,
  onClose,
  isClosing,
  reduceMotion,
  showFrame,
  onFrameReady,
  closeFadeS,
  openFadeS,
  onCloseAnimationComplete,
}: Props) {
  const showGridLoader = !showFrame && !isClosing;
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [loaderExiting, setLoaderExiting] = useState(false);
  const [loaderEnterKey, setLoaderEnterKey] = useState(0);
  const cycleAnchorMsRef = useRef(0);
  const exitScheduledRef = useRef(false);

  useEffect(() => {
    if (!showGridLoader) {
      setPdfLoaded(false);
      setLoaderExiting(false);
      exitScheduledRef.current = false;
      return;
    }
    setLoaderEnterKey((k) => k + 1);
    exitScheduledRef.current = false;
    setPdfLoaded(false);
    setLoaderExiting(false);
    cycleAnchorMsRef.current =
      performance.now() + (reduceMotion ? 0 : PDF_LOADING_FADE_IN_S * 1000);
  }, [pdfSrc, reduceMotion, showGridLoader]);

  useEffect(() => {
    if (!showGridLoader || !pdfLoaded || exitScheduledRef.current) return;
    exitScheduledRef.current = true;
    const cycleEnd =
      cycleAnchorMsRef.current + (reduceMotion ? 0 : PDF_FOLD_LOADER_CYCLE_MS);
    const wait = Math.max(0, cycleEnd - performance.now());
    const t = window.setTimeout(() => setLoaderExiting(true), wait);
    return () => window.clearTimeout(t);
  }, [pdfLoaded, reduceMotion, showGridLoader]);

  const handleLoaderExitComplete = useCallback(() => {
    if (!loaderExiting) return;
    onFrameReady();
  }, [loaderExiting, onFrameReady]);

  const handlePdfReady = useCallback(() => {
    setPdfLoaded(true);
  }, []);

  const handleCardAnimationComplete = useCallback(() => {
    if (!isClosing) return;
    onCloseAnimationComplete?.();
  }, [isClosing, onCloseAnimationComplete]);

  if (typeof document === "undefined") return null;

  const shellFadeS = reduceMotion ? 0 : isClosing ? closeFadeS : 0;

  return createPortal(
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="supporting-pdf-preview-title"
      className="fixed inset-0 z-[80] bg-black"
      initial={false}
      animate={{ opacity: reduceMotion ? 1 : isClosing ? 0 : 1 }}
      transition={{ duration: shellFadeS, ease: EASE.out }}
    >
      <PdfViewerGridBackdrop />

      {showGridLoader && (
        <motion.div
          key={`pdf-loader-${loaderEnterKey}`}
          className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center p-4 max-lg:p-8 max-lg:sm:p-12 sm:p-6 md:p-8"
          initial={false}
        >
          <PdfLoadingIndicator exiting={loaderExiting} onExitComplete={handleLoaderExitComplete} />
        </motion.div>
      )}

      <button
        type="button"
        className="absolute inset-0 z-[1] cursor-default border-0 bg-transparent p-0"
        aria-label="Close PDF preview"
        onClick={onClose}
      />

      <motion.div
        className={`absolute inset-0 z-10 flex items-center justify-center p-4 max-lg:p-8 max-lg:sm:p-12 sm:p-6 md:p-8 ${
          showGridLoader ? "pointer-events-none" : "pointer-events-none"
        }`}
        initial={false}
        aria-hidden={showGridLoader}
      >
        <motion.div
          className={`relative flex max-h-[min(90dvh,920px)] w-full max-w-[min(96vw,72rem)] flex-col overflow-hidden rounded-xl border border-white/[0.12] bg-black ring-1 ring-white/[0.06] ${
            showGridLoader ? "pointer-events-none invisible" : "pointer-events-auto"
          }`}
          onClick={(e) => e.stopPropagation()}
          initial={reduceMotion ? false : { opacity: 0, scaleY: 0.74, y: 0 }}
          animate={
            reduceMotion
              ? { opacity: showGridLoader ? 0 : 1, scaleY: 1, y: 0 }
              : showGridLoader
                ? { opacity: 0, scaleY: 0.74, y: 0 }
                : isClosing
                  ? { opacity: 0, scaleY: 1, y: 0 }
                  : { opacity: 1, scaleY: 1, y: 0 }
          }
          transition={{
            duration: reduceMotion ? 0 : isClosing ? closeFadeS : showGridLoader ? 0 : openFadeS,
            ease: EASE.out,
          }}
          style={{ transformOrigin: "center center" }}
          onAnimationComplete={handleCardAnimationComplete}
        >
            <header className="relative flex shrink-0 items-center justify-between gap-3 border-b border-white/[0.1] bg-black px-4 py-3.5 sm:px-5">
              <motion.button
                type="button"
                aria-label="Close PDF preview"
                onClick={onClose}
                className="pdf-viewer-chrome-btn pdf-viewer-control-btn"
                whileTap={reduceMotion ? undefined : TAP}
                transition={SPRING.tap}
              >
                <X aria-hidden />
              </motion.button>
              <div className="pointer-events-none absolute left-1/2 top-1/2 w-[min(62%,26rem)] -translate-x-1/2 -translate-y-1/2 px-2 text-center">
                <h2
                  id="supporting-pdf-preview-title"
                  className="font-display text-[0.95rem] sm:text-base text-white tracking-tight text-balance leading-snug"
                >
                  {item.title}
                </h2>
                <p className="font-body text-[0.7rem] sm:text-xs text-mono-2/90 mt-1 leading-snug line-clamp-2">
                  {item.subtitle}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {pdfSrc ? (
                  <>
                    <motion.a
                      href={pdfSrc}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Open PDF in new tab"
                      className="pdf-viewer-chrome-btn pdf-viewer-control-btn"
                      whileTap={reduceMotion ? undefined : TAP}
                      transition={SPRING.tap}
                    >
                      <ExternalLink aria-hidden />
                    </motion.a>
                  </>
                ) : (
                  <span className="inline-block h-10 w-[5.5rem] shrink-0" aria-hidden />
                )}
              </div>
            </header>
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-3 pb-3 pt-2 sm:px-4 sm:pb-4">
              <PdfJsDocumentView
                src={pdfSrc}
                className="rounded-lg border border-white/[0.08] bg-black/20"
                onReady={handlePdfReady}
                onError={handlePdfReady}
                suppressLoadingOverlay
              />
            </div>
            {pdfSrc ? (
              <motion.a
                href={pdfSrc}
                download
                aria-label="Download PDF"
                className="pdf-viewer-chrome-btn pdf-viewer-control-btn pdf-viewer-download-btn absolute bottom-5 right-5 z-20"
                whileTap={reduceMotion ? undefined : TAP}
                transition={SPRING.tap}
              >
                <Download aria-hidden />
              </motion.a>
            ) : null}
        </motion.div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}
