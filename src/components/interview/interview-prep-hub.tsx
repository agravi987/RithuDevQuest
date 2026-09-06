"use client";

import { useState } from "react";
import Link from "next/link";
import { Briefcase, Play, Layers } from "lucide-react";
import type { InterviewCareer } from "@/lib/curriculum/interview";

const CARD_GRADIENTS = [
  "from-primary/10 to-primary/5",
  "from-xp/10 to-xp/5",
  "from-achievement/10 to-achievement/5",
  "from-emerald-500/10 to-emerald-500/5",
  "from-amber-500/10 to-amber-500/5",
];

type Props = {
  careers: InterviewCareer[];
};

export function InterviewPrepHub({ careers }: Props) {
  const [selected, setSelected] = useState(careers[0]?.slug ?? "");
  const selectedCareer = careers.find((c) => c.slug === selected) ?? careers[0];

  return (
    <section className="space-y-12">
      {/* Role picker */}
      <div className="space-y-4">
        <h2 className="text-center text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Choose a role
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {careers.map((career, i) => (
            <button
              key={career.id}
              onClick={() => setSelected(career.slug)}
              className={`relative rounded-2xl border p-4 text-left transition-all ${
                selected === career.slug
                  ? "border-primary/60 bg-primary/10 shadow-lg shadow-primary/10"
                  : "border-border/40 bg-card/50 hover:border-primary/20 hover:shadow-md"
              }`}
            >
              <div
                className={`grid size-10 place-items-center rounded-xl bg-gradient-to-br ${CARD_GRADIENTS[i % CARD_GRADIENTS.length]}`}
              >
                <Briefcase className="size-5 text-primary/70" />
              </div>
              <h3 className="mt-3 text-sm font-black leading-tight">
                {career.title}
              </h3>
              {career.description && (
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {career.description}
                </p>
              )}
              <div className="mt-3 flex gap-2">
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                  {career.questionCount} questions
                </span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                  {career.skillCount} skills
                </span>
              </div>
              {selected === career.slug && (
                <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-primary/30" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Mode cards */}
      {selectedCareer && (
        <div className="grid gap-6 sm:grid-cols-2">
          <Link
            href={`/interview-prep/mock?career=${selected}`}
            className="group relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-6 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
          >
            <div className="grid size-12 place-items-center rounded-2xl bg-primary/20 text-primary transition-transform group-hover:scale-110">
              <Play className="size-6 fill-current" />
            </div>
            <h3 className="mt-4 text-lg font-black">AI Mock Interview</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              5-round live interview with AI scoring, follow-ups, and a final
              summary report.
            </p>
            {selectedCareer.skillNames.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedCareer.skillNames.slice(0, 4).map((name) => (
                  <span
                    key={name}
                    className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary/80"
                  >
                    {name}
                  </span>
                ))}
                {selectedCareer.skillNames.length > 4 && (
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                    +{selectedCareer.skillNames.length - 4}
                  </span>
                )}
              </div>
            )}
          </Link>

          <Link
            href={`/interview-prep/flashcards?career=${selected}`}
            className="group relative overflow-hidden rounded-3xl border border-xp/20 bg-gradient-to-br from-xp/5 to-xp/10 p-6 transition-all hover:border-xp/40 hover:shadow-lg hover:shadow-xp/10"
          >
            <div className="grid size-12 place-items-center rounded-2xl bg-xp/20 text-xp transition-transform group-hover:scale-110">
              <Layers className="size-6" />
            </div>
            <h3 className="mt-4 text-lg font-black">Flashcard Review</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Flip-card drill of{" "}
              <span className="font-semibold text-foreground">
                {selectedCareer.title}
              </span>{" "}
              curriculum questions.
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              {selectedCareer.questionCount} cards available
            </p>
          </Link>
        </div>
      )}
    </section>
  );
}