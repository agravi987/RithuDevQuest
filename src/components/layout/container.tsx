import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ContainerProps = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  /**
   * Layout width. "default" caps at max-w-6xl, "wide" at max-w-7xl, "narrow"
   * centers readable content at max-w-3xl.
   */
  size?: "default" | "wide" | "narrow" | "full";
};

export function Container({
  as: Tag = "div",
  className,
  size = "default",
  children,
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        size === "default" && "max-w-6xl",
        size === "wide" && "max-w-7xl",
        size === "narrow" && "max-w-3xl",
        size === "full" && "max-w-none px-0",
        className
      )}
    >
      {children}
    </Tag>
  );
}
