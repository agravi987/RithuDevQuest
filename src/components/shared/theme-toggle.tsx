"use client";

import { useEffect, useRef, useState } from "react";
import { Moon, Sun, Star } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark" | "midnight";

const THEMES: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "midnight", label: "Midnight", icon: Star },
];

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [spinning, setSpinning] = useState(false);
  const [mounted, setMounted] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const cycleTheme = () => {
    setSpinning(true);
    const current = (resolvedTheme ?? "dark") as Theme;
    const currentIdx = THEMES.findIndex((t) => t.value === current);
    const nextIdx = (currentIdx + 1) % THEMES.length;
    const nextTheme = THEMES[nextIdx]!.value;
    setTheme(nextTheme);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setSpinning(false), 500);
  };

  const currentTheme = THEMES.find((t) => t.value === resolvedTheme) ?? THEMES[1];
  const Icon = currentTheme.icon;

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={`Theme: ${currentTheme.label}. Click to cycle.`}
      onClick={cycleTheme}
      className="transition-all duration-200 hover:bg-primary/5 hover:scale-110 size-9"
    >
      {mounted ? (
        <Icon
          className={cn(
            "transition-all duration-500",
            spinning ? "rotate-[360deg] scale-0 opacity-0" : "rotate-0 scale-100 opacity-100",
            resolvedTheme === "midnight" && "text-purple-400",
          )}
        />
      ) : (
        <Sun className="opacity-0" />
      )}
    </Button>
  );
}

/**
 * Expanded theme picker for settings pages — shows all 3 options.
 */
export function ThemePicker() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="flex items-center gap-2 rounded-xl bg-muted/30 p-1">
      {THEMES.map(({ value, label, icon: T }) => {
        const active = resolvedTheme === value;
        return (
          <button
            key={value}
            onClick={() => setTheme(value)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all",
              active
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <T className={cn("size-3.5", value === "midnight" && active && "text-purple-500")} />
            {label}
          </button>
        );
      })}
    </div>
  );
}
