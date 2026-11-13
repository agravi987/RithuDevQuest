import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getCareerBySlug, getAllCareers } from "@/lib/curriculum/queries";
import { getModuleCompletionCounts } from "@/lib/progress/queries";
import { getNextQuest } from "@/lib/progress/getNextQuest";
import { auth } from "@/lib/auth";
import { LearnPageClient } from "@/components/learning-path/learn-page-client";
import { LearnHero } from "@/components/learning-path/learn-hero";
import { GalaxySection } from "@/components/galaxy/galaxy-section";
import { Sparkles, Compass, Rocket } from "lucide-react";

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
  const pathProgressMap = new Map<string, number>();

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

    for (const p of career.paths) {
      const total = p.modules.reduce(
        (s, m) => s + m.units.reduce((u, un) => u + un.lessons.length, 0),
        0,
      );
      const completed = p.modules.reduce(
        (s, m) => s + (counts.get(m.id) ?? 0),
        0,
      );
      const prog = total > 0 ? Math.round((completed / total) * 100) : 0;
      pathProgressMap.set(p.slug, prog);
    }
  }

  const nextQuest = session?.user?.id
    ? await getNextQuest(session.user.id)
    : null;

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
    progress: pathProgressMap.get(path.slug) ?? 0,
    isRecommended: nextQuest ? nextQuest.pathSlug === path.slug : false,
  }));

  const careerProgress = careerStats[career.slug]?.progress ?? 0;
  const totalLessons = paths.reduce((s, p) => s + p.lessonCount, 0);

  return (
    <GalaxySection className="pb-16">
      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Duolingo Hero with Mascot */}
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

        {/* Tactical Fleet Status HUD */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-3 sm:gap-6 animate-page-fade select-none">
          <div className="inline-flex items-center gap-2 rounded-2xl border-2 border-b-4 border-white/10 bg-[#0c1222]/80 px-4 py-2 text-xs font-black text-slate-300 shadow-sm backdrop-blur-md">
            <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
            <span className="text-emerald-400">{careerProgress}%</span>
            <span className="text-slate-400">Mastered</span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-2xl border-2 border-b-4 border-white/10 bg-[#0c1222]/80 px-4 py-2 text-xs font-black text-slate-300 shadow-sm backdrop-blur-md">
            <Compass className="size-3.5 text-cyan-400" />
            <span className="text-white">{paths.length}</span>
            <span className="text-slate-400">Worlds</span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-2xl border-2 border-b-4 border-white/10 bg-[#0c1222]/80 px-4 py-2 text-xs font-black text-slate-300 shadow-sm backdrop-blur-md">
            <Rocket className="size-3.5 text-amber-400" />
            <span className="text-white">{totalLessons}</span>
            <span className="text-slate-400">Interactive Lessons</span>
          </div>
        </div>

        {/* Section Header Banner — Centered & Cohesive */}
        <div className="mb-10 flex flex-col items-center text-center gap-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-400">
            <Sparkles className="size-3 text-emerald-400" />
            <span>Available Learning Worlds</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Select Your Next Destination
          </h2>
          <p className="text-xs sm:text-sm font-medium text-slate-400">
            Pick a sector to explore its step-by-step skill tree
          </p>
          <div className="mt-1 h-1 w-16 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-60" />
        </div>

        {/* World Cards Grid */}
        <LearnPageClient paths={paths} />

        {/* Cadet Motivation Footer */}
        <div className="mt-14 text-center select-none max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-5 py-3 text-xs font-bold text-slate-300 shadow-sm backdrop-blur-sm">
            <span className="text-base">🚀</span>
            <span>
              <strong className="text-emerald-400">Pro Cadet Tip:</strong> Completing all modules in a sector awards permanent mastery crowns and level XP multipliers!
            </span>
          </div>
        </div>
      </div>
    </GalaxySection>
  );
}

