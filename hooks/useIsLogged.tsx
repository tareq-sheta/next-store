"use client";

import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Redirects to /login if the user is not authenticated.
 * Use this hook on any page that requires authentication.
 */
export default function useIsLogged(): void {
  const currentUser = useAuthStore((state) => state.currentUser);
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.replace("/login");
    }
  }, [currentUser, router]);
}
