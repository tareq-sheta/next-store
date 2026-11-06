import type { Config } from "jest";

const config: Config = {
  // API routes run on the server — no DOM needed.
  testEnvironment: "node",

  // Use ts-jest so we can import .ts files directly.
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
        // Disable type-checking in tests for speed; tsc --noEmit covers that.
        diagnostics: false,
      },
    ],
  },

  // Mirror the tsconfig `paths` so @/ imports resolve correctly.
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },

  // Only look for tests inside __tests__/
  testMatch: ["<rootDir>/__tests__/**/*.test.ts"],

  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],

  // Shared setup — clears mocks between tests.
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};

export default config;
