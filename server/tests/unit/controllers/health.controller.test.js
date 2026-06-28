import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { mockReq, mockRes, mockNext } from "../../__mocks__/helpers.js";

const mockMongooseConnection = {
  readyState: 1,
  db: { command: jest.fn().mockResolvedValue({ ok: 1 }) },
};
const mockPrismaQueryRaw = jest.fn().mockResolvedValue([{ "?column?": 1 }]);
const mockRedisPing = jest.fn().mockResolvedValue("PONG");

jest.mock("mongoose", () => ({
  default: { connection: mockMongooseConnection },
  connection: mockMongooseConnection,
}));

jest.mock("../../../lib/prisma.js", () => ({
  default: { $queryRaw: mockPrismaQueryRaw },
}));

jest.mock("../../../lib/redisClient.js", () => ({
  default: { ping: mockRedisPing },
}));

jest.mock("../../../logger/index.js", () => ({
  default: { error: jest.fn(), warn: jest.fn(), info: jest.fn() },
}));

import { liveness, readiness } from "../../../controllers/health.controller.js";

describe("controllers/health.controller.js", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockMongooseConnection.readyState = 1;
    mockMongooseConnection.db.command.mockResolvedValue({ ok: 1 });
    mockPrismaQueryRaw.mockResolvedValue([{}]);
    mockRedisPing.mockResolvedValue("PONG");
  });

  describe("liveness()", () => {
    it("returns 200 with status ok", async () => {
      const req = mockReq();
      const res = mockRes();
      const next = mockNext();

      await liveness(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: "ok" }),
        })
      );
    });

    it("includes uptime and timestamp", async () => {
      const req = mockReq();
      const res = mockRes();
      const next = mockNext();

      await liveness(req, res, next);

      const payload = res.json.mock.calls[0][0];
      expect(payload.data).toHaveProperty("uptime");
      expect(payload.data).toHaveProperty("timestamp");
    });
  });

  describe("readiness()", () => {
    it("returns 200 when all services healthy", async () => {
      const req = mockReq();
      const res = mockRes();
      const next = mockNext();

      await readiness(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      const payload = res.json.mock.calls[0][0];
      expect(payload.data.status).toBe("ok");
    });

    it("returns 503 when MongoDB is down", async () => {
      mockMongooseConnection.readyState = 0;

      const req = mockReq();
      const res = mockRes();
      const next = mockNext();

      await readiness(req, res, next);

      expect(res.status).toHaveBeenCalledWith(503);
      const payload = res.json.mock.calls[0][0];
      expect(payload.data.status).toBe("degraded");
      expect(payload.data.services.mongo.status).toBe("down");
    });

    it("returns 503 when Redis ping returns unexpected value", async () => {
      mockRedisPing.mockResolvedValue("ERR");

      const req = mockReq();
      const res = mockRes();
      const next = mockNext();

      await readiness(req, res, next);

      expect(res.status).toHaveBeenCalledWith(503);
    });

    it("returns 503 when Postgres query throws", async () => {
      mockPrismaQueryRaw.mockRejectedValue(new Error("Connection refused"));

      const req = mockReq();
      const res = mockRes();
      const next = mockNext();

      await readiness(req, res, next);

      expect(res.status).toHaveBeenCalledWith(503);
      const payload = res.json.mock.calls[0][0];
      expect(payload.data.services.postgres.status).toBe("down");
    });
  });
});
