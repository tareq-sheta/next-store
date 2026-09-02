/**
 * Unit tests for lib/validations/orders.ts
 *
 * Pure Zod schema tests — no HTTP, no mocking. Each schema is exercised
 * with both a valid payload and every distinct invalid-input class it
 * guards against, and we assert on `.success` plus (where useful) the
 * shape of `.error.issues` so route-level 400 tests can trust it.
 */

import { describe, it, expect } from "@jest/globals";
import {
  CreateOrderSchema,
  UpdateOrderSchema,
  SellerUpdateItemStatusSchema,
} from "@/lib/validations/orders";

const VALID_PRODUCT_ID = "111111111111111111111101";
const VALID_USER_ID = "cccccccccccccccccccccc01";

describe("CreateOrderSchema", () => {
  it("accepts a valid payload", () => {
    const result = CreateOrderSchema.safeParse({
      user: VALID_USER_ID,
      products: [{ product: VALID_PRODUCT_ID, quantity: 2 }],
    });
    expect(result.success).toBe(true);
  });

  it("accepts an optional productStatus on a line item", () => {
    const result = CreateOrderSchema.safeParse({
      user: VALID_USER_ID,
      products: [
        { product: VALID_PRODUCT_ID, quantity: 1, productStatus: "shipped" },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("rejects a missing user field", () => {
    const result = CreateOrderSchema.safeParse({
      products: [{ product: VALID_PRODUCT_ID, quantity: 1 }],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("user"))).toBe(
        true,
      );
    }
  });

  it("rejects a missing products field", () => {
    const result = CreateOrderSchema.safeParse({ user: VALID_USER_ID });
    expect(result.success).toBe(false);
  });

  it("rejects an empty products array", () => {
    const result = CreateOrderSchema.safeParse({
      user: VALID_USER_ID,
      products: [],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "At least one product is required",
      );
    }
  });

  it("rejects a malformed product ObjectId", () => {
    const result = CreateOrderSchema.safeParse({
      user: VALID_USER_ID,
      products: [{ product: "not-an-objectid", quantity: 1 }],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Invalid id");
    }
  });

  it("rejects a malformed user ObjectId", () => {
    const result = CreateOrderSchema.safeParse({
      user: "not-an-objectid",
      products: [{ product: VALID_PRODUCT_ID, quantity: 1 }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects zero quantity", () => {
    const result = CreateOrderSchema.safeParse({
      user: VALID_USER_ID,
      products: [{ product: VALID_PRODUCT_ID, quantity: 0 }],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Quantity must be at least 1",
      );
    }
  });

  it("rejects negative quantity", () => {
    const result = CreateOrderSchema.safeParse({
      user: VALID_USER_ID,
      products: [{ product: VALID_PRODUCT_ID, quantity: -5 }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-integer quantity", () => {
    const result = CreateOrderSchema.safeParse({
      user: VALID_USER_ID,
      products: [{ product: VALID_PRODUCT_ID, quantity: 1.5 }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid productStatus enum value", () => {
    const result = CreateOrderSchema.safeParse({
      user: VALID_USER_ID,
      products: [
        {
          product: VALID_PRODUCT_ID,
          quantity: 1,
          productStatus: "not-a-status",
        },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("does NOT accept a top-level orderStatus (new orders always start pending)", () => {
    const result = CreateOrderSchema.safeParse({
      user: VALID_USER_ID,
      products: [{ product: VALID_PRODUCT_ID, quantity: 1 }],
      orderStatus: "delivered",
    });
    // Not .strict(), so unknown keys are silently stripped, not rejected —
    // assert the parsed data never carries the field through.
    expect(result.success).toBe(true);
    if (result.success) {
      expect((result.data as any).orderStatus).toBeUndefined();
    }
  });
});

describe("UpdateOrderSchema", () => {
  it("accepts a full product-list replacement", () => {
    const result = UpdateOrderSchema.safeParse({
      products: [
        { product: VALID_PRODUCT_ID, quantity: 3, productStatus: "shipped" },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("accepts an empty object (products is optional)", () => {
    const result = UpdateOrderSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("rejects an empty products array when the key is present", () => {
    const result = UpdateOrderSchema.safeParse({ products: [] });
    expect(result.success).toBe(false);
  });

  it("rejects unknown top-level fields (schema is .strict())", () => {
    const result = UpdateOrderSchema.safeParse({ extraField: "not allowed" });
    expect(result.success).toBe(false);
  });

  it("rejects a top-level orderStatus field — recalculated server-side only", () => {
    const result = UpdateOrderSchema.safeParse({ orderStatus: "delivered" });
    expect(result.success).toBe(false);
  });

  it("rejects a malformed product id inside the products array", () => {
    const result = UpdateOrderSchema.safeParse({
      products: [{ product: "bad-id", quantity: 1 }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects zero/negative quantity inside the products array", () => {
    const result = UpdateOrderSchema.safeParse({
      products: [{ product: VALID_PRODUCT_ID, quantity: 0 }],
    });
    expect(result.success).toBe(false);
  });
});

describe("SellerUpdateItemStatusSchema", () => {
  it("accepts a valid productStatus", () => {
    const result = SellerUpdateItemStatusSchema.safeParse({
      productStatus: "shipped",
    });
    expect(result.success).toBe(true);
  });

  it.each(["pending", "shipped", "delivered", "cancelled"])(
    "accepts each valid status value: %s",
    (status) => {
      const result = SellerUpdateItemStatusSchema.safeParse({
        productStatus: status,
      });
      expect(result.success).toBe(true);
    },
  );

  it("rejects a missing productStatus", () => {
    const result = SellerUpdateItemStatusSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rejects an invalid enum value", () => {
    const result = SellerUpdateItemStatusSchema.safeParse({
      productStatus: "in-transit",
    });
    expect(result.success).toBe(false);
  });

  it("rejects extra fields — sellers may only touch productStatus (schema is .strict())", () => {
    const result = SellerUpdateItemStatusSchema.safeParse({
      productStatus: "shipped",
      quantity: 5,
    });
    expect(result.success).toBe(false);
  });
});
