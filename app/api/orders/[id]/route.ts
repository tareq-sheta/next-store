import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/database";
import Orders from "@/models/orders";
import { productsModel } from "@/models/products";
import { handleError } from "@/utils/ErrorHandler";
import mongoose from "mongoose";
import { requireAuth } from "@/lib/auth-guard";
import { toOrderDTO } from "@/lib/dto";
import {
  SellerUpdateItemStatusSchema,
  UpdateOrderSchema,
} from "@/lib/validations/orders";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * Returns the indexes (within `products`) of items that belong to `sellerId`.
 * Accepts the populated products array from `showOne()` / `showAllSeller()`,
 * where each `item.product` is an object with at least `_id`, not a raw ObjectId.
 */
async function findSellerOwnedItemIndexes(
  products: Array<{ product: { _id: { toString(): string } } }>,
  sellerId: string,
): Promise<number[]> {
  const sellerProductIds = new Set(
    (await productsModel.find({ seller: sellerId }, { _id: 1 })).map((p) =>
      p._id.toString(),
    ),
  );
  return products
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => sellerProductIds.has(item.product._id.toString()))
    .map(({ index }) => index);
}

export async function GET(_: Request, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const session = await requireAuth();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid order id" },
        { status: 400 },
      );
    }

    const orders = new Orders();
    const doc = await orders.showOne({ _id: id });
    if (!doc) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 },
      );
    }

    const { id: sessionId, role: sessionRole } = session.user;
    // doc.user is populated (PopulatedUser), so use ._id to get the raw id string.
    const isBuyer = doc.user._id.toString() === sessionId;
    const isAdmin = sessionRole === "admin";

    if (!isBuyer && !isAdmin) {
      if (sessionRole !== "seller") {
        return NextResponse.json(
          { success: false, error: "Forbidden" },
          { status: 403 },
        );
      }
      const ownedIndexes = await findSellerOwnedItemIndexes(
        doc.products,
        sessionId,
      );
      if (ownedIndexes.length === 0) {
        return NextResponse.json(
          { success: false, error: "Forbidden" },
          { status: 403 },
        );
      }
    }

    return NextResponse.json(
      { success: true, data: toOrderDTO(doc) },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, "Failed to fetch order");
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const session = await requireAuth();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid order id" },
        { status: 400 },
      );
    }

    const orders = new Orders();
    const existing = await orders.showOne({ _id: id });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 },
      );
    }

    const { id: sessionId, role: sessionRole } = session.user;
    // existing.user is populated (PopulatedUser), so use ._id to get the raw id string.
    const isBuyer = existing.user._id.toString() === sessionId;
    const isAdmin = sessionRole === "admin";

    if (isBuyer || isAdmin) {
      // Full order edit — any line item, any quantity/status.
      const parsed = UpdateOrderSchema.safeParse(await request.json());
      if (!parsed.success) {
        return NextResponse.json(
          { success: false, error: parsed.error.issues[0].message },
          { status: 400 },
        );
      }

      const doc = await orders.update(id, {
        products: parsed.data.products?.map((item) => ({
          product: new mongoose.Types.ObjectId(item.product),
          quantity: item.quantity,
          productStatus: item.productStatus ?? "pending",
        })),
      });

      if (!doc) {
        return NextResponse.json(
          { success: false, error: "Order not found" },
          { status: 404 },
        );
      }
      return NextResponse.json(
        { success: true, data: toOrderDTO(doc) },
        { status: 200 },
      );
    }

    if (sessionRole !== "seller") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 },
      );
    }

    // Seller path — status only, scoped to their own items. Every other
    // item in the order is passed through untouched.
    const ownedIndexes = await findSellerOwnedItemIndexes(
      existing.products,
      sessionId,
    );
    if (ownedIndexes.length === 0) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 },
      );
    }

    const parsed = SellerUpdateItemStatusSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const ownedIndexSet = new Set(ownedIndexes);
    const updatedProducts = existing.products.map((item, index) => ({
      product: new mongoose.Types.ObjectId(item.product._id.toString()),
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      productStatus: ownedIndexSet.has(index)
        ? parsed.data.productStatus
        : item.productStatus,
    }));

    const doc = await orders.update(id, { products: updatedProducts });
    if (!doc) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { success: true, data: toOrderDTO(doc) },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, "Failed to update order");
  }
}

export async function DELETE(_: Request, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const session = await requireAuth();
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid order id" },
        { status: 400 },
      );
    }
    const orders = new Orders();
    const existing = await orders.showOne({ _id: id });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 },
      );
    }
    // existing.user is populated (PopulatedUser), so use ._id to get the raw id string.
    const isBuyer = existing.user._id.toString() === session.user.id;
    const isAdmin = session.user.role === "admin";
    if (!isBuyer && !isAdmin) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 },
      );
    }
    const doc = await orders.delete(id);
    if (!doc) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { success: true, data: toOrderDTO(doc) },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, "Failed to delete order");
  }
}
