"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, GraduationCap, Target, Trophy, Award } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Home", icon: BookOpen, activeColor: "text-primary", glowColor: "shadow-primary/30" },
  { href: "/learn", label: "Learn", icon: GraduationCap, activeColor: "text-primary", glowColor: "shadow-primary/30" },
  { href: "/practice", label: "Practice", icon: Target, activeColor: "text-xp", glowColor: "shadow-xp/30" },
  { href: "/leaderboard", label: "League", icon: Trophy, activeColor: "text-xp", glowColor: "shadow-xp/30" },
  { href: "/achievements", label: "Badges", icon: Award, activeColor: "text-achievement", glowColor: "shadow-achievement/30" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/40 bg-background/95 backdrop-blur-2xl md:hidden pb-safe" role="navigation" aria-label="Main navigation">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center gap-1 px-3 py-2.5 min-w-[52px] text-[10px] font-semibold transition-all duration-200 rounded-xl active:scale-[0.95] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isActive
                  ? item.activeColor
                  : "text-muted-foreground/70 hover:text-foreground"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {/* Active indicator bar with glow */}
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-0.5 rounded-full bg-current shadow-sm" style={{ boxShadow: `0 0 4px currentColor` }} />
              )}
              <div
                className={cn(
                  "grid size-10 place-items-center rounded-xl transition-all duration-200",
                  isActive && `bg-primary/10 scale-110 shadow-lg ${item.glowColor}`
                )}
              >
                <Icon
                  className={cn(
                    "size-5 transition-all duration-200",
                    isActive && "scale-110 drop-shadow-sm"
                  )}
                  aria-hidden="true"
                />
              </div>
              <span
                className={cn(
                  "transition-all duration-200 truncate max-w-[60px]",
                  isActive && "text-[11px] font-extrabold"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
