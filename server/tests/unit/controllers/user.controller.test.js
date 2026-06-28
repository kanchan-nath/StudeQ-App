import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { mockReq, mockRes, mockNext, mockUser } from "../../__mocks__/helpers.js";

// ─── Mocks ─────────────────────────────────────────────────────
const mockPrismaUserFindFirst = jest.fn();
const mockPrismaUserFindUnique = jest.fn();
const mockPrismaUserCreate = jest.fn();
const mockPrismaUserUpdate = jest.fn();
const mockBcryptHash = jest.fn();
const mockBcryptCompare = jest.fn();
const mockGenerateAccessToken = jest.fn(() => "mock-access-token");
const mockGenerateRefreshToken = jest.fn(() => "mock-refresh-token");
const mockGrantDailyLoginXP = jest.fn().mockResolvedValue(null);

jest.mock("../../../lib/prisma.js", () => ({
  default: {
    user: {
      findFirst: mockPrismaUserFindFirst,
      findUnique: mockPrismaUserFindUnique,
      create: mockPrismaUserCreate,
      update: mockPrismaUserUpdate,
    },
  },
}));

jest.mock("bcrypt", () => ({
  default: {
    hash: mockBcryptHash,
    compare: mockBcryptCompare,
  },
}));

jest.mock("../../../helpers/generateToken.js", () => ({
  generateAccessToken: mockGenerateAccessToken,
  generateRefreshToken: mockGenerateRefreshToken,
}));

jest.mock("../../../services/xpService.js", () => ({
  grantDailyLoginXP: mockGrantDailyLoginXP,
}));

jest.mock("../../../logger/index.js", () => ({
  default: { error: jest.fn(), warn: jest.fn(), info: jest.fn() },
}));

import { register, login, logout, getUserData, verifyMe } from "../../../controllers/user.controller.js";

describe("controllers/user.controller.js", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── register ──────────────────────────────────────────────
  describe("register()", () => {
    const validBody = {
      name: "Kanchan Dev",
      email: "kanchan@example.com",
      password: "securePass1",
      grade: "10",
    };

    it("creates user and returns 201", async () => {
      mockPrismaUserFindFirst.mockResolvedValue(null);
      mockBcryptHash.mockResolvedValue("hashed-pw");
      mockPrismaUserCreate.mockResolvedValue({ ...mockUser, id: 10 });

      const req = mockReq({ body: validBody });
      const res = mockRes();
      const next = mockNext();

      await register(req, res, next);

      expect(mockPrismaUserCreate).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("throws 400 when email already in use", async () => {
      mockPrismaUserFindFirst.mockResolvedValue({ id: 1 });

      const req = mockReq({ body: validBody });
      const res = mockRes();
      const next = mockNext();

      await register(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 400, message: expect.stringContaining("Email already in use") })
      );
    });

    it("throws 400 for invalid email format", async () => {
      const req = mockReq({ body: { ...validBody, email: "bad-email" } });
      const res = mockRes();
      const next = mockNext();

      await register(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
    });

    it("throws 400 for short password", async () => {
      const req = mockReq({ body: { ...validBody, password: "short" } });
      const res = mockRes();
      const next = mockNext();

      await register(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
    });

    it("throws 400 when name is missing", async () => {
      const { name, ...noName } = validBody;
      const req = mockReq({ body: noName });
      const res = mockRes();
      const next = mockNext();

      await register(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
    });
  });

  // ─── login ─────────────────────────────────────────────────
  describe("login()", () => {
    const validBody = { email: "kanchan@example.com", password: "securePass1" };
    const dbUser = { ...mockUser, password: "hashed-pw" };

    it("returns 200 with tokens on valid credentials", async () => {
      mockPrismaUserFindUnique.mockResolvedValue(dbUser);
      mockBcryptCompare.mockResolvedValue(true);
      mockBcryptHash.mockResolvedValue("hashed-refresh");
      mockPrismaUserUpdate.mockResolvedValue({});

      const req = mockReq({ body: validBody });
      const res = mockRes();
      const next = mockNext();

      await login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.cookie).toHaveBeenCalledWith("accessToken", "mock-access-token", expect.any(Object));
      expect(res.cookie).toHaveBeenCalledWith("refreshToken", "mock-refresh-token", expect.any(Object));
    });

    it("throws 404 for wrong password", async () => {
      mockPrismaUserFindUnique.mockResolvedValue(dbUser);
      mockBcryptCompare.mockResolvedValue(false);

      const req = mockReq({ body: validBody });
      const res = mockRes();
      const next = mockNext();

      await login(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 404, message: "Invalid credentials" })
      );
    });

    it("throws 404 when user does not exist", async () => {
      mockPrismaUserFindUnique.mockResolvedValue(null);
      mockBcryptCompare.mockResolvedValue(false);

      const req = mockReq({ body: validBody });
      const res = mockRes();
      const next = mockNext();

      await login(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 404 }));
    });

    it("throws 400 for invalid email", async () => {
      const req = mockReq({ body: { email: "nope", password: "pass123" } });
      const res = mockRes();
      const next = mockNext();

      await login(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
    });

    it("continues login even if daily XP grant fails", async () => {
      mockPrismaUserFindUnique.mockResolvedValue(dbUser);
      mockBcryptCompare.mockResolvedValue(true);
      mockBcryptHash.mockResolvedValue("hashed-refresh");
      mockPrismaUserUpdate.mockResolvedValue({});
      mockGrantDailyLoginXP.mockRejectedValue(new Error("XP service down"));

      const req = mockReq({ body: validBody });
      const res = mockRes();
      const next = mockNext();

      await login(req, res, next);

      // Login still succeeds despite XP failure
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  // ─── logout ────────────────────────────────────────────────
  describe("logout()", () => {
    it("clears refresh token and returns 200", async () => {
      mockPrismaUserUpdate.mockResolvedValue({});

      const req = mockReq();
      const res = mockRes();
      const next = mockNext();

      await logout(req, res, next);

      expect(mockPrismaUserUpdate).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { refreshToken: null },
      });
      expect(res.clearCookie).toHaveBeenCalledWith("accessToken", expect.any(Object));
      expect(res.clearCookie).toHaveBeenCalledWith("refreshToken", expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  // ─── getUserData ───────────────────────────────────────────
  describe("getUserData()", () => {
    it("returns req.user with 200", async () => {
      const req = mockReq();
      const res = mockRes();
      const next = mockNext();

      await getUserData(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ id: 1 }) })
      );
    });
  });

  // ─── verifyMe ──────────────────────────────────────────────
  describe("verifyMe()", () => {
    it("returns 200 with user data", async () => {
      const req = mockReq();
      const res = mockRes();
      const next = mockNext();

      await verifyMe(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
