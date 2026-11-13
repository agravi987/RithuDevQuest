import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { getPracticeTopicTree } from "@/lib/practice/queries";
import { QuickPracticePage } from "@/components/practice/quick-practice-page";

export const metadata: Metadata = {
  title: "Quick Practice",
};

export default async function QuickPracticeRoutePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const topicTree = await getPracticeTopicTree();

  return (
    <div className="mx-auto max-w-3xl pb-12">
      <QuickPracticePage topicTree={topicTree} />
    </div>
  );
}