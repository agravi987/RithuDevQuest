"use client";

import Link from "next/link";
import { motion } from "motion/react";

type PathData = {
  name: string;
  slug?: string;
  emoji: string;
  color: string;
  progress: number; // 0-100
  totalModules: number;
  completedModules: number;
};

type ConstellationMapProps = {
  paths: PathData[];
};

// Layout: distribute paths around an ellipse so any count looks like a constellation
function getPathPositions(count: number): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    positions.push({
      x: 50 + 32 * Math.cos(angle),
      y: 50 + 27 * Math.sin(angle),
    });
  }
  return positions;
}

// Ring connections plus skip-one bridges for a richer constellation
function getConstellationLines(count: number): [number, number][] {
  if (count < 2) return [];
  const lines: [number, number][] = [];
  for (let i = 0; i < count; i++) {
    lines.push([i, (i + 1) % count]);
  }
  if (count >= 4 && count < 7) {
    for (let i = 0; i < count; i++) {
      lines.push([i, (i + 2) % count]);
    }
  }
  return lines;
}

export function ConstellationMap({ paths }: ConstellationMapProps) {
  const positions = getPathPositions(paths.length);
  const lines = getConstellationLines(paths.length);

  if (paths.length === 0) {
    return (
      <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[oklch(0.12_0.03_260)] via-[oklch(0.1_0.02_280)] to-[oklch(0.08_0.04_300)] p-6 shadow-xl shadow-black/20">
        <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
          <span className="text-3xl">🌌</span>
          <h3 className="text-sm font-bold text-white/80">
            Learning Constellation
          </h3>
          <p className="text-xs text-white/40 max-w-[260px]">
            Choose a learning path to light up your constellation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[oklch(0.12_0.03_260)] via-[oklch(0.1_0.02_280)] to-[oklch(0.08_0.04_300)] p-6 shadow-xl shadow-black/20">
      {/* Background grid + nebula */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute -left-10 -top-10 size-40 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 size-40 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      {/* Header */}
      <div className="relative mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🌌</span>
          <h3 className="text-sm font-bold text-white/80">
            Learning Constellation
          </h3>
        </div>
        <span className="text-[10px] font-medium text-white/30 uppercase tracking-wider">
          {paths.filter((p) => p.progress >= 100).length} / {paths.length}{" "}
          mastered
        </span>
      </div>
      {/* SVG constellation */}{" "}
      <div className="relative mx-auto w-full aspect-[5/3] min-h-[150px] max-h-[220px]">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Constellation lines */}
          {lines.map(([from, to], i) => {
            const fromPos = positions[from];
            const toPos = positions[to];
            const fromPath = paths[from];
            const toPath = paths[to];
            const bothComplete =
              fromPath?.progress >= 100 && toPath?.progress >= 100;
            const oneComplete =
              fromPath?.progress >= 100 || toPath?.progress >= 100;

            return (
              <g key={i}>
                {/* Base line */}
                <line
                  x1={fromPos.x}
                  y1={fromPos.y}
                  x2={toPos.x}
                  y2={toPos.y}
                  stroke={
                    bothComplete
                      ? "rgba(255,255,255,0.15)"
                      : oneComplete
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(255,255,255,0.03)"
                  }
                  strokeWidth="0.3"
                  strokeDasharray={bothComplete ? "none" : "1 1"}
                />
                {/* Animated pulse dot traveling along the line */}
                {oneComplete && (
                  <circle r="0.5" fill="white" opacity="0.4">
                    <animateMotion
                      dur={`${3 + i}s`}
                      repeatCount="indefinite"
                      path={`M${fromPos.x},${fromPos.y} L${toPos.x},${toPos.y}`}
                    />
                  </circle>
                )}
              </g>
            );
          })}
        </svg>

        {/* Path nodes */}
        {paths.map((path, i) => {
          const pos = positions[i];
          if (!pos) return null;
          const isActive = path.progress > 0 && path.progress < 100;
          const isComplete = path.progress >= 100;

          return (
            <motion.div
              key={path.name}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.15, type: "spring", stiffness: 200 }}
              className="absolute flex flex-col items-center gap-1"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              {/* Glow ring */}
              {(isActive || isComplete) && (
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.1, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute size-10 rounded-full"
                  style={{
                    background: `radial-gradient(circle, ${path.color}40, transparent)`,
                  }}
                />
              )}

              {/* Star node */}
              <motion.div
                animate={isActive ? { scale: [1, 1.08, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative flex size-10 items-center justify-center rounded-full border cursor-pointer hover:scale-110 transition-transform"
                style={{
                  borderColor: isComplete
                    ? `${path.color}80`
                    : isActive
                      ? `${path.color}50`
                      : "rgba(255,255,255,0.1)",
                  background: isComplete
                    ? `linear-gradient(135deg, ${path.color}30, ${path.color}10)`
                    : isActive
                      ? `linear-gradient(135deg, ${path.color}20, transparent)`
                      : "rgba(255,255,255,0.03)",
                  boxShadow: isComplete ? `0 0 20px ${path.color}30` : "none",
                }}
              >
                {path.slug ? (
                  <Link href={`/learn/${path.slug}`} className="flex items-center justify-center size-full">
                    <span className="text-base">{path.emoji}</span>
                  </Link>
                ) : (
                  <span className="text-base">{path.emoji}</span>
                )}

                {/* Completion check */}
                {isComplete && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-0.5 -top-0.5 flex size-3.5 items-center justify-center rounded-full bg-emerald-500"
                  >
                    <svg
                      className="size-2 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </motion.div>
                )}
              </motion.div>

              {/* Label */}
              <div className="text-center">
                <p className="text-[10px] font-bold text-white/70 leading-tight">
                  {path.name}
                </p>
                <p className="text-[8px] text-white/30">{path.progress}%</p>
              </div>
            </motion.div>
          );
        })}

        {/* Floating particles with twinkle */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -15, 0],
              opacity: [0.1, 0.5, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + i * 0.4,
              repeat: Infinity,
              delay: i * 0.5,
            }}
            className="absolute rounded-full bg-white"
            style={{
              left: `${10 + ((i * 11) % 80)}%`,
              top: `${15 + ((i * 17) % 70)}%`,
              width: i % 3 === 0 ? "2px" : "1px",
              height: i % 3 === 0 ? "2px" : "1px",
            }}
          />
        ))}
      </div>
      {/* Legend */}
      <div className="relative mt-4 flex flex-wrap items-center justify-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="size-1.5 rounded-full bg-white/20" />
          <span className="text-[9px] text-white/30">Not started</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="size-1.5 rounded-full bg-amber-400/60" />
          <span className="text-[9px] text-white/30">In progress</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="size-1.5 rounded-full bg-emerald-400/60" />
          <span className="text-[9px] text-white/30">Mastered</span>
        </div>
      </div>
    </div>
  );
}
