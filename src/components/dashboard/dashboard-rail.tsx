"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, Bot, Target, Timer } from "lucide-react";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { DailyQuests } from "@/components/dashboard/daily-quests";
import { ConstellationMap } from "@/components/dashboard/constellation-map";
import { getPathVisual } from "@/lib/career-metadata";
import type {
  DashboardCareer,
  DashboardProfile,
  DashboardQuest,
  DashboardSkill,
  DailyChallengeStatus,
} from "@/lib/dashboard/types";

function getMasteryColor(score: number): string {
  if (score >= 80) return "oklch(0.72 0.19 142)";
  if (score >= 60) return "oklch(0.65 0.20 260)";
  if (score >= 40) return "oklch(0.82 0.17 85)";
  return "oklch(0.65 0.22 25)";
}

function getMasteryLabel(score: number): string {
  if (score >= 80) return "Mastered";
  if (score >= 60) return "Proficient";
  if (score >= 40) return "Learning";
  return "Beginner";
}

export function DashboardRail({
  profile,
  careers,
  skills,
  dailyQuests,
  dailyChallengeStatus,
}: {
  profile: DashboardProfile;
  careers: DashboardCareer[];
  skills: DashboardSkill[];
  dailyQuests: DashboardQuest[];
  dailyChallengeStatus: DailyChallengeStatus;
}) {
  const selectedCareer = careers[0];

  const constellationPaths =
    selectedCareer?.paths.map((p) => {
      const meta = getPathVisual(p.slug);
      return {
        name: p.title,
        emoji: meta.emoji,
        color: meta.color,
        progress: p.courseProgress,
        totalModules: p.moduleCount,
        completedModules: p.completedModules,
      };
    }) ?? [];

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

      <AnimateOnScroll delay={100}>
        <ConstellationMap paths={constellationPaths} />
      </AnimateOnScroll>

      {/* Skill Mastery */}
      <AnimateOnScroll delay={150}>
        <div className="rounded-2xl border border-border/50 bg-card p-4 overflow-hidden shadow-lg shadow-black/5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-bold flex items-center gap-1.5">
              <span className="text-base">🎯</span>
              Skill Mastery
            </h3>
            <span className="text-[10px] font-bold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
              {skills.length} active
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground mb-3">
            Your strongest areas of expertise
          </p>
          {skills.length > 0 ? (
            <div className="flex flex-col gap-2.5">
              {skills.map((skill) => (
                <div key={skill.skillId} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-xs font-semibold capitalize truncate">
                        {skill.skillName.replace(/-/g, " ")}
                      </span>
                      <span className="text-[10px] font-medium text-muted-foreground shrink-0">
                        · {getMasteryLabel(skill.score)}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-muted-foreground shrink-0">
                      {skill.score}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.score}%` }}
                      transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: getMasteryColor(skill.score) }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-xs text-muted-foreground">
                Complete lessons to build skills
              </p>
              <p className="text-[10px] text-muted-foreground/60 mt-1">
                Your mastery scores will appear here
              </p>
            </div>
          )}
        </div>
      </AnimateOnScroll>

      {/* AI Mentor */}
      <AnimateOnScroll delay={200}>
        <div className="rounded-2xl border border-border/50 bg-card p-4 shadow-lg shadow-black/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-primary via-emerald-400 to-cyan-400 shadow-lg shadow-primary/20">
              <Bot className="size-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Rithu — AI Mentor</h3>
              <p className="text-[10px] text-muted-foreground">Your personal learning guide</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            {profile.streak.isActiveToday
              ? `Amazing ${profile.streak.currentStreak}-day streak! You've completed ${profile.stats.completedLessonsCount} lessons. Keep pushing forward! 💪`
              : `You've earned ${profile.user.xp} XP and unlocked ${profile.stats.unlockedAchievementsCount} achievements. Start your next adventure! ⚡`}
          </p>
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-muted-foreground/60">
              Level {profile.user.level} · {profile.user.levelTitle}
            </p>
            <Link
              href="/practice"
              className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
            >
              Practice <ArrowUpRight className="size-3" />
            </Link>
          </div>
        </div>
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