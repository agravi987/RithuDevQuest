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
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { PlanetVisual } from "@/components/galaxy/planet-visual";
import { SpaceshipPlayer } from "@/components/galaxy/spaceship-player";
import { getPlanetForCareer } from "@/lib/galaxy-assets";
import { getCareer, getModuleIcon } from "@/lib/career-metadata";
import type { DashboardCareer, DashboardProfile } from "@/lib/dashboard/types";

export function DashboardCareers({
  careers,
  profile,
}: {
  careers: DashboardCareer[];
  profile: DashboardProfile;
}) {
  const [selectedCareerSlug, setSelectedCareerSlug] = useState<string>(
    careers[0]?.slug ?? "",
  );

  const selectedCareer =
    careers.find((c) => c.slug === selectedCareerSlug) ?? careers[0];

  const currentPath = selectedCareer?.paths.length
    ? selectedCareer.paths.reduce((best, p) =>
        p.courseProgress > best.courseProgress ? p : best,
      )
    : selectedCareer?.paths[0];

  const planet = getPlanetForCareer(selectedCareer?.slug ?? "");

  return (
    <div className="flex flex-1 flex-col gap-4 min-w-0">
      {/* ═══ CAREER SELECTOR ═══ */}
      {careers.length > 1 && (
        <div
          className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide pb-1 scroll-snap-x"
          role="group"
          aria-label="Select career"
        >
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
                className={`shrink-0 snap-start flex min-h-[36px] items-center rounded-full border px-3 py-1.5 text-[11px] font-bold transition-all ${
                  active
                    ? getCareer(career.slug)?.tabClass ??
                      "text-foreground border-border bg-background"
                    : "text-muted-foreground border-border/60 bg-background/40 hover:text-foreground hover:border-foreground/20"
                }`}
              >
                {career.title}
              </motion.button>
            );
          })}
        </div>
      )}

      {/* ═══ MISSION CARD ═══ */}
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
                  <span className="text-[10px] text-muted-foreground font-medium">progress</span>
                </div>
              </div>

              {/* Progress bar with milestones */}
              <div className="mb-4">
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full progress-animated"
                    style={{ width: `${currentPath.courseProgress}%` }}
                  />
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
                className="group inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-5 py-2.5 text-sm font-bold text-primary hover:bg-primary/10 hover:border-primary/50 transition-all active:scale-[0.98]"
              >
                <Rocket className="size-4 transition-transform group-hover:-rotate-12 group-hover:scale-110" />
                Continue Learning
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* ═══ QUICK ACTIONS ═══ */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 px-1">
          Quick Actions
        </p>
        <div className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-3 gap-3">
          <AnimateOnScroll delay={0}>
            <ActionTile
              href={`/learn/${currentPath?.slug ?? "linux"}`}
              icon={<BookOpen className="size-5" />}
              title="Learn"
              subtitle="Explore paths and unlock worlds"
              gradient="from-primary/10 to-emerald-500/5"
              borderHover="hover:border-primary/30"
              iconBg="bg-primary/10 text-primary"
            />
          </AnimateOnScroll>
          <AnimateOnScroll delay={50}>
            <ActionTile
              href="/practice"
              icon={<Sparkles className="size-5" />}
              title="AI Practice"
              subtitle="Generate AI practice questions"
              gradient="from-xp/10 to-amber-500/5"
              borderHover="hover:border-xp/30"
              iconBg="bg-xp/10 text-xp"
            />
          </AnimateOnScroll>
          <AnimateOnScroll delay={100}>
            <ActionTile
              href="/practice/quick"
              icon={<Target className="size-5" />}
              title="Quick Practice"
              subtitle="Casual topic practice, no XP"
              gradient="from-sky-500/10 to-cyan-500/5"
              borderHover="hover:border-sky-500/30"
              iconBg="bg-sky-500/10 text-sky-500"
            />
          </AnimateOnScroll>
          <AnimateOnScroll delay={150}>
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
        </div>
      </div>
    </div>
  );
}

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