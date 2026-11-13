"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { PlanetVisual } from "@/components/galaxy/planet-visual";
import { getPlanetForCareer } from "@/lib/galaxy-assets";
import { playTapPopSound } from "@/lib/sounds";

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

export function CareerPicker({ careers, activeSlug }: CareerPickerProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 select-none">
      {careers.map((career, i) => {
        const active = career.slug === activeSlug;
        const planet = getPlanetForCareer(career.slug);
        const progress = career.progress ?? 0;

        return (
          <motion.div
            key={career.slug}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
          >
            <Link
              href={`/learn?career=${career.slug}`}
              onClick={() => playTapPopSound()}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group relative flex items-center gap-3 rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3.5 transition-all duration-150 touch-manipulation",
                "border-2 border-b-4 hover:scale-[1.03] active:translate-y-1 active:border-b-2",
                active
                  ? "border-emerald-400 border-b-emerald-600 bg-gradient-to-r from-emerald-500/25 to-teal-500/20 text-white shadow-[0_6px_20px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400/40"
                  : "border-white/10 border-b-slate-900 bg-[#0c1326]/90 text-slate-300 hover:border-emerald-500/50 hover:bg-[#111c38] hover:text-white shadow-lg shadow-black/40",
              )}
            >
              {/* Mini Planet Visual */}
              <div className="relative shrink-0">
                <PlanetVisual
                  src={planet.src}
                  alt={planet.alt}
                  size={36}
                  glow={active}
                  float={active}
                  dormant={!active && progress === 0}
                />
                {active && (
                  <span
                    aria-hidden
                    className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-emerald-500 text-[9px] font-black text-slate-950 shadow-sm"
                  >
                    <Check className="size-2.5 stroke-[3]" />
                  </span>
                )}
              </div>

              {/* Title & Stats */}
              <div className="text-left">
                <p
                  className={cn(
                    "text-xs sm:text-sm font-black leading-tight tracking-tight transition-colors",
                    active ? "text-emerald-300" : "text-white group-hover:text-emerald-300",
                  )}
                >
                  {career.title}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-wider",
                      active
                        ? "text-emerald-400"
                        : progress > 0
                          ? "text-emerald-400/80"
                          : "text-slate-400",
                    )}
                  >
                    {progress > 0
                      ? `${progress}% mastered`
                      : career.pathCount
                        ? `${career.pathCount} worlds`
                        : "Sector"}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}

