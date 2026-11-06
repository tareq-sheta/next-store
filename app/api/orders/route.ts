import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/database";
import Orders from "@/models/orders";
import { CustomError, handleError } from "@/utils/ErrorHandler";
import { requireAuth } from "@/lib/auth-guard";
import mongoose from "mongoose";
import { toOrderDTO } from "@/lib/dto";
import Products from "@/models/products";
import { CreateOrderSchema } from "@/lib/validations/orders";

export async function GET(request: Request) {
  try {
    const guard = await requireAuth();
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const sessionId = guard.user.id;
    const sessionRole = guard.user.role;
    const orders = new Orders();

    if (sessionRole === "admin") {
      const query =
        userId && mongoose.Types.ObjectId.isValid(userId)
          ? { user: userId }
          : {};
      const { items: docs } = await orders.showAllAdmin(query);
      return NextResponse.json(
        { success: true, data: docs.map(toOrderDTO) },
        { status: 200 },
      );
    }

    if (sessionRole === "customer") {
      const { items: docs } = await orders.showAllCustomer(sessionId);
      return NextResponse.json(
        { success: true, data: docs.map(toOrderDTO) },
        { status: 200 },
      );
    }

    // Seller — show orders containing their products
    const { items: docs } = await orders.showAllSeller(sessionId);
    return NextResponse.json(
      { success: true, data: docs.map(toOrderDTO) },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, "Failed to fetch orders");
  }
}

export async function POST(request: Request) {
  try {
    const guard = await requireAuth();
    await connectToDatabase();
    const parsed = CreateOrderSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }
    const { user, products: items } = parsed.data;
    const sessionId = guard.user.id;
    const sessionRole = guard.user.role;
    if (sessionRole !== "admin" && sessionId !== user) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 },
      );
    }

    const productsRepo = new Products();
    const decremented: Array<{ productId: string; quantity: number }> = [];
    try {
      for (const item of items) {
        const updated = await productsRepo.decrementStock(
          item.product,
          item.quantity,
        );
        if (!updated) {
          throw new CustomError(
            `Product ${item.product} is unavailable or doesn't have enough stock`,
            409,
            "orders.POST",
          );
        }
        decremented.push({ productId: item.product, quantity: item.quantity });
      }
    } catch (err) {
      for (const { productId, quantity } of decremented) {
        await productsRepo.restoreStock(productId, quantity);
      }
      throw err;
    }

    const orders = new Orders();
    let doc;
    try {
      doc = await orders.create({
        user: new mongoose.Types.ObjectId(user),
        products: items.map((item) => ({
          product: new mongoose.Types.ObjectId(item.product),
          quantity: item.quantity,
          productStatus: item.productStatus ?? "pending",
        })),
      });
    } catch (err) {
      for (const { productId, quantity } of decremented) {
        await productsRepo.restoreStock(productId, quantity);
      }
      throw err;
    }

    return NextResponse.json(
      { success: true, data: toOrderDTO(doc) },
      { status: 201 },
    );
  } catch (error) {
    return handleError(error, "Failed to create order");
  }
}
