"use client";

import Link from "next/link";
import { Target, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

type RithuRecommendationProps = {
  skillName: string;
  currentMastery: number;
  lessonHref: string;
  reason?: string;
  className?: string;
};

export function RithuRecommendation({
  skillName,
  currentMastery,
  lessonHref,
  reason,
  className = "",
}: RithuRecommendationProps) {
  const urgency =
    currentMastery < 40
      ? "high"
      : currentMastery < 60
        ? "medium"
        : "low";

  const urgencyColors = {
    high: "border-rose-500/30 bg-rose-500/5",
    medium: "border-amber-500/30 bg-amber-500/5",
    low: "border-blue-500/30 bg-blue-500/5",
  };

  const urgencyBadge = {
    high: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
    medium:
      "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    low: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border-2 p-4 ${urgencyColors[urgency]} ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="size-9 shrink-0 rounded-xl bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center text-white shadow-sm">
          <Target className="size-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Rithu recommends
            </span>
            <span
              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${urgencyBadge[urgency]}`}
            >
              {urgency === "high" ? "Needs attention" : urgency === "medium" ? "Practice recommended" : "Keep it up"}
            </span>
          </div>
          <h3 className="text-sm font-bold capitalize">
            {skillName.replace(/-/g, " ")}
          </h3>
          {reason && (
            <p className="text-xs text-muted-foreground mt-1">{reason}</p>
          )}
          <div className="mt-2 flex items-center gap-2">
            <div className="h-1.5 flex-1 rounded-full bg-border/50 overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${currentMastery}%` }}
              />
            </div>
            <span className="text-xs font-bold text-muted-foreground">
              {currentMastery}%
            </span>
          </div>
        </div>
        <Button asChild size="sm" variant="outline" className="shrink-0">
          <Link href={lessonHref}>
            Practice <ArrowRight className="size-3" />
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}
