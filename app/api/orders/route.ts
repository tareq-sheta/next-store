import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/database";
import Orders, { OrderDoc } from "@/models/orders";
import { CustomError } from "@/utils/ErrorHandler";
import { CreateOrderInput, OrderDTO } from "@/types/orders";
import { requireAuth } from "@/lib/auth-gaurd";
import mongoose from "mongoose";
 
function toOrderDTO(doc: OrderDoc): OrderDTO {
  return {
    _id: doc._id.toString(),
    user: doc.user.toString(),
    products: doc.products.map((item) => ({
      product: item.product.toString(),
      quantity: item.quantity,
      status: item.status,
    })),
    status: doc.status,
    createdAt: doc.createdAt?.toISOString() ?? "",
    updatedAt: doc.updatedAt?.toISOString() ?? "",
  };
}
 
// Protected — users see their own orders, admins see all
export async function GET(request: Request) {
  const guard = await requireAuth();
  if (guard instanceof NextResponse) return guard;
 
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const sessionId = (guard.user as { id?: string }).id;
    const sessionRole = (guard.user as { role?: string }).role;
 
    const orders = new Orders();
 
    if (sessionRole === "admin") {
      const query = userId && mongoose.Types.ObjectId.isValid(userId) ? { user: userId } : {};
      const docs = await orders.showAll(query);
      return NextResponse.json({ success: true, data: docs.map(toOrderDTO) }, { status: 200 });
    }
 
    // Non-admin: only their own orders
    const docs = await orders.showAll({ user: sessionId });
    return NextResponse.json({ success: true, data: docs.map(toOrderDTO) }, { status: 200 });
  } catch (error) {
    if (error instanceof CustomError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.status });
    }
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
 
// Protected — authenticated users can place orders
export async function POST(request: Request) {
  const guard = await requireAuth();
  if (guard instanceof NextResponse) return guard;
 
  try {
    await connectToDatabase();
    const body: CreateOrderInput = await request.json();
    const { user, products, status } = body;
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
        return NextResponse.json({ success: false, error: "Invalid order item" }, { status: 400 });
      }
    }
 
    const orders = new Orders();
    const doc = await orders.create({
      user: new mongoose.Types.ObjectId(user),
      products: products.map((item) => ({
        product: new mongoose.Types.ObjectId(item.product),
        quantity: item.quantity,
        status: item.status ?? "pending",
      })),
      status: status ?? "pending",
    });
 
    return NextResponse.json({ success: true, data: toOrderDTO(doc) }, { status: 201 });
  } catch (error) {
    if (error instanceof CustomError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.status });
    }
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}