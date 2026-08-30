"use client";

import { motion } from "motion/react";
import { RithuMascot } from "@/components/mentor/rithu-mascot";

type AuthStageProps = {
  title: string;
  description: string;
  mascotMessage: string;
  children: React.ReactNode;
};

export function AuthStage({
  title,
  description,
  mascotMessage,
  children,
}: AuthStageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative flex flex-col items-center"
    >
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-emerald-500/25 via-transparent to-purple-500/25 blur-2xl"
      />

      {/* Floating mascot greeting */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10"
      >
        <RithuMascot mood="happy" message={mascotMessage} size="md" />
      </motion.div>

      {/* Glass panel */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
        className="relative mt-2 w-full rounded-3xl border border-border bg-card/80 p-6 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-8"
      >
        <h1 className="text-2xl font-black tracking-tight text-foreground">
          {title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {description}
        </p>
        <div className="mt-6">{children}</div>
      </motion.div>
    </motion.div>
  );
}
