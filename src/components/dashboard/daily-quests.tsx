"use client";

import { Check, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ConfettiBurst } from "@/components/ui/confetti-burst";

type Quest = {
  id: string;
  type: string;
  title: string;
  description: string;
  target: number;
  current: number;
  completed: boolean;
  xpReward: number;
  icon: string;
};

type DailyQuestsProps = {
  quests: Quest[];
  completedCount: number;
  totalCount: number;
  totalXpEarned: number;
};

export function DailyQuests({
  quests,
  completedCount,
  totalCount,
  totalXpEarned,
}: DailyQuestsProps) {
  const allDone = completedCount === totalCount && totalCount > 0;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border p-4 transition-all shadow-lg shadow-black/5",
        allDone
          ? "border-primary/30 bg-gradient-to-br from-[oklch(0.2_0.05_260)] to-[oklch(0.18_0.04_142)]"
          : "border-border/60 bg-gradient-to-br from-card to-card/95"
      )}
    >
      {/* Celebration confetti */}
      <ConfettiBurst active={allDone} />
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-lg">📋</span>
          <h3 className="text-sm font-bold">Daily Quests</h3>
          <div className="size-1.5 rounded-full bg-primary animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
            {completedCount}/{totalCount} done
          </span>
          {totalXpEarned > 0 && (
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-[10px] font-bold text-xp bg-xp/15 border border-xp/20 px-2 py-0.5 rounded-full"
            >
              +{totalXpEarned} XP earned
            </motion.span>
          )}
        </div>
      </div>
      <p className="text-[10px] text-muted-foreground mb-3">Complete today&apos;s challenges to earn bonus XP and keep your streak alive</p>

      {/* Progress bar */}
      <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            allDone
              ? "bg-gradient-to-r from-primary to-emerald-400"
              : "bg-gradient-to-r from-xp to-xp/60"
          )}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Quest list */}
      {quests.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-1 rounded-xl bg-muted/40 px-4 py-8 text-center">
          <span className="text-2xl">🗓️</span>
          <p className="text-sm font-bold text-foreground">
            No quests scheduled for today
          </p>
          <p className="text-[10px] text-muted-foreground max-w-[220px]">
            Check back soon — daily quests refresh each day with new
            challenges.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {quests.map((quest) => (
            <QuestItem key={quest.id} quest={quest} />
          ))}
        </div>
      )}

      {/* All done celebration */}
      {allDone && (
        <div className="mt-3 relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/15 via-emerald-500/10 to-primary/15 py-2.5 text-xs font-bold text-primary border border-primary/20 animate-glow-pulse">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="size-3.5 animate-float-sparkle" />
            All quests complete! Bonus XP earned!
            <Sparkles className="size-3.5 animate-float-sparkle" style={{ animationDelay: "0.5s" }} />
          </div>
          {/* Decorative sparkle dots */}
          <div className="absolute left-2 top-1 size-1 rounded-full bg-primary/30 animate-float-sparkle" style={{ animationDelay: "0.3s" }} />
          <div className="absolute right-3 bottom-1 size-1 rounded-full bg-emerald-400/30 animate-float-sparkle" style={{ animationDelay: "0.7s" }} />
        </div>
      )}
    </div>
  );
}

function QuestItem({ quest }: { quest: Quest }) {
  const progress =
    quest.target > 0 ? Math.min((quest.current / quest.target) * 100, 100) : 0;

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200",
        quest.completed
          ? "bg-primary/5 border border-primary/15"
          : "bg-muted/40 border border-transparent hover:border-border hover:bg-muted/60 hover:scale-[1.01]"
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "grid size-8 shrink-0 place-items-center rounded-lg text-sm",
          quest.completed ? "bg-primary/15" : "bg-muted"
        )}
      >
        {quest.completed ? (
          <Check className="size-4 text-primary" strokeWidth={3} />
        ) : (
          <span>{quest.icon}</span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p
            className={cn(
              "text-xs font-bold truncate",
              quest.completed ? "text-primary" : "text-foreground"
            )}
          >
            {quest.title}
          </p>
          <span className={cn(
            "text-[10px] font-bold shrink-0",
            quest.completed ? "text-primary bg-primary/10 px-1.5 py-0.5 rounded-full" : "text-xp"
          )}>
            {quest.completed ? "✓" : `+${quest.xpReward} XP`}
          </span>
        </div>
        <p className="text-[10px] text-muted-foreground mt-0.5">
          {quest.description}
        </p>

        {/* Progress details */}
        {!quest.completed && (
          <div className="mt-1.5">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[10px] text-muted-foreground/70">
                {quest.current}/{quest.target} completed
              </span>
              <span className="text-[10px] font-bold text-xp/70">
                +{quest.xpReward} XP reward
              </span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-xp to-xp/60 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
