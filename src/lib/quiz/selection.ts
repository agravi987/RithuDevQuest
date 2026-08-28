import type {
  QuestionDifficulty,
  QuestionType,
} from "@/lib/quiz/validation";

export const LESSON_QUESTION_SELECTION_COUNT = 5;

export type SelectableQuestion = {
  id: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
};

export const DIFFICULTY_ORDER: QuestionDifficulty[] = [
  "beginner",
  "intermediate",
  "advanced",
];

function shuffle<T>(items: T[], random: () => number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]!];
  }
  return copy;
}

/**
 * Pick up to `count` items, preferring items not in `avoidIds`
 * (recently asked). Randomization makes runs vary.
 */
export function pickFromPool<T extends { id: string }>(
  pool: T[],
  avoidIds: Set<string>,
  count: number,
  random: () => number,
): T[] {
  const unused = shuffle(
    pool.filter((item) => !avoidIds.has(item.id)),
    random,
  );
  const used = shuffle(
    pool.filter((item) => avoidIds.has(item.id)),
    random,
  );
  return [...unused, ...used].slice(0, count);
}

/**
 * Distribute the run's question count across difficulty tiers so later
 * tiers ramp difficulty while still making use of the whole bank.
 */
function tierTargets<T extends SelectableQuestion>(
  pools: Map<QuestionDifficulty, T[]>,
  count: number,
): Map<QuestionDifficulty, number> {
  const aims = new Map<QuestionDifficulty, number>([
    ["beginner", Math.round(count * 0.4)],
    ["intermediate", Math.round(count * 0.4)],
    ["advanced", Math.round(count * 0.2)],
  ]);
  if (aims.get("advanced") === 0 && (pools.get("advanced")?.length ?? 0) > 0) {
    aims.set("advanced", 1);
  }

  const targets = new Map<QuestionDifficulty, number>();
  for (const difficulty of DIFFICULTY_ORDER) {
    const capacity = pools.get(difficulty)?.length ?? 0;
    targets.set(difficulty, Math.min(aims.get(difficulty) ?? 0, capacity));
  }

  let remaining = count - [...targets.values()].reduce((a, b) => a + b, 0);
  while (remaining > 0) {
    const tier = DIFFICULTY_ORDER.find((difficulty) => {
      const capacity = pools.get(difficulty)?.length ?? 0;
      return (targets.get(difficulty) ?? 0) < capacity;
    });
    if (!tier) break;
    targets.set(tier, (targets.get(tier) ?? 0) + 1);
    remaining -= 1;
  }
  return targets;
}

/**
 * Make sure the selected set touches every question type present in the
 * pool, evicting a duplicated type from the tail when possible.
 */
function ensureTypeCoverage<T extends SelectableQuestion>(
  selected: T[],
  pool: T[],
  avoidIds: Set<string>,
  random: () => number,
): T[] {
  const result = [...selected];
  const typeCounts = new Map<QuestionType, number>();
  for (const item of result) {
    typeCounts.set(item.type, (typeCounts.get(item.type) ?? 0) + 1);
  }

  const poolTypes = new Set(pool.map((item) => item.type));
  for (const type of poolTypes) {
    if ((typeCounts.get(type) ?? 0) > 0) continue;

    const candidate = pickFromPool(
      pool.filter(
        (item) => item.type === type && !result.some((r) => r.id === item.id),
      ),
      avoidIds,
      1,
      random,
    )[0];
    if (!candidate) continue;

    let evict = -1;
    for (let i = result.length - 1; i >= 0; i--) {
      if ((typeCounts.get(result[i]!.type) ?? 0) > 1) {
        evict = i;
        break;
      }
    }
    if (evict === -1) continue;

    typeCounts.set(result[evict]!.type, (typeCounts.get(result[evict]!.type) ?? 0) - 1);
    result[evict] = candidate;
    typeCounts.set(type, 1);
  }
  return result;
}

/**
 * Select an ordered run of questions for a lesson: ramp difficulty from
 * beginner → advanced, prefer questions that were not recently asked, and
 * keep the question types balanced. Randomization makes each run differ.
 *
 * Implementation notes:
 * - `pool` is ordered/deduped caller-side.
 * - `avoidIds` are questions the user answered recently; they are only
 *   used when the bank is too small to fill the run without them.
 */
export function selectQuestionRun<T extends SelectableQuestion>(
  pool: T[],
  options: { avoidIds?: string[]; count?: number; random?: () => number } = {},
): T[] {
  const random = options.random ?? Math.random;
  const count = Math.min(
    options.count ?? LESSON_QUESTION_SELECTION_COUNT,
    pool.length,
  );
  if (count <= 0 || pool.length === 0) return [];

  const avoidIds = new Set(options.avoidIds ?? []);
  const pools = new Map<QuestionDifficulty, T[]>();
  for (const difficulty of DIFFICULTY_ORDER) {
    pools.set(
      difficulty,
      pool.filter((question) => question.difficulty === difficulty),
    );
  }

  const targets = tierTargets(pools, count);
  const picked: T[] = [];
  for (const difficulty of DIFFICULTY_ORDER) {
    const want = targets.get(difficulty) ?? 0;
    if (want <= 0) continue;
    picked.push(...pickFromPool(pools.get(difficulty) ?? [], avoidIds, want, random));
  }

  if (picked.length < count) {
    const remaining = pool.filter(
      (question) => !picked.some((item) => item.id === question.id),
    );
    picked.push(...pickFromPool(remaining, avoidIds, count - picked.length, random));
  }

  return ensureTypeCoverage(picked, pool, avoidIds, random);
}