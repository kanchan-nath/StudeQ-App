export default {
  testEnvironment: "node",
  transform: {},
  extensionsToTreatAsEsm: [],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  testMatch: [
    "**/tests/**/*.test.js",
  ],
  // setupFilesAfterEach: [],
  setupFiles: ["./setup.js"],
  collectCoverageFrom: [
    "../controllers/**/*.js",
    "../services/**/*.js",
    "../utils/**/*.js",
    "../validators/**/*.js",
    "../middlewares/**/*.js",
    "../models/**/*.js",
    "../helpers/**/*.js",
    "../worker/**/*.js",
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testTimeout: 15000,
};
