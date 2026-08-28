"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Star, Flame, Zap, Trophy } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import type { CompleteLessonResult } from "@/lib/lesson/types";
import { cn } from "@/lib/utils";
import { AchievementPopup } from "@/components/gamification/achievement-popup";

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

  return (
    <section className="flex flex-col items-center gap-6 py-8 text-center max-w-lg mx-auto">
      {/* Achievement Unlocked Popup if any */}
      {newAchievements.length > 0 && (
        <AchievementPopup achievements={newAchievements} />
      )}

      {/* Success Badge */}
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="size-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-primary flex items-center justify-center text-white shadow-xl shadow-primary/20 border-2 border-white/40"
      >
        <CheckCircle2 className="size-10 fill-white/20 text-white" />
      </motion.div>

      <div>
        <h2 className="text-3xl font-black tracking-tight">Quest Complete!</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {completedBefore
            ? "Practice makes permanent — great review!"
            : "Awesome work! New knowledge unlocked."}
        </p>
      </div>

      {/* Stars Animation */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((position) => {
          const isGold = position <= stars;
          return (
            <motion.div
              key={position}
              initial={{ scale: 0, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.15 * position, type: "spring" }}
            >
              <Star
                className={cn(
                  "size-9 transition-all",
                  isGold
                    ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]"
                    : "text-muted-foreground/30",
                )}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Level Up Banner if applicable */}
      {didLevelUp && gamification && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full rounded-2xl bg-gradient-to-r from-primary/20 via-emerald-500/20 to-primary/20 border-2 border-primary/40 p-4 flex items-center justify-center gap-3 shadow-md"
        >
          <Trophy className="size-6 text-amber-500 animate-bounce" />
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

      {/* Gamified Stats Summary */}
      <div className="grid w-full grid-cols-3 divide-x divide-border rounded-2xl border-2 border-border/80 bg-card p-2 shadow-sm">
        <ResultStat
          icon={<Zap className="size-4 text-amber-500 fill-amber-500" />}
          label="XP Earned"
          value={`+${result.xpEarned}`}
          highlight
        />
        <ResultStat
          icon={<Flame className="size-4 text-orange-500 fill-orange-500" />}
          label="Streak"
          value={`${gamification?.streak.currentStreak ?? 1} Days`}
        />
        <ResultStat
          label="Accuracy"
          value={`${result.score}%`}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row w-full justify-center gap-3 pt-2">
        {nextLessonHref && (
          <Button
            asChild
            size="lg"
            className="rounded-2xl font-bold py-6 text-base bg-primary shadow-md hover:bg-primary/90 transition-all flex-1"
          >
            <Link href={nextLessonHref} className="inline-flex items-center justify-center gap-2">
              Next Quest
              <ArrowRight className="size-5" />
            </Link>
          </Button>
        )}
        <Button
          variant="outline"
          size="lg"
          asChild
          className="rounded-2xl font-bold py-6 text-base border-2 hover:bg-muted transition-all flex-1"
        >
          <Link href={moduleHref}>Back to Module</Link>
        </Button>
      </div>

      <p className="text-xs text-muted-foreground font-semibold">
        Total Experience: {(gamification?.totalXp ?? userXp + result.xpEarned).toLocaleString()} XP
      </p>
    </section>
  );
}

function ResultStat({
  label,
  value,
  icon,
  highlight = false,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 px-3 py-2">
      <div className="flex items-center gap-1">
        {icon}
        <span
          className={cn(
            "text-lg font-black tracking-tight",
            highlight ? "text-amber-600 dark:text-amber-400" : "text-foreground",
          )}
        >
          {value}
        </span>
      </div>
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
    </div>
  );
}