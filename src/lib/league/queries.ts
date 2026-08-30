import "server-only";

import { prisma } from "@/lib/db";

const LEAGUE_TIERS = [
  { tier: 1, name: "Bronze", emoji: "🥉" },
  { tier: 2, name: "Silver", emoji: "🥈" },
  { tier: 3, name: "Gold", emoji: "🥇" },
  { tier: 4, name: "Platinum", emoji: "💎" },
  { tier: 5, name: "Diamond", emoji: "👑" },
];

const MAX_PER_LEAGUE = 30;
const PROMOTE_COUNT = 10;
const DEMOTE_COUNT = 5;

/**
 * Get or create the current week's league for a user.
 * Returns the user's league with members ranked by XP.
 */
export async function getCurrentLeague(userId: string) {
  const now = new Date();

  // Find the current week's Monday
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
  monday.setHours(0, 0, 0, 0);

  // Find the current week's Sunday
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  // Check if user is already in a league for this week
  const existingMember = await prisma.leagueMember.findFirst({
    where: {
      userId,
      league: {
        startDate: { lte: monday },
        endDate: { gte: sunday },
      },
    },
    include: {
      league: {
        include: {
          members: {
            include: {
              user: {
                select: { id: true, name: true, xp: true, level: true },
              },
            },
            orderBy: { weeklyXp: "desc" },
          },
        },
      },
    },
  });

  if (existingMember) {
    return formatLeague(existingMember.league, userId);
  }

  // Find or create a league for this tier
  const userLevel = await prisma.user.findUnique({
    where: { id: userId },
    select: { level: true },
  });

  const tier = Math.min(Math.ceil((userLevel?.level ?? 1) / 2), 5);
  const tierInfo = LEAGUE_TIERS.find((t) => t.tier === tier) ?? LEAGUE_TIERS[0];

  // Find an existing league with space
  const candidateLeagues = await prisma.league.findMany({
    where: {
      name: tierInfo.name,
      startDate: monday,
      endDate: sunday,
    },
    include: { _count: { select: { members: true } } },
  });

  const existing = candidateLeagues.find((l) => l._count.members < MAX_PER_LEAGUE);
  let leagueId: string;

  if (existing) {
    leagueId = existing.id;
  } else {
    // Create new league if none available
    const newLeague = await prisma.league.create({
      data: {
        name: tierInfo.name,
        tier: tierInfo.tier,
        startDate: monday,
        endDate: sunday,
      },
    });
    leagueId = newLeague.id;
  }

  // Join the league
  await prisma.leagueMember.create({
    data: {
      userId,
      leagueId,
      weeklyXp: 0,
    },
  });

  // Fetch the full league with members
  const fullLeague = await prisma.league.findUnique({
    where: { id: leagueId },
    include: {
      members: {
        include: {
          user: {
            select: { id: true, name: true, xp: true, level: true },
          },
        },
        orderBy: { weeklyXp: "desc" },
      },
    },
  });

  return fullLeague ? formatLeague(fullLeague, userId) : null;
}

/**
 * Update a user's weekly XP when they earn XP.
 */
export async function updateLeagueXp(userId: string, xpEarned: number) {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  // Find the user's current league membership
  const member = await prisma.leagueMember.findFirst({
    where: {
      userId,
      league: {
        startDate: { lte: monday },
        endDate: { gte: sunday },
      },
    },
  });

  if (member) {
    await prisma.leagueMember.update({
      where: { id: member.id },
      data: { weeklyXp: { increment: xpEarned } },
    });
  }
}

/**
 * Get all league tiers for display.
 */
export function getLeagueTiers() {
  return LEAGUE_TIERS;
}

/**
 * Format league data for display.
 */
function formatLeague(
  league: {
    id: string;
    name: string;
    tier: number;
    startDate: Date;
    endDate: Date;
    members: {
      id: string;
      weeklyXp: number;
      user: { id: string; name: string | null; xp: number; level: number };
    }[];
  },
  currentUserId: string
) {
  const tierInfo = LEAGUE_TIERS.find((t) => t.tier === league.tier) ?? LEAGUE_TIERS[0];

  const rankedMembers = league.members
    .sort((a, b) => b.weeklyXp - a.weeklyXp)
    .map((member, index) => ({
      rank: index + 1,
      userId: member.user.id,
      name: member.user.name ?? "Adventurer",
      level: member.user.level,
      weeklyXp: member.weeklyXp,
      isCurrentUser: member.user.id === currentUserId,
      isPromotion: index < PROMOTE_COUNT,
      isDemotion: index >= league.members.length - DEMOTE_COUNT,
    }));

  const currentUser = rankedMembers.find((m) => m.isCurrentUser);

  return {
    leagueId: league.id,
    tier: league.tier,
    tierName: tierInfo.name,
    tierEmoji: tierInfo.emoji,
    startDate: league.startDate,
    endDate: league.endDate,
    members: rankedMembers,
    memberCount: rankedMembers.length,
    promoteCount: PROMOTE_COUNT,
    demoteCount: DEMOTE_COUNT,
    currentUser,
  };
}
