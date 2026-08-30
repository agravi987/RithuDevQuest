import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft, Sparkles, Trophy } from "lucide-react";

import { GalaxyPath } from "@/components/learning-path/galaxy-path";
import { getModuleBySlug } from "@/lib/curriculum/queries";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getCompletedLessonIds } from "@/lib/progress/queries";
import { getLessonStatuses } from "@/lib/curriculum/navigation";
import { getPlanetForCareer } from "@/lib/galaxy-assets";
import { PlanetVisual } from "@/components/galaxy/planet-visual";
import { GalaxySection } from "@/components/galaxy/galaxy-section";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pathId: string; moduleId: string }>;
}): Promise<Metadata> {
  const { moduleId } = await params;
  return {
    title:
      moduleId.charAt(0).toUpperCase() + moduleId.slice(1).replace(/-/g, " "),
  };
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ pathId: string; moduleId: string }>;
}) {
  const { pathId, moduleId } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const mod = await getModuleBySlug(pathId, moduleId);

  if (!mod || mod.path.slug !== pathId) {
    notFound();
  }

  const career = await prisma.career.findUnique({
    where: { id: mod.path.careerId },
    select: { slug: true },
  });

  const completedLessonIds = await getCompletedLessonIds(session.user.id);

  const allLessons = mod.units.flatMap((unit) => unit.lessons);
  const totalLessons = allLessons.length;
  const completedCount = allLessons.filter((lesson) =>
    completedLessonIds.includes(lesson.id),
  ).length;
  const progress =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const statuses = getLessonStatuses(mod.units, new Set(completedLessonIds));
  const statusByLessonId = new Map(
    statuses.map((status) => [status.lesson.id, status.state]),
  );

  const unitZones = mod.units.map((unit) => ({
    id: unit.id,
    title: unit.title,
    description: unit.description,
    slug: unit.slug,
    icon: "",
    lessons: unit.lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title ?? `Lesson ${lesson.order + 1}`,
      slug: lesson.slug,
      estimatedMinutes: lesson.estimatedMinutes,
      order: lesson.order,
      state: statusByLessonId.get(lesson.id) ?? "locked",
      href: `/learn/${pathId}/${moduleId}/${lesson.slug}`,
    })),
  }));

  const planet = getPlanetForCareer(career?.slug ?? "");

  return (
    <GalaxySection>
      <div className="flex flex-col gap-8">
        {/* Orbital Destination hero */}
        <section className="relative overflow-hidden rounded-3xl border border-border bg-card/80 p-5 sm:p-8 backdrop-blur-sm">
          <div className="pointer-events-none absolute -left-16 -top-16 size-56 rounded-full bg-primary/10 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-20 -right-10 size-56 rounded-full bg-achievement/10 blur-[110px]" />

          <Link
            href={`/learn/${pathId}`}
            className="relative z-10 mb-5 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="size-4" />
            {mod.path.title}
          </Link>

          <div className="relative z-10 flex items-start gap-5 sm:gap-8">
            {/* The module's destination planet */}
            <div className="relative mt-1 shrink-0">
              <PlanetVisual
                src={planet.src}
                alt={planet.alt}
                size={110}
                orbit
                orbitDouble
                glow
                float
                priority
              />
              <div
                className={`absolute inset-0 rounded-full mix-blend-overlay ${planet.hue}`}
              />
            </div>

            <div className="min-w-0 flex-1">
              <p
                className={`mb-1 text-[10px] font-bold uppercase tracking-widest ${planet.accent}`}
              >
                Orbital Destination
              </p>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                {mod.title}
              </h1>
              {mod.description && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {mod.description}
                </p>
              )}

              {/* Stats + progress */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-foreground/5 border border-foreground/10 px-2.5 py-1 text-[11px] font-bold text-muted-foreground">
                  <Sparkles className="size-3" />
                  {completedCount}/{totalLessons} lessons
                </span>
                <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold border border-foreground/10 text-muted-foreground">
                  <Trophy className="size-3 text-amber-500" />
                  {progress}% resolved
                </span>
              </div>

              <div className="mt-3 h-1.5 w-full max-w-sm rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-400 transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        <GalaxyPath modules={unitZones} />
      </div>
    </GalaxySection>
  );
}
