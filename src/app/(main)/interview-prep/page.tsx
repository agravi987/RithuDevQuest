import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft, Sparkles } from "lucide-react";

import { auth } from "@/lib/auth";
import { getInterviewCareers } from "@/lib/curriculum/interview";
import { InterviewPrepHub } from "@/components/interview/interview-prep-hub";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { GalaxySection } from "@/components/galaxy/galaxy-section";
import { CosmicCharacter } from "@/components/quiz/characters/CosmicCharacter";

export const metadata: Metadata = {
  title: "Interview Prep",
};

export default async function InterviewPrepPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const careers = await getInterviewCareers();
  const totalQuestions = careers.reduce((sum, c) => sum + c.questionCount, 0);

  return (
    <GalaxySection
      className="-mx-4 -mt-8 px-4 pt-8 pb-16 min-h-screen overflow-hidden"
      starCount={60}
    >
      <div className="relative z-10 mx-auto max-w-5xl space-y-8 pb-8">
        <Breadcrumbs items={[{ label: "Interview Prep" }]} />

        {/* ═══ DUOLINGO 3D HERO: DR. ORION INTERVIEW SIMULATOR ═══ */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-cyan-500/30 border-b-[8px] border-b-cyan-600/40 bg-card p-6 sm:p-8 shadow-2xl shadow-cyan-500/5">
          <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-cyan-500/10 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 size-48 rounded-full bg-blue-500/10 blur-[80px]" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Left: Dr. Orion Rig & Briefing */}
            <div className="flex items-center gap-5">
              <div className="relative shrink-0">
                <div className="relative size-20 sm:size-24 flex items-center justify-center rounded-3xl bg-cyan-500/15 border-2 border-b-4 border-cyan-500/40 shadow-lg shadow-cyan-500/10">
                  <CosmicCharacter
                    characterId="orion"
                    mood="speaking"
                    size="custom"
                    className="size-16 sm:size-20"
                  />
                </div>
                <span className="absolute -bottom-2 -right-2 flex size-7 items-center justify-center rounded-full bg-cyan-400 text-slate-950 font-black text-xs shadow-md">
                  🔬
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border border-b-2 border-cyan-400/40 bg-cyan-400/15 text-cyan-300 text-[10px] font-black uppercase tracking-wider">
                    <Sparkles className="size-3" />
                    Chief Technical Evaluator
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                  Interview Evaluation Lab
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-md font-medium">
                  Practice live adaptive technical dialogues with AI scoring, or drill core concepts with flashcards.
                </p>
              </div>
            </div>

            {/* Right: 3D Summary Counters */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-center">
              <div className="flex flex-col items-center rounded-2xl border-2 border-cyan-500/30 border-b-4 border-b-cyan-600 bg-cyan-500/10 px-5 py-3 min-w-[95px] shadow-sm">
                <span className="text-2xl font-black text-cyan-400">{careers.length}</span>
                <span className="text-[10px] font-black text-cyan-400/80 uppercase tracking-wider">Roles</span>
              </div>
              <div className="flex flex-col items-center rounded-2xl border-2 border-emerald-500/30 border-b-4 border-b-emerald-600 bg-emerald-500/10 px-5 py-3 min-w-[95px] shadow-sm">
                <span className="text-2xl font-black text-emerald-400">{totalQuestions}</span>
                <span className="text-[10px] font-black text-emerald-400/80 uppercase tracking-wider">Questions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Role picker + mode cards */}
        <InterviewPrepHub careers={careers} />

        {/* Back link */}
        <div className="text-center pt-2">
          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-2 rounded-2xl border-2 border-b-4 border-border/80 bg-card px-5 py-2.5 text-xs font-black uppercase tracking-wider text-muted-foreground transition-all hover:border-cyan-400/50 hover:text-foreground active:translate-y-0.5 active:border-b-2"
          >
            <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
            Back to Mission Hub
          </Link>
        </div>
      </div>
    </GalaxySection>
  );
}