// "use client";

// import Image from "next/image";
// import Link from "next/link";

// import { getSession, signOut, useSession } from "next-auth/react";
// import { usePathname, useRouter } from "next/navigation";
// import { RefObject, useEffect, useRef, useState } from "react";

// type User = {
//   id: string;
//   role: string;
//   name?: string | null;
//   email?: string | null;
//   image?: string | null;
// };
// export default function Header() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isMounted, setIsMounted] = useState(false);
//   const [currentUser, setCurrentUser] = useState<User | null>(null);
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const hamburgerRef = useRef<HTMLButtonElement>(null);
//   const mainRef = useRef<HTMLDivElement>(null);
//   // let session = getSession();
//   // let username = session.user.userName
//   // console.log(session);
//   // const currentUser = useAuthStore((state) => state.currentUser);
//   // const currentUser = { role: "mock", userName: "mock" };
//   // const logout = useAuthStore((state) => state.logout);
//   const cartCount = useCartStore((state) => state.cartCount());
//   const favCount = useFavStore((state) => state.items.length);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   let pathname = usePathname();
//   const router = useRouter();
//   // const handleClickOutside = (event: MouseEvent) => {
//   //   return (ele: RefObject<HTMLDivElement> | null) => {
//   //     // If the clicked element is NOT inside the target element, it's an outside click
//   //     if (ele!.current && !ele!.current.contains(event.target as Node)) {
//   //       setIsDropdownOpen(false);
//   //       console.log("Clicked outside!");
//   //     }
//   //   };
//   // };
//   const handleClickOutsideHamburger = (event: MouseEvent) => {
//     // If the clicked element is NOT inside the target element, it's an outside click
//     if (
//       dropdownRef.current &&
//       !dropdownRef.current.contains(event.target as Node)
//     ) {
//       setIsDropdownOpen(false);
//       console.log("Clicked outside!");
//     }
//   };
//   const handleClickOutsideMain = (event: MouseEvent) => {
//     const target = event.target as Node;

//     if (
//       mainRef.current &&
//       hamburgerRef.current &&
//       !mainRef.current.contains(target) && // Not in menu
//       !hamburgerRef.current.contains(target) // Not in hamburger button
//     ) {
//       setIsMenuOpen(false);
//     }
//   };

//   const handleLogout = async () => {
//     // logout();
//     await signOut({ callbackUrl: "/login" });
//   };
//   const getLinkClass = (path: string) => {
//     // Base layout styles
//     const baseClass =
//       "relative block py-2 px-3 sm:px-4 text-sm sm:text-base font-medium text-gray-700 hover:text-black transition-colors duration-300";

//     // Bottom dash animation styles using CSS pseudo-elements
//     const underlineClass =
//       "after:absolute after:bottom-0 after:left-1/2 after:h-[2px] after:bg-black after:transition-all after:duration-300 after:-translate-x-1/2";

//     // If active: full width underline. If inactive: zero width, expands to full on hover.
//     const stateClass =
//       pathname === path
//         ? "text-black after:w-full"
//         : "after:w-0 hover:after:w-full";

//     return `${baseClass} ${underlineClass} ${stateClass}`;
//   };
//   useEffect(() => {
//     let getMySession = async () => {
//       const { data: session, status } = useSession();
//       const currentUser = session?.user ?? null;
//       setCurrentUser(currentUser);
//     };
//     getMySession();
//   }, []);
//   useEffect(() => {
//     setIsMounted(true);
//     document.addEventListener("click", handleClickOutsideHamburger);
//     document.addEventListener("click", handleClickOutsideMain);
//     return () => {
//       document.removeEventListener("click", handleClickOutsideHamburger);
//       document.removeEventListener("click", handleClickOutsideMain);
//     };
//   }, []);
//   return (
//     <header className="sticky top-0 z-50 bg-white shadow-sm">
//       <nav className="px-2 sm:px-4 py-2 sm:py-3">
//         <div className="container mx-auto flex items-center justify-between gap-2 sm:gap-4">
//           {/* Brand */}
//           <Link className="shrink-0" href="/" id="brand">
//             <div className="relative w-16 sm:w-24 h-5 sm:h-7.5">
//               <Image
//                 fill
//                 src="/assets/images/LogoMainVector.png"
//                 alt="Cyber Logo"
//                 style={{ objectFit: "contain" }}
//               />
//             </div>
//           </Link>

//           {/* Center Links */}

//           <div
//             className={`flex flex-col lg:flex-row absolute lg:relative top-12 lg:top-0 left-0 right-0 bg-white lg:bg-transparent z-40 lg:z-auto shadow-lg lg:shadow-none lg:justify-center lg:flex-1 transition-all duration-300 ease-out origin-top ${
//               isMenuOpen
//                 ? "opacity-100 scale-y-100 pointer-events-auto"
//                 : "opacity-0 scale-y-0 pointer-events-none lg:opacity-100 lg:scale-y-100 lg:pointer-events-auto"
//             }`}
//             ref={mainRef}
//           >
//             <ul className="flex flex-col lg:flex-row lg:space-x-4 xl:space-x-6 p-2 sm:p-4 lg:p-0">
//               <li>
//                 <Link className={getLinkClass("/")} href="/">
//                   Home
//                 </Link>
//               </li>
//               <li>
//                 <Link className={getLinkClass("/products")} href="/products">
//                   Products
//                 </Link>
//               </li>
//               <li>
//                 <Link className={getLinkClass("/#footer")} href="#footer">
//                   Contact Us
//                 </Link>
//               </li>
//               <li>
//                 <Link className={getLinkClass("/about")} href="/about">
//                   About Us
//                 </Link>
//               </li>
//               {currentUser?.role === "admin" && (
//                 <li>
//                   <Link
//                     className={getLinkClass("/dashboard")}
//                     href="/dashboard"
//                   >
//                     dashboard
//                   </Link>
//                 </li>
//               )}
//             </ul>
//           </div>

//           {/* Right Side */}
//           <div className="flex items-center gap-3 sm:gap-6 ml-auto">
//             {/* fav Icon */}
//             <Link
//               id="fav-icon"
//               className="relative text-gray-700 hover:text-gray-900 transition-colors shrink-0"
//               href="/favorites"
//             >
//               <FaHeart className="text-lg sm:text-[25px]" />
//               {isMounted && favCount > 0 && (
//                 <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center text-[10px] sm:text-xs">
//                   {favCount}
//                 </span>
//               )}
//             </Link>

//             <Link
//               id="cart-icon"
//               className="relative text-gray-700 hover:text-gray-900 transition-colors shrink-0"
//               href="/cart"
//             >
//               <FaShoppingCart className="text-lg sm:text-[25px]" />
//               {isMounted && cartCount > 0 && (
//                 <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center text-[10px] sm:text-xs">
//                   {cartCount}
//                 </span>
//               )}
//             </Link>

//             {/* Auth */}
//             {currentUser ? (
//               <div className="relative" ref={dropdownRef}>
//                 <button
//                   onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                   className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-700 hover:text-black focus:outline-none py-1 sm:py-1.5 px-1.5 sm:px-2.5 rounded-lg hover:bg-gray-100 transition-colors shrink-0"
//                   aria-haspopup="true"
//                   aria-expanded={isDropdownOpen}
//                 >
//                   <FaUser className="text-base sm:text-[20px]" />
//                   <span className="hidden md:inline font-medium truncate max-w-20 sm:max-w-none">
//                     {currentUser.name}
//                   </span>

//                   <svg
//                     className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-500 transition-transform duration-200 shrink-0 ${
//                       isDropdownOpen ? "rotate-180" : ""
//                     }`}
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M19 9l-7 7-7-7"
//                     />
//                   </svg>
//                 </button>

//                 {/* Dropdown Menu with Smooth Transitions */}
//                 <div
//                   className={`absolute right-0 mt-2 w-40 sm:w-48 bg-white rounded-lg shadow-lg py-1 sm:py-1.5 border border-gray-100 z-50 origin-top-right transition-all duration-200 ease-out transform ${
//                     isDropdownOpen
//                       ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
//                       : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
//                   }`}
//                 >
//                   <Link
//                     href="/profile"
//                     onClick={() => setIsDropdownOpen(false)}
//                     className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-gray-700 hover:bg-gray-150 transition-colors"
//                   >
//                     <FaEdit className="text-gray-400 text-base sm:text-lg shrink-0" />
//                     <span>Edit Profile</span>
//                   </Link>
//                   <hr className="my-1 border-gray-100" />
//                   <button
//                     onClick={handleLogout}
//                     className="w-full flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
//                   >
//                     <FaSignOutAlt className="text-red-400 text-base sm:text-lg shrink-0" />
//                     <span>Logout</span>
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <Link
//                 href="/login"
//                 className="text-xs sm:text-sm bg-gray-900 text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded hover:bg-gray-700 transition-colors shrink-0 whitespace-nowrap"
//               >
//                 Login
//               </Link>
//             )}

//             <AnimatedHamburger
//               isOpen={isMenuOpen}
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//               reference={hamburgerRef}
//             />
//           </div>
//         </div>
//       </nav>
//     </header>
//   );
// }
//---------------
"use client";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaShoppingCart,
  FaUser,
  FaSignOutAlt,
  FaEdit,
  FaHeart,
} from "react-icons/fa";
import { useCartStore } from "@/lib/store";
import { AnimatedHamburger } from "./AnimatedHumburgerMenu";

import { CurrentUser } from "@/types/users";

// type User =

export default function Header() {
  const { data: session, status } = useSession();
  const currentUser = session?.user as CurrentUser | undefined;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  const cartCount = useCartStore((state) => state.cartCount());
  // const favCount = useFavStore((state) => state.items.length);
  const pathname = usePathname();
  // const router = useRouter();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  useEffect(() => {
    setIsMounted(true);

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsDropdownOpen(false);
      }
      if (
        mainRef.current &&
        hamburgerRef.current &&
        !mainRef.current.contains(target) &&
        !hamburgerRef.current.contains(target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const getLinkClass = (path: string) => {
    const base =
      "relative block py-2 px-3 sm:px-4 text-sm sm:text-base font-medium text-gray-700 hover:text-black transition-colors duration-300";
    const underline =
      "after:absolute after:bottom-0 after:left-1/2 after:h-[2px] after:bg-black after:transition-all after:duration-300 after:-translate-x-1/2";
    const state =
      pathname === path
        ? "text-black after:w-full"
        : "after:w-0 hover:after:w-full";
    return `${base} ${underline} ${state}`;
  };

  // loading state — avoids flash of wrong UI
  if (status === "loading")
    return <header className="sticky top-0 z-50 bg-white shadow-sm h-14" />;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="px-2 sm:px-4 py-2 sm:py-3">
        <div className="container mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand */}
          <Link className="shrink-0" href="/">
            <div className="relative w-16 sm:w-24 h-5 sm:h-7.5">
              <Image
                fill
                src="/assets/images/LogoMainVector.png"
                alt="Logo"
                style={{ objectFit: "contain" }}
              />
            </div>
          </Link>

          {/* Center Links */}
          <div
            ref={mainRef}
            className={`flex flex-col lg:flex-row absolute lg:relative top-12 lg:top-0 left-0 right-0 bg-white lg:bg-transparent z-40 shadow-lg lg:shadow-none lg:justify-center lg:flex-1 transition-all duration-300 ease-out origin-top ${
              isMenuOpen
                ? "opacity-100 scale-y-100 pointer-events-auto"
                : "opacity-0 scale-y-0 pointer-events-none lg:opacity-100 lg:scale-y-100 lg:pointer-events-auto"
            }`}
          >
            <ul className="flex flex-col lg:flex-row lg:space-x-4 xl:space-x-6 p-2 sm:p-4 lg:p-0">
              <li>
                <Link className={getLinkClass("/")} href="/">
                  Home
                </Link>
              </li>
              <li>
                <Link className={getLinkClass("/products")} href="/products">
                  Products
                </Link>
              </li>
              <li>
                <Link className={getLinkClass("/about")} href="/about">
                  About Us
                </Link>
              </li>

              {(currentUser?.role === "admin" ||
                currentUser?.role === "seller") && (
                <li>
                  <Link
                    className={getLinkClass("/dashboard")}
                    href="/dashboard"
                  >
                    Dashboard
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3 sm:gap-6 ml-auto">
            {/* <Link
              href="/favorites"
              className="relative text-gray-700 hover:text-gray-900 transition-colors shrink-0"
            >
              <FaHeart className="text-lg sm:text-[25px]" />
              {isMounted && favCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px]">
                  {favCount}
                </span>
              )}
            </Link> */}

            <Link
              href="/cart"
              className="relative text-gray-700 hover:text-gray-900 transition-colors shrink-0"
            >
              <FaShoppingCart className="text-lg sm:text-[25px]" />
              {isMounted && cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px]">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {currentUser ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-700 hover:text-black focus:outline-none py-1 px-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-haspopup="true"
                  aria-expanded={isDropdownOpen}
                >
                  <FaUser className="text-base sm:text-[20px]" />
                  <span className="hidden md:inline font-medium">
                    {currentUser.name}
                  </span>
                  <svg
                    className={`w-3 h-3 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <div
                  className={`absolute right-0 mt-2 w-40 sm:w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-100 z-50 origin-top-right transition-all duration-200 ease-out ${
                    isDropdownOpen
                      ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                  }`}
                >
                  <Link
                    href="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <FaEdit className="text-gray-400" />
                    <span>Edit Profile</span>
                  </Link>
                  <hr className="my-1 border-gray-100" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs sm:text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                  >
                    <FaSignOutAlt className="text-red-400" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-xs sm:text-sm bg-gray-900 text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded hover:bg-gray-700 transition-colors whitespace-nowrap"
              >
                Login
              </Link>
            )}

            <AnimatedHamburger
              isOpen={isMenuOpen}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              reference={hamburgerRef}
            />
          </div>
        </div>
      </nav>
    </header>
  );
}
