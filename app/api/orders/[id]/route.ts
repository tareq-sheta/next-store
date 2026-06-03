import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/database";
import Orders, { OrderDoc } from "@/models/orders";
import { CustomError } from "@/utils/ErrorHandler";
import { OrderDTO, UpdateOrderInput } from "@/types/orders";
import mongoose from "mongoose";

interface RouteParams {
  params: Promise<{ id: string }>;
}

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

export async function GET(_: Request, { params }: RouteParams) {
  try {
    await connectToDatabase();
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

    return NextResponse.json(
      { success: true, data: toOrderDTO(doc) },
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

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body: UpdateOrderInput = await request.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid order id" },
        { status: 400 },
      );
    }

    if (body.products) {
      for (const item of body.products) {
        if (!mongoose.Types.ObjectId.isValid(item.product) || item.quantity < 1) {
          return NextResponse.json(
            { success: false, error: "Invalid order item" },
            { status: 400 },
          );
        }
      }
    }

    const orders = new Orders();
    const doc = await orders.update(id, {
      status: body.status,
      products: body.products?.map((item) => ({
        product: new mongoose.Types.ObjectId(item.product),
        quantity: item.quantity,
        status: item.status ?? "pending",
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
  } catch (error) {
    if (error instanceof CustomError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.status },
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update order" },
      { status: 500 },
    );
  }
}

export async function DELETE(_: Request, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid order id" },
        { status: 400 },
      );
    }

    const orders = new Orders();
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
    if (error instanceof CustomError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.status },
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to delete order" },
      { status: 500 },
    );
  }
}
