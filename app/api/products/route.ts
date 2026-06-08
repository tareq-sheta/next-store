import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/database";
import Products, { ProductDoc } from "@/models/products";
import { CustomError } from "@/utils/ErrorHandler";
import { CreateProductInput, ProductDTO } from "@/types/products";
import { requireAuth } from "@/lib/auth-gaurd";
 
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
 
// Public — anyone can browse products
export async function GET() {
  try {
    await connectToDatabase();
    const products = new Products();
    const docs = await products.showAll();
    return NextResponse.json(
      { success: true, data: docs.map(toProductDTO) },
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
 
// Protected — only admin or seller can create products
export async function POST(request: Request) {
  const guard = await requireAuth(["admin", "seller"]);
  if (guard instanceof NextResponse) return guard;
 
  try {
    await connectToDatabase();
    const body: CreateProductInput = await request.json();
    const { name, sellerEmail, price, description, category, image, fav, stock, quantity } = body;
 
    if (!name || price === undefined || !description || !category || !image || !sellerEmail || quantity === undefined) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }
 
    const products = new Products();
    const existing = await products.showOne(name);
    if (existing) {
      return NextResponse.json(
        { success: false, error: "Product already exists" },
        { status: 400 },
      );
    }
 
    const doc = await products.create({
      name,
      sellerEmail,
      price,
      description,
      category,
      image,
      fav,
      stock: stock ?? 0,
      quantity,
    });
 
    return NextResponse.json(
      { success: true, data: toProductDTO(doc) },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof CustomError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.status },
      );
    }
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}