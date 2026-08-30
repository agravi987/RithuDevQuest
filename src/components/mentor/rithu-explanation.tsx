"use client";

import { useState } from "react";
import { Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MarkdownText } from "@/components/lesson/markdown";

type RithuExplanationProps = {
  explanation: string;
  correctAnswer?: string;
  className?: string;
};

export function RithuExplanation({
  explanation,
  correctAnswer,
  className = "",
}: RithuExplanationProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-card to-background p-4 ${className}`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 text-left"
      >
        <div className="size-8 shrink-0 rounded-xl bg-gradient-to-tr from-primary to-emerald-400 flex items-center justify-center text-white shadow-sm">
          <Sparkles className="size-4" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Rithu explains
          </span>
          <p className="text-sm font-medium text-foreground mt-0.5">
            Let me break this down for you
          </p>
        </div>
        {expanded ? (
          <ChevronUp className="size-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="size-4 text-muted-foreground" />
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-3 border-t border-border/50 pt-3">
              {correctAnswer && (
                <div className="mb-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Correct answer:{" "}
                  </span>
                  <code className="text-sm font-mono font-semibold text-emerald-700 dark:text-emerald-300">
                    {correctAnswer}
                  </code>
                </div>
              )}
              <div className="text-sm text-muted-foreground leading-relaxed">
                <MarkdownText text={explanation} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
