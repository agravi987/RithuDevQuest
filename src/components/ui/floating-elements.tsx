"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

type FloatingElement = {
  emoji: string;
  x: string;
  y: string;
  size: string;
  delay: number;
  duration: number;
};

type FloatingElementsProps = {
  elements?: FloatingElement[];
  className?: string;
  parallax?: boolean;
};

const defaultElements: FloatingElement[] = [
  { emoji: "⚡", x: "10%", y: "15%", size: "text-3xl", delay: 0, duration: 4 },
  { emoji: "🎯", x: "85%", y: "20%", size: "text-2xl", delay: 0.5, duration: 5 },
  { emoji: "🔥", x: "75%", y: "70%", size: "text-3xl", delay: 1, duration: 4.5 },
  { emoji: "💎", x: "15%", y: "75%", size: "text-2xl", delay: 1.5, duration: 5.5 },
  { emoji: "🚀", x: "90%", y: "45%", size: "text-4xl", delay: 0.3, duration: 3.5 },
  { emoji: "⭐", x: "5%", y: "45%", size: "text-2xl", delay: 2, duration: 6 },
  { emoji: "🎮", x: "50%", y: "10%", size: "text-xl", delay: 0.8, duration: 4.8 },
  { emoji: "🏆", x: "40%", y: "85%", size: "text-2xl", delay: 1.2, duration: 5.2 },
];

export function FloatingElements({
  elements = defaultElements,
  className = "",
  parallax = true,
}: FloatingElementsProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!parallax) return;
    const handler = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, [parallax]);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {elements.map((el, i) => (
        <motion.div
          key={i}
          className={`absolute ${el.size} opacity-10 select-none`}
          style={{ left: el.x, top: el.y }}
          animate={{
            y: [0, -15, 0, 10, 0],
            x: [0, 5, -5, 3, 0],
            rotate: [0, 5, -5, 3, 0],
          }}
          transition={{
            duration: el.duration,
            delay: el.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <span
            style={{
              display: "inline-block",
              transform: parallax
                ? `translate(${mousePos.x * (8 + i * 2)}px, ${mousePos.y * (6 + i * 2)}px)`
                : "none",
              transition: "transform 0.3s ease-out",
            }}
          >
            {el.emoji}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
