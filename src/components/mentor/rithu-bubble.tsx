"use client";

import { useState } from "react";
import { Sparkles, MessageSquare, ArrowRight, X } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type RithuBubbleProps = {
  message?: string;
  topic?: string;
  actionHref?: string;
  actionLabel?: string;
  className?: string;
};

export function RithuBubble({
  message = "Every command you practice builds intuition. Keep exploring and experiment in your terminal!",
  topic = "DevOps Pro-Tip",
  actionHref = "/practice",
  actionLabel = "Practice Arena",
  className = "",
}: RithuBubbleProps) {
  const [open, setOpen] = useState(true);
  const reduceMotion = useReducedMotion();

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        className={`relative flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-card to-background shadow-md glass-shimmer ${className}`}
      >
        {/* Rithu Mascot Avatar */}
        <motion.div
          animate={reduceMotion ? {} : { scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="relative size-10 sm:size-12 shrink-0 rounded-2xl bg-gradient-to-tr from-primary via-emerald-400 to-teal-300 flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-lg shadow-primary/20 border-2 border-white/40"
        >
          R
          <span className="absolute -bottom-1 -right-1 size-4 rounded-full bg-emerald-500 border-2 border-background flex items-center justify-center animate-badge-pop">
            <Sparkles className="size-2.5 text-white" />
          </span>
        </motion.div>

        {/* Message Bubble */}
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-primary flex items-center gap-1">
              <MessageSquare className="size-3.5" /> Rithu ({topic})
            </span>
            <button
              type="button"
              aria-label="Dismiss tip"
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground p-0.5 rounded-full"
            >
              <X className="size-4" />
            </button>
          </div>

          <p className="text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed">
            &ldquo;{message}&rdquo;
          </p>

          {actionHref && (
            <div className="mt-1">
              <Button asChild variant="link" size="sm" className="p-0 h-auto font-bold text-xs text-primary gap-1">
                <Link href={actionHref}>
                  {actionLabel} <ArrowRight className="size-3" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
