import { createLucideIcon } from "lucide-react";

/**
 * Edited Lucide User for PROFILE — body closed flat at y≈21.15
 * (squares arm ends / seals bottom notch). Geometry from portfolio user.svg.
 */
export const UserIcon = createLucideIcon("user-edited", [
  [
    "path",
    {
      d: "M19 21.147V19a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2.147z",
      key: "body",
    },
  ],
  ["circle", { cx: "12", cy: "7", r: "4", key: "head" }],
]);
