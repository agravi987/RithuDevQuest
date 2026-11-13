import { describe, expect, it } from "vitest";
import {
  buildPracticeTopicTree,
  type SkillTreeRow,
} from "@/lib/practice/queries";

/* Test fixture builder — mirrors the Prisma select shape. */
function row(
  overrides: Partial<SkillTreeRow> & {
    id: string;
    name: string;
    questionCount?: number;
    moduleId: string;
    moduleTitle: string;
    moduleOrder: number;
    pathId: string;
    pathTitle: string;
    pathOrder: number;
    careerId: string;
    careerTitle: string;
    careerSlug: string;
    careerOrder: number;
    orphan?: boolean;
  },
): SkillTreeRow {
  const {
    questionCount = 5,
    orphan = false,
    ...rest
  } = overrides;
  return {
    _count: { questions: questionCount },
    lesson: orphan
      ? null
      : {
          unit: {
            module: {
              id: overrides.moduleId,
              title: overrides.moduleTitle,
              order: overrides.moduleOrder,
              path: {
                id: overrides.pathId,
                title: overrides.pathTitle,
                order: overrides.pathOrder,
                career: {
                  id: overrides.careerId,
                  title: overrides.careerTitle,
                  slug: overrides.careerSlug,
                  order: overrides.careerOrder,
                },
              },
            },
          },
        },
    ...rest,
  } as SkillTreeRow;
}

const DEVOPS = {
  moduleId: "mod-linux",
  moduleTitle: "Linux Fundamentals",
  moduleOrder: 0,
  pathId: "path-devops-core",
  pathTitle: "DevOps Core",
  pathOrder: 0,
  careerId: "career-devops",
  careerTitle: "DevOps Engineering",
  careerSlug: "devops",
  careerOrder: 0,
};

const WEBDEV = {
  moduleId: "mod-react",
  moduleTitle: "React",
  moduleOrder: 0,
  pathId: "path-frontend",
  pathTitle: "Frontend",
  pathOrder: 0,
  careerId: "career-web",
  careerTitle: "Web Development",
  careerSlug: "web-dev",
  careerOrder: 1,
};

describe("buildPracticeTopicTree", () => {
  it("returns an empty tree for no skills", () => {
    const tree = buildPracticeTopicTree([], 0);
    expect(tree.careers).toEqual([]);
    expect(tree.general).toBeNull();
    expect(tree.totalCount).toBe(0);
  });

  it("groups skills under career → path → module", () => {
    const tree = buildPracticeTopicTree(
      [
        row({ id: "s1", name: "git-init", ...DEVOPS }),
        row({ id: "s2", name: "filesystem-navigation", ...DEVOPS }),
        row({ id: "s3", name: "props", ...WEBDEV }),
      ],
      0,
    );

    expect(tree.careers).toHaveLength(2);
    expect(tree.careers[0]!.name).toBe("DevOps Engineering");
    expect(tree.careers[0]!.slug).toBe("devops");

    const devops = tree.careers[0]!;
    expect(devops.paths).toHaveLength(1);
    expect(devops.paths[0]!.name).toBe("DevOps Core");
    expect(devops.paths[0]!.modules).toHaveLength(1);
    expect(devops.paths[0]!.modules[0]!.name).toBe("Linux Fundamentals");
    expect(
      devops.paths[0]!.modules[0]!.skills.map((s) => s.name),
    ).toEqual(["git-init", "filesystem-navigation"]);

    expect(tree.totalCount).toBe(15);
  });

  it("sorts careers by order, paths by order, modules by order", () => {
    const tree = buildPracticeTopicTree(
      [
        row({
          id: "s-web",
          name: "web-skill",
          moduleId: "m2",
          moduleTitle: "M2",
          moduleOrder: 1,
          pathId: "p2",
          pathTitle: "P2",
          pathOrder: 1,
          careerId: "career-web",
          careerTitle: "Web Dev",
          careerSlug: "web-dev",
          careerOrder: 2,
        }),
        row({
          id: "s-ops",
          name: "ops-skill",
          moduleId: "m1",
          moduleTitle: "M1",
          moduleOrder: 0,
          pathId: "p1",
          pathTitle: "P1",
          pathOrder: 0,
          careerId: "career-ops",
          careerTitle: "DevOps",
          careerSlug: "devops",
          careerOrder: 1,
        }),
      ],
      0,
    );

    expect(tree.careers.map((c) => c.name)).toEqual(["DevOps", "Web Dev"]);
  });

  it("sorts skills within a module by question count descending", () => {
    const tree = buildPracticeTopicTree(
      [
        row({ id: "s-few", name: "few", questionCount: 2, ...DEVOPS }),
        row({ id: "s-many", name: "many", questionCount: 9, ...DEVOPS }),
        row({ id: "s-mid", name: "mid", questionCount: 5, ...DEVOPS }),
      ],
      0,
    );

    const skills = tree.careers[0]!.paths[0]!.modules[0]!.skills;
    expect(skills.map((s) => s.name)).toEqual(["many", "mid", "few"]);
  });

  it("groups skills from different lessons under their shared module", () => {
    const tree = buildPracticeTopicTree(
      [
        row({ ...DEVOPS, id: "s1", name: "git-init", moduleId: "mod-a", moduleTitle: "Module A" }),
        row({ ...DEVOPS, id: "s2", name: "git-branch", moduleId: "mod-a", moduleTitle: "Module A" }),
      ],
      0,
    );

    const mod = tree.careers[0]!.paths[0]!.modules[0]!;
    expect(mod.name).toBe("Module A");
    expect(mod.skills.map((s) => s.name).sort()).toEqual(["git-branch", "git-init"]);
  });

  it("excludes skills with zero questions", () => {
    const tree = buildPracticeTopicTree(
      [row({ id: "s-empty", name: "empty", questionCount: 0, ...DEVOPS })],
      0,
    );
    expect(tree.careers).toEqual([]);
  });

  it("skips skills without a lesson ancestry", () => {
    const tree = buildPracticeTopicTree(
      [row({ id: "s-orphan", name: "orphan", orphan: true, ...DEVOPS })],
      0,
    );
    expect(tree.careers).toEqual([]);
  });

  it("exposes General pool only when unskilled questions exist", () => {
    const withGeneral = buildPracticeTopicTree([], 7);
    expect(withGeneral.general).toEqual({
      id: "general",
      name: "General",
      count: 7,
    });

    const withoutGeneral = buildPracticeTopicTree(
      [row({ id: "s1", name: "git-init", ...DEVOPS })],
      0,
    );
    expect(withoutGeneral.general).toBeNull();
  });

  it("computes questionCount roll-ups per path and career", () => {
    const tree = buildPracticeTopicTree(
      [
        row({ id: "s1", name: "a", questionCount: 3, ...DEVOPS }),
        row({ id: "s2", name: "b", questionCount: 4, ...WEBDEV }),
      ],
      0,
    );

    expect(tree.careers[0]!.questionCount).toBe(3);
    expect(tree.careers[0]!.paths[0]!.questionCount).toBe(3);
    expect(tree.careers[1]!.questionCount).toBe(4);
    expect(tree.totalCount).toBe(7);
  });
});
