# StudeQ Backend Test Suite

## Stack

- **Runner**: Jest (ESM mode)
- **HTTP**: Supertest
- **In-memory DB**: `mongodb-memory-server` (for model tests)
- **Mocking**: `jest.mock()` — zero real DB/Redis/Groq calls

---

## Directory Map

```
tests/
├── setup.js                          # Env var injection (runs before all tests)
├── jest.config.js                    # Jest config
├── __mocks__/
│   └── helpers.js                    # Shared mockReq/mockRes/mockNext/fixture objects
├── unit/
│   ├── controllers/
│   │   ├── note.controller.test.js
│   │   ├── user.controller.test.js
│   │   ├── health.controller.test.js
│   │   └── webhook.controller.test.js
│   ├── services/
│   │   ├── chunking.test.js
│   │   └── cron.test.js
│   ├── utils/
│   │   └── generateToken.test.js
│   └── validators/
│       ├── auth.validator.test.js
│       ├── quiz.validator.test.js
│       └── other.validators.test.js
├── integration/
│   └── routes/
│       ├── _app.js                   # App factory with all deps mocked
│       ├── auth.routes.test.js
│       ├── notes.routes.test.js
│       ├── health.routes.test.js
│       └── errors.routes.test.js
├── middleware/
│   └── auth.middleware.test.js
├── models/
│   └── models.test.js                # Uses mongodb-memory-server
└── workers/
    └── payment.worker.test.js
```

---

## Env Vars Required

All injected via `setup.js` — no `.env` file needed for test run. Values:

| Var | Test value |
|-----|-----------|
| `NODE_ENV` | `test` |
| `ACCESS_TOKEN_SECRET` | `test-access-secret` |
| `REFRESH_TOKEN_SECRET` | `test-refresh-secret` |
| `ACCESS_TOKEN_EXPIRY` | `15m` |
| `REFRESH_TOKEN_EXPIRY` | `7d` |
| `BCRYPT_SALT_ROUNDS` | `1` (fast) |
| `USER_CACHE_TTL_SECONDS` | `60` |
| `RAZORPAY_WEBHOOK_SECRET` | `test-webhook-secret` |

---

## Install

```bash
npm install --save-dev jest supertest mongodb-memory-server
```

Or add to `package.json`:

```json
{
  "devDependencies": {
    "jest": "^29.x",
    "supertest": "^7.x",
    "mongodb-memory-server": "^10.x"
  }
}
```

---

## Run

```bash
# All tests
npx jest --config tests/jest.config.js

# Watch mode
npx jest --config tests/jest.config.js --watch

# Coverage report
npx jest --config tests/jest.config.js --coverage

# Single file
npx jest tests/unit/controllers/note.controller.test.js

# Pattern match
npx jest --testPathPattern="unit/controllers"
```

---

## ESM Note

Codebase uses ESM (`"type": "module"` or `.js` imports with extensions).
Jest needs `--experimental-vm-modules`:

```json
// package.json scripts
"test": "NODE_OPTIONS='--experimental-vm-modules' jest --config tests/jest.config.js"
```

Or set in `jest.config.js` via `extensionsToTreatAsEsm` + `transform: {}`.

---

## Coverage Targets

| Category | Target |
|----------|--------|
| Statements | 80% |
| Branches | 70% |
| Functions | 80% |
| Lines | 80% |

Run `npx jest --coverage` to see breakdown per file.

---

## What's Mocked

| Dependency | Mock strategy |
|-----------|--------------|
| Prisma | `jest.mock` returning fake methods |
| MongoDB/Mongoose | `jest.mock` for controller tests; `mongodb-memory-server` for model schema tests |
| Redis | `jest.mock` returning resolved values |
| Groq / NVIDIA / LLM calls | `jest.mock` on `lib/groq/*.js` |
| BullMQ Worker | `jest.mock('bullmq')` capturing processor fn |
| Rate limiters | Bypassed via `(req, res, next) => next()` |
| Logger (Winston/pino) | `jest.mock` silencing output |
| bcrypt | `jest.mock` — avoids slow hashing |
| JWT | Real `jsonwebtoken` — tests actual token logic |

---

## Adding Tests

1. Mirror source path: `controllers/foo.controller.js` → `tests/unit/controllers/foo.controller.test.js`
2. Mock ALL external deps at top of file before any import
3. Use `mockReq()` / `mockRes()` / `mockNext()` from `__mocks__/helpers.js`
4. Each `it()` tests exactly one behavior
5. Never share state between tests — `beforeEach(() => jest.clearAllMocks())`
