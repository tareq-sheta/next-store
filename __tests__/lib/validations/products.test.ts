/**
 * Unit tests for lib/validations/products.ts
 */

import { describe, it, expect } from "@jest/globals";
import {
  CreateProductSchema,
  UpdateProductSchema,
  ListProductsQuerySchema,
  DashboardProductsQuerySchema,
  MAX_PAGE_SIZE,
} from "@/lib/validations/products";
import { CATEGORY_DEFINITIONS } from "@/lib/validations/categories";

const VALID_CATEGORY = CATEGORY_DEFINITIONS[0].slug;

function validCreatePayload(overrides: Record<string, unknown> = {}) {
  return {
    name: "Widget",
    price: 25,
    description: "A fine widget",
    category: VALID_CATEGORY,
    image: "https://example.com/widget.jpg",
    stock: 10,
    ...overrides,
  };
}

describe("CreateProductSchema", () => {
  it("accepts a fully valid payload", () => {
    const result = CreateProductSchema.safeParse(validCreatePayload());
    expect(result.success).toBe(true);
  });

  it("defaults stock to 0 when omitted", () => {
    const { stock, ...payload } = validCreatePayload();
    const result = CreateProductSchema.safeParse(payload);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.stock).toBe(0);
  });

  it("rejects an empty name", () => {
    const result = CreateProductSchema.safeParse(
      validCreatePayload({ name: "" }),
    );
    expect(result.success).toBe(false);
  });

  it("rejects a name over the max length", () => {
    const result = CreateProductSchema.safeParse(
      validCreatePayload({ name: "x".repeat(201) }),
    );
    expect(result.success).toBe(false);
  });

  it("rejects price <= 0", () => {
    expect(
      CreateProductSchema.safeParse(validCreatePayload({ price: 0 })).success,
    ).toBe(false);
    expect(
      CreateProductSchema.safeParse(validCreatePayload({ price: -10 })).success,
    ).toBe(false);
  });

  it("rejects a missing price", () => {
    const { price, ...payload } = validCreatePayload();
    const result = CreateProductSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it("rejects an empty description", () => {
    const result = CreateProductSchema.safeParse(
      validCreatePayload({ description: "" }),
    );
    expect(result.success).toBe(false);
  });

  it("rejects an invalid category not in CATEGORY_DEFINITIONS", () => {
    const result = CreateProductSchema.safeParse(
      validCreatePayload({ category: "not-a-real-category" }),
    );
    expect(result.success).toBe(false);
  });

  it("rejects a non-URL image string", () => {
    const result = CreateProductSchema.safeParse(
      validCreatePayload({ image: "not-a-url" }),
    );
    expect(result.success).toBe(false);
  });

  it("rejects negative stock", () => {
    const result = CreateProductSchema.safeParse(
      validCreatePayload({ stock: -1 }),
    );
    expect(result.success).toBe(false);
  });

  it("rejects non-integer stock", () => {
    const result = CreateProductSchema.safeParse(
      validCreatePayload({ stock: 1.5 }),
    );
    expect(result.success).toBe(false);
  });

  it("rejects unknown extra fields (schema is .strict())", () => {
    const result = CreateProductSchema.safeParse(
      validCreatePayload({ seller: "should-not-be-settable-by-client" }),
    );
    expect(result.success).toBe(false);
  });
});

describe("UpdateProductSchema", () => {
  it("accepts an empty object — all fields optional for partial updates", () => {
    const result = UpdateProductSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("accepts a single-field partial update", () => {
    const result = UpdateProductSchema.safeParse({ price: 99.99 });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid category when provided", () => {
    const result = UpdateProductSchema.safeParse({ category: "bogus" });
    expect(result.success).toBe(false);
  });

  it("rejects a schemeless/malformed image string when provided", () => {
    const result = UpdateProductSchema.safeParse({ image: "not-a-url" });
    expect(result.success).toBe(false);
  });

  it("rejects negative stock when provided", () => {
    const result = UpdateProductSchema.safeParse({ stock: -5 });
    expect(result.success).toBe(false);
  });

  it("rejects unknown fields (schema is .strict())", () => {
    const result = UpdateProductSchema.safeParse({ unitsSold: 999 });
    expect(result.success).toBe(false);
  });
});

describe("ListProductsQuerySchema", () => {
  it("applies defaults (page=1, limit=20) when the query is empty", () => {
    const result = ListProductsQuerySchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(20);
    }
  });

  it("coerces string page/limit query params to numbers", () => {
    // URLSearchParams always yields strings — schema must coerce.
    const result = ListProductsQuerySchema.safeParse({
      page: "3",
      limit: "10",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(3);
      expect(result.data.limit).toBe(10);
      expect(typeof result.data.page).toBe("number");
    }
  });

  it("rejects a limit above MAX_PAGE_SIZE", () => {
    const result = ListProductsQuerySchema.safeParse({
      limit: String(MAX_PAGE_SIZE + 1),
    });
    expect(result.success).toBe(false);
  });

  it("accepts a limit exactly at MAX_PAGE_SIZE", () => {
    const result = ListProductsQuerySchema.safeParse({
      limit: String(MAX_PAGE_SIZE),
    });
    expect(result.success).toBe(true);
  });

  it("rejects page <= 0", () => {
    expect(ListProductsQuerySchema.safeParse({ page: "0" }).success).toBe(
      false,
    );
    expect(ListProductsQuerySchema.safeParse({ page: "-1" }).success).toBe(
      false,
    );
  });

  it("rejects a non-numeric page value", () => {
    const result = ListProductsQuerySchema.safeParse({ page: "not-a-number" });
    expect(result.success).toBe(false);
  });

  it("accepts an optional valid category filter", () => {
    const result = ListProductsQuerySchema.safeParse({
      category: VALID_CATEGORY,
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid category filter", () => {
    const result = ListProductsQuerySchema.safeParse({ category: "bogus" });
    expect(result.success).toBe(false);
  });

  it("rejects an empty-string search term", () => {
    const result = ListProductsQuerySchema.safeParse({ search: "" });
    expect(result.success).toBe(false);
  });

  it("accepts and trims a valid search term", () => {
    const result = ListProductsQuerySchema.safeParse({ search: "widget" });
    expect(result.success).toBe(true);
  });
});

describe("DashboardProductsQuerySchema", () => {
  it("applies the same page/limit defaults as ListProductsQuerySchema", () => {
    const result = DashboardProductsQuerySchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(20);
    }
  });

  it("rejects a limit above MAX_PAGE_SIZE", () => {
    const result = DashboardProductsQuerySchema.safeParse({
      limit: String(MAX_PAGE_SIZE + 1),
    });
    expect(result.success).toBe(false);
  });
});
