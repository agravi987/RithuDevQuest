import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Target, ArrowRight, ShieldAlert, CheckCircle } from "lucide-react";

import { auth } from "@/lib/auth";
import { getUserSkillsMastery } from "@/lib/mastery/queries";
import { getSkillRecommendations } from "@/lib/mastery/recommendation";
import { AIPracticeBox } from "@/components/practice/ai-practice-box";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "AI Practice Arena",
};

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
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500/15 via-background to-primary/10 border-2 border-border/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg border-2 border-white/40">
              <Target className="size-8 fill-white/20 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Adaptive Learning
                </span>
                <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  AI-Powered
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                AI Practice Arena
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Target weak areas, reinforce conceptual mastery, and sharpen your DevOps skills.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Weak Skills Section */}
      {recommendations.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="size-5 text-amber-500" />
              <h2 className="text-lg font-bold tracking-tight">
                Recommended Focus Areas ({recommendations.length})
              </h2>
            </div>
            <span className="text-xs text-muted-foreground">
              Calculated based on your recent quiz attempts
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((rec) => (
              <Card
                key={rec.skillId}
                className="border-2 border-border/80 shadow-sm hover:shadow-md transition-all hover:border-amber-500/40"
              >
                <CardContent className="p-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-muted-foreground uppercase">
                        {rec.topic}
                      </span>
                      <h3 className="font-bold text-base capitalize">
                        {rec.skillName.replace(/-/g, " ")}
                      </h3>
                    </div>
                    <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                      {rec.currentMastery}% Mastery
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {rec.reason}
                  </p>

                  <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">
                      Lesson: {rec.lessonTitle}
                    </span>
                    <Button asChild size="sm" className="font-bold gap-1 rounded-xl">
                      <Link href={rec.actionHref}>
                        Practice <ArrowRight className="size-3.5" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="size-5 text-primary" />
            <h2 className="text-lg font-bold tracking-tight">
              All Skills Mastery Matrix ({skills.length} skills)
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {skills.map((s) => (
            <div
              key={s.skillId}
              className="p-4 rounded-2xl border-2 border-border/70 bg-card flex flex-col gap-2 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold capitalize text-foreground">
                  {s.skillName.replace(/-/g, " ")}
                </span>
                <span className="text-xs font-bold text-muted-foreground">
                  {s.mastery.score}%
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground truncate">
                {s.pathTitle} · {s.moduleTitle}
              </p>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden border border-border/50">
                <div
                  className="h-full bg-primary rounded-full"
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
