"use client";

import { Check, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

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
        "relative overflow-hidden rounded-2xl border-2 p-4 transition-all",
        allDone
          ? "border-primary/30 bg-gradient-to-br from-primary/8 to-emerald-500/5"
          : "border-border bg-card"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">📋</span>
          <h3 className="text-sm font-bold">Daily Quests</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-muted-foreground">
            {completedCount}/{totalCount}
          </span>
          {totalXpEarned > 0 && (
            <span className="text-[10px] font-bold text-xp bg-xp/10 px-2 py-0.5 rounded-full">
              +{totalXpEarned} XP
            </span>
          )}
        </div>
      </div>

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
      <div className="flex flex-col gap-2">
        {quests.map((quest) => (
          <QuestItem key={quest.id} quest={quest} />
        ))}
      </div>

      {/* All done celebration with confetti-like effect */}
      {allDone && (
        <div className="mt-3 relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/15 via-emerald-500/10 to-primary/15 py-2.5 text-xs font-bold text-primary border border-primary/20">
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
  const progress = Math.min((quest.current / quest.target) * 100, 100);

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

        {/* Mini progress bar */}
        {!quest.completed && (
          <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-xp to-xp/60 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Arrow */}
      {!quest.completed && (
        <ChevronRight className="size-3.5 shrink-0 text-muted-foreground/50" />
      )}
    </div>
  );
}
