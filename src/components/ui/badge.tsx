/* eslint-disable react-refresh/only-export-components */
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  cn(
    // Base (mobile-first)
    "inline-flex items-center justify-center gap-1.5",
    "rounded-full font-medium whitespace-nowrap shrink-0",
    "transition-colors transition-shadow",
    "overflow-hidden",

    // Typography & spacing
    "text-xs sm:text-[11px]",
    "px-2.5 py-1 sm:px-2 sm:py-0.5",

    // Icon handling
    "[&>svg]:size-3 sm:[&>svg]:size-3.5",
    "[&>svg]:pointer-events-none",

    // Accessibility
    "focus-visible:ring-2 focus-visible:ring-ring/50",
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40"
  ),
  {
    variants: {
      variant: {
        default:
          "border border-transparent bg-primary text-primary-foreground " +
          "supports-hover:hover:bg-primary/90",

        secondary:
          "border border-transparent bg-secondary text-secondary-foreground " +
          "supports-hover:hover:bg-secondary/90",

        outline:
          "border border-border text-foreground " +
          "supports-hover:hover:bg-accent supports-hover:hover:text-accent-foreground",

        destructive:
          "border border-transparent bg-destructive text-white " +
          "supports-hover:hover:bg-destructive/90",

        /* ===== STATUS BADGES ===== */

        pending:
          "border-2 border-yellow-500/60 bg-yellow-500/10 text-yellow-700 " +
          "dark:text-yellow-400",

        deposited:
          "border-2 border-emerald-500/60 bg-emerald-500/40 text-emerald-700 " +
          "dark:text-emerald-400",

        cancelled:
          "border-2 border-red-500/60 bg-red-500/10 text-red-700 " +
          "dark:text-red-400",
      },
    },

    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
