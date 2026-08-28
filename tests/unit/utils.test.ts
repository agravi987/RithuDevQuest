import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn (class merging utility)", () => {
  it("merges multiple class strings", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles falsy values", () => {
    expect(cn("foo", false, null, undefined, "bar")).toBe("foo bar");
  });

  it("resolves tailwind conflicts with tailwind-merge", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
  });

  it("preserves non-conflicting classes", () => {
    expect(cn("px-2", "py-4")).toBe("px-2 py-4");
  });
});