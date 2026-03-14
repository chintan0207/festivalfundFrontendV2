import * as React from "react";

import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        [
          "bg-card text-card-foreground",
          "flex flex-col gap-4 sm:gap-6",
          "rounded-lg sm:rounded-xl",
          "border border-border",
          "px-4 py-4 sm:px-6 sm:py-6",
        ],
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        [
          "@container/card-header",
          "grid auto-rows-min grid-cols-1 gap-2",
          "sm:grid-cols-[1fr_auto]",
          "items-start",
          "pb-3 sm:pb-6",
          "border-b border-border",
        ],
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-semibold leading-tight text-base sm:text-lg",
        className
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        "text-muted-foreground text-sm sm:text-[0.9rem] leading-relaxed",
        className
      )}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        [
          "justify-self-end self-start",
          "sm:col-start-2 sm:row-span-2 sm:row-start-1",
        ],
        className
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        "px-0 sm:px-0 text-sm sm:text-base leading-relaxed",
        className
      )}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        [
          "flex flex-col sm:flex-row gap-3 sm:gap-4",
          "items-stretch sm:items-center",
          "pt-4 sm:pt-6",
          "border-t border-border",
        ],
        className
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
