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

      /*
       * Match PROJECT DETAILS: the fade belongs to the non-scrolling host,
       * not the scrolling element, so the last line dissolves into the card
       * edge instead of having a black overlay painted over it.
       *
       * The iPad-landscape compatibility rule still contains an !important
       * mask reset, so the live mask must be written at important priority
       * until that legacy rule is removed.
       */
      const mask = on
        ? "linear-gradient(to bottom, #000 0%, #000 calc(100% - 0.75rem), rgba(0,0,0,0.72) calc(100% - 0.42rem), rgba(0,0,0,0.22) calc(100% - 0.16rem), rgba(0,0,0,0) 100%)"
        : "none";
      shell.style.setProperty("-webkit-mask-image", mask, "important");
      shell.style.setProperty("mask-image", mask, "important");

      /* Remove the old class-driven overlay path. */
      shell.classList.remove("is-cutoff");
      shell.style.removeProperty("--profile-cutoff");
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

      const shell = el.parentElement;
      if (shell?.classList.contains("profile-summary-card-scroll-shell")) {
        shell.style.removeProperty("-webkit-mask-image");
        shell.style.removeProperty("mask-image");
        shell.classList.remove("is-cutoff");
        shell.style.removeProperty("--profile-cutoff");
      }
    };
  }, [active, updateFade]);

  return { scrollRef, showFade, updateFade, atTop };
}
