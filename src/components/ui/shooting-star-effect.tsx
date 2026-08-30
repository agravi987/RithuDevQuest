"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

type ShootingStar = {
  id: string;
  startX: number;
  startY: number;
  angle: number;
  color: string;
  size: number;
  delay: number;
};

let globalAddStar: ((color?: string) => void) | null = null;

export function useShootingStar() {
  return useCallback(
    (color?: string) => {
      globalAddStar?.(color);
    },
    []
  );
}

export function ShootingStarEffect() {
  const [stars, setStars] = useState<ShootingStar[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    globalAddStar = (color = "#ffd700") => {
      const id = `star-${Date.now()}-${Math.random()}`;
      const newStar: ShootingStar = {
        id,
        startX: Math.random() * 60 + 10,
        startY: Math.random() * 30,
        angle: Math.PI / 4 + Math.random() * 0.5,
        color,
        size: 2 + Math.random() * 2,
        delay: Math.random() * 0.3,
      };
      setStars((prev) => [...prev.slice(-5), newStar]);
    };

    return () => {
      globalAddStar = null;
    };
  }, []);

  // Clean up old stars
  useEffect(() => {
    if (stars.length === 0) return;
    const timeout = setTimeout(() => {
      setStars((prev) => prev.slice(1));
    }, 2000);
    return () => clearTimeout(timeout);
  }, [stars.length]);

  if (!mounted) return null;

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[150]">
      <AnimatePresence>
        {stars.map((star) => (
          <motion.div
            key={star.id}
            initial={{
              left: `${star.startX}%`,
              top: `${star.startY}%`,
              opacity: 0,
            }}
            animate={{
              left: `${star.startX + 35}%`,
              top: `${star.startY + 35}%`,
              opacity: [0, 1, 1, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1.2,
              delay: star.delay,
              ease: "easeOut",
            }}
            className="absolute"
          >
            {/* Head */}
            <div
              className="rounded-full"
              style={{
                width: star.size,
                height: star.size,
                backgroundColor: star.color,
                boxShadow: `0 0 ${star.size * 4}px ${star.color}, 0 0 ${star.size * 8}px ${star.color}60`,
              }}
            />
            {/* Tail */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 60 + star.size * 10 }}
              transition={{ duration: 0.5, delay: star.delay }}
              className="absolute right-full top-1/2 -translate-y-1/2"
              style={{
                height: star.size * 0.5,
                background: `linear-gradient(to left, ${star.color}60, transparent)`,
                borderRadius: 999,
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
}
