import { Star } from "lucide-react";

import { Progress } from "@/components/ui/progress";

type LessonHeaderProps = {
  title: string;
  completedSteps: number;
  totalSteps: number;
  xpEarned: number;
};

export function LessonHeader({
  title,
  completedSteps,
  totalSteps,
  xpEarned,
}: LessonHeaderProps) {
  const progress =
    totalSteps === 0 ? 100 : Math.round((completedSteps / totalSteps) * 100);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <h1 className="min-w-0 truncate text-lg font-bold tracking-tight">
          {title}
        </h1>
        <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary">
          <Star className="size-4 fill-current" />
          {xpEarned} XP
        </span>
      </div>
      <Progress value={progress} />
      <p className="mt-1 text-right text-xs text-muted-foreground">
        {completedSteps}/{totalSteps} steps
      </p>
    </div>
  );
}