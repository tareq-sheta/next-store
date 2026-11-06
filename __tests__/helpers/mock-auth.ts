/**
 * Mock session factories for testing API routes.
 *
 * Usage in tests:
 *   jest.mock("@/lib/auth-guard");
 *   const requireAuthMock = requireAuth as jest.MockedFunction<typeof requireAuth>;
 *   requireAuthMock.mockResolvedValue(mockSession("admin"));
 */

import { jest } from "@jest/globals";
import { CustomError } from "@/utils/ErrorHandler";
import type { requireAuth } from "@/lib/auth-guard";

// Stable ObjectIds for each role — all are valid 24-char hex strings.
export const ADMIN_ID = "aaaaaaaaaaaaaaaaaaaaaa01";
export const CUSTOMER_ID = "cccccccccccccccccccccc01";
export const SELLER_ID = "bbbbbbbbbbbbbbbbbbbbbb01";
// A second customer for "other user" scenarios
export const OTHER_CUSTOMER_ID = "dddddddddddddddddddddd01";

type Role = "admin" | "seller" | "customer";

/**
 * Returns a mock NextAuth session object matching the shape
 * returned by `getServerSession(authOptions)` and by `requireAuth()`.
 */
export function mockSession(role: Role, userId?: string) {
  const idMap: Record<Role, string> = {
    admin: ADMIN_ID,
    seller: SELLER_ID,
    customer: CUSTOMER_ID,
  };

  return {
    user: {
      id: userId ?? idMap[role],
      role,
      name: `Test ${role}`,
      email: `${role}@test.com`,
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };
}

/**
 * Configures `requireAuth` to throw a 401 CustomError, matching the
 * real implementation in lib/auth-guard.ts.
 *
 * Typed against `jest.MockedFunction<typeof requireAuth>` (not bare
 * `jest.Mock`) — under Jest 30's types, `jest.Mock` alone resolves to
 * `Mock<UnknownFunction>`, which a properly-typed `MockedFunction<...>`
 * is no longer assignable to.
 */
export function mockUnauthenticated(
  requireAuthMock: jest.MockedFunction<typeof requireAuth>,
) {
  requireAuthMock.mockRejectedValue(
    new CustomError("Unauthorized", 401, "requireAuth"),
  );
}
