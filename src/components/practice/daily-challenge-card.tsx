"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Timer, Zap, Trophy, Play, RotateCcw, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DEEP_SPACE_CARD, DEEP_SPACE_SUBTLE } from "@/lib/theme";
import { PlanetVisual } from "@/components/galaxy/planet-visual";

/* ─── Types ─── */

type LauncherStatus = {
  hasChallengeToday: boolean;
  isCompleted: boolean;
  isActive: boolean;
  expiresAt?: string;
  previousBest?: {
    correctCount: number;
    totalQuestions: number;
    accuracy: number;
    date: string;
  };
};

function useRemainingTime(expiresAt: string | undefined): number {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (!expiresAt) return;
    const target = new Date(expiresAt);
    const tick = () => {
      setRemaining(Math.max(0, target.getTime() - Date.now()));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return remaining;
}

function formatRemaining(ms: number): string {
  const total = Math.floor(ms / 1000);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/* ─── Main Component ─── */

export function DailyChallengeCard() {
  const router = useRouter();
  const [status, setStatus] = useState<LauncherStatus | null>(null);
  const [loaded, setLoaded] = useState(false);
  const remaining = useRemainingTime(
    status?.isActive ? status.expiresAt : undefined,
  );

  useEffect(() => {
    fetch("/api/daily-challenge")
      .then((r) => r.json())
      .then((s: LauncherStatus) => {
        setStatus(s);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const goToChallenge = () => router.push("/practice/daily-challenge");

  /* ─── Loading ─── */
  if (!loaded) {
    return (
      <div className={cn("relative overflow-hidden rounded-3xl border border-white/10 p-6", DEEP_SPACE_SUBTLE)}>
        <div className="flex items-center gap-3 text-white/40">
          <div className="size-4 animate-spin rounded-full border-2 border-white/20 border-t-emerald-400" />
          <span className="text-sm font-medium">Checking daily challenge...</span>
        </div>
      </div>
    );
  }

  /* ─── Completed today ─── */
  if (status?.hasChallengeToday && status.isCompleted) {
    return (
      <div className={cn("relative overflow-hidden rounded-3xl border border-emerald-500/20 p-5 sm:p-6 shadow-2xl shadow-emerald-500/5", DEEP_SPACE_CARD)}>
        <div className="relative z-10 flex items-center gap-4">
          <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-400 via-green-500 to-teal-500 shadow-lg shadow-emerald-500/20">
            <RotateCcw className="size-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/70">
              Daily Challenge
            </p>
            <h3 className="text-lg font-black text-white">Completed today</h3>
            <p className="text-xs text-white/40 mt-0.5">
              Come back tomorrow for a new challenge!
            </p>
          </div>
          <div className="shrink-0 rounded-full bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 text-[11px] font-extrabold text-emerald-400">
            ✓ Done
          </div>
        </div>
      </div>
    );
  }

  /* ─── In progress / not started ─── */
  const isActive = status?.isActive ?? false;

  return (
    <div className={cn("relative overflow-hidden rounded-3xl border border-emerald-500/20 p-5 sm:p-8 shadow-2xl shadow-emerald-500/5", DEEP_SPACE_CARD)}>
      <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-emerald-500/8 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 size-48 rounded-full bg-teal-500/5 blur-[80px]" />

      {/* Decorative orbiting planet accent */}
      <div className="pointer-events-none absolute -right-10 -top-6 hidden sm:block opacity-25">
        <PlanetVisual
          src="/png_images/planets/devops.png"
          alt=""
          size={160}
          orbit
          float
        />
      </div>

      <div className="relative z-10">
        <div className="flex items-start gap-4 mb-6">
          <div className="grid size-14 sm:size-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-400 via-green-500 to-teal-500 shadow-lg shadow-emerald-500/20">
            <Target className="size-7 sm:size-8 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/70">
                Daily Challenge
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                30 min
              </span>
              {isActive && (
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20 animate-pulse">
                  In progress
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {isActive ? "Resume Today&apos;s Challenge" : "Today&apos;s Challenge"}
            </h2>
            <p className="text-xs sm:text-sm text-white/40 mt-1">
              Random questions from all your courses. Beat the clock!
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1.5">
            <Timer className="size-3.5 text-emerald-400/70" />
            <span className="text-[11px] font-bold text-white/50">
              {isActive ? `${formatRemaining(remaining)} remaining` : "15 questions · 30 min"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1.5">
            <Zap className="size-3.5 text-emerald-400/70" />
            <span className="text-[11px] font-bold text-white/50">10 XP per correct</span>
          </div>
          {status?.previousBest && (
            <div className="flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1.5">
              <Trophy className="size-3.5 text-emerald-400/70" />
              <span className="text-[11px] font-bold text-white/50">
                Best: {status.previousBest.correctCount}/{status.previousBest.totalQuestions}
              </span>
            </div>
          )}
        </div>

        <motion.div whileTap={{ scale: 0.98 }}>
          <Button
            onClick={goToChallenge}
            className="w-full font-bold py-5 sm:py-6 rounded-xl text-base shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 bg-gradient-to-r from-emerald-400 to-green-600 hover:from-emerald-300 hover:to-green-500 text-white border-0 gap-2 transition-all duration-200"
          >
            <Play className="size-5 fill-white" />
            {isActive ? "Resume Daily Challenge" : "Start Daily Challenge"}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}