import { beforeEach, describe, expect, it } from "vitest";
import { checkRateLimit, _resetRateLimiter } from "@/lib/ai/rate-limiter";

describe("AI Rate Limiter", () => {
  beforeEach(() => {
    _resetRateLimiter();
  });

  it("allows requests under the limit", () => {
    const r1 = checkRateLimit("user-1", 3, 1000);
    expect(r1.success).toBe(true);
    expect(r1.remaining).toBe(2);

    const r2 = checkRateLimit("user-1", 3, 1000);
    expect(r2.success).toBe(true);
    expect(r2.remaining).toBe(1);

    const r3 = checkRateLimit("user-1", 3, 1000);
    expect(r3.success).toBe(true);
    expect(r3.remaining).toBe(0);
  });

  it("blocks requests that exceed the limit", () => {
    checkRateLimit("user-2", 2, 1000);
    checkRateLimit("user-2", 2, 1000);

    const r3 = checkRateLimit("user-2", 2, 1000);
    expect(r3.success).toBe(false);
    expect(r3.remaining).toBe(0);
    expect(r3.reset).toBeGreaterThan(0);
  });

  it("isolates rate limits between different users", () => {
    checkRateLimit("user-a", 1, 1000);
    const blockedA = checkRateLimit("user-a", 1, 1000);
    expect(blockedA.success).toBe(false);

    const allowedB = checkRateLimit("user-b", 1, 1000);
    expect(allowedB.success).toBe(true);
  });
});
