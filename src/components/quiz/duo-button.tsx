"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type DuoButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "neutral"
  | "ghost";

export type DuoButtonSize = "sm" | "md" | "lg";

export interface DuoButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: DuoButtonVariant;
  size?: DuoButtonSize;
  fullWidth?: boolean;
}

const variantStyles: Record<DuoButtonVariant, { base: string; bevel: string }> = {
  primary: {
    base: "bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black shadow-lg shadow-emerald-500/20",
    bevel: "border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1",
  },
  secondary: {
    base: "bg-cyan-500 hover:bg-cyan-400 text-cyan-950 font-black shadow-lg shadow-cyan-500/20",
    bevel: "border-b-4 border-cyan-700 active:border-b-0 active:translate-y-1",
  },
  danger: {
    base: "bg-rose-500 hover:bg-rose-400 text-white font-black shadow-lg shadow-rose-500/20",
    bevel: "border-b-4 border-rose-700 active:border-b-0 active:translate-y-1",
  },
  neutral: {
    base: "bg-white/10 hover:bg-white/15 text-white font-bold",
    bevel: "border-b-4 border-white/20 active:border-b-0 active:translate-y-1",
  },
  ghost: {
    base: "bg-transparent hover:bg-white/5 text-white/70 hover:text-white font-bold",
    bevel: "border-b-0 active:translate-y-0.5",
  },
};

const sizeStyles: Record<DuoButtonSize, string> = {
  sm: "py-2 px-3.5 text-xs rounded-xl",
  md: "py-2.5 px-5 text-sm sm:text-base rounded-2xl",
  lg: "py-3.5 sm:py-4 px-6 sm:px-8 text-base sm:text-lg rounded-2xl",
};

export const DuoButton = React.forwardRef<HTMLButtonElement, DuoButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      fullWidth = false,
      disabled = false,
      children,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const { base, bevel } = variantStyles[variant];

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 tracking-wide select-none cursor-pointer",
          "transition-all duration-75 uppercase touch-manipulation",
          base,
          !disabled && bevel,
          sizeStyles[size],
          fullWidth && "w-full",
          disabled &&
            "cursor-not-allowed bg-white/10 text-white/50 border-b-4 border-white/5 shadow-none active:translate-y-0 font-black",
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

DuoButton.displayName = "DuoButton";
