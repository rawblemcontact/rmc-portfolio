import { motion, useReducedMotion } from "framer-motion";
import { PdfFoldLoader } from "./PdfFoldLoader";
import { DUR, EASE } from "@/lib/motion";

/** Slow enough to read on grid — used for fold anim + label enter/exit. */
export const PDF_LOADING_FADE_IN_S = DUR.slow;
export const PDF_LOADING_FADE_OUT_S = 0.45;

type Props = {
  className?: string;
  exiting?: boolean;
  onExitComplete?: () => void;
};

/** Loader + single-line Satoshi label; fades in on mount, out after one fold cycle. */
export function PdfLoadingIndicator({
  className = "",
  exiting = false,
  onExitComplete,
}: Props) {
  const reduceMotion = useReducedMotion();
  const fadeTransition = {
    duration: reduceMotion ? 0 : exiting ? PDF_LOADING_FADE_OUT_S : PDF_LOADING_FADE_IN_S,
    ease: EASE.out,
  };

  return (
    <motion.div
      className={`pdf-loading-indicator ${className}`.trim()}
      role="status"
      aria-live="polite"
      initial={false}
    >
      <motion.div
        className="pdf-loading-indicator__loader-wrap"
        initial={{ opacity: reduceMotion ? 1 : 0 }}
        animate={{ opacity: exiting ? 0 : 1 }}
        transition={fadeTransition}
      >
        <PdfFoldLoader className="pdf-loading-indicator__loader" />
      </motion.div>
      <motion.p
        className="pdf-loading-indicator__label font-display"
        initial={{ opacity: reduceMotion ? 1 : 0 }}
        animate={{ opacity: exiting ? 0 : 1 }}
        transition={fadeTransition}
        onAnimationComplete={() => {
          if (exiting) onExitComplete?.();
        }}
      >
        PDF LOADING...
      </motion.p>
    </motion.div>
  );
}
