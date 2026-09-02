"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

type SupernovaProps = {
  show: boolean;
  title: string;
  subtitle?: string;
  emoji?: string;
  color?: string;
  onComplete?: () => void;
};

export function Supernova({
  show,
  title,
  subtitle,
  emoji = "⭐",
  color = "from-primary to-emerald-400",
  onComplete,
}: SupernovaProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!show) {
      setPhase(0);
      return;
    }

    setPhase(1);
    const t1 = setTimeout(() => setPhase(2), 300);
    const t2 = setTimeout(() => setPhase(3), 600);
    const t3 = setTimeout(() => {
      setPhase(4);
      onComplete?.();
    }, 2000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && phase > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-hidden="true"
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
          />

          {/* Expanding rings */}
          {[1, 2, 3].map((ring) => (
            <motion.div
              key={ring}
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 4, opacity: 0 }}
              transition={{
                duration: 1.5,
                delay: ring * 0.15,
                ease: "easeOut",
              }}
              className={`absolute size-24 rounded-full border-2 bg-gradient-to-br ${color} opacity-20`}
            />
          ))}

          {/* Particle burst */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, x: 0, y: 0 }}
              animate={{
                scale: [0, 1, 0],
                x: Math.cos((i * Math.PI * 2) / 12) * 150,
                y: Math.sin((i * Math.PI * 2) / 12) * 150,
              }}
              transition={{
                duration: 1,
                delay: 0.2 + i * 0.03,
                ease: "easeOut",
              }}
              className="absolute size-2 rounded-full bg-amber-400"
            />
          ))}

          {/* Central content */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
            className="relative z-10 flex flex-col items-center gap-4"
          >
            {/* Emoji */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-6xl"
            >
              {emoji}
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-3xl font-black tracking-tight text-center"
            >
              {title}
            </motion.h2>

            {/* Subtitle */}
            {subtitle && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-sm text-muted-foreground"
              >
                {subtitle}
              </motion.p>
            )}

            {/* Sparkle particles around text */}
            {phase >= 2 && Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: (Math.random() - 0.5) * 200,
                  y: (Math.random() - 0.5) * 100,
                }}
                transition={{
                  duration: 1.5,
                  delay: 0.8 + i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
                className="absolute text-amber-400 text-xs"
              >
                ✦
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
