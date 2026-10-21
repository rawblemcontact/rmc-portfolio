import { motion, useReducedMotion } from "framer-motion";
import { useNavLayoutFreeze } from "@/lib/navLayoutFreeze";
import { LoaderIcon } from "./icons/LoaderIcon";
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

  /* Pulse + spin run as CSS keyframes (compositor) so they stay smooth while
     the PDF loads on the main thread; framer-motion only handles enter/exit fades. */
  return (
    <motion.div
      className={`pdf-loading-indicator ${className}`.trim()}
      role="status"
      aria-live="polite"
      initial={{ opacity: skipEnterFade ? 1 : 0 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={fadeTransition}
      onAnimationComplete={() => {
        if (exiting) onExitComplete?.();
      }}
    >
      <div className="pdf-loading-indicator__loader-wrap main-card-loading__pulse">
        <div className="main-card-loading__spin">
          <LoaderIcon aria-hidden className="pdf-loading-indicator__loader" size={48} />
        </div>
      </div>
      <p className="pdf-loading-indicator__label font-display main-card-loading__pulse">
        FILE LOADING...
      </p>
    </motion.div>
  );
}
