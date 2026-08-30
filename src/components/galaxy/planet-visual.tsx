"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type PlanetVisualProps = {
  src: string;
  alt: string;
  size?: number;
  className?: string;
  /** Render a rotating dashed orbital ring behind the planet. */
  orbit?: boolean;
  /** Faster orbital ring (multi-ring look). */
  orbitDouble?: boolean;
  /** Pulsing glow behind the planet for active/available states. */
  glow?: boolean;
  /** Subtle floating idle animation. */
  float?: boolean;
  /** Dim/dormant appearance (locked / not-started). */
  dormant?: boolean;
  /** Radial accent tint overlay to blend the asset with the theme. */
  accentClass?: string;
  /** Image priority (for above-the-fold planets). */
  priority?: boolean;
};

/**
 * Renders a transparent planet PNG as a themed destination.
 * Keeps the planet as the visual anchor while layering orbital rings,
 * glow and float on top — without heavy duplicates or canvas.
 */
export function PlanetVisual({
  src,
  alt,
  size = 96,
  className,
  orbit = false,
  orbitDouble = false,
  glow = false,
  float = false,
  dormant = false,
  accentClass,
  priority = false,
}: PlanetVisualProps) {
  const inner = (
    <div
      className={cn("relative rounded-full select-none", className)}
      style={{ width: size, height: size }}
    >
      {glow && (
        <motion.div
          aria-hidden
          animate={{ scale: [1, 1.18, 1], opacity: [0.35, 0.15, 0.35] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -inset-3 rounded-full blur-xl"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.35) 0%, transparent 70%)",
          }}
        />
      )}

      <div
        className={cn(
          "relative size-full overflow-hidden rounded-full",
          dormant && "opacity-40 saturate-50",
        )}
      >
        <Image
          src={src}
          alt={alt}
          width={size}
          height={size}
          priority={priority}
          draggable={false}
          className="size-full object-contain"
        />
        {accentClass && (
          <div
            className={cn(
              "pointer-events-none absolute inset-0 mix-blend-overlay rounded-full",
              accentClass,
            )}
          />
        )}
      </div>

      {/* Orbital ring(s) */}
      {orbit && (
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-[18%] rounded-[50%] border border-white/25"
          style={{
            transform: "rotateX(68deg)",
            boxShadow: "0 0 12px rgba(255,255,255,0.15)",
          }}
        />
      )}
      {orbitDouble && (
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-[34%] rounded-[50%] border border-white/10"
          style={{ transform: "rotateX(68deg)" }}
        />
      )}
    </div>
  );

  if (!float) return inner;

  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      className="inline-block"
    >
      {inner}
    </motion.div>
  );
}
