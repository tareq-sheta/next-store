/**
 * Unit tests for utils/mongoose.ts
 */

import { describe, it, expect } from "@jest/globals";
import { omitId, isValidObjectId } from "@/utils/mongoose";
import { Types } from "mongoose";

describe("omitId", () => {
  it("strips the _id field and keeps every other field intact", () => {
    const input = { _id: "abc123", name: "Widget", price: 25 };
    const result = omitId(input);

    expect(result).toEqual({ name: "Widget", price: 25 });
    expect(result).not.toHaveProperty("_id");
  });

  it("returns the object unchanged (minus _id) when _id is already absent", () => {
    const input = { name: "Widget", price: 25 } as {
      _id?: unknown;
      name: string;
      price: number;
    };
    const result = omitId(input);
    expect(result).toEqual({ name: "Widget", price: 25 });
  });

  it("does not mutate the original object", () => {
    const input = { _id: "abc123", name: "Widget" };
    omitId(input);
    expect(input).toHaveProperty("_id");
  });

  it("works with an ObjectId-typed _id", () => {
    const input = { _id: new Types.ObjectId(), name: "Widget" };
    const result = omitId(input);
    expect(result).toEqual({ name: "Widget" });
  });
});

describe("isValidObjectId", () => {
  it("returns true for a valid 24-char hex ObjectId string", () => {
    expect(isValidObjectId("aaaaaaaaaaaaaaaaaaaaaa01")).toBe(true);
  });

  it("returns true for a freshly generated ObjectId's string form", () => {
    expect(isValidObjectId(new Types.ObjectId().toString())).toBe(true);
  });

  it("returns false for a string that's too short", () => {
    expect(isValidObjectId("abc123")).toBe(false);
  });

  it("returns false for a non-hex string of the right length", () => {
    expect(isValidObjectId("zzzzzzzzzzzzzzzzzzzzzzzz")).toBe(false);
  });

  it("returns false for an empty string", () => {
    expect(isValidObjectId("")).toBe(false);
  });

  it("returns false for a UUID-shaped string (common client-side mistake)", () => {
    expect(isValidObjectId("550e8400-e29b-41d4-a716-446655440000")).toBe(false);
  });
});
