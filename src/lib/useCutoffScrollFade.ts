import { useCallback, useLayoutEffect, useRef, useState } from "react";

/**
 * Bottom content-cutoff fade while a scroll container overflows and is not
 * scrolled to the end (mask should clear at the true bottom of the text).
 */
export function useCutoffScrollFade(active: boolean) {
  const scrollRef = useRef<HTMLElement | null>(null);
  const [showFade, setShowFade] = useState(false);

  const updateFade = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !active) {
      setShowFade(false);
      return;
    }
    const canScroll = el.scrollHeight - el.clientHeight > 1;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
    setShowFade(canScroll && !atBottom);
  }, [active]);

  useLayoutEffect(() => {
    updateFade();
    const el = scrollRef.current;
    if (!el || !active) return;
    el.addEventListener("scroll", updateFade, { passive: true });
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateFade) : null;
    ro?.observe(el);
    return () => {
      el.removeEventListener("scroll", updateFade);
      ro?.disconnect();
    };
  }, [active, updateFade]);

  return { scrollRef, showFade, updateFade };
}
