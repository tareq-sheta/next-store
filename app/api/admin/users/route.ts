import { NextRequest, NextResponse } from "next/server";

import connectToDatabase from "@/lib/database";
import Users from "@/models/users";
import { handleError } from "@/utils/ErrorHandler";
import { requireAuth } from "@/lib/auth-guard";
import { toUserDTO } from "@/lib/dto";
import { ListUsersQuerySchema } from "@/lib/validations/users";

// Admin only — list registered users, paginated. Registration (public,
// unauthenticated) now lives at POST /api/auth/register, not here — a
// signup endpoint nested under /admin was a routing smell regardless of
// its own auth. Uses Users.showAllPaginated(), matching the repository's
// actual method (the old code here reached `error.message` on a `catch`
// variable typed `unknown` without narrowing it first).
export async function GET(request: NextRequest) {
  try {
    await requireAuth(["admin"]);
    await connectToDatabase();

    const parsedQuery = ListUsersQuerySchema.safeParse(
      Object.fromEntries(request.nextUrl.searchParams),
    );
    if (!parsedQuery.success) {
      return NextResponse.json(
        { success: false, error: parsedQuery.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const users = new Users();
    const { items, total } = await users.showAllPaginated(parsedQuery.data);

    return NextResponse.json(
      {
        success: true,
        data: items.map(toUserDTO),
        pagination: {
          page: parsedQuery.data.page,
          limit: parsedQuery.data.limit,
          total,
          totalPages: Math.ceil(total / parsedQuery.data.limit),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, "Failed to fetch users");
  }
}
