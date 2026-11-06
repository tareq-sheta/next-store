import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/database";
import Categories from "@/models/categories";
import { handleError } from "@/utils/ErrorHandler";
import { UpdateCategoryInput } from "@/types/categories";
import mongoose from "mongoose";
import { toCategoryDTO } from "@/lib/dto";
import { requireAuth } from "@/lib/auth-guard";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_: Request, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const categories = new Categories();
    const doc = await categories.showOne(id);
    if (!doc) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { success: true, data: toCategoryDTO(doc) },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, `Failed to get category`);
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    await connectToDatabase();
    await requireAuth(["admin"]);
    const { id } = await params;
    const body: UpdateCategoryInput = await request.json();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid category id" },
        { status: 400 },
      );
    }
    const allowedFields: (keyof UpdateCategoryInput)[] = ["name", "parentId"];
    const invalidFields = Object.keys(body).filter(
      (key) => !allowedFields.includes(key as keyof UpdateCategoryInput),
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
    if (body.parentId && !mongoose.Types.ObjectId.isValid(body.parentId)) {
      return NextResponse.json(
        { success: false, error: "Invalid parent category id" },
        { status: 400 },
      );
    }
    const categories = new Categories();
    const doc = await categories.update(id, {
      ...body,
      parentId: body.parentId
        ? new mongoose.Types.ObjectId(body.parentId)
        : undefined,
    });
    if (!doc) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { success: true, data: toCategoryDTO(doc) },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, "Failed to update that specific category");
  }
}

export async function DELETE(_: Request, { params }: RouteParams) {
  try {
    await connectToDatabase();
    await requireAuth(["admin"]);
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid category id" },
        { status: 400 },
      );
    }
    const categories = new Categories();
    const doc = await categories.delete(id);
    if (!doc) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { success: true, data: toCategoryDTO(doc) },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, "Failed to delete category");
  }
}
