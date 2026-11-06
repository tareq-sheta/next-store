/**
 * Test suite for /api/orders (collection) — GET and POST.
 *
 * Mocking strategy:
 *  • requireAuth → controls authentication & role
 *  • Orders class prototype → controls database return values
 *  • Products class prototype → controls stock decrement/restore
 *  • connectToDatabase → no-op (skip real DB connection)
 */

import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  jest,
} from "@jest/globals";

// ── Module mocks — must be before imports ──────────────────────────
jest.mock("@/lib/auth-guard");
// NOTE: `jest.fn()` with no generic infers `Mock<never, never>` under
// Jest 30's @jest/globals types, which then rejects `.mockResolvedValue(...)`
// with "Argument of type 'undefined' is not assignable to parameter of
// type 'never'". Typing the factory explicitly against the real
// `connectToDatabase` signature (`() => Promise<void>`) fixes it.
jest.mock("@/lib/database", () =>
  jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
);

import { GET, POST } from "@/app/api/orders/route";
import { requireAuth } from "@/lib/auth-guard";
import Orders from "@/models/orders";
import Products from "@/models/products";
import {
  mockSession,
  mockUnauthenticated,
  ADMIN_ID,
  CUSTOMER_ID,
  SELLER_ID,
  OTHER_CUSTOMER_ID,
} from "../../helpers/mock-auth";
import {
  createMockPopulatedOrder,
  createMockPaginatedOrders,
  createMockProductDoc,
  validCreateOrderPayload,
  INVALID_PAYLOADS,
} from "../../helpers/mock-data";
import {
  createGETRequest,
  createRequest,
  parseResponse,
} from "../../helpers/request";

// ── Typed mock references ──────────────────────────────────────────
// `jest.Mock` (no generic) also collapses to `Mock<never, never>` in
// Jest 30's types. `jest.MockedFunction<typeof requireAuth>` preserves
// requireAuth's real parameter/return types, so `.mockResolvedValue(...)`
// and `.mockRejectedValue(...)` type-check against what requireAuth
// actually returns/throws.
const requireAuthMock = requireAuth as jest.MockedFunction<typeof requireAuth>;

// ── Lifecycle ──────────────────────────────────────────────────────
afterEach(async () => jest.restoreAllMocks());

// ════════════════════════════════════════════════════════════════════
// GET /api/orders
// ════════════════════════════════════════════════════════════════════
describe("GET /api/orders", () => {
  // ── Authentication ───────────────────────────────────────────────
  it("returns 401 when unauthenticated", async () => {
    mockUnauthenticated(requireAuthMock);

    const { status, body } = await parseResponse(
      await GET(createGETRequest("/api/orders")),
    );

    expect(status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.error).toBe("Unauthorized");
  });

  // ── Admin paths ──────────────────────────────────────────────────
  describe("admin role", () => {
    beforeEach(() => {
      requireAuthMock.mockResolvedValue(mockSession("admin"));
    });

    it("fetches all orders with no userId filter", async () => {
      const paginatedResult = createMockPaginatedOrders(2);
      const showAllAdminSpy = jest
        .spyOn(Orders.prototype, "showAllAdmin")
        .mockResolvedValue(paginatedResult);

      const { status, body } = await parseResponse(
        await GET(createGETRequest("/api/orders")),
      );

      expect(status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.data).toHaveLength(2);
      expect(showAllAdminSpy).toHaveBeenCalledWith({});
    });

    it("filters orders by userId when valid ObjectId is provided", async () => {
      const paginatedResult = createMockPaginatedOrders(1);
      const showAllAdminSpy = jest
        .spyOn(Orders.prototype, "showAllAdmin")
        .mockResolvedValue(paginatedResult);

      const { status, body } = await parseResponse(
        await GET(createGETRequest(`/api/orders?userId=${CUSTOMER_ID}`)),
      );

      expect(status).toBe(200);
      expect(body.success).toBe(true);
      expect(showAllAdminSpy).toHaveBeenCalledWith({ user: CUSTOMER_ID });
    });

    it("ignores invalid userId and fetches all orders", async () => {
      const paginatedResult = createMockPaginatedOrders(2);
      const showAllAdminSpy = jest
        .spyOn(Orders.prototype, "showAllAdmin")
        .mockResolvedValue(paginatedResult);

      const { status } = await parseResponse(
        await GET(createGETRequest("/api/orders?userId=not-valid")),
      );

      expect(status).toBe(200);
      expect(showAllAdminSpy).toHaveBeenCalledWith({});
    });
  });

  // ── Customer path ────────────────────────────────────────────────
  describe("customer role", () => {
    it("fetches only the customer's own orders", async () => {
      requireAuthMock.mockResolvedValue(mockSession("customer"));
      const paginatedResult = createMockPaginatedOrders(1);
      const showAllCustomerSpy = jest
        .spyOn(Orders.prototype, "showAllCustomer")
        .mockResolvedValue(paginatedResult);

      const { status, body } = await parseResponse(
        await GET(createGETRequest("/api/orders")),
      );

      expect(status).toBe(200);
      expect(body.success).toBe(true);
      expect(showAllCustomerSpy).toHaveBeenCalledWith(CUSTOMER_ID);
    });
  });

  // ── Seller path ──────────────────────────────────────────────────
  describe("seller role", () => {
    it("fetches orders containing the seller's products", async () => {
      requireAuthMock.mockResolvedValue(mockSession("seller"));
      const paginatedResult = createMockPaginatedOrders(1);
      const showAllSellerSpy = jest
        .spyOn(Orders.prototype, "showAllSeller")
        .mockResolvedValue(paginatedResult);

      const { status, body } = await parseResponse(
        await GET(createGETRequest("/api/orders")),
      );

      expect(status).toBe(200);
      expect(body.success).toBe(true);
      expect(showAllSellerSpy).toHaveBeenCalledWith(SELLER_ID);
    });
  });

  // ── Response shape ───────────────────────────────────────────────
  it("maps response data through toOrderDTO", async () => {
    requireAuthMock.mockResolvedValue(mockSession("admin"));
    const order = createMockPopulatedOrder();
    jest
      .spyOn(Orders.prototype, "showAllAdmin")
      .mockResolvedValue({ items: [order], total: 1 });

    const { body } = await parseResponse(
      await GET(createGETRequest("/api/orders")),
    );

    const dto = body.data[0];
    // toOrderDTO converts _id to string, computes totalPrice, and nests
    // product data; verify key shape properties
    expect(typeof dto._id).toBe("string");
    expect(dto).toHaveProperty("orderStatus");
    expect(dto).toHaveProperty("totalPrice");
    expect(dto).toHaveProperty("products");
    expect(dto.products[0]).toHaveProperty("product");
    expect(dto.products[0].product).toHaveProperty("name");
    expect(dto.products[0]).toHaveProperty("quantity");
    expect(dto.products[0]).toHaveProperty("netPrice");
    expect(dto.products[0]).toHaveProperty("productStatus");
  });
});

// ════════════════════════════════════════════════════════════════════
// POST /api/orders
// ════════════════════════════════════════════════════════════════════
describe("POST /api/orders", () => {
  // ── Authentication ───────────────────────────────────────────────
  it("returns 401 when unauthenticated", async () => {
    mockUnauthenticated(requireAuthMock);

    const { status, body } = await parseResponse(
      await POST(
        createRequest("POST", "/api/orders", validCreateOrderPayload()),
      ),
    );

    expect(status).toBe(401);
    expect(body.success).toBe(false);
  });

  // ── Authorization ────────────────────────────────────────────────
  it("returns 403 when customer creates order for another user", async () => {
    requireAuthMock.mockResolvedValue(mockSession("customer"));

    const payload = validCreateOrderPayload(OTHER_CUSTOMER_ID);
    const { status, body } = await parseResponse(
      await POST(createRequest("POST", "/api/orders", payload)),
    );

    expect(status).toBe(403);
    expect(body.success).toBe(false);
    expect(body.error).toBe("Forbidden");
  });

  // ── Happy paths ──────────────────────────────────────────────────
  describe("successful creation", () => {
    // `jest.SpyInstance` was removed from @types/jest as of Jest 30 —
    // `jest.SpiedFunction<T>` is the current replacement and preserves
    // the spied method's real argument/return types.
    let decrementStockSpy: jest.SpiedFunction<
      typeof Products.prototype.decrementStock
    >;
    let createSpy: jest.SpiedFunction<typeof Orders.prototype.create>;

    beforeEach(() => {
      decrementStockSpy = jest
        .spyOn(Products.prototype, "decrementStock")
        .mockResolvedValue(createMockProductDoc());
      createSpy = jest
        .spyOn(Orders.prototype, "create")
        .mockResolvedValue(createMockPopulatedOrder());
    });

    it("creates an order when customer places own order", async () => {
      requireAuthMock.mockResolvedValue(mockSession("customer"));

      const { status, body } = await parseResponse(
        await POST(
          createRequest("POST", "/api/orders", validCreateOrderPayload()),
        ),
      );

      expect(status).toBe(201);
      expect(body.success).toBe(true);
      expect(body.data).toHaveProperty("_id");
      expect(createSpy).toHaveBeenCalledTimes(1);
    });

    it("allows admin to create order for another user", async () => {
      requireAuthMock.mockResolvedValue(mockSession("admin"));

      const payload = validCreateOrderPayload(CUSTOMER_ID);
      const { status, body } = await parseResponse(
        await POST(createRequest("POST", "/api/orders", payload)),
      );

      expect(status).toBe(201);
      expect(body.success).toBe(true);
    });

    it("decrements stock for each product in the order", async () => {
      requireAuthMock.mockResolvedValue(mockSession("customer"));

      await POST(
        createRequest("POST", "/api/orders", validCreateOrderPayload()),
      );

      // Two products in the payload → two decrement calls
      expect(decrementStockSpy).toHaveBeenCalledTimes(2);
    });
  });

  // ── Validation errors ────────────────────────────────────────────
  describe("validation errors (400)", () => {
    beforeEach(() => {
      requireAuthMock.mockResolvedValue(mockSession("customer"));
    });

    it("rejects missing user field", async () => {
      const { status, body } = await parseResponse(
        await POST(
          createRequest("POST", "/api/orders", INVALID_PAYLOADS.missingUser),
        ),
      );
      expect(status).toBe(400);
      expect(body.success).toBe(false);
    });

    it("rejects missing products field", async () => {
      const { status, body } = await parseResponse(
        await POST(
          createRequest(
            "POST",
            "/api/orders",
            INVALID_PAYLOADS.missingProducts,
          ),
        ),
      );
      expect(status).toBe(400);
      expect(body.success).toBe(false);
    });

    it("rejects empty products array", async () => {
      const { status, body } = await parseResponse(
        await POST(
          createRequest("POST", "/api/orders", INVALID_PAYLOADS.emptyProducts),
        ),
      );
      expect(status).toBe(400);
      expect(body.success).toBe(false);
    });

    it("rejects invalid product ObjectId", async () => {
      const { status, body } = await parseResponse(
        await POST(
          createRequest(
            "POST",
            "/api/orders",
            INVALID_PAYLOADS.invalidProductId,
          ),
        ),
      );
      expect(status).toBe(400);
      expect(body.success).toBe(false);
    });

    it("rejects zero quantity", async () => {
      const { status, body } = await parseResponse(
        await POST(
          createRequest("POST", "/api/orders", INVALID_PAYLOADS.zeroQuantity),
        ),
      );
      expect(status).toBe(400);
      expect(body.success).toBe(false);
    });
  });

  // ── Stock conflict ───────────────────────────────────────────────
  it("returns 409 when product is out of stock", async () => {
    requireAuthMock.mockResolvedValue(mockSession("customer"));
    jest.spyOn(Products.prototype, "decrementStock").mockResolvedValue(null); // null = insufficient stock

    const { status, body } = await parseResponse(
      await POST(
        createRequest("POST", "/api/orders", validCreateOrderPayload()),
      ),
    );

    expect(status).toBe(409);
    expect(body.success).toBe(false);
  });

  // ── Stock rollback on order creation failure ─────────────────────
  it("restores stock when order creation fails after decrement", async () => {
    requireAuthMock.mockResolvedValue(mockSession("customer"));
    jest
      .spyOn(Products.prototype, "decrementStock")
      .mockResolvedValue(createMockProductDoc());
    jest
      .spyOn(Orders.prototype, "create")
      .mockRejectedValue(new Error("DB write failed"));
    const restoreStockSpy = jest
      .spyOn(Products.prototype, "restoreStock")
      .mockResolvedValue(undefined);

    await POST(createRequest("POST", "/api/orders", validCreateOrderPayload()));

    // Should have called restoreStock for each product that was decremented
    expect(restoreStockSpy).toHaveBeenCalledTimes(2);
  });
});
