"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Home,
  BookOpen,
  Target,
  Trophy,
  Award,
  LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

import { SoundToggle } from "@/components/shared/sound-toggle";
import { handleSignOut } from "@/app/(main)/logout-action";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/practice", label: "Practice", icon: Target },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/achievements", label: "Achievements", icon: Award },
];

export function MobileMenuButton() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(!open)}
        className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors lg:hidden"
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border/50 shadow-2xl lg:hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between h-14 px-4 border-b border-border/50">
              <Link
                href="/dashboard"
                className="flex items-center gap-2.5"
                onClick={() => setOpen(false)}
              >
                <div className="grid size-7 place-items-center rounded-lg bg-gradient-to-br from-primary via-emerald-400 to-cyan-400 text-primary-foreground shadow-md shadow-primary/30">
                  <span className="text-xs font-black">R</span>
                </div>
                <span className="text-base font-black tracking-tight text-foreground">
                  RithuDevQuest
                </span>
              </Link>
              <button
                onClick={() => setOpen(false)}
                className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                aria-label="Close menu"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 flex flex-col gap-1 px-3 py-4 overflow-y-auto" aria-label="Main navigation">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(item.href + "/");
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon
                      className={cn(
                        "size-5 shrink-0 transition-colors",
                        isActive ? "text-primary" : "group-hover:text-foreground"
                      )}
                      aria-hidden="true"
                    />
                    <span>{item.label}</span>
                    {isActive && (
                      <div className="ml-auto size-1.5 rounded-full bg-primary animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Bottom actions */}
            <div className="border-t border-border/50 p-3 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <SoundToggle />
              </div>

              <div className="flex items-center gap-1">
                <form action={handleSignOut}>
                  <button
                    type="submit"
                    className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    title="Sign out"
                  >
                    <LogOut className="size-4" />
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
