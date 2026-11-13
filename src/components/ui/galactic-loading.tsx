"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Lightbulb, Rocket } from "lucide-react";
import { getLoadingMessages, type LoadingMessage } from "@/lib/loading-messages";
import { CosmicCharacter } from "@/components/quiz/characters/CosmicCharacter";

const ROTATION_MS = 3200;

function MessageBubble({ message }: { message: LoadingMessage }) {
  const isTip = message.kind === "tip";

  return (
    <motion.div
      key={message.text}
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative flex flex-col items-center gap-1.5 text-center px-4"
    >
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-wider border border-b-2 shadow-sm ${
          isTip
            ? "border-amber-500/40 bg-amber-500/15 text-amber-400"
            : "border-cyan-500/40 bg-cyan-500/15 text-cyan-300"
        }`}
      >
        {isTip ? <Lightbulb className="size-3" /> : <Sparkles className="size-3" />}
        {isTip ? "Cadet Pro Tip" : "Cosmic Motivation"}
      </span>

      <p className="text-sm sm:text-base font-bold text-foreground leading-snug max-w-md">
        &ldquo;{message.text}&rdquo;
      </p>

      {"author" in message && message.author && (
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">
          — {message.author}
        </p>
      )}
    </motion.div>
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
    <div className="relative flex min-h-[50vh] w-full items-center justify-center p-4 py-12">
      {/* Duolingo 3D Stage Card */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border-2 border-emerald-500/30 border-b-[8px] border-b-emerald-600/40 bg-card p-6 sm:p-10 text-center shadow-2xl shadow-emerald-500/10">
        {/* Ambient Cosmic Lights */}
        <div className="pointer-events-none absolute -left-20 -top-20 size-56 rounded-full bg-emerald-500/10 blur-[90px]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 size-56 rounded-full bg-cyan-500/10 blur-[90px]" />

        {/* Twinkling star specs */}
        {[15, 30, 48, 68, 85].map((left, i) => (
          <div
            key={i}
            aria-hidden
            className="absolute size-1 rounded-full bg-white/30 animate-twinkle"
            style={{
              left: `${left}%`,
              top: `${12 + ((i * 21) % 70)}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}

        <div className="relative z-10 flex flex-col items-center gap-6">
          {/* ═══ 1. ANIMATED COMMANDER RITHU MASCOT STAGE ═══ */}
          <div className="relative">
            {/* Glowing pedestal shadow */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-4 rounded-full bg-emerald-500/20 blur-md" />

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="relative size-24 sm:size-28 flex items-center justify-center rounded-3xl bg-emerald-500/15 border-2 border-b-4 border-emerald-500/40 shadow-xl shadow-emerald-500/10"
            >
              <CosmicCharacter
                characterId="rithu"
                mood="speaking"
                size="custom"
                className="size-20 sm:size-24"
              />
            </motion.div>

            <span className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full bg-emerald-400 text-slate-950 font-black text-xs shadow-md">
              🚀
            </span>
          </div>

          {/* ═══ 2. DUOLINGO SPEECH BUBBLE MESSAGE ═══ */}
          <div className="relative min-h-[96px] w-full flex items-center justify-center rounded-2xl border-2 border-border/80 border-b-4 border-b-border bg-card/70 p-4 shadow-sm">
            {/* Speech bubble pointer pointing up */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 size-3 rotate-45 border-l-2 border-t-2 border-border/80 bg-card/90" />

            <AnimatePresence mode="wait">
              <MessageBubble key={message.text} message={message} />
            </AnimatePresence>
          </div>

          {/* ═══ 3. DUOLINGO 3D PROGRESS CAPSULE ═══ */}
          <div className="flex flex-col items-center gap-2 w-full pt-1">
            <div className="relative h-4 sm:h-5 w-64 sm:w-72 rounded-full border-2 border-emerald-600/40 bg-slate-950 p-0.5 overflow-hidden shadow-inner">
              <motion.div
                animate={{
                  width: ["20%", "75%", "95%", "35%"],
                  x: ["0%", "5%", "0%", "0%"],
                }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                className="relative h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 shadow-[0_0_12px_rgba(16,185,129,0.6)]"
              >
                {/* Glossy top shine */}
                <div className="absolute top-0.5 left-1 right-1 h-1 rounded-full bg-white/35" />
              </motion.div>
            </div>

            <div className="flex items-center gap-2 text-xs font-black text-emerald-400 uppercase tracking-widest mt-1">
              <Rocket className="size-3.5 animate-bounce text-emerald-400" />
              <span>Powering up hyperdrive...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Slim variant for streaming section fallbacks — features a compact bouncing Cosmo
 * plus rotating tips with Duolingo styling.
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
      className="flex flex-col items-center gap-3.5 rounded-3xl border-2 border-emerald-500/25 border-b-4 border-b-emerald-600/30 bg-card p-6 text-center shadow-md"
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="size-14 flex items-center justify-center rounded-2xl bg-emerald-500/15 border-2 border-b-3 border-emerald-500/40 shadow-md"
      >
        <CosmicCharacter
          characterId="cosmo"
          mood="thinking"
          size="custom"
          className="size-11"
        />
      </motion.div>

      <p className="text-xs font-black uppercase tracking-wider text-foreground">{label}</p>

      {/* Mini 3D Progress Capsule */}
      <div className="relative h-2.5 w-40 rounded-full border border-emerald-500/40 bg-slate-950 p-0.5 overflow-hidden">
        <motion.div
          animate={{ width: ["15%", "85%", "40%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={message.text}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="max-w-[280px] text-xs font-bold text-muted-foreground leading-relaxed"
        >
          {message.kind === "tip" ? "💡 " : "✨ "}
          &ldquo;{message.text}&rdquo;
        </motion.p>
      </AnimatePresence>
    </div>
  );
}