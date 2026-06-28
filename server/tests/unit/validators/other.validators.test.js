import { describe, it, expect } from "@jest/globals";
import {
  createOrderSchema,
  verifyPaymentValidator,
  refundSchema,
} from "../../../validators/payment.validator.js";
import { noteValidator } from "../../../validators/note.validator.js";
import { ragQueryValidator } from "../../../validators/ragQuery.validator.js";
import { idParamValidator } from "../../../validators/params.validator.js";
import { flashcardValidator } from "../../../validators/flashcard.validator.js";

describe("validators/payment.validator.js", () => {
  describe("createOrderSchema", () => {
    it("passes with valid productType", () => {
      const { error } = createOrderSchema.safeParse({ productType: "premium_unlock" });
      expect(error).toBeUndefined();
    });

    it("rejects unknown productType", () => {
      const { error } = createOrderSchema.safeParse({ productType: "free_plan" });
      expect(error).toBeDefined();
    });
  });

  describe("verifyPaymentValidator", () => {
    it("passes with all required razorpay fields", () => {
      const { error } = verifyPaymentValidator.safeParse({
        razorpay_order_id: "order_abc",
        razorpay_payment_id: "pay_xyz",
        razorpay_signature: "sig_123",
      });
      expect(error).toBeUndefined();
    });

    it("rejects missing razorpay_signature", () => {
      const { error } = verifyPaymentValidator.safeParse({
        razorpay_order_id: "order_abc",
        razorpay_payment_id: "pay_xyz",
      });
      expect(error).toBeDefined();
    });
  });

  describe("refundSchema", () => {
    it("passes with required fields only", () => {
      const { error } = refundSchema.safeParse({
        paymentId: "pay_abc",
        reason: "customer_request",
      });
      expect(error).toBeUndefined();
    });

    it("passes with optional amount", () => {
      const { error } = refundSchema.safeParse({
        paymentId: "pay_abc",
        reason: "duplicate",
        amount: 5000,
      });
      expect(error).toBeUndefined();
    });

    it("rejects zero amount", () => {
      const { error } = refundSchema.safeParse({
        paymentId: "pay_abc",
        reason: "duplicate",
        amount: 0,
      });
      expect(error).toBeDefined();
    });
  });
});

describe("validators/note.validator.js", () => {
  it("passes with valid content", () => {
    const { error } = noteValidator.safeParse({ content: "Hello world" });
    expect(error).toBeUndefined();
  });

  it("rejects content shorter than 2 chars", () => {
    const { error } = noteValidator.safeParse({ content: "H" });
    expect(error).toBeDefined();
  });

  it("rejects content exceeding 10000 chars", () => {
    const { error } = noteValidator.safeParse({ content: "x".repeat(10001) });
    expect(error).toBeDefined();
  });
});

describe("validators/params.validator.js", () => {
  it("passes with non-empty id", () => {
    const { error } = idParamValidator.safeParse({ id: "abc123" });
    expect(error).toBeUndefined();
  });

  it("rejects empty string id", () => {
    const { error } = idParamValidator.safeParse({ id: "" });
    expect(error).toBeDefined();
  });

  it("rejects missing id", () => {
    const { error } = idParamValidator.safeParse({});
    expect(error).toBeDefined();
  });
});

describe("validators/ragQuery.validator.js", () => {
  it("passes with valid query", () => {
    const { error } = ragQueryValidator.safeParse({ query: "What is photosynthesis?" });
    expect(error).toBeUndefined();
  });

  it("rejects empty query", () => {
    const { error } = ragQueryValidator.safeParse({ query: "" });
    expect(error).toBeDefined();
    expect(error.issues[0].message).toBe("Query cannot be empty");
  });

  it("rejects query exceeding 5000 chars", () => {
    const { error } = ragQueryValidator.safeParse({ query: "q".repeat(5001) });
    expect(error).toBeDefined();
  });
});

describe("validators/flashcard.validator.js", () => {
  it("passes with all optional fields absent", () => {
    const { error } = flashcardValidator.safeParse({});
    expect(error).toBeUndefined();
  });

  it("passes with valid topic and subject", () => {
    const { error } = flashcardValidator.safeParse({
      topic: "Photosynthesis",
      subject: "Biology",
    });
    expect(error).toBeUndefined();
  });

  it("rejects topic shorter than 2 chars", () => {
    const { error } = flashcardValidator.safeParse({ topic: "X", subject: "Bio" });
    expect(error).toBeDefined();
  });
});
