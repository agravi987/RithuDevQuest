"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

type GlowCardProps = {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
};

export function GlowCard({
  children,
  className,
  glowColor = "oklch(0.72 0.19 142 / 0.15)",
}: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    // Write position straight to the DOM node to avoid re-rendering on every move
    cardRef.current.style.setProperty("--glow-x", `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty("--glow-y", `${e.clientY - rect.top}px`);
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300",
        isHovered && "border-primary/30 shadow-lg shadow-primary/5 scale-[1.01]",
        className,
      )}
    >
      {/* Glow spotlight */}
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px"
          style={{
            background: `radial-gradient(400px circle at var(--glow-x, 50%) var(--glow-y, 50%), ${glowColor}, transparent 70%)`,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
