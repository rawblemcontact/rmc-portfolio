import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { LoaderIcon, type LoaderIconHandle } from "./icons/LoaderIcon";

type Props = {
  className?: string;
};

/**
 * One full spin cycle of `LoaderIcon` (0.8s) × ~2.5 — keep exit wait readable
 * with the FILE LOADING label (same role as the old fold-loop duration).
 */
export const PDF_FOLD_LOADER_CYCLE_MS = 2000;

/** PDF loading spinner — animated LoaderIcon (all PDF loader surfaces). */
export function PdfFoldLoader({ className = "" }: Props) {
  const reduceMotion = useReducedMotion();
  const controlsRef = useRef<LoaderIconHandle>(null);

  useEffect(() => {
    if (reduceMotion) return;
    controlsRef.current?.startAnimation();
    return () => {
      controlsRef.current?.stopAnimation();
    };
  }, [reduceMotion]);

  return (
    <LoaderIcon
      ref={controlsRef}
      aria-hidden
      className={className}
      size={20}
    />
  );
}
