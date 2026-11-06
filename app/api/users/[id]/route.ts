import { NextResponse } from "next/server";
import { z } from "zod";
import connectToDatabase from "@/lib/database";
import Users, { usersModel } from "@/models/users";
import { CustomError, handleError } from "@/utils/ErrorHandler";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { requireAuth } from "@/lib/auth-guard";
import { assertOwnerOrAdmin } from "@/lib/rbac/ownership";
import { toUserDTO } from "@/lib/dto";
import { productsModel } from "@/models/products";
import {
  PasswordChangeSchema,
  UpdateProfileSchema,
} from "@/lib/validations/users";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_: Request, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const session = await requireAuth();
    const { id } = await params;

    assertOwnerOrAdmin(session, { user: id }, "users.GET");

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid user id" },
        { status: 400 },
      );
    }

    const users = new Users();
    const doc = await users.showOne({ _id: id });
    if (!doc) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, data: toUserDTO(doc) },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, "Server error");
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const session = await requireAuth();
    const { id } = await params;

    assertOwnerOrAdmin(session, { user: id }, "users.PATCH");

    const body = await request.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid user id" },
        { status: 400 },
      );
    }

    if ("currentPassword" in body || "newPassword" in body) {
      const parsed = PasswordChangeSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { success: false, error: parsed.error.issues[0].message },
          { status: 400 },
        );
      }

      const existing = await usersModel.findById(id).select("+password");
      if (!existing) {
        return NextResponse.json(
          { success: false, error: "User not found" },
          { status: 404 },
        );
      }

      const isMatch = await bcrypt.compare(
        parsed.data.currentPassword,
        existing.password ?? "",
      );
      if (!isMatch) {
        return NextResponse.json(
          { success: false, error: "Current password is incorrect" },
          { status: 400 },
        );
      }

      const users = new Users();
      const doc = await users.update(id, { password: parsed.data.newPassword });
      if (!doc) {
        return NextResponse.json(
          { success: false, error: "User not found" },
          { status: 404 },
        );
      }

      return NextResponse.json(
        { success: true, data: toUserDTO(doc) },
        { status: 200 },
      );
    }

    const parsed = UpdateProfileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const users = new Users();
    const doc = await users.update(id, parsed.data);
    if (!doc) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, data: toUserDTO(doc) },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, "Failed to update user");
  }
}

export async function DELETE(_: Request, { params }: RouteParams) {
  try {
    const session = await requireAuth();
    await connectToDatabase();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid user id", 400, "users.DELETE");
    }

    if (session.user.id !== id && session.user.role !== "admin") {
      throw new CustomError("Forbidden action", 403, "users.DELETE");
    }

    const users = new Users();
    const doc = await users.delete(id);
    if (!doc) {
      throw new CustomError("User not found", 404, "users.DELETE");
    }

    return NextResponse.json(
      { success: true, data: toUserDTO(doc) },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, "Failed to delete user");
  }
}
