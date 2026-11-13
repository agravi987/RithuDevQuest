"use client";

import { useState } from "react";
import Link from "next/link";
import { Briefcase, Play, Layers, Sparkles, CheckCircle2 } from "lucide-react";
import type { InterviewCareer } from "@/lib/curriculum/interview";
import { DuoButton } from "@/components/quiz/duo-button";
import { cn } from "@/lib/utils";

type Props = {
  careers: InterviewCareer[];
};

export function InterviewPrepHub({ careers }: Props) {
  const [selected, setSelected] = useState(careers[0]?.slug ?? "");
  const selectedCareer = careers.find((c) => c.slug === selected) ?? careers[0];

  return (
    <section className="space-y-10">
      {/* ═══ 1. DUOLINGO 3D ROLE PICKER ═══ */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
            <Sparkles className="size-3.5 text-cyan-400" />
            Select Career Specialization
          </h2>
          <span className="text-xs font-black text-cyan-400">
            {careers.length} Roles Available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {careers.map((career) => {
            const isSelected = selected === career.slug;
            return (
              <button
                key={career.id}
                type="button"
                onClick={() => setSelected(career.slug)}
                className={cn(
                  "relative rounded-2xl border-2 p-4 text-left transition-all duration-150 flex flex-col justify-between",
                  isSelected
                    ? "border-cyan-400 border-b-[6px] border-b-cyan-600 bg-cyan-500/15 shadow-lg shadow-cyan-500/10 text-cyan-100"
                    : "border-border/70 border-b-[6px] border-b-border bg-card/60 hover:border-cyan-400/40 hover:bg-card active:translate-y-1 active:border-b-[2px]",
                )}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div
                      className={cn(
                        "grid size-10 place-items-center rounded-xl border-2 border-b-3",
                        isSelected
                          ? "bg-cyan-400/20 border-cyan-400/40 text-cyan-300"
                          : "bg-muted border-border/80 text-muted-foreground",
                      )}
                    >
                      <Briefcase className="size-5" />
                    </div>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-cyan-400 bg-cyan-500/20 px-2 py-0.5 rounded-full border border-cyan-400/30">
                        <CheckCircle2 className="size-3" />
                        Active
                      </span>
                    )}
                  </div>

                  <h3 className="mt-3 text-sm font-black leading-tight text-foreground">
                    {career.title}
                  </h3>
                  {career.description && (
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground font-medium">
                      {career.description}
                    </p>
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-border/40 flex gap-2">
                  <span className="rounded-full bg-slate-800/80 border border-slate-700/80 px-2 py-0.5 text-[10px] font-black text-slate-300">
                    {career.questionCount} Qs
                  </span>
                  <span className="rounded-full bg-slate-800/80 border border-slate-700/80 px-2 py-0.5 text-[10px] font-black text-slate-300">
                    {career.skillCount} Skills
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══ 2. DUOLINGO 3D MODE CARDS ═══ */}
      {selectedCareer && (
        <div className="grid gap-6 sm:grid-cols-2">
          {/* AI Mock Interview Card */}
          <div className="relative overflow-hidden rounded-3xl border-2 border-cyan-500/30 border-b-[8px] border-b-cyan-600/40 bg-card p-6 shadow-xl shadow-cyan-500/5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="grid size-14 place-items-center rounded-2xl bg-cyan-500/15 border-2 border-b-4 border-cyan-500/40 text-cyan-400 shadow-md">
                  <Play className="size-7 fill-cyan-400 ml-1" />
                </div>
                <span className="rounded-full border border-b-2 border-cyan-400/40 bg-cyan-400/15 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-cyan-300">
                  AI Evaluator
                </span>
              </div>

              <h3 className="text-xl font-black text-foreground">AI Mock Interview</h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground font-medium">
                5-round live technical dialogue with real-time scoring, intelligent follow-up questions, and a detailed officer evaluation summary.
              </p>

              {selectedCareer.skillNames.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {selectedCareer.skillNames.slice(0, 4).map((name) => (
                    <span
                      key={name}
                      className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-cyan-300"
                    >
                      {name}
                    </span>
                  ))}
                  {selectedCareer.skillNames.length > 4 && (
                    <span className="rounded-full border border-slate-700 bg-slate-800 px-2 py-0.5 text-[10px] font-black text-slate-400">
                      +{selectedCareer.skillNames.length - 4}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-border/50">
              <Link href={`/interview-prep/mock?career=${selected}`} className="block">
                <DuoButton variant="secondary" size="lg" className="w-full">
                  <Play className="size-4 fill-current mr-2" />
                  Launch Live Mock Interview
                </DuoButton>
              </Link>
            </div>
          </div>

          {/* Flashcard Review Card */}
          <div className="relative overflow-hidden rounded-3xl border-2 border-emerald-500/30 border-b-[8px] border-b-emerald-600/40 bg-card p-6 shadow-xl shadow-emerald-500/5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="grid size-14 place-items-center rounded-2xl bg-emerald-500/15 border-2 border-b-4 border-emerald-500/40 text-emerald-400 shadow-md">
                  <Layers className="size-7 text-emerald-400" />
                </div>
                <span className="rounded-full border border-b-2 border-emerald-400/40 bg-emerald-400/15 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-300">
                  Concept Drills
                </span>
              </div>

              <h3 className="text-xl font-black text-foreground">Flashcard Review</h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground font-medium">
                Rapid-fire flip-card drill reviewing key engineering concepts and design trade-offs for <span className="text-foreground font-black">{selectedCareer.title}</span>.
              </p>

              <div className="mt-4 flex items-center gap-2">
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-black text-emerald-400">
                  📚 {selectedCareer.questionCount} Cards in Queue
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border/50">
              <Link href={`/interview-prep/flashcards?career=${selected}`} className="block">
                <DuoButton variant="primary" size="lg" className="w-full">
                  <Layers className="size-4 mr-2" />
                  Begin Flashcard Drill
                </DuoButton>
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}