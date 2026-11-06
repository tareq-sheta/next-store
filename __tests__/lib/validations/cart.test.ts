/**
 * Unit tests for lib/validations/cart.ts
 */

import { describe, it, expect } from "@jest/globals";
import { AddToCartSchema, QuantitySchema } from "@/lib/validations/cart";

const VALID_PRODUCT_ID = "111111111111111111111101";

describe("AddToCartSchema", () => {
  it("accepts a valid single-item payload", () => {
    const result = AddToCartSchema.safeParse({
      products: [{ product: VALID_PRODUCT_ID, quantity: 1 }],
    });
    expect(result.success).toBe(true);
  });

  it("accepts multiple valid line items", () => {
    const result = AddToCartSchema.safeParse({
      products: [
        { product: VALID_PRODUCT_ID, quantity: 1 },
        { product: "222222222222222222222201", quantity: 3 },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("rejects an empty products array", () => {
    const result = AddToCartSchema.safeParse({ products: [] });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "At least one product is required",
      );
    }
  });

  it("rejects a missing products field", () => {
    const result = AddToCartSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rejects a malformed product ObjectId", () => {
    const result = AddToCartSchema.safeParse({
      products: [{ product: "not-an-objectid", quantity: 1 }],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Invalid product ID format");
    }
  });

  it("rejects zero quantity", () => {
    const result = AddToCartSchema.safeParse({
      products: [{ product: VALID_PRODUCT_ID, quantity: 0 }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects quantity above the 999 cap", () => {
    const result = AddToCartSchema.safeParse({
      products: [{ product: VALID_PRODUCT_ID, quantity: 1000 }],
    });
    expect(result.success).toBe(false);
  });

  it("accepts quantity exactly at the 999 cap", () => {
    const result = AddToCartSchema.safeParse({
      products: [{ product: VALID_PRODUCT_ID, quantity: 999 }],
    });
    expect(result.success).toBe(true);
  });

  it("rejects unknown top-level fields (schema is .strict())", () => {
    const result = AddToCartSchema.safeParse({
      products: [{ product: VALID_PRODUCT_ID, quantity: 1 }],
      user: "should-not-be-here",
    });
    expect(result.success).toBe(false);
  });
});

describe("QuantitySchema", () => {
  it("accepts a valid positive integer quantity", () => {
    const result = QuantitySchema.safeParse({ quantity: 5 });
    expect(result.success).toBe(true);
  });

  it("rejects zero", () => {
    const result = QuantitySchema.safeParse({ quantity: 0 });
    expect(result.success).toBe(false);
  });

  it("rejects negative quantity", () => {
    const result = QuantitySchema.safeParse({ quantity: -1 });
    expect(result.success).toBe(false);
  });

  it("rejects a non-integer quantity", () => {
    const result = QuantitySchema.safeParse({ quantity: 1.5 });
    expect(result.success).toBe(false);
  });

  it("rejects a missing quantity field", () => {
    const result = QuantitySchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
