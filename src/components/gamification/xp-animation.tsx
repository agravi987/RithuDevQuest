"use client";

import { motion, AnimatePresence } from "motion/react";
import { Zap } from "lucide-react";

type XPAnimationProps = {
  amount: number;
  triggerKey: string | number;
  className?: string;
};

export function XPAnimation({
  amount,
  triggerKey,
  className,
}: XPAnimationProps) {
  if (amount <= 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={triggerKey}
        initial={{ opacity: 0, y: 10, scale: 0.8 }}
        animate={{ opacity: 1, y: -20, scale: 1.15 }}
        exit={{ opacity: 0, y: -40, scale: 0.9 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`pointer-events-none inline-flex items-center gap-1.5 font-extrabold text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30 shadow-lg ${className ?? ""}`}
      >
        <Zap className="size-4 fill-amber-500 animate-bounce" />
        <span>+{amount} XP</span>
      </motion.div>
    </AnimatePresence>
  );
}
