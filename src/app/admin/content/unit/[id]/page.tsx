import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/db";
import { getLessonsForAdmin } from "@/lib/admin/content-queries";
import { ContentLevel } from "@/components/admin/content/content-level";

export const metadata: Metadata = {
  title: "Unit",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminUnitDetailPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;

  const unit = await prisma.unit.findUnique({
    where: { id },
    select: { id: true, title: true, moduleId: true },
  });
  if (!unit) notFound();

  const nodes = await getLessonsForAdmin(id);

  return (
    <ContentLevel
      title={unit.title}
      backHref={`/admin/content/module/${unit.moduleId}`}
      backLabel="← Module"
      nodes={nodes}
      childHref="/admin/content/lesson"
      countLabel={(n) =>
        `${n.activityCount} activit${n.activityCount === 1 ? "y" : "ies"} · ${n.questionCount} question(s) · ${n.estimatedMinutes} min`
      }
      entityKind="lesson"
      parentFieldName="unitId"
      parentId={id}
      emptyMessage="No lessons yet — create one below."
    />
  );
}
