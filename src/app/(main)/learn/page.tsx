import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";

import { getCareerBySlug, getAllCareers } from "@/lib/curriculum/queries";
import { getModuleCompletionCounts } from "@/lib/progress/queries";
import { getNextQuest } from "@/lib/progress/getNextQuest";
import { auth } from "@/lib/auth";
import { LearnPageClient } from "@/components/learning-path/learn-page-client";
import { CareerPicker } from "@/components/learning-path/career-picker";
import { SpaceshipPlayer } from "@/components/galaxy/spaceship-player";
import { GalaxySection } from "@/components/galaxy/galaxy-section";
import { ContinueQuest } from "@/components/galaxy/continue-quest";

export const metadata: Metadata = {
  title: "Learn",
};

export default async function LearnPage({
  searchParams,
}: {
  searchParams: Promise<{ career?: string }>;
}) {
  const session = await auth();
  const careers = await getAllCareers();
  const requested = (await searchParams).career;

  const careerSlug =
    careers.find((c) => c.slug === requested)?.slug ?? careers[0]?.slug;
  if (!careerSlug) {
    redirect("/dashboard");
  }

  const career = await getCareerBySlug(careerSlug);
  if (!career) {
    redirect("/dashboard");
  }

  // Per-career progress (only when authenticated) for the sector selector.
  let careerStats: Record<string, { progress: number; pathCount: number }> = {};
  if (session?.user?.id) {
    const deep = await Promise.all(
      careers.map(async (c) => {
        const found = await getCareerBySlug(c.slug);
        return found;
      }),
    );
    const allModuleIds = deep.flatMap((c) =>
      c ? c.paths.flatMap((p) => p.modules.map((m) => m.id)) : [],
    );
    const counts = await getModuleCompletionCounts(
      session.user.id,
      allModuleIds,
    );
    careerStats = Object.fromEntries(
      deep.map((c) => {
        if (!c) return [];
        const modules = c.paths.flatMap((p) => p.modules);
        const total = modules.reduce(
          (s, m) => s + m.units.reduce((u, un) => u + un.lessons.length, 0),
          0,
        );
        const completed = modules.reduce(
          (s, m) => s + (counts.get(m.id) ?? 0),
          0,
        );
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
        return [c.slug, { progress, pathCount: c.paths.length }];
      }),
    );
  }

  const paths = career.paths.map((path) => ({
    id: path.id,
    title: path.title,
    description: path.description,
    slug: path.slug,
    moduleCount: path.modules.length,
    lessonCount: path.modules.reduce(
      (sum, module) =>
        sum +
        module.units.reduce(
          (unitSum, unit) => unitSum + unit.lessons.length,
          0,
        ),
      0,
    ),
  }));

  const careerProgress = careerStats[career.slug]?.progress ?? 0;

  const nextQuest = session?.user?.id
    ? await getNextQuest(session.user.id)
    : null;

  return (
    <GalaxySection
      className="-mx-4 -mt-8 px-4 pt-8 pb-12 min-h-screen overflow-hidden"
      starCount={80}
    >
      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-foreground/5 border border-foreground/10 px-3 sm:px-4 py-1.5 text-xs font-bold text-foreground/70 mb-4 backdrop-blur-sm">
            <Sparkles className="size-3 text-amber-400" />
            Sector · {career.title} · {career.paths.length} worlds to explore
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2 text-foreground">
            Choose Your Planet
          </h1>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto px-4 mb-6">
            Each career is a world in the galaxy. Fly toward a destination and
            follow its constellation trail to mastery.
          </p>

          {/* Spaceship hovering over the sector selector */}
          <div className="relative mb-3 inline-block">
            <SpaceshipPlayer size={56} state="current" label />
          </div>

          <CareerPicker
            careers={careers.map((c) => ({
              slug: c.slug,
              title: c.title,
              progress: careerStats[c.slug]?.progress,
              pathCount: careerStats[c.slug]?.pathCount ?? c.paths.length,
            }))}
            activeSlug={careerSlug}
          />
        </div>

        {/* Continue Your Quest — next mission across the galaxy */}
        {nextQuest && (
          <div className="mx-auto mb-6 max-w-3xl">
            <ContinueQuest quest={nextQuest} />
          </div>
        )}

        {/* Fleet status for the active sector */}
        <div className="mb-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <span className="hidden sm:flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-400 shadow shadow-emerald-400/40" />
            Active sector
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-amber-400 shadow shadow-amber-400/40" />
            {careerProgress > 0
              ? `${careerProgress}% explored`
              : "Awaiting first contact"}
          </span>
        </div>

        {/* Planet Cards */}
        <LearnPageClient paths={paths} />

        {/* Footer note */}
        <div className="text-center mt-10">
          <p className="text-xs text-muted-foreground animate-float-sparkle">
            Each world contains {paths[0]?.moduleCount ?? 4} orbital zones with{" "}
            {paths[0]?.lessonCount ?? 19} stars to discover
          </p>
        </div>
      </div>
    </GalaxySection>
  );
}
