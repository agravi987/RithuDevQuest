import { getAllCareers, getCareerBySlug } from "@/lib/curriculum/queries";
import { getCompletedLessonIds } from "@/lib/progress/queries";
import { getNextLesson } from "@/lib/curriculum/navigation";

export type NextQuest = {
  careerSlug: string;
  careerTitle: string;
  pathSlug: string;
  pathTitle: string;
  moduleSlug: string;
  moduleTitle: string;
  lessonId: string;
  lessonSlug: string;
  lessonTitle: string;
  href: string;
  completedCount: number;
  totalCount: number;
};

/**
 * Resolve the single next available lesson across the whole learning galaxy.
 * Scans careers in order, then their paths/modules (sequential lock/unlock),
 * and returns the first lesson the user is ready to start.
 */
export async function getNextQuest(userId: string): Promise<NextQuest | null> {
  const careers = await getAllCareers();
  const completed = await getCompletedLessonIds(userId);
  const completedSet = new Set(completed);

  for (const career of careers) {
    const deep = await getCareerBySlug(career.slug);
    if (!deep) continue;

    for (const path of deep.paths) {
      const allLessons = path.modules.flatMap((mod) =>
        mod.units.flatMap((unit) => unit.lessons),
      );
      const totalCount = allLessons.length;
      const completedCount = allLessons.filter((lesson) =>
        completedSet.has(lesson.id),
      ).length;

      for (const mod of path.modules) {
        const next = getNextLesson(mod.units, completedSet);
        if (!next) continue;

        const lesson = mod.units
          .flatMap((unit) => unit.lessons)
          .find((l) => l.id === next.id);
        if (!lesson) continue;

        return {
          careerSlug: career.slug,
          careerTitle: career.title,
          pathSlug: path.slug,
          pathTitle: path.title,
          moduleSlug: mod.slug,
          moduleTitle: mod.title,
          lessonId: lesson.id,
          lessonSlug: lesson.slug,
          lessonTitle: lesson.title,
          href: `/learn/${path.slug}/${mod.slug}/${lesson.slug}`,
          completedCount,
          totalCount,
        };
      }
    }
  }

  return null;
}
