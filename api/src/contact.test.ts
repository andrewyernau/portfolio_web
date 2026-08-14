import { describe, expect, test } from "bun:test";
import { computeBackoffSeconds } from "./contact";

describe("outbox retry policy", () => {
  test("uses bounded exponential backoff", () => {
    expect(computeBackoffSeconds(1)).toBe(30);
    expect(computeBackoffSeconds(2)).toBe(60);
    expect(computeBackoffSeconds(8)).toBe(3_600);
    expect(computeBackoffSeconds(100)).toBe(3_600);
  });
});
