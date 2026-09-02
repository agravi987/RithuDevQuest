"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

type RithuMessageProps = {
  message: string;
  /** Where the message appears relative to the path node. */
  position?: "left" | "right";
  className?: string;
};

/**
 * Rithu — the galaxy mentor — appears at meaningful moments.
 * She should NOT appear beside every lesson; only at milestones,
 * the current mission, and difficult modules.
 */
export function RithuMessage({
  message,
  position = "right",
  className,
}: RithuMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: position === "left" ? 20 : -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
      className={cn(
        "relative max-w-[200px] sm:max-w-[240px]",
        position === "left" ? "mr-auto" : "ml-auto",
        className,
      )}
    >
      {/* Speech bubble */}
      <div
        className={cn(
          "relative rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background/80 to-primary/5 p-3 backdrop-blur-sm",
          "shadow-lg shadow-primary/5",
        )}
      >
        {/* Rithu avatar */}
        <div className="flex items-start gap-2">
          <div className="grid size-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-emerald-400 shadow-md shadow-primary/20">
            <Sparkles className="size-3 text-primary-foreground" />
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-primary/70 mb-0.5">
              Rithu
            </p>
            <p className="text-xs text-foreground/80 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Tail */}
        <div
          className={cn(
            "absolute -bottom-1.5 h-3 w-3 rotate-45 border-b border-r border-primary/20 bg-background/80",
            position === "left" ? "left-4" : "right-4",
          )}
        />
      </div>
    </motion.div>
  );
}

/** Pre-defined messages for different contexts. */
export const RITHU_MESSAGES = {
  currentMission: (title: string) =>
    `Your next mission is "${title}" — let's go! 🚀`,
  milestoneComplete: (count: number) =>
    `Amazing! You've completed ${count} lessons! Keep going! ✨`,
  moduleComplete: (title: string) =>
    `You unlocked a new sector! "${title}" awaits! 🌌`,
  difficultModule: () =>
    "This sector is challenging, but I've got you. Take it one step at a time. 💪",
  welcomeBack: () =>
    "Welcome back, explorer! Ready to continue your journey? 🚀",
  streakReminder: (days: number) =>
    `${days}-day streak! You're on fire! Don't break the chain! 🔥`,
} as const;
