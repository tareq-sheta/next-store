// jest.setup.ts — Runs once before each test file.

// Ensure we're in test mode for CustomError location stripping, etc.
// process.env.NODE_ENV = "test";

// Reset all mocks between tests so no state leaks across test cases.
afterEach(() => {
  jest.clearAllMocks();
});
