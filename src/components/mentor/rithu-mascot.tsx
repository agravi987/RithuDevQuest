"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, X } from "lucide-react";

type RithuMood = "happy" | "thinking" | "excited" | "sad" | "strong" | "idle";

type RithuMascotProps = {
  mood?: RithuMood;
  message?: string;
  size?: "sm" | "md" | "lg";
  showSpeech?: boolean;
  className?: string;
};

const moodEmojis: Record<RithuMood, string> = {
  happy: "😊",
  thinking: "🤔",
  excited: "🎉",
  sad: "😢",
  strong: "💪",
  idle: "👋",
};

const moodAnimations: Record<RithuMood, { rotate?: number[]; scale?: number[]; y?: number[]; transition?: Record<string, unknown> }> = {
  happy: { rotate: [0, -5, 5, -5, 0], transition: { duration: 0.5, repeat: Infinity, repeatDelay: 3 } },
  thinking: { y: [0, -3, 0], transition: { duration: 1.5, repeat: Infinity } },
  excited: { scale: [1, 1.1, 1], rotate: [0, -10, 10, -10, 0], transition: { duration: 0.6, repeat: Infinity, repeatDelay: 2 } },
  sad: { y: [0, 2, 0], transition: { duration: 2, repeat: Infinity } },
  strong: { scale: [1, 1.15, 1], transition: { duration: 0.4, repeat: Infinity, repeatDelay: 1.5 } },
  idle: { y: [0, -4, 0], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } },
};

const moodColors: Record<RithuMood, string> = {
  happy: "from-emerald-400 to-primary",
  thinking: "from-blue-400 to-cyan-400",
  excited: "from-amber-400 to-orange-500",
  sad: "from-slate-400 to-slate-500",
  strong: "from-red-400 to-pink-500",
  idle: "from-primary to-emerald-400",
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
        animate={moodAnimations[mood]}
        className={`relative ${sizeClasses[size]}`}
      >
        {/* Animated glow ring */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`absolute -inset-2 rounded-full bg-gradient-to-br ${moodColors[mood]} opacity-20 blur-lg`}
        />

        {/* Character body */}
        <div className={`relative grid size-full place-items-center rounded-full bg-gradient-to-br ${moodColors[mood]} shadow-lg border-2 border-white/30`}>
          <span className="drop-shadow-sm">{moodEmojis[mood]}</span>

          {/* Sparkle accessory */}
          <motion.div
            animate={{ rotate: 360 }}
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
