import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { checkRateLimit } from "@/lib/ai/rate-limiter";
import {
  gradeInterviewAnswer,
  startInterviewQuestion,
  summarizeInterview,
} from "@/lib/ai/generator";

const bodySchema = z.object({
  sessionId: z.string().min(1, "sessionId is required"),
  userAnswer: z
    .string()
    .min(1, "Answer cannot be empty")
    .max(4000, "Answer too long"),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const rateLimit = checkRateLimit(`interview:${session.user.id}`, 15, 60_000);
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down.", reset: rateLimit.reset },
      { status: 429 },
    );
  }

  const interview = await prisma.interviewSession.findFirst({
    where: {
      id: parsed.data.sessionId,
      userId: session.user.id,
      status: "active",
    },
    include: {
      career: { select: { title: true, slug: true } },
      answers: {
        select: {
          questionText: true,
          userAnswer: true,
          score: true,
        },
      },
    },
  });

  if (!interview) {
    return NextResponse.json(
      { error: "Active interview session not found" },
      { status: 404 },
    );
  }

  const round = interview.currentRound + 1;
  if (round > interview.totalRounds) {
    return NextResponse.json(
      { error: "Interview already completed" },
      { status: 400 },
    );
  }

  const questionText = interview.currentQuestion;
  if (!questionText) {
    return NextResponse.json(
      { error: "No active question for this session" },
      { status: 400 },
    );
  }

  const { userAnswer } = parsed.data;

  const grade = await gradeInterviewAnswer({
    careerTitle: interview.career.title,
    round,
    totalRounds: interview.totalRounds,
    questionText,
    userAnswer,
  });

  const isComplete = round >= interview.totalRounds;

  if (isComplete) {
    const allAnswers = [
      ...interview.answers,
      { questionText, userAnswer, score: grade.score },
    ];

    const summary = await summarizeInterview({
      careerTitle: interview.career.title,
      answers: allAnswers.map((a) => ({
        questionText: a.questionText,
        userAnswer: a.userAnswer,
        score: a.score,
      })),
    });

    await prisma.$transaction([
      prisma.interviewAnswer.create({
        data: {
          sessionId: interview.id,
          round,
          questionText,
          userAnswer,
          score: grade.score,
          feedback: grade.feedback,
          tips: grade.tips ?? null,
        },
      }),
      prisma.interviewSession.update({
        where: { id: interview.id },
        data: {
          status: "completed",
          completedAt: new Date(),
          currentRound: round,
          currentQuestion: null,
        },
      }),
    ]);

    return NextResponse.json({
      sessionId: interview.id,
      isComplete: true,
      round,
      totalRounds: interview.totalRounds,
      answered: {
        score: grade.score,
        feedback: grade.feedback,
        tips: grade.tips ?? null,
        idealAnswer: grade.idealAnswer ?? null,
      },
      summary,
    });
  }

  // Build next question: prefer the AI's follow-up if it provided one,
  // otherwise generate a fresh question for the next round.
  let nextQuestion = grade.followUpQuestion?.trim() ?? "";
  if (!nextQuestion) {
    const freshQuestion = await startInterviewQuestion({
      careerTitle: interview.career.title,
      skillNames: [],
    });
    nextQuestion = freshQuestion.question;
  }

  await prisma.$transaction([
    prisma.interviewAnswer.create({
      data: {
        sessionId: interview.id,
        round,
        questionText,
        userAnswer,
        score: grade.score,
        feedback: grade.feedback,
        tips: grade.tips ?? null,
      },
    }),
    prisma.interviewSession.update({
      where: { id: interview.id },
      data: {
        currentRound: round,
        currentQuestion: nextQuestion,
      },
    }),
  ]);

    return NextResponse.json({
      sessionId: interview.id,
      isComplete: false,
      round,
      totalRounds: interview.totalRounds,
      answered: {
        score: grade.score,
        feedback: grade.feedback,
        tips: grade.tips ?? null,
        idealAnswer: grade.idealAnswer ?? null,
      },
      nextQuestion,
    });
  } catch (error) {
    console.error("[Interview Answer API Error]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to evaluate answer" },
      { status: 500 },
    );
  }
}