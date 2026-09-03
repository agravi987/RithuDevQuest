"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const SPLASH_SEEN_KEY = "rithu-splash-seen";

export function SplashScreen() {
  const [show, setShow] = useState(true);
  const [phase, setPhase] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const hasSeenSplash = sessionStorage.getItem(SPLASH_SEEN_KEY);

    if (prefersReducedMotion || hasSeenSplash) {
      setShow(false);
      return;
    }

    setHasAnimated(true);
    sessionStorage.setItem(SPLASH_SEEN_KEY, "true");

    const t1 = setTimeout(() => setPhase(1), 150);
    const t2 = setTimeout(() => setPhase(2), 300);
    const t3 = setTimeout(() => setPhase(3), 450);
    const t4 = setTimeout(() => setShow(false), 800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  if (!hasAnimated) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          aria-hidden="true"
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-achievement/10 pointer-events-none"
        >
          {/* Emoji rain particles - reduced count */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: "100vh" }}
                animate={{
                  opacity: [0, 0.3, 0],
                  y: ["100vh", "-20vh"],
                  x: [0, (i % 2 === 0 ? 30 : -30)],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 2.5 + (i % 2) * 0.3,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeOut",
                }}
                className="absolute text-xl"
                style={{
                  left: `${10 + i * 15}%`,
                }}
              >
                {["🚀", "⭐", "🎯", "⚡", "🏆", "🐧"][i]}
              </motion.div>
            ))}
          </div>

          {/* Animated logo */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.05 }}
            className="relative mb-4"
          >
            <div className="relative grid size-18 place-items-center rounded-3xl bg-gradient-to-br from-primary to-emerald-400 text-primary-foreground shadow-2xl shadow-primary/30">
              <span className="text-3xl font-black">R</span>
            </div>
          </motion.div>

          {/* Text reveal */}
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={phase >= 1 ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ type: "spring", stiffness: 250, damping: 20 }}
            className="text-center"
          >
            <h1 className="text-xl font-black tracking-tight">
              Rithu<span className="text-primary">Dev</span>Quest
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
            transition={{ type: "spring", stiffness: 250 }}
            className="mt-1"
          >
            <p className="text-xs text-muted-foreground font-medium">Loading your adventure...</p>
          </motion.div>

          {/* Animated loading bar */}
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={phase >= 2 ? { opacity: 1, width: 100 } : {}}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mt-4 h-1 rounded-full bg-muted overflow-hidden"
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
              className="h-full w-1/2 bg-gradient-to-r from-transparent via-primary to-transparent"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}