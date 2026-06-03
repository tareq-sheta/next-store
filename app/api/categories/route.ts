import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/database";
import Categories, { CategoryDoc } from "@/models/categories";
import { CustomError } from "@/utils/ErrorHandler";
import { CategoryDTO, CreateCategoryInput } from "@/types/categories";
import mongoose from "mongoose";

function toCategoryDTO(doc: CategoryDoc): CategoryDTO {
  return {
    _id: doc._id.toString(),
    name: doc.name,
    slug: doc.slug,
    parentId: doc.parentId?.toString(),
    depth: doc.depth,
    createdAt: doc.createdAt?.toISOString() ?? "",
    updatedAt: doc.updatedAt?.toISOString() ?? "",
  };
}

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

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body: CreateCategoryInput = await request.json();
    const { name, parentId } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, error: "Category name is required" },
        { status: 400 },
      );
    }

    if (parentId && !mongoose.Types.ObjectId.isValid(parentId)) {
      return NextResponse.json(
        { success: false, error: "Invalid parent category id" },
        { status: 400 },
      );
    }

    const categories = new Categories();
    const doc = await categories.create({
      name: name.trim(),
      parentId: parentId
        ? new mongoose.Types.ObjectId(parentId)
        : undefined,
    });

    return NextResponse.json(
      { success: true, data: toCategoryDTO(doc) },
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
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}
