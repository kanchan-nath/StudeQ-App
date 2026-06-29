import { describe, it, expect, jest, beforeEach } from "@jest/globals";

// ─── Mock LangChain splitter ───────────────────────────────────
const mockSplitText = jest.fn();

jest.mock("@langchain/textsplitters", () => ({
  RecursiveCharacterTextSplitter: jest.fn().mockImplementation(() => ({
    splitText: mockSplitText,
  })),
}));

jest.mock("../../services/embedText.js", () => ({ default: jest.fn() }));
jest.mock("../../logger/index.js", () => ({
  default: { error: jest.fn(), warn: jest.fn(), info: jest.fn() },
}));

import chunking from "../../../services/chunking.js";

describe("services/chunking.js", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns chunks for valid text", async () => {
    mockSplitText.mockResolvedValue(["chunk one", "chunk two", "chunk three"]);

    const result = await chunking("Some long document text with enough content");

    expect(result).toEqual(["chunk one", "chunk two", "chunk three"]);
  });

  it("throws for empty string", async () => {
    await expect(chunking("")).rejects.toThrow("chunking: non-empty string required");
  });

  it("throws for whitespace-only string", async () => {
    await expect(chunking("   ")).rejects.toThrow("chunking: non-empty string required");
  });

  it("throws for non-string input", async () => {
    await expect(chunking(null)).rejects.toThrow("chunking: non-empty string required");
    await expect(chunking(42)).rejects.toThrow("chunking: non-empty string required");
  });

  it("throws when splitter returns no chunks", async () => {
    mockSplitText.mockResolvedValue([]);

    await expect(chunking("Some text")).rejects.toThrow(
      "chunking: no chunks produced — text may be too short or malformed"
    );
  });

  it("logs warn when only 1 chunk produced", async () => {
    mockSplitText.mockResolvedValue(["single chunk"]);
    const { default: logger } = await import("../../logger/index.js");

    await chunking("Short text");

    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining("only 1 chunk produced")
    );
  });
});
