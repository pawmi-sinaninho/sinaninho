import { describe, it, expect } from "vitest";
import SIDEKICKS from "../src/data/sidekicks";
import { validateSidekicks } from "../src/lib/validation";
import { computeScore, rankSidekicks } from "../src/lib/ranking";

describe("data validation", () => {
  it("validates sidekicks array", () => {
    const parsed = validateSidekicks(SIDEKICKS);
    expect(parsed.length).toBeGreaterThan(0);
    // check minimal shape
    for (const s of parsed) {
      expect(s.id).toMatch(/^[a-z0-9-]+$/);
      expect(s.roles.length).toBeGreaterThan(0);
      expect(s.spells.length).toBeGreaterThan(0);
    }
  });
});

describe("ranking", () => {
  it("gives higher score to better role match", () => {
    const parsed = validateSidekicks(SIDEKICKS);
    const f = { roles: ["healer"] as const, tags: ["heal_single"] as const };
    const scores = parsed.map(s => ({ id: s.id, score: computeScore(s, f as any) }));
    const lumino = scores.find(x => x.id === "lumino")!;
    const shadow = scores.find(x => x.id === "shadow")!;
    expect(lumino.score).toBeGreaterThan(shadow.score);
  });

  it("sorts list by score desc", () => {
    const parsed = validateSidekicks(SIDEKICKS);
    const ranked = rankSidekicks(parsed, { roles: ["positioning"] as any });
    // krobax sollte vorn mitspielen
    expect(ranked[0].id === "krobax" || ranked[1].id === "krobax").toBe(true);
  });
});
