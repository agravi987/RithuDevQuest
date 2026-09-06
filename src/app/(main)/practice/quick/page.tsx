import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { getPracticeTopics } from "@/lib/practice/queries";
import { QuickPracticePage } from "@/components/practice/quick-practice-page";

export const metadata: Metadata = {
  title: "Quick Practice",
};

export default async function QuickPracticeRoutePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const topics = await getPracticeTopics();

  return (
    <div className="mx-auto max-w-3xl pb-12">
      <QuickPracticePage topics={topics} />
    </div>
  );
}