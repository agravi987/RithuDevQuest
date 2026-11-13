"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Target,
  MessageSquare,
  Flame,
} from "lucide-react";
import type { DashboardCareer } from "@/lib/dashboard/types";
import { DuoButton } from "@/components/quiz/duo-button";

export function DashboardCareers({
  careers,
}: {
  careers: DashboardCareer[];
}) {
  const [selectedCareerSlug, setSelectedCareerSlug] = useState<string>(
    careers[0]?.slug ?? ""
  );

  const selectedCareer =
    careers.find((c) => c.slug === selectedCareerSlug) ?? careers[0];

  const currentPath = selectedCareer?.paths.length
    ? selectedCareer.paths.reduce((best, p) =>
        p.courseProgress > best.courseProgress ? p : best
      )
    : selectedCareer?.paths[0];

  return (
    <div className="flex flex-1 flex-col gap-6 min-w-0">
      {/* ═══ 1. DUOLINGO CAREER TRACK SELECTOR (3D CHUNKY PILLS) ═══ */}
      {careers.length > 1 && (
        <div
          className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1"
          role="group"
          aria-label="Select career planet"
        >
          {careers.map((career) => {
            const active = career.slug === selectedCareer?.slug;
            return (
              <button
                key={career.slug}
                type="button"
                onClick={() => setSelectedCareerSlug(career.slug)}
                className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-all duration-150 active:translate-y-0.5 ${
                  active
                    ? "border-2 border-emerald-500 bg-emerald-500/20 text-emerald-400 shadow-[0_3px_0_0_#059669]"
                    : "border-2 border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <span>🪐</span>
                <span>{career.title}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* ═══ 2. DUOLINGO PRIMARY MISSION CARD (ACTIVE QUEST) ═══ */}
      {currentPath && (
        <div className="duo-card-3d relative overflow-hidden rounded-3xl border-2 border-emerald-500/40 bg-[#0d1527] p-6 sm:p-8 shadow-2xl">
          {/* Ambient Glow */}
          <div className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded-lg bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-400">
                  Current Sector · {selectedCareer.title}
                </span>
                <span className="text-xs text-slate-400 font-bold">
                  {currentPath.completedLessons}/{currentPath.totalLessons} Lessons
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {currentPath.title}
              </h2>
              <p className="mt-1 text-xs sm:text-sm font-medium text-slate-300">
                Continue your learning path to master core concepts and unlock your next milestone!
              </p>

              {/* Capsule Progress Bar */}
              <div className="mt-5 flex items-center gap-3 max-w-md">
                <div className="flex-1 h-3.5 rounded-full bg-black/40 overflow-hidden border border-white/10 p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-700 shadow-[0_0_12px_rgba(52,211,153,0.5)]"
                    style={{ width: `${Math.max(8, currentPath.courseProgress)}%` }}
                  />
                </div>
                <span className="text-xs font-black text-emerald-400 tabular-nums">
                  {currentPath.courseProgress}%
                </span>
              </div>
            </div>

            {/* Chunky 3D Action Button */}
            <div className="shrink-0 flex flex-col items-center sm:items-end">
              <Link href={`/learn/${currentPath.slug}`}>
                <DuoButton
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto px-8 py-4 text-sm font-black uppercase tracking-wider"
                >
                  <span>Continue Mission</span>
                  <ArrowRight className="size-4 ml-2" />
                </DuoButton>
              </Link>
              <span className="mt-2 text-[10px] font-black uppercase tracking-wider text-emerald-400/70">
                ⚡ +10 XP Next Lesson
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ═══ 3. DUOLINGO 3 QUICK PRACTICE MODULES (TACTILE 3D CARDS) ═══ */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <span>⚡</span>
            <span>Speed Practice & Training</span>
          </h3>
          <Link href="/practice" className="text-xs font-black uppercase tracking-wider text-emerald-400 hover:underline">
            View All Practice
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {/* Daily Challenge */}
          <Link href="/practice/daily-challenge" className="block group">
            <div className="duo-card-3d h-full flex flex-col justify-between rounded-3xl border-2 border-amber-500/30 bg-[#0d1527] p-5 shadow-lg group-hover:border-amber-400/50 transition-all">
              <div>
                <div className="grid size-12 place-items-center rounded-2xl bg-amber-500/20 text-amber-400 mb-3 group-hover:scale-110 transition-transform">
                  <Flame className="size-6 animate-pulse" />
                </div>
                <h4 className="text-base font-black text-white group-hover:text-amber-300 transition-colors">
                  Daily Challenge
                </h4>
                <p className="mt-1 text-xs text-slate-300 font-medium leading-relaxed">
                  Today&apos;s special timed challenge. Earn +30 bonus XP and protect streak.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-black text-amber-400 uppercase tracking-wider">
                <span>Start Challenge</span>
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          {/* Quick Blitz */}
          <Link href="/practice/quick" className="block group">
            <div className="duo-card-3d h-full flex flex-col justify-between rounded-3xl border-2 border-cyan-500/30 bg-[#0d1527] p-5 shadow-lg group-hover:border-cyan-400/50 transition-all">
              <div>
                <div className="grid size-12 place-items-center rounded-2xl bg-cyan-500/20 text-cyan-400 mb-3 group-hover:scale-110 transition-transform">
                  <Target className="size-6" />
                </div>
                <h4 className="text-base font-black text-white group-hover:text-cyan-300 transition-colors">
                  Lightning Blitz
                </h4>
                <p className="mt-1 text-xs text-slate-300 font-medium leading-relaxed">
                  Rapid-fire 5 questions across random concepts. Quick 3-minute warm up.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-black text-cyan-400 uppercase tracking-wider">
                <span>Quick Play</span>
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          {/* AI Crew Mentor */}
          <Link href="/interview-prep" className="block group">
            <div className="duo-card-3d h-full flex flex-col justify-between rounded-3xl border-2 border-purple-500/30 bg-[#0d1527] p-5 shadow-lg group-hover:border-purple-400/50 transition-all">
              <div>
                <div className="grid size-12 place-items-center rounded-2xl bg-purple-500/20 text-purple-400 mb-3 group-hover:scale-110 transition-transform">
                  <MessageSquare className="size-6" />
                </div>
                <h4 className="text-base font-black text-white group-hover:text-purple-300 transition-colors">
                  Crew Mock Interview
                </h4>
                <p className="mt-1 text-xs text-slate-300 font-medium leading-relaxed">
                  Interactive dialogue with Dr. Orion and Astra to test your conceptual knowledge.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-black text-purple-400 uppercase tracking-wider">
                <span>Launch Chat</span>
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}