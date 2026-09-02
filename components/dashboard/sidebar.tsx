// "use client";

// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { useAuthStore } from "@/lib/store";
// // import {
// //   LayoutDashboard,
// //   Users,
// //   ShoppingBag,
// //   Package,
// //   BarChart3,
// //   LogOut,
// //   ChevronRight,
// //   Store,
// // } from "lucide-react";
// import {
//   FiGrid, // Alternative for LayoutDashboard
//   FiUsers, // Matches Users
//   FiShoppingBag, // Matches ShoppingBag
//   FiPackage, // Matches Package
//   FiBarChart2, // Alternative for BarChart3 (Feather only has BarChart and BarChart2)
//   FiLogOut, // Matches LogOut
//   FiChevronRight, // Matches ChevronRight
//   FiCrosshair, // Alternative for Store (Feather lacks a direct "Store" icon)
// } from "react-icons/fi";
// import Image from "next/image";

// const adminNav = [
//   { label: "Overview", href: "/dashboard", icon: FiGrid },
//   { label: "Users", href: "/dashboard/users", icon: FiUsers },
//   { label: "Orders", href: "/dashboard/orders", icon: FiShoppingBag },
//   { label: "Products", href: "/dashboard/products", icon: FiPackage },
//   { label: "Analytics", href: "/dashboard/analytics", icon: FiBarChart2 },
// ];

// const sellerNav = [
//   { label: "Overview", href: "/dashboard", icon: FiGrid },
//   { label: "My Products", href: "/dashboard/products", icon: FiPackage },
//   { label: "My Orders", href: "/dashboard/orders", icon: FiShoppingBag },
// ];

// export default function Sidebar() {
//   const pathname = usePathname();
//   const router = useRouter();
//   const currentUser = useAuthStore((s) => s.currentUser);
//   const logout = useAuthStore((s) => s.logout);

//   const nav = currentUser?.role === "admin" ? adminNav : sellerNav;

//   const handleLogout = () => {
//     logout();
//     router.push("/login");
//   };

//   return (
//     <aside className="w-56 shrink-0 min-h-screen bg-white border-r border-gray-100 flex flex-col">
//       {/* Brand */}
//       <div className="px-5 py-5 border-b border-gray-100">
//         <Link href="/" className="flex items-center gap-2 group">
//           {/* <FiCrosshair size={16} className="text-gray-900" />
//           <span className="text-gray-900 font-semibold text-sm tracking-tight">
//             Cyber
//           </span>
//           <span className="ml-auto text-gray-300 text-xs group-hover:text-gray-500 transition-colors">
//             ↗
//           </span> */}
//           <div className="relative m-auto w-24 h-7.5">
//             <Image
//               fill
//               src="/assets/images/login-logo.png"
//               alt="Cyber Logo"
//               style={{
//                 objectFit: "contain",
//                 filter: "invert(1)",
//               }}
//             />
//           </div>
//         </Link>
//       </div>

//       {/* User pill */}
//       <div className="px-4 py-4 border-b border-gray-100">
//         <div className="flex items-center gap-2.5 bg-gray-150 rounded-xl px-3 py-2.5">
//           <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-semibold uppercase shrink-0">
//             {currentUser?.userName?.[0] ?? "?"}
//           </div>
//           <div className="min-w-0">
//             <p className="text-gray-900 text-xs font-medium truncate">
//               {currentUser?.userName ?? "—"}
//             </p>
//             <p className="text-gray-400 text-[10px] capitalize">
//               {currentUser?.role ?? "—"}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Nav */}
//       <nav className="flex-1 px-3 py-4 space-y-0.5">
//         <p className="text-[10px] uppercase tracking-widest text-gray-300 px-3 mb-2 font-medium">
//           Menu
//         </p>
//         {nav.map(({ label, href, icon: Icon }) => {
//           const active = pathname === href;
//           return (
//             <Link
//               key={href}
//               href={href}
//               className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
//                 active
//                   ? "bg-gray-900 text-white"
//                   : "text-gray-500 hover:text-gray-900 hover:bg-gray-150"
//               }`}
//             >
//               <Icon
//                 size={15}
//                 className={
//                   active
//                     ? "text-white"
//                     : "text-gray-400 group-hover:text-gray-700"
//                 }
//               />
//               <span>{label}</span>
//               {active && (
//                 <FiChevronRight size={12} className="ml-auto text-white/50" />
//               )}
//             </Link>
//           );
//         })}
//       </nav>

//       {/* Logout */}
//       <div className="px-3 py-4 border-t border-gray-100">
//         <button
//           onClick={handleLogout}
//           className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all group"
//         >
//           <FiLogOut size={15} />
//           <span>Sign out</span>
//         </button>
//       </div>
//     </aside>
//   );
// }
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
// import { useAuthStore } from "@/lib/store";
import {
  LuLayoutDashboard,
  LuLogOut,
  LuPackage,
  LuShoppingBag,
  // LuStore,
  LuUsers,
} from "react-icons/lu";
import { FiBarChart } from "react-icons/fi";
import { CurrentUser } from "@/types";
import { signOut, useSession } from "next-auth/react";
// FiBarChart
// import {
//   FiGrid, // Alternative for LayoutDashboard
//   FiUsers, // Matches Users
//   FiShoppingBag, // Matches ShoppingBag
//   FiPackage, // Matches Package
//   FiBarChart2, // Alternative for BarChart3 (Feather only has BarChart and BarChart2)
//   FiLogOut, // Matches LogOut
//   FiChevronRight, // Matches ChevronRight
//   FiCrosshair, // Alternative for Store (Feather lacks a direct "Store" icon)
// } from "react-icons/fi";
// import {
//   LayoutDashboard, Users, ShoppingBag, Package, BarChart3, LogOut, Store,
// } from "lucide-react";

const adminNav = [
  { label: "Overview", href: "/dashboard", icon: LuLayoutDashboard },
  { label: "Users", href: "/dashboard/users", icon: LuUsers },
  { label: "Orders", href: "/dashboard/orders", icon: LuShoppingBag },
  { label: "Products", href: "/dashboard/products", icon: LuPackage },
  { label: "Analytics", href: "/dashboard/analytics", icon: FiBarChart },
];

const sellerNav = [
  { label: "Overview", href: "/dashboard", icon: LuLayoutDashboard },
  { label: "My Products", href: "/dashboard/products", icon: LuPackage },
  { label: "My Orders", href: "/dashboard/orders", icon: LuShoppingBag },
  { label: "Analytics", href: "/dashboard/analytics", icon: FiBarChart },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  // const currentUser = useAuthStore((s) => s.currentUser);
  const { data: session } = useSession();
  const currentUser = session?.user as CurrentUser | undefined;
  // const logout = useAuthStore((s) => s.logout);
  const nav = currentUser?.role === "admin" ? adminNav : sellerNav;

  return (
    <aside className="w-52 shrink-0 h-full bg-white border-r border-gray-100 flex flex-col">
      {/* Brand */}
      {/* <div className="px-5 h-14 flex items-center border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2 group">
          <LuStore size={15} className="text-gray-900" />
          <span className="text-gray-900 font-semibold text-sm tracking-tight">
            Cyber
          </span>
          <span className="ml-auto text-[10px] text-gray-300 group-hover:text-gray-500 transition-colors">
            ↗ Store
          </span>
        </Link>
      </div> */}

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
                active
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-150"
              }`}
            >
              <Icon
                size={14}
                className={active ? "text-white" : "text-gray-400"}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className="px-3 py-4 border-t border-gray-100 space-y-1">
        {/* <div className="flex items-center gap-2.5 px-3 py-2">
          <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center text-white text-[10px] font-bold uppercase shrink-0">
            {currentUser?.userName?.[0] ?? "?"}
          </div>
          <div className="min-w-0">
            <p className="text-gray-900 text-xs font-medium truncate">
              {currentUser?.userName}
            </p>
            <p className="text-gray-400 text-[10px] capitalize">
              {currentUser?.role}
            </p>
          </div>
        </div> */}
        <button
          onClick={() => {
            signOut();
            router.push("/login");
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
        >
          <LuLogOut size={14} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
