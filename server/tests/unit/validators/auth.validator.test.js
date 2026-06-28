import { describe, it, expect } from "@jest/globals";
import { registerValidator, loginValidator } from "../../../validators/auth.validator.js";

describe("validators/auth.validator.js", () => {
  describe("registerValidator", () => {
    it("passes with valid registration data", () => {
      const { data, error } = registerValidator.safeParse({
        name: "Kanchan Dev",
        email: "kanchan@example.com",
        password: "securepass123",
        grade: "10",
      });
      expect(error).toBeUndefined();
      expect(data.email).toBe("kanchan@example.com");
    });

    it("rejects name shorter than 2 chars", () => {
      const { error } = registerValidator.safeParse({
        name: "K",
        email: "k@example.com",
        password: "pass1234",
        grade: "10",
      });
      expect(error).toBeDefined();
      expect(error.issues[0].message).toBe("Name must be at least 2 characters");
    });

    it("rejects name longer than 50 chars", () => {
      const { error } = registerValidator.safeParse({
        name: "K".repeat(51),
        email: "k@example.com",
        password: "pass1234",
        grade: "10",
      });
      expect(error).toBeDefined();
      expect(error.issues[0].message).toBe("Name must be at most 50 characters");
    });

    it("rejects invalid email format", () => {
      const { error } = registerValidator.safeParse({
        name: "Kanchan",
        email: "not-an-email",
        password: "pass1234",
        grade: "10",
      });
      expect(error).toBeDefined();
      expect(error.issues[0].message).toBe("Invalid email address");
    });

    it("rejects password shorter than 8 chars", () => {
      const { error } = registerValidator.safeParse({
        name: "Kanchan",
        email: "k@example.com",
        password: "short",
        grade: "10",
      });
      expect(error).toBeDefined();
      expect(error.issues[0].message).toBe("Password must be at least 8 characters");
    });

    it("rejects password longer than 100 chars", () => {
      const { error } = registerValidator.safeParse({
        name: "Kanchan",
        email: "k@example.com",
        password: "p".repeat(101),
        grade: "10",
      });
      expect(error).toBeDefined();
      expect(error.issues[0].message).toBe("Password must be at most 100 characters");
    });

    it("rejects missing grade", () => {
      const { error } = registerValidator.safeParse({
        name: "Kanchan",
        email: "k@example.com",
        password: "pass1234",
      });
      expect(error).toBeDefined();
    });
  });

  describe("loginValidator", () => {
    it("passes with valid login data", () => {
      const { data, error } = loginValidator.safeParse({
        email: "user@example.com",
        password: "mypassword",
      });
      expect(error).toBeUndefined();
      expect(data.email).toBe("user@example.com");
    });

    it("rejects invalid email", () => {
      const { error } = loginValidator.safeParse({
        email: "bad-email",
        password: "mypassword",
      });
      expect(error).toBeDefined();
      expect(error.issues[0].message).toBe("Invalid email address");
    });

    it("rejects password shorter than 6 chars", () => {
      const { error } = loginValidator.safeParse({
        email: "user@example.com",
        password: "ab",
      });
      expect(error).toBeDefined();
      expect(error.issues[0].message).toBe("Password must be at least 6 characters");
    });

    it("rejects missing password", () => {
      const { error } = loginValidator.safeParse({
        email: "user@example.com",
      });
      expect(error).toBeDefined();
    });
  });
});
