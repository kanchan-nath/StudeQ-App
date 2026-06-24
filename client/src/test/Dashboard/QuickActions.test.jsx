import { describe, it, expect } from "vitest";
import { QUICK_ACTIONS } from "../../pages/Dashboard";

describe("QUICK_ACTIONS", () => {
  it("has 6 items", () => {
    expect(QUICK_ACTIONS).toHaveLength(6);
  });

  it("every item has label string", () => {
    QUICK_ACTIONS.forEach((action) => {
      expect(typeof action.label).toBe("string");
    });
  });

  it("every item has icon", () => {
    QUICK_ACTIONS.forEach((action) => {
      expect(action.icon).toBeDefined();
    });
  });

  it("every item has valid path", () => {
    QUICK_ACTIONS.forEach((action) => {
      expect(action.to).toMatch(/^\//);
    });
  });

  it("has correct labels in order", () => {
    const labels = QUICK_ACTIONS.map((a) => a.label);
    expect(labels).toEqual([
      "Upload Material",
      "Create Quiz",
      "Chat with AI",
      "Study Room",
      "Image Analysis",
      "PDF Analysis",
    ]);
  });

  it("has correct paths in order", () => {
    const paths = QUICK_ACTIONS.map((a) => a.to);
    expect(paths).toEqual([
      "/notes",
      "/quiz",
      "/tutor",
      "/studyroom",
      "/image-analysis",
      "/pdf-summary",
    ]);
  });
});
