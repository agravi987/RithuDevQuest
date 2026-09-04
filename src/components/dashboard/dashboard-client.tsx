"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Rocket,
  Target,
  ChevronRight,
  Trophy,
  ArrowUpRight,
  Timer,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { DailyQuests } from "@/components/dashboard/daily-quests";
import { ConstellationMap } from "@/components/dashboard/constellation-map";
import { PlanetVisual } from "@/components/galaxy/planet-visual";
import { SpaceshipPlayer } from "@/components/galaxy/spaceship-player";
import { getPlanetForCareer } from "@/lib/galaxy-assets";
import { getPathVisual, getCareer, getModuleIcon } from "@/lib/career-metadata";

type DashboardClientProps = {
  firstName: string;
  profile: {
    streak: { currentStreak: number; isActiveToday: boolean };
    user: { xp: number; level: number; levelTitle: string };
    stats: {
      completedLessonsCount: number;
      unlockedAchievementsCount: number;
      totalAchievementsCount: number;
    };
  };
  careers: {
    slug: string;
    title: string;
    paths: {
      title: string;
      slug: string;
      moduleCount: number;
      totalLessons: number;
      completedLessons: number;
      courseProgress: number;
      completedModules: number;
      modules: { id: string; title: string; slug: string; icon: string }[];
    }[];
  }[];
  skills: { skillId: string; skillName: string; score: number }[];
  dailyQuests: {
    id: string;
    type: string;
    title: string;
    description: string;
    target: number;
    current: number;
    completed: boolean;
    xpReward: number;
    icon: string;
  }[];
  dailyChallengeStatus: "pending" | "in_progress" | "completed";
};

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

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getGreetingEmoji(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "☀️";
  if (hour < 17) return "🌤️";
  return "🌙";
}

export function DashboardClient({
  firstName,
  profile,
  careers,
  skills,
  dailyQuests,
  dailyChallengeStatus,
}: DashboardClientProps) {
  const [selectedCareerSlug, setSelectedCareerSlug] = useState<string>(
    careers[0]?.slug ?? "",
  );

  const selectedCareer =
    careers.find((c) => c.slug === selectedCareerSlug) ?? careers[0];

  const currentPath =
    selectedCareer?.paths.length
      ? selectedCareer.paths.reduce((best, p) =>
          p.courseProgress > best.courseProgress ? p : best,
        )
      : selectedCareer?.paths[0];

  const planet = getPlanetForCareer(selectedCareer?.slug ?? "");

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
    <div className="flex flex-col gap-5 py-6 min-h-0">
      {/* ═══ WELCOME HERO ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-4"
      >
        <div className="relative z-10">
          <h1 className="text-lg sm:text-xl font-black tracking-tight text-foreground">
            {getGreeting()}, {firstName} <span className="inline-block animate-wave">{getGreetingEmoji()}</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 max-w-md">
            {profile.streak.isActiveToday
              ? `Day ${profile.streak.currentStreak} streak active — keep it going! 🔥 ${profile.stats.completedLessonsCount} lessons completed.`
              : `${profile.stats.completedLessonsCount} lessons completed so far. Time for your next adventure! ⚡`}
          </p>
        </div>
      </motion.div>

      {/* ═══ CAREER SELECTOR ═══ */}
      {careers.length > 1 && (
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide pb-1 scroll-snap-x" role="group" aria-label="Select career">
          {careers.map((career) => {
            const active = career.slug === selectedCareer?.slug;
            return (
              <motion.button
                key={career.slug}
                type="button"
                aria-pressed={active}
                onClick={() => setSelectedCareerSlug(career.slug)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`shrink-0 snap-start rounded-full border px-3 py-1.5 text-[11px] font-bold transition-all ${
                  active
                    ? getCareer(career.slug)?.tabClass ?? "text-foreground border-border bg-background"
                    : "text-muted-foreground border-border/60 bg-background/40 hover:text-foreground hover:border-foreground/20"
                }`}
              >
                {career.title}
              </motion.button>
            );
          })}
        </div>
      )}

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="flex flex-1 gap-5 min-h-0 flex-col lg:flex-row">
        {/* Left Column */}
        <div className="flex flex-1 flex-col gap-4 min-w-0">
          {/* Mission Card */}
          {currentPath && (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPath.slug}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="relative overflow-hidden rounded-3xl border border-border/50 bg-card p-4 sm:p-6 shadow-lg shadow-black/5"
              >
                {/* Subtle nebula background */}
                <div className="absolute -right-16 -top-16 size-48 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <PlanetVisual src={planet.src} alt={planet.alt} size={52} orbit glow />
                        <div className="absolute -bottom-1 -left-3">
                          <SpaceshipPlayer size={20} state="current" direction="right" />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <p className={`text-[10px] font-bold uppercase tracking-wider ${planet.accent}`}>
                          {selectedCareer?.title} · Active Mission
                        </p>
                        <h2 className="text-base sm:text-lg font-black truncate text-foreground">
                          {currentPath.title}
                        </h2>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {currentPath.completedModules} of {currentPath.moduleCount} modules cleared
                          {currentPath.courseProgress >= 80 && " · Almost there!"}
                          {currentPath.courseProgress === 0 && " · Just getting started"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                        <AnimatedNumber value={currentPath.courseProgress} suffix="%" />
                      </span>
                      <span className="text-[9px] text-muted-foreground font-medium">progress</span>
                    </div>
                  </div>

                  {/* Progress bar with milestones */}
                  <div className="mb-4">
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full progress-animated"
                        style={{ width: `${currentPath.courseProgress}%` }}
                      />
                      {/* Milestone markers */}
                      {[25, 50, 75].map((milestone) => (
                        <div
                          key={milestone}
                          className="absolute top-0 h-full w-px bg-foreground/20"
                          style={{ left: `${milestone}%` }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5">
                      <span>
                        <AnimatedNumber value={currentPath.completedLessons} /> / {currentPath.totalLessons} lessons
                      </span>
                      <span>
                        {currentPath.courseProgress >= 75
                          ? "🔥 Almost there!"
                          : currentPath.courseProgress >= 50
                            ? "💪 Halfway!"
                            : currentPath.courseProgress >= 25
                              ? "📈 Good progress!"
                              : `${currentPath.totalLessons - currentPath.completedLessons} remaining`}
                      </span>
                    </div>
                  </div>

                  {/* Modules */}
                  <div className="mb-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      Modules
                    </p>
                    <div className="flex flex-nowrap gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
                      {currentPath.modules.map((mod) => (
                        <Link
                          key={mod.id}
                          href={`/learn/${currentPath.slug}/${mod.slug}`}
                          className="group flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs font-semibold hover:border-primary/30 hover:bg-primary/5 transition-all shrink-0"
                        >
                          <span>{getModuleIcon(mod.icon)}</span>
                          <span>{mod.title}</span>
                          <ChevronRight className="size-3 text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-0.5" />
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/learn/${currentPath.slug}`}
                    className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-emerald-500 px-5 py-2.5 text-sm font-black text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:brightness-110 transition-all active:scale-[0.98] btn-glow"
                  >
                    <Rocket className="size-4 transition-transform group-hover:-rotate-12 group-hover:scale-110" />
                    Continue Learning
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {/* Quick Actions */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 px-1">
              Quick Actions
            </p>
            <div className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-3 gap-3">
              <AnimateOnScroll delay={0}>
                <ActionTile
                  href="/practice"
                  icon={<Target className="size-5" />}
                  title="Practice Arena"
                  subtitle="Test your skills with AI challenges"
                  gradient="from-xp/10 to-amber-500/5"
                  borderHover="hover:border-xp/30"
                  iconBg="bg-xp/10 text-xp"
                />
              </AnimateOnScroll>
              <AnimateOnScroll delay={50}>
                <ActionTile
                  href="/achievements"
                  icon={<Trophy className="size-5" />}
                  title="Achievements"
                  subtitle={`${profile.stats.unlockedAchievementsCount}/${profile.stats.totalAchievementsCount} badges earned`}
                  gradient="from-achievement/10 to-purple-500/5"
                  borderHover="hover:border-achievement/30"
                  iconBg="bg-achievement/10 text-achievement"
                />
              </AnimateOnScroll>
              <AnimateOnScroll delay={100}>
                <ActionTile
                  href={`/learn/${currentPath?.slug ?? "linux"}`}
                  icon={<BookOpen className="size-5" />}
                  title="Skill Tree"
                  subtitle="Explore paths and unlock worlds"
                  gradient="from-primary/10 to-emerald-500/5"
                  borderHover="hover:border-primary/30"
                  iconBg="bg-primary/10 text-primary"
                />
              </AnimateOnScroll>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
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
              totalXpEarned={dailyQuests.filter((q) => q.completed).reduce((sum, q) => sum + q.xpReward, 0)}
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
                          <span className="text-[9px] font-medium text-muted-foreground shrink-0">
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
                <div className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-primary via-emerald-400 to-cyan-400 text-lg shadow-lg shadow-primary/20">
                  🤖
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
      </div>
    </div>
  );
}

// ═══ ACTION TILE ═══
function ActionTile({
  href,
  icon,
  title,
  subtitle,
  gradient,
  borderHover,
  iconBg,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  gradient: string;
  borderHover: string;
  iconBg: string;
}) {
  return (
    <Link href={href} className="group block">
      <motion.div
        whileHover={{ scale: 1.03, y: -3 }}
        whileTap={{ scale: 0.97 }}
        className={`relative overflow-hidden flex flex-col items-center gap-3 rounded-2xl border border-border/50 bg-gradient-to-br ${gradient} p-5 text-center transition-all ${borderHover} hover:shadow-lg hover:shadow-black/5`}
      >
        <div className={`grid size-11 place-items-center rounded-xl transition-transform group-hover:scale-110 ${iconBg}`}>
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-bold text-foreground">{title}</h3>
          <p className="text-[10px] text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
      </motion.div>
    </Link>
  );
}

// ═══ DAILY CHALLENGE BANNER ═══
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
