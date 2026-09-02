// import { NextResponse } from "next/server";
// import connectToDatabase from "@/lib/database";
// import Products, { ProductDoc } from "@/models/products";
// import { CustomError } from "@/utils/ErrorHandler";
// import { /* ProductDTO, */ UpdateProductInput } from "@/types/products";
// import mongoose from "mongoose";
// import { requirePermission } from "@/lib/auth-guard";
// import { Role } from "@/lib/rbac/roles";
// import { toPublicProductDTO } from "@/lib/dto";

// interface RouteParams {
//   params: Promise<{ id: string }>;
// }

// // function toProductDTO(doc: ProductDoc): ProductDTO {
// //   return {
// //     _id: doc._id.toString(),
// //     name: doc.name,
// //     seller: doc.seller.toString(),
// //     price: doc.price,
// //     description: doc.description,
// //     category: doc.category,
// //     image: doc.image,
// //     // fav: doc.fav,
// //     stock: doc.stock,
// //     // quantity: doc.quantity,
// //     createdAt: doc.createdAt?.toISOString() ?? "",
// //     updatedAt: doc.updatedAt?.toISOString() ?? "",
// //   };
// // }

// export async function GET(_: Request, { params }: RouteParams) {
//   try {
//     await connectToDatabase();
//     const { id } = await params;
//     const products = new Products();
//     const doc = await products.showOne(id);

//     if (!doc) {
//       return NextResponse.json(
//         { success: false, error: "Product not found" },
//         { status: 404 },
//       );
//     }

//     return NextResponse.json(
//       { success: true, data: toPublicProductDTO(doc) },
//       { status: 200 },
//     );
//   } catch (error) {
//     if (error instanceof CustomError) {
//       return NextResponse.json(
//         { success: false, error: error.message },
//         { status: error.status },
//       );
//     }
//     return NextResponse.json(
//       { success: false, error: "Server error" },
//       { status: 500 },
//     );
//   }
// }

// export async function PATCH(request: Request, { params }: RouteParams) {
//   try {
//     await connectToDatabase();
//     // -----------
//     const session = await requirePermission("own:products:edit");
//     const { id } = await params;
//     const role = session.user.role as Role;

//     const products = new Products();
//     const product = await products.findById(id);
//     if (!product)
//       return NextResponse.json(
//         { success: false, error: "Not found" },
//         { status: 404 },
//       );

//     // sellers can only edit their own products; admins can edit any
//     if (role !== "admin" && product.seller.toString() !== session.user.id) {
//       return NextResponse.json(
//         { success: false, error: "Forbidden" },
//         { status: 403 },
//       );
//     }
//     // -----------
//     // const { id } = await params;
//     const body: UpdateProductInput = await request.json();

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return NextResponse.json(
//         { success: false, error: "Invalid product id" },
//         { status: 400 },
//       );
//     }

//     const allowedFields: (keyof UpdateProductInput)[] = [
//       "name",
//       "description",
//       "price",
//       "category",
//       "image",
//       "stock",
//       "sellerEmail",
//     ];
//     const invalidFields = Object.keys(body).filter(
//       (key) => !allowedFields.includes(key as keyof UpdateProductInput),
//     );

//     if (invalidFields.length > 0) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: `Invalid fields: ${invalidFields.join(", ")}`,
//         },
//         { status: 400 },
//       );
//     }

//     // const products = new Products();
//     const doc = await products.update(id, body);

//     if (!doc) {
//       return NextResponse.json(
//         { success: false, error: "Product not found" },
//         { status: 404 },
//       );
//     }

//     return NextResponse.json(
//       { success: true, data: toPublicProductDTO(doc) },
//       { status: 200 },
//     );
//   } catch (error) {
//     if (error instanceof CustomError) {
//       return NextResponse.json(
//         { success: false, error: error.message },
//         { status: error.status },
//       );
//     }
//     return NextResponse.json(
//       { success: false, error: "Failed to update product" },
//       { status: 500 },
//     );
//   }
// }

// export async function DELETE(_: Request, { params }: RouteParams) {
//   try {
//     await connectToDatabase();
//     // ----------

//     const session = await requirePermission("own:products:edit");
//     const { id } = await params;
//     const role = session.user.role as Role;

//     const products = new Products();
//     const product = await products.findById(id);
//     if (!product)
//       return NextResponse.json(
//         { success: false, error: "Not found" },
//         { status: 404 },
//       );

//     // sellers can only edit their own products; admins can edit any
//     if (role !== "admin" && product.seller.toString() !== session.user.id) {
//       return NextResponse.json(
//         { success: false, error: "Forbidden" },
//         { status: 403 },
//       );
//     }
//     // ----------
//     // const { id } = await params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return NextResponse.json(
//         { success: false, error: "Invalid product id" },
//         { status: 400 },
//       );
//     }

//     // const products = new Products();
//     const doc = await products.delete(id);

//     if (!doc) {
//       return NextResponse.json(
//         { success: false, error: "Product not found" },
//         { status: 404 },
//       );
//     }

//     return NextResponse.json(
//       { success: true, data: toPublicProductDTO(doc) },
//       { status: 200 },
//     );
//   } catch (error) {
//     if (error instanceof CustomError) {
//       return NextResponse.json(
//         { success: false, error: error.message },
//         { status: error.status },
//       );
//     }
//     return NextResponse.json(
//       { success: false, error: "Failed to delete product" },
//       { status: 500 },
//     );
//   }
// }
//--------------
//--------------
//--------------
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/database";
import Products, { productsModel } from "@/models/products";
import { CustomError, handleError } from "@/utils/ErrorHandler";
import mongoose from "mongoose";
import { requireAuth } from "@/lib/auth-guard";
import { assertOwnerOrAdmin } from "@/lib/rbac/ownership";
import { toPublicProductDTO } from "@/lib/dto";
import { UpdateProductSchema } from "@/lib/validations/products";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_: Request, { params }: RouteParams) {
  try {
    await requireAuth();
    await connectToDatabase();
    const { id } = await params;
    const products = new Products();
    const doc = await products.showOne(id);

    if (!doc) {
      throw new CustomError("Product not found", 404, "products.GET");
      // return NextResponse.json(
      //   { success: false, error: "Product not found" },
      //   { status: 404 },
      // );
    }

    return NextResponse.json(
      { success: true, data: toPublicProductDTO(doc) },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, "Failed to fetch product");
  }
}

// export async function PATCH(request: Request, { params }: RouteParams) {
//   try {
//     const session = await requireAuth(["admin", "seller"]);
//     await connectToDatabase();
//     // Role gate: only sellers and admins can even attempt to edit a
//     // product. Whether *this* seller owns *this* product is a separate
//     // question, answered below by assertOwnerOrAdmin — not by a
//     // "own:products:edit" permission string admins would have to be
//     // separately granted.
//     const { id } = await params;

//     const parsedBody = UpdateProductSchema.safeParse(await request.json());
//     if (!parsedBody.success) {
//       throw new CustomError("Invalid product data", 400, "products.PATCH");
//     }

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       throw new CustomError("Invalid product id", 400, "products.PATCH");
//       // return NextResponse.json(
//       //   { success: false, error: "Invalid product id" },
//       //   { status: 400 },
//       // );
//     }
//     let doc = new Products();
//     const productDoc = await doc.findById(id);
//     if (
//       session.user.id !== productDoc?.seller.toString() ||
//       session.user.role !== "admin"
//     ) {
//       throw new CustomError("Unauthorized action", 401, "products.PATCH");
//     }

//     if (!productDoc) {
//       throw new CustomError("Product not found", 404, "products.PATCH");
//     }

//     return NextResponse.json(
//       { success: true, data: toPublicProductDTO(productDoc) },
//       { status: 200 },
//     );
//   } catch (error) {
//     return handleError(error, "Failed to update product");
//   }
// }

// export async function DELETE(_: Request, { params }: RouteParams) {
//   try {
//     await connectToDatabase();
//     const session = await requireAuth(["admin", "seller"]);
//     const { id } = await params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       throw new CustomError("Invalid product id", 400, "products.DELETE");
//     }

//     let doc = new Products();
//     const productDoc = await doc.findById(id);

//     if (!productDoc) {
//       throw new CustomError("Product not found", 404, "products.DELETE");
//     }

//     if (
//       session.user.role !== "admin" &&
//       session.user.id !== productDoc?.seller.toString()
//     ) {
//       throw new CustomError("Forbidden action", 403, "products.DELETE");
//       // return NextResponse.json(
//       //   { success: false, error: "Unauthorized" },
//       //   { status: 401 },
//       // );
//     }

//     // const products = new Products();
//     // const product = await doc.findById(id);
//     // assertOwnerOrAdmin(session, product, "products.DELETE");

//     // const doc = await products.delete(id);
//     // if (!doc) {
//     //   throw new CustomError("Product not found", 404, "products.DELETE");
//     // }
//     const deleted = await doc.deleteOne(id);
//     if (!deleted) {
//       throw new CustomError("Product not found", 404, "products.DELETE");
//     }
//     return NextResponse.json(
//       // { success: true, data: toPublicProductDTO(productDoc) },
//       { success: true, data: {} },
//       { status: 200 },
//     );
//   } catch (error) {
//     return handleError(error, "Failed to delete product");
//   }
// }
// export async function DELETE(_: Request, { params }: RouteParams) {
//   try {
//     const session = await requireAuth(["admin", "seller"]);
//     await connectToDatabase();
//     const { id } = await params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       throw new CustomError("Invalid product id", 400, "products.DELETE");
//     }

//     const doc = new Products();
//     const productDoc = await doc.findById(id);
//     if (
//       session.user.id !== productDoc?.seller.toString() ||
//       session.user.role !== "admin"
//     ) {
//       throw new CustomError("Forbidden action", 403, "products.DELETE");
//     }
//     const deleted = await doc.deleteOne(id);
//     if (!deleted) {
//       throw new CustomError(
//         "Product not found or forbidden",
//         404,
//         "products.DELETE",
//       );
//     }

//     return NextResponse.json({ success: true, data: {} }, { status: 200 });
//   } catch (error) {
//     return handleError(error, "Failed to delete product");
//   }
// }
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const session = await requireAuth(["admin", "seller"]);
    await connectToDatabase();
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid product id", 400, "products.PATCH");
    }
    const parsedBody = UpdateProductSchema.safeParse(await request.json());
    if (!parsedBody.success) {
      throw new CustomError("Invalid product data", 400, "products.PATCH");
    }
    const products = new Products();
    const productDoc = await products.findById(id);
    if (!productDoc) {
      throw new CustomError("Product not found", 404, "products.PATCH");
    }
    const isOwner = session.user.id === productDoc.seller.toString();
    const isAdmin = session.user.role === "admin";
    if (!isOwner && !isAdmin) {
      throw new CustomError("Forbidden action", 403, "products.PATCH");
    }
    const updated = await products.update(id, parsedBody.data);
    if (!updated) {
      throw new CustomError("Product not found", 404, "products.PATCH");
    }
    return NextResponse.json(
      { success: true, data: toPublicProductDTO(updated) },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, "Failed to update product");
  }
}

export async function DELETE(_: Request, { params }: RouteParams) {
  try {
    const session = await requireAuth(["admin", "seller"]);
    await connectToDatabase();
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid product id", 400, "products.DELETE");
    }
    const products = new Products();
    const productDoc = await products.findById(id);
    if (!productDoc) {
      throw new CustomError("Product not found", 404, "products.DELETE");
    }
    const isOwner = session.user.id === productDoc.seller.toString();
    const isAdmin = session.user.role === "admin";
    if (!isOwner && !isAdmin) {
      throw new CustomError("Forbidden action", 403, "products.DELETE");
    }
    const deleted = await products.deleteOne(id);
    if (!deleted) {
      throw new CustomError("Product not found", 404, "products.DELETE");
    }
    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error) {
    return handleError(error, "Failed to delete product");
  }
}
