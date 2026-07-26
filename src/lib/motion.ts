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
  // Tap release: light bounce settle back to rest
  tap: { type: "spring", stiffness: 780, damping: 24, mass: 0.35 } as const,
};

/** Shrink on pointer-down — nested transition fires only for press-in (release uses SPRING.tap). */
export const TAP = {
  scale: 0.84,
  transition: { type: "tween", duration: 0.15, ease: EASE.out },
} as const;
export const HOVER = { scale: 1.02 } as const;
