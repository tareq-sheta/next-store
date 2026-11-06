import { NextResponse } from "next/server";

import { toPublicProductDTO } from "@/lib/dto";
import { handleError } from "@/utils/ErrorHandler";

import Products from "@/models/products";
import connectToDatabase from "@/lib/database";

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);

    const limitParam = searchParams.get("limit");
    const limit = limitParam ? Number(limitParam) : 0;
    const excludeProductId = searchParams.get("excludeId") || undefined;
    const category = searchParams.get("category") || undefined;
    // const sellerId = searchParams.get("sellerId") || undefined;
    const docs = await new Products().showTopSellers({
      limit,
      category,
      excludeProductId,
    });
    if (docs.length === 0) {
      return NextResponse.json({ success: true, data: [] }, { status: 200 });
    }

    const dto = docs.map(toPublicProductDTO);
    return NextResponse.json({ success: true, data: dto }, { status: 200 });
  } catch (error) {
    return handleError(error, "Failed to fetch top sellers");
  }
}
