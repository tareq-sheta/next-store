import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/database";
import Cart from "@/models/cart";
import { handleError } from "@/utils/ErrorHandler";
import mongoose from "mongoose";
import { requireAuth } from "@/lib/auth-guard";
import { toCartDTO } from "@/lib/dto";
import z from "zod";
import { QuantitySchema } from "@/lib/validations/cart";

interface RouteParams {
  params: Promise<{ id: string }>;
}

function resolveTargetUserId(
  request: Request,
  session: { user: { id: string; role: string } },
): string {
  const { searchParams } = new URL(request.url);
  const requestedUserId = searchParams.get("userId");
  if (session.user.role === "admin" && requestedUserId) {
    return requestedUserId;
  }
  return session.user.id;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const session = await requireAuth();
    await connectToDatabase();

    const { id } = await params;
    const userId = resolveTargetUserId(request, session);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, error: "Invalid userId" },
        { status: 400 },
      );
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid product id" },
        { status: 400 },
      );
    }

    const parsed = QuantitySchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }
    const { quantity } = parsed.data;

    const cart = new Cart();
    const existing = await cart.showOne({ user: userId });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Cart not found" },
        { status: 404 },
      );
    }

    const hasProduct = existing.products.some(
      (item) => item.product.toString() === id,
    );
    if (!hasProduct) {
      return NextResponse.json(
        { success: false, error: "Product not in cart" },
        { status: 404 },
      );
    }

    const products = existing.products.map((item) =>
      item.product.toString() === id
        ? { product: item.product, quantity }
        : { product: item.product, quantity: item.quantity },
    );

    const doc = await cart.update(existing._id.toString(), { products });
    if (!doc) {
      return NextResponse.json(
        { success: false, error: "Failed to update cart" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: true, data: toCartDTO(doc) },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, "Failed to update cart");
  }
}

// Removes a single product from the caller's cart. Clearing the entire
// cart now lives on DELETE /api/cart (the collection route) instead of a
// magic id === "clear" here.
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await requireAuth();
    await connectToDatabase();

    const { id } = await params;
    const userId = resolveTargetUserId(request, session);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, error: "Invalid userId" },
        { status: 400 },
      );
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid product id" },
        { status: 400 },
      );
    }

    const cart = new Cart();
    const existing = await cart.showOne({ user: userId });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Cart not found" },
        { status: 404 },
      );
    }

    const products = existing.products.filter(
      (item) => item.product.toString() !== id,
    );

    const doc = await cart.update(existing._id.toString(), { products });
    if (!doc) {
      return NextResponse.json(
        { success: false, error: "Failed to update cart" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: true, data: toCartDTO(doc) },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, "Failed to update cart");
  }
}
