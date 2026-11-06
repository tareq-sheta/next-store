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
//   // sellerName: string;
// }

// interface Stats {
//   // recentlyAddedProducts: number;
//   totalProducts: number;
//   latestProducts: DisplayProducts[];
//   latestOrders: OrderDTO[];
//   // users: UserDTO[];

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
//       const [productsRes, ordersRes] = await Promise.all([
//         fetchSellerDashboardProducts(),
//         fetchAllOrders(),
//       ]);

//       const products = productsRes.success ? productsRes.data : [];
//       const orders: OrderDTO[] = ordersRes.success ? ordersRes.data : [];

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
//         // users: users,
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
//       // setRecentUsers(
//       //   [...users]
//       //     .sort(
//       //       (a, b) =>
//       //         new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
//       //     )
//       //     .slice(0, 5),
//       // );
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
//               {Array(3)
//                 .fill(0)
//                 .map((_, i) => (
//                   <Skeleton key={i} className="h-24" />
//                 ))}
//             </div>
//           ) : (
//             stats && (
//               <div className={`grid gap-4 grid-cols-3`}>
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
//                 {/* <StatCard
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
//                 /> */}
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
//                       {/* <span className="text-gray-400 text-[11px] text-end">
//                         {product.sellerName}
//                       </span> */}
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
"use client";

import { useEffect, useState, useMemo } from "react";
import {
  FiPackage,
  FiShoppingBag,
  FiArrowUpRight,
  FiRefreshCcw,
} from "react-icons/fi";
import { FaDollarSign, FaPercent } from "react-icons/fa6";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import type { SellerProductDTO } from "@/types/products";
import type { OrderDTO } from "@/types/orders";
import {
  DashboardPageHeader,
  Skeleton,
} from "@/components/dashboard/dashboard-shared";
import { fetchAllOrders, fetchSellerDashboardProducts } from "@/lib";

// --- REUSABLE COMPONENTS ---

function StatCard({
  label,
  value,
  icon: Icon,
  sub,
  warn,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  sub: React.ReactNode;
  warn?: boolean;
}) {
  return (
    <div
      className={`bg-white border rounded-xl p-5 flex flex-col gap-3 transition-all ${warn ? "border-red-200" : "border-gray-100"}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
          {label}
        </span>
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center ${warn ? "bg-red-50 text-red-500" : "bg-gray-150 text-gray-400"}`}
        >
          <Icon size={14} />
        </div>
      </div>
      <div>
        <p
          className={`text-3xl font-bold tracking-tight ${warn ? "text-red-600" : "text-gray-900"}`}
        >
          {value}
        </p>
        <div className="text-gray-400 text-[11px] mt-0.5">{sub}</div>
      </div>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-gray-900 text-sm font-semibold">{title}</h3>
    </div>
  );
}

// --- MAIN PAGE ---

export default function SellerAnalyticsPage() {
  const [products, setProducts] = useState<SellerProductDTO[]>([]);
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const [productsRes, ordersRes] = await Promise.all([
        fetchSellerDashboardProducts(),
        fetchAllOrders(), // Note: Ensure your backend scopes this to the logged-in seller!
      ]);
      if (productsRes.success) setProducts(productsRes.data);
      if (ordersRes.success) setOrders(ordersRes.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // --- ANALYTICAL CALCULATIONS ---

  const analytics = useMemo(() => {
    // 1. Core KPIs
    const completedOrders = orders.filter(
      (o) => o.orderStatus === "delivered" || o.orderStatus === "shipped",
    );
    const cancelledOrders = orders.filter((o) => o.orderStatus === "cancelled");

    const totalRevenue = completedOrders.reduce(
      (acc, order) => acc + (order.totalPrice || 0),
      0,
    );
    const aov =
      completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;
    const refundRate =
      orders.length > 0 ? (cancelledOrders.length / orders.length) * 100 : 0;

    // 2. Category Distribution
    const categoryMap = products.reduce(
      (acc, p) => {
        acc[p.category] = (acc[p.category] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
    const categories = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
    const maxCat = categories[0]?.[1] ?? 1;

    // 3. Top Products (Derived by actual sales from the orders array)
    const productSales: Record<string, number> = {};
    completedOrders.forEach((order) => {
      order.products?.forEach((item) => {
        const pid =
          typeof item.product === "string" ? item.product : item.product?._id;
        if (pid) {
          productSales[pid] = (productSales[pid] || 0) + item.quantity;
        }
      });
    });

    const rankedProducts = products
      .map((p) => ({
        ...p,
        unitsSold: productSales[p._id] || 0,
        revenueGenerated: (productSales[p._id] || 0) * p.price,
      }))
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 5);

    // 4. Chart Data (Group revenue by date)
    const chartDataMap: Record<string, number> = {};
    completedOrders.forEach((order) => {
      const date = new Date(order.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      chartDataMap[date] = (chartDataMap[date] || 0) + (order.totalPrice || 0);
    });

    // Convert to array for Recharts
    const chartData = Object.entries(chartDataMap)
      .map(([date, revenue]) => ({ date, revenue }))
      .reverse(); // Assuming orders are fetched newest-first, we reverse for chronological order

    return {
      totalRevenue,
      aov,
      refundRate,
      categories,
      maxCat,
      rankedProducts,
      chartData,
    };
  }, [products, orders]);

  return (
    <div className="flex flex-col flex-1 bg-gray-50 overflow-hidden">
      <DashboardPageHeader
        title="Analytics"
        subtitle="Store performance and sales trends"
        loading={loading}
        onRefresh={load}
      />

      <div className="flex flex-col flex-1 px-8 py-4 gap-6 overflow-hidden custom-scroll overflow-y-auto">
        {/* ROW 1: THE KPIs */}
        <div className="shrink-0">
          {loading ? (
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-28 rounded-xl" />
                ))}
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Total Revenue"
                value={`$${analytics.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                icon={FaDollarSign}
                sub="Gross completed sales"
              />
              <StatCard
                label="Average Order Value"
                value={`$${analytics.aov.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                icon={FiShoppingBag}
                sub="Per completed transaction"
              />
              <StatCard
                label="Total Products"
                value={products.length}
                icon={FiPackage}
                sub="Active items in catalog"
              />
              <StatCard
                label="Refund Rate"
                value={`${analytics.refundRate.toFixed(1)}%`}
                icon={FiRefreshCcw}
                warn={analytics.refundRate > 10}
                sub="Percentage of cancelled orders"
              />
            </div>
          )}
        </div>

        {/* ROW 2: CORE TRENDS (60/40 Split) */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 shrink-0 h-87.5">
          {/* Left: Revenue Trend Chart (60%) */}
          <div className="lg:col-span-3 bg-white border border-gray-100 rounded-xl p-5 flex flex-col h-full">
            <SectionHeader title="Revenue Trend (Last 30 Days)" />
            {loading ? (
              <Skeleton className="flex-1 rounded-lg" />
            ) : analytics.chartData.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                Not enough data to graph
              </div>
            ) : (
              <div className="flex-1 min-h-0 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.chartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f3f4f6"
                    />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#9ca3af", fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#9ca3af", fontSize: 12 }}
                      tickFormatter={(value) => `$${value}`}
                      dx={-10}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                      // formatter={(value: number) => [
                      //   `$${value.toFixed(2)}`,
                      //   "Revenue",
                      // ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#10b981", strokeWidth: 0 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Right: Category Distribution (40%) */}
          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-xl p-5 flex flex-col h-full">
            <SectionHeader title="Category Breakdown" />
            <div className="flex-1 overflow-y-auto pr-2 custom-scroll">
              {loading ? (
                <div className="space-y-4">
                  {Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton key={i} className="h-10" />
                    ))}
                </div>
              ) : analytics.categories.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                  No categories found
                </div>
              ) : (
                <div className="space-y-4">
                  {analytics.categories.map(([name, count]) => (
                    <div key={name}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-gray-700 text-sm font-medium capitalize">
                          {name}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {count} items
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gray-800 rounded-full transition-all duration-700"
                          style={{
                            width: `${(count / analytics.maxCat) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ROW 3: DEEP DIVE (Top Products by Real Sales) */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 flex flex-col shrink-0 min-h-75">
          <SectionHeader title="Top Performing Products" />
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider pl-2">
                    Rank
                  </th>
                  <th className="pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Product Name
                  </th>
                  <th className="pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">
                    Price
                  </th>
                  <th className="pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">
                    Units Sold
                  </th>
                  <th className="pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right pr-2">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-4">
                      <Skeleton className="h-32" />
                    </td>
                  </tr>
                ) : analytics.rankedProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-gray-400 text-sm"
                    >
                      No sales data yet
                    </td>
                  </tr>
                ) : (
                  analytics.rankedProducts.map((product, i) => (
                    <tr
                      key={product._id}
                      className="hover:bg-gray-50 transition-colors group"
                    >
                      <td className="py-3 pl-2 text-sm font-mono text-gray-400">
                        {i + 1}
                      </td>
                      <td className="py-3">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">
                            {product.name}
                          </span>
                          <span className="text-xs text-gray-400 capitalize">
                            {product.category}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-right text-sm text-gray-600">
                        ${product.price.toLocaleString()}
                      </td>
                      <td className="py-3 text-right">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-700">
                          {product.unitsSold}
                        </span>
                      </td>
                      <td className="py-3 text-right pr-2 text-sm font-semibold text-gray-900">
                        ${product.revenueGenerated.toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
