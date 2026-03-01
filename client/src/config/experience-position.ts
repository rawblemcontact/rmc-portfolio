/**
 * Experience section: vertical position of the content block.
 * Preserved in repo so we can reuse or restore without localStorage.
 *
 * - 0 = top, 50 = viewport center (offset in vh), 100 = bottom
 * - Horizontal: 50 = viewport center (offset in vw) so optical left/center/right match
 *
 * To re-enable the config slider: use this value as initial state, snap to EXP_SNAP_POINTS
 * on release, and write back to localStorage (and optionally update this file on "save state").
 */
/** Default vertical: slightly above center (48) for a balanced, appealing fit. */
export const EXPERIENCE_BLOCK_POSITION = 48;

/** Default horizontal: 50 = center for balanced framing. */
export const EXPERIENCE_BLOCK_POSITION_X = 50;

/** Snap points aligned to rule-of-thirds overlay: top, 1/3, center, 2/3, bottom. */
export const EXP_SNAP_POINTS = [0, 33, 50, 67, 100] as const;
