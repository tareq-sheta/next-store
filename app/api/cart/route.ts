import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/database";
import Cart, { CartDoc } from "@/models/cart";
import { handleError } from "@/utils/ErrorHandler";
import { requireAuth } from "@/lib/auth-guard";
import mongoose from "mongoose";
import { z } from "zod";
import { toCartDTO } from "@/lib/dto";
import { AddToCartSchema } from "@/lib/validations/cart";

function mergeCartItems(
  existing: CartDoc["products"],
  incoming: Array<{ product: string; quantity: number }>,
): CartDoc["products"] {
  const merged = existing.map((item) => ({
    product: item.product,
    quantity: item.quantity,
  }));

  for (const item of incoming) {
    const productId = new mongoose.Types.ObjectId(item.product);
    const index = merged.findIndex(
      (entry) => entry.product.toString() === productId.toString(),
    );

    if (index >= 0) {
      merged[index] = {
        product: productId,
        quantity: merged[index].quantity + item.quantity,
      };
    } else {
      merged.push({ product: productId, quantity: item.quantity });
    }
  }

  return merged;
}

// Resolves which user's cart this request is actually about. Only an
// admin's explicit ?userId= can point this at someone other than
// themselves — for every other caller, the param (if present at all) is
// simply ignored, so there's no code path where a non-admin can even
// construct a request targeting another user's cart.
function resolveTargetUserId(
  request: Request,
  session: { user: { id: string; role: string } },
): string {
  const { searchParams } = new URL(request.url);
  const requestedUserId = searchParams.get("userId");
  if (session.user.role === "admin" && requestedUserId) {
    return requestedUserId;
  }
  return session.user.id;
}

// Protected — any authenticated user can have and view their own cart;
// admins may view anyone's via ?userId=.
export async function GET(request: Request) {
  try {
    const session = await requireAuth();
    await connectToDatabase();

    const userId = resolveTargetUserId(request, session);
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, error: "Invalid userId" },
        { status: 400 },
      );
    }

    const cart = new Cart();
    const doc = await cart.showOne({ user: userId });

    if (!doc) {
      return NextResponse.json(
        { success: false, error: "Cart not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, data: toCartDTO(doc) },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, "Failed to fetch cart");
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    await connectToDatabase();

    const parsed = AddToCartSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }
    const { products } = parsed.data;
    const userId = resolveTargetUserId(request, session);

    const cart = new Cart();
    const existing = await cart.showOne({ user: userId });

    let doc: CartDoc;
    if (existing) {
      const updated = await cart.update(existing._id.toString(), {
        products: mergeCartItems(existing.products, products),
      });
      if (!updated) {
        return NextResponse.json(
          { success: false, error: "Failed to update cart" },
          { status: 500 },
        );
      }
      doc = updated;
    } else {
      doc = await cart.create({
        user: new mongoose.Types.ObjectId(userId),
        products: products.map((item) => ({
          product: new mongoose.Types.ObjectId(item.product),
          quantity: item.quantity,
        })),
      });
    }

    return NextResponse.json(
      { success: true, data: toCartDTO(doc) },
      { status: existing ? 200 : 201 },
    );
  } catch (error) {
    return handleError(error, "Failed to update cart");
  }
}

// Clears the caller's own cart entirely. Lives on the collection route
// instead of overloading /api/cart/[id] with a magic "clear" id value that
// happened to never collide with a real ObjectId.
export async function DELETE(request: Request) {
  try {
    const session = await requireAuth();
    await connectToDatabase();

    const userId = resolveTargetUserId(request, session);
    const cart = new Cart();
    const existing = await cart.showOne({ user: userId });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Cart not found" },
        { status: 404 },
      );
    }

    const doc = await cart.update(existing._id.toString(), { products: [] });
    if (!doc) {
      return NextResponse.json(
        { success: false, error: "Failed to clear cart" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: true, data: toCartDTO(doc) },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, "Failed to clear cart");
  }
}
