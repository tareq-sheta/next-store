"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Sidebar from "@/components/dashboard/sidebar";
import type { CurrentUser } from "@/types/users";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const currentUser = session?.user as CurrentUser | undefined;
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!currentUser) {
      router.replace("/login");
      return;
    }
    if (currentUser.role === "customer") router.replace("/");
  }, [currentUser, status, router]);

  if (status === "loading" || !currentUser || currentUser.role === "customer") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-hidden bg-gray-150">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
