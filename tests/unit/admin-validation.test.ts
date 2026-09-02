import { describe, expect, it } from "vitest";

import {
  resetHeartsInputSchema,
  setUserBanSchema,
  setUserRoleSchema,
  userRoleSchema,
} from "@/lib/admin/validation";

describe("userRoleSchema", () => {
  it("accepts 'user' and 'admin'", () => {
    expect(userRoleSchema.safeParse("user").success).toBe(true);
    expect(userRoleSchema.safeParse("admin").success).toBe(true);
  });

  it("rejects unknown roles", () => {
    expect(userRoleSchema.safeParse("superadmin").success).toBe(false);
    expect(userRoleSchema.safeParse("moderator").success).toBe(false);
  });
});

describe("setUserRoleSchema", () => {
  it("accepts a valid payload", () => {
    const result = setUserRoleSchema.safeParse({
      userId: "user_1",
      role: "admin",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a missing userId", () => {
    const result = setUserRoleSchema.safeParse({ userId: "", role: "admin" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("User ID is required");
    }
  });

  it("rejects an invalid role", () => {
    const result = setUserRoleSchema.safeParse({
      userId: "user_1",
      role: "owner",
    });
    expect(result.success).toBe(false);
  });
});

describe("setUserBanSchema", () => {
  it("accepts valid ban payloads", () => {
    expect(
      setUserBanSchema.safeParse({ userId: "u1", bannedAt: true }).success,
    ).toBe(true);
    expect(
      setUserBanSchema.safeParse({ userId: "u1", bannedAt: false }).success,
    ).toBe(true);
  });

  it("rejects a non-boolean bannedAt", () => {
    const result = setUserBanSchema.safeParse({
      userId: "u1",
      bannedAt: "yes",
    });
    expect(result.success).toBe(false);
  });
});

describe("resetHeartsInputSchema", () => {
  it("accepts a valid userId", () => {
    expect(
      resetHeartsInputSchema.safeParse({ userId: "u1" }).success,
    ).toBe(true);
  });

  it("rejects a missing userId", () => {
    const result = resetHeartsInputSchema.safeParse({ userId: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("User ID is required");
    }
  });
});
