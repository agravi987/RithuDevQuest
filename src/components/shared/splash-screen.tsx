"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export function SplashScreen() {
  const [show, setShow] = useState(true);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // Respect reduced motion - skip splash almost instantly
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) {
      setShow(false);
      return;
    }

    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 600);
    const t3 = setTimeout(() => setPhase(3), 900);
    const t4 = setTimeout(() => setShow(false), 1600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          aria-hidden="true"
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-achievement/10 pointer-events-none"
        >
          {/* Emoji rain particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: "100vh" }}
                animate={{
                  opacity: [0, 0.25, 0],
                  y: ["100vh", "-20vh"],
                  x: [0, (i % 2 === 0 ? 40 : -40)],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 3.5 + (i % 3) * 0.5,
                  repeat: Infinity,
                  delay: i * 0.25,
                  ease: "easeOut",
                }}
                className="absolute text-xl"
                style={{
                  left: `${8 + i * 8}%`,
                }}
              >
                {["🚀", "⭐", "🎯", "⚡", "🏆", "🐧", "🐳", "✨", "🔥", "💎", "🎯", "🚀"][i]}
              </motion.div>
            ))}
          </div>

          {/* Animated logo */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 150, damping: 12, delay: 0.1 }}
            className="relative mb-6"
          >
            {/* Spinning glow ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-4 rounded-full border-2 border-primary/20 border-t-primary border-r-transparent"
            />
            {/* Breathing glow */}
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -inset-6 rounded-full bg-primary/20 blur-xl"
            />
            <div className="relative grid size-20 place-items-center rounded-3xl bg-gradient-to-br from-primary to-emerald-400 text-primary-foreground shadow-2xl shadow-primary/30">
              <span className="text-4xl font-black">R</span>
              {/* Orbiting sparkle */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute -right-1 -top-1"
              >
                <span className="text-sm">✨</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Text reveal with spring */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={phase >= 1 ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="text-center"
          >
            <h1 className="text-2xl font-black tracking-tight">
              Rithu<span className="text-primary">Dev</span>Quest
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
            transition={{ type: "spring", stiffness: 200 }}
            className="mt-2"
          >
            <p className="text-xs text-muted-foreground font-medium">Loading your adventure...</p>
          </motion.div>

          {/* Animated loading bar with sparkle */}
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={phase >= 2 ? { opacity: 1, width: 120 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mt-6 h-1.5 rounded-full bg-muted overflow-hidden"
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              className="h-full w-1/2 bg-gradient-to-r from-transparent via-primary to-transparent"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
