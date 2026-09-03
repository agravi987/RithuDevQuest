import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type StackProps = {
  className?: string;
  children: ReactNode;
  /** Gap size between stacked items. */
  gap?: "none" | "xs" | "sm" | "base" | "md" | "lg";
};

const gapMap = {
  none: "",
  xs: "space-y-2",
  sm: "space-y-3",
  base: "space-y-4",
  md: "space-y-6",
  lg: "space-y-8",
} as const;

export function Stack({ className, children, gap = "base" }: StackProps) {
  return <div className={cn("min-w-0", gapMap[gap], className)}>{children}</div>;
}
