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
        "relative flex items-start gap-4 p-4 sm:p-5 rounded-3xl border-2 transition-all duration-200",
        isUnlocked
          ? "border-amber-400/30 border-b-[6px] border-b-amber-500/40 bg-card hover:border-amber-400/50 hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-0.5"
          : "border-slate-800/80 border-b-[6px] border-b-slate-900 bg-slate-900/30 opacity-70 hover:opacity-85",
        className,
      )}
    >
      {/* Duolingo 3D Badge Medallion */}
      <div
        className={cn(
          "size-14 sm:size-16 shrink-0 rounded-2xl flex items-center justify-center border-2 border-b-4 transition-all duration-200 shadow-md",
          isUnlocked
            ? "bg-gradient-to-br from-amber-400/25 via-yellow-500/15 to-amber-600/10 border-amber-400/50 border-b-amber-600 text-amber-400 shadow-amber-500/20 hover:scale-105 hover:rotate-3"
            : "bg-slate-800/60 border-slate-700 border-b-slate-900 text-slate-500",
        )}
      >
        {isUnlocked ? (
          <IconComponent className="size-8 text-amber-400 fill-amber-400/25 drop-shadow-[0_2px_8px_rgba(251,191,36,0.5)]" />
        ) : (
          <Lock className="size-6 text-slate-500" />
        )}
      </div>

      {/* Info Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <h4
            className={cn(
              "font-black text-base tracking-tight truncate",
              isUnlocked ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {achievement.title}
          </h4>

          {/* Duolingo 3D XP Reward Pill */}
          <span
            className={cn(
              "text-xs font-black px-2.5 py-0.5 rounded-full shrink-0 border border-b-2 uppercase tracking-wide flex items-center gap-1",
              isUnlocked
                ? "bg-amber-500/15 text-amber-400 border-amber-500/40 border-b-amber-600 shadow-sm"
                : "bg-slate-800 text-slate-400 border-slate-700 border-b-slate-900",
            )}
          >
            <span>💎</span> +{achievement.xpReward} XP
          </span>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {achievement.description}
        </p>

        {/* Status footer */}
        <div className="mt-2 pt-2.5 border-t border-border/40 flex items-center justify-between text-[11px]">
          <span className="capitalize text-muted-foreground font-black tracking-wider text-[10px] uppercase">
            {achievement.category}
          </span>
          {isUnlocked ? (
            <span className="inline-flex items-center gap-1 font-black text-emerald-400 text-xs">
              <CheckCircle2 className="size-3.5 text-emerald-400" />
              {achievement.unlockedAt
                ? new Date(achievement.unlockedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                : "Mastered"}
            </span>
          ) : (
            <span className="text-muted-foreground/60 font-bold text-[11px] uppercase tracking-wide">
              Locked
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
