import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/db";
import { getModulesForAdmin } from "@/lib/admin/content-queries";
import { ContentLevel } from "@/components/admin/content/content-level";

export const metadata: Metadata = {
  title: "Path",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminPathDetailPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;

  const path = await prisma.learningPath.findUnique({
    where: { id },
    select: { id: true, title: true, careerId: true },
  });
  if (!path) notFound();

  const nodes = await getModulesForAdmin(id);

  return (
    <ContentLevel
      title={path.title}
      backHref={`/admin/content/career/${path.careerId}`}
      backLabel="← Career"
      nodes={nodes}
      childHref="/admin/content/module"
      countLabel={(n) => `${n.units} unit(s)`}
      entityKind="module"
      parentFieldName="pathId"
      parentId={id}
      emptyMessage="No modules yet — create one below."
    />
  );
}

