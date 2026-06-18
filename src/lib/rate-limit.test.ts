import { describe, it, expect, beforeEach, vi } from "vitest";
import { checkRateLimit } from "./rate-limit";

describe("checkRateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("allows requests under the limit", () => {
    const key = "test-allow";
    for (let i = 0; i < 10; i++) {
      const { allowed } = checkRateLimit(key, 10, 60_000);
      expect(allowed).toBe(true);
    }
  });

  it("blocks requests over the limit", () => {
    const key = "test-block";
    for (let i = 0; i < 10; i++) {
      checkRateLimit(key, 10, 60_000);
    }
    const { allowed, retryAfterMs } = checkRateLimit(key, 10, 60_000);
    expect(allowed).toBe(false);
    expect(retryAfterMs).toBeGreaterThan(0);
  });

  it("resets after the window expires", () => {
    const key = "test-reset";
    for (let i = 0; i < 10; i++) {
      checkRateLimit(key, 10, 60_000);
    }
    expect(checkRateLimit(key, 10, 60_000).allowed).toBe(false);

    vi.advanceTimersByTime(60_001);
    expect(checkRateLimit(key, 10, 60_000).allowed).toBe(true);
  });

  it("tracks different keys independently", () => {
    for (let i = 0; i < 10; i++) {
      checkRateLimit("key-a", 10, 60_000);
    }
    expect(checkRateLimit("key-a", 10, 60_000).allowed).toBe(false);
    expect(checkRateLimit("key-b", 10, 60_000).allowed).toBe(true);
  });
});
