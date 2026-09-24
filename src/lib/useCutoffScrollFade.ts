import { useCallback, useLayoutEffect, useRef, useState } from "react";

/**
 * Bottom content-cutoff fade while a scroll container overflows and is not
 * scrolled to the end (mask should clear at the true bottom of the text).
 */
export function useCutoffScrollFade(active: boolean) {
  const scrollRef = useRef<HTMLElement | null>(null);
  const sentinelVisibleRef = useRef(false);
  const [showFade, setShowFade] = useState(false);
  /** True while scrollTop is at/near the top — for SCROLL FOR MORE arrow opacity. */
  const [atTop, setAtTop] = useState(true);

  const updateFade = useCallback((scrollTopOverride?: number) => {
    const el = scrollRef.current;
    const setCutoff = (on: boolean) => {
      const shell = el?.parentElement;
      if (!shell?.classList.contains("profile-summary-card-scroll-shell")) return;
      shell.classList.toggle("is-cutoff", on);
      const token = on ? "1" : "0";
      if (shell.style.getPropertyValue("--profile-cutoff") !== token) {
        shell.style.setProperty("--profile-cutoff", token);
      }
    };
    if (!el || !active) {
      setCutoff(false);
      setShowFade(false);
      setAtTop(true);
      return;
    }
    const bounce = el.querySelector<HTMLElement>(".profile-summary-card-scroll-bounce");
    const viewH = el.clientHeight;
    const nativeMax = Math.max(0, el.scrollHeight - viewH);
    const bounceH = Math.max(bounce?.scrollHeight ?? 0, bounce?.offsetHeight ?? 0);
    const jsMax = Math.max(0, bounceH - viewH);
    const max = nativeMax > 1 ? nativeMax : jsMax;
    const canScroll = max > 1;
    const top = scrollTopOverride ?? el.scrollTop;
    const nearTop = top <= 1;
    const atBottom = sentinelVisibleRef.current || top >= max - 1;
    const next = canScroll && !atBottom;
    setCutoff(next);
    setShowFade((prev) => (prev === next ? prev : next));
    setAtTop((prev) => (prev === nearTop ? prev : nearTop));
  }, [active]);

  useLayoutEffect(() => {
    updateFade();
    const el = scrollRef.current;
    if (!el || !active) return;

    const onScroll = () => updateFade();
    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("wheel", onScroll, { passive: true });

    const sentinel = el.querySelector(".profile-summary-card-scroll-end");
    const io =
      sentinel && typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            (entries) => {
              sentinelVisibleRef.current = entries.some((entry) => entry.isIntersecting);
              updateFade();
            },
            { root: el, threshold: 0, rootMargin: "0px" },
          )
        : null;
    if (sentinel && io) io.observe(sentinel);

    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => updateFade()) : null;
    ro?.observe(el);

    return () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("wheel", onScroll);
      io?.disconnect();
      ro?.disconnect();
    };
  }, [active, updateFade]);

  return { scrollRef, showFade, updateFade, atTop };
}
