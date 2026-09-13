import { useEffect, useState, type RefObject } from "react";

const TABLET_LANDSCAPE_MQ =
  "(min-width: 768px) and (max-width: 1366px) and (orientation: landscape) and (any-pointer: coarse)";

function rubberBandOffset(overshoot: number, dimension: number) {
  const dim = Math.max(1, dimension);
  const over = Math.max(0, overshoot);
  return (1 - 1 / ((over * 0.64) / dim + 1)) * dim;
}

function rubberBandRange(logical: number, max: number, dimension: number) {
  if (logical < 0) {
    return { pos: 0, visual: rubberBandOffset(-logical, dimension) };
  }
  if (logical > max) {
    return { pos: max, visual: -rubberBandOffset(logical - max, dimension) };
  }
  return { pos: logical, visual: 0 };
}

function usesFinePointerHover() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/**
 * iPad landscape: JS-drive a nested vertical scroller so page coast cannot
 * steal the first gesture. Same rubber-band as PROJECT DETAILS desc cards.
 *
 * Do not write ancestor overflow / scrollTop — that resets the PROFILE panel
 * on iOS worse than leaving the page scroller alone.
 */
export function useTabletLandscapeInnerScroll(
  scrollRef: RefObject<HTMLElement | null>,
  active: boolean,
  options?: {
    hitSelector?: string;
    bounceSelector?: string;
    onPaint?: (scrollTop: number) => void;
  },
) {
  const hitSelector = options?.hitSelector;
  const bounceSelector = options?.bounceSelector;
  const onPaint = options?.onPaint;
  const [tabletLandscape, setTabletLandscape] = useState(
    () => typeof window !== "undefined" && window.matchMedia(TABLET_LANDSCAPE_MQ).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia(TABLET_LANDSCAPE_MQ);
    const onChange = () => setTabletLandscape(mq.matches);
    onChange();
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }
    mq.addListener(onChange);
    return () => mq.removeListener(onChange);
  }, []);

  useEffect(() => {
    if (!active || !tabletLandscape) return;
    if (usesFinePointerHover()) return;

    const panel = scrollRef.current;
    if (!panel) return;

    const bounceElOf = (node: HTMLElement) => {
      if (bounceSelector) {
        const found = node.querySelector<HTMLElement>(bounceSelector);
        if (found) return found;
      }
      return node;
    };
    let bounceEl = bounceElOf(panel);
    let logicalTop = 0;
    let touchId: number | null = null;
    let lastY = 0;
    let lastMoveTime = 0;
    let startX = 0;
    let startY = 0;
    let velocityY = 0;
    let momentumRaf = 0;
    let mode: "undecided" | "js" | "ignore" = "undecided";

    const maxScrollTop = () => Math.max(0, panel.scrollHeight - panel.clientHeight);

    const paint = () => {
      bounceEl = bounceElOf(panel);
      const max = maxScrollTop();
      const { pos, visual } = rubberBandRange(logicalTop, max, panel.clientHeight);
      const y = -pos + visual;
      bounceEl.style.transform = Math.abs(y) > 0.5 ? `translate3d(0, ${y}px, 0)` : "";
      onPaint?.(pos);
      return pos;
    };

    const applyScrollTop = (next: number) => {
      logicalTop = next;
      return paint();
    };

    const stopMomentum = () => {
      if (momentumRaf) {
        window.cancelAnimationFrame(momentumRaf);
        momentumRaf = 0;
      }
    };

    const springToRange = () => {
      const max = maxScrollTop();
      const from = logicalTop;
      const target = Math.max(0, Math.min(max, from));
      if (Math.abs(from - target) < 0.5) {
        logicalTop = target;
        paint();
        return;
      }
      stopMomentum();
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / 280);
        const k = 1 - (1 - t) ** 3;
        logicalTop = from + (target - from) * k;
        paint();
        if (t < 1) {
          momentumRaf = window.requestAnimationFrame(step);
          return;
        }
        momentumRaf = 0;
        logicalTop = target;
        paint();
      };
      momentumRaf = window.requestAnimationFrame(step);
    };

    const startMomentum = () => {
      stopMomentum();
      const max = maxScrollTop();
      if (logicalTop < 0 || logicalTop > max) {
        springToRange();
        return;
      }
      let v = Math.max(-2.8, Math.min(2.8, velocityY));
      if (Math.abs(v) < 0.045) return;
      let prev = performance.now();
      const step = (now: number) => {
        const dt = Math.min(34, Math.max(0, now - prev));
        prev = now;
        v *= Math.exp(-0.0032 * dt);
        if (Math.abs(v) < 0.02) {
          momentumRaf = 0;
          springToRange();
          return;
        }
        applyScrollTop(logicalTop + v * dt);
        if (logicalTop < 0 || logicalTop > max) {
          v *= 0.55;
          if (Math.abs(v) < 0.08) {
            momentumRaf = 0;
            springToRange();
            return;
          }
        }
        momentumRaf = window.requestAnimationFrame(step);
      };
      momentumRaf = window.requestAnimationFrame(step);
    };

    const endTouch = (event: TouchEvent) => {
      if (touchId == null) return;
      for (let i = 0; i < event.changedTouches.length; i++) {
        if (event.changedTouches[i]?.identifier === touchId) {
          const wasJs = mode === "js";
          touchId = null;
          mode = "undecided";
          if (wasJs) startMomentum();
          return;
        }
      }
    };

    const onTouchStart = (event: TouchEvent) => {
      if (maxScrollTop() <= 1) return;
      const touch = event.changedTouches[0];
      if (!touch) return;
      stopMomentum();
      bounceEl = bounceElOf(panel);
      touchId = touch.identifier;
      lastY = touch.clientY;
      lastMoveTime = performance.now();
      startX = touch.clientX;
      startY = touch.clientY;
      velocityY = 0;
      mode = "js";
    };

    const onTouchMove = (event: TouchEvent) => {
      if (touchId == null || mode === "ignore") return;
      let touch: Touch | null = null;
      for (let i = 0; i < event.touches.length; i++) {
        const candidate = event.touches[i];
        if (candidate && candidate.identifier === touchId) {
          touch = candidate;
          break;
        }
      }
      if (!touch) return;
      if (mode === "undecided") {
        const dx = touch.clientX - startX;
        const dy = touch.clientY - startY;
        if (Math.abs(dx) < 3 && Math.abs(dy) < 3) return;
        if (Math.abs(dx) > Math.abs(dy)) {
          mode = "ignore";
          return;
        }
        mode = "js";
      }
      const now = performance.now();
      const delta = lastY - touch.clientY;
      const dt = Math.max(8, now - lastMoveTime);
      velocityY = velocityY * 0.65 + (delta / dt) * 0.35;
      lastY = touch.clientY;
      lastMoveTime = now;
      applyScrollTop(logicalTop + delta);
    };

    const hit =
      (hitSelector
        ? panel.closest<HTMLElement>(hitSelector)
        : null) ?? panel;
    hit.addEventListener("touchstart", onTouchStart, { passive: true });
    hit.addEventListener("touchmove", onTouchMove, { passive: true });
    hit.addEventListener("touchend", endTouch, { passive: true });
    hit.addEventListener("touchcancel", endTouch, { passive: true });

    return () => {
      stopMomentum();
      bounceEl.style.transform = "";
      hit.removeEventListener("touchstart", onTouchStart);
      hit.removeEventListener("touchmove", onTouchMove);
      hit.removeEventListener("touchend", endTouch);
      hit.removeEventListener("touchcancel", endTouch);
    };
  }, [active, bounceSelector, hitSelector, onPaint, scrollRef, tabletLandscape]);
}
