import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { env } from "node:process";

// Minimal stub — real catalog/resolveDynamicModel tests require the OpenClaw
// plugin test harness. These verify our own URL normalization logic.

function resolveBaseUrl(raw: string): string {
  const stripped = raw.replace(/\/+$/, "").replace(/\/v1$/, "");
  return `${stripped}/v1`;
}

describe("resolveBaseUrl", () => {
  it("appends /v1 when missing", () => {
    expect(resolveBaseUrl("https://abc123.strake.sh")).toBe("https://abc123.strake.sh/v1");
  });

  it("does not double-append /v1", () => {
    expect(resolveBaseUrl("https://abc123.strake.sh/v1")).toBe("https://abc123.strake.sh/v1");
  });

  it("strips trailing slash before appending", () => {
    expect(resolveBaseUrl("https://abc123.strake.sh/")).toBe("https://abc123.strake.sh/v1");
  });
});
