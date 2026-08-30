"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { GALAXY } from "@/lib/galaxy-assets";

type SpaceshipPlayerProps = {
  className?: string;
  size?: number;
  /** IDLE = subtle float; CURRENT = float + soft glow pulse (next to current lesson). */
  state?: "idle" | "current";
  /** Show a small "YOU ARE HERE" pill underneath. */
  label?: boolean;
  /** Direction the ship faces. */
  direction?: "right" | "left";
  priority?: boolean;
};

/**
 * The learner's spaceship. Represents the user's current position.
 * Intentionally NOT a decorative card image — it marks location/progress.
 */
export function SpaceshipPlayer({
  className,
  size = 64,
  state = "idle",
  label = false,
  direction = "right",
  priority = false,
}: SpaceshipPlayerProps) {
  const isCurrent = state === "current";

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      {isCurrent && (
        <motion.div
          aria-hidden
          animate={{ scale: [1, 1.35, 1], opacity: [0.4, 0.08, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -inset-4 rounded-full blur-xl"
          style={{
            background:
              "radial-gradient(circle, rgba(251,191,36,0.5) 0%, transparent 70%)",
          }}
        />
      )}

      <motion.div
        animate={{
          y: state === "current" ? [0, -6, 0] : [0, -4, 0],
          rotate: direction === "right" ? [0, -3, 0] : [0, 3, 0],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className={cn(
          "relative drop-shadow-[0_6px_12px_rgba(0,0,0,0.4)]",
          direction === "left" && "-scale-x-100",
        )}
        style={{ width: size, height: size }}
      >
        <Image
          src={GALAXY.spacecraft.spaceship}
          alt="Your spaceship"
          width={size}
          height={size}
          priority={priority}
          draggable={false}
          className="size-full object-contain"
        />
        {/* Engine flame */}
        <motion.div
          aria-hidden
          animate={{ scaleX: [1, 0.7, 1], opacity: [0.7, 0.35, 0.7] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="absolute -bottom-1 left-1/2 h-3 w-2 -translate-x-1/2 rounded-full bg-gradient-to-t from-transparent to-amber-400 blur-[2px]"
        />
      </motion.div>

      {label && (
        <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-muted-foreground backdrop-blur-sm">
          You are here
        </span>
      )}
    </div>
  );
}
