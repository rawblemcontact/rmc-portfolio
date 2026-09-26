/**
 * Shared card-drawer clock — PROJECT DETAILS desc-card + EXPERIENCE card.
 * Source of truth for timings validated 2026-09-26 with ShowcaseVideoEditingDetail.
 * Keep EXPERIENCE and desc-card on this module so clocks cannot drift.
 */

/** Body copy fades out before the height tween. */
export const DRAWER_BODY_OUT_S = 0.16;
/** Body copy fades in after the height tween commits. */
export const DRAWER_BODY_IN_S = 0.24;
export const DRAWER_BODY_OUT_MS = Math.round(DRAWER_BODY_OUT_S * 1000);
export const DRAWER_BODY_IN_MS = Math.round(DRAWER_BODY_IN_S * 1000);

/**
 * Base card height duration — matches DETAIL_TAB_SWAP_DUR_S.
 * Scaled up with delta so tall resizes ease instead of snapping.
 */
export const DRAWER_CARD_RESIZE_DUR_S = 0.42;
export const DRAWER_CARD_RESIZE_DUR_MS = Math.round(DRAWER_CARD_RESIZE_DUR_S * 1000);
export const DRAWER_CARD_HEIGHT_EPSILON_PX = 2.5;
/** Opacity transition ease (body in/out). Height rAF uses {@link drawerCardResizeEaseK}. */
export const DRAWER_CARD_RESIZE_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/** Scale resize duration with body delta (same formula as detailCardResizeDurationMs). */
export function drawerCardResizeDurationMs(heightDeltaPx: number): number {
  const delta = Math.abs(heightDeltaPx);
  return Math.min(
    Math.round(DRAWER_CARD_RESIZE_DUR_MS * 2.4),
    Math.max(
      DRAWER_CARD_RESIZE_DUR_MS,
      Math.round(DRAWER_CARD_RESIZE_DUR_MS * (delta / 160)),
    ),
  );
}

/** rAF progress 0→1 → eased k (identical to ShowcaseVideoEditingDetail height tick). */
export function drawerCardResizeEaseK(t: number): number {
  return 1 - (1 - Math.min(1, Math.max(0, t))) ** 3;
}
