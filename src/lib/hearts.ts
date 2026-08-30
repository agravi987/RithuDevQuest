import "server-only";

import { prisma } from "@/lib/db";

const MAX_HEARTS = 5;
const REGEN_INTERVAL_MINUTES = 30;

/**
 * Get the user's current hearts count.
 * Hearts regenerate over time (1 heart every 30 minutes).
 */
export async function getHearts(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { hearts: true, heartsResetAt: true },
  });

  if (!user) return MAX_HEARTS;

  // Calculate regenerated hearts since last reset
  if (user.hearts < MAX_HEARTS && user.heartsResetAt) {
    const now = new Date();
    const elapsed = now.getTime() - user.heartsResetAt.getTime();
    const regenHearts = Math.floor(elapsed / (REGEN_INTERVAL_MINUTES * 60 * 1000));

    if (regenHearts > 0) {
      const newHearts = Math.min(user.hearts + regenHearts, MAX_HEARTS);
      await prisma.user.update({
        where: { id: userId },
        data: {
          hearts: newHearts,
          heartsResetAt: newHearts < MAX_HEARTS ? user.heartsResetAt : null,
        },
      });
      return newHearts;
    }
  }

  return user.hearts;
}

/**
 * Lose a heart when answering incorrectly.
 * Returns the remaining hearts count.
 */
export async function loseHeart(userId: string): Promise<number> {
  const hearts = await getHearts(userId);

  if (hearts <= 0) return 0;

  const newHearts = hearts - 1;
  const now = new Date();

  await prisma.user.update({
    where: { id: userId },
    data: {
      hearts: newHearts,
      // Start regen timer if not already set
      heartsResetAt: newHearts < MAX_HEARTS ? now : null,
    },
  });

  return newHearts;
}

/**
 * Check if user has hearts remaining.
 */
export async function hasHearts(userId: string): Promise<boolean> {
  const hearts = await getHearts(userId);
  return hearts > 0;
}

/**
 * Get hearts info including time until next regen.
 */
export async function getHeartsInfo(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { hearts: true, heartsResetAt: true },
  });

  if (!user) {
    return { hearts: MAX_HEARTS, nextRegen: null, isFull: true, maxHearts: MAX_HEARTS, regenIntervalMinutes: REGEN_INTERVAL_MINUTES };
  }

  let hearts = user.hearts;

  // Calculate regenerated hearts
  if (hearts < MAX_HEARTS && user.heartsResetAt) {
    const now = new Date();
    const elapsed = now.getTime() - user.heartsResetAt.getTime();
    const regenHearts = Math.floor(elapsed / (REGEN_INTERVAL_MINUTES * 60 * 1000));

    if (regenHearts > 0) {
      hearts = Math.min(hearts + regenHearts, MAX_HEARTS);
    }
  }

  // Calculate time until next heart regen
  let nextRegen: Date | null = null;
  if (hearts < MAX_HEARTS && user.heartsResetAt) {
    const lastHeartLost = user.heartsResetAt.getTime();
    const nowMs = Date.now();
    const intervalMs = REGEN_INTERVAL_MINUTES * 60 * 1000;
    const cyclesElapsed = Math.floor((nowMs - lastHeartLost) / intervalMs);
    // Next regen is after (cyclesElapsed + 1) intervals from the last heart lost
    nextRegen = new Date(lastHeartLost + (cyclesElapsed + 1) * intervalMs);
  }

  return {
    hearts,
    nextRegen,
    isFull: hearts >= MAX_HEARTS,
    maxHearts: MAX_HEARTS,
    regenIntervalMinutes: REGEN_INTERVAL_MINUTES,
  };
}
