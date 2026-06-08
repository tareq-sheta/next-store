// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { FaShoppingCart, FaUser, FaSignOutAlt } from "react-icons/fa";
// import { useState } from "react";
// import { useAuthStore, useCartStore } from "@/lib/store";
// import { useRouter } from "next/navigation";

// export default function Header() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const currentUser = useAuthStore((state) => state.currentUser);
//   console.log(currentUser, "currentUser - header");
//   const logout = useAuthStore((state) => state.logout);
//   const cartCount = useCartStore((state) => state.cartCount());
//   const router = useRouter();

//   const handleLogout = () => {
//     logout();
//     router.push("/login");
//   };

//   return (
//     <header className="sticky top-0 z-50 bg-white shadow-sm">
//       <nav className="px-4 py-3">
//         <div className="container mx-auto flex items-center justify-between">
//           {/* Brand */}
//           <Link className="shrink-0" href="/" id="brand">
//             <div className="relative w-24 h-7.5">
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
//             className={`${
//               isMenuOpen ? "flex" : "hidden"
//             } lg:flex flex-col lg:flex-row absolute lg:relative top-16 lg:top-0 left-0 right-0 bg-white lg:bg-transparent z-50 lg:z-auto shadow-lg lg:shadow-none lg:justify-center lg:flex-1`}
//             id="navbarNav"
//           >
//             <ul className="flex flex-col lg:flex-row lg:space-x-6 p-4 lg:p-0">
//               <li>
//                 <Link
//                   className="block py-2 px-4 text-gray-700 hover:text-gray-900 font-medium transition-colors"
//                   href="/"
//                 >
//                   Home
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   className="block py-2 px-4 text-gray-700 hover:text-gray-900 font-medium transition-colors"
//                   href="/products"
//                 >
//                   Products
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   className="block py-2 px-4 text-gray-700 hover:text-gray-900 font-medium transition-colors"
//                   href="#footer"
//                 >
//                   Contact Us
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* Right Side */}
//           <div className="flex items-center gap-10 ml-auto">
//             {/* Cart Icon */}
//             <Link
//               id="cart-icon"
//               className="relative text-gray-700 hover:text-gray-900 transition-colors"
//               href="/cart"
//             >
//               <FaShoppingCart className="text-[25px]" />
//               {cartCount > 0 && (
//                 <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                   {cartCount}
//                 </span>
//               )}
//             </Link>

//             {/* Auth */}
//             {currentUser ? (
//               <div className="flex items-center gap-4">
//                 <Link
//                   href="/profile"
//                   className="flex items-center gap-1 text-sm text-gray-700 hover:text-gray-900"
//                 >
//                   <FaUser className="text-[20px]" />
//                   <span className="hidden md:inline">
//                     {currentUser.userName}
//                   </span>
//                 </Link>
//                 <button
//                   onClick={handleLogout}
//                   className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition-colors"
//                 >
//                   <FaSignOutAlt />
//                   <span className="hidden sm:inline">Logout</span>
//                 </button>
//               </div>
//             ) : (
//               <Link
//                 href="/login"
//                 className="text-sm bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
//               >
//                 Login
//               </Link>
//             )}

//             {/* Hamburger */}
//             <button
//               className="lg:hidden ml-2 p-2 text-gray-700 hover:text-gray-900 focus:outline-none"
//               type="button"
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//               aria-label="Toggle menu"
//             >
//               <svg
//                 className="w-6 h-6"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 {isMenuOpen ? (
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 ) : (
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M4 6h16M4 12h16M4 18h16"
//                   />
//                 )}
//               </svg>
//             </button>
//           </div>
//         </div>
//       </nav>
//     </header>
//   );
// }
"use client";
 
import Image from "next/image";
import Link from "next/link";
import { FaShoppingCart, FaUser, FaSignOutAlt } from "react-icons/fa";
import { useState } from "react";
import { useAuthStore, useCartStore } from "@/lib/store";
import { useRouter } from "next/navigation";
 
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const currentUser = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);
  const cartCount = useCartStore((state) => state.cartCount());
  const router = useRouter();
 
  const handleLogout = () => {
    logout();
    router.push("/login");
  };
 
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          {/* Brand */}
          <Link className="shrink-0" href="/" id="brand">
            <div className="relative w-24 h-7.5">
              <Image
                fill
                src="/assets/images/LogoMainVector.png"
                alt="Cyber Logo"
                style={{ objectFit: "contain" }}
              />
            </div>
          </Link>
 
          {/* Center Links */}
          <div
            className={`${
              isMenuOpen ? "flex" : "hidden"
            } lg:flex flex-col lg:flex-row absolute lg:relative top-16 lg:top-0 left-0 right-0 bg-white lg:bg-transparent z-50 lg:z-auto shadow-lg lg:shadow-none lg:justify-center lg:flex-1`}
          >
            <ul className="flex flex-col lg:flex-row lg:space-x-6 p-4 lg:p-0">
              <li>
                <Link
                  className="block py-2 px-4 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                  href="/"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  className="block py-2 px-4 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                  href="/products"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  className="block py-2 px-4 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                  href="#footer"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
 
          {/* Right Side */}
          <div className="flex items-center gap-10 ml-auto">
            {/* Cart Icon */}
            <Link
              id="cart-icon"
              className="relative text-gray-700 hover:text-gray-900 transition-colors"
              href="/cart"
            >
              <FaShoppingCart className="text-[25px]" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
 
            {/* Auth */}
            {currentUser ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/profile"
                  className="flex items-center gap-1 text-sm text-gray-700 hover:text-gray-900"
                >
                  <FaUser className="text-[20px]" />
                  <span className="hidden md:inline">{currentUser.userName}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition-colors"
                >
                  <FaSignOutAlt />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-sm bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
              >
                Login
              </Link>
            )}
 
            {/* Hamburger */}
            <button
              className="lg:hidden ml-2 p-2 text-gray-700 hover:text-gray-900 focus:outline-none"
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
