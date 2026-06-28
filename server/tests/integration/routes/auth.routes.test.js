import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import request from "supertest";
import {
  app,
  prisma,
  bcrypt,
  redis,
  mockAuthUser,
  makeAuthToken,
  mockGenerateAccessToken,
  mockGenerateRefreshToken,
} from "./_app.js";

describe("Integration: /api/auth routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    redis.get.mockResolvedValue(null);
  });

  // ─── POST /api/auth/register ───────────────────────────────
  describe("POST /api/auth/register", () => {
    const validBody = {
      name: "Kanchan Dev",
      email: "kanchan@example.com",
      password: "password123",
      grade: "10",
    };

    it("201 — creates user successfully", async () => {
      prisma.user.findFirst.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashed-pw");
      prisma.user.create.mockResolvedValue({ ...mockAuthUser, id: 99 });

      const res = await request(app).post("/api/auth/register").send(validBody);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Registration successful");
    });

    it("400 — email already in use", async () => {
      prisma.user.findFirst.mockResolvedValue({ id: 1 });

      const res = await request(app).post("/api/auth/register").send(validBody);

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/Email already in use/);
    });

    it("400 — invalid email format", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ ...validBody, email: "not-an-email" });

      expect(res.status).toBe(400);
    });

    it("400 — password too short", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ ...validBody, password: "short" });

      expect(res.status).toBe(400);
    });

    it("400 — missing grade", async () => {
      const { grade, ...noGrade } = validBody;
      const res = await request(app).post("/api/auth/register").send(noGrade);

      expect(res.status).toBe(400);
    });
  });

  // ─── POST /api/auth/login ──────────────────────────────────
  describe("POST /api/auth/login", () => {
    const validCreds = { email: "kanchan@example.com", password: "password123" };
    const dbUser = { ...mockAuthUser, password: "hashed-pw" };

    it("200 — valid credentials set auth cookies", async () => {
      prisma.user.findUnique.mockResolvedValue(dbUser);
      bcrypt.compare.mockResolvedValue(true);
      bcrypt.hash.mockResolvedValue("hashed-refresh");
      prisma.user.update.mockResolvedValue({});

      const res = await request(app).post("/api/auth/login").send(validCreds);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      const cookies = res.headers["set-cookie"] || [];
      expect(cookies.some((c) => c.startsWith("accessToken"))).toBe(true);
    });

    it("404 — invalid credentials", async () => {
      prisma.user.findUnique.mockResolvedValue(dbUser);
      bcrypt.compare.mockResolvedValue(false);

      const res = await request(app).post("/api/auth/login").send(validCreds);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Invalid credentials");
    });

    it("404 — user not found", async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      bcrypt.compare.mockResolvedValue(false);

      const res = await request(app).post("/api/auth/login").send(validCreds);

      expect(res.status).toBe(404);
    });

    it("400 — missing password", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "kanchan@example.com" });

      expect(res.status).toBe(400);
    });
  });

  // ─── POST /api/auth/logout ─────────────────────────────────
  describe("POST /api/auth/logout", () => {
    it("200 — clears cookies and nulls refresh token", async () => {
      const token = makeAuthToken(1);
      redis.get.mockResolvedValue(JSON.stringify(mockAuthUser));
      prisma.user.update.mockResolvedValue({});

      const res = await request(app)
        .post("/api/auth/logout")
        .set("Cookie", `accessToken=${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Logged out successfully");
    });

    it("401 — no token provided", async () => {
      const res = await request(app).post("/api/auth/logout");

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Unauthorized request");
    });
  });

  // ─── GET /api/auth/me ──────────────────────────────────────
  describe("GET /api/auth/me", () => {
    it("200 — returns user from cache", async () => {
      const token = makeAuthToken(1);
      redis.get.mockResolvedValue(JSON.stringify(mockAuthUser));

      const res = await request(app)
        .get("/api/auth/me")
        .set("Cookie", `accessToken=${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toMatchObject({ id: 1 });
    });

    it("401 — missing token", async () => {
      const res = await request(app).get("/api/auth/me");
      expect(res.status).toBe(401);
    });
  });

  // ─── GET /api/auth/userinfo ────────────────────────────────
  describe("GET /api/auth/userinfo", () => {
    it("200 — returns user data", async () => {
      const token = makeAuthToken(1);
      redis.get.mockResolvedValue(JSON.stringify(mockAuthUser));

      const res = await request(app)
        .get("/api/auth/userinfo")
        .set("Cookie", `accessToken=${token}`);

      expect(res.status).toBe(200);
    });
  });
});
