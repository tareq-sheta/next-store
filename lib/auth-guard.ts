// // lib/auth-guard.ts
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import { NextResponse } from "next/server";

// type Role = "admin" | "seller" | "customer";

// export async function requireAuth(allowedRoles?: Role[]) {
//   const session = await getServerSession(authOptions);

//   // not logged in
//   if (!session?.user) {
//     return NextResponse.json(
//       { success: false, error: "Unauthorized" },
//       { status: 401 },
//     );
//   }

//   // role check — if allowedRoles specified, user must have one of them
//   if (allowedRoles) {
//     const userRole = session.user.role as Role | undefined;
//     if (!userRole || !allowedRoles.includes(userRole)) {
//       return NextResponse.json(
//         { success: false, error: "Forbidden" },
//         { status: 403 },
//       );
//     }
//   }

//   return session;
// }
//--------------------
//--------------------
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import { redirect } from "next/navigation";
// // import { NextResponse, NextRequest } from "next/server";
// import { CustomError } from "@/utils/ErrorHandler";

// type Role = "admin" | "seller" | "customer";
// type Context = "page" | "api";

// export async function requireAuth(
//   allowedRoles?: Role[],
//   context: Context = "api",
// ) {
//   const session = await getServerSession(authOptions);

//   if (!session?.user) {
//     if (context === "page") redirect("/login");
//     throw new CustomError("Unauthorized", 401, "requireAuth");
//   }

//   if (allowedRoles) {
//     const userRole = session.user.role as Role | undefined;
//     if (!userRole || !allowedRoles.includes(userRole)) {
//       if (context === "page") redirect("/");
//       throw new CustomError("Forbidden", 403, "requireAuth");
//     }
//   }

//   return session;
// }
//--------------------------
//--------------------------
//--------------------------
// lib/auth-guard.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CustomError } from "@/utils/ErrorHandler";
import { UserRole } from "@/lib/rbac/roles";

type Context = "page" | "api";

export async function requireAuth(
  allowedRoles?: UserRole[],
  context: Context = "api",
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    if (context === "page") redirect("/login");
    throw new CustomError("Unauthorized", 401, "requireAuth");
  }

  if (allowedRoles) {
    const role = session.user.role as UserRole;
    if (!role || !allowedRoles.includes(role)) {
      if (context === "page") redirect("/");
      throw new CustomError("Forbidden", 403, "requireAuth");
    }
  }

  return session;
}

// New: permission-based guard — more granular than role-based
// lib/auth-guard.ts

// type GuardOptions = {
//   context?: Context;
//   resourceOwnerId?: string; // if provided, ownership is checked
// };

// export async function requirePermission(
//   permission: Permission,
//   options: GuardOptions = {},
// ) {
//   const { context = "api", resourceOwnerId } = options;

//   const session = await getServerSession(authOptions);

//   if (!session?.user) {
//     if (context === "page") redirect("/login");
//     throw new CustomError("Unauthorized", 401, "requirePermission");
//   }

//   const role = session.user.role as UserRole;

//   // 1. check if role has this permission at all
//   if (!can(role, permission)) {
//     if (context === "page") redirect("/");
//     throw new CustomError("Forbidden", 403, "requirePermission");
//   }

//   // 2. if permission is 'own:*' and resourceOwnerId is provided — check ownership
//   // admin bypasses ownership check because they have the global permission (no 'own:' prefix)
//   if (resourceOwnerId && permission.startsWith("own:")) {
//     if (session.user.id !== resourceOwnerId) {
//       if (context === "page") redirect("/");
//       throw new CustomError("Forbidden", 403, "requirePermission");
//     }
//   }

//   return session;
// }
