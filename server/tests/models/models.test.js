import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

// ─── Note model ────────────────────────────────────────────────
import { Note } from "../../../models/note.model.js";

describe("models/note.model.js", () => {
  afterEach(async () => {
    await Note.deleteMany({});
  });

  it("creates a note with required userId", async () => {
    const note = await Note.create({
      userId: 1,
      title: "Test Note",
      content: "Some content",
      summary: "Summary text",
    });
    expect(note._id).toBeDefined();
    expect(note.userId).toBe(1);
    expect(note.isPinned).toBe(false); // default
  });

  it("sets isPinned default to false", async () => {
    const note = await Note.create({ userId: 2, content: "hello" });
    expect(note.isPinned).toBe(false);
  });

  it("adds createdAt and updatedAt timestamps", async () => {
    const note = await Note.create({ userId: 3 });
    expect(note.createdAt).toBeDefined();
    expect(note.updatedAt).toBeDefined();
  });

  it("updates isPinned correctly", async () => {
    const note = await Note.create({ userId: 4, isPinned: false });
    const updated = await Note.findOneAndUpdate(
      { _id: note._id },
      { isPinned: true },
      { returnDocument: "after" }
    );
    expect(updated.isPinned).toBe(true);
  });
});

// ─── AIResponse model ──────────────────────────────────────────
import { AIResponse } from "../../../models/aiResponse.model.js";

describe("models/aiResponse.model.js", () => {
  afterEach(async () => {
    await AIResponse.deleteMany({});
  });

  it("creates AIResponse with all required fields", async () => {
    const doc = await AIResponse.create({
      userId: 1,
      prompt: "Summarize this",
      response: "Here is a summary",
      model: "llama-3.3-70b",
      promptTokens: "100",
      completionTokens: "50",
      totalTokens: "150",
      totalTime: "1.2",
    });
    expect(doc._id).toBeDefined();
    expect(doc.model).toBe("llama-3.3-70b");
  });

  it("fails validation when prompt is missing", async () => {
    await expect(
      AIResponse.create({
        userId: 1,
        response: "response",
        model: "model",
        promptTokens: "1",
        completionTokens: "1",
        totalTokens: "2",
        totalTime: "0.5",
      })
    ).rejects.toThrow();
  });
});

// ─── ChatRoom model ────────────────────────────────────────────
import { ChatRoom } from "../../../models/chatRoom.model.js";

describe("models/chatRoom.model.js", () => {
  afterEach(async () => {
    await ChatRoom.deleteMany({});
  });

  it("creates chat room with unique docId", async () => {
    const room = await ChatRoom.create({ userId: 1, docId: "doc-abc-123" });
    expect(room.docId).toBe("doc-abc-123");
  });

  it("enforces unique docId constraint", async () => {
    await ChatRoom.create({ userId: 1, docId: "doc-duplicate" });
    await expect(ChatRoom.create({ userId: 2, docId: "doc-duplicate" })).rejects.toThrow();
  });

  it("stores messages with role enum", async () => {
    const room = await ChatRoom.create({
      userId: 1,
      docId: "doc-messages",
      messages: [
        { role: "user", content: "Hello" },
        { role: "assistant", content: "Hi there" },
      ],
    });
    expect(room.messages).toHaveLength(2);
    expect(room.messages[0].role).toBe("user");
  });
});

// ─── Flashcard model ───────────────────────────────────────────
import { Flascards } from "../../../models/flashcard.model.js";

describe("models/flashcard.model.js", () => {
  afterEach(async () => {
    await Flascards.deleteMany({});
  });

  it("creates flashcard set with cards", async () => {
    const doc = await Flascards.create({
      userId: 1,
      subject: "Biology",
      topic: "Photosynthesis",
      flashcards: [
        { front: "What is photosynthesis?", back: "Process by which plants make food" },
      ],
    });
    expect(doc.flashcards).toHaveLength(1);
    expect(doc.topic).toBe("Photosynthesis");
  });

  it("creates empty flashcards array by default", async () => {
    const doc = await Flascards.create({ userId: 1 });
    expect(doc.flashcards).toEqual([]);
  });
});
