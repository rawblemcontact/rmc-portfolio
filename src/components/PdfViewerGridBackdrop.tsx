import { useState } from "react";

const GRID_DRIFT_DURATION = 12;
const GRID_CELL_SIZE = 48;

const gridOverlayStyle: React.CSSProperties = {
  backgroundColor: "#121212",
  backgroundImage: `repeating-linear-gradient(90deg, rgba(255,255,255,0.38) 0, rgba(255,255,255,0.38) 1px, rgba(255,255,255,0) 1px, rgba(255,255,255,0) ${GRID_CELL_SIZE}px), repeating-linear-gradient(0deg, rgba(255,255,255,0.38) 0, rgba(255,255,255,0.38) 1px, rgba(255,255,255,0) 1px, rgba(255,255,255,0) ${GRID_CELL_SIZE}px)`,
  backgroundSize: `${GRID_CELL_SIZE}px ${GRID_CELL_SIZE}px`,
  WebkitBackgroundSize: `${GRID_CELL_SIZE}px ${GRID_CELL_SIZE}px`,
};

/** Full-viewport grid for PDF viewer — always opaque; never tied to dialog fade motion. */
export function PdfViewerGridBackdrop({ className = "" }: { className?: string }) {
  const [delay] = useState(() => `-${(performance.now() / 1000) % GRID_DRIFT_DURATION}s`);
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-0 grid-drift-bg portfolio-grid-overlay ${className}`.trim()}
      style={{ ...gridOverlayStyle, animationDelay: delay }}
      aria-hidden
    />
  );
}
