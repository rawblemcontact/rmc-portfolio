import { useLayoutEffect } from "react";

/** Best-effort: cannot lock iOS Safari. Chrome Android may lock after a tap. */

let freezeCount = 0;

export function isNavLayoutFrozen(): boolean {
  return freezeCount > 0;
}

function isCoarseTouch(): boolean {
  /* iPad + trackpad reports pointer:fine; tablet layouts use any-pointer:coarse. */
  return (
    typeof window !== "undefined" && window.matchMedia("(any-pointer: coarse)").matches
  );
}

async function lockCurrentOrientationBestEffort() {
  if (!isCoarseTouch()) return;
  const orientation = screen.orientation;
  if (!orientation || typeof orientation.lock !== "function") return;
  try {
    await orientation.lock(orientation.type);
  } catch {
    /* Not in fullscreen, iOS, or permission denied — layout freeze still applies. */
  }
}

function unlockOrientationBestEffort() {
  try {
    screen.orientation?.unlock();
  } catch {
    /* ignore */
  }
}

function applyFreezeCount() {
  if (freezeCount === 1) void lockCurrentOrientationBestEffort();
  if (freezeCount === 0) unlockOrientationBestEffort();
}

export function beginNavLayoutFreeze() {
  freezeCount += 1;
  applyFreezeCount();
}

export function endNavLayoutFreeze() {
  freezeCount = Math.max(0, freezeCount - 1);
  applyFreezeCount();
}

/** Freeze layout while `active` (overlays, loaders, panel motion). Nested callers stack. */
export function useNavLayoutFreeze(active: boolean) {
  useLayoutEffect(() => {
    if (!active) return;
    beginNavLayoutFreeze();
    return () => endNavLayoutFreeze();
  }, [active]);
}

