"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { PlanetVisual } from "@/components/galaxy/planet-visual";
import { getPlanetForCareer } from "@/lib/galaxy-assets";

type CareerOption = {
  slug: string;
  title: string;
  progress?: number;
  pathCount?: number;
};

type CareerPickerProps = {
  careers: CareerOption[];
  activeSlug: string;
};

/**
 * The sector-selector of the Learning Galaxy. Each career is a planet
 * destination the explorer can fly toward. The planet is the anchor; the
 * orbit ring + progress arc communicate journey state.
 */
export function CareerPicker({ careers, activeSlug }: CareerPickerProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5">
      {careers.map((career, i) => {
        const active = career.slug === activeSlug;
        const planet = getPlanetForCareer(career.slug);
        const progress = career.progress ?? 0;

        return (
          <motion.div
            key={career.slug}
            initial={{ opacity: 0, y: 14, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.07, duration: 0.4, ease: "easeOut" }}
            whileHover={active ? undefined : { y: -4 }}
            whileTap={{ scale: 0.96 }}
          >
            <Link
              href={`/learn?career=${career.slug}`}
              aria-current={active ? "page" : undefined}
              aria-label={`${career.title} career sector${career.pathCount ? `, ${career.pathCount} paths` : ""}${progress > 0 ? `, ${progress}% explored` : ""}`}
              className={cn(
                "group flex flex-col items-center gap-2 rounded-2xl border px-4 py-3 transition-all duration-300",
                active
                  ? "border-foreground/25 bg-foreground/[0.04]"
                  : "border-transparent hover:border-foreground/10",
              )}
            >
              <div className="relative">
                <PlanetVisual
                  src={planet.src}
                  alt={planet.alt}
                  size={72}
                  orbit
                  glow={active}
                  float={active}
                  dormant={!active && progress === 0}
                  accentClass={
                    active
                      ? "bg-gradient-to-br from-white/20 to-transparent"
                      : undefined
                  }
                />
                {/* Ring track around the planet communicating progress */}
                <div
                  aria-hidden
                  className="absolute -inset-2 rounded-full"
                  style={{
                    background: `conic-gradient(from 0deg, oklch(0.8 0.18 142) ${progress}%, rgba(255,255,255,0.1) ${progress}%)`,
                    WebkitMask:
                      "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))",
                    mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))",
                    opacity: progress > 0 ? 1 : 0,
                  }}
                />
                {active && (
                  <span
                    aria-hidden
                    className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-primary text-[9px] font-black text-primary-foreground shadow"
                  >
                    ✓
                  </span>
                )}
              </div>

              <div className="text-center">
                <p
                  className={cn(
                    "text-xs font-bold leading-tight",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {career.title}
                </p>
                <p
                  className={cn(
                    "mt-0.5 text-[9px] font-semibold tabular-nums",
                    active
                      ? "text-primary"
                      : "text-muted-foreground/70",
                  )}
                >
                  {progress > 0
                    ? `${progress}%`
                    : career.pathCount
                      ? `${career.pathCount} paths`
                      : "Not started"}
                </p>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
