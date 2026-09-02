import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/db";
import { getUnitsForAdmin } from "@/lib/admin/content-queries";
import { ContentLevel } from "@/components/admin/content/content-level";

export const metadata: Metadata = {
  title: "Module",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminModuleDetailPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;

  const mod = await prisma.module.findUnique({
    where: { id },
    select: { id: true, title: true, pathId: true },
  });
  if (!mod) notFound();

  const nodes = await getUnitsForAdmin(id);

  return (
    <ContentLevel
      title={mod.title}
      backHref={`/admin/content/path/${mod.pathId}`}
      backLabel="← Path"
      nodes={nodes}
      childHref="/admin/content/unit"
      countLabel={(n) => `${n.lessons} lesson(s)`}
      entityKind="unit"
      parentFieldName="moduleId"
      parentId={id}
      emptyMessage="No units yet — create one below."
    />
  );
}
