import { useCallback, useLayoutEffect, useRef, useState } from "react";

/**
 * Bottom content-cutoff fade while a scroll container overflows and is not
 * scrolled to the end (mask should clear at the true bottom of the text).
 */
export function useCutoffScrollFade(active: boolean) {
  const scrollRef = useRef<HTMLElement | null>(null);
  const [showFade, setShowFade] = useState(false);

  const updateFade = useCallback((scrollTopOverride?: number) => {
    const el = scrollRef.current;
    if (!el || !active) {
      setShowFade(false);
      return;
    }
    const canScroll = el.scrollHeight - el.clientHeight > 1;
    const top = scrollTopOverride ?? el.scrollTop;
    const atBottom = top + el.clientHeight >= el.scrollHeight - 2;
    const next = canScroll && !atBottom;
    const shell = el.parentElement;
    if (shell?.classList.contains("profile-summary-card-scroll-shell")) {
      const token = next ? "1" : "0";
      if (shell.style.getPropertyValue("--profile-cutoff") !== token) {
        shell.style.setProperty("--profile-cutoff", token);
      }
    }
    setShowFade((prev) => (prev === next ? prev : next));
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
