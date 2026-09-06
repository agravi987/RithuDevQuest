"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { getLoadingMessages, type LoadingMessage } from "@/lib/loading-messages";

const ROTATION_MS = 3500;

function MessageCard({ message }: { message: LoadingMessage }) {
  return (
    <motion.div
      key={message.text}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col items-center gap-2 text-center"
    >
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest ${
          message.kind === "quote"
            ? "border border-primary/25 bg-primary/10 text-primary"
            : "border border-amber-400/30 bg-amber-400/10 text-amber-500"
        }`}
      >
        {message.kind === "quote" ? "✨ Motivation" : "💡 Pro Tip"}
      </span>
      <p className="text-sm sm:text-base font-medium text-foreground/90 leading-relaxed max-w-md">
        {message.text}
      </p>
      {"author" in message && message.author && (
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
          — {message.author}
        </p>
      )}
    </motion.div>
  );
}

function LogoMark() {
  return (
    <div className="relative">
      <div className="size-20 rounded-3xl border-2 border-primary/25 animate-pulse-ring" />
      <div className="absolute inset-0 grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-primary via-emerald-400 to-cyan-400 shadow-xl shadow-primary/30">
        <span className="text-2xl font-black text-primary-foreground">R</span>
      </div>
    </div>
  );
}

export function GalacticLoading() {
  const messages = getLoadingMessages();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (messages.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, ROTATION_MS);
    return () => clearInterval(timer);
  }, [messages.length]);

  const message = messages[index] ?? messages[0]!;

  return (
    <div className="relative flex min-h-[40vh] items-center justify-center py-10">
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-b from-card/80 to-card/30 p-8 sm:p-10 text-center shadow-xl shadow-black/10">
        {/* Nebula glows */}
        <div className="pointer-events-none absolute -left-16 -top-16 size-48 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 size-48 rounded-full bg-cyan-500/10 blur-3xl" />
        {/* Twinkling stars */}
        {[12, 27, 42, 58, 72, 86, 95].map((left, i) => (
          <div
            key={i}
            aria-hidden
            className="absolute size-0.5 rounded-full bg-foreground/30 animate-twinkle"
            style={{ left: `${left}%`, top: `${10 + ((i * 17) % 60)}%`, animationDelay: `${i * 0.4}s` }}
          />
        ))}

        <div className="relative flex flex-col items-center gap-4">
          <LogoMark />

          <div>
            <h2 className="text-lg font-black tracking-tight text-foreground">
              Rithu<span className="text-primary">Dev</span>Quest
            </h2>
            <p className="mt-0.5 text-xs font-medium text-muted-foreground">
              Loading your galaxy…
            </p>
          </div>

          {/* Rotating message */}
          <div className="min-h-[92px] flex items-center justify-center w-full">
            <AnimatePresence mode="wait">
              <MessageCard key={message.text} message={message} />
            </AnimatePresence>
          </div>

          {/* Shimmer loading bar */}
          <div className="relative h-1 w-48 max-w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              aria-hidden
              animate={{ x: ["-100%", "260%"] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
              className="h-full w-1/3 bg-gradient-to-r from-transparent via-primary to-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Slim variant for streaming section fallbacks — a spinner plus the rotating
 * tip, so a loading state always has something engaging to say.
 */
export function GalacticLoadingStatus({ label = "Loading your galaxy…" }: { label?: string }) {
  const messages = getLoadingMessages();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (messages.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, ROTATION_MS);
    return () => clearInterval(timer);
  }, [messages.length]);

  const message = messages[index] ?? messages[0]!;

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border/60 bg-card/40 px-4 py-8 text-center"
    >
      <div className="relative grid size-10 place-items-center rounded-full bg-gradient-to-br from-primary via-emerald-400 to-cyan-400 animate-pulse-ring">
        <div className="size-8 rounded-full border-2 border-background border-t-transparent animate-spin" />
      </div>
      <p className="text-xs font-bold text-muted-foreground">{label}</p>
      <AnimatePresence mode="wait">
        <motion.p
          key={message.text}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className="max-w-[260px] text-[11px] leading-relaxed text-muted-foreground/70"
        >
          {message.kind === "tip" ? "💡 " : "✨ "}
          {message.text}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}