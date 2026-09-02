"use client";
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
// SessionProvider

// export default function LayoutContent({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const pathname = usePathname();
//   const isAuthPage = pathname === "/login" || pathname === "/register";
//   const isDashboard = pathname.startsWith("/dashboard");
//   return (
//     <>
//       {/* {!isAuthPage && !isDashboard && <Header />} */}
//       {!isAuthPage && <Header />}
//       <main className="grow">{children}</main>
//       {/* <main className="flex-1 overflow-hidden">{children}</main> */}
//       {!isAuthPage && !isDashboard && <Footer />}
//     </>
//   );
// }
//-------------------
//-------------------
//-------------------
export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <div
      className={
        isDashboard
          ? "h-screen flex flex-col overflow-hidden"
          : "min-h-screen flex flex-col"
      }
    >
      <SessionProvider>
        {!isAuthPage && <Header />}
        <main className={isDashboard ? "grow min-h-0 overflow-hidden" : "grow"}>
          {children}
        </main>
        {!isAuthPage && !isDashboard && <Footer />}
      </SessionProvider>
    </div>
  );
}
