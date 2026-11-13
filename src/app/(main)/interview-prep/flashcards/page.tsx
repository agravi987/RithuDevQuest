import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import {
  getInterviewCareer,
  getInterviewCareers,
  getInterviewFlashcards,
} from "@/lib/curriculum/interview";
import { FlashcardDeck } from "@/components/interview/flashcard-deck";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { GalaxySection } from "@/components/galaxy/galaxy-section";

export const metadata: Metadata = {
  title: "Flashcard Concept Drill",
};

export default async function FlashcardsPage({
  searchParams,
}: {
  searchParams: Promise<{ career?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { career: careerSlug } = await searchParams;

  let career = careerSlug ? await getInterviewCareer(careerSlug) : null;

  if (!career) {
    const allCareers = await getInterviewCareers();
    const fallback = allCareers[0];
    if (fallback) {
      career = await getInterviewCareer(fallback.slug);
    }
  }

  if (!career) {
    notFound();
  }

  const cards = await getInterviewFlashcards(career.slug, 30);

  return (
    <GalaxySection className="pb-28">
      <div className="relative z-10 mx-auto max-w-4xl space-y-6 pb-24 lg:pb-8">
        <Breadcrumbs
          items={[
            { label: "Interview Prep", href: "/interview-prep" },
            { label: `${career.title} Flashcards` },
          ]}
        />

        <div className="rounded-3xl border-2 border-emerald-500/30 border-b-[8px] border-b-emerald-600/40 bg-card p-6 sm:p-8 shadow-xl">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                📚 Concept & Trade-off Drill
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-foreground">
                {career.title} Flashcard Deck
              </h2>
            </div>
            <span className="shrink-0 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-black text-emerald-400">
              {cards.length} Cards
            </span>
          </div>

          <FlashcardDeck careerTitle={career.title} cards={cards} />
        </div>
      </div>
    </GalaxySection>
  );
}
