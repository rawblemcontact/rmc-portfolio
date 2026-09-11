import { useState } from "react";

const GRID_DRIFT_DURATION = 12;
const GRID_CELL_SIZE = 48;

const gridOverlayStyle: React.CSSProperties = {
  backgroundColor: "#121212",
  backgroundImage: `repeating-linear-gradient(90deg, rgba(255,255,255,0.38) 0, rgba(255,255,255,0.38) 1px, rgba(255,255,255,0) 1px, rgba(255,255,255,0) ${GRID_CELL_SIZE}px), repeating-linear-gradient(0deg, rgba(255,255,255,0.38) 0, rgba(255,255,255,0.38) 1px, rgba(255,255,255,0) 1px, rgba(255,255,255,0) ${GRID_CELL_SIZE}px)`,
  backgroundSize: `${GRID_CELL_SIZE}px ${GRID_CELL_SIZE}px`,
  WebkitBackgroundSize: `${GRID_CELL_SIZE}px ${GRID_CELL_SIZE}px`,
};

/** Full-viewport grid for PDF viewer, phase-aligned with the underlying section grid. */
export function PdfViewerGridBackdrop({
  className = "",
  scrollOffsetY = 0,
}: {
  className?: string;
  scrollOffsetY?: number;
}) {
  const [delay] = useState(() => `-${(performance.now() / 1000) % GRID_DRIFT_DURATION}s`);
  const wrappedOffsetY = -(((scrollOffsetY % GRID_CELL_SIZE) + GRID_CELL_SIZE) % GRID_CELL_SIZE);
  return (
    <div
      className={`pdf-viewer-grid-backdrop pointer-events-none absolute inset-0 z-0 grid-drift-bg portfolio-grid-overlay ${className}`.trim()}
      style={{
        ...gridOverlayStyle,
        animationDelay: delay,
        ["--pdf-grid-offset-y" as string]: `${wrappedOffsetY}px`,
      }}
      aria-hidden
    />
  );
}
