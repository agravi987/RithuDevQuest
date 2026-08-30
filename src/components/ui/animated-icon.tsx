"use client";

import { motion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

type AnimatedIconProps = {
  children: React.ReactNode;
  className?: string;
  animation?: "bounce" | "spin" | "pulse" | "wiggle" | "float" | "pop" | "shake";
  size?: "sm" | "md" | "lg";
  color?: string;
};

const sizeClasses = {
  sm: "size-8",
  md: "size-10",
  lg: "size-12",
};

const animationVariants: Record<string, Variants> = {
  bounce: {
    idle: { y: 0 },
    hover: { y: -3, transition: { type: "spring", stiffness: 400 } },
    tap: { y: 0, scale: 0.9, transition: { type: "spring", stiffness: 400 } },
  },
  spin: {
    idle: { rotate: 0 },
    hover: { rotate: 15, transition: { type: "spring", stiffness: 200 } },
    tap: { rotate: -15, scale: 0.9, transition: { type: "spring", stiffness: 400 } },
  },
  pulse: {
    idle: { scale: 1 },
    hover: { scale: 1.15, transition: { type: "spring", stiffness: 300 } },
    tap: { scale: 0.95, transition: { type: "spring", stiffness: 400 } },
  },
  wiggle: {
    idle: { rotate: 0 },
    hover: { rotate: [0, -10, 10, -10, 0], transition: { duration: 0.4 } },
    tap: { rotate: 0, scale: 0.9, transition: { type: "spring" } },
  },
  float: {
    idle: { y: 0, rotate: 0 },
    hover: { y: -5, rotate: 5, transition: { type: "spring", stiffness: 200 } },
    tap: { y: 0, scale: 0.95, transition: { type: "spring" } },
  },
  pop: {
    idle: { scale: 1 },
    hover: { scale: [1, 1.2, 1], transition: { duration: 0.3 } },
    tap: { scale: [1, 0.8, 1], transition: { duration: 0.2 } },
  },
  shake: {
    idle: { x: 0 },
    hover: { x: [0, -3, 3, -3, 0], transition: { duration: 0.3 } },
    tap: { x: 0, scale: 0.9, transition: { type: "spring" } },
  },
};

const colorMap: Record<string, string> = {
  primary: "bg-primary/10 text-primary",
  xp: "bg-xp/10 text-xp",
  streak: "bg-streak/10 text-streak",
  achievement: "bg-achievement/10 text-achievement",
  level: "bg-level/10 text-level",
  muted: "bg-muted text-muted-foreground",
};

export function AnimatedIcon({
  children,
  className,
  animation = "bounce",
  size = "md",
  color,
}: AnimatedIconProps) {
  const colorClass = color ? colorMap[color] : "";

  return (
    <motion.div
      variants={animationVariants[animation]}
      initial="idle"
      whileHover="hover"
      whileTap="tap"
      className={cn(
        "grid place-items-center rounded-xl cursor-default",
        sizeClasses[size],
        colorClass,
        className
      )}
    >
      {children}
    </motion.div>
  );
}

/**
 * Floating emoji that bounces continuously
 */
export function FloatingEmoji({
  emoji,
  className,
  delay = 0,
  duration = 3,
}: {
  emoji: string;
  className?: string;
  delay?: number;
  duration?: number;
}) {
  return (
    <motion.span
      animate={{
        y: [0, -8, 0],
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
      className={cn("inline-block", className)}
    >
      {emoji}
    </motion.span>
  );
}
