/**
 * Integration test app factory.
 * Imports the real Express app but all external services are mocked
 * at the module level so no real DB/Redis/Groq calls happen.
 */

import { jest } from "@jest/globals";
import jwt from "jsonwebtoken";

// ─── Mock ALL external services before importing app ───────────

// Prisma
export const prisma = {
  user: { findFirst: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
  studyRoom: { findFirst: jest.fn(), findMany: jest.fn(), create: jest.fn() },
  $queryRaw: jest.fn().mockResolvedValue([{}]),
};
jest.mock("../../lib/prisma.js", () => ({ default: prisma }));

// Redis
export const redis = {
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue("OK"),
  setex: jest.fn(),
  del: jest.fn().mockResolvedValue(1),
  ping: jest.fn().mockResolvedValue("PONG"),
  status: "ready",
};
jest.mock("../../lib/redisClient.js", () => ({ default: redis }));

// Mongoose
jest.mock("mongoose", () => ({
  default: {
    connection: { readyState: 1, db: { command: jest.fn().mockResolvedValue({ ok: 1 }) } },
    Types: { ObjectId: { isValid: (id) => /^[a-f\d]{24}$/i.test(id) } },
  },
  connection: { readyState: 1, db: { command: jest.fn().mockResolvedValue({ ok: 1 }) } },
  Types: { ObjectId: { isValid: (id) => /^[a-f\d]{24}$/i.test(id) } },
}));

// Rate limiter — bypass in tests
jest.mock("../../middlewares/rateLimiter.middleware.js", () => ({
  generalLimiter: (req, res, next) => next(),
  authLimiter: (req, res, next) => next(),
  aiLimiter: (req, res, next) => next(),
}));

// Logger
jest.mock("../../logger/index.js", () => ({
  default: { error: jest.fn(), warn: jest.fn(), info: jest.fn() },
}));

// Note model
export const noteModel = {
  create: jest.fn(),
  find: jest.fn(),
  findByIdAndDelete: jest.fn(),
  findOneAndUpdate: jest.fn(),
};
jest.mock("../../models/note.model.js", () => ({ Note: noteModel }));

// Summarizer
export const mockSummarizeText = jest.fn();
jest.mock("../../lib/groq/summarizer.js", () => ({ summarizeText: mockSummarizeText }));

// Queue
jest.mock("../../services/queue.js", () => ({ AIResponseQueue: jest.fn() }));

// XP service
jest.mock("../../services/xpService.js", () => ({
  grantDailyLoginXP: jest.fn().mockResolvedValue(null),
  grantXP: jest.fn().mockResolvedValue(null),
  computeStats: jest.fn().mockReturnValue({ level: 1, xpInLevel: 0, xpToNext: 100, percentToNext: 0 }),
}));

// bcrypt
export const bcrypt = { hash: jest.fn(), compare: jest.fn() };
jest.mock("bcrypt", () => ({ default: bcrypt }));

// Token helpers
export const mockGenerateAccessToken = jest.fn(() => "test-access-token");
export const mockGenerateRefreshToken = jest.fn(() => "test-refresh-token");
jest.mock("../../helpers/generateToken.js", () => ({
  generateAccessToken: mockGenerateAccessToken,
  generateRefreshToken: mockGenerateRefreshToken,
}));

// ─── Helper: make a valid JWT cookie for protected routes ───────
export const makeAuthToken = (userId = 1) =>
  jwt.sign({ userId, type: "access" }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

export const mockAuthUser = { id: 1, email: "test@example.com", name: "Test User", totalXp: 0 };

// ─── Import app AFTER mocks ─────────────────────────────────────
export const { app } = await import("../../app.js");
