export type MasteryTier = "weak" | "developing" | "good" | "mastered";

export type SkillAttemptRecord = {
  isCorrect: boolean;
  attemptNumber: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  answeredAt: Date;
};

export type CalculatedMastery = {
  score: number; // 0-100
  tier: MasteryTier;
  label: string;
  color: string;
  iconName: string;
  totalAttempts: number;
  accuracyPercentage: number;
};

const DIFFICULTY_WEIGHTS = {
  beginner: 0.8,
  intermediate: 1.0,
  advanced: 1.2,
};

export function getMasteryTier(score: number): {
  tier: MasteryTier;
  label: string;
  color: string;
  iconName: string;
} {
  if (score >= 80) {
    return {
      tier: "mastered",
      label: "Mastered",
      color: "emerald",
      iconName: "Star",
    };
  }
  if (score >= 60) {
    return {
      tier: "good",
      label: "Proficient",
      color: "blue",
      iconName: "CheckCircle",
    };
  }
  if (score >= 40) {
    return {
      tier: "developing",
      label: "Developing",
      color: "amber",
      iconName: "Clock",
    };
  }
  return {
    tier: "weak",
    label: "Needs Practice",
    color: "rose",
    iconName: "AlertCircle",
  };
}

/**
 * Calculates skill mastery using a weighted model:
 * - 40% Correctness (accuracy ratio)
 * - 20% Recency (more recent attempts weigh more)
 * - 20% Difficulty (harder questions reward more)
 * - 20% Consistency (first-try solves vs multi-attempt solves)
 */
export function calculateMasteryScore(
  attempts: SkillAttemptRecord[],
  now: Date = new Date(),
): CalculatedMastery {
  if (attempts.length === 0) {
    const tierInfo = getMasteryTier(0);
    return {
      score: 0,
      tier: tierInfo.tier,
      label: tierInfo.label,
      color: tierInfo.color,
      iconName: tierInfo.iconName,
      totalAttempts: 0,
      accuracyPercentage: 0,
    };
  }

  const sorted = [...attempts].sort(
    (a, b) => new Date(b.answeredAt).getTime() - new Date(a.answeredAt).getTime(),
  );

  const total = sorted.length;
  const correctCount = sorted.filter((a) => a.isCorrect).length;
  const accuracyPercentage = Math.round((correctCount / total) * 100);

  // 1. Correctness Score (0-100)
  const correctnessScore = (correctCount / total) * 100;

  // 2. Recency Score (0-100) - Exponential decay based on days since answered
  let weightedRecencySum = 0;
  let recencyWeightSum = 0;
  const nowMs = now.getTime();

  sorted.forEach((attempt, index) => {
    const daysAgo = Math.max(
      0,
      (nowMs - new Date(attempt.answeredAt).getTime()) / (1000 * 60 * 60 * 24),
    );
    // Weight decreases with age and index
    const weight = Math.exp(-0.1 * daysAgo) / (index + 1);
    weightedRecencySum += (attempt.isCorrect ? 100 : 0) * weight;
    recencyWeightSum += weight;
  });

  const recencyScore =
    recencyWeightSum > 0 ? weightedRecencySum / recencyWeightSum : correctnessScore;

  // 3. Difficulty Score (0-100)
  let difficultyEarned = 0;
  let difficultyPossible = 0;
  for (const attempt of sorted) {
    const diffWeight = DIFFICULTY_WEIGHTS[attempt.difficulty] ?? 1.0;
    difficultyPossible += 100 * diffWeight;
    if (attempt.isCorrect) {
      difficultyEarned += 100 * diffWeight;
    }
  }
  const difficultyScore =
    difficultyPossible > 0 ? (difficultyEarned / difficultyPossible) * 100 : correctnessScore;

  // 4. Consistency Score (0-100) - Penalizes high attempt numbers
  let consistencySum = 0;
  for (const attempt of sorted) {
    if (attempt.isCorrect) {
      // 1st try = 100, 2nd try = 60, 3rd try = 30, 4th+ = 10
      if (attempt.attemptNumber <= 1) consistencySum += 100;
      else if (attempt.attemptNumber === 2) consistencySum += 60;
      else if (attempt.attemptNumber === 3) consistencySum += 30;
      else consistencySum += 10;
    } else {
      consistencySum += 0;
    }
  }
  const consistencyScore = consistencySum / total;

  // Weighted total: 40% correctness, 20% recency, 20% difficulty, 20% consistency
  const rawScore =
    correctnessScore * 0.4 +
    recencyScore * 0.2 +
    difficultyScore * 0.2 +
    consistencyScore * 0.2;

  const finalScore = Math.min(100, Math.max(0, Math.round(rawScore)));
  const tierInfo = getMasteryTier(finalScore);

  return {
    score: finalScore,
    tier: tierInfo.tier,
    label: tierInfo.label,
    color: tierInfo.color,
    iconName: tierInfo.iconName,
    totalAttempts: total,
    accuracyPercentage,
  };
}
