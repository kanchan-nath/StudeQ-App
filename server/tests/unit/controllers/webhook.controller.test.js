import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import crypto from "crypto";
import { mockReq, mockRes, mockNext } from "../../__mocks__/helpers.js";

const mockRedisSet = jest.fn();
const mockPaymentQueueAdd = jest.fn();

jest.mock("../../../lib/redisClient.js", () => ({
  default: { set: mockRedisSet },
}));

jest.mock("../../../logger/index.js", () => ({
  default: { error: jest.fn(), warn: jest.fn(), info: jest.fn() },
}));

import { razorpayWebhookHandler } from "../../../controllers/webhook.controller.js";

const WEBHOOK_SECRET = "test-webhook-secret";

const makeValidSignature = (payload) =>
  crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(payload)
    .digest("hex");

describe("controllers/webhook.controller.js", () => {
  const rawBody = Buffer.from(
    JSON.stringify({
      event: "payment.captured",
      payload: { payment: { entity: { id: "pay_123", order_id: "order_456", amount: 50000 } } },
      created_at: 1700000000,
    })
  );

  beforeEach(() => {
    jest.clearAllMocks();
    mockRedisSet.mockResolvedValue("OK");
  });

  it("returns 200 and processes first-seen event", async () => {
    const sig = makeValidSignature(rawBody);

    const req = mockReq({
      headers: {
        "x-razorpay-signature": sig,
        "x-razorpay-event-id": "evt_unique_001",
      },
      body: rawBody,
    });
    const res = mockRes();
    const next = mockNext();

    await razorpayWebhookHandler(req, res, next);

    expect(mockRedisSet).toHaveBeenCalledWith(
      expect.stringContaining("webhook:razorpay:evt_unique_001"),
      "1",
      "EX",
      86400,
      "NX"
    );
  });

  it("throws 400 when signature header is missing", async () => {
    const req = mockReq({ headers: {}, body: rawBody });
    const res = mockRes();
    const next = mockNext();

    await razorpayWebhookHandler(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 400, message: "Missing signature header" })
    );
  });

  it("throws 400 for invalid signature", async () => {
    const req = mockReq({
      headers: { "x-razorpay-signature": "wrong-sig" },
      body: rawBody,
    });
    const res = mockRes();
    const next = mockNext();

    await razorpayWebhookHandler(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 400, message: "Invalid webhook signature" })
    );
  });

  it("throws 400 for malformed JSON payload", async () => {
    const badBody = Buffer.from("not-json");
    const sig = makeValidSignature(badBody);

    const req = mockReq({
      headers: { "x-razorpay-signature": sig },
      body: badBody,
    });
    const res = mockRes();
    const next = mockNext();

    await razorpayWebhookHandler(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 400, message: "Malformed payload" })
    );
  });

  it("throws 200 (duplicate_ignored) for duplicate event", async () => {
    mockRedisSet.mockResolvedValue(null); // NX fails = already seen

    const sig = makeValidSignature(rawBody);
    const req = mockReq({
      headers: {
        "x-razorpay-signature": sig,
        "x-razorpay-event-id": "evt_dup_001",
      },
      body: rawBody,
    });
    const res = mockRes();
    const next = mockNext();

    await razorpayWebhookHandler(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 200, message: "duplicate_ignored" })
    );
  });
});
