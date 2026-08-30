import "server-only";

import { prisma } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";

export type CareerWithPaths = Prisma.CareerGetPayload<{
  include: {
    paths: {
      include: {
        modules: {
          include: {
            units: {
              include: {
                lessons: {
                  include: { skills: true };
                };
              };
            };
          };
        };
      };
    };
  };
}>;

export type PathWithModules = Prisma.LearningPathGetPayload<{
  include: {
    modules: {
      include: {
        units: {
          include: {
            lessons: {
              include: { skills: true };
            };
          };
        };
      };
    };
  };
}>;

export type ModuleWithUnits = Prisma.ModuleGetPayload<{
  include: {
    path: true;
    units: {
      include: {
        lessons: {
          include: { skills: true };
        };
      };
    };
  };
}>;

export type UnitWithLessons = Prisma.UnitGetPayload<{
  include: {
    lessons: {
      include: { skills: true };
    };
  };
}>;

export type LessonWithActivities = Prisma.LessonGetPayload<{
  include: {
    activities: true;
    skills: true;
  };
}>;

export async function getCareerBySlug(
  slug: string,
): Promise<CareerWithPaths | null> {
  return prisma.career.findUnique({
    where: { slug },
    include: {
      paths: {
        orderBy: { order: "asc" },
        include: {
          modules: {
            orderBy: { order: "asc" },
            include: {
              units: {
                orderBy: { order: "asc" },
                include: {
                  lessons: {
                    orderBy: { order: "asc" },
                    include: { skills: true },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
}

export async function getAllCareers(): Promise<
  Prisma.CareerGetPayload<{ include: { paths: true } }>[]
> {
  return prisma.career.findMany({
    orderBy: { order: "asc" },
    include: { paths: { orderBy: { order: "asc" } } },
  });
}

export async function getPathBySlug(
  careerSlug: string,
  slug: string,
): Promise<PathWithModules | null> {
  return prisma.learningPath.findFirst({
    where: { career: { slug: careerSlug }, slug },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          units: {
            orderBy: { order: "asc" },
            include: {
              lessons: {
                orderBy: { order: "asc" },
                include: { skills: true },
              },
            },
          },
        },
      },
    },
  });
}

export async function getPathBySlugAcrossCareers(
  slug: string,
): Promise<PathWithModules | null> {
  return prisma.learningPath.findFirst({
    where: { slug },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          units: {
            orderBy: { order: "asc" },
            include: {
              lessons: {
                orderBy: { order: "asc" },
                include: { skills: true },
              },
            },
          },
        },
      },
    },
  });
}

export async function getModuleBySlug(
  pathSlug: string,
  slug: string,
): Promise<ModuleWithUnits | null> {
  return prisma.module.findFirst({
    where: { path: { slug: pathSlug }, slug },
    include: {
      path: true,
      units: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
            include: { skills: true },
          },
        },
      },
    },
  });
}

export async function getUnitBySlug(
  moduleSlug: string,
  slug: string,
): Promise<UnitWithLessons | null> {
  return prisma.unit.findFirst({
    where: { module: { slug: moduleSlug }, slug },
    include: {
      lessons: {
        orderBy: { order: "asc" },
        include: { skills: true },
      },
    },
  });
}

export async function getLessonWithActivities(
  pathSlug: string,
  moduleSlug: string,
  lessonSlug: string,
): Promise<LessonWithActivities | null> {
  return prisma.lesson.findFirst({
    where: {
      unit: {
        module: {
          path: { slug: pathSlug },
          slug: moduleSlug,
        },
      },
      slug: lessonSlug,
    },
    include: {
      activities: { orderBy: { order: "asc" } },
      skills: true,
    },
  });
}

export type LessonQuestions = Prisma.QuestionGetPayload<{
  select: {
    id: true;
    type: true;
    difficulty: true;
    question: true;
    options: true;
    parts: true;
    correctAnswer: true;
    explanation: true;
    hint: true;
  };
}>[];

export type LessonQuestion = LessonQuestions[number];

export async function getLessonQuestions(
  lessonId: string,
): Promise<LessonQuestion[]> {
  return prisma.question.findMany({
    where: { lessonId },
    select: {
      id: true,
      type: true,
      difficulty: true,
      question: true,
      options: true,
      parts: true,
      correctAnswer: true,
      explanation: true,
      hint: true,
    },
    orderBy: { createdAt: "asc" },
  });
}