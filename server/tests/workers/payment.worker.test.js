import { describe, it, expect, jest, beforeEach } from "@jest/globals";

// ─── Mocks ─────────────────────────────────────────────────────
const mockPaymentFindOne = jest.fn();
const mockPaymentUpdateOne = jest.fn();
const mockRedisClientDel = jest.fn();
const mockGrantXP = jest.fn();
const mockSessionWithTransaction = jest.fn();
const mockSessionEndSession = jest.fn();
const mockStartSession = jest.fn();

jest.mock("../../../models/payment.model.js", () => ({
  default: {
    findOne: mockPaymentFindOne,
    updateOne: mockPaymentUpdateOne,
  },
}));

jest.mock("../../../lib/redisClient.js", () => ({
  redisClient: {
    del: mockRedisClientDel,
    set: jest.fn(),
    get: jest.fn(),
  },
}));

jest.mock("../../../services/xpService.js", () => ({
  grantXP: mockGrantXP,
}));

jest.mock("mongoose", () => ({
  default: {
    startSession: mockStartSession,
  },
}));

jest.mock("bullmq", () => ({
  Worker: jest.fn().mockImplementation((name, processor, opts) => ({
    on: jest.fn(),
    _processor: processor,
  })),
}));

jest.mock("../../../logger/index.js", () => ({
  default: { error: jest.fn(), warn: jest.fn(), info: jest.fn() },
}));

// Import and extract processor after mocks
import { Worker } from "bullmq";

describe("worker/payment.worker.js", () => {
  let processor;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockRedisClientDel.mockResolvedValue(1);
    mockGrantXP.mockResolvedValue(undefined);

    const session = {
      withTransaction: mockSessionWithTransaction,
      endSession: mockSessionEndSession,
    };
    mockStartSession.mockResolvedValue(session);
    mockSessionWithTransaction.mockImplementation(async (fn) => await fn());
    mockPaymentUpdateOne.mockResolvedValue({ modifiedCount: 1 });

    // Dynamic import to get the worker after mocks are set
    const mod = await import("../../../worker/payment.worker.js");
    processor = Worker.mock.calls[0]?.[1];
  });

  describe("payment.captured event", () => {
    const capturedPayload = {
      payment: {
        entity: {
          id: "pay_abc123",
          order_id: "order_xyz",
          amount: 50000,
        },
      },
    };

    it("updates payment status to CAPTURED and grants XP", async () => {
      const existingPayment = {
        _id: "pay_db_id",
        userId: 1,
        status: "CREATED",
        amount: 50000,
        razorpayOrderId: "order_xyz",
      };
      mockPaymentFindOne.mockResolvedValue(existingPayment);

      if (processor) {
        await processor({ data: { event: "payment.captured", payload: capturedPayload, eventId: "evt_001" } });
      }

      expect(mockPaymentUpdateOne).toHaveBeenCalledWith(
        { _id: existingPayment._id },
        expect.objectContaining({ $set: expect.objectContaining({ status: "CAPTURED" }) }),
        expect.any(Object)
      );
      expect(mockGrantXP).toHaveBeenCalledWith(1, "PREMIUM_UNLOCK_XP");
      expect(mockRedisClientDel).toHaveBeenCalledWith("entitlement:1");
    });

    it("marks payment FAILED on amount mismatch", async () => {
      const existingPayment = {
        _id: "pay_db_id",
        userId: 1,
        status: "CREATED",
        amount: 99999, // different from payload 50000
        razorpayOrderId: "order_xyz",
      };
      mockPaymentFindOne.mockResolvedValue(existingPayment);

      if (processor) {
        await processor({ data: { event: "payment.captured", payload: capturedPayload, eventId: "evt_002" } });
      }

      expect(mockPaymentUpdateOne).toHaveBeenCalledWith(
        { _id: existingPayment._id },
        expect.objectContaining({ $set: expect.objectContaining({ status: "FAILED", failureReason: "amount_mismatch" }) })
      );
      expect(mockGrantXP).not.toHaveBeenCalled();
    });

    it("ignores duplicate capture (already CAPTURED)", async () => {
      const existingPayment = {
        _id: "pay_db_id",
        userId: 1,
        status: "CAPTURED",
        amount: 50000,
      };
      mockPaymentFindOne.mockResolvedValue(existingPayment);

      if (processor) {
        await processor({ data: { event: "payment.captured", payload: capturedPayload, eventId: "evt_003" } });
      }

      // No updateOne for the transaction path on duplicate
      expect(mockGrantXP).not.toHaveBeenCalled();
    });

    it("returns early when payment record not found", async () => {
      mockPaymentFindOne.mockResolvedValue(null);

      if (processor) {
        await processor({ data: { event: "payment.captured", payload: capturedPayload, eventId: "evt_004" } });
      }

      expect(mockPaymentUpdateOne).not.toHaveBeenCalled();
    });
  });

  describe("payment.failed event", () => {
    it("updates payment status to FAILED", async () => {
      mockPaymentUpdateOne.mockResolvedValue({ modifiedCount: 1 });

      const failedPayload = {
        payment: {
          entity: {
            order_id: "order_xyz",
            error_description: "insufficient_funds",
          },
        },
      };

      if (processor) {
        await processor({ data: { event: "payment.failed", payload: failedPayload, eventId: "evt_005" } });
      }

      expect(mockPaymentUpdateOne).toHaveBeenCalledWith(
        { razorpayOrderId: "order_xyz" },
        expect.objectContaining({
          $set: expect.objectContaining({
            status: "FAILED",
            failureReason: "insufficient_funds",
          }),
        })
      );
    });
  });
});
