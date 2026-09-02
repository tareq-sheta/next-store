import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/lib/auth-guard";
import connectToDatabase from "@/lib/database";
import { toSellerProductDTO } from "@/lib/dto";
import Products from "@/models/products";
import { CustomError, handleError } from "@/utils/ErrorHandler";
// import { UserRole } from "@/lib/rbac/roles";
import { Types } from "mongoose";
import {
  CreateProductSchema,
  DashboardProductsQuerySchema,
} from "@/lib/validations/products";

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(["admin", "seller"]);
    await connectToDatabase();

    const parsedQuery = DashboardProductsQuerySchema.safeParse(
      Object.fromEntries(request.nextUrl.searchParams),
    );
    if (!parsedQuery.success) {
      return NextResponse.json(
        { success: false, error: z.treeifyError(parsedQuery.error).errors },
        { status: 400 },
      );
    }

    // const role = session.user.role as Role;
    const products = new Products();

    const { items, total } = await products.showBySeller(
      session.user.id,
      parsedQuery.data,
    );
    return NextResponse.json(
      {
        success: true,
        data: items.map(toSellerProductDTO),
        pagination: {
          page: parsedQuery.data.page,
          limit: parsedQuery.data.limit,
          total,
          totalPages: Math.ceil(total / parsedQuery.data.limit),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, "Failed to fetch dashboard products");
  }
}
// Protected — admins and sellers create products. Seller identity always
// comes from the session, never from the request body.

export async function POST(request: Request) {
  try {
    const session = await requireAuth(["admin", "seller"]);
    await connectToDatabase();
    const parsedBody = CreateProductSchema.safeParse(await request.json());
    if (!parsedBody.success) {
      return NextResponse.json(
        // { success: false, error: parsedBody.error.flatten().fieldErrors },
        { success: false, error: z.treeifyError(parsedBody.error) },
        { status: 400 },
      );
    }
    const products = new Products();
    const existing = await products.showOne({
      name: parsedBody.data.name,
      seller: new Types.ObjectId(session.user.id),
    });
    if (existing) {
      throw new CustomError(
        "You already have a product with this name",
        409,
        "products.POST",
      );
    }
    const doc = await products.create({
      ...parsedBody.data,
      seller: new Types.ObjectId(session.user.id),
    });
    return NextResponse.json(
      { success: true, data: toSellerProductDTO(doc) },
      { status: 201 },
    );
  } catch (error) {
    return handleError(error, "Failed to create product");
  }
}
