import Link from "next/link";
import { Check, Lock, Play, Star } from "lucide-react";

import type { LessonState } from "@/lib/curriculum/navigation";
import { cn } from "@/lib/utils";

type LessonNodeProps = {
  lesson: {
    id: string;
    title: string;
    slug: string;
    estimatedMinutes: number;
    order: number;
  };
  state: LessonState;
  href: string;
};

const stateStyles: Record<LessonState, string> = {
  completed: "border-primary/40 bg-primary/10 text-primary",
  available: "border-foreground/20 bg-muted/40 hover:border-primary/60 hover:bg-primary/10",
  locked: "border-foreground/10 bg-muted/20 opacity-60",
};

export function LessonNode({ lesson, state, href }: LessonNodeProps) {
  const locked = state === "locked";

  return (
    <Link
      href={locked ? "#" : href}
      aria-disabled={locked}
      className={cn(
        "flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition-colors",
        stateStyles[state],
        locked && "pointer-events-none",
      )}
    >
      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-background/60">
        {state === "completed" && <Check className="size-4" />}
        {state === "available" && <Play className="size-4" />}
        {state === "locked" && <Lock className="size-4" />}
      </span>
      <span className="min-w-0 flex-1 truncate font-medium">{lesson.title}</span>
      <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
        <Star className="size-3" />
        {lesson.estimatedMinutes}m
      </span>
    </Link>
  );
}