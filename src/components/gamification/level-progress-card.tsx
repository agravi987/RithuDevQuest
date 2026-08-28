"use client";

import { motion } from "motion/react";
import { Sparkles, Trophy, ArrowUpRight } from "lucide-react";
import type { CalculatedLevel } from "@/lib/gamification/levels";
import { LevelBadge } from "@/components/gamification/level-badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

type LevelProgressCardProps = {
  levelInfo: CalculatedLevel;
  className?: string;
};

export function LevelProgressCard({
  levelInfo,
  className,
}: LevelProgressCardProps) {
  return (
    <Card
      className={`overflow-hidden border-2 border-border/80 shadow-md transition-all hover:shadow-lg ${className ?? ""}`}
    >
      <CardContent className="p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary shadow-inner">
              <Sparkles className="size-6 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
                  Player Level
                </span>
                <LevelBadge level={levelInfo.level} size="sm" />
              </div>
              <h3 className="text-lg font-extrabold tracking-tight">
                {levelInfo.title}
              </h3>
            </div>
          </div>

          <Link
            href="/achievements"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground inline-flex items-center gap-0.5 transition-colors"
          >
            Badges <ArrowUpRight className="size-3.5" />
          </Link>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs font-bold text-muted-foreground">
            <span>
              {levelInfo.currentXp.toLocaleString()} XP
            </span>
            <span>
              {levelInfo.isMaxLevel
                ? "Max Level Reached! 🌟"
                : `${levelInfo.xpToNextLevel.toLocaleString()} XP to Level ${levelInfo.level + 1}`}
            </span>
          </div>

          <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted border border-border/60">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${levelInfo.progressPercentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/40">
          <span className="flex items-center gap-1.5">
            <Trophy className="size-3.5 text-amber-500" />
            Tier Progress
          </span>
          <span className="font-bold text-foreground">
            {levelInfo.progressPercentage}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
