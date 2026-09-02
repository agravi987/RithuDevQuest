"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Star, Flame, Zap, Trophy, Target, Sparkles } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { AnimatedNumber } from "@/components/ui/animated-number";
import type { CompleteLessonResult } from "@/lib/lesson/types";
import { cn } from "@/lib/utils";
import { AchievementPopup } from "@/components/gamification/achievement-popup";
import { Supernova } from "@/components/ui/supernova";
import { useShootingStar } from "@/components/ui/shooting-star-effect";
import { useEffect, useState } from "react";

type LessonCompleteProps = {
  result: CompleteLessonResult;
  userXp: number;
  moduleHref: string;
  nextLessonHref: string | null;
  completedBefore: boolean;
};

function starsFor(score: number): number {
  if (score >= 100) return 3;
  if (score >= 60) return 2;
  return 1;
}

export function LessonComplete({
  result,
  userXp,
  moduleHref,
  nextLessonHref,
  completedBefore,
}: LessonCompleteProps) {
  const stars = starsFor(result.score);
  const gamification = result.gamification;
  const newAchievements = gamification?.newAchievements ?? [];
  const didLevelUp = gamification?.didLevelUp ?? false;
  const fireShootingStar = useShootingStar();
  const [celebrating, setCelebrating] = useState(true);

  useEffect(() => {
    fireShootingStar("#ffd700");
    const t = setTimeout(() => fireShootingStar("#a855f7"), 300);
    return () => clearTimeout(t);
  }, [fireShootingStar]);

  return (
    <>
    <Supernova
      show={celebrating}
      title="Quest Complete!"
      subtitle={completedBefore ? "Great review!" : "New knowledge unlocked!"}
      emoji="⭐"
      color="from-emerald-400 to-primary"
      onComplete={() => setCelebrating(false)}
    />
    <section className="flex flex-col items-center gap-6 py-8 text-center max-w-lg mx-auto">
      {/* Achievement Unlocked Popup */}
      {newAchievements.length > 0 && (
        <AchievementPopup achievements={newAchievements} />
      )}

      {/* Success Badge with spring animation */}
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, mass: 0.8 }}
        className="relative"
      >
        {/* Glow ring */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -inset-4 rounded-full bg-primary/20 blur-xl"
        />
        <div className="relative size-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-primary flex items-center justify-center text-white shadow-xl shadow-primary/20 border border-white/40">
          <CheckCircle2 className="size-10 fill-white/20 text-white" />
        </div>
      </motion.div>

      <div>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-black tracking-tight"
        >
          Quest Complete!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-1 text-sm text-muted-foreground"
        >
          {completedBefore
            ? "Practice makes permanent — great review!"
            : "Awesome work! New knowledge unlocked."}
        </motion.p>
      </div>

      {/* Stars with bouncing spring animation + glow */}
      <div className="flex items-center gap-3">
        {[1, 2, 3].map((position) => {
          const isGold = position <= stars;
          return (
            <motion.div
              key={position}
              initial={{ scale: 0, y: 20, rotate: -180 }}
              animate={isGold ? {
                scale: [0, 1.3, 1],
                y: 0,
                rotate: [0, 10, -10, 0],
              } : { scale: 1, y: 0, rotate: 0 }}
              transition={{
                delay: 0.4 + position * 0.15,
                scale: { type: "tween", duration: 0.5 },
                y: { type: "spring", stiffness: 300, damping: 15 },
                rotate: { type: "tween", duration: 0.5 },
              }}
            >
              <Star
                className={cn(
                  "size-10 transition-all",
                  isGold
                    ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)] animate-pulse-ring"
                    : "text-muted-foreground/20",
                )}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Level Up Banner */}
      {didLevelUp && gamification && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="w-full rounded-2xl bg-gradient-to-r from-primary/20 via-emerald-500/20 to-primary/20 border border-primary/40 p-4 flex items-center justify-center gap-3 shadow-md"
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
          >
            <Trophy className="size-6 text-amber-500" />
          </motion.div>
          <div className="text-left">
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Level Up!
            </span>
            <p className="text-sm font-extrabold">
              You reached Level {gamification.level} — {gamification.levelTitle}!
            </p>
          </div>
        </motion.div>
      )}

      {/* Animated Stats Cards with enhanced glow */}
      <div className="grid w-full grid-cols-3 gap-2 sm:gap-3">
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
          className="flex flex-col items-center gap-2 rounded-2xl border border-xp/20 bg-xp/5 p-3 sm:p-4 hover-lift"
        >
          <div className="grid size-10 place-items-center rounded-xl bg-xp/15 animate-pulse-ring">
            <Zap className="size-5 text-xp fill-xp/30" />
          </div>
          <div className="text-center">
            <p className="text-lg font-black text-xp">
              +<AnimatedNumber value={result.xpEarned} />
            </p>
            <p className="text-[10px] font-bold text-muted-foreground">XP Earned</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
          className="flex flex-col items-center gap-2 rounded-2xl border border-streak/20 bg-streak/5 p-3 sm:p-4 hover-lift"
        >
          <div className="grid size-10 place-items-center rounded-xl bg-streak/15">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Flame className="size-5 text-streak fill-streak/30" />
            </motion.div>
          </div>
          <div className="text-center">
            <p className="text-lg font-black text-streak">
              <AnimatedNumber value={gamification?.streak.currentStreak ?? 1} />
            </p>
            <p className="text-[10px] font-bold text-muted-foreground">Day Streak</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
          className="flex flex-col items-center gap-2 rounded-2xl border border-primary/20 bg-primary/5 p-3 sm:p-4 hover-lift"
        >
          <div className="grid size-10 place-items-center rounded-xl bg-primary/15">
            <Target className="size-5 text-primary" />
          </div>
          <div className="text-center">
            <p className="text-lg font-black text-primary">
              <AnimatedNumber value={result.score} suffix="%" />
            </p>
            <p className="text-[10px] font-bold text-muted-foreground">Accuracy</p>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons with spring entrance */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="flex flex-col w-full justify-center gap-3 pt-2"
      >
        {nextLessonHref && (
          <Button
            asChild
            size="lg"
            className="rounded-2xl font-bold py-4 sm:py-6 text-sm sm:text-base bg-primary shadow-md hover:bg-primary/90 transition-all btn-glow"
          >
            <Link href={nextLessonHref} className="inline-flex items-center justify-center gap-2">
              Next Quest
              <ArrowRight className="size-5" />
            </Link>
          </Button>
        )}
        <Button
          variant="ghost"
          size="lg"
          asChild
          className="rounded-2xl font-bold py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
        >
          <Link href={moduleHref} className="inline-flex items-center justify-center gap-2">
            <Sparkles className="size-4" />
            Back to Galaxy Map
          </Link>
        </Button>
      </motion.div>

      {/* Total XP with sparkle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="flex items-center gap-2 text-xs text-muted-foreground font-semibold"
      >
        <Sparkles className="size-3 text-amber-400 fill-amber-400/50" />
        Total Experience: <AnimatedNumber value={gamification?.totalXp ?? userXp + result.xpEarned} /> XP
      </motion.div>
    </section>
    </>
  );
}
