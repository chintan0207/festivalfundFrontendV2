/* eslint-disable react-refresh/only-export-components */
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  cn(
    // Base (mobile-first)
    "inline-flex items-center justify-center gap-2",
    "whitespace-nowrap rounded-md font-medium",
    "transition-colors transition-shadow",
    "disabled:pointer-events-none disabled:opacity-50",
    "outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",

    // Icon handling
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "[&_svg:not([class*='size-'])]:size-4",

    // Touch target
    "min-h-[44px] min-w-[44px]"
  ),
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border border-accent " +
          "supports-hover:hover:bg-primary/90",

        destructive:
          "bg-destructive text-white " +
          "supports-hover:hover:bg-destructive/90",

        outline:
          "border bg-background shadow-xs " +
          "supports-hover:hover:bg-accent supports-hover:hover:text-accent-foreground",

        secondary:
          "bg-secondary text-secondary-foreground " +
          "supports-hover:hover:bg-secondary/80",

        ghost:
          "supports-hover:hover:bg-accent supports-hover:hover:text-accent-foreground",

        link: "text-primary underline-offset-4 supports-hover:hover:underline",
      },

      size: {
        // Mobile-first, desktop-tightened
        default: "text-base px-5 py-3 sm:text-sm sm:px-4 sm:py-2",

        sm: "text-sm px-4 py-2 sm:text-xs sm:px-3 sm:py-1.5",

        lg: "text-lg px-6 py-4 sm:text-base sm:px-6 sm:py-3",

        icon: "size-11 sm:size-9",

        "icon-sm": "size-10 sm:size-8",

        "icon-lg": "size-12 sm:size-10",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
