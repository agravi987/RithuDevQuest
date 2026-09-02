import { SidebarProvider } from "@/lib/sidebar-context";
import { LayoutContent } from "@/app/(main)/layout-content";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user;
  const name = user?.name ?? "User";

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
    <SidebarProvider>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-primary-foreground focus:shadow-lg"
      >
        Skip to main content
      </a>
      <LayoutContent
        userName={name}
        userXp={userXp}
        userLevel={userLevel}
        currentStreak={currentStreak}
        userHearts={userHearts}
      >
        {children}
      </LayoutContent>
    </SidebarProvider>
  );
}
