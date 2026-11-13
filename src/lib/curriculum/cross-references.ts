import "server-only";

import { allCareers } from "@content/curriculum/index";

export type PathCrossReference = {
  careerSlug: string;
  careerTitle: string;
  pathSlug: string;
  pathTitle: string;
  note?: string;
};

type CareerPathPair = {
  careerSlug: string;
  careerTitle: string;
  pathSlug: string;
  pathTitle: string;
};

const pathIndex: CareerPathPair[] = allCareers.flatMap((career) =>
  career.paths.map((path) => ({
    careerSlug: career.slug,
    careerTitle: career.title,
    pathSlug: path.slug,
    pathTitle: path.title,
  })),
);

function findPath(pathSlug: string): CareerPathPair | undefined {
  return pathIndex.find((pair) => pair.pathSlug === pathSlug);
}

/**
 * Resolve the cross-track prerequisites declared on a learning path into
 * displayable references with titles resolved from the content registry.
 */
export function getCrossReferencesForPath(pathSlug: string): PathCrossReference[] {
  const source = findPath(pathSlug);
  if (!source) return [];

  const career = allCareers.find((c) => c.slug === source.careerSlug);
  const path = career?.paths.find((p) => p.slug === source.pathSlug);
  if (!path?.crossReferences || path.crossReferences.length === 0) return [];

  return path.crossReferences.map((ref) => {
    const target = findPath(ref.pathSlug);
    return {
      careerSlug: target?.careerSlug ?? ref.careerSlug,
      careerTitle: target?.careerTitle ?? ref.title,
      pathSlug: ref.pathSlug,
      pathTitle: target?.pathTitle ?? ref.title,
      note: ref.note,
    };
  });
}