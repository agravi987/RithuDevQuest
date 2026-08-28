"use client";

import Link from "next/link";
import { Star, CheckCircle, Clock, AlertCircle, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import type { SkillMasteryOverview } from "@/lib/mastery/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type SkillBarsProps = {
  skills: SkillMasteryOverview[];
  limit?: number;
  className?: string;
};

const TIER_ICONS = {
  mastered: Star,
  good: CheckCircle,
  developing: Clock,
  weak: AlertCircle,
};

const BAR_COLORS = {
  mastered: "from-emerald-500 to-teal-400",
  good: "from-blue-500 to-cyan-400",
  developing: "from-amber-500 to-yellow-400",
  weak: "from-rose-500 to-orange-400",
};

export function SkillBars({ skills, limit = 5, className }: SkillBarsProps) {
  const displayed = skills.slice(0, limit);

  if (displayed.length === 0) {
    return (
      <Card className={cn("border-2", className)}>
        <CardContent className="p-6 text-center text-sm text-muted-foreground">
          No skill mastery records yet. Complete lessons to track your skills!
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("border-2 border-border/80 shadow-md", className)}>
      <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold tracking-tight">
          Skill Mastery Overview
        </CardTitle>
        <Link
          href="/practice"
          className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
        >
          View All <ArrowRight className="size-3" />
        </Link>
      </CardHeader>

      <CardContent className="p-5 pt-0 flex flex-col gap-4">
        {displayed.map((item) => {
          const tier = item.mastery.tier;
          const Icon = TIER_ICONS[tier];

          return (
            <div key={item.skillId} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold tracking-tight capitalize">
                    {item.skillName.replace(/-/g, " ")}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    ({item.moduleTitle})
                  </span>
                </div>

                <div className="flex items-center gap-1.5 font-extrabold">
                  <Icon className="size-3.5" />
                  <span>{item.mastery.score}%</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted border border-border/60">
                <motion.div
                  className={cn(
                    "h-full rounded-full bg-gradient-to-r",
                    BAR_COLORS[tier],
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.mastery.score}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
