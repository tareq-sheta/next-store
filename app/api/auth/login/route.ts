import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/database";
import { usersModel, UserDoc } from "@/models/users";
import { UserDTO } from "@/types/users";
import { CustomError } from "@/utils/ErrorHandler";
import bcrypt from "bcryptjs";
 
function toUserDTO(doc: Omit<UserDoc, "password">): UserDTO {
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
 
    const user = await usersModel
      .findOne({ email: String(email).toLowerCase() })
      .select("+password")
      .lean<UserDoc & { password?: string }>();
 
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 },
      );
    }
 
    const isMatch = await bcrypt.compare(String(password), user.password ?? "");
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 },
      );
    }
 
    const { password: _pwd, ...safeUser } = user;
 
    return NextResponse.json(
      { success: true, data: toUserDTO(safeUser as UserDoc) },
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
      { success: false, error: "Server error during login" },
      { status: 500 },
    );
  }
}