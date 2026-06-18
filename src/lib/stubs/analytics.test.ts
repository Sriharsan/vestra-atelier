import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { track } from "./analytics";

describe("track (cookie consent gating)", () => {
  const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {});
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    consoleSpy.mockClear();
    localStorage.clear();
    process.env.NODE_ENV = "development";
  });

  afterEach(() => {
    localStorage.clear();
    process.env.NODE_ENV = originalEnv;
  });

  it("fires when consent is 'all'", () => {
    localStorage.setItem("vestra-cookie-consent", "all");
    track("test_event", { foo: "bar" });
    expect(consoleSpy).toHaveBeenCalledWith("[vestra:analytics]", "test_event", { foo: "bar" });
  });

  it("does not fire when consent is 'essentials'", () => {
    localStorage.setItem("vestra-cookie-consent", "essentials");
    track("test_event");
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it("does not fire when no consent has been given", () => {
    track("test_event");
    expect(consoleSpy).not.toHaveBeenCalled();
  });
});
