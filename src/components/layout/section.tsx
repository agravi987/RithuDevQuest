import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionProps = {
  className?: string;
  children: ReactNode;
  /**
   * Vertical rhythm. Use explicitly when a section's spacing differs from the
   * app-wide default so whitespace stays consistent.
   */
  spacing?: "sm" | "default" | "lg" | "none";
  id?: string;
};

const spacingMap = {
  none: "",
  sm: "py-6 sm:py-8",
  default: "py-10 sm:py-14 lg:py-16",
  lg: "py-16 sm:py-20 lg:py-24",
} as const;

export function Section({
  className,
  children,
  spacing = "default",
  id,
}: SectionProps) {
  return (
    <section id={id} className={cn("w-full", spacingMap[spacing], className)}>
      {children}
    </section>
  );
}
