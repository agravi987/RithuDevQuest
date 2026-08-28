import Link from "next/link";
import { Play } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type ModuleCardProps = {
  module: {
    id: string;
    title: string;
    description: string | null;
    slug: string;
    pathSlug: string;
    lessonCount: number;
    completedCount: number;
  };
};

export function ModuleCard({ module }: ModuleCardProps) {
  const progress =
    module.lessonCount === 0
      ? 0
      : Math.round((module.completedCount / module.lessonCount) * 100);

  return (
    <Link href={`/learn/${module.pathSlug}/${module.slug}`} className="block">
      <Card className="transition-colors hover:border-primary/50 hover:bg-muted/40">
        <CardContent className="flex items-center gap-4 py-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            <Play className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate font-medium">{module.title}</p>
              <p className="shrink-0 text-xs text-muted-foreground">
                {module.completedCount}/{module.lessonCount}
              </p>
            </div>
            <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
              {module.description}
            </p>
            <Progress value={progress} className="mt-2" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}