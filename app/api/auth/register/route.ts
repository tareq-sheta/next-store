import { NextResponse } from "next/server";
import { z } from "zod";

import connectToDatabase from "@/lib/database";
import Users from "@/models/users";
import { CustomError, handleError } from "@/utils/ErrorHandler";
import { toUserDTO } from "@/lib/dto";
import { rateLimit } from "@/lib/rate-limiting";
import { RegisterSchema } from "@/lib/validations/users";
// import { hashSync } from "bcryptjs";

const registrationLimiter = rateLimit({ interval: 60_000, limit: 5 }); // 5 signups/min/IP

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  if (!registrationLimiter(ip)) {
    return NextResponse.json(
      {
        success: false,
        error: "Too many registration attempts. Try again shortly.",
      },
      { status: 429 },
    );
  }

  try {
    await connectToDatabase();

    const parsedBody = RegisterSchema.safeParse(await request.json());
    if (!parsedBody.success) {
      return NextResponse.json(
        { success: false, error: z.treeifyError(parsedBody.error) },
        { status: 400 },
      );
    }

    const { userName, email, password, provider, image, addresses, role } =
      parsedBody.data;
    const authProvider = provider ?? "credentials";

    const users = new Users();
    const existingUser = await users.showOne({ email });
    if (existingUser) {
      throw new CustomError("Email already registered", 409, "auth.register");
    }

    const doc = await users.create({
      userName,
      email,
      password: authProvider === "credentials" ? password : undefined,
      role,
      image,
      provider: authProvider,
      addresses,
    });

    return NextResponse.json(
      { success: true, data: toUserDTO(doc) },
      { status: 201 },
    );
  } catch (error) {
    return handleError(error, "Failed to register user");
  }
}
