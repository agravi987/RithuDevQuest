"use client";

import { motion } from "motion/react";
import type { DashboardProfile } from "@/lib/dashboard/types";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getGreetingEmoji(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "☀️";
  if (hour < 17) return "🌤️";
  return "🌙";
}

export function DashboardHero({
  firstName,
  profile,
}: {
  firstName: string;
  profile: DashboardProfile;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-4"
    >
      <div className="relative z-10">
        <h1 className="text-lg sm:text-xl font-black tracking-tight text-foreground">
          {getGreeting()}, {firstName}{" "}
          <span className="inline-block animate-wave">{getGreetingEmoji()}</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 max-w-md">
          {profile.streak.isActiveToday
            ? `Day ${profile.streak.currentStreak} streak active — keep it going! 🔥 ${profile.stats.completedLessonsCount} lessons completed.`
            : `${profile.stats.completedLessonsCount} lessons completed so far. Time for your next adventure! ⚡`}
        </p>
      </div>
    </motion.div>
  );
}