import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/database";
import Cart, { CartDoc } from "@/models/cart";
import { CustomError } from "@/utils/ErrorHandler";
import { AddToCartInput, CartDTO } from "@/types/cart";
import { requireAuth } from "@/lib/auth-gaurd";
import mongoose from "mongoose";
 
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
 
function mergeCartItems(
  existing: CartDoc["products"],
  incoming: AddToCartInput["products"],
): CartDoc["products"] {
  const merged = existing.map((item) => ({
    product: item.product,
    quantity: item.quantity,
  }));
 
  for (const item of incoming) {
    const productId = new mongoose.Types.ObjectId(item.product);
    const index = merged.findIndex(
      (entry) => entry.product.toString() === productId.toString(),
    );
 
    if (index >= 0) {
      merged[index] = { product: productId, quantity: merged[index].quantity + item.quantity };
    } else {
      merged.push({ product: productId, quantity: item.quantity });
    }
  }
 
  return merged;
}
 
// Protected — users can only access their own cart
export async function GET(request: Request) {
  const guard = await requireAuth();
  if (guard instanceof NextResponse) return guard;
 
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const sessionId = (guard.user as { id?: string }).id;
    const sessionRole = (guard.user as { role?: string }).role;
 
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ success: false, error: "Valid userId is required" }, { status: 400 });
    }
 
    if (sessionRole !== "admin" && sessionId !== userId) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }
 
    const cart = new Cart();
    const doc = await cart.showOne({ user: userId });
 
    if (!doc) {
      return NextResponse.json({ success: false, error: "Cart not found" }, { status: 404 });
    }
 
    return NextResponse.json({ success: true, data: toCartDTO(doc) }, { status: 200 });
  } catch (error) {
    if (error instanceof CustomError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.status });
    }
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
 
// Protected
export async function POST(request: Request) {
  const guard = await requireAuth();
  if (guard instanceof NextResponse) return guard;
 
  try {
    await connectToDatabase();
    const body: AddToCartInput = await request.json();
    const { user, products } = body;
    const sessionId = (guard.user as { id?: string }).id;
    const sessionRole = (guard.user as { role?: string }).role;
 
    if (!user || !mongoose.Types.ObjectId.isValid(user)) {
      return NextResponse.json({ success: false, error: "Valid user id is required" }, { status: 400 });
    }
 
    if (sessionRole !== "admin" && sessionId !== user) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }
 
    if (!products?.length) {
      return NextResponse.json({ success: false, error: "At least one product is required" }, { status: 400 });
    }
 
    for (const item of products) {
      if (!mongoose.Types.ObjectId.isValid(item.product) || item.quantity < 1) {
        return NextResponse.json({ success: false, error: "Invalid cart item" }, { status: 400 });
      }
    }
 
    const cart = new Cart();
    const existing = await cart.showOne({ user });
 
    let doc: CartDoc;
    if (existing) {
      const updated = await cart.update(existing._id.toString(), {
        products: mergeCartItems(existing.products, products),
      });
      if (!updated) {
        return NextResponse.json({ success: false, error: "Failed to update cart" }, { status: 500 });
      }
      doc = updated;
    } else {
      doc = await cart.create({
        user: new mongoose.Types.ObjectId(user),
        products: products.map((item) => ({
          product: new mongoose.Types.ObjectId(item.product),
          quantity: item.quantity,
        })),
      });
    }
 
    return NextResponse.json({ success: true, data: toCartDTO(doc) }, { status: existing ? 200 : 201 });
  } catch (error) {
    if (error instanceof CustomError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.status });
    }
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}