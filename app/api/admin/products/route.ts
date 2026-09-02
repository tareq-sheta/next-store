import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import connectToDatabase from "@/lib/database";
import Products from "@/models/products";
import { handleError } from "@/utils/ErrorHandler";
import { requireAuth } from "@/lib/auth-guard";
import { toAdminProductDTO } from "@/lib/dto";
import { ListProductsQuerySchema } from "@/lib/validations/products";

// Public — browse in-stock products. Never returns seller-only fields.
export async function GET(request: NextRequest) {
  try {
    // console.log("in admin products route");
    await requireAuth(["admin"]);
    await connectToDatabase();

    const parsedQuery = ListProductsQuerySchema.safeParse(
      Object.fromEntries(request.nextUrl.searchParams),
    );
    if (!parsedQuery.success) {
      return NextResponse.json(
        // { success: false, error: parsedQuery.error.flatten().fieldErrors },
        { success: false, error: z.treeifyError(parsedQuery.error) },
        { status: 400 },
      );
    }

    const products = new Products();
    const { items, total } = await products.showAllAdmin();
    console.log(items); // here iems are retrived correctly
    return NextResponse.json(
      {
        success: true,
        data: items.map(toAdminProductDTO),
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
    return handleError(error, "Failed to fetch products");
  }
}
