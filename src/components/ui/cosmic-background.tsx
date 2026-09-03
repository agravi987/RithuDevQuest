"use client";

import { motion } from "motion/react";

type CosmicBackgroundProps = {
  className?: string;
  variant?: "hero" | "deep" | "minimal";
};

export function CosmicBackground({
  className,
  variant = "hero",
}: CosmicBackgroundProps) {
  if (variant === "minimal") {
    return (
      <div className={`absolute inset-0 overflow-hidden ${className ?? ""}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.80 0.18 142 / 0.3) 1px, transparent 1px), linear-gradient(90deg, oklch(0.80 0.18 142 / 0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>
    );
  }

  const isDeep = variant === "deep";

  return (
    <div className={`absolute inset-0 overflow-hidden ${className ?? ""}`}>
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: isDeep
            ? "linear-gradient(180deg, oklch(0.105 0.018 255) 0%, oklch(0.12 0.025 255) 35%, oklch(0.14 0.02 260) 65%, oklch(0.175 0.025 142) 100%)"
            : "linear-gradient(180deg, oklch(0.98 0.005 120) 0%, oklch(0.96 0.01 200) 50%, oklch(0.98 0.005 120) 100%)",
        }}
      />

      {/* Nebula orbs — slow drift */}
      <motion.div
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -20, 10, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[10%] top-[15%] size-[500px] rounded-full blur-[120px]"
        style={{
          background: isDeep
            ? "radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(56, 189, 248, 0.06) 0%, transparent 70%)",
        }}
      />
      <motion.div
        animate={{
          x: [0, -25, 15, 0],
          y: [0, 15, -25, 0],
          scale: [1, 0.9, 1.08, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
        className="absolute right-[10%] top-[40%] size-[400px] rounded-full blur-[100px]"
        style={{
          background: isDeep
            ? "radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(168, 85, 247, 0.05) 0%, transparent 70%)",
        }}
      />
      <motion.div
        animate={{
          x: [0, 20, -15, 0],
          y: [0, -10, 20, 0],
          scale: [1, 1.05, 0.92, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 7,
        }}
        className="absolute bottom-[20%] left-[40%] size-[350px] rounded-full blur-[90px]"
        style={{
          background: isDeep
            ? "radial-gradient(circle, rgba(251, 191, 36, 0.08) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(251, 191, 36, 0.04) 0%, transparent 70%)",
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: isDeep
            ? "linear-gradient(oklch(0.80 0.18 142 / 0.02) 1px, transparent 1px), linear-gradient(90deg, oklch(0.80 0.18 142 / 0.02) 1px, transparent 1px)"
            : "linear-gradient(oklch(0.80 0.18 142 / 0.015) 1px, transparent 1px), linear-gradient(90deg, oklch(0.80 0.18 142 / 0.015) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
    </div>
  );
}
