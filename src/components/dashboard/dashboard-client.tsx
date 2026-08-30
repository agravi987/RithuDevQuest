"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Flame,
  BookOpen,
  Zap,
  Star,
  Rocket,
  Target,
  Award,
  ChevronRight,
} from "lucide-react";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { DailyQuests } from "@/components/dashboard/daily-quests";
import { ConstellationMap } from "@/components/dashboard/constellation-map";
import { PlanetVisual } from "@/components/galaxy/planet-visual";
import { SpaceshipPlayer } from "@/components/galaxy/spaceship-player";
import { getPlanetForCareer } from "@/lib/galaxy-assets";

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
};

const pathMeta: Record<string, { emoji: string; color: string }> = {
  linux: { emoji: "🐧", color: "#10b981" },
  git: { emoji: "🔀", color: "#3b82f6" },
  docker: { emoji: "🐳", color: "#06b6d4" },
  kubernetes: { emoji: "☸️", color: "#8b5cf6" },
  networking: { emoji: "🌐", color: "#38bdf8" },
  aws: { emoji: "☁️", color: "#f59e0b" },
  gcp: { emoji: "💎", color: "#60a5fa" },
  "ai-agent-fundamentals": { emoji: "🤖", color: "#d946ef" },
  "prompt-engineering": { emoji: "✍️", color: "#ec4899" },
  "rag-memory": { emoji: "🧠", color: "#6366f1" },
  "agent-frameworks-tools": { emoji: "🧰", color: "#f97316" },
  "html-css-js": { emoji: "🎨", color: "#fb7185" },
  "node-backend": { emoji: "⚙️", color: "#10b981" },
  react: { emoji: "⚛️", color: "#22d3ee" },
  nextjs: { emoji: "🔷", color: "#818cf8" },
  "system-design-foundations": { emoji: "🏗️", color: "#a8a29e" },
  "system-design-hld": { emoji: "🧭", color: "#2dd4bf" },
  "system-design-lld": { emoji: "🔬", color: "#7dd3fc" },
  "system-design-scalability": { emoji: "📈", color: "#fb7185" },
};

const careerColors: Record<string, string> = {
  devops: "text-emerald-400/90 border-emerald-500/30 bg-emerald-500/10",
  cloud: "text-sky-400/90 border-sky-500/30 bg-sky-500/10",
  "ai-agents": "text-fuchsia-400/90 border-fuchsia-500/30 bg-fuchsia-500/10",
  "web-dev": "text-amber-400/90 border-amber-500/30 bg-amber-500/10",
  "system-design": "text-teal-400/90 border-teal-500/30 bg-teal-500/10",
};

function getModuleIcon(icon: string): string {
  const icons: Record<string, string> = {
    Terminal: "🐚",
    FolderTree: "📁",
    Shield: "🔐",
    Activity: "⚙️",
    Network: "🌐",
  };
  return icons[icon] ?? "📚";
}

function getMasteryColor(score: number): string {
  if (score >= 80) return "oklch(0.72 0.19 142)";
  if (score >= 60) return "oklch(0.65 0.20 260)";
  if (score >= 40) return "oklch(0.82 0.17 85)";
  return "oklch(0.65 0.22 25)";
}

export function DashboardClient({
  firstName,
  profile,
  careers,
  skills,
  dailyQuests,
}: DashboardClientProps) {
  const [selectedCareerSlug, setSelectedCareerSlug] = useState<string>(
    careers[0]?.slug ?? "",
  );

  const selectedCareer =
    careers.find((c) => c.slug === selectedCareerSlug) ?? careers[0];

  const currentPath =
    selectedCareer?.paths.reduce((best, p) =>
      p.courseProgress > best.courseProgress ? p : best,
    ) ?? selectedCareer?.paths[0];

  const planet = getPlanetForCareer(selectedCareer?.slug ?? "");

  const constellationPaths =
    selectedCareer?.paths.map((p) => {
      const meta = pathMeta[p.slug] ?? { emoji: "🚀", color: "#10b981" };
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
      {/* ═══ TOP: Welcome + Stats ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Welcome back, {firstName}{" "}
            <span className="inline-block animate-wave">👋</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {profile.streak.isActiveToday
              ? "You're on fire today — keep that streak alive! 🔥"
              : "Ready to learn something new? ⚡"}
          </p>
        </div>

        {/* Inline stat pills */}
        <div className="hidden sm:flex items-center gap-2">
          <StatPill
            icon={<Flame className="size-4" />}
            value={profile.streak.currentStreak}
            label="streak"
            color="streak"
          />
          <StatPill
            icon={<Zap className="size-4" />}
            value={profile.user.xp}
            label="XP"
            color="xp"
          />
          <StatPill
            icon={<Star className="size-4" />}
            value={profile.user.level}
            label="Lv"
            color="level"
          />
        </div>
      </div>

      {/* ═══ Career Selector ═══ */}
      {careers.length > 1 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Career
          </span>
          {careers.map((career) => {
            const active = career.slug === selectedCareer?.slug;
            return (
              <button
                key={career.slug}
                type="button"
                role="tab"
                aria-selected={active}
                tabIndex={active ? 0 : -1}
                onClick={() => setSelectedCareerSlug(career.slug)}
                className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-all duration-200 hover:scale-[1.04] active:scale-95 ${
                  active
                    ? (careerColors[career.slug] ??
                      "text-foreground border-border bg-background")
                    : "text-muted-foreground border-border/60 bg-background/40 hover:text-foreground hover:border-foreground/20"
                }`}
              >
                {career.title}
              </button>
            );
          })}
        </div>
      )}

      {/* ═══ MAIN: Hero + Sidebar ═══ */}
      <div className="flex flex-1 gap-5 min-h-0 flex-col lg:flex-row">
        {/* Left: Hero Card + Actions */}
        <div className="flex flex-1 flex-col gap-4 min-w-0">
          {/* Hero Progress Card */}
          {currentPath && (
            <AnimateOnScroll delay={0}>
              <div className="relative overflow-hidden rounded-3xl border-2 border-primary/15 bg-gradient-to-br from-primary/5 via-card to-emerald-500/5 p-4 sm:p-6 hover-lift">
                {/* Decorative blobs */}
                <div className="absolute -right-8 -top-8 size-32 rounded-full bg-primary/5 blur-2xl" />
                <div className="absolute -left-4 -bottom-4 size-24 rounded-full bg-emerald-500/5 blur-2xl" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Sector planet + escort ship */}
                      <div className="relative shrink-0">
                        <PlanetVisual
                          src={planet.src}
                          alt={planet.alt}
                          size={64}
                          orbit
                          glow
                        />
                        <div className="absolute -bottom-1 -left-4">
                          <SpaceshipPlayer
                            size={26}
                            state="current"
                            direction="right"
                          />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <p
                          className={`text-xs font-bold uppercase tracking-wider ${planet.accent}`}
                        >
                          Mission Control · {selectedCareer?.title}
                        </p>
                        <h2 className="text-lg sm:text-xl font-black truncate">
                          {currentPath.title}
                        </h2>
                      </div>
                    </div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary shrink-0">
                      <AnimatedNumber
                        value={currentPath.courseProgress}
                        suffix="%"
                      />
                    </span>
                  </div>

                  {/* Progress bar with sparkle effect */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                      <span>
                        <AnimatedNumber value={currentPath.completedLessons} />{" "}
                        of {currentPath.totalLessons} lessons
                      </span>
                      <span>{currentPath.moduleCount} modules</span>
                    </div>
                    <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted border border-border/60">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full transition-all duration-1000 ease-out progress-animated"
                        style={{ width: `${currentPath.courseProgress}%` }}
                      />
                      {/* Sparkle dot at progress tip */}
                      {currentPath.courseProgress > 0 &&
                        currentPath.courseProgress < 100 && (
                          <div
                            className="absolute top-0 h-3 w-1 rounded-full bg-white/60 animate-pulse"
                            style={{
                              left: `calc(${currentPath.courseProgress}% - 2px)`,
                            }}
                          />
                        )}
                    </div>
                  </div>

                  {/* Module chips - horizontally scrollable on mobile */}
                  <div className="flex flex-nowrap sm:flex-wrap gap-2 mb-4 overflow-x-auto pb-1.5 scrollbar-hide -mx-1 px-1 snap-x">
                    {currentPath.modules.map((mod, i) => (
                      <Link
                        key={mod.id}
                        href={`/learn/${currentPath.slug}/${mod.slug}`}
                        className="group flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs font-semibold hover:border-primary/30 hover:bg-primary/5 transition-all hover:scale-[1.02] shrink-0 snap-start"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        <span>{getModuleIcon(mod.icon)}</span>
                        <span>{mod.title}</span>
                        <ChevronRight className="size-3 text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-0.5" />
                      </Link>
                    ))}
                  </div>

                  <Link
                    href={`/learn/${currentPath.slug}`}
                    className="group inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-md shadow-primary/15 hover:shadow-lg hover:shadow-primary/25 hover:brightness-110 transition-all duration-300 active:scale-[0.98] btn-glow"
                  >
                    <Rocket className="size-4 transition-transform group-hover:-rotate-12 group-hover:scale-110" />
                    Continue Learning
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </AnimateOnScroll>
          )}

          {/* Bottom: Action Grid */}
          <div className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
            <AnimateOnScroll delay={100}>
              <ActionTile
                href="/practice"
                icon={<Target className="size-5" />}
                emoji="🎯"
                title="Practice"
                subtitle="AI-powered"
                color="xp"
              />
            </AnimateOnScroll>
            <AnimateOnScroll delay={150}>
              <ActionTile
                href="/achievements"
                icon={<Award className="size-5" />}
                emoji="🏆"
                title="Badges"
                subtitle={`${profile.stats.unlockedAchievementsCount}/${profile.stats.totalAchievementsCount}`}
                color="achievement"
              />
            </AnimateOnScroll>
            <AnimateOnScroll delay={200}>
              <ActionTile
                href={`/learn/${currentPath?.slug ?? "linux"}`}
                icon={<BookOpen className="size-5" />}
                emoji="🗺️"
                title="Skill Tree"
                subtitle="Explore paths"
                color="primary"
              />
            </AnimateOnScroll>
          </div>
        </div>

        {/* Right: Quests + Constellation + Skills + Mentor — stacked below content on mobile, sidebar on lg+ */}
        <div className="flex w-full flex-col gap-4 lg:w-72">
          {/* Daily Quests */}
          <AnimateOnScroll delay={50} direction="right">
            <DailyQuests
              quests={dailyQuests}
              completedCount={dailyQuests.filter((q) => q.completed).length}
              totalCount={dailyQuests.length}
              totalXpEarned={dailyQuests
                .filter((q) => q.completed)
                .reduce((sum, q) => sum + q.xpReward, 0)}
            />
          </AnimateOnScroll>

          {/* Constellation Map */}
          <AnimateOnScroll delay={100} direction="right">
            <ConstellationMap paths={constellationPaths} />
          </AnimateOnScroll>

          {/* Skills Card */}
          <AnimateOnScroll delay={150} direction="right">
            <div className="rounded-2xl border-2 border-border bg-card p-5 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold">Your Skills</h3>
                <span className="text-[10px] font-bold text-muted-foreground">
                  {skills.length} total
                </span>
              </div>

              {skills.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {skills.map((skill) => (
                    <div
                      key={skill.skillId}
                      className="flex flex-col gap-1.5 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold capitalize group-hover:text-foreground transition-colors">
                          {skill.skillName.replace(/-/g, " ")}
                        </span>
                        <span className="text-xs font-bold text-muted-foreground">
                          {skill.score}%
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full transition-all duration-700 ease-out"
                          style={{
                            width: `${skill.score}%`,
                            backgroundColor: getMasteryColor(skill.score),
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-4">
                  Complete lessons to build your skills
                </p>
              )}
            </div>
          </AnimateOnScroll>

          {/* Mentor Card */}
          <AnimateOnScroll delay={150} direction="right">
            <div className="rounded-2xl border-2 border-border bg-card p-5 hover-lift">
              <div className="flex items-center gap-3 mb-3">
                <div className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-emerald-400 text-white text-lg shadow-sm">
                  🤖
                </div>
                <div>
                  <h3 className="text-sm font-bold">Rithu</h3>
                  <p className="text-[10px] text-muted-foreground">AI Mentor</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {profile.streak.isActiveToday
                  ? "Great work today! Keep the momentum going. 💪"
                  : "Every lesson counts. Start your daily quest now! ⚡"}
              </p>
              <Link
                href="/practice"
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                Practice Arena <ArrowRight className="size-3" />
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </div>
  );
}

// ═══════════ SUB COMPONENTS ═══════════

function StatPill({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  color: string;
}) {
  const colors: Record<string, string> = {
    streak: "bg-streak/10 text-streak border-streak/15",
    xp: "bg-xp/10 text-xp border-xp/15",
    level: "bg-level/10 text-level border-level/15",
  };

  return (
    <div
      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${colors[color]} cursor-default hover:scale-[1.05] transition-transform`}
    >
      {icon}
      <AnimatedNumber value={value} />
      <span className="font-medium opacity-60">{label}</span>
    </div>
  );
}

function ActionTile({
  href,
  icon,
  emoji,
  title,
  subtitle,
  color,
}: {
  href: string;
  icon: React.ReactNode;
  emoji: string;
  title: string;
  subtitle: string;
  color: string;
}) {
  const colorStyles: Record<
    string,
    { bg: string; hover: string; iconBg: string }
  > = {
    primary: {
      bg: "bg-gradient-to-br from-primary/5 to-emerald-500/5",
      hover: "hover:border-primary/30 hover:shadow-primary/10",
      iconBg: "bg-primary/10 text-primary",
    },
    xp: {
      bg: "bg-gradient-to-br from-xp/5 to-amber-500/5",
      hover: "hover:border-xp/30 hover:shadow-xp/10",
      iconBg: "bg-xp/10 text-xp",
    },
    achievement: {
      bg: "bg-gradient-to-br from-achievement/5 to-purple-500/5",
      hover: "hover:border-achievement/30 hover:shadow-achievement/10",
      iconBg: "bg-achievement/10 text-achievement",
    },
  };
  const c = colorStyles[color] ?? colorStyles.primary;

  return (
    <Link href={href} className="group block">
      <div
        className={`relative overflow-hidden flex flex-col items-center gap-3 rounded-2xl border-2 border-border p-5 text-center transition-all duration-200 hover:scale-[1.03] hover:shadow-lg ${c.bg} ${c.hover}`}
      >
        {/* Floating emoji background */}
        <span className="absolute -right-2 -top-2 text-4xl opacity-[0.07] transition-all group-hover:scale-125 group-hover:opacity-[0.12] group-hover:rotate-12">
          {emoji}
        </span>
        {/* Icon */}
        <div
          className={`grid size-12 place-items-center rounded-2xl transition-transform group-hover:scale-110 group-hover:rotate-3 ${c.iconBg}`}
        >
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-bold">{title}</h3>
          <p className="text-[10px] text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
      </div>
    </Link>
  );
}
