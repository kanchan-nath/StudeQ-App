import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import jwt from "jsonwebtoken";
import { mockReq, mockRes, mockNext, mockUser } from "../__mocks__/helpers.js";

const mockRedisGet = jest.fn();
const mockRedisSetex = jest.fn();
const mockPrismaUserFindUnique = jest.fn();

jest.mock("../../../lib/redisClient.js", () => ({
  default: {
    get: mockRedisGet,
    setex: mockRedisSetex,
  },
}));

jest.mock("../../../lib/prisma.js", () => ({
  default: {
    user: { findUnique: mockPrismaUserFindUnique },
  },
}));

jest.mock("../../../logger/index.js", () => ({
  default: { error: jest.fn(), warn: jest.fn(), info: jest.fn() },
}));

import { verifyJWT } from "../../middlewares/auth.middleware.js";

const makeToken = (payload = {}, secret = process.env.ACCESS_TOKEN_SECRET, opts = { expiresIn: "15m" }) =>
  jwt.sign({ userId: 1, type: "access", ...payload }, secret, opts);

describe("middlewares/auth.middleware.js — verifyJWT", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRedisGet.mockResolvedValue(null);
    mockPrismaUserFindUnique.mockResolvedValue(mockUser);
  });

  it("calls next() with valid cookie token and cache miss (DB hit)", async () => {
    const token = makeToken();
    const req = mockReq({ cookies: { accessToken: token } });
    const res = mockRes();
    const next = mockNext();

    await verifyJWT(req, res, next);

    expect(mockPrismaUserFindUnique).toHaveBeenCalled();
    expect(req.user).toEqual(mockUser);
    expect(next).toHaveBeenCalledWith(); // no error arg
  });

  it("uses Redis cache hit and skips DB", async () => {
    const token = makeToken();
    mockRedisGet.mockResolvedValue(JSON.stringify(mockUser));

    const req = mockReq({ cookies: { accessToken: token } });
    const res = mockRes();
    const next = mockNext();

    await verifyJWT(req, res, next);

    expect(mockPrismaUserFindUnique).not.toHaveBeenCalled();
    expect(req.user).toEqual(mockUser);
    expect(next).toHaveBeenCalledWith();
  });

  it("accepts Bearer token from Authorization header", async () => {
    const token = makeToken();
    const req = mockReq({
      cookies: {},
      header: jest.fn((h) => (h === "Authorization" ? `Bearer ${token}` : undefined)),
    });
    const res = mockRes();
    const next = mockNext();

    await verifyJWT(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it("throws 401 when no token provided", async () => {
    const req = mockReq({ cookies: {}, header: jest.fn(() => undefined) });
    const res = mockRes();
    const next = mockNext();

    await verifyJWT(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 401, message: "Unauthorized request" })
    );
  });

  it("throws 401 for expired token", async () => {
    const token = makeToken({}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "-1s" });
    const req = mockReq({ cookies: { accessToken: token } });
    const res = mockRes();
    const next = mockNext();

    await verifyJWT(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 401, message: "Access token expired" })
    );
  });

  it("throws 401 for token signed with wrong secret", async () => {
    const token = makeToken({}, "wrong-secret");
    const req = mockReq({ cookies: { accessToken: token } });
    const res = mockRes();
    const next = mockNext();

    await verifyJWT(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 401, message: "Invalid access token" })
    );
  });

  it("throws 401 for refresh token type", async () => {
    const token = makeToken({ type: "refresh" });
    const req = mockReq({ cookies: { accessToken: token } });
    const res = mockRes();
    const next = mockNext();

    await verifyJWT(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 401, message: "Invalid token type" })
    );
  });

  it("throws 401 when user not found in DB", async () => {
    const token = makeToken();
    mockPrismaUserFindUnique.mockResolvedValue(null);

    const req = mockReq({ cookies: { accessToken: token } });
    const res = mockRes();
    const next = mockNext();

    await verifyJWT(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 401, message: "Invalid access token" })
    );
  });

  it("throws 500 when DB query throws", async () => {
    const token = makeToken();
    mockPrismaUserFindUnique.mockRejectedValue(new Error("DB connection error"));

    const req = mockReq({ cookies: { accessToken: token } });
    const res = mockRes();
    const next = mockNext();

    await verifyJWT(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 500, message: "Something went wrong, please try again" })
    );
  });

  it("continues even when Redis set fails", async () => {
    const token = makeToken();
    mockRedisSetex.mockImplementation(() => { throw new Error("Redis write error"); });

    const req = mockReq({ cookies: { accessToken: token } });
    const res = mockRes();
    const next = mockNext();

    await verifyJWT(req, res, next);

    // Should still succeed — Redis set failure is non-fatal
    expect(next).toHaveBeenCalledWith();
    expect(req.user).toEqual(mockUser);
  });
});
