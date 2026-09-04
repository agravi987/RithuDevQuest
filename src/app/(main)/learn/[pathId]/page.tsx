import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Trophy, Flame, Zap, Sparkles, Clock } from "lucide-react";
import { GalaxySection } from "@/components/galaxy/galaxy-section";

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
import { PlanetVisual } from "@/components/galaxy/planet-visual";
import { getPlanetForCareer } from "@/lib/galaxy-assets";
import { getPathVisual, getCareer } from "@/lib/career-metadata";

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
  const pathLessons = path.modules.flatMap((mod) =>
    mod.units.flatMap((u) => u.lessons),
  );
  const totalLessons = pathLessons.length;
  const completedCount = pathLessons.filter((l) => completedSet.has(l.id))
    .length;
  const progress =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Calculate total estimated time
  const totalMinutes = pathLessons.reduce(
    (sum, l) => sum + ((l as { estimatedMinutes?: number }).estimatedMinutes ?? 5),
    0,
  );
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const estimatedTime = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  const planet = getPathVisual(path.slug);
  const careerPlanet = getPlanetForCareer(path.careerId ?? "fallback");

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
    <GalaxySection
      className="-mx-4 -mt-8 px-4 pt-8 pb-16 min-h-screen overflow-hidden"
      starCount={100}
    >
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[{ label: "Learn", href: "/learn" }, { label: path.title }]}
        />

        {/* Galaxy Header */}
        <div className="relative mt-6 mb-10 overflow-hidden rounded-3xl border border-border bg-card/80 p-5 sm:p-8 backdrop-blur-sm">
          <div className="absolute -right-16 -top-16 size-48 rounded-full bg-primary/5 blur-3xl" />

          <div className="relative z-10 flex items-start sm:items-center gap-4 sm:gap-6">
            {/* Planet */}
            <div className="relative shrink-0 mt-1">
              <PlanetVisual
                src={careerPlanet.src}
                alt={careerPlanet.alt}
                size={80}
                orbit
                orbitDouble
                glow
                float
                priority
                emojiFallback={getCareer(path.careerId ?? "")?.emoji ?? "🪐"}
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
                  <Sparkles className="size-2.5 text-amber-500" />
                  {completedCount}/{totalLessons} stars
                </span>
                <span className="flex items-center gap-1 rounded-full bg-foreground/5 border border-foreground/10 px-2.5 py-1 text-[10px] font-bold text-muted-foreground">
                  <Clock className="size-2.5" />
                  ~{estimatedTime}
                </span>
                {profile && (
                  <>
                    <span className="flex items-center gap-1 rounded-full bg-foreground/5 border border-foreground/10 px-2.5 py-1 text-[10px] font-bold text-orange-500 dark:text-orange-400">
                      <Flame className="size-2.5" />
                      {profile.streak.currentStreak} streak
                    </span>
                    <span className="flex items-center gap-1 rounded-full bg-foreground/5 border border-foreground/10 px-2.5 py-1 text-[10px] font-bold text-amber-500 dark:text-amber-400">
                      <Zap className="size-2.5" />
                      {profile.user.xp} XP
                    </span>
                    <span className="flex items-center gap-1 rounded-full bg-foreground/5 border border-foreground/10 px-2.5 py-1 text-[10px] font-bold text-purple-600 dark:text-purple-400">
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
                  className="text-foreground/10"
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
        <GalaxyPath
          modules={moduleZones}
          careerSlug={path.slug}
          streak={profile?.streak.currentStreak}
        />
      </div>
    </GalaxySection>
  );
}
