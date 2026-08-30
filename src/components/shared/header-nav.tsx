"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Dashboard", emoji: "🏠" },
  { href: "/learn", label: "Learn", emoji: "📚" },
  { href: "/practice", label: "Practice", emoji: "🎯" },
  { href: "/leaderboard", label: "Leaderboard", emoji: "🏆" },
  { href: "/achievements", label: "Achievements", emoji: "⭐" },
];

export function HeaderNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden gap-0.5 md:flex flex-nowrap" aria-label="Main navigation" role="navigation">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Button
            key={item.href}
            asChild
            variant="ghost"
            size="sm"
            className="rounded-lg px-3 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-all duration-200 hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-current={isActive ? "page" : undefined}
          >
            <Link href={item.href}>
              <span className="mr-1 text-xs opacity-70 hidden lg:inline" aria-hidden="true">
                {item.emoji}
              </span>
              {item.label}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
