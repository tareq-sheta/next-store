import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/database";
import Users, { UserDoc, usersModel } from "@/models/users";
import { CustomError } from "@/utils/ErrorHandler";
import { UpdateUserInput, UserDTO } from "@/types/users";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

interface RouteParams {
  params: Promise<{ id: string }>;
}

function toUserDTO(doc: UserDoc): UserDTO {
  return {
    _id: doc._id.toString(),
    userName: doc.userName,
    email: doc.email,
    role: doc.role,
    image: doc.image,
    provider: doc.provider ?? "credentials",
    addresses: doc.addresses?.map((addr) => ({
      title: addr.title,
      fullAddress: addr.fullAddress,
      phone: addr.phone,
      label: addr.label ?? "Home",
    })),
    createdAt: doc.createdAt?.toISOString() ?? "",
    updatedAt: doc.updatedAt?.toISOString() ?? "",
  };
}

export async function GET(_: Request, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;

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

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = (await request.json()) as UpdateUserInput & {
      currentPassword?: string;
      newPassword?: string;
    };

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid user id" },
        { status: 400 },
      );
    }

    if (body.currentPassword && body.newPassword) {
      const existing = await usersModel.findById(id).select("+password");
      if (!existing) {
        return NextResponse.json(
          { success: false, error: "User not found" },
          { status: 404 },
        );
      }

      const isMatch = await bcrypt.compare(
        body.currentPassword,
        existing.password ?? "",
      );
      if (!isMatch) {
        return NextResponse.json(
          { success: false, error: "Current password is incorrect" },
          { status: 400 },
        );
      }

      const users = new Users();
      const doc = await users.update(id, { password: body.newPassword });
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

    const allowedFields: (keyof UpdateUserInput)[] = [
      "userName",
      "email",
      "image",
      "role",
      "addresses",
    ];
    const invalidFields = Object.keys(body).filter(
      (key) =>
        key !== "currentPassword" &&
        key !== "newPassword" &&
        !allowedFields.includes(key as keyof UpdateUserInput),
    );

    if (invalidFields.length > 0) {
      return NextResponse.json(
        { success: false, error: `Invalid fields: ${invalidFields.join(", ")}` },
        { status: 400 },
      );
    }

    const users = new Users();
    const doc = await users.update(id, body);

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
    if (error instanceof CustomError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.status },
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update user" },
      { status: 500 },
    );
  }
}

export async function DELETE(_: Request, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid user id" },
        { status: 400 },
      );
    }

    const users = new Users();
    const doc = await users.delete(id);

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
    if (error instanceof CustomError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.status },
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to delete user" },
      { status: 500 },
    );
  }
}
