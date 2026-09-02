"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { Zap, Star, Check } from "lucide-react";

type CompletionCelebrationProps = {
  /** Whether the celebration is currently showing. */
  show: boolean;
  /** XP earned from the completed lesson. */
  xpEarned?: number;
  /** Callback when the animation finishes. */
  onComplete?: () => void;
  className?: string;
};

/**
 * A cinematic overlay that plays when a lesson is completed.
 * Shows:
 *   1. Star illuminates
 *   2. XP counter animation
 *   3. Success message
 *   4. Fades out
 *
 * Respects prefers-reduced-motion.
 */
export function CompletionCelebration({
  show,
  xpEarned = 0,
  onComplete,
  className,
}: CompletionCelebrationProps) {
  const [phase, setPhase] = useState<"idle" | "star" | "xp" | "done">("idle");

  useEffect(() => {
    if (!show) {
      setPhase("idle");
      return;
    }

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReduced) {
      setPhase("xp");
      const t = setTimeout(() => {
        setPhase("done");
        onComplete?.();
      }, 800);
      return () => clearTimeout(t);
    }

    // Star phase
    setPhase("star");
    const t1 = setTimeout(() => setPhase("xp"), 600);
    const t2 = setTimeout(() => {
      setPhase("done");
      onComplete?.();
    }, 2200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && phase !== "idle" && phase !== "done" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center pointer-events-none",
            className,
          )}
        >
          {/* Dimmed backdrop */}
          <div className="absolute inset-0 bg-background/40 backdrop-blur-sm" />

          {/* Center content */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="relative z-10 flex flex-col items-center gap-4"
          >
            {/* Star burst */}
            <AnimatePresence>
              {phase === "star" && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 1.5, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 150 }}
                  className="relative"
                >
                  <div className="grid size-20 place-items-center rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 shadow-2xl shadow-amber-400/40">
                    <Check className="size-10 text-white drop-shadow-lg" strokeWidth={3} />
                  </div>
                  {/* Rays */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                    <motion.div
                      key={deg}
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: [0, 0.6, 0] }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                      className="absolute left-1/2 top-1/2 h-0.5 w-16 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-400 to-transparent origin-left"
                      style={{ transform: `rotate(${deg}deg)` }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* XP counter */}
            {phase === "xp" && xpEarned > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="flex flex-col items-center gap-2"
              >
                <div className="flex items-center gap-2 rounded-2xl bg-amber-400/10 border border-amber-400/20 px-6 py-3 backdrop-blur-md">
                  <Zap className="size-6 text-amber-400" />
                  <motion.span
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className="text-3xl font-black text-amber-400 tabular-nums"
                  >
                    +{xpEarned}
                  </motion.span>
                  <span className="text-sm font-bold text-amber-400/70">
                    XP
                  </span>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-1.5 text-sm font-bold text-foreground/80"
                >
                  <Star className="size-4 text-amber-400 fill-amber-400" />
                  Mission Complete!
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
