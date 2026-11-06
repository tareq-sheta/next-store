/**
 * Realistic test fixture factories for Orders tests.
 *
 * These produce data shapes matching what the Orders repository
 * returns (PopulatedOrderDoc) and what toOrderDTO() outputs (OrderDTO).
 */

import mongoose from "mongoose";
import {
  ADMIN_ID,
  CUSTOMER_ID,
  SELLER_ID,
  OTHER_CUSTOMER_ID,
} from "./mock-auth";

// ── Stable ObjectIds (valid 24-char hex) ───────────────────────────
export const ORDER_ID = "aabbccddee11223344556601";
export const PRODUCT_ID_1 = "111111111111111111111101";
export const PRODUCT_ID_2 = "222222222222222222222201";

// ── PopulatedOrderDoc factory ──────────────────────────────────────
export function createMockPopulatedOrder(overrides: Record<string, unknown> = {}) {
  return {
    _id: new mongoose.Types.ObjectId(ORDER_ID),
    user: {
      _id: new mongoose.Types.ObjectId(CUSTOMER_ID),
      userName: "Test Customer",
      email: "customer@test.com",
    },
    products: [
      {
        product: {
          _id: PRODUCT_ID_1,
          name: "Widget A",
          price: 25,
          image: "/img/widget-a.jpg",
        },
        quantity: 2,
        unitPrice: 25,
        productStatus: "pending" as const,
      },
      {
        product: {
          _id: PRODUCT_ID_2,
          name: "Gadget B",
          price: 50,
          image: "/img/gadget-b.jpg",
        },
        quantity: 1,
        unitPrice: 50,
        productStatus: "pending" as const,
      },
    ],
    totalPrice: 100,
    orderStatus: "pending" as const,
    createdAt: new Date("2026-01-15T10:00:00Z"),
    updatedAt: new Date("2026-01-15T10:00:00Z"),
    ...overrides,
  } as any;
}

// ── Paginated results factory ──────────────────────────────────────
export function createMockPaginatedOrders(count = 2) {
  const items = Array.from({ length: count }, () =>
    createMockPopulatedOrder(),
  );
  return { items, total: count } as any;
}

// ── Valid CreateOrder payload ───────────────────────────────────────
export function validCreateOrderPayload(userId = CUSTOMER_ID) {
  return {
    user: userId,
    products: [
      { product: PRODUCT_ID_1, quantity: 2 },
      { product: PRODUCT_ID_2, quantity: 1 },
    ],
  };
}

// ── Valid UpdateOrder payload ───────────────────────────────────────
export function validUpdateOrderPayload() {
  return {
    products: [
      { product: PRODUCT_ID_1, quantity: 3, productStatus: "shipped" as const },
    ],
  };
}

// ── Valid SellerUpdateItemStatus payload ────────────────────────────
export function validSellerStatusPayload() {
  return { productStatus: "shipped" as const };
}

// ── Invalid payloads ───────────────────────────────────────────────
export const INVALID_PAYLOADS = {
  missingUser: { products: [{ product: PRODUCT_ID_1, quantity: 1 }] },
  missingProducts: { user: CUSTOMER_ID },
  emptyProducts: { user: CUSTOMER_ID, products: [] },
  invalidProductId: {
    user: CUSTOMER_ID,
    products: [{ product: "not-an-objectid", quantity: 1 }],
  },
  zeroQuantity: {
    user: CUSTOMER_ID,
    products: [{ product: PRODUCT_ID_1, quantity: 0 }],
  },
};

// ── Mock product doc ───────────────────────────────────────────────
export function createMockProductDoc(overrides: Record<string, unknown> = {}) {
  return {
    _id: new mongoose.Types.ObjectId(PRODUCT_ID_1),
    name: "Widget A",
    description: "Test description",
    image: "/img/widget-a.jpg",
    category: "electronics" as any,
    price: 25,
    seller: new mongoose.Types.ObjectId(SELLER_ID),
    stock: 100,
    stockStatus: "IN_STOCK" as const,
    unitsSold: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  } as any;
}
