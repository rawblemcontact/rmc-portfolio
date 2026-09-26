import * as React from "react";
import { cn } from "../../lib/utils";

type UserFilledIconProps = {
  className?: string;
  "aria-hidden"?: boolean;
};

/**
 * Filled silhouette for the edited PROFILE `User` icon.
 * Same closed body + head as the outline (fill-only, no double-stroke fringe).
 */
export function UserFilledIcon({ className, ...rest }: UserFilledIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      overflow="hidden"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("overflow-hidden", className)}
      {...rest}
    >
      <circle cx="12" cy="7" r="4" />
      <path d="M19 21.147V19a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2.147z" />
    </svg>
  );
}
