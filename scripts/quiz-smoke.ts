import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

import { parseQuestionDifficulty, splitAcceptedAnswers, validateAcceptedAnswer } from "../src/lib/quiz/validation";
import { selectQuestionRun } from "../src/lib/quiz/selection";
import { questionXp, summarizeLessonAttempts } from "../src/lib/lesson/scoring";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

function fail(message: string): never {
  throw new Error(`SMOKE FAIL: ${message}`);
}

async function main(): Promise<void> {
  const user = await prisma.user.findUnique({ where: { email: "test@rithudevquest.dev" } });
  if (!user) fail("test user not found (run seed first)");

  await prisma.userProgress.deleteMany({ where: { userId: user.id } });
  await prisma.questionAttempt.deleteMany({ where: { userId: user.id } });
  await prisma.lessonAttempt.deleteMany({ where: { userId: user.id } });
  await prisma.user.update({ where: { id: user.id }, data: { xp: 0 } });

  const lesson = await prisma.lesson.findFirst({
    where: {
      slug: "what-is-a-shell",
      unit: { module: { slug: "shell-basics", path: { slug: "linux" } } },
    },
    include: { questions: { orderBy: { difficulty: "asc" } } },
  });
  if (!lesson) fail("what-is-a-shell lesson not found");
  const uid = user.id;
  const lid = lesson.id;

  const bank = lesson.questions;
  const selected = selectQuestionRun(
    bank.map((q) => ({
      id: q.id,
      type: q.type as Parameters<typeof selectQuestionRun>[0][number]["type"],
      difficulty: parseQuestionDifficulty(q.difficulty),
    })),
    { avoidIds: [] },
  );
  if (selected.length !== 5) fail(`expected 5 selected questions, got ${selected.length}`);
  if (new Set(selected.map((q) => q.id)).size !== 5) fail("selection repeated a question");
  for (const question of selected) {
    if (!bank.some((b) => b.id === question.id)) fail("selection picked a question outside the bank");
  }
  console.log(`Selection: ${selected.map((q) => `${q.id}:${q.type}:${q.difficulty}`).join(", ")}`);

  const part = (questionId: string): { prompt: string; correctAnswer: string }[] =>
    JSON.parse(
      JSON.stringify(
        bank.find((b) => b.id === questionId)!.parts ?? null,
      ),
    ) ?? [];

  async function openAttempt(): Promise<{ id: string }> {
    const existing = await prisma.lessonAttempt.findFirst({
      where: { userId: uid, lessonId: lid, completed: false },
      orderBy: { startedAt: "desc" },
      select: { id: true },
    });
    if (existing) return existing;
    return prisma.lessonAttempt.create({
      data: { userId: uid, lessonId: lid, score: 0, xpEarned: 0 },
      select: { id: true },
    });
  }

  async function submit(questionId: string, answer: string, partIndex: number | null) {
    const attempt = await openAttempt();
    const attemptNumber =
      (await prisma.questionAttempt.count({
        where: { lessonAttemptId: attempt.id, questionId, partIndex: partIndex ?? undefined },
      })) + 1;
    const isCorrect = validateAcceptedAnswer(
      partIndex === null
        ? bank.find((b) => b.id === questionId)!.correctAnswer
        : part(questionId)[partIndex]!.correctAnswer,
      answer,
    );
    await prisma.questionAttempt.create({
      data: {
        userId: uid,
        questionId,
        lessonAttemptId: attempt.id,
        isCorrect,
        userAnswer: answer,
        attemptNumber,
        partIndex,
        xpEarned: 0,
      },
    });

    let earnedXp = 0;
    if (isCorrect) {
      const difficulty = parseQuestionDifficulty(bank.find((b) => b.id === questionId)!.difficulty);
      if (partIndex === null) {
        earnedXp = questionXp({ isCorrect: true, attemptNumber, difficulty });
      } else {
        const parts = part(questionId);
        const correct = await prisma.questionAttempt.findMany({
          where: { lessonAttemptId: attempt.id, questionId, isCorrect: true, partIndex: { not: null } },
          orderBy: { attemptNumber: "asc" },
          select: { partIndex: true, attemptNumber: true },
        });
        const best = new Map<number, number>();
        for (const row of correct) {
          if (row.partIndex === null) continue;
          if (!best.has(row.partIndex)) best.set(row.partIndex, row.attemptNumber);
        }
        let complete = true;
        for (let i = 0; i < parts.length; i++) if (!best.has(i)) complete = false;
        if (complete) {
          earnedXp = questionXp({ isCorrect: true, attemptNumber: Math.max(...best.values()), difficulty });
        }
      }
    }
    if (earnedXp > 0) {
      await prisma.lessonAttempt.update({ where: { id: attempt.id }, data: { xpEarned: { increment: earnedXp } } });
    }
    return { attemptNumber, isCorrect, earnedXp };
  }

  const expectedXp: Record<string, number> = {};
  let correctFirstTryExpected = 0;

  for (const question of selected) {
    const row = bank.find((b) => b.id === question.id)!;
    const difficulty = parseQuestionDifficulty(row.difficulty);
    if (row.type === "scenario") {
      const parts = part(question.id);
      // Parts 0 and 1 answered correctly on the first try…
      const first = await submit(question.id, parts[0]!.correctAnswer, 0);
      if (first.earnedXp !== 0) fail("scenario awarded XP before all parts were solved");
      const second = await submit(question.id, parts[1]!.correctAnswer, 1);
      if (second.earnedXp !== 0) fail("scenario awarded XP before all parts were solved");
      // …part 2 answered wrong first, then correctly on the second try.
      await submit(question.id, "totally wrong", 2);
      const last = await submit(question.id, parts[2]!.correctAnswer, 2);
      if (last.attemptNumber !== 2) fail(`expected 2nd attempt on part 2, got ${last.attemptNumber}`);
      const effective = 2; // worst part's best attempt (1, 1, 2)
      const xp = questionXp({ isCorrect: true, attemptNumber: effective, difficulty });
      if (last.earnedXp !== xp) fail(`scenario XP mismatch: got ${last.earnedXp}, want ${xp}`);
      expectedXp[question.id] = xp;
      // scenario solved on a retry → not first-try
    } else {
      const isRetry = question.type === "mcq" || question.type === "true_false";
      if (isRetry) {
        // prove per-question attempt counting with a wrong-then-correct retry
        await submit(question.id, "definitely wrong", null);
        const result = await submit(question.id, row.correctAnswer, null);
        if (result.attemptNumber !== 2) fail("retry did not count attempt number");
        expectedXp[question.id] = questionXp({ isCorrect: true, attemptNumber: 2, difficulty });
      } else {
        const result = await submit(
          question.id,
          splitAcceptedAnswers(row.correctAnswer)[0]!,
          null,
        );
        console.log(`DEBUG single ${row.type} id=${question.id} attempt=${result.attemptNumber} correct=${result.isCorrect} xp=${result.earnedXp}`);
        if (result.attemptNumber !== 1) fail("first-try answer had wrong attempt number");
        if (result.earnedXp !== questionXp({ isCorrect: true, attemptNumber: 1, difficulty })) {
          fail(`single-part XP mismatch got ${result.earnedXp} want ${questionXp({ isCorrect: true, attemptNumber: 1, difficulty })}`);
        }
        expectedXp[question.id] = questionXp({ isCorrect: true, attemptNumber: 1, difficulty });
        correctFirstTryExpected += 1;
      }
    }
  }

  // Complete like completeLesson: summarize over the asked questionIds.
  const records = await prisma.questionAttempt.findMany({
    where: { lessonAttemptId: (await openAttempt()).id },
    select: {
      questionId: true,
      isCorrect: true,
      attemptNumber: true,
      partIndex: true,
      question: { select: { difficulty: true } },
    },
  });
  const askedIds = selected.map((q) => q.id);
  const summary = summarizeLessonAttempts(
    records
      .filter((r) => askedIds.includes(r.questionId))
      .map((r) => ({
        questionId: r.questionId,
        isCorrect: r.isCorrect,
        attemptNumber: r.attemptNumber,
        partIndex: r.partIndex,
        difficulty: parseQuestionDifficulty(r.question.difficulty),
      })),
    askedIds.length,
  );

  const expectedBonus = selected.reduce((sum, q) => sum + (expectedXp[q.id] ?? 0), 0);
  if (summary.xpEarned !== 20 + expectedBonus) {
    fail(`completion XP mismatch: got ${summary.xpEarned}, want ${20 + expectedBonus}`);
  }
  if (summary.correctFirstTry !== correctFirstTryExpected) {
    fail(`correctFirstTry mismatch: got ${summary.correctFirstTry}, want ${correctFirstTryExpected}`);
  }

  await prisma.$transaction([
    prisma.lessonAttempt.update({
      where: { id: (await openAttempt()).id },
      data: { completed: true, score: summary.score, xpEarned: summary.xpEarned, completedAt: new Date() },
    }),
    prisma.userProgress.upsert({
      where: { userId_lessonId: { userId: uid, lessonId: lesson.id } },
      create: { userId: uid, lessonId: lesson.id, completed: true, score: summary.score },
      update: { completed: true, score: summary.score, lastAccessed: new Date() },
    }),
    prisma.user.update({ where: { id: user.id }, data: { xp: { increment: summary.xpEarned } } }),
  ]);

  const after = await prisma.user.findUnique({ where: { id: user.id }, select: { xp: true } });
  if (after!.xp !== summary.xpEarned) fail(`user xp mismatch: got ${after!.xp}, want ${summary.xpEarned}`);

  const progress = await prisma.userProgress.findUnique({
    where: { userId_lessonId: { userId: uid, lessonId: lesson.id } },
  });
  if (!progress?.completed) fail("user progress not marked complete");

  const attempt = (await prisma.lessonAttempt.findFirst({
    where: { userId: uid, lessonId: lesson.id, completed: true },
    orderBy: { completedAt: "desc" },
  }))!;
  if (attempt.score !== summary.score || attempt.xpEarned !== summary.xpEarned) fail("attempt totals mismatch");

  // Foreign questions are rejected by completeLesson's bank filter.
  const foreign = await prisma.question.findFirst({
    where: { lesson: { unit: { module: { slug: { not: "shell-basics" } } } } },
    select: { id: true },
  });
  if (foreign && askedIds.includes(foreign.id)) fail("foreign question ended up in the run");

  console.log(`COMPLETED: score=${summary.score} xp=${summary.xpEarned} correctFirstTry=${summary.correctFirstTry}/${askedIds.length}`);
  console.log(`Readiness question (foreign, rejected): ${foreign?.id ?? "none"}`);

  await prisma.userProgress.deleteMany({ where: { userId: user.id } });
  await prisma.questionAttempt.deleteMany({ where: { userId: user.id } });
  await prisma.lessonAttempt.deleteMany({ where: { userId: user.id } });
  await prisma.user.update({ where: { id: user.id }, data: { xp: 0 } });
  const reset = await prisma.user.findUnique({ where: { id: user.id }, select: { xp: true } });
  if (reset!.xp !== 0) fail("reset left stray XP");
  console.log("State reset: test user has no progress and 0 XP");
}

main()
  .then(() => {
    console.log("SMOKE PASS");
  })
  .catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exitCode = 1;
  });