import { jest } from "@jest/globals";

// ─── Mock req/res/next factory ─────────────────────────────────
export const mockReq = (overrides = {}) => ({
  body: {},
  params: {},
  query: {},
  cookies: {},
  headers: {},
  header: jest.fn(() => undefined),
  user: { id: 1, email: "test@example.com", name: "Test User" },
  ip: "127.0.0.1",
  ...overrides,
});

export const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  return res;
};

export const mockNext = () => jest.fn();

// ─── Mock user object ──────────────────────────────────────────
export const mockUser = {
  id: 1,
  name: "test user",
  email: "test@example.com",
  grade: "10",
  totalXp: 0,
  streak: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// ─── Mock note object ──────────────────────────────────────────
export const mockNote = {
  _id: "507f1f77bcf86cd799439011",
  userId: 1,
  title: "Test Note",
  content: "Some content here",
  summary: "## Topic\nTest Note\n\nSummary text",
  isPinned: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// ─── Mock quiz object ──────────────────────────────────────────
export const mockQuiz = {
  _id: "507f1f77bcf86cd799439022",
  userId: 1,
  quiz: { title: "Test Quiz", totalQuestion: 2 },
  data: [
    {
      types: "multiple-choice",
      question: "What is 2+2?",
      options: ["3", "4", "5", "6"],
      answer: "4",
      userResponse: null,
      isCorrect: false,
    },
    {
      types: "true-false",
      question: "The sky is blue",
      options: ["True", "False"],
      answer: "True",
      userResponse: null,
      isCorrect: false,
    },
  ],
  save: jest.fn(),
};
