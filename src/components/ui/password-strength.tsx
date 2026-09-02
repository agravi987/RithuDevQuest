"use client";

import { cn } from "@/lib/utils";
import { evaluatePasswordStrength } from "@/lib/password-strength";

const SCORE_BAR_COLORS = [
  "bg-border",
  "bg-red-500",
  "bg-amber-500",
  "bg-emerald-500",
];

const SCORE_LABEL_COLORS = [
  "text-muted-foreground",
  "text-red-500",
  "text-amber-500",
  "text-emerald-500",
];

export function PasswordStrengthMeter({ value }: { value: string }) {
  const { score, label } = evaluatePasswordStrength(value);

  if (!value) return null;

  return (
    <div className="flex flex-col gap-1.5" aria-hidden="true">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-300",
              i <= score ? SCORE_BAR_COLORS[score] : "bg-border",
            )}
          />
        ))}
      </div>
      <span
        className={cn(
          "text-xs font-medium",
          SCORE_LABEL_COLORS[score],
        )}
      >
        {label}
      </span>
    </div>
  );
}