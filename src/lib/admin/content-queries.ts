import "server-only";

import { prisma } from "@/lib/db";

export type CareerNode = {
  id: string;
  title: string;
  slug: string;
  order: number;
  description: string | null;
  paths: number;
};

export type PathNode = {
  id: string;
  title: string;
  slug: string;
  order: number;
  description: string | null;
  careerId: string;
  modules: number;
};

export type ModuleNode = {
  id: string;
  title: string;
  slug: string;
  order: number;
  description: string | null;
  icon: string | null;
  pathId: string;
  units: number;
};

export type UnitNode = {
  id: string;
  title: string;
  slug: string;
  order: number;
  description: string | null;
  moduleId: string;
  lessons: number;
};

export type LessonNode = {
  id: string;
  title: string;
  slug: string;
  order: number;
  estimatedMinutes: number;
  activityCount: number;
  questionCount: number;
};

export async function getCareersForAdmin(): Promise<CareerNode[]> {
  const careers = await prisma.career.findMany({
    orderBy: { order: "asc" },
    select: {
      id: true,
      title: true,
      slug: true,
      order: true,
      description: true,
      _count: { select: { paths: true } },
    },
  });
  return careers.map((c) => ({
    id: c.id,
    title: c.title,
    slug: c.slug,
    order: c.order,
    description: c.description,
    paths: c._count.paths,
  }));
}

export async function getPathsForAdmin(careerId: string): Promise<PathNode[]> {
  const paths = await prisma.learningPath.findMany({
    where: { careerId },
    orderBy: { order: "asc" },
    select: {
      id: true,
      title: true,
      slug: true,
      order: true,
      description: true,
      careerId: true,
      _count: { select: { modules: true } },
    },
  });
  return paths.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    order: p.order,
    description: p.description,
    careerId: p.careerId,
    modules: p._count.modules,
  }));
}

export async function getModulesForAdmin(pathId: string): Promise<ModuleNode[]> {
  const modules = await prisma.module.findMany({
    where: { pathId },
    orderBy: { order: "asc" },
    select: {
      id: true,
      title: true,
      slug: true,
      order: true,
      description: true,
      icon: true,
      pathId: true,
      _count: { select: { units: true } },
    },
  });
  return modules.map((m) => ({
    id: m.id,
    title: m.title,
    slug: m.slug,
    order: m.order,
    description: m.description,
    icon: m.icon,
    pathId: m.pathId,
    units: m._count.units,
  }));
}

export async function getUnitsForAdmin(moduleId: string): Promise<UnitNode[]> {
  const units = await prisma.unit.findMany({
    where: { moduleId },
    orderBy: { order: "asc" },
    select: {
      id: true,
      title: true,
      slug: true,
      order: true,
      description: true,
      moduleId: true,
      _count: { select: { lessons: true } },
    },
  });
  return units.map((u) => ({
    id: u.id,
    title: u.title,
    slug: u.slug,
    order: u.order,
    description: u.description,
    moduleId: u.moduleId,
    lessons: u._count.lessons,
  }));
}

export async function getLessonsForAdmin(unitId: string): Promise<LessonNode[]> {
  const lessons = await prisma.lesson.findMany({
    where: { unitId },
    orderBy: { order: "asc" },
    select: {
      id: true,
      title: true,
      slug: true,
      order: true,
      estimatedMinutes: true,
      _count: { select: { activities: true, questions: true } },
    },
  });
  return lessons.map((l) => ({
    id: l.id,
    title: l.title,
    slug: l.slug,
    order: l.order,
    estimatedMinutes: l.estimatedMinutes,
    activityCount: l._count.activities,
    questionCount: l._count.questions,
  }));
}
