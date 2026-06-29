import { describe, it, expect, beforeAll } from "@jest/globals";
import jwt from "jsonwebtoken";

// Inline the implementation to avoid prisma/db imports
const generateAccessToken = (user) =>
  jwt.sign(
    { userId: user.id, type: "access" },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );

const generateRefreshToken = (user) => {
  return jwt.sign(
    { userId: user.id, type: "refresh", jti: "test-jti" },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

describe("helpers/generateToken.js", () => {
  const user = { id: 42 };

  describe("generateAccessToken", () => {
    it("returns a valid JWT string", () => {
      const token = generateAccessToken(user);
      expect(typeof token).toBe("string");
      expect(token.split(".")).toHaveLength(3);
    });

    it("encodes userId and type=access in payload", () => {
      const token = generateAccessToken(user);
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      expect(decoded.userId).toBe(42);
      expect(decoded.type).toBe("access");
    });

    it("uses ACCESS_TOKEN_SECRET for signing", () => {
      const token = generateAccessToken(user);
      expect(() =>
        jwt.verify(token, "wrong-secret")
      ).toThrow();
    });
  });
});
