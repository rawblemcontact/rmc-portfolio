export const EASE = {
  // Primary UI ease-out (confident, non-bouncy)
  out: [0.16, 1, 0.3, 1] as const,
  // Only for subtle ambience (use sparingly)
  inOut: "easeInOut" as const,
};

export const DUR = {
  micro: 0.16,
  fast: 0.24,
  base: 0.32,
  slow: 0.55,
};

/** SideNavOverlay backdrop fade (open + close). */
export const SIDE_NAV_OVERLAY_FADE_S = 0.2;
/** PROJECTS chrome fade-out when FEATURED WRITING VIEW opens the PDF loader. */
export const SHOWCASE_PDF_PROJECTS_FADE_OUT_S = 0.3;

export const SPRING = {
  // Tight, employer-ready UI spring (low bounce)
  ui: { type: "spring", stiffness: 520, damping: 38 } as const,
  // Panels/drawers: slightly softer, still controlled
  panel: { type: "spring", stiffness: 320, damping: 34 } as const,
  // Tap release: light bounce settle back to rest (slightly snappy + eased)
  tap: { type: "spring", stiffness: 980, damping: 30, mass: 0.3 } as const,
};

/** Shrink on pointer-down — nested transition fires only for press-in (release uses SPRING.tap). */
export const TAP = {
  scale: 0.84,
  transition: { type: "tween", duration: 0.15, ease: EASE.out },
} as const;
export const HOVER = { scale: 1.02 } as const;

/**
 * PORTFOLIO BOUNCE — on-click press-in + settle (no hover).
 * Same click feel as hero PORTFOLIO / PROJECTS main 4 cards.
 * Apply only when the user asks for “PORTFOLIO BOUNCE”.
 */
export const PORTFOLIO_BOUNCE = {
  /** Push-in 15% gentler than 0.955 (4.5% → ~3.8% shrink). */
  tap: {
    scale: 0.962,
    transition: {
      type: "tween",
      duration: 0.11,
      ease: EASE.out,
    },
  },
  /** Release back to rest — same ease family as menu, decisive settle. */
  tapSpring: {
    type: "tween",
    duration: 0.2,
    ease: EASE.out,
  },
  /** Min visible press+settle window before navigating away (ms). */
  tapFeedbackMs: 260,
} as const;

/**
 * PORTFOLIO SPEED — named reaction feel (hover zoom + PORTFOLIO BOUNCE press).
 * Apply only when the user asks for “PORTFOLIO SPEED” on an element.
 */
export const PORTFOLIO_SPEED = {
  hover: {
    /** Zoom 25% gentler than 1.05 (5% → 3.75%). */
    scale: 1.0375,
    transition: {
      type: "tween",
      duration: 0.2,
      ease: EASE.out,
    },
  },
  tap: PORTFOLIO_BOUNCE.tap,
  tapSpring: PORTFOLIO_BOUNCE.tapSpring,
  tapFeedbackMs: PORTFOLIO_BOUNCE.tapFeedbackMs,
} as const;
