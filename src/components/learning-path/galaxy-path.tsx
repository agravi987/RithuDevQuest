"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useInView } from "motion/react";
import { Check, Lock, Play, Rocket, ArrowDown, Sparkles, Navigation, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LessonState } from "@/lib/curriculum/navigation";
import { SpaceshipPlayer } from "@/components/galaxy/spaceship-player";
import { MilestoneNode } from "@/components/galaxy/milestone-node";
import { LockedTooltip } from "@/components/galaxy/locked-tooltip";
import { RithuMessage, RITHU_MESSAGES } from "@/components/galaxy/rithu-message";

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
  completedCount: number;
  lessons: LessonNode[];
};

type GalaxyPathProps = {
  modules: ModuleZone[];
  careerSlug?: string;
  streak?: number;
};

function seeded(s: number) {
  return Math.abs(Math.sin(s * 127.1 + 311.7) * 43758.5453 % 1);
}

const MODULE_ICONS: Record<string, string> = {
  Terminal: "🐚", FolderTree: "📁", Shield: "🔐", Activity: "⚙️",
  Network: "🌐", Brain: "🧠", Code: "💻", Database: "🗄️",
  Cloud: "☁️", Container: "🐳", GitBranch: "🔀", Server: "🖥️",
};

const THEMES: Record<string, { primary: string; glow: string; sphere: string; label: string }> = {
  linux: { primary: "#34d399", glow: "rgba(52,211,153,0.3)", sphere: "radial-gradient(circle at 30% 25%, #6ee7b7, #10b981 40%, #047857 78%, #064e3b)", label: "Command Nebula" },
  git: { primary: "#60a5fa", glow: "rgba(96,165,250,0.3)", sphere: "radial-gradient(circle at 30% 25%, #93c5fd, #3b82f6 40%, #1d4ed8 78%, #1e3a8a)", label: "Branch Galaxy" },
  docker: { primary: "#22d3ee", glow: "rgba(34,211,238,0.3)", sphere: "radial-gradient(circle at 30% 25%, #67e8f9, #06b6d4 40%, #0e7490 78%, #164e63)", label: "Container Cluster" },
  kubernetes: { primary: "#a78bfa", glow: "rgba(167,139,250,0.3)", sphere: "radial-gradient(circle at 30% 25%, #c4b5fd, #8b5cf6 40%, #6d28d9 78%, #4c1d95)", label: "Orbit Station" },
};

const CYCLE = ["linux", "git", "docker", "kubernetes"] as const;
const PLANETS = ["/png_images/mars.png", "/png_images/saturn.png", "/png_images/planets/devops.png", "/png_images/planets/cloud.png"];

/* ═══════════════════════════════════════
   PLANET NODE — with hover effects
   ═══════════════════════════════════════ */

function Planet({
  state, isCurrent, size, children,
}: {
  state: LessonState; isCurrent: boolean; size: number; children: React.ReactNode;
}) {
  const done = state === "completed";
  const locked = state === "locked";
  const available = state === "available" && !isCurrent;

  const bg = done
    ? "radial-gradient(circle at 30% 25%, #a7f3d0, #34d399 35%, #059669 70%, #047857)"
    : isCurrent
      ? "radial-gradient(circle at 30% 25%, #fef3c7, #fbbf24 35%, #f59e0b 70%, #d97706)"
      : locked
        ? "radial-gradient(circle at 30% 25%, rgba(71,85,105,0.25), rgba(51,65,85,0.15) 40%, rgba(30,41,59,0.25) 75%, rgba(15,23,42,0.35))"
        : "radial-gradient(circle at 30% 25%, rgba(200,220,255,0.75), rgba(148,163,184,0.35) 40%, rgba(71,85,105,0.25) 75%, rgba(30,41,59,0.35))";

  const bdr = done ? "border-emerald-300/50" : isCurrent ? "border-amber-300/60" : locked ? "border-white/5" : "border-white/15";

  const glow = done
    ? "0 0 20px rgba(52,211,153,0.4), 0 0 40px rgba(52,211,153,0.15)"
    : isCurrent
      ? "0 0 30px rgba(251,191,36,0.5), 0 0 60px rgba(251,191,36,0.2)"
      : available
        ? "0 0 12px rgba(200,220,255,0.15)"
        : "";

  return (
    <motion.div
      whileHover={!locked ? { scale: 1.15, y: -4 } : undefined}
      whileTap={!locked ? { scale: 0.95 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className="relative group"
      style={{ width: size, height: size }}
    >
      {/* Hover glow ring */}
      {!locked && (
        <div className="absolute -inset-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ boxShadow: `0 0 20px ${done ? "rgba(52,211,153,0.3)" : isCurrent ? "rgba(251,191,36,0.3)" : "rgba(255,255,255,0.15)"}` }} />
      )}

      {/* Atmospheric glow */}
      {(done || isCurrent) && (
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: isCurrent ? 2.5 : 4, repeat: Infinity }}
          className="absolute -inset-3 rounded-full blur-xl"
          style={{ background: done ? "radial-gradient(circle, rgba(52,211,153,0.5), transparent 70%)" : "radial-gradient(circle, rgba(251,191,36,0.5), transparent 70%)" }}
        />
      )}

      {/* Orbital ring */}
      {!locked && (
        <motion.div animate={{ rotate: 360 }} transition={{ duration: isCurrent ? 8 : 14, repeat: Infinity, ease: "linear" }}
          className="absolute rounded-full border border-dashed"
          style={{ inset: -size * 0.18, borderColor: done ? "rgba(52,211,153,0.25)" : isCurrent ? "rgba(251,191,36,0.3)" : "rgba(255,255,255,0.06)" }} />
      )}

      {/* Pulse ring for current */}
      {isCurrent && (
        <motion.div animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="absolute rounded-full border-2 border-amber-400/30"
          style={{ inset: -size * 0.28 }} />
      )}

      {/* Planet sphere */}
      <div className={cn("relative size-full rounded-full border-2 transition-shadow duration-300", bdr)}
        style={{ background: bg, boxShadow: `${glow}, inset -${size * 0.1}px -${size * 0.12}px ${size * 0.2}px rgba(0,0,0,0.45), inset ${size * 0.07}px ${size * 0.08}px ${size * 0.15}px rgba(255,255,255,0.25)` }}>
        <div className="absolute inset-0 grid place-items-center transition-transform duration-300 group-hover:scale-110">{children}</div>
        {/* Specular */}
        <div className="pointer-events-none absolute rounded-full bg-white/35 blur-[1px]"
          style={{ left: "20%", top: "14%", width: size * 0.14, height: size * 0.14 }} />
        {/* Crescent */}
        <div className="pointer-events-none absolute inset-0 rounded-full"
          style={{ background: "radial-gradient(circle at 70% 75%, rgba(0,0,0,0.5), transparent 55%)" }} />
      </div>

      {/* Active badge */}
      {available && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
          className="absolute -right-0.5 -top-0.5 grid place-items-center rounded-full bg-white/15 text-white backdrop-blur-sm border border-white/15"
          style={{ width: size * 0.3, height: size * 0.3, fontSize: size * 0.12 }}>✦</motion.div>
      )}

      {/* Locked icon overlay */}
      {locked && (
        <div className="absolute inset-0 grid place-items-center">
          <Lock className="text-white/10" style={{ width: size * 0.25, height: size * 0.25 }} />
        </div>
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════════
   FLOATING PLANET
   ═══════════════════════════════════════ */

function FloatingPlanet({ src, size, className }: { src: string; size: number; className?: string }) {
  return (
    <motion.div animate={{ y: [0, -8, 0], rotate: [0, 2, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      className={cn("pointer-events-none select-none", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <div className="absolute -inset-4 rounded-full blur-2xl opacity-20"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.4), transparent 70%)" }} />
        <Image src={src} alt="Planet" width={size} height={size} draggable={false}
          className="size-full object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]" />
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════
   MODULE BANNER — enhanced
   ═══════════════════════════════════════ */

function ModuleBanner({
  mod, theme, idx, emoji, isCurrent, isExpanded, onToggle,
}: {
  mod: ModuleZone; theme: { primary: string; glow: string; sphere: string; label: string };
  idx: number; emoji: string; isCurrent: boolean;
  isExpanded: boolean; onToggle: () => void;
}) {
  const done = mod.lessons.filter((l) => l.state === "completed").length;
  const total = mod.lessons.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const complete = done === total && total > 0;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: idx * 0.05, duration: 0.5 }}
      className="relative rounded-2xl overflow-hidden backdrop-blur-md mb-3 group/banner"
      style={{
        background: `linear-gradient(135deg, ${theme.primary}0c, ${theme.primary}04)`,
        border: `1px solid ${theme.primary}20`,
        boxShadow: isCurrent ? `0 0 40px ${theme.glow}, inset 0 1px 0 rgba(255,255,255,0.06)` : `inset 0 1px 0 rgba(255,255,255,0.03)`,
      }}>
      {/* Background glow */}
      <div className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full blur-3xl transition-opacity duration-500 group-hover/banner:opacity-80 opacity-50"
        style={{ background: `radial-gradient(circle, ${theme.glow}, transparent 70%)` }} />
      <div className="pointer-events-none absolute -left-6 -bottom-6 size-24 rounded-full blur-2xl opacity-30"
        style={{ background: `radial-gradient(circle, ${theme.primary}40, transparent 70%)` }} />          <div className="relative z-10 p-4 sm:p-5">
            <div className="flex items-center gap-4">
              {/* Expand/collapse toggle */}
              <button onClick={onToggle}
                className="absolute right-3 top-3 grid size-7 place-items-center rounded-lg bg-white/[0.05] text-white/30 hover:text-white/50 hover:bg-white/[0.08] transition-all"
                aria-label={isExpanded ? "Collapse module" : "Expand module"}>
                {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
              </button>
          {/* Planet orb */}
          <motion.div whileHover={{ rotate: 360, scale: 1.1 }} transition={{ duration: 0.8 }}
            className="relative shrink-0 cursor-pointer">
            <div className="absolute -inset-2.5 rounded-full border border-dashed animate-[spin_25s_linear_infinite]"
              style={{ borderColor: `${theme.primary}20` }} />
            <div className="relative grid size-14 sm:size-16 place-items-center rounded-full"
              style={{ background: theme.sphere, boxShadow: `inset -5px -7px 12px rgba(0,0,0,0.5), inset 3px 5px 9px rgba(255,255,255,0.2), 0 3px 16px ${theme.glow}` }}>
              <span className="text-2xl sm:text-3xl drop-shadow-lg">{emoji}</span>
              <div className="pointer-events-none absolute left-[22%] top-[15%] size-2 rounded-full bg-white/25 blur-[1px]" />
            </div>
            {complete && (
              <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
                className="absolute -bottom-1 -right-1 grid size-5 place-items-center rounded-full bg-emerald-500 text-[9px] font-black text-white shadow-lg shadow-emerald-500/30">✓</motion.div>
            )}
          </motion.div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/25">{theme.label}</p>
              {isCurrent && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/10 px-2 py-0.5 text-[9px] font-bold text-amber-400/80">
                  <span className="size-1 rounded-full bg-amber-400 animate-pulse" /> Active
                </span>
              )}
            </div>
            <h3 className="font-black text-base sm:text-lg text-white tracking-tight">{mod.title}</h3>
            {mod.description && <p className="text-xs text-white/25 mt-0.5 line-clamp-1">{mod.description}</p>}

            {/* Progress bar */}
            <div className="mt-2.5 flex items-center gap-2.5">
              <div className="flex-1 h-2 rounded-full bg-white/[0.06] overflow-hidden max-w-[200px]">
                <motion.div initial={{ width: 0 }} animate={inView ? { width: `${pct}%` } : {}}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                  className="h-full rounded-full relative"
                  style={{ background: `linear-gradient(90deg, ${theme.primary}cc, ${theme.primary}88)` }}>
                  {/* Shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </motion.div>
              </div>
              <span className="text-[10px] font-bold text-white/30 tabular-nums">{done}/{total} · {pct}%</span>
            </div>
          </div>

          {/* Lesson constellation dots */}
          <div className="hidden sm:flex flex-col gap-1.5">
            {mod.lessons.map((l, i) => (
              <motion.div key={l.id} initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}}
                transition={{ delay: 0.2 + i * 0.05 }}
                className={cn("rounded-full transition-all duration-300",
                  l.state === "completed" ? "size-2 bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]"
                    : l.state === "available" ? "size-2 bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.5)]"
                      : "size-1.5 bg-white/8")} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════
   LESSON ROW — with entrance animation
   ═══════════════════════════════════════ */

function LessonRow({
  lesson, pt, snakeW, isCurrent, size, icon, firstAvail, curRef, prevLesson,
}: {
  lesson: LessonNode; pt: { x: number; y: number }; snakeW: number;
  isCurrent: boolean; size: number; icon: React.ReactNode;
  firstAvail: { modIdx: number; lessonIdx: number; found: boolean };
  curRef: React.RefObject<HTMLDivElement | null>;
  prevLesson: LessonNode | null;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const isLeft = pt.x < snakeW / 2;
  const done = lesson.state === "completed";
  const locked = lesson.state === "locked";

  /* Floating label offset — varies per node so labels don't stack */
  const floatY = ((pt.x * 7 + pt.y * 3) % 30) - 15;

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, scale: 0.7, y: 20 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.05 }}
      className="absolute z-10 group/node"
      style={{ left: `${(pt.x / snakeW) * 100}%`, top: pt.y, transform: "translate(-50%, -50%)" }}>

      {/* Planet */}
      <div ref={isCurrent && firstAvail.found ? curRef : undefined}>
        {locked ? (
          <Planet state={lesson.state} isCurrent={isCurrent} size={size}>{icon}</Planet>
        ) : (
          <Link
            href={lesson.href}
            aria-label={lesson.title}
            className="block cursor-pointer rounded-full outline-none no-underline focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <Planet state={lesson.state} isCurrent={isCurrent} size={size}>{icon}</Planet>
          </Link>
        )}
      </div>

      {/* Spaceship */}
      {isCurrent && (
        <motion.div initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute -top-12 left-1/2 -translate-x-1/2">
          <SpaceshipPlayer size={36} state="current" direction="right" />
        </motion.div>
      )}

      <div
        className={cn(
          "absolute top-1/2 -translate-y-1/2 transition-all duration-300 z-20",
          "pointer-events-none",
          "overflow-hidden max-w-[calc(100vw-2rem)]",
          isLeft ? "left-[calc(100%+14px)]" : "right-[calc(100%+14px)] text-right",
        )}
        style={{ transform: `translate(-50%, calc(-50% + ${floatY}px))` }}
      >

        {/* Title — floating glow text */}
        <p className={cn(
          "text-[11px] sm:text-xs font-bold leading-tight whitespace-nowrap truncate",
          done && "text-emerald-300/70",
          isCurrent && "text-amber-200 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]",
          !done && !isCurrent && !locked && "text-white/60",
          locked && "text-white/10",
        )}>
          {lesson.title}
        </p>

        {/* Tiny floating badges — inline, no wrapper */}
        <div className={cn(
          "flex items-center gap-1 mt-0.5",
          isLeft ? "" : "justify-end",
        )}>
          <span className={cn(
            "text-[9px] tabular-nums",
            locked ? "text-white/6" : done ? "text-emerald-400/40" : isCurrent ? "text-amber-400/60" : "text-white/18",
          )}>
            ~{lesson.estimatedMinutes}m
          </span>
          {done && <span className="text-[9px] text-emerald-400/40">✓</span>}
          {isCurrent && <span className="text-[9px] text-amber-400/60 font-semibold">●</span>}
          {locked && <span className="text-[9px] text-white/8">🔒</span>}
        </div>

        {/* Locked tooltip — tiny, floats */}
        {locked && prevLesson && (
          <div className="mt-0.5 pointer-events-auto">
            <LockedTooltip prerequisiteTitle={prevLesson.title} />
          </div>
        )}
      </div>

      {/* ── Hover action — floating pill, no card ── */}
      {lesson.state !== "locked" && (
        <div className={cn(
          "absolute z-30 transition-all duration-300",
          "opacity-0 scale-90 group-hover/node:opacity-100 group-hover/node:scale-100",
          "pointer-events-none group-hover/node:pointer-events-auto",
          isLeft
            ? "left-[calc(100%+14px)] top-[calc(100%+8px)]"
            : "right-[calc(100%+14px)] top-[calc(100%+8px)] text-right",
        )}>
          <Link href={lesson.href}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold",
              "backdrop-blur-md transition-all duration-200 hover:scale-105",
              "shadow-lg shadow-black/20",
              isCurrent
                ? "bg-amber-400/20 text-amber-300 border border-amber-400/25 hover:bg-amber-400/30"
                : done
                  ? "bg-emerald-400/15 text-emerald-300/70 border border-emerald-400/15 hover:bg-emerald-400/25"
                  : "bg-white/10 text-white/50 border border-white/10 hover:bg-white/15",
            )}>
            {done ? "Review" : isCurrent ? "Start" : "Begin"}
            {isCurrent ? <Rocket className="size-2.5" /> : <Play className="size-2" />}
          </Link>
        </div>
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════ */

export function GalaxyPath({ modules, streak }: GalaxyPathProps) {
  const total = modules.reduce((s, m) => s + m.lessons.length, 0);
  const done = modules.reduce((s, m) => s + m.lessons.filter((l) => l.state === "completed").length, 0);
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  const curRef = useRef<HTMLDivElement>(null);
  const [showBtn, setShowBtn] = useState(false);

  /* ─── Collapse/expand state ─── */
  const [expanded, setExpanded] = useState<Set<number>>(() => {
    // Auto-expand current module, collapse completed ones
    const init = new Set<number>();
    modules.forEach((mod, i) => {
      const allDone = mod.lessons.every((l) => l.state === "completed");
      const hasCurrent = mod.lessons.some((l) => l.state === "available");
      if (!allDone || hasCurrent) init.add(i);
    });
    return init;
  });

  const toggleModule = useCallback((idx: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    setExpanded(new Set(modules.map((_, i) => i)));
  }, [modules]);

  const collapseAll = useCallback(() => {
    // Keep current module expanded
    const next = new Set<number>();
    modules.forEach((mod, i) => {
      if (mod.lessons.some((l) => l.state === "available")) next.add(i);
    });
    setExpanded(next);
  }, [modules]);

  useEffect(() => {
    const h = () => setShowBtn(window.scrollY > 400);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const firstAvail = modules.reduce((a, mod, mi) => {
    if (a.found) return a;
    const li = mod.lessons.findIndex((l) => l.state === "available");
    return li !== -1 ? { modIdx: mi, lessonIdx: li, found: true } : a;
  }, { modIdx: -1, lessonIdx: -1, found: false });

  const themeOf = (slug: string, i: number) => {
    const k = THEMES[slug] !== undefined ? slug as keyof typeof THEMES : CYCLE[i % CYCLE.length];
    return THEMES[k];
  };

  if (modules.length === 0) {
    return (
      <div className="relative w-full max-w-2xl mx-auto py-6 px-4">
        <div className="relative z-10 flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
          <span className="text-4xl">🪐</span>
          <p className="text-sm font-bold text-white/80">
            No modules available
          </p>
          <p className="text-xs text-white/40 max-w-[280px]">
            This learning path has no content yet. Check back soon!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto py-6 px-4">
      <div className="relative z-10 space-y-2">
        {/* Progress */}
        {total > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] px-3 py-1.5 text-[11px] font-bold text-white/50 backdrop-blur-sm">
                <Rocket className="size-3.5 text-amber-400/70" />{done}/{total} planets
              </div>
              <div className="flex-1 relative">
                <div className="h-2.5 rounded-full bg-white/[0.04] overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                    transition={{ duration: 1.2 }} className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-400 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                  </motion.div>
                </div>
                {/* Milestone markers */}
                {[25, 50, 75].map((m) => (
                  <div key={m} className="absolute top-1/2 -translate-y-1/2 size-2.5 rounded-full border bg-[#060a14]"
                    style={{ left: `${m}%`, borderColor: pct >= m ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)" }}>
                    <div className={cn("size-1 rounded-full mx-auto mt-[2px]",
                      pct >= m ? "bg-emerald-400" : "bg-white/10")} />
                  </div>
                ))}
              </div>
              <span className="text-[11px] font-bold text-white/40 tabular-nums">{pct}%</span>
            </div>
          </div>
        )}

        {/* Expand/collapse all */}
        <div className="flex justify-end mb-4">
          <button onClick={expandAll}
            className="text-[10px] font-bold text-white/20 hover:text-white/40 transition-colors mr-3">
            Expand All
          </button>
          <button onClick={collapseAll}
            className="text-[10px] font-bold text-white/20 hover:text-white/40 transition-colors">
            Collapse All
          </button>
        </div>

        {/* ═══════════════════════════════════════
            MODULES
        ═══════════════════════════════════════ */}
        {modules.map((mod, mi) => {
          const theme = themeOf(mod.slug, mi);
          const emoji = MODULE_ICONS[mod.icon] ?? ["🪐", "⭐", "🚀", "🌙", "☄️", "🔭"][mi % 6];
          const isCur = mi === firstAvail.modIdx;
          const isLast = mi === modules.length - 1;
          const deco = PLANETS[mi % PLANETS.length];
          const comp = mod.lessons.filter((l) => l.state === "completed").length;
          const firstLocked = mod.lessons.find((l) => l.state === "locked");
          const prevLesson = firstLocked
            ? mod.lessons[mod.lessons.findIndex((l) => l.id === firstLocked.id) - 1]
            : null;

          const nodeH = 88;
          const snakeW = 500;
          const amp = 160;
          const pts = mod.lessons.map((_, i) => ({
            x: snakeW / 2 + Math.sin((i / 2) * Math.PI) * amp,
            y: i * nodeH + 50,
          }));

          let snakeD = "";
          if (pts.length >= 2) {
            snakeD = `M ${pts[0]!.x} ${pts[0]!.y}`;
            for (let i = 1; i < pts.length; i++) {
              const p = pts[i - 1]!;
              const c = pts[i]!;
              const n = pts[i + 1];
              snakeD += ` C ${p.x} ${p.y + (c.y - p.y) * 0.5}, ${c.x} ${c.y - (n ? (n.y - c.y) * 0.5 : 0)}, ${c.x} ${c.y}`;
            }
          }

          return (
            <div key={mod.id} className="relative mb-10 last:mb-0">
              {mi > 0 && (
                <div className="pointer-events-none z-0 flex justify-center my-2"
                  style={{ [mi % 2 === 0 ? "marginRight" : "marginLeft"]: "auto", [mi % 2 === 0 ? "marginLeft" : "marginRight"]: "auto" }}>
                  <FloatingPlanet src={deco} size={40 + seeded(mi) * 15} />
                </div>
              )}

              {/* Module banner */}
              <div className="relative z-10">
              <ModuleBanner mod={mod} theme={theme} idx={mi} emoji={emoji} isCurrent={isCur}
                isExpanded={expanded.has(mi)} onToggle={() => toggleModule(mi)} />
              </div>

              {/* Rithu */}
              {isCur && (
                <div className="mb-4 mt-2">
                  <RithuMessage message={RITHU_MESSAGES.currentMission(
                    mod.lessons.find((l) => l.state === "available")?.title ?? "next mission",
                  )} position="right" />
                </div>
              )}

              {/* Collapse/expand controls */}
              <div className="flex items-center justify-center gap-2 mb-4 mt-3">
                <button onClick={() => toggleModule(mi)}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold transition-all"
                  style={{ background: `${theme.primary}08`, border: `1px solid ${theme.primary}12`, color: `${theme.primary}50` }}>
                  {expanded.has(mi) ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
                  {expanded.has(mi) ? "Collapse" : "Expand"}
                </button>
                {!expanded.has(mi) && (
                  <span className="text-[10px]" style={{ color: `${theme.primary}25` }}>
                    {mod.lessons.length} planets · {comp}/{mod.lessons.length} explored
                  </span>
                )}
              </div>

              {/* Snake path — animated collapse */}
              <AnimatePresence initial={false}>
                {expanded.has(mi) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden relative"
                  >
              <div className="relative" style={{ height: pts.length * nodeH + 100 }}>
                {snakeD && (
                  <svg viewBox={`0 0 ${snakeW} ${pts.length * nodeH + 100}`}
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    preserveAspectRatio="xMidYMid meet">
                    <defs>
                      <linearGradient id={`sg-${mi}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={theme.primary} stopOpacity="0.5" />
                        <stop offset="100%" stopColor={theme.primary} stopOpacity="0.15" />
                      </linearGradient>
                      <filter id={`gl-${mi}`}>
                        <feGaussianBlur stdDeviation="6" result="b" />
                        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                      </filter>
                    </defs>
                    {/* Outer glow */}
                    <path d={snakeD} fill="none" stroke={theme.primary} strokeWidth="20" strokeLinecap="round" opacity="0.04" filter={`url(#gl-${mi})`} />
                    {/* Inner glow */}
                    <path d={snakeD} fill="none" stroke={theme.primary} strokeWidth="6" strokeLinecap="round" opacity="0.08" />
                    {/* Main path — solid, themed color */}
                    <path d={snakeD} fill="none" stroke={`url(#sg-${mi})`} strokeWidth="2" strokeLinecap="round" />
                    {/* Traveling pulse — glow along the path */}
                    {isCur && firstAvail.lessonIdx !== -1 && pts[firstAvail.lessonIdx] && (
                      <>
                        <motion.circle r="8" fill={theme.primary}
                          animate={{ opacity: [0.05, 0.15, 0.05] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          cx={pts[firstAvail.lessonIdx]!.x} cy={pts[firstAvail.lessonIdx]!.y} />
                        <motion.circle r="3" fill={theme.primary}
                          animate={{ cy: [pts[firstAvail.lessonIdx]!.y - 6, pts[firstAvail.lessonIdx]!.y + 6], opacity: [0.3, 0.8, 0.3] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                          cx={pts[firstAvail.lessonIdx]!.x} />
                      </>
                    )}
                  </svg>
                )}

                {/* Lesson nodes */}
                {mod.lessons.map((lesson, li) => {
                  const pt = pts[li]!;
                  const isCurLesson = lesson.state === "available" && isCur && li === firstAvail.lessonIdx;
                  const sz = isCurLesson ? 56 : lesson.state === "completed" ? 46 : lesson.state === "available" ? 40 : 32;

                  const icon = lesson.state === "completed"
                    ? <Check className="text-white" strokeWidth={3} style={{ width: sz * 0.28, height: sz * 0.28 }} />
                    : isCurLesson
                      ? <Play className="text-white fill-white/30" style={{ width: sz * 0.28, height: sz * 0.28 }} />
                      : lesson.state === "available"
                        ? <Play className="text-white/60 fill-white/15" style={{ width: sz * 0.24, height: sz * 0.24 }} />
                        : null; // locked shows its own icon

                  return (
                    <LessonRow key={lesson.id} lesson={lesson} pt={pt} snakeW={snakeW}
                      isCurrent={isCurLesson} size={sz} icon={icon}
                      firstAvail={firstAvail} curRef={curRef}
                      prevLesson={prevLesson} />
                  );
                })}
              </div>

              </motion.div>
                )}
              </AnimatePresence>

              {/* Module complete */}
              {comp === mod.lessons.length && mod.lessons.length > 0 && (
                <div className="mt-6 mb-4 relative z-10">
                  <MilestoneNode type="module_complete" title={`${mod.title} Complete!`} description="Sector cleared" />
                  <div className="mt-2"><RithuMessage message={RITHU_MESSAGES.moduleComplete(mod.title)} position="right" /></div>
                </div>
              )}

              {/* Warp divider with aurora */}
              {!isLast && (
                <div className="my-8 relative z-10">
                  {/* Aurora band */}
                  <div className="absolute inset-x-0 -inset-y-4 pointer-events-none overflow-hidden" aria-hidden>
                    <motion.div animate={{ x: [-10, 10, -10], opacity: [0.15, 0.3, 0.15] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(135deg, transparent 10%, ${theme.primary}12 30%, ${theme.primary}18 50%, ${theme.primary}08 70%, transparent 90%)`,
                        filter: "blur(12px)",
                      }} />
                    {/* Center glow line */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-px w-3/4"
                      style={{ background: `linear-gradient(90deg, transparent, ${theme.primary}40, transparent)` }} />
                  </div>

                  <div className="relative flex items-center gap-3">
                    <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${theme.primary}15)` }} />
                    <div className="flex items-center gap-2 rounded-full px-3 py-1.5 backdrop-blur-sm"
                      style={{ background: `${theme.primary}06`, border: `1px solid ${theme.primary}10` }}>
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
                        <Navigation className="size-3" style={{ color: `${theme.primary}40` }} />
                      </motion.div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: `${theme.primary}30` }}>warp · next sector</span>
                    </div>
                    <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${theme.primary}15)` }} />
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Streak */}
        {streak !== undefined && streak >= 3 && done > 0 && (
          <div className="mt-10"><RithuMessage message={RITHU_MESSAGES.streakReminder(streak)} position="right" /></div>
        )}

        {/* End */}
        {done === total && total > 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="mt-10 flex flex-col items-center gap-4">
            <div className="relative">
              <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.15, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -inset-8 rounded-full blur-2xl bg-amber-400/15" />
              <div className="relative grid size-20 place-items-center rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 shadow-2xl shadow-amber-400/30">
                <Sparkles className="size-10 text-white drop-shadow-lg" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-lg font-black text-white">Galaxy Explored!</p>
              <p className="text-sm text-white/30 mt-1">Every planet visited.</p>
            </div>
          </motion.div>
        )}

        {/* Scroll */}
        <AnimatePresence>
          {showBtn && (
            <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }} onClick={() => curRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })}
              className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-primary/90 backdrop-blur-sm px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-xl shadow-primary/30 active:scale-95 lg:hidden">
              <ArrowDown className="size-3.5 animate-bounce" /> Current planet
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
