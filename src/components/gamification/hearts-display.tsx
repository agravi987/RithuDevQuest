"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

type HeartsDisplayProps = {
  hearts: number;
  maxHearts?: number;
  nextRegen?: Date | null;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
};

export function HeartsDisplay({
  hearts,
  maxHearts = 5,
  nextRegen,
  size = "md",
  showLabel = false,
  className,
}: HeartsDisplayProps) {
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  useEffect(() => {
    if (!nextRegen || hearts >= maxHearts) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = new Date(nextRegen).getTime() - now;

      if (diff <= 0) {
        setTimeLeft(null);
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, "0")}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [nextRegen, hearts, maxHearts]);

  const sizeClasses = {
    sm: "size-4",
    md: "size-5",
    lg: "size-6",
  };

  return (
    <div className={cn("flex items-center gap-1", className)} role="img" aria-label={`${hearts} of ${maxHearts} hearts remaining`}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxHearts }).map((_, i) => (
          <Heart
            key={i}
            className={cn(
              sizeClasses[size],
              "transition-all duration-300",
              i < hearts
                ? hearts <= 2
                  ? "fill-red-500 text-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.5)] animate-pulse"
                  : "fill-red-500 text-red-500 drop-shadow-[0_0_4px_rgba(239,68,68,0.4)]"
                : "text-muted-foreground/30",
              i === hearts - 1 && hearts <= 2 && "animate-heartbreak",
            )}
          />
        ))}
      </div>

      {showLabel && (
        <span className="ml-1 text-xs font-bold text-muted-foreground">
          {hearts}/{maxHearts}
        </span>
      )}

      {timeLeft && (
        <span className="ml-1 text-[10px] font-bold text-red-400" aria-live="polite">
          ❤️ {timeLeft}
        </span>
      )}
    </div>
  );
}

/**
 * Full-screen overlay when hearts are depleted.
 */
export function NoHeartsOverlay({
  hearts,
  nextRegen,
  onDismiss,
}: {
  hearts: number;
  nextRegen?: Date | null;
  onDismiss: () => void;
}) {
  if (hearts > 0) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-background/80 backdrop-blur-md" role="dialog" aria-modal="true" aria-label="Out of hearts">
      <div className="mx-4 flex flex-col items-center gap-6 rounded-3xl border-2 border-destructive/20 bg-card p-6 sm:p-8 text-center shadow-2xl max-w-sm w-full">
        {/* Broken heart animation */}
        <div className="relative">
          <div className="grid size-20 place-items-center rounded-full bg-destructive/10">
            <span className="text-5xl">💔</span>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-black">Out of Hearts!</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            You&apos;ve used all your hearts. Wait for them to regenerate or practice to earn more.
          </p>
        </div>

        {/* Regen timer */}
        {nextRegen && (
          <div className="rounded-xl bg-muted/50 px-4 py-2 text-sm font-semibold text-muted-foreground">
            ❤️ Next heart in: <CountdownTimer target={nextRegen} />
          </div>
        )}

        {/* Hearts display */}
        <HeartsDisplay hearts={hearts} maxHearts={5} nextRegen={nextRegen} size="lg" showLabel />

        <div className="flex flex-col gap-2 w-full">
          <button
            onClick={onDismiss}
            className="w-full rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-md hover:brightness-110 transition-all"
          >
            Go to Practice Arena
          </button>
          <button
            onClick={onDismiss}
            className="w-full rounded-xl border-2 border-border px-6 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted transition-all"
          >
            Wait for Hearts
          </button>
        </div>
      </div>
    </div>
  );
}

function CountdownTimer({ target }: { target: Date }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = new Date(target).getTime() - now;

      if (diff <= 0) {
        setTimeLeft("Ready!");
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [target]);

  return <span className="font-bold text-foreground">{timeLeft}</span>;
}
