import "server-only";

import { unstable_cache } from "next/cache";

import { prisma } from "@/lib/db";

export type LayoutUserData = {
  xp: number;
  level: number;
  hearts: number;
  currentStreak: number;
};

/**
 * Header/sidebar stats every (main) page needs. Cached per user for 30s so
 * navigation doesn't re-hit the DB for the shell; revalidated by the same
 * mutation paths that bust the dashboard cache.
 */
export function getLayoutUserDataCached(userId: string): Promise<LayoutUserData> {
  return unstable_cache(
    async (id: string): Promise<LayoutUserData> => {
      const [user, streak] = await Promise.all([
        prisma.user.findUnique({
          where: { id },
          select: { xp: true, level: true, hearts: true },
        }),
        prisma.streak.findUnique({
          where: { userId: id },
          select: { currentStreak: true },
        }),
      ]);

      return {
        xp: user?.xp ?? 0,
        level: user?.level ?? 1,
        hearts: user?.hearts ?? 5,
        currentStreak: streak?.currentStreak ?? 0,
      };
    },
    ["layout", userId],
    { tags: [`layout:${userId}`], revalidate: 30 },
  )(userId);
}