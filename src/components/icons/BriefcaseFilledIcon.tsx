import * as React from "react";
import { cn } from "../../lib/utils";

type BriefcaseFilledIconProps = {
  className?: string;
  "aria-hidden"?: boolean;
};

/**
 * Filled hover/active variant for the edited EXPERIENCE briefcase.
 * Case fills solid; handle stays stroked so it reads above the body.
 */
export function BriefcaseFilledIcon({ className, ...rest }: BriefcaseFilledIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      overflow="hidden"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("overflow-hidden", className)}
      {...rest}
    >
      <rect width="20" height="14" x="2" y="6" rx="2" fill="currentColor" />
      <path
        d="M16 5.865V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2l.029 1.777"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
