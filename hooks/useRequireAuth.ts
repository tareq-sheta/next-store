"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { UserRole } from "@/lib/rbac/roles";
// import { CurrentUser } from "@/types/users";

interface UseRequireAuthOptions {
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export function useRequireAuth(options: UseRequireAuthOptions = {}) {
  const { allowedRoles, redirectTo = "/login" } = options;
  const { data: session, status } = useSession();
  const router = useRouter();

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated" && !!session?.user;

  const userRole = session?.user?.role as UserRole | undefined;
  const isAuthorized =
    isAuthenticated &&
    (!allowedRoles || (userRole && allowedRoles.includes(userRole)));

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace(redirectTo);
    } else if (allowedRoles && !isAuthorized) {
      router.replace("/"); // Redirect unauthorized role to home
    }
  }, [
    isLoading,
    isAuthenticated,
    isAuthorized,
    allowedRoles,
    redirectTo,
    router,
  ]);

  return {
    session,
    user: {},
    isLoading,
    isAuthorized,
  };
}
