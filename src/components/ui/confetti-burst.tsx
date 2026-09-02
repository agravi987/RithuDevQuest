"use client";

import { motion } from "motion/react";

type ConfettiBurstProps = {
  active: boolean;
};

const colors = ["#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#3b82f6"];

export function ConfettiBurst({ active }: ConfettiBurstProps) {
  if (!active) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 20 }).map((_, i) => {
        const color = colors[i % colors.length];
        const x = Math.random() * 100;
        const delay = Math.random() * 0.5;
        const size = 4 + Math.random() * 4;

        return (
          <motion.div
            key={i}
            initial={{ y: -20, x: `${x}%`, opacity: 1, scale: 1 }}
            animate={{
              y: [0, -60 - Math.random() * 40, 100],
              opacity: [1, 1, 0],
              scale: [1, 1.2, 0.5],
              rotate: [0, 180 + Math.random() * 180, 360],
            }}
            transition={{
              duration: 1.5 + Math.random() * 0.5,
              delay,
              ease: "easeOut",
            }}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              backgroundColor: color,
            }}
          />
        );
      })}
    </div>
  );
}
