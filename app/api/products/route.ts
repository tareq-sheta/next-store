// import { NextRequest, NextResponse } from "next/server";
// import connectToDatabase from "@/lib/database";
// import Products from "@/models/products";
// import { toPublicProductDTO } from "@/lib/dto";
// import { ListProductsQuerySchema } from "@/lib/validations/products";

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import connectToDatabase from "@/lib/database";
import Products from "@/models/products";
import { CustomError, handleError } from "@/utils/ErrorHandler";
import { ListProductsQuerySchema } from "@/lib/validations/products";

import { toPublicProductDTO } from "@/lib/dto";
// import { CATEGORY_DEFINITIONS } from "@/lib/validations/products";
// import { requireAuth } from "@/lib/auth-guard";

// const MAX_PAGE_SIZE = 50;

// Public — browse in-stock products. Never returns seller-only fields.
// export async function GET(request: NextRequest) {
//   try {
//     await connectToDatabase();
//     let session = await requireAuth(["customer", "admin", "seller"]);
//     if (!session.user) {
//       // allow unauthenticated users to browse products
//     }
//     const parsedQuery = ListProductsQuerySchema.safeParse(
//       Object.fromEntries(request.nextUrl.searchParams),
//     );
//     if (!parsedQuery.success) {
//       throw new CustomError(
//         z.treeifyError(parsedQuery.error).errors.join(", "),
//         400,
//         "products.GET",
//       );
//       // return NextResponse.json(
//       //   // { success: false, error: parsedQuery.error.flatten().fieldErrors },
//       //   { success: false, error: z.treeifyError(parsedQuery.error) },
//       //   { status: 400 },
//       // );
//     }
//     const products = new Products();
//     const { items, total } = await products.showPublic(parsedQuery.data);
//     return NextResponse.json(
//       {
//         success: true,
//         data: items.map(toPublicProductDTO),
//         pagination: {
//           page: parsedQuery.data.page,
//           limit: parsedQuery.data.limit,
//           total,
//           totalPages: Math.ceil(total / parsedQuery.data.limit),
//         },
//       },
//       { status: 200 },
//     );
//   } catch (error) {
//     return handleError(error, "Failed to fetch products");
//   }
// }

// PUBLIC: Anyone (guests, buyers, sellers) can search and view products
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const parsedQuery = ListProductsQuerySchema.safeParse(searchParams);

    if (!parsedQuery.success) {
      return NextResponse.json(
        { success: false, error: "Invalid query parameters" },
        { status: 400 },
      );
    }

    const productsRepo = new Products();
    // Fetches in-stock items, handles pagination and text search
    const { items, total } = await productsRepo.showPublic(parsedQuery.data);

    return NextResponse.json({
      success: true,
      data: items.map(toPublicProductDTO), // Sanitized public fields only
      pagination: {
        page: parsedQuery.data.page,
        limit: parsedQuery.data.limit,
        total,
        totalPages: Math.ceil(total / parsedQuery.data.limit),
      },
    });
  } catch (error) {
    return handleError(error, "Failed to fetch products");
  }
}
