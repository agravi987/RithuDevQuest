"use client";

import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [spinning, setSpinning] = useState(false);

  const handleToggle = () => {
    setSpinning(true);
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
    setTimeout(() => setSpinning(false), 500);
  };

  return (
    <Button
      variant="ghost"
      size="icon" 
      aria-label="Toggle theme"
      onClick={handleToggle}
      className="transition-all duration-200 hover:bg-primary/5 hover:scale-110 size-9"
    >
      <Sun
        className={`hidden dark:block transition-all duration-500 ${
          spinning ? "rotate-[360deg] scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
        }`}
      />
      <Moon
        className={`dark:hidden transition-all duration-500 ${
          spinning ? "rotate-[360deg] scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
        }`}
      />
    </Button>
  );
}
