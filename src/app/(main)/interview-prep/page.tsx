import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { getInterviewCareers } from "@/lib/curriculum/interview";
import { InterviewPrepHub } from "@/components/interview/interview-prep-hub";

export const metadata: Metadata = {
  title: "Interview Prep",
};

export default async function InterviewPrepPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const careers = await getInterviewCareers();

  return (
    <div className="mx-auto max-w-4xl space-y-10 px-4 py-8">
      {/* Hero */}
      <section className="space-y-4 text-center">
        <h1 className="text-3xl font-black tracking-tight gradient-text-animated sm:text-4xl">
          Interview Prep
        </h1>
        <p className="mx-auto max-w-xl text-sm text-muted-foreground leading-relaxed">
          Choose a role, then pick a mode — live AI interview or flashcard drill.
        </p>
      </section>

      {/* Role picker + mode cards */}
      <InterviewPrepHub careers={careers} />

      {/* Back link */}
      <div className="text-center">
        <Link
          href="/dashboard"
          className="text-xs text-muted-foreground underline-offset-4 hover:underline"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}