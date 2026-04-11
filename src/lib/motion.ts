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

export const SPRING = {
  // Tight, employer-ready UI spring (low bounce)
  ui: { type: "spring", stiffness: 520, damping: 38 } as const,
  // Panels/drawers: slightly softer, still controlled
  panel: { type: "spring", stiffness: 320, damping: 34 } as const,
};

// Interaction presets
export const TAP = { scale: 0.985 } as const;
export const HOVER = { scale: 1.02 } as const;
