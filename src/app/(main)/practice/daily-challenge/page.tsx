import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { DailyChallengePage } from "@/components/practice/daily-challenge-page";

export const metadata: Metadata = {
  title: "Daily Challenge",
};

export default async function DailyChallengeRoutePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-3xl pb-12">
      <DailyChallengePage />
    </div>
  );
}