"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, AlertCircle, CheckCircle2, BookOpen } from "lucide-react";
import { DuoButton } from "../duo-button";

export interface DuolingoMistakeItem {
  question: string;
  userAnswer?: string;
  correctAnswer: string;
  explanation?: string;
}

export interface DuolingoMistakesModalProps {
  isOpen: boolean;
  onClose: () => void;
  mistakes: DuolingoMistakeItem[];
}

export function DuolingoMistakesModal({
  isOpen,
  onClose,
  mistakes,
}: DuolingoMistakesModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="relative w-full max-w-lg max-h-[85vh] rounded-3xl border border-white/15 bg-[#0c1022] p-5 sm:p-7 shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="grid size-9 place-items-center rounded-xl bg-cyan-500/15 text-cyan-400">
                <BookOpen className="size-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Review Mistakes</h3>
                <p className="text-xs text-white/50">{mistakes.length} concepts recycled</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="grid size-8 place-items-center rounded-lg bg-white/5 text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Mistakes Scroll Area */}
          <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-4 pr-1">
            {mistakes.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-col gap-3"
              >
                {/* Question Prompt */}
                <h4 className="text-sm font-bold text-white leading-snug">
                  {item.question}
                </h4>

                {/* User Answer (Wrong) */}
                {item.userAnswer && (
                  <div className="flex items-start gap-2 text-xs">
                    <AlertCircle className="size-4 text-rose-400 shrink-0 mt-0.5" />
                    <div className="text-rose-300">
                      <span className="font-bold opacity-75">Your answer: </span>
                      <span className="line-through">{item.userAnswer}</span>
                    </div>
                  </div>
                )}

                {/* Correct Answer */}
                <div className="flex items-start gap-2 text-xs">
                  <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-emerald-300">
                    <span className="font-bold opacity-75">Correct solution: </span>
                    <span className="font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      {item.correctAnswer}
                    </span>
                  </div>
                </div>

                {/* Mentor Explanation */}
                {item.explanation && (
                  <p className="text-xs text-white/50 bg-white/5 p-2.5 rounded-xl leading-relaxed">
                    💡 {item.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Footer Close Button */}
          <div className="pt-3 border-t border-white/10 shrink-0">
            <DuoButton
              variant="primary"
              size="md"
              fullWidth
              onClick={onClose}
            >
              Got It, Commander!
            </DuoButton>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
