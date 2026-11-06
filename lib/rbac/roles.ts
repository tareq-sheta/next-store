export const ROLES = ["admin", "seller", "customer"] as const;
export type UserRole = (typeof ROLES)[number];

// Role-only permissions: "can this role attempt this class of action at
// all." Nothing here answers "does this role own this specific resource" —
// that question is a separate concern, handled by lib/rbac/ownership.ts.
// Splitting it this way means there's exactly one place (ownership.ts) that
// can grant an admin override, instead of every "own:x" string needing to
// be remembered and kept in sync across every role's permission array.
export const PERMISSIONS = [
  "users:read",
  "users:write",
  "users:delete",
  "products:read",
  "products:write",
  "products:edit",
  "products:delete",
  "orders:read",
  "orders:write",
  "orders:edit",
  "orders:delete",
  "categories:write",
  "categories:delete",
  "analytics:read",
  "settings:write",
] as const;
export type Permission = (typeof PERMISSIONS)[number];

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    "users:read",
    "users:write",
    "users:delete",
    "products:read",
    "products:write",
    "products:edit",
    "products:delete",
    "orders:read",
    "orders:write",
    "orders:edit",
    "orders:delete",
    "categories:write",
    "categories:delete",
    "analytics:read",
    "settings:write",
  ],
  seller: ["products:read", "orders:read", "analytics:read"],
  customer: ["products:read"],
};

export function can(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
