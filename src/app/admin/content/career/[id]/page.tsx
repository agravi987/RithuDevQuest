import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/db";
import { getPathsForAdmin } from "@/lib/admin/content-queries";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreatePathForm } from "@/components/admin/content/forms/path-form";

export const metadata: Metadata = {
  title: "Career",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminCareerDetailPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;

  const career = await findCareer(id);
  if (!career) notFound();
  const paths = await getPathsForAdmin(id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/content">← Careers</Link>
        </Button>
        <h1 className="mt-3 text-2xl font-black tracking-tight">{career.title}</h1>
        <p className="text-sm text-muted-foreground">
          {career.slug} · learning paths
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Learning Paths</CardTitle>
        </CardHeader>
        <CardContent>
          {paths.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No paths yet — create one below.
            </p>
          ) : (
            <div className="divide-y divide-border/40">
              {paths.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <Link
                    href={`/admin/content/path/${p.id}`}
                    className="min-w-0 group"
                  >
                    <div className="font-semibold group-hover:text-primary">
                      {p.title}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {p.slug} · {p.modules} module{p.modules === 1 ? "" : "s"}
                    </div>
                  </Link>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/content/path/${p.id}`}>Manage</Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <CreatePathForm careerId={id} />
    </div>
  );
}

async function findCareer(id: string) {
  return prisma.career.findUnique({
    where: { id },
    select: { id: true, title: true, slug: true },
  });
}
