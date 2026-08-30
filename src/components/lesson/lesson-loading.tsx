"use client";

import { motion } from "motion/react";

export function LessonLoading() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-16">
      {/* Spinning planet with orbit */}
      <div className="relative">
        {/* Outer orbit */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-8 rounded-full border border-dashed border-primary/20"
        />
        {/* Inner orbit */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-5 rounded-full border border-dashed border-primary/10"
        />
        {/* Planet */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="relative grid size-16 place-items-center rounded-full bg-gradient-to-br from-primary to-emerald-400 shadow-xl shadow-primary/30"
        >
          <motion.span
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="text-2xl"
          >
            🚀
          </motion.span>
        </motion.div>
        {/* Orbiting star */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-6"
        >
          <div className="absolute left-1/2 top-0 -translate-x-1/2 size-2 rounded-full bg-xp shadow-lg shadow-xp/50" />
        </motion.div>
        {/* Second orbiting star */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-8"
        >
          <div className="absolute left-0 top-1/2 -translate-y-1/2 size-1.5 rounded-full bg-achievement shadow-lg shadow-achievement/50" />
        </motion.div>
        {/* Glow ring */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -inset-4 rounded-full bg-primary/15 blur-xl"
        />
      </div>

      {/* Text with typing effect */}
      <div className="text-center">
        <motion.h3
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-lg font-bold"
        >
          Loading Lesson<span className="typing-cursor" />
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-muted-foreground mt-1"
        >
          Preparing your quest
        </motion.p>
      </div>

      {/* Constellation dots with sparkle */}
      <div className="flex items-center gap-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.15,
            }}
            className="size-2 rounded-full bg-primary"
          />
        ))}
      </div>

      {/* Floating emoji hints */}
      <div className="flex items-center gap-4 mt-2">
        {["🐧", "🔀", "🐳", "☸️"].map((emoji, i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
            className="text-lg opacity-30"
          >
            {emoji}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
