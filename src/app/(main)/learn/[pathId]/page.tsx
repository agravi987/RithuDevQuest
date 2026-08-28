import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { ModuleCard } from "@/components/learning-path/module-card";
import { getPathBySlug } from "@/lib/curriculum/queries";
import { auth } from "@/lib/auth";
import { getModuleCompletionCounts } from "@/lib/progress/queries";

export default async function PathPage({
  params,
}: {
  params: Promise<{ pathId: string }>;
}) {
  const { pathId } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const path = await getPathBySlug("devops", pathId);

  if (!path) {
    notFound();
  }

  const moduleIds = path.modules.map((mod) => mod.id);
  const completionCounts = await getModuleCompletionCounts(
    session.user.id,
    moduleIds,
  );

  const modules = path.modules.map((mod) => ({
    id: mod.id,
    title: mod.title,
    description: mod.description,
    slug: mod.slug,
    pathSlug: path.slug,
    lessonCount: mod.units.reduce(
      (sum, unit) => sum + unit.lessons.length,
      0,
    ),
    completedCount: completionCounts.get(mod.id) ?? 0,
  }));

  return (
    <div className="flex flex-col gap-8">
      <section>
        <Link
          href="/learn"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          All paths
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">{path.title}</h1>
        {path.description && (
          <p className="mt-1 text-muted-foreground">{path.description}</p>
        )}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {modules.map((module) => (
          <ModuleCard key={module.id} module={module} />
        ))}
      </section>
    </div>
  );
}