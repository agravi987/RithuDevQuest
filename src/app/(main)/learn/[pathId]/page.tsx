import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Trophy, Flame, Zap, Sparkles } from "lucide-react";
import { Starfield } from "@/components/ui/starfield";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pathId: string }>;
}): Promise<Metadata> {
  const { pathId } = await params;
  return {
    title: pathId.charAt(0).toUpperCase() + pathId.slice(1).replace(/-/g, " "),
  };
}

import { GalaxyPath } from "@/components/learning-path/galaxy-path";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { getPathBySlugAcrossCareers } from "@/lib/curriculum/queries";
import { auth } from "@/lib/auth";
import {
  getModuleCompletionCounts,
  getCompletedLessonIds,
} from "@/lib/progress/queries";
import { getLessonStatuses } from "@/lib/curriculum/navigation";
import { getGamificationProfile } from "@/lib/gamification/queries";

const pathPlanets: Record<
  string,
  { emoji: string; subtitle: string; color: string }
> = {
  linux: {
    emoji: "🐧",
    subtitle: "The Command Planet",
    color: "from-emerald-500 to-green-600",
  },
  git: {
    emoji: "🔀",
    subtitle: "The Branch Moon",
    color: "from-blue-500 to-indigo-600",
  },
  docker: {
    emoji: "🐳",
    subtitle: "The Container World",
    color: "from-cyan-500 to-sky-600",
  },
  kubernetes: {
    emoji: "☸️",
    subtitle: "Deep Space Station",
    color: "from-purple-500 to-violet-600",
  },
  networking: {
    emoji: "🌐",
    subtitle: "The Network Nebula",
    color: "from-sky-500 to-cyan-600",
  },
  aws: {
    emoji: "☁️",
    subtitle: "The Amazon Dominion",
    color: "from-orange-500 to-amber-600",
  },
  gcp: {
    emoji: "💎",
    subtitle: "The Google Orbit",
    color: "from-blue-500 to-indigo-600",
  },
  "ai-agent-fundamentals": {
    emoji: "🤖",
    subtitle: "The Agent Core",
    color: "from-fuchsia-500 to-purple-600",
  },
  "prompt-engineering": {
    emoji: "✍️",
    subtitle: "The Prompt Forge",
    color: "from-pink-500 to-rose-500",
  },
  "rag-memory": {
    emoji: "🧠",
    subtitle: "The Memory Archive",
    color: "from-indigo-500 to-blue-600",
  },
  "agent-frameworks-tools": {
    emoji: "🧰",
    subtitle: "The Toolkit Cluster",
    color: "from-amber-500 to-orange-600",
  },
  "html-css-js": {
    emoji: "🎨",
    subtitle: "The Web Seed",
    color: "from-orange-400 to-pink-500",
  },
  "node-backend": {
    emoji: "⚙️",
    subtitle: "The Server Core",
    color: "from-green-500 to-emerald-700",
  },
  react: {
    emoji: "⚛️",
    subtitle: "The Component Storm",
    color: "from-cyan-400 to-blue-500",
  },
  nextjs: {
    emoji: "🔷",
    subtitle: "The App Router",
    color: "from-indigo-400 to-violet-600",
  },
  "system-design-foundations": {
    emoji: "🏗️",
    subtitle: "The Blueprint Planet",
    color: "from-stone-400 to-neutral-600",
  },
  "system-design-hld": {
    emoji: "🧭",
    subtitle: "The Architect Compass",
    color: "from-teal-400 to-emerald-600",
  },
  "system-design-lld": {
    emoji: "🔬",
    subtitle: "The Precision Lab",
    color: "from-sky-400 to-slate-500",
  },
  "system-design-scalability": {
    emoji: "📈",
    subtitle: "The Exponential Moon",
    color: "from-red-400 to-rose-600",
  },
};

export default async function PathPage({
  params,
}: {
  params: Promise<{ pathId: string }>;
}) {
  const { pathId } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const path = await getPathBySlugAcrossCareers(pathId);

  if (!path) {
    notFound();
  }

  const [moduleIds, completedLessonIds, profile] = await Promise.all([
    Promise.resolve(path.modules.map((mod) => mod.id)),
    getCompletedLessonIds(session.user.id),
    getGamificationProfile(session.user.id),
  ]);

  const completionCounts = await getModuleCompletionCounts(
    session.user.id,
    moduleIds,
  );

  const completedSet = new Set(completedLessonIds);
  const totalLessons = path.modules.reduce(
    (sum, mod) => sum + mod.units.reduce((s, u) => s + u.lessons.length, 0),
    0,
  );
  const completedCount = completedLessonIds.length;
  const progress =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const planet = pathPlanets[path.slug] ?? pathPlanets.linux;

  // Build module zones with lesson states
  const moduleZones = path.modules.map((mod) => {
    const statuses = getLessonStatuses(mod.units, completedSet);
    const allLessons = mod.units.flatMap((u) => u.lessons);
    const lessonBySlug = new Map(allLessons.map((l) => [l.slug, l]));
    return {
      id: mod.id,
      title: mod.title,
      description: mod.description,
      slug: mod.slug,
      icon: mod.icon ?? "BookOpen",
      completedCount: completionCounts.get(mod.id) ?? 0,
      lessons: statuses.map((status) => {
        const lesson =
          lessonBySlug.get(status.lesson.slug ?? "") ?? status.lesson;
        const lessonSlug = lesson.slug ?? "";
        return {
          id: lesson.id,
          title: lesson.title ?? `Lesson ${lesson.order + 1}`,
          slug: lessonSlug,
          estimatedMinutes: lesson.estimatedMinutes ?? 5,
          order: lesson.order,
          state: status.state,
          href: `/learn/${path.slug}/${mod.slug}/${lessonSlug}`,
        };
      }),
    };
  });

  return (
    <div className="relative min-h-0 -mx-4 px-4 -mt-8 pt-8 pb-12 bg-gradient-to-b from-sky-50 via-indigo-50/40 to-background dark:from-[#0a0e1a] dark:via-[#0d1225] dark:to-background">
      {/* Starfield background */}
      <Starfield starCount={100} speed={0.2} className="opacity-60" />

      {/* Nebula glow */}
      <div className="pointer-events-none absolute left-1/4 top-0 size-96 -translate-x-1/2 rounded-full bg-purple-500/5 blur-[120px]" />
      <div className="pointer-events-none absolute right-1/4 top-1/3 size-64 rounded-full bg-blue-500/5 blur-[100px]" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[{ label: "Learn", href: "/learn" }, { label: path.title }]}
        />

        {/* Galaxy Header */}
        <div className="relative mt-6 mb-8 overflow-hidden rounded-3xl border border-border bg-card/80 p-5 sm:p-8 backdrop-blur-sm">
          <div className="absolute -right-16 -top-16 size-48 rounded-full bg-primary/5 blur-3xl" />

          <div className="relative z-10 flex items-start sm:items-center gap-4 sm:gap-6">
            {/* Planet */}
            <div className="relative shrink-0 mt-1">
              <div
                className={`grid size-14 sm:size-20 place-items-center rounded-full bg-gradient-to-br ${planet.color} shadow-2xl`}
              >
                <span className="text-2xl sm:text-4xl drop-shadow-lg">
                  {planet.emoji}
                </span>
              </div>
              {/* Orbital ring */}
              <div
                className="absolute -inset-3 rounded-full border border-dashed border-foreground/10 animate-spin"
                style={{ animationDuration: "15s" }}
              />
              <div
                className="absolute -inset-6 rounded-full border border-dashed border-foreground/5 animate-spin"
                style={{
                  animationDuration: "25s",
                  animationDirection: "reverse",
                }}
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                {planet.subtitle}
              </p>
              <h1 className="text-xl sm:text-3xl font-black tracking-tight text-foreground truncate">
                {path.title}
              </h1>
              {path.description && (
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground line-clamp-2">
                  {path.description}
                </p>
              )}

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className="flex items-center gap-1 rounded-full bg-foreground/5 border border-foreground/10 px-2.5 py-1 text-[10px] font-bold text-muted-foreground">
                  <Sparkles className="size-2.5" />
                  {completedCount}/{totalLessons} stars
                </span>
                {profile && (
                  <>
                    <span className="flex items-center gap-1 rounded-full bg-foreground/5 border border-foreground/10 px-2.5 py-1 text-[10px] font-bold text-streak">
                      <Flame className="size-2.5" />
                      {profile.streak.currentStreak} streak
                    </span>
                    <span className="flex items-center gap-1 rounded-full bg-foreground/5 border border-foreground/10 px-2.5 py-1 text-[10px] font-bold text-xp">
                      <Zap className="size-2.5" />
                      {profile.user.xp} XP
                    </span>
                    <span className="flex items-center gap-1 rounded-full bg-foreground/5 border border-foreground/10 px-2.5 py-1 text-[10px] font-bold text-level">
                      <Trophy className="size-2.5" />
                      Lv.{profile.levelInfo.level}
                    </span>
                  </>
                )}
              </div>

              {/* Mobile progress ring - compact */}
              <div className="mt-3 sm:hidden flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-amber-400 transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs font-black text-foreground shrink-0">
                  {progress}%
                </span>
              </div>
            </div>

            {/* Progress ring - desktop */}
            <div className="hidden sm:flex relative flex-col items-center shrink-0">
              <svg
                width="80"
                height="80"
                viewBox="0 0 80 80"
                className="-rotate-90"
              >
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  className="text-muted-foreground/30"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  fill="none"
                  stroke={`url(#progressGradient-${path.slug})`}
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 34}
                  strokeDashoffset={2 * Math.PI * 34 * (1 - progress / 100)}
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient
                    id={`progressGradient-${path.slug}`}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="oklch(0.72 0.19 142)" />
                    <stop offset="100%" stopColor="oklch(0.82 0.17 85)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-lg font-black text-foreground">
                  {progress}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Galaxy Winding Path */}
        <GalaxyPath modules={moduleZones} />
      </div>
    </div>
  );
}
