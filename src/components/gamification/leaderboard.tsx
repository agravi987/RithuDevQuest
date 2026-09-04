"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

type LeaderboardMember = {
  rank: number;
  userId: string;
  name: string;
  level: number;
  weeklyXp: number;
  isCurrentUser: boolean;
  isPromotion: boolean;
  isDemotion: boolean;
};

type LeaderboardProps = {
  tier: number;
  tierName: string;
  tierEmoji: string;
  members: LeaderboardMember[];
  memberCount: number;
  promoteCount: number;
  demoteCount: number;
  currentUser?: LeaderboardMember;
};

const tierColors: Record<number, { bg: string; border: string; text: string; badge: string }> = {
  1: { bg: "from-amber-500/10 to-amber-600/5", border: "border-amber-500/25", text: "text-amber-300", badge: "bg-amber-400/15 text-amber-300" },
  2: { bg: "from-slate-400/10 to-slate-500/5", border: "border-slate-400/25", text: "text-slate-300", badge: "bg-slate-400/15 text-slate-300" },
  3: { bg: "from-yellow-500/10 to-yellow-600/5", border: "border-yellow-500/25", text: "text-yellow-300", badge: "bg-yellow-400/15 text-yellow-300" },
  4: { bg: "from-cyan-500/10 to-cyan-600/5", border: "border-cyan-500/25", text: "text-cyan-300", badge: "bg-cyan-400/15 text-cyan-300" },
  5: { bg: "from-purple-500/10 to-purple-600/5", border: "border-purple-500/25", text: "text-purple-300", badge: "bg-purple-400/15 text-purple-300" },
};

export function Leaderboard({
  tier,
  tierName,
  tierEmoji,
  members,
  promoteCount,
  demoteCount,
  currentUser,
}: LeaderboardProps) {
  const colors = tierColors[tier] ?? tierColors[1];
  const promotionLine = promoteCount;
  const demotionLine = members.length - demoteCount;

  return (
    <div className="flex flex-col gap-4">
      {/* League Header */}
      <div className={cn("relative overflow-hidden rounded-2xl border bg-gradient-to-r p-5", colors.bg, colors.border)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("grid size-12 place-items-center rounded-2xl text-2xl", colors.badge)}>
              {tierEmoji}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Weekly League
              </p>
              <h3 className={cn("text-xl font-black", colors.text)}>
                {tierName} League
              </h3>
            </div>
          </div>
          {currentUser && (
            <div className="text-right">
              <p className="text-[10px] font-bold text-muted-foreground">Your Rank</p>
              <p className="text-2xl font-black">
                #{currentUser.rank}
              </p>
              <p className={cn("text-xs font-bold", colors.text)}>
                {currentUser.weeklyXp.toLocaleString()} XP
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Rankings List */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {/* Promotion Zone Label with glow */}
        <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary/5 border-b border-primary/10">
          <TrendingUp className="size-3.5 text-primary animate-float-sparkle shrink-0" />
          <span className="text-[10px] sm:text-[11px] font-bold text-primary uppercase tracking-wider truncate">
            Promotion Zone — Top {promoteCount} advance
          </span>
        </div>

        {members.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center">
            <div className="grid size-12 place-items-center rounded-2xl bg-muted text-2xl">
              🏆
            </div>
            <p className="text-sm font-bold text-foreground">
              No league members yet
            </p>
            <p className="text-xs text-muted-foreground max-w-xs">
              Complete lessons and practice to join your league and start
              climbing the ranks.
            </p>
          </div>
        ) : (
          <>
        {/* Members */}
        <div className="divide-y divide-border/50">
          {members.map((member) => {
            const showPromotionLine = member.rank === promotionLine;
            const showDemotionLine = member.rank === demotionLine;

            return (
              <div key={member.userId}>
                {/* Member Row */}
                <div
                  className={cn(
                    "flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 transition-all hover:bg-muted/30",
                    member.isCurrentUser && "bg-primary/5 border-l-2 border-l-primary",
                    member.isPromotion && !member.isCurrentUser && "bg-primary/[0.02]",
                    member.isDemotion && "bg-destructive/[0.02]"
                  )}
                >
                  {/* Rank */}
                  <div className={cn(
                    "grid size-8 place-items-center rounded-lg text-xs font-black transition-all duration-200",
                    member.rank === 1 ? "bg-amber-400/15 text-amber-300 shadow-sm shadow-amber-400/20" :
                    member.rank === 2 ? "bg-slate-400/15 text-slate-300" :
                    member.rank === 3 ? "bg-orange-400/15 text-orange-300" :
                    "bg-muted text-muted-foreground"
                  )}>
                    {member.rank <= 3 ? (
                      <span className={member.rank === 1 ? 'animate-float-sparkle' : ''}>{member.rank === 1 ? "🥇" : member.rank === 2 ? "🥈" : "🥉"}</span>
                    ) : (
                      member.rank
                    )}
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm font-bold truncate",
                      member.isCurrentUser && "text-primary"
                    )}>
                      {member.name}
                      {member.isCurrentUser && (
                        <span className="ml-1.5 text-[10px] font-bold text-primary/60">(you)</span>
                      )}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Lv.{member.level}
                    </p>
                  </div>

                  {/* XP */}
                  <div className="text-right">
                    <p className="text-sm font-black text-xp">
                      {member.weeklyXp.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-muted-foreground">XP</p>
                  </div>
                </div>

                {/* Promotion/Demotion Lines */}
                {showPromotionLine && (
                  <div className="flex items-center gap-2 px-4 py-1.5 bg-muted/30 border-y border-border/30">
                    <div className="h-px flex-1 bg-primary/30 border-dashed" />
                    <span className="text-[10px] font-bold text-primary/60 uppercase tracking-wider">
                      ─── Promotion Line ───
                    </span>
                    <div className="h-px flex-1 bg-primary/30 border-dashed" />
                  </div>
                )}
                {showDemotionLine && (
                  <div className="flex items-center gap-2 px-4 py-1.5 bg-muted/30 border-y border-border/30">
                    <div className="h-px flex-1 bg-destructive/30 border-dashed" />
                    <span className="text-[10px] font-bold text-destructive/60 uppercase tracking-wider">
                      ─── Demotion Line ───
                    </span>
                    <div className="h-px flex-1 bg-destructive/30 border-dashed" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Demotion Zone Label */}
        <div className="flex items-center gap-2 px-4 py-2 bg-destructive/5 border-t border-destructive/10">
          <TrendingDown className="size-3.5 text-destructive" />
          <span className="text-[10px] font-bold text-destructive uppercase tracking-wider">
            Demotion Zone — Bottom {demoteCount} drop
          </span>
        </div>
          </>
        )}
      </div>
    </div>
  );
}
