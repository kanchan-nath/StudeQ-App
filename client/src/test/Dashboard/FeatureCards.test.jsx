import { describe, it, expect } from "vitest";
import { FEATURE_CARDS } from "../../pages/Dashboard";

describe("FEATURE_CARDS", () => {
  it("has 6 cards", () => {
    expect(FEATURE_CARDS).toHaveLength(6);
  });

  it("every card has required fields", () => {
    FEATURE_CARDS.forEach((card) => {
      expect(card.icon).toBeDefined();
      expect(typeof card.colorClass).toBe("string");
      expect(typeof card.title).toBe("string");
      expect(typeof card.desc).toBe("string");
      expect(typeof card.cta).toBe("string");
      expect(card.to).toMatch(/^\//);
    });
  });

  it("all paths are unique", () => {
    const paths = FEATURE_CARDS.map((c) => c.to);
    const unique = new Set(paths);
    expect(unique.size).toBe(paths.length);
  });

  it("has correct titles", () => {
    const titles = FEATURE_CARDS.map((c) => c.title);
    expect(titles).toEqual([
      "Flashcard Practice",
      "Generate a Quiz",
      "Analyze an Image",
      "Break Down a PDF",
      "AI Tutor Session",
      "Plan Your Week",
    ]);
  });
});
