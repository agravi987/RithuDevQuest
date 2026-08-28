import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { UnitList } from "@/components/learning-path/unit-list";
import { getModuleBySlug } from "@/lib/curriculum/queries";
import { auth } from "@/lib/auth";
import { getCompletedLessonIds } from "@/lib/progress/queries";

export default async function ModulePage({
  params,
}: {
  params: Promise<{ pathId: string; moduleId: string }>;
}) {
  const { pathId, moduleId } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const mod = await getModuleBySlug(pathId, moduleId);

  if (!mod || mod.path.slug !== pathId) {
    notFound();
  }

  const completedLessonIds = await getCompletedLessonIds(session.user.id);

  return (
    <div className="flex flex-col gap-8">
      <section>
        <Link
          href={`/learn/${pathId}`}
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          {mod.path.title}
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">{mod.title}</h1>
        {mod.description && (
          <p className="mt-1 text-muted-foreground">{mod.description}</p>
        )}
      </section>

      <UnitList
        units={mod.units}
        completedLessonIds={completedLessonIds}
        modulePath={`/learn/${pathId}/${moduleId}`}
      />
    </div>
  );
}