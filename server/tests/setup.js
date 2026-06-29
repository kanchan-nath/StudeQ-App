import { jest } from "@jest/globals";

// ─── Env ──────────────────────────────────────────────────────
process.env.NODE_ENV = "test";
process.env.POSTGRES_URL = "postgresql://test:test@localhost:5432/testdb";
process.env.ACCESS_TOKEN_SECRET = "test-access-secret";
process.env.REFRESH_TOKEN_SECRET = "test-refresh-secret";
process.env.ACCESS_TOKEN_EXPIRY = "15m";
process.env.REFRESH_TOKEN_EXPIRY = "7d";
process.env.BCRYPT_SALT_ROUNDS = "1";
process.env.REFRESH_TOKEN_SALT_ROUNDS = "1";
process.env.USER_CACHE_TTL_SECONDS = "60";
process.env.RAZORPAY_WEBHOOK_SECRET = "test-webhook-secret";
process.env.RAZORPAY_KEY_ID = "test-key-id";
process.env.RAZORPAY_KEY_SECRET = "test-key-secret";
process.env.CORS_ORIGINS = "http://localhost:5173";
process.env.GROQ_API_KEY = "test-groq-key";
process.env.PINECONE_API_KEY = "test-pinecone-key";
process.env.PINECONE_INDEX_NAME = "test-index";
process.env.PINECONE_NAMESPACE = "test-ns";
process.env.MAX_UPLOAD_SIZE_MB = "20";
process.env.UPLOAD_DIR = "/tmp/test-uploads";
