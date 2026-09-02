"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Sparkles, X } from "lucide-react";
import {
  RITHU_MOOD_EMOJIS,
  RITHU_MOOD_COLORS,
  RITHU_MOOD_ANIMATIONS,
  type RithuMood,
} from "@/components/mentor/rithu-moods";

type RithuMascotProps = {
  mood?: RithuMood;
  message?: string;
  size?: "sm" | "md" | "lg";
  showSpeech?: boolean;
  className?: string;
};

const sizeClasses = {
  sm: "size-10 text-lg",
  md: "size-14 text-2xl",
  lg: "size-20 text-4xl",
};

export function RithuMascot({
  mood = "idle",
  message,
  size = "md",
  showSpeech = true,
  className = "",
}: RithuMascotProps) {
  const [dismissed, setDismissed] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(message);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setCurrentMessage(message);
    setDismissed(false);
  }, [message]);

  return (
    <div className={`relative inline-flex items-end gap-3 ${className}`}>
      {/* Speech bubble */}
      <AnimatePresence>
        {showSpeech && currentMessage && !dismissed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 10 }}
            className="relative max-w-xs rounded-2xl rounded-br-sm border border-border bg-card p-3 shadow-md"
          >
            <button
              type="button"
              aria-label="Dismiss message"
              onClick={() => setDismissed(true)}
              className="absolute -right-2 -top-2 size-5 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="size-3" />
            </button>
            <p className="text-sm text-foreground leading-relaxed font-medium">{currentMessage}</p>
            {/* Speech bubble arrow */}
            <div className="absolute -bottom-1.5 right-3 size-3 rotate-45 border-r border-b border-border bg-card" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rithu character */}
      <motion.div
        animate={reduceMotion ? { rotate: 0 } : RITHU_MOOD_ANIMATIONS[mood]}
        className={`relative ${sizeClasses[size]}`}
      >
        {/* Animated glow ring */}
        <motion.div
          animate={
            reduceMotion
              ? { scale: 1, opacity: 0.2 }
              : { scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }
          }
          transition={{ duration: 2, repeat: Infinity }}
          className={`absolute -inset-2 rounded-full bg-gradient-to-br ${RITHU_MOOD_COLORS[mood]} opacity-20 blur-lg`}
        />

        {/* Character body */}
        <div className={`relative grid size-full place-items-center rounded-full bg-gradient-to-br ${RITHU_MOOD_COLORS[mood]} shadow-lg border-2 border-white/30`}>
          <span className="drop-shadow-sm">{RITHU_MOOD_EMOJIS[mood]}</span>

          {/* Sparkle accessory */}
          <motion.div
            animate={reduceMotion ? { rotate: 0 } : { rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute -right-1 -top-1"
          >
            <Sparkles className="size-3 text-amber-400 fill-amber-400/50" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Auto-determines Rithu's mood from context
 */
export function getRithuMood(context: {
  isCorrect?: boolean;
  isWrong?: boolean;
  isLevelUp?: boolean;
  isStreak?: boolean;
  isComplete?: boolean;
  isIdle?: boolean;
}): RithuMood {
  if (context.isLevelUp) return "excited";
  if (context.isComplete) return "excited";
  if (context.isCorrect) return "happy";
  if (context.isWrong) return "thinking";
  if (context.isStreak) return "strong";
  return "idle";
}
