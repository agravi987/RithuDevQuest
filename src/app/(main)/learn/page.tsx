import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getCareerBySlug, getAllCareers } from "@/lib/curriculum/queries";
import { getModuleCompletionCounts } from "@/lib/progress/queries";
import { getNextQuest } from "@/lib/progress/getNextQuest";
import { auth } from "@/lib/auth";
import { LearnPageClient } from "@/components/learning-path/learn-page-client";
import { LearnHero } from "@/components/learning-path/learn-hero";
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
      className="-mx-4 -mt-8 px-4 pt-8 pb-16 min-h-screen overflow-hidden"
      starCount={100}
    >
      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Header */}
        <LearnHero
          careerTitle={career.title}
          careers={careers.map((c) => ({
            slug: c.slug,
            title: c.title,
            progress: careerStats[c.slug]?.progress,
            pathCount: careerStats[c.slug]?.pathCount ?? c.paths.length,
          }))}
          activeSlug={careerSlug}
        />

        {nextQuest && (
          <div className="mx-auto mb-8 max-w-3xl animate-page-fade">
            <ContinueQuest quest={nextQuest} />
          </div>
        )}

        {/* Fleet status */}
        <div className="mb-8 flex items-center justify-center gap-4 text-xs animate-page-fade">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="size-2 rounded-full bg-emerald-400 shadow shadow-emerald-400/40" />
            {careerProgress > 0 ? `${careerProgress}% explored` : "New sector"}
          </span>
          <span className="h-3 w-px bg-border" />
          <span className="text-muted-foreground">
            {paths.length} worlds · {paths.reduce((s, p) => s + p.lessonCount, 0)} lessons
          </span>
        </div>

        {/* Section header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border/50" />
          <h2 className="text-sm font-bold text-muted-foreground/60">Learning Worlds</h2>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border/50" />
        </div>

        <LearnPageClient paths={paths} />

        <div className="text-center mt-12 space-y-2">
          <p className="text-xs text-muted-foreground">
            {paths.length} worlds · {paths.reduce((s, p) => s + p.lessonCount, 0)} lessons · {paths.reduce((s, p) => s + p.moduleCount, 0)} modules
          </p>
          <p className="text-[10px] text-muted-foreground/50">
            Tap a world to begin your journey
          </p>
        </div>
      </div>
    </GalaxySection>
  );
}
