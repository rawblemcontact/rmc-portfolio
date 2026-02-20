import * as React from "react";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type WordsPullUpProps = {
  text: string;
  className?: string;
  /** Stagger per character (seconds). */
  stagger?: number;
  /** Base delay before the first character (seconds). */
  delay?: number;
  /** Start offset in px. */
  y?: number;
  /**
   * If provided, overrides in-view logic. Useful when you need to wait until a slide is fully active.
   * When this toggles false→true, the animation will run.
   */
  play?: boolean;
};

export function WordsPullUp({
  text,
  className,
  stagger = 0.04,
  delay = 0,
  y = 10,
  play,
}: WordsPullUpProps) {
  const reduceMotion = useReducedMotion();
  const ref = React.useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.85 });
  const shouldPlay = play ?? isInView;

  const chars = React.useMemo(() => Array.from(text), [text]);

  const pullUp: Variants = {
    initial: (c: number | [number, number]) => {
      const i = Array.isArray(c) ? c[0] : c;
      const total = Array.isArray(c) ? c[1] : 1;
      return {
        y,
        opacity: 0,
        transition: reduceMotion
          ? { duration: 0 }
          : {
              delay: (total - 1 - i) * stagger,
              duration: 0.14,
              ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number],
            },
      };
    },
    animate: (c: number | [number, number]) => {
      const i = Array.isArray(c) ? c[0] : c;
      return {
        y: 0,
        opacity: 1,
        transition: reduceMotion
          ? { duration: 0 }
        : {
            delay: delay + i * stagger,
            duration: 0.15,
              ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number],
            },
      };
    },
  };

  if (reduceMotion) {
    return <span className={cn(className)}>{text}</span>;
  }

  return (
    <span ref={ref} className={cn("inline-block", className)} aria-label={text} role="text">
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden
        initial="initial"
        animate={shouldPlay ? "animate" : "initial"}
        className="inline-flex whitespace-pre"
      >
        {chars.map((ch, i) => (
          <motion.span key={`${ch}-${i}`} variants={pullUp} custom={[i, chars.length]} className="inline-block">
            {ch === " " ? "\u00A0" : ch}
          </motion.span>
        ))}
      </motion.span>
    </span>
  );
}

