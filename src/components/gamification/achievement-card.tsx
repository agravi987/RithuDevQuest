"use client";

import {
  Award,
  Flame,
  Star,
  BookOpen,
  Terminal,
  Shield,
  Crown,
  Zap,
  Target,
  Lock,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserAchievementItem } from "@/lib/gamification/queries";

type AchievementCardProps = {
  achievement: UserAchievementItem;
  className?: string;
};

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Award,
  Flame,
  Star,
  BookOpen,
  Terminal,
  Shield,
  Crown,
  Zap,
  Target,
};

export function AchievementCard({
  achievement,
  className,
}: AchievementCardProps) {
  const IconComponent = ICON_MAP[achievement.icon] ?? Award;
  const isUnlocked = achievement.unlocked;

  return (
    <div
      className={cn(
        "relative flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl border transition-all duration-200",
        isUnlocked
          ? "bg-card border-border hover:border-primary/40 hover:shadow-md hover:scale-[1.01] shadow-sm card-game-glow"
          : "bg-muted/40 border-dashed border-border/70 opacity-70 hover:opacity-90",
        className,
      )}
    >
      {/* Badge Icon Circle */}
      <div
        className={cn(
          "size-12 sm:size-14 shrink-0 rounded-2xl flex items-center justify-center border transition-all duration-200",
          isUnlocked
            ? "bg-gradient-to-br from-achievement/20 to-achievement/10 border-achievement/30 text-achievement shadow-sm hover:scale-110 hover:rotate-3"
            : "bg-muted border-border text-muted-foreground",
        )}
      >
        {isUnlocked ? (
          <IconComponent className="size-7 text-achievement fill-achievement/30" />
        ) : (
          <Lock className="size-6 text-muted-foreground/60" />
        )}
      </div>

      {/* Info Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <h4
            className={cn(
              "font-bold text-base tracking-tight truncate",
              isUnlocked ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {achievement.title}
          </h4>

          {/* XP Reward Pill */}
          <span
            className={cn(
              "text-xs font-bold px-2 py-0.5 rounded-full shrink-0 border",
              isUnlocked
                ? "bg-achievement/15 text-achievement border-achievement/30"
                : "bg-muted text-muted-foreground border-border",
            )}
          >
            +{achievement.xpReward} XP
          </span>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {achievement.description}
        </p>

        {/* Status footer */}
        <div className="mt-2 pt-2 border-t border-border/40 flex items-center justify-between text-[11px]">
          <span className="capitalize text-muted-foreground font-medium">
            {achievement.category}
          </span>
          {isUnlocked ? (
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-3.5" />
              {achievement.unlockedAt
                ? new Date(achievement.unlockedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                : "Unlocked"}
            </span>
          ) : (
            <span className="text-muted-foreground/70 font-medium">
              Locked
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
