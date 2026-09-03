import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type GridProps = {
  className?: string;
  children: ReactNode;
  /**
   * Column count at various breakpoints, e.g. "grid-cols-1 sm:grid-cols-2
   * lg:grid-cols-3". Passed straight through to className.
   */
  cols?: string;
  gap?: "none" | "xs" | "sm" | "base" | "md" | "lg";
};

const gapMap = {
  none: "gap-0",
  xs: "gap-2",
  sm: "gap-3",
  base: "gap-4",
  md: "gap-6",
  lg: "gap-8",
} as const;

export function Grid({
  className,
  children,
  cols = "grid-cols-1",
  gap = "base",
}: GridProps) {
  return (
    <div className={cn("grid min-w-0", cols, gapMap[gap], className)}>
      {children}
    </div>
  );
}
