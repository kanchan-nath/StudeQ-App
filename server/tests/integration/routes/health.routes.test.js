import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import request from "supertest";
import { app, prisma, redis } from "./_app.js";

describe("Integration: /api/health routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    redis.ping.mockResolvedValue("PONG");
    prisma.$queryRaw.mockResolvedValue([{}]);
  });

  describe("GET /api/health", () => {
    it("200 — liveness returns ok status", async () => {
      const res = await request(app).get("/api/health");

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe("ok");
      expect(res.body.data).toHaveProperty("uptime");
      expect(res.body.data).toHaveProperty("timestamp");
    });
  });

  describe("GET /api/health/detailed", () => {
    it("200 — all services healthy", async () => {
      const res = await request(app).get("/api/health/detailed");

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe("ok");
      expect(res.body.data.services).toHaveProperty("mongo");
      expect(res.body.data.services).toHaveProperty("postgres");
      expect(res.body.data.services).toHaveProperty("redis");
    });

    it("503 — degraded when Redis is down", async () => {
      redis.ping.mockRejectedValue(new Error("ECONNREFUSED"));

      const res = await request(app).get("/api/health/detailed");

      expect(res.status).toBe(503);
      expect(res.body.data.status).toBe("degraded");
      expect(res.body.data.services.redis.status).toBe("down");
    });

    it("503 — degraded when Postgres is down", async () => {
      prisma.$queryRaw.mockRejectedValue(new Error("connection refused"));

      const res = await request(app).get("/api/health/detailed");

      expect(res.status).toBe(503);
      expect(res.body.data.services.postgres.status).toBe("down");
    });
  });
});
