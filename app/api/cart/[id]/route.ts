import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/database";
import Cart, { CartDoc } from "@/models/cart";
import { CustomError } from "@/utils/ErrorHandler";
import { CartDTO } from "@/types/cart";
import mongoose from "mongoose";

interface RouteParams {
  params: Promise<{ id: string }>;
}

function toCartDTO(doc: CartDoc): CartDTO {
  return {
    _id: doc._id.toString(),
    user: doc.user.toString(),
    products: doc.products.map((item) => ({
      product: item.product.toString(),
      quantity: item.quantity,
    })),
    createdAt: doc.createdAt?.toISOString() ?? "",
    updatedAt: doc.updatedAt?.toISOString() ?? "",
  };
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const body = await request.json();
    const quantity = body.quantity as number | undefined;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, error: "Valid userId is required" },
        { status: 400 },
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid product id" },
        { status: 400 },
      );
    }

    if (quantity === undefined || quantity < 1) {
      return NextResponse.json(
        { success: false, error: "Valid quantity is required" },
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

    const products = existing.products.map((item) => {
      if (item.product.toString() === id) {
        return { product: item.product, quantity };
      }
      return { product: item.product, quantity: item.quantity };
    });

    const hasProduct = products.some((item) => item.product.toString() === id);
    if (!hasProduct) {
      return NextResponse.json(
        { success: false, error: "Product not in cart" },
        { status: 404 },
      );
    }

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
    if (error instanceof CustomError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.status },
      );
    }
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, error: "Valid userId is required" },
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

    if (id === "clear") {
      const doc = await cart.update(existing._id.toString(), { products: [] });
      if (!doc) {
        return NextResponse.json(
          { success: false, error: "Failed to clear cart" },
          { status: 500 },
        );
      }
      return NextResponse.json(
        { success: true, data: toCartDTO(doc) },
        { status: 200 },
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid product id" },
        { status: 400 },
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
    if (error instanceof CustomError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.status },
      );
    }
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}
