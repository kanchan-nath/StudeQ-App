import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import request from "supertest";
import {
  app,
  noteModel,
  redis,
  mockAuthUser,
  makeAuthToken,
  mockSummarizeText,
} from "./_app.js";

const VALID_OID = "507f1f77bcf86cd799439011";

describe("Integration: /api/notes routes", () => {
  let token;

  beforeEach(() => {
    jest.clearAllMocks();
    token = makeAuthToken(1);
    redis.get.mockResolvedValue(JSON.stringify(mockAuthUser));
  });

  // ─── POST /api/notes ──────────────────────────────────────
  describe("POST /api/notes", () => {
    it("201 — creates note with summarized content", async () => {
      mockSummarizeText.mockResolvedValue("## Topic\nAlgebra\n\nSummary text");
      noteModel.create.mockResolvedValue({
        _id: VALID_OID,
        userId: 1,
        title: "Algebra",
        content: "Long content here",
        summary: "## Topic\nAlgebra\n\nSummary text",
        isPinned: false,
      });

      const res = await request(app)
        .post("/api/notes")
        .set("Cookie", `accessToken=${token}`)
        .send({ content: "Long content here" });

      expect(res.status).toBe(201);
      expect(res.body.data.title).toBe("Algebra");
    });

    it("202 — queues when summarizer returns null", async () => {
      mockSummarizeText.mockResolvedValue(null);

      const res = await request(app)
        .post("/api/notes")
        .set("Cookie", `accessToken=${token}`)
        .send({ content: "Long content here" });

      expect(res.status).toBe(202);
    });

    it("400 — content too short", async () => {
      const res = await request(app)
        .post("/api/notes")
        .set("Cookie", `accessToken=${token}`)
        .send({ content: "X" });

      expect(res.status).toBe(400);
    });

    it("400 — missing content", async () => {
      const res = await request(app)
        .post("/api/notes")
        .set("Cookie", `accessToken=${token}`)
        .send({});

      expect(res.status).toBe(400);
    });

    it("401 — unauthenticated", async () => {
      const res = await request(app).post("/api/notes").send({ content: "hello world test" });
      expect(res.status).toBe(401);
    });
  });

  // ─── GET /api/notes ────────────────────────────────────────
  describe("GET /api/notes", () => {
    it("200 — returns all notes", async () => {
      const sortMock = jest.fn().mockResolvedValue([]);
      noteModel.find.mockReturnValue({ sort: sortMock });

      const res = await request(app)
        .get("/api/notes")
        .set("Cookie", `accessToken=${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("401 — unauthenticated", async () => {
      const res = await request(app).get("/api/notes");
      expect(res.status).toBe(401);
    });
  });

  // ─── DELETE /api/notes/:id ─────────────────────────────────
  describe("DELETE /api/notes/:id", () => {
    it("200 — deletes note", async () => {
      noteModel.findByIdAndDelete.mockResolvedValue({ _id: VALID_OID });

      const res = await request(app)
        .delete(`/api/notes/${VALID_OID}`)
        .set("Cookie", `accessToken=${token}`);

      expect(res.status).toBe(200);
    });

    it("400 — invalid ObjectId", async () => {
      const res = await request(app)
        .delete("/api/notes/bad-id")
        .set("Cookie", `accessToken=${token}`);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid note ID");
    });

    it("404 — note not found", async () => {
      noteModel.findByIdAndDelete.mockResolvedValue(null);

      const res = await request(app)
        .delete(`/api/notes/${VALID_OID}`)
        .set("Cookie", `accessToken=${token}`);

      expect(res.status).toBe(404);
    });
  });

  // ─── PATCH /api/notes/:id ──────────────────────────────────
  describe("PATCH /api/notes/:id", () => {
    it("200 — updates note", async () => {
      mockSummarizeText.mockResolvedValue("## Topic\nUpdated\n\nSummary");
      noteModel.findOneAndUpdate.mockResolvedValue({
        _id: VALID_OID,
        content: "Updated content here",
        title: "Updated",
      });

      const res = await request(app)
        .patch(`/api/notes/${VALID_OID}`)
        .set("Cookie", `accessToken=${token}`)
        .send({ content: "Updated content here" });

      expect(res.status).toBe(200);
    });

    it("400 — invalid ObjectId", async () => {
      const res = await request(app)
        .patch("/api/notes/bad-id")
        .set("Cookie", `accessToken=${token}`)
        .send({ content: "Updated content here" });

      expect(res.status).toBe(400);
    });

    it("404 — note not found", async () => {
      mockSummarizeText.mockResolvedValue("## Topic\nTitle\n\nSummary");
      noteModel.findOneAndUpdate.mockResolvedValue(null);

      const res = await request(app)
        .patch(`/api/notes/${VALID_OID}`)
        .set("Cookie", `accessToken=${token}`)
        .send({ content: "Updated content here" });

      expect(res.status).toBe(404);
    });
  });

  // ─── PATCH /api/notes/:id/pin ──────────────────────────────
  describe("PATCH /api/notes/:id/pin", () => {
    it("200 — toggles pin state", async () => {
      noteModel.findOneAndUpdate.mockResolvedValue({ _id: VALID_OID, isPinned: true });

      const res = await request(app)
        .patch(`/api/notes/${VALID_OID}/pin`)
        .set("Cookie", `accessToken=${token}`)
        .send({ newPinned: true });

      expect(res.status).toBe(200);
    });

    it("400 — newPinned not boolean", async () => {
      const res = await request(app)
        .patch(`/api/notes/${VALID_OID}/pin`)
        .set("Cookie", `accessToken=${token}`)
        .send({ newPinned: "yes" });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("newPinned must be a boolean");
    });
  });
});
