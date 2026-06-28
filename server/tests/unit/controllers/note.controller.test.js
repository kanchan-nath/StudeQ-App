import { describe, it, expect, jest, beforeEach, afterEach } from "@jest/globals";
import { mockReq, mockRes, mockNext, mockNote } from "../../__mocks__/helpers.js";

// ─── Mock all external deps ────────────────────────────────────
const mockSummarizeText = jest.fn();
const mockNoteCreate = jest.fn();
const mockNoteFind = jest.fn();
const mockNoteFindByIdAndDelete = jest.fn();
const mockNoteFindOneAndUpdate = jest.fn();
const mockAIResponseQueue = jest.fn();

jest.mock("../../../lib/groq/summarizer.js", () => ({
  summarizeText: mockSummarizeText,
}));

jest.mock("../../../models/note.model.js", () => ({
  Note: {
    create: mockNoteCreate,
    find: mockNoteFind,
    findByIdAndDelete: mockNoteFindByIdAndDelete,
    findOneAndUpdate: mockNoteFindOneAndUpdate,
  },
}));

jest.mock("../../../services/queue.js", () => ({
  AIResponseQueue: mockAIResponseQueue,
}));

jest.mock("../../../lib/prisma.js", () => ({ default: {} }));
jest.mock("../../../logger/index.js", () => ({ default: { error: jest.fn(), warn: jest.fn(), info: jest.fn() } }));

import {
  createNote,
  getNote,
  deleteNote,
  updateNote,
  togglePin,
  titleExtract,
} from "../../../controllers/note.controller.js";

describe("controllers/note.controller.js", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── titleExtract util ─────────────────────────────────────
  describe("titleExtract()", () => {
    it("extracts title from markdown heading", () => {
      const md = "## Topic\nAlgebra Basics\n\nSome content";
      expect(titleExtract(md)).toBe("Algebra Basics");
    });

    it("returns Summary fallback when no heading match", () => {
      expect(titleExtract("No heading here")).toBe("Summary");
    });

    it("returns Summary for null input", () => {
      expect(titleExtract(null)).toBe("Summary");
    });
  });

  // ─── createNote ────────────────────────────────────────────
  describe("createNote()", () => {
    it("creates note and returns 201 on success", async () => {
      mockSummarizeText.mockResolvedValue("## Topic\nTest Title\n\nSummary");
      mockNoteCreate.mockResolvedValue(mockNote);

      const req = mockReq({ body: { content: "Hello world test content" } });
      const res = mockRes();
      const next = mockNext();

      await createNote(req, res, next);

      expect(mockSummarizeText).toHaveBeenCalledWith("Hello world test content", 1);
      expect(mockNoteCreate).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("queues job and returns 202 when summarizer returns falsy", async () => {
      mockSummarizeText.mockResolvedValue(null);
      mockAIResponseQueue.mockResolvedValue(undefined);

      const req = mockReq({ body: { content: "Some long content here" } });
      const res = mockRes();
      const next = mockNext();

      await createNote(req, res, next);

      expect(mockAIResponseQueue).toHaveBeenCalledWith(1, "Some long content here");
      expect(res.status).toHaveBeenCalledWith(202);
    });

    it("throws 400 for content shorter than 2 chars", async () => {
      const req = mockReq({ body: { content: "X" } });
      const res = mockRes();
      const next = mockNext();

      await createNote(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
    });

    it("throws 400 when content is missing", async () => {
      const req = mockReq({ body: {} });
      const res = mockRes();
      const next = mockNext();

      await createNote(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
    });
  });

  // ─── getNote ───────────────────────────────────────────────
  describe("getNote()", () => {
    it("returns 200 with notes sorted by pin and date", async () => {
      const sortMock = jest.fn().mockResolvedValue([mockNote]);
      mockNoteFind.mockReturnValue({ sort: sortMock });

      const req = mockReq();
      const res = mockRes();
      const next = mockNext();

      await getNote(req, res, next);

      expect(mockNoteFind).toHaveBeenCalledWith({ userId: 1 });
      expect(sortMock).toHaveBeenCalledWith({ isPinned: -1, createdAt: -1 });
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  // ─── deleteNote ────────────────────────────────────────────
  describe("deleteNote()", () => {
    it("deletes note and returns 200", async () => {
      mockNoteFindByIdAndDelete.mockResolvedValue(mockNote);

      const req = mockReq({ params: { id: "507f1f77bcf86cd799439011" } });
      const res = mockRes();
      const next = mockNext();

      await deleteNote(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("throws 400 for invalid ObjectId", async () => {
      const req = mockReq({ params: { id: "bad-id" } });
      const res = mockRes();
      const next = mockNext();

      await deleteNote(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400, message: "Invalid note ID" }));
    });

    it("throws 404 when note not found", async () => {
      mockNoteFindByIdAndDelete.mockResolvedValue(null);

      const req = mockReq({ params: { id: "507f1f77bcf86cd799439011" } });
      const res = mockRes();
      const next = mockNext();

      await deleteNote(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 404, message: "Note not found" }));
    });
  });

  // ─── updateNote ────────────────────────────────────────────
  describe("updateNote()", () => {
    it("updates note and returns 200", async () => {
      mockSummarizeText.mockResolvedValue("## Topic\nUpdated Title\n\nNew summary");
      mockNoteFindOneAndUpdate.mockResolvedValue({ ...mockNote, content: "Updated content here" });

      const req = mockReq({
        body: { content: "Updated content here" },
        params: { id: "507f1f77bcf86cd799439011" },
      });
      const res = mockRes();
      const next = mockNext();

      await updateNote(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("throws 400 for invalid ObjectId", async () => {
      const req = mockReq({
        body: { content: "Valid content here" },
        params: { id: "not-valid-id" },
      });
      const res = mockRes();
      const next = mockNext();

      await updateNote(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
    });

    it("throws 500 when summarizer fails", async () => {
      mockSummarizeText.mockResolvedValue(null);

      const req = mockReq({
        body: { content: "Valid content here" },
        params: { id: "507f1f77bcf86cd799439011" },
      });
      const res = mockRes();
      const next = mockNext();

      await updateNote(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 500 }));
    });

    it("throws 404 when note not found", async () => {
      mockSummarizeText.mockResolvedValue("## Topic\nTitle\n\nSummary");
      mockNoteFindOneAndUpdate.mockResolvedValue(null);

      const req = mockReq({
        body: { content: "Valid content here" },
        params: { id: "507f1f77bcf86cd799439011" },
      });
      const res = mockRes();
      const next = mockNext();

      await updateNote(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 404 }));
    });
  });

  // ─── togglePin ─────────────────────────────────────────────
  describe("togglePin()", () => {
    it("pins note and returns 200", async () => {
      mockNoteFindOneAndUpdate.mockResolvedValue({ ...mockNote, isPinned: true });

      const req = mockReq({
        body: { newPinned: true },
        params: { id: "507f1f77bcf86cd799439011" },
      });
      const res = mockRes();
      const next = mockNext();

      await togglePin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("throws 400 when newPinned is not boolean", async () => {
      const req = mockReq({
        body: { newPinned: "yes" },
        params: { id: "507f1f77bcf86cd799439011" },
      });
      const res = mockRes();
      const next = mockNext();

      await togglePin(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400, message: "newPinned must be a boolean" }));
    });

    it("throws 400 for invalid ObjectId", async () => {
      const req = mockReq({
        body: { newPinned: false },
        params: { id: "bad" },
      });
      const res = mockRes();
      const next = mockNext();

      await togglePin(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400, message: "Invalid note ID" }));
    });

    it("throws 404 when note not found", async () => {
      mockNoteFindOneAndUpdate.mockResolvedValue(null);

      const req = mockReq({
        body: { newPinned: false },
        params: { id: "507f1f77bcf86cd799439011" },
      });
      const res = mockRes();
      const next = mockNext();

      await togglePin(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 404, message: "Note not found" }));
    });
  });
});
