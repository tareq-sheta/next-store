import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
 
type Role = "admin" | "seller" | "customer";
 
/**
 * Returns the session if valid, or a 401/403 NextResponse if not.
 * Usage in route handlers:
 *   const guard = await requireAuth(["admin"]);
 *   if (guard instanceof NextResponse) return guard;
 *   const session = guard; // typed session
 */
export async function requireAuth(allowedRoles?: Role[]) {
  const session = await getServerSession(authOptions);
 
  if (!session?.user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }
 
  const userRole = (session.user as { role?: string }).role as Role | undefined;
 
  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    return NextResponse.json(
      { success: false, error: "Forbidden" },
      { status: 403 },
    );
  }
 
  return session;
}