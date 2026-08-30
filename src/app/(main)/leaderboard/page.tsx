import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Trophy, Calendar, Sparkles } from "lucide-react";

import { auth } from "@/lib/auth";
import { getCurrentLeague } from "@/lib/league/queries";
import { Leaderboard } from "@/components/gamification/leaderboard";

export const metadata: Metadata = {
  title: "Weekly Leaderboard",
};

export default async function LeaderboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const league = await getCurrentLeague(session.user.id);

  if (!league) {
    return (
      <div className="flex flex-col items-center justify-center gap-8 py-16 max-w-md mx-auto">
        <div className="relative">
          <div className="absolute -inset-4 rounded-full bg-amber-500/20 blur-2xl" />
          <div className="relative grid size-24 place-items-center rounded-3xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/15 to-transparent shadow-xl shadow-amber-500/10 animate-float">
            <span className="text-5xl animate-float-sparkle">🏆</span>
          </div>
        </div>
        <div className="text-center space-y-3">
          <h1 className="text-2xl font-black tracking-tight text-glow-gold">
            No Active League
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Complete lessons to join a weekly league and compete with others!
          </p>
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-amber-500/25 btn-glow transition-transform hover:scale-105 active:scale-95"
          >
            <Sparkles className="size-4" />
            Start Learning
          </Link>
        </div>
      </div>
    );
  }

  // Format dates
  const startDate = new Date(league.startDate);
  const endDate = new Date(league.endDate);
  const weekLabel = `${startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} — ${endDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">Weekly Leaderboard</h1>
          <div className="flex items-center gap-2 mt-1">
            <Calendar className="size-3.5 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">{weekLabel}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary self-start sm:self-auto">
          <Trophy className="size-3.5" />
          {league.tierEmoji} {league.tierName}
        </div>
      </div>

      {/* Leaderboard */}
      <Leaderboard
        tier={league.tier}
        tierName={league.tierName}
        tierEmoji={league.tierEmoji}
        members={league.members}
        memberCount={league.memberCount}
        promoteCount={league.promoteCount}
        demoteCount={league.demoteCount}
        currentUser={league.currentUser}
      />

      {/* Info */}
      <div className="rounded-2xl border-2 border-border bg-card p-5 text-center glass-shimmer relative overflow-hidden">
        <p className="text-xs text-muted-foreground leading-relaxed relative z-10">
          Earn XP by completing lessons and answering questions correctly.
          Top {league.promoteCount} members advance to the next league tier.
          Bottom {league.demoteCount} members drop to the lower tier.
          Leagues reset every Monday.
        </p>
      </div>
    </div>
  );
}
