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
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      {...rest}
    >
      {/* head */}
      <path d="M12 12a4 4 0 1 0 0-8a4 4 0 0 0 0 8Z" />
      {/* shoulders/body */}
      <path d="M4 22c0-4.418 3.582-8 8-8s8 3.582 8 8v0.5H4V22Z" />
    </svg>
  );
}

