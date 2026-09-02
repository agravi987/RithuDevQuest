import type { Metadata } from "next";
import Link from "next/link";

import { requireAdmin } from "@/lib/admin/auth";
import { getCareersForAdmin } from "@/lib/admin/content-queries";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateCareerForm } from "@/components/admin/content/forms/career-form";

export const metadata: Metadata = {
  title: "Content",
};

export default async function AdminContentPage() {
  await requireAdmin();
  const careers = await getCareersForAdmin();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Content</h1>
        <p className="text-sm text-muted-foreground">
          Manage the learning curriculum and achievements.
        </p>
      </div>

      <div className="flex gap-2">
        <Button asChild size="sm">
          <Link href="/admin/content/achievements">Achievements</Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Careers</CardTitle>
          </CardHeader>
          <CardContent>
            {careers.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No careers yet — create your first one below.
              </p>
            ) : (
              <div className="divide-y divide-border/40">
                {careers.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between gap-3 py-3"
                  >
                    <Link
                      href={`/admin/content/career/${c.id}`}
                      className="min-w-0 group"
                    >
                      <div className="font-semibold group-hover:text-primary">
                        {c.title}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
                        {c.slug} · {c.paths} path{c.paths === 1 ? "" : "s"}
                      </div>
                    </Link>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/content/career/${c.id}`}>Manage</Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <CreateCareerForm />
      </div>
    </div>
  );
}
