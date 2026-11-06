// // "use client";

// // import { useEffect, useState, useCallback } from "react";
// // import {
// //   LuTrendingUp,
// //   LuPackage,
// //   LuShoppingBag,
// //   LuTriangle,
// // } from "react-icons/lu";
// // import type { AdminProductDTO, ProductDTO } from "@/types/products";
// // import type { OrderDTO } from "@/types/orders";
// // import {
// //   DashboardPageHeader,
// //   Skeleton,
// //   //  TopBar
// // } from "@/components/dashboard/dashboard-shared";

// // function StatCard({
// //   label,
// //   value,
// //   icon: Icon,
// //   accent,
// //   sub,
// // }: {
// //   label: string;
// //   value: string | number;
// //   icon: React.ElementType;
// //   accent: string;
// //   sub?: string;
// // }) {
// //   return (
// //     <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-4">
// //       <div className="flex items-center justify-between">
// //         <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">
// //           {label}
// //         </span>
// //         <div
// //           className={`w-8 h-8 rounded-lg flex items-center justify-center ${accent}`}
// //         >
// //           <Icon size={15} />
// //         </div>
// //       </div>
// //       <div>
// //         <p className="text-gray-900 text-2xl font-semibold tracking-tight">
// //           {value}
// //         </p>
// //         {sub && <p className="text-gray-300 text-xs mt-0.5">{sub}</p>}
// //       </div>
// //     </div>
// //   );
// // }

// // export default function AdminAnalyticsPage() {
// //   const [products, setProducts] = useState<AdminProductDTO[]>([]);
// //   const [orders, setOrders] = useState<OrderDTO[]>([]);
// //   const [loading, setLoading] = useState(true);

// //   const loadAnalytics = useCallback(async () => {
// //     setLoading(true);
// //     try {
// //       const [p, o] = await Promise.all([
// //         fetch("/api/products").then((r) => r.json()),
// //         fetch("/api/orders").then((r) => r.json()),
// //       ]);
// //       if (p.success) setProducts(p.data);
// //       if (o.success) setOrders(o.data);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, []);

// //   useEffect(() => {
// //     loadAnalytics();
// //   }, [loadAnalytics]);

// //   // Category distribution
// //   const categoryMap = products.reduce(
// //     (acc, p) => {
// //       acc[p.category] = (acc[p.category] ?? 0) + 1;
// //       return acc;
// //     },
// //     {} as Record<string, number>,
// //   );
// //   const categoryData = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
// //   const maxCat = categoryData[0]?.[1] ?? 1;

// //   // Order status distribution
// //   const statusMap = orders.reduce(
// //     (acc, o) => {
// //       acc[o.orderStatus] = (acc[o.orderStatus] ?? 0) + 1;
// //       return acc;
// //     },
// //     {} as Record<string, number>,
// //   );

// //   const statusColors: Record<string, string> = {
// //     pending: "bg-amber-500",
// //     shipped: "bg-blue-500",
// //     delivered: "bg-emerald-500",
// //     cancelled: "bg-red-500",
// //   };

// //   // Top products by stock (proxy for popularity)
// //   const topProducts = [...products]
// //     .sort((a, b) => b.stock - a.stock)
// //     .slice(0, 5);

// //   const lowStock = products.filter((p) => p.stock <= 5).length;
// //   const outOfStock = products.filter((p) => p.stock === 0).length;

// //   return (
// //     <div className="flex flex-col flex-1 bg-gray-150 overflow-hidden">
// //       {/* <TopBar title="Analytics" /> */}

// //       <DashboardPageHeader
// //         title="Analytics"
// //         subtitle="Store-wide metrics and inventory insights"
// //         loading={loading}
// //         onRefresh={loadAnalytics}
// //       />

// //       {/* Content — fills remaining height, no outer viewport scroll */}
// //       <div className="flex flex-col flex-1 px-8 py-4 gap-4 overflow-hidden">
// //         {/* Stat cards — fixed layout size */}
// //         <div className="shrink-0">
// //           {loading ? (
// //             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
// //               {Array(4)
// //                 .fill(0)
// //                 .map((_, i) => (
// //                   <Skeleton key={i} className="h-24" />
// //                 ))}
// //             </div>
// //           ) : (
// //             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
// //               <StatCard
// //                 label="Total Products"
// //                 value={products.length}
// //                 icon={LuPackage}
// //                 accent="bg-gray-100 text-gray-600"
// //                 sub="in catalogue"
// //               />
// //               <StatCard
// //                 label="Total Orders"
// //                 value={orders.length}
// //                 icon={LuShoppingBag}
// //                 accent="bg-emerald-500/10 text-emerald-400"
// //                 sub="all time"
// //               />
// //               <StatCard
// //                 label="Low Stock"
// //                 value={lowStock}
// //                 icon={LuTriangle}
// //                 accent="bg-amber-500/10 text-amber-400"
// //                 sub="≤ 5 units"
// //               />
// //               <StatCard
// //                 label="Out of Stock"
// //                 value={outOfStock}
// //                 icon={LuTriangle}
// //                 accent="bg-red-500/10 text-red-400"
// //                 sub="needs restocking"
// //               />
// //             </div>
// //           )}
// //         </div>

// //         {/* Middle row — capped height grid */}
// //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 shrink-0 max-h-70">
// //           {/* Category distribution */}
// //           <div className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col min-h-0">
// //             <h3 className="text-gray-900 text-sm font-semibold mb-1 shrink-0">
// //               Products by Category
// //             </h3>
// //             <p className="text-gray-300 text-xs mb-3 shrink-0">
// //               Inventory distribution
// //             </p>

// //             <div className="flex-1 overflow-y-auto min-h-0 pr-1 custom-scroll">
// //               {loading ? (
// //                 <div className="space-y-3">
// //                   {Array(3)
// //                     .fill(0)
// //                     .map((_, i) => (
// //                       <Skeleton key={i} className="h-8" />
// //                     ))}
// //                 </div>
// //               ) : categoryData.length === 0 ? (
// //                 <p className="text-gray-300 text-sm text-center py-8">
// //                   No data yet
// //                 </p>
// //               ) : (
// //                 <div className="space-y-3">
// //                   {categoryData.map(([name, count]) => (
// //                     <div key={name}>
// //                       <div className="flex items-center justify-between mb-1.5">
// //                         <span className="text-gray-600 text-xs capitalize">
// //                           {name}
// //                         </span>
// //                         <span className="text-gray-400 text-xs">
// //                           {count} items ·{" "}
// //                           {Math.round((count / products.length) * 100)}%
// //                         </span>
// //                       </div>
// //                       <div className="h-1.5 bg-gray-150 rounded-full overflow-hidden">
// //                         <div
// //                           className="h-full bg-gray-900 rounded-full transition-all duration-700"
// //                           style={{ width: `${(count / maxCat) * 100}%` }}
// //                         />
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>
// //               )}
// //             </div>
// //           </div>

// //           {/* Order status distribution */}
// //           <div className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col min-h-0">
// //             <h3 className="text-gray-900 text-sm font-semibold mb-1 shrink-0">
// //               Orders by Status
// //             </h3>
// //             <p className="text-gray-300 text-xs mb-3 shrink-0">
// //               Current pipeline breakdown
// //             </p>

// //             <div className="flex-1 overflow-y-auto min-h-0 pr-1 custom-scroll">
// //               {loading ? (
// //                 <div className="space-y-3">
// //                   {Array(3)
// //                     .fill(0)
// //                     .map((_, i) => (
// //                       <Skeleton key={i} className="h-8" />
// //                     ))}
// //                 </div>
// //               ) : orders.length === 0 ? (
// //                 <p className="text-gray-300 text-sm text-center py-8">
// //                   No orders yet
// //                 </p>
// //               ) : (
// //                 <div className="space-y-4">
// //                   {Object.entries(statusMap).map(([status, count]) => (
// //                     <div key={status} className="flex items-center gap-3">
// //                       <div
// //                         className={`w-2 h-2 rounded-full shrink-0 ${statusColors[status] ?? "bg-gray-1500"}`}
// //                       />
// //                       <div className="flex-1">
// //                         <div className="flex items-center justify-between mb-1">
// //                           <span className="text-gray-600 text-xs capitalize">
// //                             {status}
// //                           </span>
// //                           <span className="text-gray-400 text-xs">{count}</span>
// //                         </div>
// //                         <div className="h-1.5 bg-gray-150 rounded-full overflow-hidden">
// //                           <div
// //                             className={`h-full rounded-full transition-all duration-700 ${statusColors[status] ?? "bg-gray-1500"}`}
// //                             style={{
// //                               width: `${(count / orders.length) * 100}%`,
// //                             }}
// //                           />
// //                         </div>
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         </div>

// //         {/* Top products table — dynamically claims remaining room */}
// //         <div className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col flex-1 min-h-0">
// //           <div className="flex items-center justify-between mb-3 shrink-0">
// //             <div>
// //               <h3 className="text-gray-900 text-sm font-semibold">
// //                 Top Products
// //               </h3>
// //               <p className="text-gray-300 text-xs">Ranked by quantity</p>
// //             </div>
// //             <LuTrendingUp size={14} className="text-gray-300" />
// //           </div>

// //           <div className="flex-1 overflow-y-auto min-h-0 pr-1 custom-scroll">
// //             {loading ? (
// //               <div className="space-y-3">
// //                 {Array(4)
// //                   .fill(0)
// //                   .map((_, i) => (
// //                     <Skeleton key={i} className="h-12" />
// //                   ))}
// //               </div>
// //             ) : topProducts.length === 0 ? (
// //               <p className="text-gray-300 text-sm text-center py-8">
// //                 No products yet
// //               </p>
// //             ) : (
// //               <div className="space-y-2">
// //                 {topProducts.map((product, i) => (
// //                   <div
// //                     key={product._id}
// //                     className="flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-gray-150 transition-colors"
// //                   >
// //                     <span className="text-gray-300 text-xs font-mono w-4 shrink-0">
// //                       {i + 1}
// //                     </span>
// //                     {product.image ? (
// //                       // eslint-disable-next-line @next/next/no-img-element
// //                       <img
// //                         src={product.image}
// //                         alt={product.name}
// //                         className="w-8 h-8 rounded-lg object-cover border border-gray-100 shrink-0"
// //                       />
// //                     ) : (
// //                       <div className="w-8 h-8 rounded-lg bg-gray-150 shrink-0" />
// //                     )}
// //                     <div className="flex-1 min-w-0">
// //                       <p className="text-gray-900 text-xs font-medium truncate">
// //                         {product.name}
// //                       </p>
// //                       <p className="text-gray-300 text-[11px] capitalize">
// //                         {product.category}
// //                       </p>
// //                     </div>
// //                     <div className="text-right shrink-0">
// //                       <p className="text-gray-900 text-xs font-semibold">
// //                         ${product.price}
// //                       </p>
// //                       <p
// //                         className={`text-[11px] ${product.stock <= 5 ? "text-amber-400" : "text-gray-300"}`}
// //                       >
// //                         {product.stock} in stock
// //                       </p>
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
// //----------
// "use client";
// import { useEffect, useState } from "react";
// import {
//   FiPackage,
//   FiShoppingBag,
//   FiUsers,
//   FiArrowUpRight,
// } from "react-icons/fi";
// import Link from "next/link";
// import { useSession } from "next-auth/react";
// import type { SellerProductDTO, AdminProductDTO } from "@/types/products";
// import type { CurrentUser, UserDTO } from "@/types/users";
// import type { OrderDTO } from "@/types/orders";
// import {
//   Skeleton,
//   statusBadge,
//   roleBadge,
//   timeAgo,
//   DashboardPageHeader,
// } from "@/components/dashboard/dashboard-shared";
// import {
//   fetchAllOrders,
//   fetchAllUsers,
//   fetchAdminDashboardProducts,
//   fetchSellerDashboardProducts,
// } from "@/lib";

// import { FaDollarSign } from "react-icons/fa6";

// interface DisplayProducts {
//   _id: string;
//   name: string;
//   price: number;
//   stock: number;
//   sellerName: string;
// }

// interface Stats {
//   // recentlyAddedProducts: number;
//   totalProducts: number;
//   latestProducts: DisplayProducts[];
//   latestOrders: OrderDTO[];
//   users: UserDTO[];

//   thisWeekRevenue: number;
//   totalRevenue: number;
// }

// function StatCard({
//   label,
//   value,
//   icon: Icon,
//   sub,
//   href,
//   warn,
// }: {
//   label: string;
//   value: number | string;
//   icon: React.ElementType;
//   //   sub: string;
//   sub: React.ReactNode;
//   href: string;
//   warn?: boolean;
// }) {
//   return (
//     <Link
//       href={href}
//       // className={`bg-white border rounded-xl p-5 flex flex-col gap-3 hover:shadow-md transition-all group ${
//       //   warn && value > 0
//       //     ? "border-amber-200"
//       //     : "border-gray-100 hover:border-gray-200"
//       // }`}
//       className={`bg-white border rounded-xl p-5 flex flex-col gap-3 hover:shadow-md transition-all group border-gray-100 hover:border-gray-200`}
//     >
//       <div className="flex items-center justify-between">
//         <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
//           {label}
//         </span>
//         <div
//           // className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
//           //   warn && value > 0
//           //     ? "bg-amber-50 text-amber-500"
//           //     : "bg-gray-150 text-gray-400 group-hover:bg-gray-100 group-hover:text-gray-600"
//           // }`}
//           className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors  bg-gray-150 text-gray-400 group-hover:bg-gray-100 group-hover:text-gray-600`}
//         >
//           <Icon size={14} />
//         </div>
//       </div>
//       <div>
//         <p
//           // className={`text-3xl font-bold tracking-tight ${warn && value > 0 ? "text-amber-600" : "text-gray-900"}`}
//           className={`text-3xl font-bold tracking-tight text-gray-900`}
//         >
//           {value}
//         </p>
//         {/* <p className="text-gray-400 text-[11px] mt-0.5">{sub}</p> */}
//         <div className="text-gray-400 text-[11px] mt-0.5">{sub}</div>
//       </div>
//     </Link>
//   );
// }

// function SectionHeader({
//   title,
//   href,
//   linkLabel = "View all",
// }: {
//   title: string;
//   href: string;
//   linkLabel?: string;
// }) {
//   return (
//     <div className="flex items-center justify-between mb-4">
//       <h3 className="text-gray-900 text-sm font-semibold">{title}</h3>
//       <Link
//         href={href}
//         className="text-[11px] font-medium text-gray-400 hover:text-gray-700 flex items-center gap-1 transition-colors"
//       >
//         {linkLabel} <FiArrowUpRight size={11} />
//       </Link>
//     </div>
//   );
// }

// function Empty({ message }: { message: string }) {
//   return (
//     <div className="flex flex-col items-center justify-center py-8 text-gray-500">
//       <p className="text-xs">{message}</p>
//     </div>
//   );
// }

// export default function AdminAnalytics() {
//   // const { data: session } = useSession();
//   // const currentUser = session?.user as CurrentUser | undefined;
//   // const isAdmin = currentUser?.role === "admin";

//   const [stats, setStats] = useState<Stats | null>(null);
//   const [recentOrders, setRecentOrders] = useState<OrderDTO[]>([]);
//   // const [topProducts, setTopProducts] = useState<DisplayProducts[]>([]);
//   const [recentUsers, setRecentUsers] = useState<UserDTO[]>([]);
//   const [loading, setLoading] = useState(true);

//   async function load() {
//     setLoading(true);
//     try {
//       const [productsRes, ordersRes, usersRes] = await Promise.all([
//         fetchAdminDashboardProducts(),
//         fetchAllOrders(),
//         fetchAllUsers(),
//       ]);

//       const products = productsRes.success ? productsRes.data : [];
//       const orders: OrderDTO[] = ordersRes.success ? ordersRes.data : [];
//       const users: UserDTO[] = usersRes?.success ? usersRes.data : [];
//       const lastAddedProducts = products.sort(
//         (a, b) =>
//           new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
//       );
//       const lastAddedProductsWeek = products.filter((product) => {
//         const productDate = new Date(product.createdAt);
//         const sevenDaysAgo = new Date();
//         sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
//         return productDate >= sevenDaysAgo;
//       });

//       // console.log("products111", productsRes);
//       // console.log("orders111", ordersRes);
//       // console.log("users111", usersRes);
//       setStats({
//         totalProducts: lastAddedProducts.length,
//         latestProducts: lastAddedProductsWeek,
//         users: users,
//         latestOrders: orders,
//         thisWeekRevenue: orders
//           .filter((order) => {
//             const orderDate = new Date(order.createdAt);
//             const sevenDaysAgo = new Date();
//             sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
//             return orderDate >= sevenDaysAgo;
//           })
//           .reduce((acc, order) => {
//             const orderTotal =
//               order.products?.reduce(
//                 (itemSum, item) =>
//                   itemSum + item.product?.price * item.quantity,
//                 0,
//               ) ?? 0;
//             return acc + orderTotal;
//           }, 0),
//         totalRevenue: orders.reduce((acc, order) => {
//           const orderTotal =
//             order.products?.reduce(
//               (itemSum, item) => itemSum + item.product?.price * item.quantity,
//               0,
//             ) ?? 0;
//           return acc + orderTotal;
//         }, 0),
//       });
//       setRecentOrders(
//         [...orders]
//           .sort(
//             (a, b) =>
//               new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
//           )
//           .slice(0, 6),
//       );
//       // setTopProducts(lastAddedProducts.slice(0, 6));
//       setRecentUsers(
//         [...users]
//           .sort(
//             (a, b) =>
//               new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
//           )
//           .slice(0, 5),
//       );
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     load();
//   }, []);
//   console.log("stats", stats);
//   return (
//     <div className="flex flex-col flex-1 bg-gray-150 overflow-hidden">
//       <DashboardPageHeader
//         title="Overview"
//         subtitle="Full store overview"
//         loading={loading}
//         onRefresh={load}
//       />
//       <div className="flex flex-col flex-1 px-8 py-4 gap-4 overflow-hidden">
//         <div className="shrink-0">
//           {loading ? (
//             <div className={`grid gap-4 grid-cols-4`}>
//               {Array(4)
//                 .fill(0)
//                 .map((_, i) => (
//                   <Skeleton key={i} className="h-24" />
//                 ))}
//             </div>
//           ) : (
//             stats && (
//               <div className={`grid gap-4 grid-cols-4`}>
//                 <StatCard
//                   label="Total Products"
//                   value={stats.totalProducts}
//                   icon={FiPackage}
//                   sub={
//                     <span className="flex items-center gap-1.5">
//                       <span className="text-gray-500 font-medium">
//                         {stats.latestProducts.length} recently added
//                       </span>
//                     </span>
//                   }
//                   href="/dashboard/products"
//                 />
//                 <StatCard
//                   label="Total Orders"
//                   value={stats.latestOrders.length}
//                   icon={FiShoppingBag}
//                   sub={
//                     <span className="flex items-center gap-1.5">
//                       <span className="text-gray-500 font-medium">
//                         {
//                           stats.latestOrders.filter(
//                             (o) => o.orderStatus === "delivered",
//                           ).length
//                         }{" "}
//                         Completed
//                       </span>
//                       <span className="text-gray-300">&bull;</span>
//                       <span className="text-gray-500 font-medium">
//                         {
//                           stats.latestOrders.filter(
//                             (o) => o.orderStatus === "pending",
//                           ).length
//                         }{" "}
//                         Pending
//                       </span>
//                     </span>
//                   }
//                   href="/dashboard/orders"
//                 />

//                 {/* <StatCard
//                   label="Users"
//                   value={stats.totalUsers}
//                   icon={FiUsers}
//                   sub="registered accounts"
//                   href="/dashboard/users"
//                 /> */}
//                 <StatCard
//                   label="USERS"
//                   value={stats.users.length}
//                   icon={FiUsers}
//                   href="/dashboard/users"
//                   sub={
//                     <span className="flex items-center gap-1.5">
//                       <span className="text-gray-500 font-medium">
//                         {
//                           stats.users.filter((u) => u.role === "customer")
//                             .length
//                         }{" "}
//                         Customers
//                       </span>
//                       <span className="text-gray-300">&bull;</span>
//                       <span className="text-gray-500 font-medium">
//                         {stats.users.filter((u) => u.role === "seller").length}{" "}
//                         Sellers
//                       </span>
//                       <span className="text-gray-300">&bull;</span>
//                       <span className="text-gray-500 font-medium">
//                         {stats.users.filter((u) => u.role === "admin").length}{" "}
//                         Admins
//                       </span>
//                     </span>
//                   }
//                 />
//                 <StatCard
//                   label="Total Revenue"
//                   value={new Intl.NumberFormat("en-US", {
//                     style: "currency",
//                     currency: "USD",
//                     maximumFractionDigits: 0,
//                   }).format(stats.totalRevenue)}
//                   // value={200000}
//                   icon={FaDollarSign}
//                   sub={
//                     <span className="flex items-center gap-1.5">
//                       <span className="text-gray-500 font-medium">
//                         {new Intl.NumberFormat("en-US", {
//                           style: "currency",
//                           currency: "USD",
//                           maximumFractionDigits: 0,
//                         }).format(stats.thisWeekRevenue)}
//                         {"   "}
//                         This Week
//                       </span>
//                     </span>
//                   }
//                   href="/dashboard/analytics"
//                 />
//               </div>
//             )
//           )}
//         </div>

//         <div className={`grid gap-4 flex-1 min-h-0 grid-cols-10`}>
//           <div className="lg:col-span-6 bg-white border border-gray-100 rounded-xl p-4 flex flex-col min-h-0">
//             <SectionHeader title="Recent orders" href="/dashboard/orders" />
//             {loading ? (
//               <div className="space-y-2">
//                 {Array(4)
//                   .fill(0)
//                   .map((_, i) => (
//                     <Skeleton key={i} className="h-9" />
//                   ))}
//               </div>
//             ) : recentOrders.length === 0 ? (
//               <div className="flex-1 flex items-center justify-center">
//                 <Empty message="No orders yet — they'll appear here once customers start buying" />
//               </div>
//             ) : (
//               <div className="flex flex-col min-h-0 flex-1">
//                 <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] gap-3 pb-2 border-b border-gray-50 shrink-0">
//                   {["Order ID", "Client Name", "Items", "When", "Status"].map(
//                     (h) => (
//                       <span
//                         key={h}
//                         className="text-[10px] font-semibold uppercase tracking-wider text-gray-500"
//                       >
//                         {h}
//                       </span>
//                     ),
//                   )}
//                 </div>
//                 <div className="flex-1  overflow-x-hidden overflow-y-hidden divide-y divide-gray-50 min-h-0 ">
//                   {recentOrders.map((order) => {
//                     return (
//                       <div
//                         key={order._id.toString()}
//                         className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] gap-3 items-center py-2 hover:bg-gray-150 rounded-lg px-1 transition-colors"
//                       >
//                         <span className="text-gray-900 text-xs font-mono font-medium">
//                           #{order._id.toString().slice(-8).toUpperCase()}
//                         </span>
//                         <span className="text-gray-500 text-xs">
//                           {order.user.userName}
//                         </span>
//                         <span className="text-gray-500 text-xs">
//                           {order.products.length}
//                         </span>
//                         <span className="text-gray-400 text-xs">
//                           {timeAgo(order.createdAt)}
//                         </span>
//                         <span
//                           className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold capitalize w-fit ${statusBadge(order.orderStatus)}`}
//                         >
//                           {order.orderStatus}
//                         </span>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="lg:col-span-4 bg-white border border-gray-100 rounded-xl p-4 flex flex-col min-h-0">
//             <SectionHeader
//               title="Recent Products"
//               href="/dashboard/products"
//               linkLabel="Manage"
//             />
//             {loading ? (
//               <div className="space-y-2">
//                 {Array(5)
//                   .fill(0)
//                   .map((_, i) => (
//                     <Skeleton key={i} className="h-9" />
//                   ))}
//               </div>
//             ) : (stats?.latestProducts?.length ?? 0) === 0 ? (
//               <div className="flex-1 flex items-center justify-center">
//                 <Empty message="No products yet" />
//               </div>
//             ) : (
//               <div className="flex flex-col min-h-0 flex-1">
//                 <div className="grid grid-cols-[1fr_118px_50px] gap-3 pb-2 border-b border-gray-50 shrink-0">
//                   <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
//                     Name
//                   </span>
//                   <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
//                     Price
//                   </span>
//                   <span className="text-[10px] font-semibold uppercase tracking-wider text-right pr-2 text-gray-500 ">
//                     Seller
//                   </span>
//                 </div>
//                 <div className="flex-1  overflow-y-hidden overflow-x-hidden  divide-y divide-gray-50 pr-3 ">
//                   {(stats?.latestProducts || []).map((product, i) => (
//                     <div
//                       key={product._id}
//                       className="grid grid-cols-[28px_1fr_80px_72px] gap-3 items-center py-2 hover:bg-gray-150 -mx-2 px-2 rounded-lg transition-colors"
//                     >
//                       <span className="text-gray-500 text-[11px] font-mono">
//                         {i + 1}
//                       </span>
//                       <p className="text-gray-900 text-xs font-medium truncate">
//                         {product.name}
//                       </p>
//                       <span className="text-gray-400 text-[11px]">
//                         ${product.price.toLocaleString()}
//                       </span>
//                       <span className="text-gray-400 text-[11px] text-end">
//                         {product.sellerName}
//                       </span>
//                       {/* <div className="text-right">
//                         <p
//                           className={`text-xs font-semibold ${
//                             product.stock === 0
//                               ? "text-red-500"
//                               : product.stock <= 5
//                                 ? "text-amber-500"
//                                 : "text-gray-400"
//                           }`}
//                         >
//                           {product.stock}
//                         </p>
//                         <p className="text-gray-500 text-[10px]">in stock</p>
//                       </div> */}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col flex-1 min-h-0">
//           <SectionHeader title="Latest Users" href="/dashboard/users" />
//           {loading ? (
//             <div className="space-y-2">
//               {Array(3)
//                 .fill(0)
//                 .map((_, i) => (
//                   <Skeleton key={i} className="h-9" />
//                 ))}
//             </div>
//           ) : recentUsers.length === 0 ? (
//             <div className="flex items-center justify-center py-4">
//               <Empty message="No users registered yet" />
//             </div>
//           ) : (
//             <div className="flex flex-col min-h-0 flex-1">
//               <div className="grid grid-cols-[1.5fr_2fr_1fr_1fr] gap-3 pb-2 border-b border-gray-50 shrink-0">
//                 {["Name", "Email", "Role", "Joined"].map((h) => (
//                   <span
//                     key={h}
//                     className="text-[10px] font-semibold uppercase tracking-wider text-gray-500"
//                   >
//                     {h}
//                   </span>
//                 ))}
//               </div>
//               <div className="flex-1 overflow-x-hidden overflow-y-hidden divide-y divide-gray-50 min-h-0">
//                 {recentUsers.map((user) => (
//                   <div
//                     key={user._id}
//                     className="grid grid-cols-[1.5fr_2fr_1fr_1fr] gap-3 items-center py-2 hover:bg-gray-150 rounded-lg px-1 transition-colors"
//                   >
//                     <div className="flex items-center gap-2 min-w-0">
//                       <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center text-white text-[10px] font-bold uppercase shrink-0">
//                         {user.userName[0]}
//                       </div>
//                       <span className="text-gray-900 text-xs font-medium truncate">
//                         {user.userName}
//                       </span>
//                     </div>
//                     <span className="text-gray-400 text-xs truncate">
//                       {user.email}
//                     </span>
//                     <span
//                       className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold capitalize w-fit ${roleBadge(user.role)}`}
//                     >
//                       {user.role}
//                     </span>
//                     <span className="text-gray-400 text-xs">
//                       {timeAgo(user.createdAt)}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
//-------------
//-------------
//-------------
//-------------
"use client";
import { useEffect, useMemo, useState } from "react";
import {
  FiPackage,
  FiShoppingBag,
  FiArrowUpRight,
  FiAlertTriangle,
  FiTrendingUp,
} from "react-icons/fi";
import Link from "next/link";
import type { UserDTO } from "@/types/users";
import type { OrderDTO } from "@/types/orders";
import {
  Skeleton,
  statusBadge,
  roleBadge,
  timeAgo,
  DashboardPageHeader,
} from "@/components/dashboard/dashboard-shared";
import {
  fetchAllOrders,
  fetchAllUsers,
  fetchAdminDashboardProducts,
} from "@/lib";

import { FaDollarSign } from "react-icons/fa6";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface DisplayProducts {
  _id: string;
  name: string;
  price: number;
  stock: number;
  sellerName: string;
}

interface Stats {
  totalProducts: number;
  latestProducts: DisplayProducts[];
  latestOrders: OrderDTO[];
  users: UserDTO[];
  thisWeekRevenue: number;
  totalRevenue: number;
}

// ── Business config ──────────────────────────────────────────────
const COMMISSION_RATE = 0.1; // 10%
const REFUND_RATE_CRITICAL_THRESHOLD = 8;
const REFUND_RATE_WARNING_THRESHOLD = 3;
const TREND_MONTHS = 6;

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

function orderTotal(order: OrderDTO) {
  return (
    order.products?.reduce(
      (itemSum, item) => itemSum + (item.product?.price ?? 0) * item.quantity,
      0,
    ) ?? 0
  );
}

function getMonthKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}`;
}

function getLastNMonths(n: number) {
  const months: { key: string; label: string }[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: getMonthKey(d),
      label: d.toLocaleString("en-US", { month: "short" }),
    });
  }
  return months;
}

function getCustomerId(order: OrderDTO) {
  return (
    (order.user as { _id?: unknown } | undefined)?._id?.toString?.() ??
    order.user?.userName ??
    "unknown"
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  sub,
  href,
  variant = "default",
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  sub: React.ReactNode;
  href: string;
  variant?: "default" | "primary" | "warning" | "danger";
}) {
  const variantStyles: Record<
    NonNullable<typeof variant>,
    { card: string; iconBox: string; value: string }
  > = {
    default: {
      card: "border-gray-100 hover:border-gray-200",
      iconBox:
        "bg-gray-150 text-gray-400 group-hover:bg-gray-100 group-hover:text-gray-600",
      value: "text-gray-900",
    },
    primary: {
      card: "border-gray-900/10 hover:border-gray-900/20 ring-1 ring-gray-900/5",
      iconBox: "bg-gray-900 text-white",
      value: "text-gray-900",
    },
    warning: {
      card: "border-amber-200 hover:border-amber-300",
      iconBox: "bg-amber-50 text-amber-500",
      value: "text-amber-600",
    },
    danger: {
      card: "border-red-200 hover:border-red-300",
      iconBox: "bg-red-50 text-red-500",
      value: "text-red-600",
    },
  };

  const styles = variantStyles[variant];

  return (
    <Link
      href={href}
      className={`bg-white border rounded-xl p-5 flex flex-col gap-3 hover:shadow-md transition-all group ${styles.card}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
          {label}
        </span>
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${styles.iconBox}`}
        >
          <Icon size={14} />
        </div>
      </div>
      <div>
        <p className={`text-3xl font-bold tracking-tight ${styles.value}`}>
          {value}
        </p>
        <div className="text-gray-400 text-[11px] mt-0.5">{sub}</div>
      </div>
    </Link>
  );
}

function SectionHeader({
  title,
  href,
  linkLabel = "View all",
}: {
  title: string;
  href: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-gray-900 text-sm font-semibold">{title}</h3>
      {href && (
        <Link
          href={href}
          className="text-[11px] font-medium text-gray-400 hover:text-gray-700 flex items-center gap-1 transition-colors"
        >
          {linkLabel} <FiArrowUpRight size={11} />
        </Link>
      )}
    </div>
  );
}

function ChartCardHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-gray-900 text-sm font-semibold">{title}</h3>
    </div>
  );
}

function Empty({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-gray-500">
      <p className="text-xs">{message}</p>
    </div>
  );
}

const axisTickStyle = { fontSize: 11, fill: "#9ca3af" };
const tooltipContentStyle = {
  fontSize: 11,
  borderRadius: 8,
  border: "1px solid #f3f4f6",
};

export default function AdminAnalytics() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<OrderDTO[]>([]);
  const [recentUsers, setRecentUsers] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        fetchAdminDashboardProducts(),
        fetchAllOrders(),
        fetchAllUsers(),
      ]);

      const products = productsRes.success ? productsRes.data : [];
      const orders: OrderDTO[] = ordersRes.success ? ordersRes.data : [];
      const users: UserDTO[] = usersRes?.success ? usersRes.data : [];
      const lastAddedProducts = products.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      const lastAddedProductsWeek = products.filter((product) => {
        const productDate = new Date(product.createdAt);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return productDate >= sevenDaysAgo;
      });

      setStats({
        totalProducts: lastAddedProducts.length,
        latestProducts: lastAddedProductsWeek,
        users: users,
        latestOrders: orders,
        thisWeekRevenue: orders
          .filter((order) => {
            const orderDate = new Date(order.createdAt);
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            return orderDate >= sevenDaysAgo;
          })
          .reduce((acc, order) => acc + orderTotal(order), 0),
        totalRevenue: orders.reduce((acc, order) => acc + orderTotal(order), 0),
      });
      setRecentOrders(
        [...orders]
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .slice(0, 6),
      );
      setRecentUsers(
        [...users]
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .slice(0, 5),
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const analytics = useMemo(() => {
    if (!stats) return null;
    const orders = stats.latestOrders;

    const totalOrders = orders.length;
    const completedOrders = orders.filter((o) => o.orderStatus === "delivered");
    const cancelledOrders = orders.filter((o) => o.orderStatus === "cancelled");

    const totalGrossRevenue = orders.reduce((acc, o) => acc + orderTotal(o), 0);
    const platformCommission = totalGrossRevenue * COMMISSION_RATE;
    const aov =
      completedOrders.length > 0
        ? completedOrders.reduce((acc, o) => acc + orderTotal(o), 0) /
          completedOrders.length
        : 0;
    const refundRate =
      totalOrders > 0 ? (cancelledOrders.length / totalOrders) * 100 : 0;

    const now = new Date();
    const thisMonthKey = getMonthKey(now);
    const lastMonthKey = getMonthKey(
      new Date(now.getFullYear(), now.getMonth() - 1, 1),
    );
    const thisMonthRevenue = orders
      .filter((o) => getMonthKey(new Date(o.createdAt)) === thisMonthKey)
      .reduce((acc, o) => acc + orderTotal(o), 0);
    const lastMonthRevenue = orders
      .filter((o) => getMonthKey(new Date(o.createdAt)) === lastMonthKey)
      .reduce((acc, o) => acc + orderTotal(o), 0);
    const gmvMoM =
      lastMonthRevenue > 0
        ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        : thisMonthRevenue > 0
          ? 100
          : 0;

    const months = getLastNMonths(TREND_MONTHS);

    const ordersPerCustomer = new Map<string, number>();
    orders.forEach((o) => {
      const id = getCustomerId(o);
      ordersPerCustomer.set(id, (ordersPerCustomer.get(id) ?? 0) + 1);
    });

    const cohortTrend = months.map(({ key, label }) => {
      const monthOrders = orders.filter(
        (o) => getMonthKey(new Date(o.createdAt)) === key,
      );
      const customerIdsThisMonth = new Set(monthOrders.map(getCustomerId));
      const repeatCustomers = [...customerIdsThisMonth].filter(
        (id) => (ordersPerCustomer.get(id) ?? 0) > 1,
      );
      const retentionRate =
        customerIdsThisMonth.size > 0
          ? (repeatCustomers.length / customerIdsThisMonth.size) * 100
          : 0;
      const monthRevenue = monthOrders.reduce(
        (acc, o) => acc + orderTotal(o),
        0,
      );
      const ltv =
        customerIdsThisMonth.size > 0
          ? monthRevenue / customerIdsThisMonth.size
          : 0;
      return {
        month: label,
        retentionRate: Number(retentionRate.toFixed(1)),
        ltv: Number(ltv.toFixed(2)),
      };
    });

    const healthFunnel = months.map(({ key, label }) => {
      const monthOrders = orders.filter(
        (o) => getMonthKey(new Date(o.createdAt)) === key,
      );
      const monthCancelled = monthOrders.filter(
        (o) => o.orderStatus === "cancelled",
      );
      const monthRefundRate =
        monthOrders.length > 0
          ? (monthCancelled.length / monthOrders.length) * 100
          : 0;
      return {
        month: label,
        orderVolume: monthOrders.length,
        refundRate: Number(monthRefundRate.toFixed(1)),
      };
    });

    const categoryMap = new Map<string, number>();
    orders.forEach((o) => {
      o.products?.forEach((item) => {
        const category =
          (item.product as unknown as { category?: string })?.category ??
          "Uncategorized";
        const lineTotal = (item.product?.price ?? 0) * item.quantity;
        categoryMap.set(category, (categoryMap.get(category) ?? 0) + lineTotal);
      });
    });
    const categoryTakeRate = [...categoryMap.entries()]
      .map(([category, gmv]) => ({
        category,
        gmv: Number(gmv.toFixed(2)),
        commission: Number((gmv * COMMISSION_RATE).toFixed(2)),
      }))
      .sort((a, b) => b.gmv - a.gmv)
      .slice(0, 8);

    return {
      platformCommission,
      aov,
      refundRate,
      cancelledCount: cancelledOrders.length,
      totalOrders,
      gmvMoM,
      cohortTrend,
      healthFunnel,
      categoryTakeRate,
    };
  }, [stats]);

  // return (
  //   <div className="flex flex-col flex-1 bg-gray-50 overflow-hidden">
  //     <DashboardPageHeader
  //       title="Analytics"
  //       subtitle="Full store overview"
  //       loading={loading}
  //       onRefresh={load}
  //     />
  //     {/* ⚡ UPDATED: Changed overflow and added custom-scroll with gap-6 */}
  //     <div className="flex flex-col flex-1 px-8 py-6 gap-6 overflow-x-hidden overflow-y-auto custom-scroll">
  //       {/* ── KPI Cards ─────────────────────────────────────────── */}
  //       <div className="shrink-0">
  //         {loading ? (
  //           <div className={`grid gap-4 grid-cols-4`}>
  //             {Array(4)
  //               .fill(0)
  //               .map((_, i) => (
  //                 <Skeleton key={i} className="h-28 rounded-xl" />
  //               ))}
  //           </div>
  //         ) : (
  //           stats &&
  //           analytics && (
  //             <div className={`grid gap-4 grid-cols-4`}>
  //               <StatCard
  //                 label="Platform Commission"
  //                 value={formatCurrency(analytics.platformCommission)}
  //                 icon={FaDollarSign}
  //                 variant="primary"
  //                 sub={
  //                   <span className="flex items-center gap-1.5">
  //                     <span className="text-gray-500 font-medium">
  //                       {(COMMISSION_RATE * 100).toFixed(0)}% take rate
  //                     </span>
  //                     <span className="text-gray-300">&bull;</span>
  //                     <span className="text-gray-500 font-medium">
  //                       {formatCurrency(stats.totalRevenue)} GMV
  //                     </span>
  //                   </span>
  //                 }
  //                 href="/dashboard/analytics"
  //               />

  //               <StatCard
  //                 label="Average Order Value"
  //                 value={formatCurrency(analytics.aov)}
  //                 icon={FiShoppingBag}
  //                 sub={
  //                   <span className="text-gray-500 font-medium">
  //                     Typical spend per completed purchase
  //                   </span>
  //                 }
  //                 href="/dashboard/orders"
  //               />

  //               <StatCard
  //                 label="Refund / Cancellation Rate"
  //                 value={`${analytics.refundRate.toFixed(1)}%`}
  //                 icon={FiAlertTriangle}
  //                 variant={
  //                   analytics.refundRate >= REFUND_RATE_CRITICAL_THRESHOLD
  //                     ? "danger"
  //                     : analytics.refundRate >= REFUND_RATE_WARNING_THRESHOLD
  //                       ? "warning"
  //                       : "default"
  //                 }
  //                 sub={
  //                   <span className="flex items-center gap-1.5">
  //                     <span
  //                       className={`font-medium ${
  //                         analytics.refundRate >= REFUND_RATE_CRITICAL_THRESHOLD
  //                           ? "text-red-500"
  //                           : "text-gray-500"
  //                       }`}
  //                     >
  //                       {analytics.cancelledCount} of {analytics.totalOrders}{" "}
  //                       orders
  //                     </span>
  //                     {analytics.refundRate >=
  //                       REFUND_RATE_CRITICAL_THRESHOLD && (
  //                       <>
  //                         <span className="text-gray-300">&bull;</span>
  //                         <span className="text-red-500 font-semibold">
  //                           Above threshold
  //                         </span>
  //                       </>
  //                     )}
  //                   </span>
  //                 }
  //                 href="/dashboard/orders"
  //               />

  //               <StatCard
  //                 label="Gross Merchandise Value"
  //                 value={formatCurrency(stats.totalRevenue)}
  //                 icon={FiTrendingUp}
  //                 sub={
  //                   <span className="flex items-center gap-1">
  //                     <FiArrowUpRight
  //                       size={11}
  //                       className={
  //                         analytics.gmvMoM >= 0
  //                           ? "text-gray-500"
  //                           : "text-red-500 rotate-90"
  //                       }
  //                     />
  //                     <span
  //                       className={`font-medium ${
  //                         analytics.gmvMoM >= 0
  //                           ? "text-gray-500"
  //                           : "text-red-500"
  //                       }`}
  //                     >
  //                       {analytics.gmvMoM >= 0 ? "+" : ""}
  //                       {analytics.gmvMoM.toFixed(1)}% vs Last Month
  //                     </span>
  //                   </span>
  //                 }
  //                 href="/dashboard/analytics"
  //               />
  //             </div>
  //           )
  //         )}
  //       </div>

  //       {/* ── Analytics Charts ──────────────────────────────────── */}
  //       {/* ⚡ UPDATED: Used gap-6 */}
  //       <div className="shrink-0 grid gap-6 grid-cols-1 lg:grid-cols-3">
  //         <div className="bg-white border border-gray-100 rounded-xl p-5 flex flex-col">
  //           <ChartCardHeader title="Cohort Retention & LTV Trend" />
  //           {loading ? (
  //             <Skeleton className="h-56" />
  //           ) : (
  //             <ResponsiveContainer width="100%" height={224}>
  //               <LineChart data={analytics?.cohortTrend ?? []}>
  //                 <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
  //                 <XAxis
  //                   dataKey="month"
  //                   tick={axisTickStyle}
  //                   axisLine={false}
  //                   tickLine={false}
  //                 />
  //                 <YAxis
  //                   yAxisId="left"
  //                   tick={axisTickStyle}
  //                   axisLine={false}
  //                   tickLine={false}
  //                 />
  //                 <YAxis
  //                   yAxisId="right"
  //                   orientation="right"
  //                   tick={axisTickStyle}
  //                   axisLine={false}
  //                   tickLine={false}
  //                 />
  //                 <Tooltip contentStyle={tooltipContentStyle} />
  //                 <Legend wrapperStyle={{ fontSize: 11 }} />
  //                 <Line
  //                   yAxisId="left"
  //                   type="monotone"
  //                   dataKey="retentionRate"
  //                   name="Repeat Rate %"
  //                   stroke="#111827"
  //                   strokeWidth={2}
  //                   dot={false}
  //                 />
  //                 <Line
  //                   yAxisId="right"
  //                   type="monotone"
  //                   dataKey="ltv"
  //                   name="Avg LTV ($)"
  //                   stroke="#9ca3af"
  //                   strokeWidth={2}
  //                   dot={false}
  //                 />
  //               </LineChart>
  //             </ResponsiveContainer>
  //           )}
  //         </div>

  //         <div className="bg-white border border-gray-100 rounded-xl p-5 flex flex-col">
  //           <ChartCardHeader title="Platform Health Funnel" />
  //           {loading ? (
  //             <Skeleton className="h-56" />
  //           ) : (
  //             <ResponsiveContainer width="100%" height={224}>
  //               <ComposedChart data={analytics?.healthFunnel ?? []}>
  //                 <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
  //                 <XAxis
  //                   dataKey="month"
  //                   tick={axisTickStyle}
  //                   axisLine={false}
  //                   tickLine={false}
  //                 />
  //                 <YAxis
  //                   yAxisId="left"
  //                   tick={axisTickStyle}
  //                   axisLine={false}
  //                   tickLine={false}
  //                 />
  //                 <YAxis
  //                   yAxisId="right"
  //                   orientation="right"
  //                   tick={axisTickStyle}
  //                   axisLine={false}
  //                   tickLine={false}
  //                 />
  //                 <Tooltip contentStyle={tooltipContentStyle} />
  //                 <Legend wrapperStyle={{ fontSize: 11 }} />
  //                 <Bar
  //                   yAxisId="left"
  //                   dataKey="orderVolume"
  //                   name="Order Volume"
  //                   fill="#e5e7eb"
  //                   radius={[4, 4, 0, 0]}
  //                 />
  //                 <Line
  //                   yAxisId="right"
  //                   type="monotone"
  //                   dataKey="refundRate"
  //                   name="Refund %"
  //                   stroke="#ef4444"
  //                   strokeWidth={2}
  //                   dot={false}
  //                 />
  //               </ComposedChart>
  //             </ResponsiveContainer>
  //           )}
  //         </div>

  //         <div className="bg-white border border-gray-100 rounded-xl p-5 flex flex-col">
  //           <ChartCardHeader title="Category Take-Rate Matrix" />
  //           {loading ? (
  //             <Skeleton className="h-56" />
  //           ) : (analytics?.categoryTakeRate?.length ?? 0) === 0 ? (
  //             <div className="flex-1 flex items-center justify-center">
  //               <Empty message="No category data available yet" />
  //             </div>
  //           ) : (
  //             <ResponsiveContainer width="100%" height={224}>
  //               <BarChart
  //                 data={analytics?.categoryTakeRate ?? []}
  //                 layout="vertical"
  //                 margin={{ left: 8 }}
  //               >
  //                 <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
  //                 <XAxis
  //                   type="number"
  //                   tick={axisTickStyle}
  //                   axisLine={false}
  //                   tickLine={false}
  //                 />
  //                 <YAxis
  //                   type="category"
  //                   dataKey="category"
  //                   tick={axisTickStyle}
  //                   axisLine={false}
  //                   tickLine={false}
  //                   width={90}
  //                 />
  //                 <Tooltip contentStyle={tooltipContentStyle} />
  //                 <Legend wrapperStyle={{ fontSize: 11 }} />
  //                 <Bar
  //                   dataKey="gmv"
  //                   name="Category GMV"
  //                   fill="#e5e7eb"
  //                   radius={[0, 4, 4, 0]}
  //                 />
  //                 <Bar
  //                   dataKey="commission"
  //                   name="Commission"
  //                   fill="#111827"
  //                   radius={[0, 4, 4, 0]}
  //                 />
  //               </BarChart>
  //             </ResponsiveContainer>
  //           )}
  //         </div>
  //       </div>

  //       {/* ⚡ UPDATED: Changed from flex-1 to min-h-[400px] shrink-0 to prevent vertical squishing */}
  //       <div className="shrink-0 grid gap-6 grid-cols-1 lg:grid-cols-10 min-h-[400px]">
  //         <div className="lg:col-span-6 bg-white border border-gray-100 rounded-xl p-5 flex flex-col h-full">
  //           <SectionHeader title="Recent orders" href="/dashboard/orders" />
  //           {loading ? (
  //             <div className="space-y-2">
  //               {Array(4)
  //                 .fill(0)
  //                 .map((_, i) => (
  //                   <Skeleton key={i} className="h-9" />
  //                 ))}
  //             </div>
  //           ) : recentOrders.length === 0 ? (
  //             <div className="flex-1 flex items-center justify-center">
  //               <Empty message="No orders yet" />
  //             </div>
  //           ) : (
  //             <div className="flex flex-col min-h-0 flex-1">
  //               <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] gap-3 pb-2 border-b border-gray-50 shrink-0">
  //                 {["Order ID", "Client Name", "Items", "When", "Status"].map(
  //                   (h) => (
  //                     <span
  //                       key={h}
  //                       className="text-[10px] font-semibold uppercase tracking-wider text-gray-500"
  //                     >
  //                       {h}
  //                     </span>
  //                   ),
  //                 )}
  //               </div>
  //               <div className="flex-1 overflow-x-hidden overflow-y-auto divide-y divide-gray-50 min-h-0 custom-scroll pr-2">
  //                 {recentOrders.map((order) => {
  //                   return (
  //                     <div
  //                       key={order._id.toString()}
  //                       className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] gap-3 items-center py-2.5 hover:bg-gray-50 rounded-lg px-2 transition-colors"
  //                     >
  //                       <span className="text-gray-900 text-xs font-mono font-medium">
  //                         #{order._id.toString().slice(-8).toUpperCase()}
  //                       </span>
  //                       <span className="text-gray-600 text-xs font-medium">
  //                         {order.user?.userName || "Guest"}
  //                       </span>
  //                       <span className="text-gray-500 text-xs pl-2">
  //                         {order.products?.length || 1}
  //                       </span>
  //                       <span className="text-gray-400 text-xs">
  //                         {timeAgo(order.createdAt)}
  //                       </span>
  //                       <span
  //                         className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold capitalize w-fit ${statusBadge(order.orderStatus)}`}
  //                       >
  //                         {order.orderStatus}
  //                       </span>
  //                     </div>
  //                   );
  //                 })}
  //               </div>
  //             </div>
  //           )}
  //         </div>

  //         <div className="lg:col-span-4 bg-white border border-gray-100 rounded-xl p-5 flex flex-col h-full">
  //           <SectionHeader
  //             title="Recent Products"
  //             href="/dashboard/products"
  //             linkLabel="Manage"
  //           />
  //           {loading ? (
  //             <div className="space-y-2">
  //               {Array(5)
  //                 .fill(0)
  //                 .map((_, i) => (
  //                   <Skeleton key={i} className="h-9" />
  //                 ))}
  //             </div>
  //           ) : (stats?.latestProducts?.length ?? 0) === 0 ? (
  //             <div className="flex-1 flex items-center justify-center">
  //               <Empty message="No products yet" />
  //             </div>
  //           ) : (
  //             <div className="flex flex-col min-h-0 flex-1">
  //               <div className="grid grid-cols-[1fr_80px_70px] gap-3 pb-2 border-b border-gray-50 shrink-0">
  //                 <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
  //                   Name
  //                 </span>
  //                 <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
  //                   Price
  //                 </span>
  //                 <span className="text-[10px] font-semibold uppercase tracking-wider text-right pr-2 text-gray-500 ">
  //                   Seller
  //                 </span>
  //               </div>
  //               <div className="flex-1 overflow-y-auto overflow-x-hidden divide-y divide-gray-50 pr-2 custom-scroll">
  //                 {(stats?.latestProducts || []).map((product, i) => (
  //                   <div
  //                     key={product._id}
  //                     className="grid grid-cols-[24px_1fr_80px_70px] gap-3 items-center py-2.5 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors"
  //                   >
  //                     <span className="text-gray-400 text-[11px] font-mono pl-1">
  //                       {i + 1}
  //                     </span>
  //                     <p className="text-gray-900 text-xs font-medium truncate">
  //                       {product.name}
  //                     </p>
  //                     <span className="text-gray-600 text-xs">
  //                       ${product.price.toLocaleString()}
  //                     </span>
  //                     <span className="text-gray-400 text-[11px] text-right truncate">
  //                       {product.sellerName || "System"}
  //                     </span>
  //                   </div>
  //                 ))}
  //               </div>
  //             </div>
  //           )}
  //         </div>
  //       </div>

  //       {/* ⚡ UPDATED: Changed from flex-1 to min-h-[350px] shrink-0 */}
  //       <div className="shrink-0 bg-white border border-gray-100 rounded-xl p-5 flex flex-col min-h-[350px]">
  //         <SectionHeader title="Latest Users" href="/dashboard/users" />
  //         {loading ? (
  //           <div className="space-y-2">
  //             {Array(3)
  //               .fill(0)
  //               .map((_, i) => (
  //                 <Skeleton key={i} className="h-9" />
  //               ))}
  //           </div>
  //         ) : recentUsers.length === 0 ? (
  //           <div className="flex items-center justify-center py-4">
  //             <Empty message="No users registered yet" />
  //           </div>
  //         ) : (
  //           <div className="flex flex-col min-h-0 flex-1">
  //             <div className="grid grid-cols-[1.5fr_2fr_1fr_1fr] gap-3 pb-2 border-b border-gray-50 shrink-0">
  //               {["Name", "Email", "Role", "Joined"].map((h) => (
  //                 <span
  //                   key={h}
  //                   className="text-[10px] font-semibold uppercase tracking-wider text-gray-500"
  //                 >
  //                   {h}
  //                 </span>
  //               ))}
  //             </div>
  //             <div className="flex-1 overflow-x-hidden overflow-y-auto divide-y divide-gray-50 min-h-0 custom-scroll pr-2">
  //               {recentUsers.map((user) => (
  //                 <div
  //                   key={user._id}
  //                   className="grid grid-cols-[1.5fr_2fr_1fr_1fr] gap-3 items-center py-3 hover:bg-gray-50 rounded-lg px-2 transition-colors"
  //                 >
  //                   <div className="flex items-center gap-2 min-w-0">
  //                     <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center text-white text-[10px] font-bold uppercase shrink-0">
  //                       {user.userName?.[0] || "?"}
  //                     </div>
  //                     <span className="text-gray-900 text-xs font-medium truncate">
  //                       {user.userName}
  //                     </span>
  //                   </div>
  //                   <span className="text-gray-500 text-xs truncate">
  //                     {user.email}
  //                   </span>
  //                   <span
  //                     className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold capitalize w-fit ${roleBadge(user.role)}`}
  //                   >
  //                     {user.role}
  //                   </span>
  //                   <span className="text-gray-400 text-xs">
  //                     {timeAgo(user.createdAt)}
  //                   </span>
  //                 </div>
  //               ))}
  //             </div>
  //           </div>
  //         )}
  //       </div>
  //     </div>
  //   </div>
  // );
  return (
    <div className="flex flex-col flex-1 bg-gray-50 overflow-hidden">
      <DashboardPageHeader
        title="Analytics"
        subtitle="Full store overview"
        loading={loading}
        onRefresh={load}
      />

      {/* ⚡ UPDATED: Changed to overflow-y-auto for mobile, hidden for lg */}
      <div className="flex flex-col flex-1 px-8 py-6 gap-6 overflow-x-hidden overflow-y-auto lg:overflow-hidden custom-scroll">
        {/* ── KPI Cards ─────────────────────────────────────────── */}
        <div className="shrink-0">
          {loading ? (
            <div className={`grid gap-4 grid-cols-2 lg:grid-cols-4`}>
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-28 rounded-xl" />
                ))}
            </div>
          ) : (
            stats &&
            analytics && (
              <div className={`grid gap-4 grid-cols-2 lg:grid-cols-4`}>
                <StatCard
                  label="Platform Commission"
                  value={formatCurrency(analytics.platformCommission)}
                  icon={FaDollarSign}
                  variant="primary"
                  sub={
                    <span className="flex items-center gap-1.5">
                      <span className="text-gray-500 font-medium">
                        {(COMMISSION_RATE * 100).toFixed(0)}% take rate
                      </span>
                      <span className="text-gray-300">&bull;</span>
                      <span className="text-gray-500 font-medium">
                        {formatCurrency(stats.totalRevenue)} GMV
                      </span>
                    </span>
                  }
                  href="/dashboard/analytics"
                />

                <StatCard
                  label="Average Order Value"
                  value={formatCurrency(analytics.aov)}
                  icon={FiShoppingBag}
                  sub={
                    <span className="text-gray-500 font-medium">
                      Typical spend per completed purchase
                    </span>
                  }
                  href="/dashboard/orders"
                />

                <StatCard
                  label="Refund / Cancellation Rate"
                  value={`${analytics.refundRate.toFixed(1)}%`}
                  icon={FiAlertTriangle}
                  variant={
                    analytics.refundRate >= REFUND_RATE_CRITICAL_THRESHOLD
                      ? "danger"
                      : analytics.refundRate >= REFUND_RATE_WARNING_THRESHOLD
                        ? "warning"
                        : "default"
                  }
                  sub={
                    <span className="flex items-center gap-1.5">
                      <span
                        className={`font-medium ${
                          analytics.refundRate >= REFUND_RATE_CRITICAL_THRESHOLD
                            ? "text-red-500"
                            : "text-gray-500"
                        }`}
                      >
                        {analytics.cancelledCount} of {analytics.totalOrders}{" "}
                        orders
                      </span>
                      {analytics.refundRate >=
                        REFUND_RATE_CRITICAL_THRESHOLD && (
                        <>
                          <span className="text-gray-300">&bull;</span>
                          <span className="text-red-500 font-semibold">
                            Above threshold
                          </span>
                        </>
                      )}
                    </span>
                  }
                  href="/dashboard/orders"
                />

                <StatCard
                  label="Gross Merchandise Value"
                  value={formatCurrency(stats.totalRevenue)}
                  icon={FiTrendingUp}
                  sub={
                    <span className="flex items-center gap-1">
                      <FiArrowUpRight
                        size={11}
                        className={
                          analytics.gmvMoM >= 0
                            ? "text-gray-500"
                            : "text-red-500 rotate-90"
                        }
                      />
                      <span
                        className={`font-medium ${
                          analytics.gmvMoM >= 0
                            ? "text-gray-500"
                            : "text-red-500"
                        }`}
                      >
                        {analytics.gmvMoM >= 0 ? "+" : ""}
                        {analytics.gmvMoM.toFixed(1)}% vs Last Month
                      </span>
                    </span>
                  }
                  href="/dashboard/analytics"
                />
              </div>
            )
          )}
        </div>

        {/* ── Analytics Charts ──────────────────────────────────── */}
        <div className="shrink-0 grid gap-6 grid-cols-1 lg:grid-cols-3">
          <div className="bg-white border border-gray-100 rounded-xl p-5 flex flex-col">
            <ChartCardHeader title="Cohort Retention & LTV Trend" />
            {loading ? (
              <Skeleton className="h-56" />
            ) : (
              <ResponsiveContainer width="100%" height={224}>
                <LineChart data={analytics?.cohortTrend ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis
                    dataKey="month"
                    tick={axisTickStyle}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="left"
                    tick={axisTickStyle}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={axisTickStyle}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip contentStyle={tooltipContentStyle} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="retentionRate"
                    name="Repeat Rate %"
                    stroke="#111827"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="ltv"
                    name="Avg LTV ($)"
                    stroke="#9ca3af"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-5 flex flex-col">
            <ChartCardHeader title="Platform Health Funnel" />
            {loading ? (
              <Skeleton className="h-56" />
            ) : (
              <ResponsiveContainer width="100%" height={224}>
                <ComposedChart data={analytics?.healthFunnel ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis
                    dataKey="month"
                    tick={axisTickStyle}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="left"
                    tick={axisTickStyle}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={axisTickStyle}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip contentStyle={tooltipContentStyle} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar
                    yAxisId="left"
                    dataKey="orderVolume"
                    name="Order Volume"
                    fill="#e5e7eb"
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="refundRate"
                    name="Refund %"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-5 flex flex-col">
            <ChartCardHeader title="Category Take-Rate Matrix" />
            {loading ? (
              <Skeleton className="h-56" />
            ) : (analytics?.categoryTakeRate?.length ?? 0) === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <Empty message="No category data available yet" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={224}>
                <BarChart
                  data={analytics?.categoryTakeRate ?? []}
                  layout="vertical"
                  margin={{ left: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis
                    type="number"
                    tick={axisTickStyle}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="category"
                    tick={axisTickStyle}
                    axisLine={false}
                    tickLine={false}
                    width={90}
                  />
                  <Tooltip contentStyle={tooltipContentStyle} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar
                    dataKey="gmv"
                    name="Category GMV"
                    fill="#e5e7eb"
                    radius={[0, 4, 4, 0]}
                  />
                  <Bar
                    dataKey="commission"
                    name="Commission"
                    fill="#111827"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* ⚡ UPDATED: Replaced hardcoded shrink-0 with responsive shrink and flex-1 */}
        <div className="shrink-0 lg:shrink flex-1 grid gap-6 grid-cols-1 lg:grid-cols-10 min-h-100 lg:min-h-0">
          <div className="lg:col-span-6 bg-white border border-gray-100 rounded-xl p-5 flex flex-col h-full min-h-0">
            <SectionHeader title="Recent orders" href="/dashboard/orders" />
            {loading ? (
              <div className="space-y-2">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-9" />
                  ))}
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <Empty message="No orders yet" />
              </div>
            ) : (
              <div className="flex flex-col min-h-0 flex-1">
                <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] gap-3 pb-2 border-b border-gray-50 shrink-0">
                  {["Order ID", "Client Name", "Items", "When", "Status"].map(
                    (h) => (
                      <span
                        key={h}
                        className="text-[10px] font-semibold uppercase tracking-wider text-gray-500"
                      >
                        {h}
                      </span>
                    ),
                  )}
                </div>
                <div className="flex-1 overflow-x-hidden overflow-y-auto divide-y divide-gray-50 min-h-0 custom-scroll pr-2">
                  {recentOrders.map((order) => {
                    return (
                      <div
                        key={order._id.toString()}
                        className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] gap-3 items-center py-2.5 hover:bg-gray-50 rounded-lg px-2 transition-colors"
                      >
                        <span className="text-gray-900 text-xs font-mono font-medium">
                          #{order._id.toString().slice(-8).toUpperCase()}
                        </span>
                        <span className="text-gray-600 text-xs font-medium">
                          {order.user?.userName || "Guest"}
                        </span>
                        <span className="text-gray-500 text-xs pl-2">
                          {order.products?.length || 1}
                        </span>
                        <span className="text-gray-400 text-xs">
                          {timeAgo(order.createdAt)}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold capitalize w-fit ${statusBadge(order.orderStatus)}`}
                        >
                          {order.orderStatus}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 bg-white border border-gray-100 rounded-xl p-5 flex flex-col h-full min-h-0">
            <SectionHeader
              title="Recent Products"
              href="/dashboard/products"
              linkLabel="Manage"
            />
            {loading ? (
              <div className="space-y-2">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-9" />
                  ))}
              </div>
            ) : (stats?.latestProducts?.length ?? 0) === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <Empty message="No products yet" />
              </div>
            ) : (
              <div className="flex flex-col min-h-0 flex-1">
                <div className="grid grid-cols-[1fr_80px_70px] gap-3 pb-2 border-b border-gray-50 shrink-0">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    Name
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    Price
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-right pr-2 text-gray-500 ">
                    Seller
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto overflow-x-hidden divide-y divide-gray-50 pr-2 custom-scroll">
                  {(stats?.latestProducts || []).map((product, i) => (
                    <div
                      key={product._id}
                      className="grid grid-cols-[24px_1fr_80px_70px] gap-3 items-center py-2.5 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors"
                    >
                      <span className="text-gray-400 text-[11px] font-mono pl-1">
                        {i + 1}
                      </span>
                      <p className="text-gray-900 text-xs font-medium truncate">
                        {product.name}
                      </p>
                      <span className="text-gray-600 text-xs">
                        ${product.price.toLocaleString()}
                      </span>
                      <span className="text-gray-400 text-[11px] text-right truncate">
                        {product.sellerName || "System"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ⚡ UPDATED: Replaced hardcoded shrink-0 with responsive shrink and flex-1 */}
        <div className="shrink-0 lg:shrink flex-1 bg-white border border-gray-100 rounded-xl p-5 flex flex-col min-h-87.5 lg:min-h-0">
          <SectionHeader title="Latest Users" href="/dashboard/users" />
          {loading ? (
            <div className="space-y-2">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-9" />
                ))}
            </div>
          ) : recentUsers.length === 0 ? (
            <div className="flex items-center justify-center py-4">
              <Empty message="No users registered yet" />
            </div>
          ) : (
            <div className="flex flex-col min-h-0 flex-1">
              <div className="grid grid-cols-[1.5fr_2fr_1fr_1fr] gap-3 pb-2 border-b border-gray-50 shrink-0">
                {["Name", "Email", "Role", "Joined"].map((h) => (
                  <span
                    key={h}
                    className="text-[10px] font-semibold uppercase tracking-wider text-gray-500"
                  >
                    {h}
                  </span>
                ))}
              </div>
              <div className="flex-1 overflow-x-hidden overflow-y-auto divide-y divide-gray-50 min-h-0 custom-scroll pr-2">
                {recentUsers.map((user) => (
                  <div
                    key={user._id}
                    className="grid grid-cols-[1.5fr_2fr_1fr_1fr] gap-3 items-center py-3 hover:bg-gray-50 rounded-lg px-2 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center text-white text-[10px] font-bold uppercase shrink-0">
                        {user.userName?.[0] || "?"}
                      </div>
                      <span className="text-gray-900 text-xs font-medium truncate">
                        {user.userName}
                      </span>
                    </div>
                    <span className="text-gray-500 text-xs truncate">
                      {user.email}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold capitalize w-fit ${roleBadge(user.role)}`}
                    >
                      {user.role}
                    </span>
                    <span className="text-gray-400 text-xs">
                      {timeAgo(user.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
