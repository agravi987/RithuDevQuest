"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence, useInView } from "motion/react";
import { Check, Lock, Play, Rocket, Sparkles, ChevronDown, ChevronUp, ArrowDown, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LessonState } from "@/lib/curriculum/navigation";
import { SpaceshipPlayer } from "@/components/galaxy/spaceship-player";
import { MilestoneNode } from "@/components/galaxy/milestone-node";
import { RithuMessage, RITHU_MESSAGES } from "@/components/galaxy/rithu-message";
import { getPathTheme, getModuleIcon, CORE_PATH_THEMES } from "@/lib/career-metadata";
import { playComboFlameSound } from "@/lib/sounds";
import { DuoButton } from "@/components/quiz/duo-button";
import { CosmicCharacter } from "@/components/quiz/characters/CosmicCharacter";
import { CosmicPlanet } from "@/components/learning-path/cosmic-planet";

type LessonNode = {
  id: string;
  title: string;
  description?: string | null;
  skills?: string[];
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
const PLANETS = ["/png_images/mars.png", "/png_images/saturn.png", "/png_images/planets/devops.png", "/png_images/planets/cloud.png"];

/* Cosmic procedural planets are rendered via <CosmicPlanet /> from @/components/learning-path/cosmic-planet */

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
      className="relative rounded-3xl overflow-hidden mb-6 group/banner shadow-xl border-b-[6px] max-w-2xl mx-auto"
      style={{
        background: `linear-gradient(135deg, ${theme.primary}25, ${theme.primary}10)`,
        borderColor: `${theme.primary}55`,
        boxShadow: isCurrent ? `0 10px 30px -10px ${theme.glow}` : undefined,
      }}>
      {/* Background glow */}
      <div className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full blur-3xl opacity-60"
        style={{ background: `radial-gradient(circle, ${theme.glow}, transparent 70%)` }} />

      <div className="relative z-10 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Planet orb */}
            <motion.div whileHover={{ rotate: 360, scale: 1.1 }} transition={{ duration: 0.8 }}
              className="relative shrink-0 cursor-pointer">
              <div className="relative grid size-16 place-items-center rounded-2xl bg-white/10 border-2 border-white/20 shadow-inner">
                <span className="text-3xl drop-shadow-md">{emoji}</span>
              </div>
              {complete && (
                <div className="absolute -bottom-1.5 -right-1.5 grid size-6 place-items-center rounded-full bg-emerald-500 text-xs font-black text-white shadow-lg border-2 border-[#070b14]">✓</div>
              )}
            </motion.div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-white/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-emerald-300">
                  Unit {idx + 1}
                </span>
                {isCurrent && (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-amber-400/20 px-2 py-0.5 text-[10px] font-black uppercase text-amber-300">
                    <span className="size-1.5 rounded-full bg-amber-400 animate-ping" /> Current Unit
                  </span>
                )}
              </div>
              <h3 className="font-black text-lg sm:text-xl text-white tracking-tight mt-1">{mod.title}</h3>
              {mod.description && <p className="text-xs text-slate-300 mt-0.5 line-clamp-1 font-medium">{mod.description}</p>}

              {/* Progress bar */}
              <div className="mt-3 flex items-center gap-3 max-w-xs">
                <div className="flex-1 h-2.5 rounded-full bg-black/40 overflow-hidden border border-white/10">
                  <motion.div initial={{ width: 0 }} animate={inView ? { width: `${pct}%` } : {}}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500" />
                </div>
                <span className="text-xs font-black text-emerald-400 tabular-nums">{pct}%</span>
              </div>
            </div>
          </div>

          {/* Right: Duolingo Guidebook Action Button */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={onToggle}
              className="duo-card-3d flex items-center gap-2 rounded-2xl border-2 border-white/20 bg-white/10 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-md active:translate-y-1 hover:bg-white/15 transition-all"
            >
              <span>{isExpanded ? "Collapse" : "Expand"}</span>
              {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </button>
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
  lesson,
  pt,
  snakeW,
  isCurrent,
  size,
  firstAvail,
  curRef,
  prevLesson,
}: {
  lesson: LessonNode;
  pt: { x: number; y: number };
  snakeW: number;
  isCurrent: boolean;
  size: number;
  firstAvail: { modIdx: number; lessonIdx: number; found: boolean };
  curRef: React.RefObject<HTMLDivElement | null>;
  prevLesson: LessonNode | null;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const isLeft = pt.x < snakeW / 2;
  const done = lesson.state === "completed";
  const locked = lesson.state === "locked";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8, y: 24 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.04 }}
      className="absolute z-10 group/node"
      style={{
        left: `${(pt.x / snakeW) * 100}%`,
        top: pt.y,
        transform: "translate(-50%, -50%)",
      }}
    >
      {/* Duolingo START Floating Crown & Spaceship for Active Target */}
      {isCurrent && (
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-14 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center"
        >
          <div className="relative rounded-full border-2 border-amber-400 bg-amber-400 px-3 py-0.5 font-black text-[10px] uppercase tracking-wider text-slate-950 shadow-lg shadow-amber-400/40 flex items-center gap-1">
            <Sparkles className="size-2.5 fill-slate-950" />
            START
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-2 rotate-45 bg-amber-400" />
          </div>
          <SpaceshipPlayer size={32} state="current" direction="right" className="mt-1" />
        </motion.div>
      )}

      {/* Cosmic Planet Body */}
      <div
        id={`lesson-node-${lesson.id}`}
        ref={isCurrent && firstAvail.found ? curRef : undefined}
        className="relative z-10"
      >
        {locked ? (
          <CosmicPlanet
            archetypeIndex={lesson.order}
            state={lesson.state}
            isCurrent={isCurrent}
            size={size}
          />
        ) : (
          <Link
            href={lesson.href}
            aria-label={lesson.title}
            className="block cursor-pointer rounded-full outline-none no-underline focus-visible:ring-4 focus-visible:ring-cyan-400/60"
          >
            <CosmicPlanet
              archetypeIndex={lesson.order}
              state={lesson.state}
              isCurrent={isCurrent}
              size={size}
            />
          </Link>
        )}
      </div>

      {/* Clean Planet Name Label — visible by default, fades out on hover */}
      <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 pointer-events-none text-center w-max max-w-[140px] sm:max-w-[170px] z-10 transition-opacity duration-200 group-hover/node:opacity-0 group-focus-within/node:opacity-0">
        <span
          className={cn(
            "inline-block px-3 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold leading-tight truncate shadow-md backdrop-blur-md border transition-all duration-200",
            isCurrent
              ? "bg-amber-400/20 text-amber-300 border-amber-400/50 shadow-[0_0_12px_rgba(251,191,36,0.25)]"
              : done
              ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
              : locked
              ? "bg-slate-900/70 text-slate-400 border-white/5"
              : "bg-slate-900/80 text-white/90 border-white/15",
          )}
        >
          {lesson.title}
        </span>
      </div>

      {/* Luminous Cosmic Tether Line — appears only on hover */}
      <div
        className={cn(
          "pointer-events-none absolute top-1/2 -translate-y-1/2 h-[2px] hidden sm:block z-40 transition-opacity duration-200",
          "opacity-0 group-hover/node:opacity-100 group-focus-within/node:opacity-100",
          isLeft
            ? "left-[calc(100%+4px)] w-4 bg-gradient-to-r from-cyan-400/50 via-cyan-400/20 to-transparent"
            : "right-[calc(100%+4px)] w-4 bg-gradient-to-l from-cyan-400/50 via-cyan-400/20 to-transparent",
        )}
      >
        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 size-1.5 rounded-full",
            isCurrent
              ? "bg-amber-400 shadow-[0_0_8px_#f59e0b]"
              : done
              ? "bg-emerald-400 shadow-[0_0_8px_#10b981]"
              : "bg-cyan-400/60 shadow-[0_0_6px_#06b6d4]",
            isLeft ? "left-0" : "right-0",
          )}
        />
      </div>

      {/* Hover-Only Mission Briefing Popover Card — high z-index, zero overlap by default */}
      <div
        className={cn(
          "absolute top-1/2 -translate-y-1/2 transition-all duration-200 ease-out z-50",
          "opacity-0 scale-95 pointer-events-none",
          "group-hover/node:opacity-100 group-hover/node:scale-100 group-hover/node:pointer-events-auto",
          "group-focus-within/node:opacity-100 group-focus-within/node:scale-100 group-focus-within/node:pointer-events-auto",
          "w-[210px] sm:w-[260px] max-w-[calc(100vw-100px)]",
          isLeft
            ? "left-[calc(100%+8px)] sm:left-[calc(100%+14px)] text-left"
            : "right-[calc(100%+8px)] sm:right-[calc(100%+14px)] text-left",
        )}
      >
        <div
          className={cn(
            "relative rounded-2xl p-3 sm:p-3.5 backdrop-blur-2xl transition-all duration-200 border shadow-2xl",
            isCurrent
              ? "bg-[#0b1329]/95 border-amber-400/40 shadow-[0_10px_35px_-5px_rgba(251,191,36,0.3)] ring-1 ring-amber-400/30"
              : done
              ? "bg-[#071422]/95 border-emerald-500/30 shadow-[0_10px_30px_-5px_rgba(16,185,129,0.2)]"
              : locked
              ? "bg-[#070b16]/95 border-white/10 opacity-90"
              : "bg-[#091126]/95 border-cyan-500/30 shadow-[0_10px_30px_-5px_rgba(6,182,212,0.2)]",
          )}
        >
          {/* Subtle Corner Accent Glow */}
          <div
            className={cn(
              "pointer-events-none absolute -right-6 -top-6 size-20 rounded-full blur-xl opacity-30",
              isCurrent ? "bg-amber-400" : done ? "bg-emerald-400" : "bg-cyan-400",
            )}
          />

          {/* Card Header: Mission Badge + Duration/XP */}
          <div className="flex items-center justify-between gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider",
                isCurrent
                  ? "bg-amber-400/20 text-amber-300 border border-amber-400/40"
                  : done
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : locked
                  ? "bg-white/5 text-slate-400 border border-white/10"
                  : "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40",
              )}
            >
              {isCurrent && <span className="size-1.5 rounded-full bg-amber-400 animate-ping" />}
              {done && <Check className="size-2.5 stroke-[3]" />}
              {locked && <Lock className="size-2.5" />}
              {isCurrent ? "Target" : done ? "Cleared" : locked ? "Locked" : "Available"}
            </span>

            <span className="text-[10px] font-mono text-slate-400 font-semibold tabular-nums">
              ~{lesson.estimatedMinutes}m · +50 XP
            </span>
          </div>

          {/* Mission Title */}
          <h4 className="mt-1.5 font-bold text-xs sm:text-sm text-white leading-snug tracking-tight line-clamp-1">
            {lesson.title}
          </h4>

          {/* Mission Description (if present) */}
          {lesson.description && (
            <p className="mt-1 text-[11px] text-slate-300/80 line-clamp-2 leading-relaxed font-normal">
              {lesson.description}
            </p>
          )}

          {/* Skills Badges */}
          {lesson.skills && lesson.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {lesson.skills.slice(0, 2).map((skill) => (
                <span
                  key={skill}
                  className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/10 text-[9px] font-mono text-cyan-200/90"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          {/* Action CTA Button */}
          <div className="mt-2.5 pt-2 border-t border-white/[0.08]">
            {isCurrent ? (
              <Link
                href={lesson.href}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 px-3 py-1.5 text-xs font-black text-slate-950 shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-95"
              >
                <span>Launch Mission</span>
                <Rocket className="size-3.5 fill-slate-950" />
              </Link>
            ) : done ? (
              <Link
                href={lesson.href}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 px-3 py-1.5 text-xs font-bold text-emerald-300 transition-all hover:scale-[1.02] active:scale-95"
              >
                <span>Review Orbit</span>
                <Check className="size-3 stroke-[2.5]" />
              </Link>
            ) : locked ? (
              <div className="flex items-center gap-1 text-[10px] text-slate-400 leading-tight">
                <Lock className="size-3 text-slate-500 shrink-0" />
                <span className="truncate">
                  {prevLesson ? `Complete "${prevLesson.title}" to unlock` : "Coordinates locked"}
                </span>
              </div>
            ) : (
              <Link
                href={lesson.href}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/30 px-3 py-1.5 text-xs font-bold text-cyan-200 transition-all hover:scale-[1.02] active:scale-95"
              >
                <span>Enter Orbit</span>
                <Play className="size-3 fill-current" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════ */

export function GalaxyPath({ modules, streak }: GalaxyPathProps) {
  const searchParams = useSearchParams();
  const justCompletedId = searchParams.get("justCompleted");
  const nextHrefParam = searchParams.get("nextHref");
  const containerRef = useRef<HTMLDivElement>(null);

  const [flightState, setFlightState] = useState<{
    flying: boolean;
    startX: number;
    startY: number;
    targetX: number;
    targetY: number;
    angle: number;
    hasArrived: boolean;
    nextLessonTitle: string;
    nextLessonHref: string;
    targetNodeId: string;
  } | null>(null);

  const total = modules.reduce((s, m) => s + m.lessons.length, 0);
  const done = modules.reduce((s, m) => s + m.lessons.filter((l) => l.state === "completed").length, 0);
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  const curRef = useRef<HTMLDivElement>(null);
  const [showBtn, setShowBtn] = useState(false);

  // Identify completed module and destination lesson
  const allLessons = useMemo(() => modules.flatMap((m) => m.lessons), [modules]);
  const justCompletedIdx = allLessons.findIndex((l: LessonNode) => l.id === justCompletedId);
  const nextSequentialLesson =
    justCompletedIdx !== -1 && justCompletedIdx < allLessons.length - 1
      ? allLessons[justCompletedIdx + 1]
      : null;

  const destinationLesson = useMemo(() => {
    if (!justCompletedId) return null;
    return (
      allLessons.find((l: LessonNode) => l.href === nextHrefParam) ??
      nextSequentialLesson ??
      allLessons.find((l: LessonNode) => l.state === "available") ??
      null
    );
  }, [justCompletedId, nextHrefParam, nextSequentialLesson, allLessons]);

  const completedModIdx = useMemo(
    () => modules.findIndex((m) => m.lessons.some((l: LessonNode) => l.id === justCompletedId)),
    [modules, justCompletedId]
  );

  const destinationModIdx = useMemo(
    () =>
      destinationLesson
        ? modules.findIndex((m) => m.lessons.some((l: LessonNode) => l.id === destinationLesson.id))
        : -1,
    [modules, destinationLesson]
  );

  const firstAvail = useMemo(
    () =>
      modules.reduce(
        (a, mod, mi) => {
          if (a.found) return a;
          const li = mod.lessons.findIndex((l) => l.state === "available");
          return li !== -1 ? { modIdx: mi, lessonIdx: li, found: true } : a;
        },
        { modIdx: -1, lessonIdx: -1, found: false }
      ),
    [modules]
  );

  /* ─── Collapse/expand state ─── */
  const [expanded, setExpanded] = useState<Set<number>>(() => {
    // Auto-expand current module and ensure completed/destination modules are expanded immediately
    const init = new Set<number>();
    modules.forEach((mod, i) => {
      const allDone = mod.lessons.every((l) => l.state === "completed");
      const hasCurrent = mod.lessons.some((l) => l.state === "available");
      if (!allDone || hasCurrent) init.add(i);
    });
    if (completedModIdx !== -1) init.add(completedModIdx);
    if (destinationModIdx !== -1) init.add(destinationModIdx);
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

  // Ensure completed and destination modules remain open during flight
  useEffect(() => {
    if (justCompletedId) {
      setExpanded((prev) => {
        const next = new Set(prev);
        if (completedModIdx !== -1) next.add(completedModIdx);
        if (destinationModIdx !== -1) next.add(destinationModIdx);
        if (firstAvail.modIdx !== -1) next.add(firstAvail.modIdx);
        return next;
      });
    }
  }, [justCompletedId, completedModIdx, destinationModIdx, firstAvail.modIdx]);

  // Launch Spacecraft Flight Animation with auto-retrying layout detection
  useEffect(() => {
    if (!justCompletedId || !destinationLesson || !containerRef.current) return;

    let attempts = 0;
    const maxAttempts = 6;
    let timerId: NodeJS.Timeout | null = null;

    const tryLaunch = () => {
      attempts++;
      const startEl = document.getElementById(`lesson-node-${justCompletedId}`);
      const targetEl = document.getElementById(`lesson-node-${destinationLesson.id}`);

      if (!startEl || !targetEl || !containerRef.current) {
        if (attempts < maxAttempts) {
          timerId = setTimeout(tryLaunch, 150);
        }
        return;
      }

      const containerRect = containerRef.current.getBoundingClientRect();
      const startRect = startEl.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();

      // Guard against zero dimensions during animation expansion
      if (startRect.width === 0 || targetRect.width === 0) {
        if (attempts < maxAttempts) {
          timerId = setTimeout(tryLaunch, 150);
        }
        return;
      }

      const startX = startRect.left + startRect.width / 2 - containerRect.left;
      const startY = startRect.top + startRect.height / 2 - containerRect.top;
      const targetX = targetRect.left + targetRect.width / 2 - containerRect.left;
      const targetY = targetRect.top + targetRect.height / 2 - containerRect.top;

      const dx = targetX - startX;
      const dy = targetY - startY;
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;

      startEl.scrollIntoView({ behavior: "smooth", block: "center" });

      try {
        playComboFlameSound();
      } catch {
        // non-fatal audio fallback
      }

      setFlightState({
        flying: true,
        startX,
        startY,
        targetX,
        targetY,
        angle,
        hasArrived: false,
        nextLessonTitle: destinationLesson.title,
        nextLessonHref: destinationLesson.href,
        targetNodeId: destinationLesson.id,
      });

      // Clear query params so page refresh does not replay
      window.history.replaceState({}, "", window.location.pathname);
    };

    timerId = setTimeout(tryLaunch, 220);
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [justCompletedId, destinationLesson]);

  const themeOf = (slug: string) => CORE_PATH_THEMES[slug] ?? getPathTheme(slug);

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
    <div ref={containerRef} className="relative w-full max-w-3xl mx-auto py-6 px-4 sm:px-6">
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
          const theme = themeOf(mod.slug);
          const emoji = getModuleIcon(mod.icon, mi);
          const isCur = mi === firstAvail.modIdx;
          const isLast = mi === modules.length - 1;
          const deco = PLANETS[mi % PLANETS.length];
          const comp = mod.lessons.filter((l) => l.state === "completed").length;

          const nodeH = 145;
          const snakeW = 560;
          const amp = 155;
          const pts = mod.lessons.map((_, i) => {
            const side = i % 2 === 0 ? -1 : 1;
            const organicWave = Math.sin(i * 1.3) * 18;
            return {
              x: snakeW / 2 + side * amp + organicWave,
              y: i * nodeH + 75,
            };
          });

          let snakeD = "";
          if (pts.length >= 2) {
            snakeD = `M ${pts[0]!.x} ${pts[0]!.y}`;
            for (let i = 1; i < pts.length; i++) {
              const p = pts[i - 1]!;
              const c = pts[i]!;
              const midY = (p.y + c.y) / 2;
              snakeD += ` C ${p.x} ${midY}, ${c.x} ${midY}, ${c.x} ${c.y}`;
            }
          }

          return (
            <div key={mod.id} className="relative mb-12 last:mb-0">
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

              {/* Collapsed state indicator */}
              {!expanded.has(mi) && (
                <div className="flex items-center justify-center gap-2 mb-4 mt-2">
                  <button onClick={() => toggleModule(mi)}
                    className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-bold transition-all shadow-sm"
                    style={{ background: `${theme.primary}15`, border: `1px solid ${theme.primary}30`, color: `${theme.primary}` }}>
                    <ChevronDown className="size-3.5" />
                    <span>Expand {mod.lessons.length} Missions ({comp} explored)</span>
                  </button>
                </div>
              )}

              {/* Snake path — animated collapse */}
              <AnimatePresence initial={false}>
                {expanded.has(mi) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden relative w-full"
                  >
              <div className="relative w-full max-w-[560px] mx-auto" style={{ height: pts.length * nodeH + 90 }}>
                {snakeD && (
                  <svg viewBox={`0 0 ${snakeW} ${pts.length * nodeH + 90}`}
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    preserveAspectRatio="xMidYMid meet">
                    <defs>
                      <linearGradient id={`sg-${mi}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
                        <stop offset="50%" stopColor={theme.primary} stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#34d399" stopOpacity="0.85" />
                      </linearGradient>
                      <filter id={`gl-nebula-${mi}`} x="-30%" y="-30%" width="160%" height="160%">
                        <feGaussianBlur stdDeviation="14" result="b" />
                        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                      </filter>
                      <filter id={`gl-core-${mi}`} x="-15%" y="-15%" width="130%" height="130%">
                        <feGaussianBlur stdDeviation="5" result="b" />
                        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                      </filter>
                    </defs>

                    {/* Layer 1: Wide Deep-Space Nebula Dust Highway (36px soft aura) */}
                    <path d={snakeD} fill="none" stroke={theme.primary} strokeWidth="36" strokeLinecap="round" opacity="0.12" filter={`url(#gl-nebula-${mi})`} />

                    {/* Layer 2: Outer Magnetic Hyperlane Conduit (10px wide) */}
                    <path d={snakeD} fill="none" stroke={theme.primary} strokeWidth="10" strokeLinecap="round" opacity="0.26" />

                    {/* Layer 3: Brilliant Luminous Core Beam */}
                    <path d={snakeD} fill="none" stroke={`url(#sg-${mi})`} strokeWidth="3.5" strokeLinecap="round" filter={`url(#gl-core-${mi})`} />

                    {/* Layer 4: Streaming Stardust / Energy Pulse */}
                    <motion.path
                      d={snakeD}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray="14 36"
                      opacity="0.75"
                      animate={{ strokeDashoffset: [0, -100] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Waypoint beacons at curve midpoints */}
                    {pts.slice(0, -1).map((p, idx) => {
                      const nextP = pts[idx + 1]!;
                      const midX = (p.x + nextP.x) / 2;
                      const midY = (p.y + nextP.y) / 2;
                      return (
                        <g key={idx}>
                          <circle cx={midX} cy={midY} r="7" fill={theme.primary} opacity="0.22" />
                          <circle cx={midX} cy={midY} r="2.5" fill="#ffffff" opacity="0.7" />
                        </g>
                      );
                    })}
                  </svg>
                )}

                {/* Lesson nodes */}
                {mod.lessons.map((lesson, li) => {
                  const pt = pts[li]!;
                  const isCurLesson = lesson.state === "available" && isCur && li === firstAvail.lessonIdx;
                  const sz = isCurLesson ? 72 : lesson.state === "completed" ? 64 : lesson.state === "available" ? 60 : 54;
                  const prevLesson = li > 0 ? mod.lessons[li - 1] : null;

                  return (
                    <LessonRow
                      key={lesson.id}
                      lesson={lesson}
                      pt={pt}
                      snakeW={snakeW}
                      isCurrent={isCurLesson}
                      size={sz}
                      firstAvail={firstAvail}
                      curRef={curRef}
                      prevLesson={prevLesson}
                    />
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

      {/* ── Dynamic Spacecraft Flight Animation ── */}
      {flightState?.flying && (
        <motion.div
          initial={{
            left: flightState.startX,
            top: flightState.startY,
            rotate: flightState.angle,
            scale: 0.9,
          }}
          animate={{
            left: flightState.targetX,
            top: flightState.targetY,
            rotate: flightState.angle,
            scale: [0.9, 1.25, 1],
          }}
          transition={{ duration: 1.8, ease: [0.34, 1.2, 0.64, 1] }}
          onAnimationComplete={() => {
            const targetId = flightState.targetNodeId;
            setFlightState((prev) => (prev ? { ...prev, flying: false, hasArrived: true } : null));
            try {
              playComboFlameSound();
            } catch {
              // fallback
            }
            const targetEl = document.getElementById(`lesson-node-${targetId}`);
            targetEl?.scrollIntoView({ behavior: "smooth", block: "center" });
          }}
          className="absolute z-50 pointer-events-none -translate-x-1/2 -translate-y-1/2"
        >
          <div className="relative">
            <SpaceshipPlayer size={52} state="current" direction="right" />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 size-8 rounded-full bg-amber-400/50 blur-md animate-ping" />
          </div>
        </motion.div>
      )}

      {/* ── Arrival Next Mission Docking Banner ── */}
      <AnimatePresence>
        {flightState?.hasArrived && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md"
          >
            <div className="duo-card-3d rounded-3xl border-2 border-emerald-500/50 border-b-[6px] border-b-emerald-600 bg-[#0d1527]/95 p-5 shadow-2xl backdrop-blur-xl flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="size-12 shrink-0 flex items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/40 p-1">
                  <CosmicCharacter characterId="rithu" mood="happy_jump" size="xs" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                    🚀 Spacecraft Docked!
                  </span>
                  <h4 className="text-sm sm:text-base font-black text-white truncate mt-0.5">
                    {flightState.nextLessonTitle}
                  </h4>
                  <p className="text-xs text-slate-300 font-medium">
                    Sector cleared! Your crew has arrived at the next planet.
                  </p>
                </div>
                <button
                  onClick={() => setFlightState(null)}
                  className="size-8 rounded-xl bg-white/10 hover:bg-white/20 text-white/50 hover:text-white flex items-center justify-center text-xs"
                >
                  ✕
                </button>
              </div>

              <Link href={flightState.nextLessonHref} className="w-full mt-1">
                <DuoButton variant="primary" size="lg" fullWidth>
                  START MISSION (+10 XP) 🚀
                </DuoButton>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
