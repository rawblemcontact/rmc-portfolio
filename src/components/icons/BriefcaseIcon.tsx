import { createLucideIcon } from "lucide-react";

/**
 * Edited Lucide Briefcase for EXPERIENCE — handle stops at the case top
 * (does not run through the body). Geometry from portfolio briefcase.svg.
 */
export const BriefcaseIcon = createLucideIcon("briefcase-edited", [
  [
    "path",
    {
      d: "M16 5.865V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2l.029 1.777",
      key: "handle",
    },
  ],
  ["rect", { width: "20", height: "14", x: "2", y: "6", rx: "2", key: "body" }],
]);
