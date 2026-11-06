/**
 * Test suite for /api/orders/[id] — GET, PATCH, DELETE.
 *
 * Mocking strategy:
 *  • requireAuth → controls authentication & role
 *  • Orders class prototype → controls database return values
 *  • productsModel.find → controls seller ownership checks
 *  • connectToDatabase → no-op
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
// See route.test.ts for why this needs an explicit generic under Jest 30.
jest.mock("@/lib/database", () =>
  jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
);

import { GET, PATCH, DELETE } from "@/app/api/orders/[id]/route";
import { requireAuth } from "@/lib/auth-guard";
import Orders from "@/models/orders";
import { productsModel } from "@/models/products";

import {
  mockSession,
  mockUnauthenticated,
  CUSTOMER_ID,
  SELLER_ID,
  OTHER_CUSTOMER_ID,
} from "../../../helpers/mock-auth";
import {
  createMockPopulatedOrder,
  validUpdateOrderPayload,
  validSellerStatusPayload,
  ORDER_ID,
  PRODUCT_ID_1,
} from "../../../helpers/mock-data";
import {
  createRequest,
  createGETRequest,
  parseResponse,
} from "../../../helpers/request";

// ── Typed mocks ────────────────────────────────────────────────────
// `jest.MockedFunction<typeof requireAuth>` (not bare `jest.Mock`) so
// `.mockResolvedValue(...)`/`.mockRejectedValue(...)` type-check against
// requireAuth's real return type instead of collapsing to `never`.
const requireAuthMock = requireAuth as jest.MockedFunction<typeof requireAuth>;

// ── Helpers ────────────────────────────────────────────────────────
const VALID_ID = ORDER_ID; // 24-char hex string
const INVALID_ID = "not-a-valid-object-id";

/** Builds the `{ params }` arg that Next.js passes to dynamic route handlers. */
function routeParams(id: string) {
  return { params: Promise.resolve({ id }) };
}

// ── Lifecycle ──────────────────────────────────────────────────────
afterEach(async () => jest.restoreAllMocks());

// ════════════════════════════════════════════════════════════════════
// GET /api/orders/:id
// ════════════════════════════════════════════════════════════════════
describe("GET /api/orders/:id", () => {
  // ── Authentication ───────────────────────────────────────────────
  it("returns 401 when unauthenticated", async () => {
    mockUnauthenticated(requireAuthMock);

    const { status, body } = await parseResponse(
      await GET(
        createGETRequest(`/api/orders/${VALID_ID}`),
        routeParams(VALID_ID),
      ),
    );

    expect(status).toBe(401);
    expect(body.success).toBe(false);
  });

  // ── Invalid ID ───────────────────────────────────────────────────
  it("returns 400 for invalid ObjectId", async () => {
    requireAuthMock.mockResolvedValue(mockSession("admin"));

    const { status, body } = await parseResponse(
      await GET(
        createGETRequest(`/api/orders/${INVALID_ID}`),
        routeParams(INVALID_ID),
      ),
    );

    expect(status).toBe(400);
    expect(body.error).toBe("Invalid order id");
  });

  // ── Not found ────────────────────────────────────────────────────
  it("returns 404 when order does not exist", async () => {
    requireAuthMock.mockResolvedValue(mockSession("admin"));
    jest.spyOn(Orders.prototype, "showOne").mockResolvedValue(null);

    const { status, body } = await parseResponse(
      await GET(
        createGETRequest(`/api/orders/${VALID_ID}`),
        routeParams(VALID_ID),
      ),
    );

    expect(status).toBe(404);
    expect(body.error).toBe("Order not found");
  });

  // ── Admin access ─────────────────────────────────────────────────
  it("allows admin to view any order", async () => {
    requireAuthMock.mockResolvedValue(mockSession("admin"));
    jest
      .spyOn(Orders.prototype, "showOne")
      .mockResolvedValue(createMockPopulatedOrder());

    const { status, body } = await parseResponse(
      await GET(
        createGETRequest(`/api/orders/${VALID_ID}`),
        routeParams(VALID_ID),
      ),
    );

    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data).toHaveProperty("_id");
  });

  // ── Buyer access ─────────────────────────────────────────────────
  it("allows buyer to view their own order", async () => {
    requireAuthMock.mockResolvedValue(mockSession("customer"));
    // The order's user._id matches CUSTOMER_ID
    jest
      .spyOn(Orders.prototype, "showOne")
      .mockResolvedValue(createMockPopulatedOrder());

    const { status, body } = await parseResponse(
      await GET(
        createGETRequest(`/api/orders/${VALID_ID}`),
        routeParams(VALID_ID),
      ),
    );

    expect(status).toBe(200);
    expect(body.success).toBe(true);
  });

  // ── Another customer → 403 ──────────────────────────────────────
  it("returns 403 when customer tries to view another customer's order", async () => {
    requireAuthMock.mockResolvedValue(
      mockSession("customer", OTHER_CUSTOMER_ID),
    );
    jest
      .spyOn(Orders.prototype, "showOne")
      .mockResolvedValue(createMockPopulatedOrder());

    const { status, body } = await parseResponse(
      await GET(
        createGETRequest(`/api/orders/${VALID_ID}`),
        routeParams(VALID_ID),
      ),
    );

    expect(status).toBe(403);
    expect(body.error).toBe("Forbidden");
  });

  // ── Seller with owned products → 200 ────────────────────────────
  it("allows seller to view order containing their products", async () => {
    requireAuthMock.mockResolvedValue(mockSession("seller"));
    jest
      .spyOn(Orders.prototype, "showOne")
      .mockResolvedValue(createMockPopulatedOrder());

    // productsModel.find returns seller's product IDs
    jest.spyOn(productsModel, "find").mockReturnValue({
      map: () => [PRODUCT_ID_1],
    } as any);

    const { status, body } = await parseResponse(
      await GET(
        createGETRequest(`/api/orders/${VALID_ID}`),
        routeParams(VALID_ID),
      ),
    );

    expect(status).toBe(200);
    expect(body.success).toBe(true);
  });

  // ── Seller with no owned products → 403 ─────────────────────────
  it("returns 403 when seller has no products in the order", async () => {
    requireAuthMock.mockResolvedValue(mockSession("seller"));
    jest
      .spyOn(Orders.prototype, "showOne")
      .mockResolvedValue(createMockPopulatedOrder());

    // No products belong to this seller
    jest.spyOn(productsModel, "find").mockReturnValue({
      map: () => [],
    } as any);

    const { status, body } = await parseResponse(
      await GET(
        createGETRequest(`/api/orders/${VALID_ID}`),
        routeParams(VALID_ID),
      ),
    );

    expect(status).toBe(403);
    expect(body.error).toBe("Forbidden");
  });
});

// ════════════════════════════════════════════════════════════════════
// PATCH /api/orders/:id
// ════════════════════════════════════════════════════════════════════
describe("PATCH /api/orders/:id", () => {
  // ── Authentication ───────────────────────────────────────────────
  it("returns 401 when unauthenticated", async () => {
    mockUnauthenticated(requireAuthMock);

    const { status, body } = await parseResponse(
      await PATCH(
        createRequest(
          "PATCH",
          `/api/orders/${VALID_ID}`,
          validUpdateOrderPayload(),
        ),
        routeParams(VALID_ID),
      ),
    );

    expect(status).toBe(401);
    expect(body.success).toBe(false);
  });

  // ── Invalid ID ───────────────────────────────────────────────────
  it("returns 400 for invalid ObjectId", async () => {
    requireAuthMock.mockResolvedValue(mockSession("admin"));

    const { status, body } = await parseResponse(
      await PATCH(
        createRequest(
          "PATCH",
          `/api/orders/${INVALID_ID}`,
          validUpdateOrderPayload(),
        ),
        routeParams(INVALID_ID),
      ),
    );

    expect(status).toBe(400);
    expect(body.error).toBe("Invalid order id");
  });

  // ── Not found ────────────────────────────────────────────────────
  it("returns 404 when order does not exist", async () => {
    requireAuthMock.mockResolvedValue(mockSession("admin"));
    jest.spyOn(Orders.prototype, "showOne").mockResolvedValue(null);

    const { status, body } = await parseResponse(
      await PATCH(
        createRequest(
          "PATCH",
          `/api/orders/${VALID_ID}`,
          validUpdateOrderPayload(),
        ),
        routeParams(VALID_ID),
      ),
    );

    expect(status).toBe(404);
    expect(body.error).toBe("Order not found");
  });

  // ── Buyer updates own order ──────────────────────────────────────
  it("allows buyer to update their own order (full product list)", async () => {
    requireAuthMock.mockResolvedValue(mockSession("customer"));
    jest
      .spyOn(Orders.prototype, "showOne")
      .mockResolvedValue(createMockPopulatedOrder());
    const updateSpy = jest
      .spyOn(Orders.prototype, "update")
      .mockResolvedValue(createMockPopulatedOrder());

    const { status, body } = await parseResponse(
      await PATCH(
        createRequest(
          "PATCH",
          `/api/orders/${VALID_ID}`,
          validUpdateOrderPayload(),
        ),
        routeParams(VALID_ID),
      ),
    );

    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(updateSpy).toHaveBeenCalledTimes(1);
  });

  // ── Admin updates any order ──────────────────────────────────────
  it("allows admin to update any order", async () => {
    requireAuthMock.mockResolvedValue(mockSession("admin"));
    jest
      .spyOn(Orders.prototype, "showOne")
      .mockResolvedValue(createMockPopulatedOrder());
    const updateSpy = jest
      .spyOn(Orders.prototype, "update")
      .mockResolvedValue(createMockPopulatedOrder());

    const { status, body } = await parseResponse(
      await PATCH(
        createRequest(
          "PATCH",
          `/api/orders/${VALID_ID}`,
          validUpdateOrderPayload(),
        ),
        routeParams(VALID_ID),
      ),
    );

    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(updateSpy).toHaveBeenCalledTimes(1);
  });

  // ── Seller updates status of owned items ─────────────────────────
  it("allows seller to update productStatus for their own items", async () => {
    requireAuthMock.mockResolvedValue(mockSession("seller"));
    jest
      .spyOn(Orders.prototype, "showOne")
      .mockResolvedValue(createMockPopulatedOrder());

    // Seller owns the first product in the order
    jest.spyOn(productsModel, "find").mockReturnValue({
      map: () => [PRODUCT_ID_1],
    } as any);

    const updateSpy = jest
      .spyOn(Orders.prototype, "update")
      .mockResolvedValue(createMockPopulatedOrder());

    const { status, body } = await parseResponse(
      await PATCH(
        createRequest(
          "PATCH",
          `/api/orders/${VALID_ID}`,
          validSellerStatusPayload(),
        ),
        routeParams(VALID_ID),
      ),
    );

    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(updateSpy).toHaveBeenCalledTimes(1);
  });

  // ── Seller with no owned items → 403 ────────────────────────────
  it("returns 403 when seller has no products in the order", async () => {
    requireAuthMock.mockResolvedValue(mockSession("seller"));
    jest
      .spyOn(Orders.prototype, "showOne")
      .mockResolvedValue(createMockPopulatedOrder());

    jest.spyOn(productsModel, "find").mockReturnValue({
      map: () => [],
    } as any);

    const { status, body } = await parseResponse(
      await PATCH(
        createRequest(
          "PATCH",
          `/api/orders/${VALID_ID}`,
          validSellerStatusPayload(),
        ),
        routeParams(VALID_ID),
      ),
    );

    expect(status).toBe(403);
    expect(body.error).toBe("Forbidden");
  });

  // ── Non-buyer, non-seller, non-admin → 403 ──────────────────────
  it("returns 403 when another customer tries to update", async () => {
    requireAuthMock.mockResolvedValue(
      mockSession("customer", OTHER_CUSTOMER_ID),
    );
    jest
      .spyOn(Orders.prototype, "showOne")
      .mockResolvedValue(createMockPopulatedOrder());

    const { status, body } = await parseResponse(
      await PATCH(
        createRequest(
          "PATCH",
          `/api/orders/${VALID_ID}`,
          validUpdateOrderPayload(),
        ),
        routeParams(VALID_ID),
      ),
    );

    expect(status).toBe(403);
    expect(body.error).toBe("Forbidden");
  });

  // ── Validation error (buyer/admin) ───────────────────────────────
  it("returns 400 when buyer sends invalid payload", async () => {
    requireAuthMock.mockResolvedValue(mockSession("customer"));
    jest
      .spyOn(Orders.prototype, "showOne")
      .mockResolvedValue(createMockPopulatedOrder());

    // UpdateOrderSchema is .strict() — extra fields are rejected
    const { status, body } = await parseResponse(
      await PATCH(
        createRequest("PATCH", `/api/orders/${VALID_ID}`, {
          extraField: "not allowed",
        }),
        routeParams(VALID_ID),
      ),
    );

    expect(status).toBe(400);
    expect(body.success).toBe(false);
  });

  // ── Update returns null (race condition) ─────────────────────────
  it("returns 404 when update returns null (deleted concurrently)", async () => {
    requireAuthMock.mockResolvedValue(mockSession("admin"));
    jest
      .spyOn(Orders.prototype, "showOne")
      .mockResolvedValue(createMockPopulatedOrder());
    jest.spyOn(Orders.prototype, "update").mockResolvedValue(null);

    const { status, body } = await parseResponse(
      await PATCH(
        createRequest(
          "PATCH",
          `/api/orders/${VALID_ID}`,
          validUpdateOrderPayload(),
        ),
        routeParams(VALID_ID),
      ),
    );

    expect(status).toBe(404);
    expect(body.error).toBe("Order not found");
  });
});

// ════════════════════════════════════════════════════════════════════
// DELETE /api/orders/:id
// ════════════════════════════════════════════════════════════════════
describe("DELETE /api/orders/:id", () => {
  // ── Authentication ───────────────────────────────────────────────
  it("returns 401 when unauthenticated", async () => {
    mockUnauthenticated(requireAuthMock);

    const { status, body } = await parseResponse(
      await DELETE(
        createRequest("DELETE", `/api/orders/${VALID_ID}`),
        routeParams(VALID_ID),
      ),
    );

    expect(status).toBe(401);
    expect(body.success).toBe(false);
  });

  // ── Invalid ID ───────────────────────────────────────────────────
  it("returns 400 for invalid ObjectId", async () => {
    requireAuthMock.mockResolvedValue(mockSession("admin"));

    const { status, body } = await parseResponse(
      await DELETE(
        createRequest("DELETE", `/api/orders/${INVALID_ID}`),
        routeParams(INVALID_ID),
      ),
    );

    expect(status).toBe(400);
    expect(body.error).toBe("Invalid order id");
  });

  // ── Not found ────────────────────────────────────────────────────
  it("returns 404 when order does not exist", async () => {
    requireAuthMock.mockResolvedValue(mockSession("admin"));
    jest.spyOn(Orders.prototype, "showOne").mockResolvedValue(null);

    const { status, body } = await parseResponse(
      await DELETE(
        createRequest("DELETE", `/api/orders/${VALID_ID}`),
        routeParams(VALID_ID),
      ),
    );

    expect(status).toBe(404);
    expect(body.error).toBe("Order not found");
  });

  // ── Buyer deletes own order ──────────────────────────────────────
  it("allows buyer to delete their own order", async () => {
    requireAuthMock.mockResolvedValue(mockSession("customer"));
    jest
      .spyOn(Orders.prototype, "showOne")
      .mockResolvedValue(createMockPopulatedOrder());
    const deleteSpy = jest
      .spyOn(Orders.prototype, "delete")
      .mockResolvedValue(createMockPopulatedOrder());

    const { status, body } = await parseResponse(
      await DELETE(
        createRequest("DELETE", `/api/orders/${VALID_ID}`),
        routeParams(VALID_ID),
      ),
    );

    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(deleteSpy).toHaveBeenCalledWith(VALID_ID);
  });

  // ── Admin deletes any order ──────────────────────────────────────
  it("allows admin to delete any order", async () => {
    requireAuthMock.mockResolvedValue(mockSession("admin"));
    jest
      .spyOn(Orders.prototype, "showOne")
      .mockResolvedValue(createMockPopulatedOrder());
    const deleteSpy = jest
      .spyOn(Orders.prototype, "delete")
      .mockResolvedValue(createMockPopulatedOrder());

    const { status, body } = await parseResponse(
      await DELETE(
        createRequest("DELETE", `/api/orders/${VALID_ID}`),
        routeParams(VALID_ID),
      ),
    );

    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(deleteSpy).toHaveBeenCalledWith(VALID_ID);
  });

  // ── Non-buyer, non-admin → 403 ──────────────────────────────────
  it("returns 403 when another customer tries to delete", async () => {
    requireAuthMock.mockResolvedValue(
      mockSession("customer", OTHER_CUSTOMER_ID),
    );
    jest
      .spyOn(Orders.prototype, "showOne")
      .mockResolvedValue(createMockPopulatedOrder());

    const { status, body } = await parseResponse(
      await DELETE(
        createRequest("DELETE", `/api/orders/${VALID_ID}`),
        routeParams(VALID_ID),
      ),
    );

    expect(status).toBe(403);
    expect(body.error).toBe("Forbidden");
  });

  // ── Seller cannot delete (not buyer, not admin) ──────────────────
  it("returns 403 when seller tries to delete", async () => {
    requireAuthMock.mockResolvedValue(mockSession("seller"));
    jest
      .spyOn(Orders.prototype, "showOne")
      .mockResolvedValue(createMockPopulatedOrder());

    const { status, body } = await parseResponse(
      await DELETE(
        createRequest("DELETE", `/api/orders/${VALID_ID}`),
        routeParams(VALID_ID),
      ),
    );

    expect(status).toBe(403);
    expect(body.error).toBe("Forbidden");
  });

  // ── Delete returns null (race condition) ─────────────────────────
  it("returns 404 when delete returns null (already deleted)", async () => {
    requireAuthMock.mockResolvedValue(mockSession("admin"));
    jest
      .spyOn(Orders.prototype, "showOne")
      .mockResolvedValue(createMockPopulatedOrder());
    jest.spyOn(Orders.prototype, "delete").mockResolvedValue(null);

    const { status, body } = await parseResponse(
      await DELETE(
        createRequest("DELETE", `/api/orders/${VALID_ID}`),
        routeParams(VALID_ID),
      ),
    );

    expect(status).toBe(404);
    expect(body.error).toBe("Order not found");
  });
});
