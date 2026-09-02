/**
 * Unit tests for utils/ErrorHandler.ts
 *
 * This is the single chokepoint every route handler funnels caught errors
 * through — it's what's responsible for the "clean 500, no stack trace"
 * requirement, so it gets tested in isolation here before any route relies
 * on it.
 */

import { describe, it, expect, afterEach } from "@jest/globals";
import { CustomError, handleError } from "@/utils/ErrorHandler";

const ORIGINAL_NODE_ENV = process.env.NODE_ENV;

// Next.js's bundled global types declare `NODE_ENV` as readonly on
// `NodeJS.ProcessEnv` (it's only ever mutated by the Next.js CLI itself).
// That's correct guidance for app code, but tests legitimately need to
// flip it to exercise both the dev and production branches of
// CustomError/handleError — so we go through `Object.defineProperty`
// rather than fighting the readonly type with a broad `any` cast.
function setNodeEnv(value: string | undefined) {
  (process.env as Record<string, string | undefined>).NODE_ENV = value;
}

afterEach(() => {
  setNodeEnv(ORIGINAL_NODE_ENV);
});

describe("CustomError", () => {
  it("sets message and status from the constructor args", () => {
    const err = new CustomError("Not found", 404, "test.location");
    expect(err.message).toBe("Not found");
    expect(err.status).toBe(404);
    expect(err).toBeInstanceOf(Error);
  });

  it("exposes `location` outside production", () => {
    setNodeEnv("development");
    const err = new CustomError("Forbidden", 403, "orders.PATCH");
    expect(err.location).toBe("orders.PATCH");
  });

  //   it("suppresses `location` in production", () => {
  //     setNodeEnv("production");
  //     const err = new CustomError("Forbidden", 403, "orders.PATCH");
  //     expect(err.location).toBeUndefined();
  //   });
  it("suppresses location in production", () => {
    jest.replaceProperty(process.env, "NODE_ENV", "production");
    const err = new CustomError("Forbidden", 403, "orders.PATCH");
    expect(err.location).toBeUndefined();
  });

  it("defaults location to an empty string when not provided (non-production)", () => {
    setNodeEnv("development");
    const err = new CustomError("Bad request", 400);
    expect(err.location).toBe("");
  });
});

describe("handleError", () => {
  it("returns the CustomError's own status and message", async () => {
    setNodeEnv("development");
    const res = handleError(
      new CustomError("Order not found", 404, "orders.GET"),
      "fallback",
    );
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json).toEqual({
      success: false,
      error: "Order not found",
      location: "orders.GET",
    });
  });

  it("omits `location` from the response body in production, even for a CustomError", async () => {
    setNodeEnv("production");
    const res = handleError(
      new CustomError("Forbidden", 403, "orders.PATCH"),
      "fallback",
    );
    const json = await res.json();

    expect(res.status).toBe(403);
    expect(json.success).toBe(false);
    expect(json.error).toBe("Forbidden");
    expect(json).not.toHaveProperty("location");
  });

  it("falls back to a clean 500 for a plain (unexpected) Error", async () => {
    const res = handleError(
      new Error("connection reset by peer"),
      "Failed to fetch orders",
    );
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.success).toBe(false);
    expect(json.error).toBe("Failed to fetch orders");
  });

  it("never leaks the original error message or stack trace for a non-CustomError", async () => {
    const sensitiveMessage =
      "ECONNREFUSED 127.0.0.1:27017 mongodb://admin:s3cr3t@host";
    const res = handleError(
      new Error(sensitiveMessage),
      "Failed to fetch orders",
    );
    const json = await res.json();
    const rawBody = JSON.stringify(json);

    expect(rawBody).not.toContain(sensitiveMessage);
    expect(rawBody).not.toContain("s3cr3t");
    expect(json.error).toBe("Failed to fetch orders");
  });

  it("returns a clean 500 for a thrown non-Error value (e.g. a rejected string/object)", async () => {
    const res = handleError(
      "just a string, not an Error instance",
      "Failed to fetch orders",
    );
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Failed to fetch orders");
  });

  it("returns a clean 500 for a database-timeout-style error", async () => {
    const dbTimeout = new Error(
      "MongooseError: Operation `orders.find()` timed out after 5000ms",
    );
    const res = handleError(dbTimeout, "Failed to fetch orders");
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Failed to fetch orders");
    expect(JSON.stringify(json)).not.toContain("timed out after 5000ms");
  });
});
