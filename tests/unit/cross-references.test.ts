import { describe, expect, it } from "vitest";

import { getCrossReferencesForPath } from "@/lib/curriculum/cross-references";

describe("getCrossReferencesForPath", () => {
  it("resolves declared prerequisites into titled references", () => {
    const refs = getCrossReferencesForPath("gcp");

    expect(refs.length).toBe(2);
    expect(refs[0].pathSlug).toBe("linux");
    expect(refs[0].pathTitle).toBe("Linux Fundamentals");
    expect(refs[0].careerSlug).toBe("devops");
    expect(refs[0].careerTitle).toBe("DevOps Engineering");
  });

  it("returns an empty list for paths without cross-references", () => {
    expect(getCrossReferencesForPath("linux")).toEqual([]);
  });

  it("returns an empty list for unknown paths", () => {
    expect(getCrossReferencesForPath("does-not-exist")).toEqual([]);
  });
});