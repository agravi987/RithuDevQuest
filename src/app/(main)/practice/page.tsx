import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  ShieldAlert,
  CheckCircle,
  Sparkles,
  BookOpen,
  Flame,
  Target,
  MessageSquare,
  Heart,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { getUserSkillsMastery } from "@/lib/mastery/queries";
import { getSkillRecommendations } from "@/lib/mastery/recommendation";
import { GalaxySection } from "@/components/galaxy/galaxy-section";
import { AIPracticeBoxClient } from "./AIPracticeBoxClient";
import { CosmicCharacter } from "@/components/quiz/characters/CosmicCharacter";
import { DuoButton } from "@/components/quiz/duo-button";

export const metadata: Metadata = {
  title: "Practice Arena",
};

function getMasteryColor(score: number): string {
  if (score >= 80) return "bg-emerald-400";
  if (score >= 60) return "bg-cyan-400";
  if (score >= 40) return "bg-amber-400";
  return "bg-rose-400";
}

function getMasteryTextColor(score: number): string {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-cyan-400";
  if (score >= 40) return "text-amber-400";
  return "text-rose-400";
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

  const attemptedSkills = skills
    .filter((s) => s.mastery.totalAttempts > 0)
    .sort((a, b) => a.mastery.score - b.mastery.score);

  return (
    <GalaxySection
      className="-mx-4 -mt-8 px-4 pt-8 pb-16 min-h-screen overflow-hidden text-white"
      starCount={60}
    >
      <div className="relative z-10 flex flex-col gap-8 max-w-5xl mx-auto pb-12">
        {/* ═══════════ 1. DUOLINGO PRACTICE ARENA HEADER ═══════════ */}
        <div className="duo-card-3d relative overflow-hidden rounded-3xl border-2 border-white/10 bg-[#0d1527] p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="size-20 sm:size-24 shrink-0 flex items-center justify-center rounded-3xl bg-cyan-500/15 border-2 border-cyan-500/30 p-2 shadow-inner">
              <CosmicCharacter characterId="astra" mood="happy_jump" size="custom" className="size-full" />
            </div>
            <div className="flex-1 text-center sm:text-left min-w-0">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1.5">
                <span className="rounded-lg bg-cyan-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-cyan-400">
                  Starship Training Deck
                </span>
                <span className="text-xs">⚡</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Practice Arena
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-300 font-medium max-w-xl leading-relaxed">
                Sharpen your coding skills with targeted drills, test your speed in rapid quizzes, or simulate realistic technical interviews with the starship crew.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-2xl border-2 border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs font-black text-rose-400 shadow-[0_2px_0_0_#dc2626]">
                <Heart className="size-4 fill-current text-rose-400" />
                <span>Earn Hearts</span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════ 2. DUOLINGO 4 PRACTICE PILLARS ═══════════ */}
        <div>
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
            <span>🎯</span>
            <span>Training Modes</span>
          </h2>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* Mode 1: Daily Challenge */}
            <Link href="/practice/daily-challenge" className="block group">
              <div className="duo-card-3d h-full flex flex-col justify-between rounded-3xl border-2 border-amber-500/30 bg-[#0d1527] p-6 shadow-xl group-hover:border-amber-400/50 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="grid size-12 place-items-center rounded-2xl bg-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform">
                      <Flame className="size-6 animate-pulse" />
                    </div>
                    <span className="rounded-xl bg-amber-500/20 border border-amber-500/30 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-amber-300">
                      ⚡ +30 Bonus XP
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white group-hover:text-amber-300 transition-colors">
                    Daily Challenge
                  </h3>
                  <p className="mt-2 text-xs text-slate-300 font-medium leading-relaxed">
                    Hand-crafted daily challenge to test your fundamental algorithms. Protect your streak and claim bonus Stardust.
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-xs font-black text-amber-400 uppercase tracking-wider">Start Today&apos;s Quest</span>
                  <div className="grid size-8 place-items-center rounded-full bg-amber-500/20 text-amber-400 group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="size-4" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Mode 2: Lightning Blitz */}
            <Link href="/practice/quick" className="block group">
              <div className="duo-card-3d h-full flex flex-col justify-between rounded-3xl border-2 border-cyan-500/30 bg-[#0d1527] p-6 shadow-xl group-hover:border-cyan-400/50 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="grid size-12 place-items-center rounded-2xl bg-cyan-500/20 text-cyan-400 group-hover:scale-110 transition-transform">
                      <Target className="size-6" />
                    </div>
                    <span className="rounded-xl bg-cyan-500/20 border border-cyan-500/30 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-cyan-300">
                      5 Questions
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white group-hover:text-cyan-300 transition-colors">
                    Lightning Blitz
                  </h3>
                  <p className="mt-2 text-xs text-slate-300 font-medium leading-relaxed">
                    Rapid-fire 5-question speed trial across varied concepts. No pressure, perfect for building instinctive coding speed.
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-xs font-black text-cyan-400 uppercase tracking-wider">Launch Blitz</span>
                  <div className="grid size-8 place-items-center rounded-full bg-cyan-500/20 text-cyan-400 group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="size-4" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Mode 3: Crew Mock Interview */}
            <Link href="/interview-prep" className="block group">
              <div className="duo-card-3d h-full flex flex-col justify-between rounded-3xl border-2 border-purple-500/30 bg-[#0d1527] p-6 shadow-xl group-hover:border-purple-400/50 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="grid size-12 place-items-center rounded-2xl bg-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
                      <MessageSquare className="size-6" />
                    </div>
                    <span className="rounded-xl bg-purple-500/20 border border-purple-500/30 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-purple-300">
                      AI Simulator
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white group-hover:text-purple-300 transition-colors">
                    Crew Technical Interview
                  </h3>
                  <p className="mt-2 text-xs text-slate-300 font-medium leading-relaxed">
                    Simulate real-world engineering interviews with Dr. Orion and Astra. Receive comprehensive feedback on your reasoning.
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-xs font-black text-purple-400 uppercase tracking-wider">Enter Interview Room</span>
                  <div className="grid size-8 place-items-center rounded-full bg-purple-500/20 text-purple-400 group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="size-4" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Mode 4: Weak Spots Review */}
            <Link href="/practice/quick?mode=focus" className="block group">
              <div className="duo-card-3d h-full flex flex-col justify-between rounded-3xl border-2 border-emerald-500/30 bg-[#0d1527] p-6 shadow-xl group-hover:border-emerald-400/50 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="grid size-12 place-items-center rounded-2xl bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                      <CheckCircle className="size-6" />
                    </div>
                    <span className="rounded-xl bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-300">
                      Mastery Loop
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white group-hover:text-emerald-300 transition-colors">
                    Targeted Weak Spots
                  </h3>
                  <p className="mt-2 text-xs text-slate-300 font-medium leading-relaxed">
                    Personalized drill focusing directly on concepts you missed or scored low on, reinforcing until mastered.
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">Strengthen Weak Spots</span>
                  <div className="grid size-8 place-items-center rounded-full bg-emerald-500/20 text-emerald-400 group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="size-4" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* ═══════════ 3. FOCUS RECOMMENDATIONS ═══════════ */}
        {recommendations.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="grid size-8 place-items-center rounded-xl bg-amber-500/20 text-amber-400">
                <ShieldAlert className="size-4" />
              </div>
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-300">Recommended Focus Areas</h2>
              <span className="rounded-lg bg-amber-500/20 px-2 py-0.5 text-[10px] font-black text-amber-400">
                {recommendations.length}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" role="list" aria-label="Focus area recommendations">
              {recommendations.map((rec) => (
                <div
                  key={rec.skillId}
                  role="listitem"
                  className="duo-card-3d rounded-3xl border-2 border-amber-500/25 bg-[#0d1527] p-5 shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div className="min-w-0">
                        <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider">
                          {rec.topic}
                        </span>
                        <h3 className="text-base font-black text-white capitalize truncate mt-0.5">
                          {rec.skillName.replace(/-/g, " ")}
                        </h3>
                      </div>
                      <span className="rounded-xl border border-amber-500/30 bg-amber-500/20 px-2.5 py-1 text-xs font-black text-amber-300 shrink-0">
                        {rec.currentMastery}%
                      </span>
                    </div>

                    <div className="h-2 w-full overflow-hidden rounded-full bg-black/40 border border-white/10 mb-3">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all"
                        style={{ width: `${rec.currentMastery}%` }}
                      />
                    </div>

                    <p className="text-xs text-slate-300 font-medium leading-relaxed mb-4">
                      {rec.reason}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/10">
                    <span className="text-xs text-slate-400 font-bold truncate min-w-0" title={rec.lessonTitle}>
                      <BookOpen className="mr-1 inline size-3.5 align-[-1px] text-emerald-400" />
                      {rec.lessonTitle}
                    </span>
                    <Link href={rec.actionHref}>
                      <DuoButton variant="primary" size="sm" className="font-black text-xs uppercase px-4 py-2">
                        Train <ArrowRight className="size-3 ml-1" />
                      </DuoButton>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════ 4. AI CUSTOM SKILL GENERATOR ═══════════ */}
        <div className="duo-card-3d rounded-3xl border-2 border-white/10 bg-[#0d1527] p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="grid size-8 place-items-center rounded-xl bg-cyan-500/20 text-cyan-400">
              <Sparkles className="size-4" />
            </div>
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-300">Custom AI Generator</h2>
          </div>
          <AIPracticeBoxClient />
        </div>

        {/* ═══════════ 5. SKILL MASTERY METRICS ═══════════ */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="grid size-8 place-items-center rounded-xl bg-emerald-500/20 text-emerald-400">
              <CheckCircle className="size-4" />
            </div>
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-300">Skill Mastery Profile</h2>
            {attemptedSkills.length > 0 && (
              <span className="rounded-lg bg-emerald-500/20 px-2 py-0.5 text-[10px] font-black text-emerald-400">
                {attemptedSkills.length} Skills Tracked
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" role="list" aria-label="Skill mastery list">
            {attemptedSkills.length === 0 && (
              <div className="col-span-full duo-card-3d rounded-3xl border-2 border-white/10 bg-[#0d1527] text-center py-10">
                <p className="text-sm text-slate-400 font-medium">Complete lessons to construct your personalized mastery profile.</p>
              </div>
            )}
            {attemptedSkills.map((s) => (
              <div
                key={s.skillId}
                role="listitem"
                className="duo-card-3d rounded-2xl border-2 border-white/10 bg-[#0d1527] p-4 shadow-md"
              >
                <div className="flex items-center justify-between mb-1.5 gap-2">
                  <span
                    className="text-xs font-black capitalize text-white truncate min-w-0"
                    title={s.skillName.replace(/-/g, " ")}
                  >
                    {s.skillName.replace(/-/g, " ")}
                  </span>
                  <span className={`text-xs font-black shrink-0 ${getMasteryTextColor(s.mastery.score)}`}>
                    {s.mastery.score}%
                  </span>
                </div>
                <p
                  className="text-[10px] text-slate-400 font-semibold truncate mb-2"
                  title={`${s.pathTitle} · ${s.moduleTitle}`}
                >
                  {s.pathTitle} · {s.moduleTitle}
                </p>
                <div className="h-2 w-full bg-black/40 border border-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getMasteryColor(s.mastery.score)}`}
                    style={{ width: `${s.mastery.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </GalaxySection>
  );
}
