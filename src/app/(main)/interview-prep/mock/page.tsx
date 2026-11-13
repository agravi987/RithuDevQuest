import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getInterviewCareer, getInterviewCareers } from "@/lib/curriculum/interview";
import { MockInterview } from "@/components/interview/mock-interview";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { GalaxySection } from "@/components/galaxy/galaxy-section";

export const metadata: Metadata = {
  title: "Live Mock Interview",
};

export default async function MockInterviewPage({
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

  return (
    <GalaxySection
      className="-mx-4 -mt-8 px-4 pt-8 pb-16 min-h-screen overflow-hidden"
      starCount={60}
    >
      <div className="relative z-10 mx-auto max-w-5xl space-y-6 pb-8">
        <Breadcrumbs
          items={[
            { label: "Interview Prep", href: "/interview-prep" },
            { label: `${career.title} Mock Interview` },
          ]}
        />

        <MockInterview career={career} />
      </div>
    </GalaxySection>
  );
}
