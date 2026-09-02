"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type OrbRingProps = {
  size?: number;
  color?: string;
  className?: string;
  speed?: number;
  children?: React.ReactNode;
};

export function OrbRing({
  size = 120,
  color = "rgba(255,255,255,0.15)",
  className,
  speed = 8,
  children,
}: OrbRingProps) {
  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      {/* Outer ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0"
      >
        <div
          className="absolute inset-0 rounded-full border-2 border-dashed"
          style={{ borderColor: color }}
        />
      </motion.div>

      {/* Inner ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: speed * 1.5, repeat: Infinity, ease: "linear" }}
        className="absolute inset-[15%]"
      >
        <div
          className="absolute inset-0 rounded-full border border-dashed"
          style={{ borderColor: color, opacity: 0.5 }}
        />
      </motion.div>

      {/* Orbiting dot */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: speed * 0.8, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0"
      >
        <div
          className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rounded-full"
          style={{
            background: color,
            boxShadow: `0 0 8px ${color}`,
          }}
        />
      </motion.div>

      {children}
    </div>
  );
}
