import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/database";
import Categories, { CategoryDoc } from "@/models/categories";
import { handleError } from "@/utils/ErrorHandler";
import { CreateCategoryInput } from "@/types/categories";
import mongoose from "mongoose";
import { requireAuth } from "@/lib/auth-guard";
import z from "zod";
import { toCategoryDTO } from "@/lib/dto";
import { CreateCategorySchema } from "@/lib/validations/categories";

export async function GET() {
  try {
    await connectToDatabase();
    const categories = new Categories();
    const docs = await categories.showAll();
    return NextResponse.json(
      { success: true, data: docs.map(toCategoryDTO) },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, "Failed to get categories");
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    await requireAuth(["admin"]);

    const body: CreateCategoryInput = await request.json();
    const { name, parentId } = body;
    const validation = await CreateCategorySchema.safeParseAsync({
      name,
      parentId,
    });
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: z.treeifyError(validation.error) },
        { status: 400 },
      );
    }
    const validatedData = validation.data;
    if (!validatedData.name?.trim()) {
      return NextResponse.json(
        { success: false, error: "Category name is required" },
        { status: 400 },
      );
    }
    if (
      validatedData.parentId &&
      !mongoose.Types.ObjectId.isValid(validatedData.parentId)
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid parent category id" },
        { status: 400 },
      );
    }
    const categories = new Categories();
    const doc = await categories.create({
      name: validatedData.name.trim(),
      parentId: validatedData.parentId
        ? new mongoose.Types.ObjectId(validatedData.parentId)
        : undefined,
    });
    return NextResponse.json(
      { success: true, data: toCategoryDTO(doc) },
      { status: 201 },
    );
  } catch (error) {
    return handleError(error, "Failed to create category");
  }
}
