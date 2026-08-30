"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trophy, Zap, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type UnlockedAchievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
};

type AchievementPopupProps = {
  achievements: UnlockedAchievement[];
  onClose?: () => void;
};

export function AchievementPopup({
  achievements,
  onClose,
}: AchievementPopupProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [open, setOpen] = useState(achievements.length > 0);

  if (!open || achievements.length === 0) return null;

  const current = achievements[currentIndex];
  if (!current) return null;

  const handleNext = () => {
    if (currentIndex < achievements.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setOpen(false);
      onClose?.();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="relative w-full max-w-sm overflow-hidden rounded-3xl border-2 border-amber-500/40 bg-card p-5 sm:p-6 shadow-2xl text-center flex flex-col items-center gap-3 sm:gap-4"
        >
          {/* Close button */}
          <button
            onClick={() => {
              setOpen(false);
              onClose?.();
            }}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted"
          >
            <X className="size-5" />
          </button>

          {/* Glowing Badge Circle with enhanced effects */}
          <div className="relative mt-2">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
              className="absolute -inset-3 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-300 opacity-60 blur-lg"
            />
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-300 opacity-40 blur-md"
            />
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="relative size-16 sm:size-20 rounded-full bg-gradient-to-b from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-xl shadow-amber-500/30 border-2 border-white/40"
            >
              <Trophy className="size-8 sm:size-10 fill-white/30 text-white" />
            </motion.div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-500">
              Achievement Unlocked!
            </span>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
              {current.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {current.description}
            </p>
          </div>

          {/* Reward Pill */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold text-sm">
            <Zap className="size-4 fill-amber-500 text-amber-500" />
            +{current.xpReward} Bonus XP
          </div>

          {/* Action button with glow */}
          <Button
            onClick={handleNext}
            className="w-full mt-2 font-bold text-base py-5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md shadow-amber-500/20 transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/30 hover:brightness-110 active:scale-[0.97] btn-glow"
          >
            {currentIndex < achievements.length - 1 ? "Next Reward" : "Claim & Continue"}
          </Button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
