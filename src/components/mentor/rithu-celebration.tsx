"use client";

import { Trophy, PartyPopper, Sparkles } from "lucide-react";
import { motion } from "motion/react";

type RithuCelebrationProps = {
  title: string;
  message?: string;
  icon?: "trophy" | "party" | "sparkles";
  className?: string;
};

const iconMap = {
  trophy: Trophy,
  party: PartyPopper,
  sparkles: Sparkles,
};

export function RithuCelebration({
  title,
  message,
  icon = "trophy",
  className = "",
}: RithuCelebrationProps) {
  const Icon = iconMap[icon];

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative overflow-hidden rounded-2xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-card to-orange-500/10 p-5 ${className}`}
    >
      {/* Decorative sparkle dots with staggered animation */}
      <div className="absolute top-2 right-2 size-1 rounded-full bg-amber-400 animate-float-sparkle" />
      <div className="absolute top-4 right-6 size-1.5 rounded-full bg-orange-400 animate-float-sparkle" style={{ animationDelay: '0.3s' }} />
      <div className="absolute bottom-3 right-3 size-1 rounded-full bg-amber-300 animate-float-sparkle" style={{ animationDelay: '0.6s' }} />
      <div className="absolute top-6 right-10 size-0.5 rounded-full bg-amber-500 animate-float-sparkle" style={{ animationDelay: '0.9s' }} />

      <div className="flex items-start gap-3">
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="size-10 shrink-0 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/30"
        >
          <Icon className="size-5" />
        </motion.div>
        <div className="flex-1">
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400">
            Rithu says
          </span>
          <h3 className="text-base font-bold mt-0.5">{title}</h3>
          {message && (
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              {message}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
