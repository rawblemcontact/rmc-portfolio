import { useEffect, useState } from "react";
import { isDocumentPinchZoomed } from "../lib/visualViewport";
import { isNavLayoutFrozen } from "../lib/navLayoutFreeze";

const MOBILE_LANDSCAPE_MQ =
  "(orientation: landscape) and (max-height: 500px) and (max-width: 960px)";

const GRID_DRIFT_DURATION = 12;
const GRID_CELL_SIZE = 48;
const GRID_OVERLAY_STYLE: React.CSSProperties = {
  backgroundColor: "#121212",
  backgroundImage: `repeating-linear-gradient(90deg, rgba(255,255,255,0.38) 0, rgba(255,255,255,0.38) 1px, rgba(255,255,255,0) 1px, rgba(255,255,255,0) ${GRID_CELL_SIZE}px), repeating-linear-gradient(0deg, rgba(255,255,255,0.38) 0, rgba(255,255,255,0.38) 1px, rgba(255,255,255,0) 1px, rgba(255,255,255,0) ${GRID_CELL_SIZE}px)`,
  backgroundSize: `${GRID_CELL_SIZE}px ${GRID_CELL_SIZE}px`,
  WebkitBackgroundSize: `${GRID_CELL_SIZE}px ${GRID_CELL_SIZE}px`,
};

/**
 * Phone-only landscape gate. Covers the SPA with the site grid on black.
 * Tablet / desktop are untouched (short landscape height + width cap excludes
 * iPad landscape and normal desktop). True Screen Orientation lock is not used
 * — unreliable on iOS Safari.
 *
 * Note: `(max-width: 767px) and (orientation: landscape)` does not work for
 * real phones — in landscape the CSS width is the long edge (~667–932px).
 */
export function MobileLandscapeGate() {
  const [blocked, setBlocked] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(MOBILE_LANDSCAPE_MQ).matches;
  });
  const [delay] = useState(
    () =>
      typeof performance === "undefined"
        ? "0s"
        : `-${(performance.now() / 1000) % GRID_DRIFT_DURATION}s`,
  );

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
      aria-hidden
      className="fixed inset-0 z-[9999] overflow-hidden bg-black"
      style={{ touchAction: "none" }}
      onTouchMove={(e) => e.preventDefault()}
      onWheel={(e) => e.preventDefault()}
    >
      <div
        className="mobile-landscape-gate-grid pointer-events-none absolute inset-0 z-0 grid-drift-bg portfolio-grid-overlay"
        style={{
          ...GRID_OVERLAY_STYLE,
          ["--portfolio-grid-drift-delay" as string]: delay,
          animationDelay: delay,
        }}
      />
    </div>
  );
}
