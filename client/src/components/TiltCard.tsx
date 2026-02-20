import { useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";

type TiltCardProps = {
  children: React.ReactNode;
  className?: string;
  /** Max tilt degrees (recommended 4–10). */
  maxTilt?: number;
  /** Perspective in px (recommended 800–1400). */
  perspective?: number;
  /** Slight scale on hover (recommended 1.0–1.03). */
  hoverScale?: number;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function TiltCard({
  children,
  className,
  maxTilt = 7,
  perspective = 1000,
  hoverScale = 1.015,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  const enabled = useMemo(() => {
    if (typeof window === "undefined") return false;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    const fine = window.matchMedia?.("(hover: hover) and (pointer: fine)")?.matches ?? false;
    return !reduce && fine;
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    let raf = 0;
    let bounds: DOMRect | null = null;
    let isHovering = false;

    const setTransform = (rx: number, ry: number, scale: number) => {
      el.style.transform = `perspective(${perspective}px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${scale})`;
    };

    const onEnter = () => {
      isHovering = true;
      bounds = el.getBoundingClientRect();
      el.style.willChange = "transform";
      el.style.transition = "transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1)";
    };

    const onMove = (e: PointerEvent) => {
      if (!isHovering) return;
      if (!bounds) bounds = el.getBoundingClientRect();

      const x = (e.clientX - bounds.left) / bounds.width;
      const y = (e.clientY - bounds.top) / bounds.height;

      // -1..1 with center at 0
      const dx = clamp((x - 0.5) * 2, -1, 1);
      const dy = clamp((y - 0.5) * 2, -1, 1);

      const rx = -dy * maxTilt; // up/down
      const ry = dx * maxTilt; // left/right

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setTransform(rx, ry, hoverScale));
    };

    const onLeave = () => {
      isHovering = false;
      bounds = null;
      cancelAnimationFrame(raf);
      el.style.transition = "transform 520ms cubic-bezier(0.2, 0.9, 0.2, 1)";
      setTransform(0, 0, 1);
      // Let the reset animate, then drop will-change to avoid blur/jank.
      window.setTimeout(() => {
        if (!isHovering) el.style.willChange = "auto";
      }, 600);
    };

    // Use pointer events so it works for pen/mouse and ignores touch (due to enabled check).
    el.addEventListener("pointerenter", onEnter, { passive: true });
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave, { passive: true });

    // Initialize
    setTransform(0, 0, 1);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.style.transform = "";
      el.style.transition = "";
      el.style.willChange = "";
    };
  }, [enabled, hoverScale, maxTilt, perspective]);

  return (
    <div
      ref={ref}
      className={cn("transform-gpu [transform-style:preserve-3d]", className)}
    >
      {children}
    </div>
  );
}

