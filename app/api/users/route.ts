import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/database";
import Users, { UserDoc } from "@/models/users";
import { CustomError } from "@/utils/ErrorHandler";
import { CreateUserInput, UserDTO } from "@/types/users";
import { requireAuth } from "@/lib/auth-gaurd";
 
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
 
// Protected — admin only can list all users
export async function GET() {
  const guard = await requireAuth(["admin"]);
  if (guard instanceof NextResponse) return guard;
 
  try {
    await connectToDatabase();
    const users = new Users();
    const docs = await users.showAll();
    return NextResponse.json({ success: true, data: docs.map(toUserDTO) }, { status: 200 });
  } catch (error) {
    if (error instanceof CustomError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.status });
    }
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
 
// Public — registration
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body: CreateUserInput = await request.json();
    const { userName, email, password, role, image, provider, addresses } = body;
 
    if (!email || !userName) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }
 
    const authProvider = provider ?? "credentials";
    if (authProvider === "credentials" && !password) {
      return NextResponse.json(
        { success: false, error: "Password is required for credentials signup" },
        { status: 400 },
      );
    }
 
    const users = new Users();
    const existingUser = await users.showOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Email already registered" },
        { status: 400 },
      );
    }
 
    const doc = await users.create({
      userName,
      email: email.toLowerCase(),
      password: authProvider === "credentials" ? password : undefined,
      role: role ?? "customer",
      image,
      provider: authProvider,
      addresses,
    });
 
    return NextResponse.json({ success: true, data: toUserDTO(doc) }, { status: 201 });
  } catch (error) {
    if (error instanceof CustomError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.status });
    }
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}