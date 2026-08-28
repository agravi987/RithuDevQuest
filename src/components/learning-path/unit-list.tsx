import { LessonNode } from "@/components/learning-path/lesson-node";
import type { ModuleWithUnits } from "@/lib/curriculum/queries";
import { getLessonStatuses } from "@/lib/curriculum/navigation";

type UnitListProps = {
  units: ModuleWithUnits["units"];
  completedLessonIds: string[];
  modulePath: string;
};

export function UnitList({
  units,
  completedLessonIds,
  modulePath,
}: UnitListProps) {
  const statuses = getLessonStatuses(units, completedLessonIds);
  const stateById = new Map(
    statuses.map((status) => [status.lesson.id, status.state]),
  );

  return (
    <div className="flex flex-col gap-8">
      {units.map((unit) => (
        <section key={unit.id}>
          <div className="mb-3">
            <h2 className="font-semibold">{unit.title}</h2>
            {unit.description && (
              <p className="text-sm text-muted-foreground">{unit.description}</p>
            )}
          </div>
          <ol className="flex flex-col gap-2">
            {unit.lessons.map((lesson) => (
              <li key={lesson.id}>
                <LessonNode
                  lesson={{
                    id: lesson.id,
                    title: lesson.title,
                    slug: lesson.slug,
                    estimatedMinutes: lesson.estimatedMinutes,
                    order: lesson.order,
                  }}
                  state={stateById.get(lesson.id) ?? "locked"}
                  href={`${modulePath}/${lesson.slug}`}
                />
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}