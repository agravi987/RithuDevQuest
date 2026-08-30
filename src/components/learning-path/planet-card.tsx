"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type PlanetCardProps = {
  slug: string;
  title: string;
  description: string | null;
  moduleCount: number;
  lessonCount: number;
  progress?: number;
  href: string;
};

const planetStyles: Record<
  string,
  {
    planet: string;
    ring: string;
    orbit: string;
    bg: string;
    glow: string;
    emoji: string;
    subtitle: string;
  }
> = {
  linux: {
    planet: "from-emerald-400 via-green-500 to-teal-600",
    ring: "border-emerald-400/30",
    orbit: "border-emerald-400/10",
    bg: "dark:from-emerald-950/40 dark:via-green-950/20 dark:to-teal-950/30 from-emerald-100/80 via-green-50/80 to-teal-100/80",
    glow: "shadow-emerald-500/20",
    emoji: "🐧",
    subtitle: "The Command Planet",
  },
  git: {
    planet: "from-blue-400 via-indigo-500 to-blue-600",
    ring: "border-blue-400/30",
    orbit: "border-blue-400/10",
    bg: "dark:from-blue-950/40 dark:via-indigo-950/20 dark:to-blue-950/30 from-blue-100/80 via-indigo-50/80 to-blue-100/80",
    glow: "shadow-blue-500/20",
    emoji: "🔀",
    subtitle: "The Branch Moon",
  },
  docker: {
    planet: "from-cyan-400 via-sky-500 to-cyan-600",
    ring: "border-cyan-400/30",
    orbit: "border-cyan-400/10",
    bg: "dark:from-cyan-950/40 dark:via-sky-950/20 dark:to-cyan-950/30 from-cyan-100/80 via-sky-50/80 to-cyan-100/80",
    glow: "shadow-cyan-500/20",
    emoji: "🐳",
    subtitle: "The Container World",
  },
  kubernetes: {
    planet: "from-purple-400 via-violet-500 to-purple-600",
    ring: "border-purple-400/30",
    orbit: "border-purple-400/10",
    bg: "dark:from-purple-950/40 dark:via-violet-950/20 dark:to-purple-950/30 from-purple-100/80 via-violet-50/80 to-purple-100/80",
    glow: "shadow-purple-500/20",
    emoji: "☸️",
    subtitle: "The Deep Space Station",
  },
};

// Deterministic pseudo-random for SSR-safe particle positions
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export function PlanetCard({
  slug,
  title,
  description,
  moduleCount,
  lessonCount,
  progress = 0,
  href,
}: PlanetCardProps) {
  const style = planetStyles[slug] ?? planetStyles.linux;

  return (
    <Link
      href={href}
      className="block group"
      aria-label={`${title}: ${moduleCount} modules, ${lessonCount} lessons`}
    >
      <motion.div
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={cn(
          "relative overflow-hidden rounded-3xl border p-4 sm:p-6 transition-all",
          "border-border",
          "bg-gradient-to-br",
          style.bg,
          "backdrop-blur-sm",
          "hover:shadow-2xl",
          style.glow,
        )}
      >
        {/* Starfield background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute size-0.5 rounded-full bg-white animate-float"
              style={{
                left: `${seededRandom(i * 3 + 1) * 100}%`,
                top: `${seededRandom(i * 3 + 2) * 100}%`,
                opacity: seededRandom(i * 3 + 3) * 0.5 + 0.1,
                animationDelay: `${seededRandom(i * 5 + 4) * 3}s`,
                animationDuration: `${3 + seededRandom(i * 5 + 5) * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Atmospheric rim lighting for depth */}
        <div
          className={cn(
            "absolute inset-0 opacity-40 pointer-events-none bg-gradient-to-t from-white/40 via-transparent to-black/10 dark:from-black/40 dark:via-transparent dark:to-white/10",
          )}
        />

        <div className="relative z-10">
          {/* Planet and orbit */}
          <div className="flex items-start justify-between mb-4">
            <div className="relative scale-90 sm:scale-100">
              {/* Outer orbit ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className={cn(
                  "absolute -inset-4 rounded-full border border-dashed spin-on-hover",
                  style.orbit,
                )}
                style={{ transformStyle: "preserve-3d" }}
              />
              {/* Planet */}
              <div
                className={cn(
                  "relative grid size-16 place-items-center rounded-full bg-gradient-to-br shadow-xl",
                  style.planet,
                  style.glow,
                )}
                style={{
                  boxShadow: `inset 0 -15px 25px -10px rgba(0,0,0,0.5), inset 0 8px 15px -8px rgba(255,255,255,0.25), 0 10px 25px -8px rgba(0,0,0,0.5)`,
                }}
              >
                <span className="text-3xl drop-shadow-lg">{style.emoji}</span>
                {/* Orbital ring */}
                <div
                  className={cn(
                    "absolute -inset-1 rounded-full border-2 opacity-50",
                    style.ring,
                  )}
                  style={{
                    transform: "rotateX(60deg)",
                  }}
                />
                {/* Atmosphere glow on planet top */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/15 to-transparent opacity-70" />
              </div>
            </div>

            {/* Progress badge */}
            <div className="flex flex-col items-end gap-1">
              <span className="rounded-full bg-foreground/10 px-2.5 py-0.5 text-[10px] font-bold text-foreground/80 backdrop-blur-sm">
                {lessonCount} lessons
              </span>
              {progress > 0 && (
                <span className="rounded-full bg-foreground/10 px-2.5 py-0.5 text-[10px] font-bold text-foreground/80 backdrop-blur-sm">
                  {progress}% complete
                </span>
              )}
            </div>
          </div>

          {/* Title and description */}
          <div className="mb-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">
              {style.subtitle}
            </p>
            <h3 className="text-lg sm:text-xl font-black text-foreground tracking-tight truncate">
              {title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {description ??
                `Explore ${moduleCount} modules of ${title.toLowerCase()} mastery`}
            </p>
          </div>

          {/* Module chips - horizontally scrollable on mobile */}
          <div className="flex flex-nowrap gap-1.5 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1 snap-x">
            {Array.from({ length: Math.min(moduleCount, 5) }).map((_, i) => (
              <span
                key={i}
                className="shrink-0 snap-start rounded-full bg-foreground/5 border border-foreground/10 px-2 py-0.5 text-[9px] font-medium text-muted-foreground tabular-nums"
              >
                Module {i + 1}
              </span>
            ))}
            {moduleCount > 5 && (
              <span className="shrink-0 snap-start rounded-full bg-foreground/5 border border-foreground/10 px-2 py-0.5 text-[9px] font-medium text-muted-foreground">
                +{moduleCount - 5} more
              </span>
            )}
          </div>

          {/* Progress bar */}
          {progress > 0 && (
            <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                className={cn(
                  "h-full rounded-full bg-gradient-to-r",
                  style.planet,
                )}
              />
            </div>
          )}
        </div>

        {/* Hover glow */}
        <div
          className={cn(
            "absolute -right-12 -top-12 size-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500",
            `bg-gradient-to-br ${style.planet}`,
          )}
        />
      </motion.div>
    </Link>
  );
}
