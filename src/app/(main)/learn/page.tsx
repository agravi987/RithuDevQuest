import { redirect } from "next/navigation";

import { SkillTree } from "@/components/learning-path/skill-tree";
import { getCareerBySlug, getAllCareers } from "@/lib/curriculum/queries";

export default async function LearnPage() {
  const careers = await getAllCareers();

  const careerSlug =
    careers.find((c) => c.slug === "devops")?.slug ?? careers[0]?.slug;
  if (!careerSlug) {
    redirect("/dashboard");
  }

  const career = await getCareerBySlug(careerSlug);
  if (!career) {
    redirect("/dashboard");
  }

  const paths = career.paths.map((path) => ({
    id: path.id,
    title: path.title,
    description: path.description,
    slug: path.slug,
    moduleCount: path.modules.length,
    lessonCount: path.modules.reduce(
      (sum, module) =>
        sum +
        module.units.reduce(
          (unitSum, unit) => unitSum + unit.lessons.length,
          0,
        ),
      0,
    ),
  }));

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h1 className="text-2xl font-bold tracking-tight">Your Quest</h1>
        <p className="text-muted-foreground">
          Choose a path and begin clearing lessons to earn XP.
        </p>
      </section>

      <SkillTree careerTitle={career.title} paths={paths} />
    </div>
  );
}