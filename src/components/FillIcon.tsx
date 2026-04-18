import * as React from "react";
import { motion, type Variants } from "framer-motion";
import type { LucideIcon } from "lucide-react";

type FillIconProps = {
  icon: LucideIcon;
  /** Optional filled replacement for stroke-only icons (e.g., User). */
  filledIcon?: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  /** Force the "filled" state even when not hovered. */
  forceFilled?: boolean;
  className?: string;
  strokeWidth?: number;
};

/**
 * Persona-style "fill" on hover:
 * - Base icon stays outline
 * - Filled icon is clipped and revealed vertically
 *
 * Requires a parent motion component providing `rest`/`hover` variants via `whileHover="hover"`.
 */
export function FillIcon({
  icon: Icon,
  filledIcon: Filled,
  forceFilled,
  className,
  strokeWidth = 1.5,
}: FillIconProps) {
  const controlled = typeof forceFilled === "boolean";
  const fillVariants: Variants = {
    rest: { clipPath: "inset(100% 0% 0% 0%)" },
    hover: { clipPath: "inset(0% 0% 0% 0%)" },
  };

  return (
    <span className="relative inline-flex">
      {/* Outline */}
      <Icon aria-hidden className={className} strokeWidth={strokeWidth} />

      {/* Filled overlay (revealed on hover) */}
      <motion.span
        aria-hidden
        className="absolute inset-0"
        variants={fillVariants}
        initial={controlled ? "rest" : undefined}
        animate={controlled ? (forceFilled ? "hover" : "rest") : undefined}
        transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
        style={{ willChange: "clip-path" }}
      >
        {Filled ? (
          <Filled aria-hidden className={className} />
        ) : (
          <Icon aria-hidden className={className} stroke="none" fill="currentColor" />
        )}
      </motion.span>
    </span>
  );
}

