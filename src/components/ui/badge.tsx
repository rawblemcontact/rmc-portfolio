import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const badgeVariants = cva(
  // @replit
  // Whitespace-nowrap: Badges should never wrap.
  "whitespace-nowrap inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" +
  " hover-elevate ",
  {
    variants: {
      variant: {
        default:
          // @replit shadow-xs instead of shadow, no hover because we use hover-elevate
          "border-transparent bg-primary text-primary-foreground shadow-xs",
        secondary:
          // @replit no hover because we use hover-elevate
          "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          // @replit shadow-xs instead of shadow, no hover because we use hover-elevate
          "border-transparent bg-destructive text-destructive-foreground shadow-xs",
          // @replit shadow-xs" - use badge outline variable
        outline: "text-foreground border [border-color:var(--badge-outline)]",
        /** Geist-style pill: rounded-full, subtle border, for dark surfaces (e.g. skills subskills) */
        pill:
          "rounded-full border border-white/12 bg-white/5 text-white/90 hover:bg-white/10 hover:border-white/20",
      },
      size: {
        sm: "px-2 py-0.35 text-[11px]",
        md: "px-2.5 py-0.5 text-xs",
        lg: "px-4 py-1.5 text-sm",
      },
    },
    compoundVariants: [
      { variant: "pill", size: "lg", class: "min-h-[49px] min-w-[142px]" },
    ],
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode
}

function Badge({ className, variant, size = "md", icon, children, ...props }: BadgeProps) {
  const iconSizeClass = size === "lg" ? "[&>svg]:size-6 [&>img]:size-6" : "[&>svg]:size-3.5 [&>img]:size-3.5";
  return (
    <div
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {icon ? <span className={cn(iconSizeClass, "shrink-0")}>{icon}</span> : null}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }
