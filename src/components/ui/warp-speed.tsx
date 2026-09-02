"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";

let globalTriggerWarp: (() => void) | null = null;

export function useWarpSpeed() {
  return useCallback(() => {
    globalTriggerWarp?.();
  }, []);
}

export function WarpSpeedOverlay() {
  const [active, setActive] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    globalTriggerWarp = () => {
      setActive(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setActive(false), 800);
    };
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      globalTriggerWarp = null;
    };
  }, []);

  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="pointer-events-none fixed inset-0 z-[250]"
        >
          {/* Star streaks radiating from center */}
          {[...Array(40)].map((_, i) => {
            const angle = (i / 40) * Math.PI * 2;
            const delay = Math.random() * 0.2;
            const length = 50 + Math.random() * 50;
            const startX = 50 + Math.cos(angle) * 5;
            const startY = 50 + Math.sin(angle) * 5;
            const endX = 50 + Math.cos(angle) * length;
            const endY = 50 + Math.sin(angle) * length;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: `${startX}vw`, y: `${startY}vh`, scaleX: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  x: `${endX}vw`,
                  y: `${endY}vh`,
                  scaleX: [0, 1, 0.5],
                }}
                transition={{
                  duration: 0.7,
                  delay,
                  ease: "easeOut",
                }}
                className="absolute h-px origin-left"
                style={{
                  width: length * 3,
                  background: `linear-gradient(to right, white, transparent)`,
                  transform: `rotate(${(angle * 180) / Math.PI}deg)`,
                }}
              />
            );
          })}

          {/* Central flash */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.6, 0], scale: [0, 1.5, 3] }}
            transition={{ duration: 0.5 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-40 rounded-full"
            style={{
              background: "radial-gradient(circle, white 0%, transparent 70%)",
            }}
          />

          {/* Fade to white flash */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.15, 0] }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="absolute inset-0 bg-white"
          />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
