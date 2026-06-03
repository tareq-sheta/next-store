import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/database";
import Users, { UserDoc } from "@/models/users";
import { UserDTO } from "@/types/users";
import { CustomError } from "@/utils/ErrorHandler";
import bcrypt from "bcryptjs";
import { usersModel } from "@/models/users";

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

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Please provide email and password" },
        { status: 400 },
      );
    }

    const user = await usersModel.findOne({ email }).select("+password");

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const isMatch = await bcrypt.compare(password, user.password ?? "");
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const users = new Users();
    const doc = await users.showOne({ email });
    if (!doc) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 },
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
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Server error during login" },
      { status: 500 },
    );
  }
}
