"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, Timer, Target } from "lucide-react";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { DailyQuests } from "@/components/dashboard/daily-quests";
import type {
  DashboardQuest,
  DailyChallengeStatus,
} from "@/lib/dashboard/types";

export function DashboardRail({
  dailyQuests,
  dailyChallengeStatus,
}: {
  dailyQuests: DashboardQuest[];
  dailyChallengeStatus: DailyChallengeStatus;
}) {
  return (
    <div className="flex w-full flex-col gap-4 lg:w-80">
      {dailyChallengeStatus !== "completed" && (
        <AnimateOnScroll delay={0}>
          <DailyChallengeBanner status={dailyChallengeStatus} />
        </AnimateOnScroll>
      )}

      <AnimateOnScroll delay={50}>
        <DailyQuests
          quests={dailyQuests}
          completedCount={dailyQuests.filter((q) => q.completed).length}
          totalCount={dailyQuests.length}
          totalXpEarned={dailyQuests
            .filter((q) => q.completed)
            .reduce((sum, q) => sum + q.xpReward, 0)}
        />
      </AnimateOnScroll>
    </div>
  );
}

function DailyChallengeBanner({
  status,
}: {
  status: "pending" | "in_progress";
}) {
  const isInProgress = status === "in_progress";

  return (
    <Link href="/practice/daily-challenge" className="group block">
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="relative overflow-hidden flex items-center gap-3 rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent p-4 transition-all hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5"
      >
        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-md shadow-emerald-500/20 transition-transform group-hover:scale-110">
          {isInProgress ? (
            <Timer className="size-5 animate-pulse" />
          ) : (
            <Target className="size-5" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-bold text-foreground">Daily Challenge</h3>
            <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {isInProgress ? "In progress" : "Pending"}
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {isInProgress
              ? "Resume today's timed challenge — the clock is running!"
              : "Today's timed challenge is waiting. Beat the clock!"}
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-0.5 text-xs font-bold text-primary">
          {isInProgress ? "Resume" : "Start"}
          <ArrowUpRight className="size-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </motion.div>
    </Link>
  );
}