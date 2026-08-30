import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Target, ArrowRight, ShieldAlert, CheckCircle, Sparkles } from "lucide-react";

import { auth } from "@/lib/auth";
import { getUserSkillsMastery } from "@/lib/mastery/queries";
import { getSkillRecommendations } from "@/lib/mastery/recommendation";
import { AIPracticeBox } from "@/components/practice/ai-practice-box";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";

export const metadata: Metadata = {
  title: "AI Practice Arena",
};

function getMasteryColor(score: number): string {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 60) return "bg-blue-500";
  if (score >= 40) return "bg-amber-500";
  return "bg-red-400";
}

function getMasteryTextColor(score: number): string {
  if (score >= 80) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 60) return "text-blue-600 dark:text-blue-400";
  if (score >= 40) return "text-amber-600 dark:text-amber-400";
  return "text-red-500";
}

export default async function PracticePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const [skills, recommendations] = await Promise.all([
    getUserSkillsMastery(session.user.id),
    getSkillRecommendations(session.user.id),
  ]);

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto pb-12">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: "Practice" }]} />

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500/10 via-card to-primary/5 border-2 border-primary/10 p-5 sm:p-8">
        <div className="absolute -right-16 -top-16 size-48 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 size-36 rounded-full bg-emerald-500/5 blur-3xl" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <div className="grid size-12 sm:size-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-lg shadow-primary/15 border-2 border-white/30">
            <Target className="size-6 sm:size-8" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                Adaptive Learning
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                AI-Powered
              </span>
              <Sparkles className="size-3 text-amber-400 fill-amber-400/50" />
            </div>
            <h1 className="text-xl sm:text-3xl font-black tracking-tight">
              AI Practice Arena
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Target weak areas, reinforce conceptual mastery, and sharpen your DevOps skills.
            </p>
          </div>
        </div>
      </div>

      {/* Recommended Weak Skills Section */}
      {recommendations.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="grid size-8 place-items-center rounded-xl bg-amber-500/10 text-amber-500">
                <ShieldAlert className="size-4" />
              </div>
              <h2 className="text-lg font-bold tracking-tight">
                Focus Areas
              </h2>
              <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {recommendations.length}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recommendations.map((rec) => (
              <div
                key={rec.skillId}
                className="group relative overflow-hidden rounded-2xl border-2 border-amber-500/15 bg-card p-5 hover:border-amber-500/30 hover:shadow-md hover:shadow-amber-500/5 transition-all duration-300 magnetic-lift"
              >
                <div className="absolute -right-8 -top-8 size-24 rounded-full bg-amber-500/5 blur-2xl transition-opacity group-hover:opacity-100 opacity-0" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-2">
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                        {rec.topic}
                      </span>
                      <h3 className="font-bold capitalize truncate">
                        {rec.skillName.replace(/-/g, " ")}
                      </h3>
                    </div>
                    <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                      {rec.currentMastery}%
                    </span>
                  </div>

                  {/* Mastery bar */}
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted mb-3">
                    <div
                      className="h-full rounded-full bg-amber-500 transition-all"
                      style={{ width: `${rec.currentMastery}%` }}
                    />
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                    {rec.reason}
                  </p>
                  <div className="flex items-center justify-between gap-3 pt-2 border-t border-border/30">
                    <span className="text-[10px] font-semibold text-muted-foreground truncate">
                      📚 {rec.lessonTitle}
                    </span>
                    <Button asChild size="sm" className="h-8 shrink-0 rounded-lg font-bold text-xs gap-1 shadow-sm shadow-primary/10 hover:shadow-md hover:shadow-primary/20 transition-all duration-200">
                      <Link href={rec.actionHref}>
                        Practice <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Interactive AI Practice Generator */}
      <section className="flex flex-col gap-4">
        <AIPracticeBox />
      </section>

      {/* Full Skill Mastery Matrix */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="grid size-8 place-items-center rounded-xl bg-primary/10 text-primary">
            <CheckCircle className="size-4" />
          </div>
          <h2 className="text-lg font-bold tracking-tight">
            Skill Mastery
          </h2>
          <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {skills.length} skills
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5" role="list" aria-label="Skill mastery list">
          {skills.length === 0 && (
            <div className="col-span-full text-center py-8">
              <p className="text-sm text-muted-foreground">Complete lessons to build your skill mastery profile.</p>
            </div>
          )}
          {skills.map((s) => (
            <div
              key={s.skillId}
              className="group rounded-2xl border-2 border-border/50 bg-card p-4 hover:border-primary/20 hover:shadow-sm hover:shadow-primary/5 transition-all duration-200 hover:scale-[1.01]"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold capitalize text-foreground truncate">
                  {s.skillName.replace(/-/g, " ")}
                </span>
                <span className={`text-xs font-black ${getMasteryTextColor(s.mastery.score)}`}>
                  {s.mastery.score}%
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground truncate mb-2">
                {s.pathTitle} · {s.moduleTitle}
              </p>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getMasteryColor(s.mastery.score)}`}
                  style={{ width: `${s.mastery.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
