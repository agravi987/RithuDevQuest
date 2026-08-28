import Link from "next/link";
import { LogOut } from "lucide-react";

import { auth, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/shared/theme-toggle";

import { prisma } from "@/lib/db";
import { StreakCounter } from "@/components/gamification/streak-counter";
import { XPDisplay } from "@/components/gamification/xp-display";
import { LevelBadge } from "@/components/gamification/level-badge";
import { isSameUtcDay } from "@/lib/gamification/streaks";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/learn", label: "Learn" },
  { href: "/practice", label: "Practice" },
  { href: "/achievements", label: "Achievements" },
];

export async function Header() {
  const session = await auth();
  const user = session?.user;
  const name = user?.name ?? "User";
  const initials = name
    .split(" ")
    .map((part: string) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  let userXp = 0;
  let userLevel = 1;
  let currentStreak = 0;
  let isStreakActiveToday = false;

  if (user?.id) {
    const [userData, streakData] = await Promise.all([
      prisma.user.findUnique({
        where: { id: user.id },
        select: { xp: true, level: true },
      }),
      prisma.streak.findUnique({
        where: { userId: user.id },
        select: { currentStreak: true, lastActiveDate: true },
      }),
    ]);

    if (userData) {
      userXp = userData.xp;
      userLevel = userData.level;
    }
    if (streakData) {
      currentStreak = streakData.currentStreak;
      isStreakActiveToday = streakData.lastActiveDate
        ? isSameUtcDay(streakData.lastActiveDate, new Date())
        : false;
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold">
            <span className="grid size-7 place-items-center rounded-lg bg-primary text-primary-foreground">
              R
            </span>
            <span className="hidden sm:inline">RithuDevQuest</span>
          </Link>
          <nav className="hidden gap-1 md:flex" aria-label="Main">
            {navItems.map((item) => (
              <Button key={item.href} asChild variant="ghost" size="sm">
                <Link href={item.href}>{item.label}</Link>
              </Button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2.5">
          {user?.id && (
            <div className="flex items-center gap-2">
              <StreakCounter
                streak={currentStreak}
                isActiveToday={isStreakActiveToday}
                size="sm"
              />
              <XPDisplay xp={userXp} size="sm" />
              <LevelBadge level={userLevel} size="sm" />
            </div>
          )}
          <ThemeToggle />
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <Button
              variant="ghost"
              size="sm"
              aria-label="Sign out"
              type="submit"
            >
              <LogOut />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </form>
          <Avatar className="size-8">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}