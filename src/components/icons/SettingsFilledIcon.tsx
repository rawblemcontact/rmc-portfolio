import * as React from "react";
import { cn } from "../../lib/utils";

type SettingsFilledIconProps = {
  className?: string;
  "aria-hidden"?: boolean;
};

/**
 * Filled hover/active variant for Lucide `Settings`.
 * Gear body fills with `currentColor`; inner circle is solid black.
 */
export function SettingsFilledIcon({ className, ...rest }: SettingsFilledIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      overflow="hidden"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("overflow-hidden", className)}
      {...rest}
    >
      {/* Lucide Settings gear path (v0.545) — solid fill */}
      <path
        d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"
        fill="currentColor"
      />
      {/* Hub — solid black fill */}
      <circle cx="12" cy="12" r="3" fill="#000" />
    </svg>
  );
}
