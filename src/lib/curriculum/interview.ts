import "server-only";

import { prisma } from "@/lib/db";

export type InterviewCareer = {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  questionCount: number;
  skillCount: number;
  skillNames: string[];
};

/**
 * Every career with prep statistics derived from the curriculum: how many
 * questions exist for the role and which skills the interview should touch.
 */
export async function getInterviewCareers(): Promise<InterviewCareer[]> {
  const careers = await prisma.career.findMany({
    orderBy: { order: "asc" },
    include: {
      paths: {
        include: {
          modules: {
            include: {
              units: {
                include: {
                  lessons: {
                    include: {
                      skills: true,
                      questions: { select: { type: true } },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return careers.map((career) => {
    const lessons = career.paths.flatMap((path) =>
      path.modules.flatMap((module) =>
        module.units.flatMap((unit) => unit.lessons),
      ),
    );
    const skillNames = [
      ...new Set(
        lessons.flatMap((lesson) => lesson.skills.map((s) => s.name)),
      ),
    ];
    const questionCount = lessons.reduce(
      (sum, lesson) => sum + lesson.questions.length,
      0,
    );

    return {
      id: career.id,
      title: career.title,
      description: career.description,
      slug: career.slug,
      questionCount,
      skillCount: skillNames.length,
      skillNames,
    };
  });
}

export type InterviewCareerContext = {
  id: string;
  title: string;
  slug: string;
  skillNames: string[];
};

/**
 * Resolve a single career plus its distinct skill names, used to keep AI
 * interview questions on-topic for the selected role.
 */
export async function getInterviewCareer(
  slug: string,
): Promise<InterviewCareerContext | null> {
  const career = await prisma.career.findUnique({
    where: { slug },
    include: {
      paths: {
        include: {
          modules: {
            include: {
              units: {
                include: {
                  lessons: { include: { skills: true } },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!career) return null;

  const skillNames = [
    ...new Set(
      career.paths.flatMap((path) =>
        path.modules.flatMap((module) =>
          module.units.flatMap((unit) =>
            unit.lessons.flatMap((lesson) =>
              lesson.skills.map((s) => s.name),
            ),
          ),
        ),
      ),
    ),
  ];

  return {
    id: career.id,
    title: career.title,
    slug: career.slug,
    skillNames,
  };
}

export type InterviewFlashcard = {
  id: string;
  front: string;
  back: string;
  skillName: string | null;
  type: string;
};

/**
 * Build a reviewer deck from the career's curriculum questions. The front is
 * the question itself; the back reveals the correct answer plus explanation,
 * so every card doubles as concept + answer drill.
 */
export async function getInterviewFlashcards(
  careerSlug: string,
  limit = 40,
): Promise<InterviewFlashcard[]> {
  const questions = await prisma.question.findMany({
    where: {
      lesson: { unit: { module: { path: { career: { slug: careerSlug } } } } },
      type: { notIn: ["scenario", "flip_cards"] },
      source: "curriculum",
    },
    select: {
      id: true,
      type: true,
      question: true,
      options: true,
      correctAnswer: true,
      explanation: true,
      skill: { select: { name: true } },
    },
    take: 500,
  });

  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }

  return questions.slice(0, limit).map((q) => ({
    id: q.id,
    front: q.question,
    back: `${summarizeCorrectAnswer(q)}\n\n${q.explanation}`,
    skillName: q.skill?.name ?? null,
    type: q.type,
  }));
}

function summarizeCorrectAnswer(q: {
  type: string;
  options: unknown;
  correctAnswer: string;
}): string {
  if (q.type === "true_false") {
    return q.correctAnswer.trim().toLowerCase() === "true" ? "True" : "False";
  }
  if (q.type === "mcq") {
    const options = (Array.isArray(q.options) ? q.options : []) as string[];
    const match = options.find((opt) => opt.trim() === q.correctAnswer.trim());
    if (match) return match;
  }
  return q.correctAnswer;
}

export type InterviewHistorySession = {
  id: string;
  careerTitle: string;
  careerSlug: string;
  rounds: number;
  averageScore: number;
  completedAt: Date | null;
  createdAt: Date;
};

export async function getInterviewHistory(
  userId: string,
  limit = 5,
): Promise<InterviewHistorySession[]> {
  const sessions = await prisma.interviewSession.findMany({
    where: { userId, status: "completed" },
    orderBy: { completedAt: "desc" },
    take: limit,
    include: {
      career: { select: { title: true, slug: true } },
      answers: { select: { score: true } },
    },
  });

  return sessions.map((session) => ({
    id: session.id,
    careerTitle: session.career.title,
    careerSlug: session.career.slug,
    rounds: session.answers.length,
    averageScore:
      session.answers.length > 0
        ? Math.round(
            session.answers.reduce((sum, a) => sum + a.score, 0) /
              session.answers.length,
          )
        : 0,
    completedAt: session.completedAt,
    createdAt: session.createdAt,
  }));
}