import { describe, it, expect } from "@jest/globals";
import request from "supertest";
import { app } from "./_app.js";

describe("Integration: Express error handling", () => {
  describe("404 catch-all", () => {
    it("returns 404 for unknown route", async () => {
      const res = await request(app).get("/api/this-route-does-not-exist");

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Route not found");
    });

    it("returns 404 for unknown POST route", async () => {
      const res = await request(app).post("/api/no-such-endpoint").send({});

      expect(res.status).toBe(404);
    });
  });
});
