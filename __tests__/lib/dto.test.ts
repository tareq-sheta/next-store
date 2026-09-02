/**
 * Unit tests for lib/dto.ts
 *
 * Pure functions — no mocking required. Every mapper takes a Mongoose
 * "doc-shaped" object and returns a plain client-safe DTO. We verify:
 *  • Correct field mapping / renaming
 *  • ObjectId → string coercion
 *  • Date → ISO string coercion (including missing-date fallback to "")
 *  • Computed fields (e.g. totalPrice, netPrice, stockStatus)
 *  • Defensive fallbacks for optional/missing nested data (e.g. seller)
 */

import { describe, it, expect } from "@jest/globals";
import mongoose from "mongoose";
import {
  toCartDTO,
  toPublicProductDTO,
  toSellerProductDTO,
  toAdminProductDTO,
  toCategoryDTO,
  toOrderDTO,
  toUserDTO,
} from "@/lib/dto";

// Deterministically derives a valid 24-char hex ObjectId from any seed
// string, so tests stay readable ("user1", "prod1") without hand-rolling
// hex literals — plain padding would fail for non-hex characters (e.g.
// "cart1" contains 'c', 'a', 'r', 't', and 'r'/'t' aren't valid hex).
const oid = (seed: string) =>
  new mongoose.Types.ObjectId(
    Buffer.from(seed).toString("hex").padEnd(24, "0").slice(0, 24),
  );

describe("toCartDTO", () => {
  it("maps a cart doc to a CartDTO, stringifying ids and dates", () => {
    const doc = {
      _id: oid("cart1"),
      user: oid("user1"),
      products: [
        { product: oid("prod1"), quantity: 2 },
        { product: oid("prod2"), quantity: 5 },
      ],
      createdAt: new Date("2026-01-01T00:00:00Z"),
      updatedAt: new Date("2026-01-02T00:00:00Z"),
    } as any;

    const dto = toCartDTO(doc);

    expect(dto._id).toBe(doc._id.toString());
    expect(dto.user).toBe(doc.user.toString());
    expect(dto.products).toEqual([
      { product: doc.products[0].product.toString(), quantity: 2 },
      { product: doc.products[1].product.toString(), quantity: 5 },
    ]);
    expect(dto.createdAt).toBe("2026-01-01T00:00:00.000Z");
    expect(dto.updatedAt).toBe("2026-01-02T00:00:00.000Z");
  });

  it("falls back to empty string when dates are missing", () => {
    const doc = {
      _id: oid("cart2"),
      user: oid("user2"),
      products: [],
      createdAt: undefined,
      updatedAt: undefined,
    } as any;

    const dto = toCartDTO(doc);

    expect(dto.createdAt).toBe("");
    expect(dto.updatedAt).toBe("");
    expect(dto.products).toEqual([]);
  });
});

describe("toPublicProductDTO", () => {
  const base = {
    _id: oid("prod1"),
    name: "Widget",
    price: 25,
    description: "A widget",
    category: "electronics",
    image: "/img/widget.jpg",
    createdAt: new Date("2026-01-01T00:00:00Z"),
    updatedAt: new Date("2026-01-01T00:00:00Z"),
  };

  it("never leaks seller-only fields (stock, unitsSold, seller)", () => {
    const dto = toPublicProductDTO({ ...base, stock: 10 } as any);
    expect(dto).not.toHaveProperty("stock");
    expect(dto).not.toHaveProperty("unitsSold");
    expect(dto).not.toHaveProperty("seller");
  });

  it.each([
    [0, "OUT_OF_STOCK"],
    [1, "LOW_STOCK"],
    [5, "LOW_STOCK"],
    [6, "IN_STOCK"],
    [100, "IN_STOCK"],
  ])("derives stockStatus %s -> %s from raw stock count", (stock, expected) => {
    const dto = toPublicProductDTO({ ...base, stock } as any);
    expect(dto.stockStatus).toBe(expected);
  });

  it("falls back to empty string when dates are missing", () => {
    const dto = toPublicProductDTO({
      ...base,
      stock: 10,
      createdAt: undefined,
      updatedAt: undefined,
    } as any);
    expect(dto.createdAt).toBe("");
    expect(dto.updatedAt).toBe("");
  });
});

describe("toSellerProductDTO", () => {
  it("includes exact stock and unitsSold instead of a derived status", () => {
    const doc = {
      _id: oid("prod1"),
      name: "Widget",
      price: 25,
      description: "A widget",
      category: "electronics",
      image: "/img/widget.jpg",
      stock: 42,
      unitsSold: 7,
      createdAt: new Date("2026-01-01T00:00:00Z"),
      updatedAt: new Date("2026-01-01T00:00:00Z"),
    } as any;

    const dto = toSellerProductDTO(doc);

    expect(dto.stock).toBe(42);
    expect(dto.unitsSold).toBe(7);
    expect(dto).not.toHaveProperty("stockStatus");
  });

  it("falls back to empty string when dates are missing", () => {
    const doc = {
      _id: oid("prod2"),
      name: "Widget",
      price: 25,
      description: "A widget",
      category: "electronics",
      image: "/img/widget.jpg",
      stock: 1,
      unitsSold: 0,
      createdAt: undefined,
      updatedAt: undefined,
    } as any;

    const dto = toSellerProductDTO(doc);

    expect(dto.createdAt).toBe("");
    expect(dto.updatedAt).toBe("");
  });
});

describe("toAdminProductDTO", () => {
  const base = {
    _id: oid("prod1"),
    name: "Widget",
    price: 25,
    image: "/img/widget.jpg",
    category: "electronics",
    description: "A widget",
    stock: 10,
    unitsSold: 3,
    createdAt: new Date("2026-01-01T00:00:00Z"),
    updatedAt: new Date("2026-01-01T00:00:00Z"),
  };

  it("includes seller identification when seller is populated", () => {
    const doc = {
      ...base,
      seller: {
        _id: oid("seller1"),
        userName: "Acme Co",
        email: "acme@test.com",
      },
    } as any;

    const dto = toAdminProductDTO(doc);

    expect(dto.sellerId).toBe(doc.seller._id.toString());
    expect(dto.sellerName).toBe("Acme Co");
    expect(dto.sellerEmail).toBe("acme@test.com");
  });

  it("falls back to safe defaults when seller is missing (unpopulated ref)", () => {
    const doc = { ...base, seller: undefined } as any;

    const dto = toAdminProductDTO(doc);

    expect(dto.sellerId).toBe("unknown_id");
    expect(dto.sellerName).toBe("Unknown Seller");
    expect(dto.sellerEmail).toBe("No Email");
  });

  it("falls back to empty string _id when doc._id is missing", () => {
    const doc = { ...base, _id: undefined, seller: undefined } as any;
    const dto = toAdminProductDTO(doc);
    expect(dto._id).toBe("");
  });

  it("coerces string dates (already-serialized docs) via new Date().toISOString()", () => {
    const doc = {
      ...base,
      seller: undefined,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-02T00:00:00.000Z",
    } as any;

    const dto = toAdminProductDTO(doc);

    expect(dto.createdAt).toBe("2026-01-01T00:00:00.000Z");
    expect(dto.updatedAt).toBe("2026-01-02T00:00:00.000Z");
  });

  it("falls back to empty string when dates are missing entirely", () => {
    const doc = {
      ...base,
      seller: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    } as any;
    const dto = toAdminProductDTO(doc);
    expect(dto.createdAt).toBe("");
    expect(dto.updatedAt).toBe("");
  });
});

describe("toCategoryDTO", () => {
  it("maps a top-level category (no parentId)", () => {
    const doc = {
      _id: oid("cat1"),
      name: "Electronics",
      slug: "electronics",
      parentId: undefined,
      depth: 0,
      createdAt: new Date("2026-01-01T00:00:00Z"),
      updatedAt: new Date("2026-01-01T00:00:00Z"),
    } as any;

    const dto = toCategoryDTO(doc);

    expect(dto.parentId).toBeUndefined();
    expect(dto.depth).toBe(0);
  });

  it("stringifies parentId when present (nested category)", () => {
    const doc = {
      _id: oid("cat2"),
      name: "Phones",
      slug: "phones",
      parentId: oid("cat1"),
      depth: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any;

    const dto = toCategoryDTO(doc);

    expect(dto.parentId).toBe(doc.parentId.toString());
    expect(typeof dto.parentId).toBe("string");
  });

  it("falls back to empty string when dates are missing", () => {
    const doc = {
      _id: oid("cat3"),
      name: "Uncategorized",
      slug: "uncategorized",
      parentId: undefined,
      depth: 0,
      createdAt: undefined,
      updatedAt: undefined,
    } as any;

    const dto = toCategoryDTO(doc);

    expect(dto.createdAt).toBe("");
    expect(dto.updatedAt).toBe("");
  });
});

describe("toOrderDTO", () => {
  function populatedOrder(overrides: Record<string, unknown> = {}) {
    return {
      _id: oid("order1"),
      user: { _id: oid("user1"), userName: "Buyer", email: "buyer@test.com" },
      products: [
        {
          product: {
            _id: "111111111111111111111101",
            name: "Widget A",
            price: 25,
            image: "/a.jpg",
          },
          quantity: 2,
          unitPrice: 25,
          productStatus: "pending",
        },
        {
          product: {
            _id: "222222222222222222222201",
            name: "Gadget B",
            price: 50,
            image: "/b.jpg",
          },
          quantity: 1,
          unitPrice: 50,
          productStatus: "shipped",
        },
      ],
      orderStatus: "pending",
      createdAt: new Date("2026-01-15T10:00:00Z"),
      updatedAt: new Date("2026-01-15T10:00:00Z"),
      ...overrides,
    } as any;
  }

  it("computes totalPrice as the sum of quantity * unit price across items", () => {
    const dto = toOrderDTO(populatedOrder());
    // 2 * 25 + 1 * 50 = 100
    expect(dto.totalPrice).toBe(100);
  });

  it("computes a per-line netPrice for every product", () => {
    const dto = toOrderDTO(populatedOrder());
    // NOTE: `netPrice` is returned at runtime by toOrderDTO() but is not
    // declared on the `OrderItemDTO` interface in types/orders.ts — a
    // real type/impl drift in the source (see test-suite analysis notes).
    // Cast is required until that interface is updated; do NOT "fix" this
    // by silently widening OrderDTO's typing inside the DTO layer itself.
    expect((dto.products[0] as any).netPrice).toBe(50); // 2 * 25
    expect((dto.products[1] as any).netPrice).toBe(50); // 1 * 50
  });

  it("stringifies the order id and nested product ids", () => {
    const dto = toOrderDTO(populatedOrder());
    expect(typeof dto._id).toBe("string");
    expect(dto._id).toBe(oid("order1").toString());
    expect(dto.products[0].product._id).toBe("111111111111111111111101");
  });

  it("preserves per-item productStatus independently", () => {
    const dto = toOrderDTO(populatedOrder());
    expect(dto.products[0].productStatus).toBe("pending");
    expect(dto.products[1].productStatus).toBe("shipped");
  });

  it("returns totalPrice 0 for an order with no products", () => {
    const dto = toOrderDTO(populatedOrder({ products: [] }));
    expect(dto.totalPrice).toBe(0);
    expect(dto.products).toEqual([]);
  });

  it("passes orderStatus through unchanged", () => {
    const dto = toOrderDTO(populatedOrder({ orderStatus: "delivered" }));
    expect(dto.orderStatus).toBe("delivered");
  });

  it("falls back to empty string when dates are missing", () => {
    const dto = toOrderDTO(
      populatedOrder({ createdAt: undefined, updatedAt: undefined }),
    );
    expect(dto.createdAt).toBe("");
    expect(dto.updatedAt).toBe("");
  });
});

describe("toUserDTO", () => {
  const base = {
    _id: oid("user1"),
    userName: "jdoe",
    email: "jdoe@test.com",
    role: "customer",
    image: undefined,
    provider: undefined,
    addresses: undefined,
    createdAt: new Date("2026-01-01T00:00:00Z"),
    updatedAt: new Date("2026-01-01T00:00:00Z"),
  };

  it("defaults provider to 'credentials' when not set", () => {
    const dto = toUserDTO(base as any);
    expect(dto.provider).toBe("credentials");
  });

  it("passes an explicit provider through unchanged", () => {
    const dto = toUserDTO({ ...base, provider: "google" } as any);
    expect(dto.provider).toBe("google");
  });

  it("returns undefined addresses when the user has none", () => {
    const dto = toUserDTO(base as any);
    expect(dto.addresses).toBeUndefined();
  });

  it("maps each address and defaults label to 'Home' when missing", () => {
    const doc = {
      ...base,
      addresses: [
        {
          title: "Home Address",
          fullAddress: "123 Main St",
          phone: "555-1234",
          label: undefined,
        },
        {
          title: "Work",
          fullAddress: "1 Office Plaza",
          phone: "555-5678",
          label: "Work",
        },
      ],
    } as any;

    const dto = toUserDTO(doc);

    expect(dto.addresses).toHaveLength(2);
    expect(dto.addresses![0].label).toBe("Home");
    expect(dto.addresses![1].label).toBe("Work");
  });

  it("never includes password or other sensitive fields even if present on the doc", () => {
    const dto = toUserDTO({ ...base, password: "hashed-secret" } as any);
    expect(dto).not.toHaveProperty("password");
  });

  it("falls back to empty string when dates are missing", () => {
    const dto = toUserDTO({
      ...base,
      createdAt: undefined,
      updatedAt: undefined,
    } as any);
    expect(dto.createdAt).toBe("");
    expect(dto.updatedAt).toBe("");
  });
});
