"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { DuoButton } from "../duo-button";
import { CosmicCharacter } from "../characters/CosmicCharacter";

export interface DuolingoExitModalProps {
  isOpen: boolean;
  onKeepPlaying: () => void;
  onConfirmQuit: () => void;
}

export function DuolingoExitModal({
  isOpen,
  onKeepPlaying,
  onConfirmQuit,
}: DuolingoExitModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onKeepPlaying}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 16 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="relative w-full max-w-sm rounded-3xl border border-white/15 bg-[#0c1022] p-6 sm:p-7 shadow-2xl text-center"
        >
          {/* Sad/Concerned Mascot */}
          <div className="flex justify-center mb-3">
            <CosmicCharacter characterId="rithu" mood="sad_droop" size="md" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
            Leave Session?
          </h2>
          <p className="text-sm text-white/60 mb-6 leading-relaxed">
            You will lose your current session progress and streak combo if you quit now!
          </p>

          <div className="flex flex-col gap-3">
            <DuoButton
              variant="primary"
              size="lg"
              fullWidth
              autoFocus
              onClick={onKeepPlaying}
            >
              Keep Practicing
            </DuoButton>

            <button
              type="button"
              onClick={onConfirmQuit}
              className="py-3 text-sm font-bold uppercase tracking-wider text-rose-400 hover:text-rose-300 active:translate-y-0.5 transition-all cursor-pointer"
            >
              Quit Anyway
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
