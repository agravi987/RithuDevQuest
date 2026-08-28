import { describe, expect, it } from "vitest";

import {
  signupSchema,
  loginCredentialsSchema,
} from "@/lib/auth-validation";

describe("signupSchema", () => {
  it("accepts a valid signup payload", () => {
    const result = signupSchema.safeParse({
      name: "Ada Lovelace",
      email: "ADA@EXAMPLE.COM",
      password: "password123",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("ada@example.com");
      expect(result.data.name).toBe("Ada Lovelace");
    }
  });

  it("rejects a name that is too short", () => {
    const result = signupSchema.safeParse({
      name: "A",
      email: "ada@example.com",
      password: "password123",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain("at least 2");
    }
  });

  it("rejects an invalid email", () => {
    const result = signupSchema.safeParse({
      name: "Ada",
      email: "not-an-email",
      password: "password123",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a short password", () => {
    const result = signupSchema.safeParse({
      name: "Ada",
      email: "ada@example.com",
      password: "short",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain("at least 8");
    }
  });

  it("rejects a password longer than 72 characters", () => {
    const result = signupSchema.safeParse({
      name: "Ada",
      email: "ada@example.com",
      password: "x".repeat(73),
    });

    expect(result.success).toBe(false);
  });

  it("trims surrounding whitespace from name and email", () => {
    const result = signupSchema.safeParse({
      name: "  Ada Lovelace  ",
      email: "  ada@example.com  ",
      password: "password123",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Ada Lovelace");
      expect(result.data.email).toBe("ada@example.com");
    }
  });
});

describe("loginCredentialsSchema", () => {
  it("accepts valid credentials and normalizes the email", () => {
    const result = loginCredentialsSchema.safeParse({
      email: "ADA@EXAMPLE.COM",
      password: "password123",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("ada@example.com");
    }
  });

  it("rejects a missing password", () => {
    const result = loginCredentialsSchema.safeParse({
      email: "ada@example.com",
      password: "",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Password is required");
    }
  });

  it("rejects an invalid email", () => {
    const result = loginCredentialsSchema.safeParse({
      email: "nope",
      password: "password123",
    });

    expect(result.success).toBe(false);
  });
});