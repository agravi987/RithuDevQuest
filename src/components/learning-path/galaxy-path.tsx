"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Check, Lock, Play, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LessonState } from "@/lib/curriculum/navigation";
import { SpaceshipPlayer } from "@/components/galaxy/spaceship-player";

type LessonNode = {
  id: string;
  title: string;
  slug: string;
  estimatedMinutes: number;
  order: number;
  state: LessonState;
  href: string;
};

type ModuleZone = {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  icon: string;
  lessons: LessonNode[];
};

type GalaxyPathProps = {
  modules: ModuleZone[];
};

const moduleThemes: Record<
  string,
  {
    nebula: string;
    sphere: string;
    ring: string;
    glow: string;
    label: string;
  }
> = {
  linux: {
    nebula: "from-emerald-500/8 via-green-500/5 to-transparent",
    sphere:
      "radial-gradient(circle at 30% 25%, #6ee7b7, #10b981 40%, #047857 78%, #064e3b)",
    ring: "border-emerald-400/20",
    glow: "shadow-emerald-500/30",
    label: "Command Nebula",
  },
  git: {
    nebula: "from-blue-500/8 via-indigo-500/5 to-transparent",
    sphere:
      "radial-gradient(circle at 30% 25%, #93c5fd, #3b82f6 40%, #1d4ed8 78%, #1e3a8a)",
    ring: "border-blue-400/20",
    glow: "shadow-blue-500/30",
    label: "Branch Galaxy",
  },
  docker: {
    nebula: "from-cyan-500/8 via-sky-500/5 to-transparent",
    sphere:
      "radial-gradient(circle at 30% 25%, #67e8f9, #06b6d4 40%, #0e7490 78%, #164e63)",
    ring: "border-cyan-400/20",
    glow: "shadow-cyan-500/30",
    label: "Container Cluster",
  },
  kubernetes: {
    nebula: "from-purple-500/8 via-violet-500/5 to-transparent",
    sphere:
      "radial-gradient(circle at 30% 25%, #c4b5fd, #8b5cf6 40%, #6d28d9 78%, #4c1d95)",
    ring: "border-purple-400/20",
    glow: "shadow-purple-500/30",
    label: "Orbit Station",
  },
};

const THEME_CYCLE = ["linux", "git", "docker", "kubernetes"] as const;

const SECTOR_EMOJIS = [
  "🪐",
  "⭐",
  "🚀",
  "🌙",
  "☄️",
  "🔭",
  "🌌",
  "🗺️",
  "🛰️",
  "🧭",
] as const;

export function GalaxyPath({ modules }: GalaxyPathProps) {
  const planetEmojiByIcon: Record<string, string> = {
    Terminal: "🐚",
    FolderTree: "📁",
    Shield: "🔐",
    Activity: "⚙️",
    Network: "🌐",
  };
  const planetEmoji = (mod: ModuleZone, index: number) =>
    planetEmojiByIcon[mod.icon] ?? SECTOR_EMOJIS[index % SECTOR_EMOJIS.length];
  const nodeStates: Record<
    LessonState,
    {
      sphere: string;
      border: string;
      icon: React.ReactNode;
      glow: string;
    }
  > = {
    completed: {
      sphere:
        "radial-gradient(circle at 30% 25%, #a7f3d0, #34d399 40%, #059669 75%, #047857)",
      border: "border-emerald-300/50",
      icon: <Check className="size-5 text-white" strokeWidth={3} />,
      glow: "shadow-emerald-400/40",
    },
    available: {
      sphere:
        "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.9), rgba(255,255,255,0.5) 40%, rgba(255,255,255,0.25) 75%, rgba(255,255,255,0.12))",
      border: "border-foreground/30",
      icon: (
        <Play className="size-5 text-foreground fill-foreground/30" />
      ),
      glow: "shadow-foreground/20",
    },
    locked: {
      sphere:
        "radial-gradient(circle at 30% 25%, rgba(148,163,184,0.35), rgba(100,116,139,0.25) 45%, rgba(51,65,85,0.35) 80%, rgba(30,41,59,0.5))",
      border: "border-foreground/10",
      icon: <Lock className="size-4 text-muted-foreground/60" />,
      glow: "",
    },
  };

  // The learner's current position = the first available (in-progress) lesson
  // across the whole path.

  const allLessonCount = modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const doneCount = modules.reduce(
    (sum, m) => sum + m.lessons.filter((l) => l.state === "completed").length,
    0,
  );

  return (
    <div className="relative w-full max-w-lg mx-auto py-8">
      {/* Background nebula gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-px h-full bg-gradient-to-b from-foreground/10 via-foreground/5 to-transparent dark:from-white/10 dark:via-white/5" />
      </div>

      {/* Overall progress rail */}
      {allLessonCount > 0 && (
        <div className="relative z-10 mb-8 flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full bg-foreground/5 border border-foreground/10 px-3 py-1 text-[11px] font-bold text-muted-foreground">
            <Rocket className="size-3.5" />
            {doneCount}/{allLessonCount} stars
          </div>
          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-400 transition-all duration-1000"
              style={{
                width: `${allLessonCount ? Math.round((doneCount / allLessonCount) * 100) : 0}%`,
              }}
            />
          </div>
        </div>
      )}

      {modules.map((mod, moduleIndex) => {
        const themeKey =
          moduleThemes[mod.slug] !== undefined
            ? (mod.slug as keyof typeof moduleThemes)
            : THEME_CYCLE[moduleIndex % THEME_CYCLE.length];
        const theme = moduleThemes[themeKey];
        const sectorEyebrow =
          moduleThemes[mod.slug] !== undefined
            ? theme.label
            : "Constellation Sector";
        const completedCount = mod.lessons.filter(
          (l) => l.state === "completed",
        ).length;
        const isLast = moduleIndex === modules.length - 1;

        return (
          <div key={mod.id} className="relative mb-10 last:mb-0">
            {/* Module Nebula Zone */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: moduleIndex * 0.1 }}
              className={cn(
                "relative mb-6 rounded-2xl border border-foreground/10 bg-gradient-to-r p-4 backdrop-blur-sm",
                theme.nebula,
              )}
            >
              <div className="flex items-center gap-3">
                {/* Module planet */}
                <div className="relative">
                  <div
                    className={cn(
                      "relative grid size-11 place-items-center rounded-full shadow-lg",
                      theme.glow,
                    )}
                    style={{
                      background: theme.sphere,
                      boxShadow:
                        "inset -7px -8px 13px rgba(0,0,0,0.45), inset 5px 6px 10px rgba(255,255,255,0.3)",
                    }}
                  >
                    <span className="text-lg drop-shadow">
                      {planetEmoji(mod, moduleIndex)}
                    </span>
                    <div className="pointer-events-none absolute left-[20%] top-[14%] size-2 rounded-full bg-white/50 blur-[1px]" />
                    <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_70%_75%,rgba(0,0,0,0.5),transparent_55%)]" />
                  </div>
                  {/* Orbit ring */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className={cn(
                      "absolute -inset-2 rounded-full border border-dashed",
                      theme.ring,
                    )}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                    {sectorEyebrow}
                  </p>
                  <h3 className="font-bold text-sm text-foreground">
                    {mod.title}
                  </h3>
                  <p className="text-[10px] text-muted-foreground">
                    {completedCount}/{mod.lessons.length} stars discovered
                  </p>
                </div>
                {/* Constellation dots */}
                <div className="flex gap-1">
                  {mod.lessons.map((lesson) => (
                    <motion.div
                      key={lesson.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={cn(
                        "size-1.5 rounded-full",
                        lesson.state === "completed"
                          ? "bg-foreground/80"
                          : lesson.state === "available"
                            ? "bg-foreground/40"
                            : "bg-muted-foreground/30",
                      )}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Lesson Stars */}
            <div className="relative flex flex-col items-center">
              {mod.lessons.map((lesson, localIndex) => {
                const state = nodeStates[lesson.state];
                const isLeft = localIndex % 2 === 0;
                const isAvailable = lesson.state === "available";

                return (
                  <div
                    key={lesson.id}
                    className="relative flex flex-col items-center"
                  >
                    {/* Curvy constellation path */}
                    {localIndex > 0 && (
                      <div className="relative flex justify-center py-1">
                        <svg
                          width="200"
                          height="96"
                          viewBox="0 0 200 96"
                          fill="none"
                          className={cn(
                            "block",
                            lesson.state === "locked" && "opacity-25",
                          )}
                        >
                          <defs>
                            <linearGradient
                              id={`constellation-${mod.slug}-${localIndex}`}
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="0"
                                stopColor={
                                  lesson.state === "completed"
                                    ? "oklch(0.72 0.19 142)"
                                    : lesson.state === "available"
                                      ? "oklch(0.78 0.16 200)"
                                      : "oklch(0.5 0 0)"
                                }
                              />
                              <stop
                                offset="1"
                                stopColor={
                                  lesson.state === "completed"
                                    ? "oklch(0.72 0.19 142)"
                                    : lesson.state === "available"
                                      ? "oklch(0.88 0.16 85)"
                                      : "oklch(0.4 0 0)"
                                }
                              />
                            </linearGradient>
                          </defs>

                          {/* Curvy S-path: bends toward the current star's side */}
                          <motion.path
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1.2, delay: 0.2 }}
                            d={
                              isLeft
                                ? "M 100 2 C 178 30, 178 66, 100 94"
                                : "M 100 2 C 22 30, 22 66, 100 94"
                            }
                            stroke={`url(#constellation-${mod.slug}-${localIndex})`}
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />

                          {/* Glow underlay */}
                          <path
                            d={
                              isLeft
                                ? "M 100 2 C 178 30, 178 66, 100 94"
                                : "M 100 2 C 22 30, 22 66, 100 94"
                            }
                            stroke="currentColor"
                            strokeWidth="6"
                            strokeLinecap="round"
                            opacity="0.12"
                            className="text-foreground"
                          />

                          {/* Traveling pulse on the curve */}
                          {isAvailable && (
                            <motion.circle
                              cx="100"
                              cy="48"
                              r="3"
                              fill="currentColor"
                              className="text-amber-300"
                              animate={{
                                opacity: [0.3, 1, 0.3],
                                scale: [0.7, 1.3, 0.7],
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          )}
                        </svg>
                      </div>
                    )}

                    {/* Star node */}
                    <div
                      className={cn(
                        "flex items-center gap-3",
                        isLeft ? "flex-row" : "flex-row-reverse",
                      )}
                    >
                      <Link
                        href={lesson.state === "locked" ? "#" : lesson.href}
                        aria-disabled={lesson.state === "locked"}
                        className={cn(
                          "relative shrink-0 transition-all",
                          lesson.state === "locked" && "pointer-events-none",
                        )}
                      >
                        {/* Glow ring for available */}
                        {isAvailable && (
                          <motion.div
                            animate={{
                              scale: [1, 1.4, 1],
                              opacity: [0.2, 0.5, 0.2],
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute -inset-3 rounded-full bg-foreground/10 blur-lg"
                          />
                        )}

                        {/* Orbital ring for completed */}
                        {lesson.state === "completed" && (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 10,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className={cn(
                              "absolute -inset-2 rounded-full border border-dashed border-emerald-400/20",
                            )}
                          />
                        )}

                        {/* Main star */}
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            delay: moduleIndex * 0.1 + localIndex * 0.05,
                          }}
                          className={cn(
                            "relative grid size-16 place-items-center rounded-full border-2 transition-all",
                            state.border,
                            state.glow,
                            isAvailable && "hover:scale-110",
                          )}
                          style={{
                            background: state.sphere,
                            transform: "translateZ(0)",
                            boxShadow: `inset -8px -10px 16px rgba(0,0,0,0.4), inset 6px 8px 14px rgba(255,255,255,0.35)`,
                          }}
                        >
                          {state.icon}

                          {/* Inner highlight — 3D depth */}
                          <div className="pointer-events-none absolute left-[18%] top-[12%] size-3 rounded-full bg-white/50 blur-[1px]" />

                          {/* Bottom crescent shadow — 3D body */}
                          <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_70%_75%,rgba(0,0,0,0.55),transparent_58%)]" />
                        </motion.div>

                        {/* Star designation badge */}
                        {isAvailable && (
                          <div                        className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-foreground/20 text-[8px] font-black text-foreground backdrop-blur-sm border border-foreground/20">
                            ✦
                          </div>
                        )}
                      </Link>

                      {/* Label */}
                      <div
                        className={cn(
                          "min-w-0 max-w-[120px] relative",
                          isLeft ? "text-left" : "text-right",
                        )}
                      >
                        {/* Spaceship marks the current mission */}
                        {lesson.state === "available" && isLeft && (
                          <div className="absolute -top-7 left-0 -translate-x-1/3">
                            <SpaceshipPlayer size={44} state="current" />
                          </div>
                        )}
                        <p
                          className={cn(
                            "text-xs font-bold leading-tight truncate",
                            lesson.state === "completed" &&
                              "text-foreground/90",
                            lesson.state === "available" &&
                              "text-foreground",
                            lesson.state === "locked" &&
                              "text-muted-foreground/40",
                          )}
                        >
                          {lesson.title}
                        </p>
                        <p
                          className={cn(
                            "text-[9px] mt-0.5",
                            lesson.state === "locked"
                              ? "text-muted-foreground/40"
                              : "text-muted-foreground",
                          )}
                        >
                          {lesson.estimatedMinutes}m
                          {lesson.state === "completed" && " · ★"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Zone separator — flowing constellation bridge */}
            {!isLast && (
              <div className="my-6 flex justify-center">
                <div className="relative">
                  <svg width="200" height="80" viewBox="0 0 200 80" fill="none">
                    <path
                      d="M 100 2 C 24 32, 176 48, 100 78"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      opacity="0.35"
                      className="text-foreground"
                    />
                    <path
                      d="M 100 2 C 24 32, 176 48, 100 78"
                      stroke="currentColor"
                      strokeWidth="6"
                      strokeLinecap="round"
                      opacity="0.1"
                      className="text-foreground"
                    />
                  </svg>
                  {/* Center moon riding the curve */}
                  <motion.div
                    animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/60"
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
