import * as React from "react";
import { cn } from "../../lib/utils";

type UserFilledIconProps = {
  className?: string;
  "aria-hidden"?: boolean;
};

/**
 * Filled silhouette variant for Lucide's stroke-only `User` icon.
 * Matches Lucide 24x24 viewBox and uses `currentColor` for fill.
 */
export function UserFilledIcon({ className, ...rest }: UserFilledIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      overflow="hidden"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("overflow-hidden", className)}
      {...rest}
    >
      {/*
        Inset slightly so solid fill stays inside the Lucide User stroke (stroke is centered on the path).
        overflow="hidden" clips anti-aliasing that can extend past the viewBox.
      */}
      <g transform="translate(12 12) scale(0.93) translate(-12 -12)">
        {/* Same geometry as Lucide User: circle cx=12 cy=7 r=4 */}
        <circle cx="12" cy="7" r="4" />
        <path d="M4 22c0-4.418 3.582-8 8-8s8 3.582 8 8v0.5H4V22Z" />
      </g>
    </svg>
  );
}
