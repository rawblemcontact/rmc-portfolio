import { useEffect, useState } from "react";
import { isDocumentPinchZoomed } from "../lib/visualViewport";
import { isNavLayoutFrozen } from "../lib/navLayoutFreeze";

const MOBILE_LANDSCAPE_MQ =
  "(orientation: landscape) and (max-height: 500px) and (max-width: 960px)";

/**
 * Phone-only landscape gate. Covers the SPA and asks the user to rotate back
 * to portrait. Tablet / desktop are untouched (short landscape height + width
 * cap excludes iPad landscape and normal desktop). True Screen Orientation
 * lock is not used — unreliable on iOS Safari.
 *
 * Note: `(max-width: 767px) and (orientation: landscape)` does not work for
 * real phones — in landscape the CSS width is the long edge (~667–932px).
 */
export function MobileLandscapeGate() {
  const [blocked, setBlocked] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(MOBILE_LANDSCAPE_MQ).matches;
  });

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_LANDSCAPE_MQ);
    const sync = () => {
      if (isDocumentPinchZoomed() || isNavLayoutFrozen()) return;
      setBlocked(mq.matches);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!blocked) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [blocked]);

  if (!blocked) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Rotate device to portrait"
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-5 bg-black px-6 text-white"
      style={{ touchAction: "none" }}
      onTouchMove={(e) => e.preventDefault()}
      onWheel={(e) => e.preventDefault()}
    >
      <div
        className="pointer-events-none absolute inset-0 portfolio-grid-overlay opacity-40"
        aria-hidden
      />
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-[1] text-white motion-safe:animate-pulse"
        aria-hidden
      >
        <rect
          x="14"
          y="6"
          width="20"
          height="36"
          rx="3"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M38 18c3.5 2.5 5 6.5 5 10.5S41.5 36 38 38.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M36 36.5l2 3.5 3.5-2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p className="relative z-[1] m-0 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-zinc-400">
        SYSTEM // ORIENTATION
      </p>
      <p className="relative z-[1] m-0 max-w-[18rem] text-center font-display text-[1.05rem] font-bold uppercase tracking-[0.08em]">
        Rotate to portrait
      </p>
      <p className="relative z-[1] m-0 max-w-[20rem] text-center font-display text-[0.75rem] font-medium uppercase tracking-[0.06em] text-zinc-500">
        This portfolio is designed for portrait phones only
      </p>
    </div>
  );
}
