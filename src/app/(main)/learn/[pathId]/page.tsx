import type { Metadata } from "next";
import { Suspense } from "react";
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
import Link from "next/link";
import { getCrossReferencesForPath } from "@/lib/curriculum/cross-references";
import { CosmicCharacter } from "@/components/quiz/characters/CosmicCharacter";
import { PrerequisiteTracks } from "@/components/learning-path/prerequisite-tracks";

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
  const prerequisites = getCrossReferencesForPath(path.slug);

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
        const fullLesson = lessonBySlug.get(status.lesson.slug ?? "");
        const lesson = fullLesson ?? status.lesson;
        const lessonSlug = lesson.slug ?? "";
        return {
          id: lesson.id,
          title: lesson.title ?? `Lesson ${lesson.order + 1}`,
          description: fullLesson?.description ?? null,
          skills: fullLesson?.skills?.map((s) => s.name) ?? [],
          slug: lessonSlug,
          estimatedMinutes: ("estimatedMinutes" in lesson ? (lesson as { estimatedMinutes?: number }).estimatedMinutes : 5) ?? 5,
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

        {/* Duolingo Winding Path & Right Rail */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Suspense fallback={<div className="h-96 w-full animate-pulse rounded-3xl bg-white/5" />}>
            <GalaxyPath
              modules={moduleZones}
              careerSlug={path.slug}
              streak={profile?.streak.currentStreak}
            />
          </Suspense>

          {/* Duolingo Sticky Right Sidebar */}
          <div className="hidden lg:flex flex-col gap-5 sticky top-20 self-start w-[320px]">
            {/* 1. Daily Quests Progress Card */}
            <div className="duo-card-3d rounded-3xl border-2 border-white/10 bg-[#0d1527] p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📋</span>
                  <h4 className="text-xs font-black uppercase tracking-wider text-white">Daily Quests</h4>
                </div>
                <Link href="/practice/daily-challenge" className="text-[10px] font-black uppercase text-emerald-400 hover:underline">
                  View All
                </Link>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                    <span>Earn 20 XP</span>
                    <span className="text-emerald-400 font-black">⚡ 20 XP</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-400" style={{ width: `${Math.min(100, ((profile?.user.xp ?? 0) % 50) * 2)}%` }} />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                    <span>Complete 1 Lesson</span>
                    <span className="text-amber-400 font-black">🎁 Chest</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-amber-400" style={{ width: completedCount > 0 ? "100%" : "0%" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Cosmic Crew Motivation Card */}
            <div className="duo-card-3d rounded-3xl border-2 border-emerald-500/30 bg-[#0d1527] p-5 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="size-12 shrink-0 flex items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/30 p-1">
                  <CosmicCharacter characterId="rithu" mood="happy_jump" size="xs" className="size-full" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                    Commander Rithu
                  </span>
                  <p className="text-xs font-bold text-slate-200 mt-0.5 leading-snug">
                    One lesson a day keeps your streak blazing! Tap any unlocked node to practice.
                  </p>
                </div>
              </div>
            </div>

            {prerequisites.length > 0 && (
              <div className="self-start w-full">
                <PrerequisiteTracks references={prerequisites} />
              </div>
            )}
          </div>
        </div>
      </div>
    </GalaxySection>
  );
}
