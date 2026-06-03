import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/database";
import Products, { ProductDoc } from "@/models/products";
import { CustomError } from "@/utils/ErrorHandler";
import { ProductDTO, UpdateProductInput } from "@/types/products";
import mongoose from "mongoose";

interface RouteParams {
  params: Promise<{ id: string }>;
}

function toProductDTO(doc: ProductDoc): ProductDTO {
  return {
    _id: doc._id.toString(),
    name: doc.name,
    sellerEmail: doc.sellerEmail,
    price: doc.price,
    description: doc.description,
    category: doc.category,
    image: doc.image,
    fav: doc.fav,
    stock: doc.stock,
    quantity: doc.quantity,
    createdAt: doc.createdAt?.toISOString() ?? "",
    updatedAt: doc.updatedAt?.toISOString() ?? "",
  };
}

export async function GET(_: Request, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const products = new Products();
    const doc = await products.showOne(id);

    if (!doc) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, data: toProductDTO(doc) },
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
    const body: UpdateProductInput = await request.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid product id" },
        { status: 400 },
      );
    }

    const allowedFields: (keyof UpdateProductInput)[] = [
      "name",
      "description",
      "price",
      "category",
      "image",
      "stock",
      "quantity",
      "sellerEmail",
      "fav",
    ];
    const invalidFields = Object.keys(body).filter(
      (key) => !allowedFields.includes(key as keyof UpdateProductInput),
    );

    if (invalidFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid fields: ${invalidFields.join(", ")}`,
        },
        { status: 400 },
      );
    }

    const products = new Products();
    const doc = await products.update(id, body);

    if (!doc) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, data: toProductDTO(doc) },
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
      { success: false, error: "Failed to update product" },
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
        { success: false, error: "Invalid product id" },
        { status: 400 },
      );
    }

    const products = new Products();
    const doc = await products.delete(id);

    if (!doc) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, data: toProductDTO(doc) },
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
      { success: false, error: "Failed to delete product" },
      { status: 500 },
    );
  }
}
