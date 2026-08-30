import Link from "next/link";
import { LogOut, Heart } from "lucide-react";

import { auth } from "@/lib/auth";
import { handleSignOut } from "@/app/(main)/logout-action";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { SoundToggle } from "@/components/shared/sound-toggle";
import { HeaderNav } from "@/components/shared/header-nav";
import { prisma } from "@/lib/db";

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
  let userHearts = 5;

  if (user?.id) {
    const [userData, streakData] = await Promise.all([
      prisma.user.findUnique({
        where: { id: user.id },
        select: { xp: true, level: true, hearts: true },
      }),
      prisma.streak.findUnique({
        where: { userId: user.id },
        select: { currentStreak: true, lastActiveDate: true },
      }),
    ]);

    if (userData) {
      userXp = userData.xp;
      userLevel = userData.level;
      userHearts = userData.hearts;
    }
    if (streakData) {
      currentStreak = streakData.currentStreak;
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border/40 bg-background/80 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 w-full max-w-[calc(100vw-2rem)] items-center justify-between gap-3 md:gap-4 px-4 overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-4 md:gap-6 flex-shrink-0">
          {/* Logo with breathing glow */}
          <Link href="/dashboard" className="flex items-center gap-2.5 group flex-shrink-0" aria-label="RithuDevQuest Home">
            <div className="relative grid size-8 place-items-center rounded-xl bg-gradient-to-br from-primary to-emerald-400 text-primary-foreground shadow-md shadow-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/30">
              <span className="text-sm font-black">R</span>
              {/* Orbiting sparkle */}
              <span className="absolute -right-0.5 -top-0.5 text-[8px] animate-orbit" aria-hidden="true">✨</span>
            </div>
            <span className="hidden text-lg font-black tracking-tight sm:inline truncate max-w-[150px]">
              Rithu<span className="text-primary">Dev</span>Quest
            </span>
          </Link>

          {/* Desktop nav — client component to avoid hydration mismatch */}
          <HeaderNav />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
          {user?.id && (
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Streak with fire escalation — hidden below sm */}
              <div className={`hidden sm:flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold text-streak transition-all duration-300 cursor-default hover:scale-105 ${currentStreak > 7 ? 'bg-streak/20 hover:shadow-md hover:shadow-streak/20' : 'bg-streak/10 hover:bg-streak/15'}`} title={`${currentStreak} day streak` + (currentStreak > 7 ? ' — 🔥🔥🔥' : '')}>
                <span className={currentStreak > 7 ? 'animate-bounce' : ''} aria-hidden="true">🔥</span>
                <span>{currentStreak}</span>
              </div>
              {/* XP with glow on high values — hidden below sm */}
              <div className="hidden sm:flex items-center gap-1 rounded-full bg-xp/10 px-2.5 py-1 text-xs font-bold text-xp transition-all duration-300 cursor-default hover:scale-105 hover:bg-xp/15 hover:shadow-md hover:shadow-xp/20" title={`${userXp.toLocaleString()} XP` + (userXp > 1000 ? ' ⚡' : '')}>
                <span aria-hidden="true">⚡</span>
                <span>{userXp.toLocaleString()}</span>
              </div>
              {/* Hearts with pulse when low — always visible */}
              <div className={`flex items-center gap-1 rounded-full px-2 sm:px-2.5 py-1 text-xs font-bold text-red-500 cursor-default transition-all duration-300 hover:scale-105 ${userHearts <= 2 ? 'bg-red-500/15 animate-pulse' : 'bg-red-500/10'}`} title={`${userHearts} hearts remaining`}>
                <Heart className="size-3.5 fill-red-500" aria-hidden="true" />
                <span>{userHearts}</span>
              </div>
              {/* Level with orbit ring for high levels — hidden below md */}
              <div className="hidden md:flex items-center gap-1 rounded-full bg-level/10 px-2.5 py-1 text-xs font-bold text-level transition-all duration-300 cursor-default hover:scale-105 hover:bg-level/15 hover:shadow-md hover:shadow-level/20" title={`Level ${userLevel}`}>
                <span aria-hidden="true">⭐</span>
                <span>Lv.{userLevel}</span>
              </div>
            </div>
          )}
          <SoundToggle />
          <ThemeToggle />
          <form action={handleSignOut}>
            <Button
              variant="ghost"
              size="sm"
              aria-label="Sign out"
              type="submit"
              className="rounded-lg text-muted-foreground hover:text-foreground size-9 md:size-auto px-3 md:px-2.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </form>
          <Avatar className="size-9 border-2 border-primary/20 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      
      {/* Mobile stats bar - shows key stats on mobile */}
      {user?.id && (
        <div className="md:hidden border-t border-border/40 px-4 py-2 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold text-streak transition-all duration-300 ${currentStreak > 7 ? 'bg-streak/20' : 'bg-streak/10'}`}>
              <span className={currentStreak > 7 ? 'animate-bounce' : ''} aria-hidden="true">🔥</span>
              <span>{currentStreak}</span>
              <span className="font-medium opacity-60">streak</span>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-xp/10 px-2.5 py-1 text-xs font-bold text-xp">
              <span aria-hidden="true">⚡</span>
              <span>{userXp.toLocaleString()}</span>
              <span className="font-medium opacity-60">XP</span>
            </div>
            <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold text-red-500 ${userHearts <= 2 ? 'bg-red-500/15 animate-pulse' : 'bg-red-500/10'}`}>
              <Heart className="size-3.5 fill-red-500" aria-hidden="true" />
              <span>{userHearts}</span>
              <span className="font-medium opacity-60">hearts</span>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-level/10 px-2.5 py-1 text-xs font-bold text-level">
              <span aria-hidden="true">⭐</span>
              <span>Lv.{userLevel}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
