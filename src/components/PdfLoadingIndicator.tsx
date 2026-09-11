import { motion, useReducedMotion } from "framer-motion";
import { useNavLayoutFreeze } from "@/lib/navLayoutFreeze";
import { PdfFoldLoader } from "./PdfFoldLoader";
import { DUR, EASE } from "@/lib/motion";

/** Slow enough to read on grid — used for fold anim + label enter/exit. */
export const PDF_LOADING_FADE_IN_S = DUR.slow;
export const PDF_LOADING_FADE_OUT_S = 0.45;

type Props = {
  className?: string;
  exiting?: boolean;
  onExitComplete?: () => void;
  /** Parent already fades the surface — keep the fold/label at full opacity on enter. */
  enterWithParent?: boolean;
};

/** Loader + single-line Satoshi label; fades in on mount, out after one fold cycle. */
export function PdfLoadingIndicator({
  className = "",
  exiting = false,
  onExitComplete,
  enterWithParent = false,
}: Props) {
  useNavLayoutFreeze(true);
  const reduceMotion = useReducedMotion();
  const skipEnterFade = Boolean(reduceMotion || enterWithParent);
  const fadeTransition = {
    duration: reduceMotion ? 0 : exiting ? PDF_LOADING_FADE_OUT_S : skipEnterFade ? 0 : PDF_LOADING_FADE_IN_S,
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
        initial={{ opacity: skipEnterFade ? 1 : 0 }}
        animate={{ opacity: exiting ? 0 : 1 }}
        transition={fadeTransition}
      >
        <PdfFoldLoader className="pdf-loading-indicator__loader" />
      </motion.div>
      <motion.p
        className="pdf-loading-indicator__label font-display"
        initial={{ opacity: skipEnterFade ? 0.9 : reduceMotion ? 1 : 0 }}
        animate={
          exiting
            ? { opacity: 0 }
            : reduceMotion
              ? { opacity: 1 }
              : { opacity: [0.42, 0.9, 0.42] }
        }
        transition={
          exiting
            ? fadeTransition
            : reduceMotion
              ? { duration: 0 }
              : { duration: 1.8, ease: "easeInOut", repeat: Infinity }
        }
        onAnimationComplete={() => {
          if (exiting) onExitComplete?.();
        }}
      >
        FILE LOADING...
      </motion.p>
    </motion.div>
  );
}
