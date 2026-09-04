"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Sparkles, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPathVisual } from "@/lib/career-metadata";

type PlanetCardProps = {
  slug: string;
  title: string;
  description: string | null;
  moduleCount: number;
  lessonCount: number;
  progress?: number;
  href: string;
};

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
  const style = getPathVisual(slug);
  const isStarted = progress > 0;
  const isComplete = progress === 100;

  return (
    <Link
      href={href}
      className="block group"
      aria-label={`${title}: ${moduleCount} modules, ${lessonCount} lessons`}
    >
      <motion.div
        whileHover={{ scale: 1.02, y: -6 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={cn(
          "relative overflow-hidden rounded-3xl border p-4 sm:p-6 transition-all",
          "border-border/50",
          "bg-gradient-to-br",
          style.bg,
          "backdrop-blur-sm",
          "hover:shadow-2xl hover:border-primary/20",
          style.glow,
          "card-game-glow",
        )}
      >
        {/* Starfield */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute size-0.5 rounded-full bg-white/40 animate-twinkle"
              style={{
                left: `${seededRandom(i * 3 + 1) * 100}%`,
                top: `${seededRandom(i * 3 + 2) * 100}%`,
                opacity: seededRandom(i * 3 + 3) * 0.4 + 0.1,
                ["--duration" as string]: `${2 + seededRandom(i * 5 + 4) * 3}s`,
                ["--delay" as string]: `${seededRandom(i * 5 + 5) * 2}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          {/* Planet + orbit */}
          <div className="flex items-start justify-between mb-4">
            <div className="relative">
              {/* Outer orbital ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-5 rounded-full border border-dashed"
                style={{ borderColor: `${style.planet.includes('emerald') ? 'rgba(52,211,153,0.12)' : style.planet.includes('blue') ? 'rgba(96,165,250,0.12)' : 'rgba(255,255,255,0.08)'}` }}
              />
              {/* Inner orbital ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-2.5 rounded-full border border-dashed"
                style={{ borderColor: `${style.planet.includes('emerald') ? 'rgba(52,211,153,0.18)' : style.planet.includes('blue') ? 'rgba(96,165,250,0.18)' : 'rgba(255,255,255,0.12)'}` }}
              />
              {/* Planet sphere */}
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <div
                  className={cn(
                    "relative grid size-16 sm:size-18 place-items-center rounded-full bg-gradient-to-br shadow-xl",
                    style.planet,
                    style.glow,
                  )}
                  style={{
                    boxShadow: `inset 0 -15px 25px -10px rgba(0,0,0,0.5), inset 0 8px 15px -8px rgba(255,255,255,0.25), 0 10px 30px -8px rgba(0,0,0,0.5)`,
                  }}
                >
                  <span className="text-2xl sm:text-3xl drop-shadow-lg">{style.emoji}</span>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/15 to-transparent opacity-70" />
                  {/* Specular highlight */}
                  <div className="pointer-events-none absolute left-[18%] top-[12%] size-3 rounded-full bg-white/30 blur-[1px]" />
                </div>

                {/* Completed reward ring */}
                {isComplete && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    className="pointer-events-none absolute -inset-1.5 rounded-full"
                    style={{
                      background:
                        "conic-gradient(from 0deg, rgba(52,211,153,0.6), rgba(251,191,36,0.6), rgba(255,255,255,0.15), rgba(52,211,153,0.6))",
                      WebkitMask:
                        "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1px))",
                      mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1px))",
                    }}
                  />
                )}

                {/* In-progress sparkle */}
                {isStarted && !isComplete && (
                  <motion.div
                    animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="pointer-events-none absolute -right-1 -top-1"
                  >
                    <Sparkles className="size-3.5 text-amber-400 fill-amber-400/40" />
                  </motion.div>
                )}
              </motion.div>
            </div>

            <div className="flex flex-col items-end gap-1.5">
              <span className="rounded-full bg-foreground/10 px-2.5 py-1 text-[10px] font-bold text-foreground/80 backdrop-blur-sm">
                {lessonCount} lessons
              </span>
              {isComplete && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/15 px-2.5 py-1 text-[10px] font-bold text-emerald-500 dark:text-emerald-400 backdrop-blur-sm">
                  <Crown className="size-3" /> Conquered
                </span>
              )}
              {isStarted && !isComplete && (
                <span className="rounded-full px-2.5 py-1 text-[10px] font-bold backdrop-blur-sm"
                  style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}>
                  {progress}%
                </span>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="mb-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">
              {style.subtitle}
            </p>
            <h3 className="text-lg sm:text-xl font-black text-foreground tracking-tight truncate">
              {title}
            </h3>
            {description && (
              <p className="text-xs text-muted-foreground/80 mt-1 line-clamp-2 leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {/* Modules */}
          <div className="flex flex-nowrap gap-1.5 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
            {Array.from({ length: Math.min(moduleCount, 4) }).map((_, i) => (
              <span
                key={i}
                className="shrink-0 rounded-full bg-foreground/5 border border-foreground/10 px-2 py-0.5 text-[9px] font-medium text-muted-foreground"
              >
                M{i + 1}
              </span>
            ))}
            {moduleCount > 4 && (
              <span className="shrink-0 rounded-full bg-foreground/5 border border-foreground/10 px-2 py-0.5 text-[9px] font-medium text-muted-foreground">
                +{moduleCount - 4}
              </span>
            )}
          </div>

          {/* Progress */}
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-muted-foreground/60">
                {isComplete ? "Completed" : isStarted ? "In Progress" : "Not started"}
              </span>
              <span className="text-[10px] font-bold text-muted-foreground/40">
                {progress}%
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/30">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                className={cn("h-full rounded-full relative", isComplete ? "bg-emerald-400" : "bg-gradient-to-r", isComplete ? "" : style.planet)}
              >
                {progress > 0 && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />}
              </motion.div>
            </div>
          </div>

          {/* Action hint */}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground/60 group-hover:text-foreground/80 transition-colors">
              {isComplete ? "Review world" : isStarted ? "Continue journey" : "Begin journey"}
            </span>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold transition-all duration-200",
                isComplete
                  ? "bg-emerald-400/15 text-emerald-500 dark:text-emerald-400"
                  : isStarted
                    ? "bg-amber-400/15 text-amber-500 dark:text-amber-400"
                    : "bg-primary/10 text-primary",
              )}
            >
              <span className="hidden sm:inline">{isComplete ? "Explore again" : isStarted ? "Resume" : "Launch"}</span>
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              >
                →
              </motion.span>
            </span>
          </div>
        </div>

        {/* Hover glow */}
        <div
          className={cn(
            "absolute -right-10 -top-10 size-28 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500",
            `bg-gradient-to-br ${style.planet}`,
          )}
        />
      </motion.div>
    </Link>
  );
}
