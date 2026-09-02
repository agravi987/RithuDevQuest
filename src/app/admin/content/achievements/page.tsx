import type { Metadata } from "next";

import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/content/delete-button";
import { EmptyState } from "@/components/admin/stat-blocks";
import { deleteAchievementAction } from "@/lib/admin/content-actions";
import { CreateAchievementForm } from "@/components/admin/content/forms/achievement-form";

export const metadata: Metadata = {
  title: "Achievements",
};

export default async function AdminAchievementsPage() {
  await requireAdmin();

  const achievements = await prisma.achievement.findMany({
    orderBy: { category: "asc" },
    select: {
      id: true,
      title: true,
      description: true,
      icon: true,
      category: true,
      condition: true,
      threshold: true,
      xpReward: true,
      _count: { select: { users: true } },
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Button asChild variant="outline" size="sm">
          <a href="/admin/content">← Content</a>
        </Button>
        <h1 className="mt-3 text-2xl font-black tracking-tight">
          Achievements
        </h1>
        <p className="text-sm text-muted-foreground">
          {achievements.length} achievement{achievements.length === 1 ? "" : "s"} defined.
        </p>
      </div>

      {achievements.length === 0 ? (
        <EmptyState
          message="No achievements defined yet — create your first one below."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {achievements.map((a) => (
            <Card key={a.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">
                    {a.icon} {a.title}
                  </CardTitle>
                  <DeleteButton
                    action={deleteAchievementAction}
                    id={a.id}
                    message={`Delete achievement "${a.title}"?`}
                  />
                </div>
                <CardDescription>{a.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <Badge variant="secondary">{a.category}</Badge>
                  <Badge variant="outline">{a.condition}</Badge>
                  {a.threshold != null && (
                    <Badge variant="outline">threshold: {a.threshold}</Badge>
                  )}
                  <Badge variant="default">+{a.xpReward} XP</Badge>
                  <span className="text-muted-foreground">
                    {a._count.users} unlocked
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateAchievementForm />
    </div>
  );
}
