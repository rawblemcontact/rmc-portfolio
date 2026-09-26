import { useEffect } from "react";
import { isNavLayoutFrozen } from "./navLayoutFreeze";

const PINCH_ENTER_SCALE = 1.05;
const PINCH_LEAVE_SCALE = 1.03;

let lastOrientationAt = 0;

export function markOrientationChange() {
  lastOrientationAt = Date.now();
}

export function isRecentOrientationChange(windowMs = 800): boolean {
  return Date.now() - lastOrientationAt < windowMs;
}

if (typeof window !== "undefined") {
  window.addEventListener("orientationchange", markOrientationChange);
}

/** Optical pinch — layout CSS px should stay 1×. Scale only (width ratio stuck after pinch-out). */
export function isDocumentPinchZoomed(): boolean {
  if (typeof window === "undefined") return false;
  const vv = window.visualViewport;
  if (!vv) return false;
  return vv.scale > PINCH_LEAVE_SCALE;
}

export function unlessPinched(fn: () => void): () => void {
  return () => {
    if (isNavLayoutFrozen()) return;
    /* Zoom+rotate: restage to the new 1× orientation even if still pinched. */
    if (isDocumentPinchZoomed() && !isRecentOrientationChange()) return;
    fn();
  };
}

export function afterOrientationSettle(fn: () => void): () => void {
  markOrientationChange();
  fn();
  const raf = window.requestAnimationFrame(fn);
  const t1 = window.setTimeout(fn, 80);
  const t2 = window.setTimeout(fn, 280);
  return () => {
    window.cancelAnimationFrame(raf);
    window.clearTimeout(t1);
    window.clearTimeout(t2);
  };
}

function attachViewportWatch(onChange: () => void): () => void {
  const vv = window.visualViewport;
  if (!vv) return () => {};
  const opts = { passive: true } as const;
  vv.addEventListener("resize", onChange);
  vv.addEventListener("scroll", onChange);
  window.addEventListener("touchend", onChange, opts);
  window.addEventListener("touchcancel", onChange, opts);
  return () => {
    vv.removeEventListener("resize", onChange);
    vv.removeEventListener("scroll", onChange);
    window.removeEventListener("touchend", onChange);
    window.removeEventListener("touchcancel", onChange);
  };
}

/**
 * Pause looping media while pinched; resume when scale is back near 1.
 * Retries on touchend — Safari often skips a final visualViewport resize at 1×.
 */
export function usePauseVideosWhilePinched() {
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const pausedByUs = new Set<HTMLVideoElement>();
    let pinched = false;
    const retryTimers: number[] = [];

    const resumeTracked = () => {
      pausedByUs.forEach((video) => {
        void video.play().catch(() => {});
      });
    };

    const onChange = () => {
      const scale = vv.scale;
      if (!pinched && scale >= PINCH_ENTER_SCALE) {
        pinched = true;
        retryTimers.forEach((id) => window.clearTimeout(id));
        retryTimers.length = 0;
        document.querySelectorAll("video").forEach((el) => {
          const video = el as HTMLVideoElement;
          if (!video.paused) {
            video.pause();
            pausedByUs.add(video);
          } else if (video.getAttribute("aria-label") === "Hero reel") {
            /* Hero listener may have paused first — still resume this reel. */
            pausedByUs.add(video);
          }
        });
        return;
      }
      if (pinched && scale <= PINCH_LEAVE_SCALE) {
        pinched = false;
        resumeTracked();
        retryTimers.push(window.setTimeout(resumeTracked, 50));
        retryTimers.push(window.setTimeout(resumeTracked, 180));
        retryTimers.push(
          window.setTimeout(() => {
            resumeTracked();
            pausedByUs.clear();
          }, 400),
        );
      }
    };

    const detach = attachViewportWatch(onChange);
    return () => {
      detach();
      retryTimers.forEach((id) => window.clearTimeout(id));
      pausedByUs.clear();
    };
  }, []);
}
