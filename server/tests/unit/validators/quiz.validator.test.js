import { describe, it, expect } from "@jest/globals";
import {
  quizValidator,
  answersValidator,
  generateQuizFromFilesValidator,
} from "../../../validators/quizValidator.js";

describe("validators/quizValidator.js", () => {
  describe("quizValidator", () => {
    const valid = {
      subject: "Mathematics",
      topic: "Algebra",
      title: "Algebra Quiz",
      types: [{ type: "multiple-choice", count: 5 }],
    };

    it("passes with minimal valid data", () => {
      const { error } = quizValidator.safeParse(valid);
      expect(error).toBeUndefined();
    });

    it("passes with all optional fields", () => {
      const { error } = quizValidator.safeParse({
        ...valid,
        difficulty: "hard",
        audience: "GCSE students",
        quizId: "some-id",
      });
      expect(error).toBeUndefined();
    });

    it("rejects invalid difficulty enum", () => {
      const { error } = quizValidator.safeParse({
        ...valid,
        difficulty: "extreme",
      });
      expect(error).toBeDefined();
    });

    it("rejects invalid question type", () => {
      const { error } = quizValidator.safeParse({
        ...valid,
        types: [{ type: "essay", count: 5 }],
      });
      expect(error).toBeDefined();
    });

    it("rejects empty types array", () => {
      const { error } = quizValidator.safeParse({ ...valid, types: [] });
      expect(error).toBeDefined();
    });

    it("rejects count of 0", () => {
      const { error } = quizValidator.safeParse({
        ...valid,
        types: [{ type: "true-false", count: 0 }],
      });
      expect(error).toBeDefined();
    });

    it("rejects count exceeding 50", () => {
      const { error } = quizValidator.safeParse({
        ...valid,
        types: [{ type: "true-false", count: 51 }],
      });
      expect(error).toBeDefined();
    });
  });

  describe("answersValidator", () => {
    it("passes with valid answers array", () => {
      const { error } = answersValidator.safeParse({ answers: ["A", "B"] });
      expect(error).toBeUndefined();
    });

    it("rejects empty answers array", () => {
      const { error } = answersValidator.safeParse({ answers: [] });
      expect(error).toBeDefined();
    });

    it("rejects answers containing empty strings", () => {
      const { error } = answersValidator.safeParse({ answers: [""] });
      expect(error).toBeDefined();
    });
  });

  describe("generateQuizFromFilesValidator", () => {
    it("passes with valid numeric total", () => {
      const { error } = generateQuizFromFilesValidator.safeParse({
        types: [{ type: "fill-blank", count: 3 }],
        total: 10,
      });
      expect(error).toBeUndefined();
    });

    it("coerces string total to number", () => {
      const { data, error } = generateQuizFromFilesValidator.safeParse({
        types: [{ type: "fill-blank", count: 3 }],
        total: "10",
      });
      expect(error).toBeUndefined();
      expect(data.total).toBe(10);
    });

    it("coerces string JSON types", () => {
      const { data, error } = generateQuizFromFilesValidator.safeParse({
        types: JSON.stringify([{ type: "short-answer", count: 2 }]),
        total: 5,
      });
      expect(error).toBeUndefined();
      expect(data.types[0].type).toBe("short-answer");
    });

    it("rejects total above 200", () => {
      const { error } = generateQuizFromFilesValidator.safeParse({
        types: [{ type: "true-false", count: 1 }],
        total: 201,
      });
      expect(error).toBeDefined();
    });
  });
});
