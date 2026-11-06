// "use client";

// import { useEffect, useState, useCallback } from "react";
// import {
//   LuTrendingUp,
//   LuPackage,
//   LuShoppingBag,
//   LuTriangle,
// } from "react-icons/lu";
// import type { AdminProductDTO, ProductDTO } from "@/types/products";
// import type { OrderDTO } from "@/types/orders";
// import {
//   DashboardPageHeader,
//   Skeleton,
//   //  TopBar
// } from "@/components/dashboard/dashboard-shared";

// function StatCard({
//   label,
//   value,
//   icon: Icon,
//   accent,
//   sub,
// }: {
//   label: string;
//   value: string | number;
//   icon: React.ElementType;
//   accent: string;
//   sub?: string;
// }) {
//   return (
//     <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-4">
//       <div className="flex items-center justify-between">
//         <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">
//           {label}
//         </span>
//         <div
//           className={`w-8 h-8 rounded-lg flex items-center justify-center ${accent}`}
//         >
//           <Icon size={15} />
//         </div>
//       </div>
//       <div>
//         <p className="text-gray-900 text-2xl font-semibold tracking-tight">
//           {value}
//         </p>
//         {sub && <p className="text-gray-300 text-xs mt-0.5">{sub}</p>}
//       </div>
//     </div>
//   );
// }

// export default function AdminAnalyticsPage() {
//   const [products, setProducts] = useState<AdminProductDTO[]>([]);
//   const [orders, setOrders] = useState<OrderDTO[]>([]);
//   const [loading, setLoading] = useState(true);

//   const loadAnalytics = useCallback(async () => {
//     setLoading(true);
//     try {
//       const [p, o] = await Promise.all([
//         fetch("/api/products").then((r) => r.json()),
//         fetch("/api/orders").then((r) => r.json()),
//       ]);
//       if (p.success) setProducts(p.data);
//       if (o.success) setOrders(o.data);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     loadAnalytics();
//   }, [loadAnalytics]);

//   // Category distribution
//   const categoryMap = products.reduce(
//     (acc, p) => {
//       acc[p.category] = (acc[p.category] ?? 0) + 1;
//       return acc;
//     },
//     {} as Record<string, number>,
//   );
//   const categoryData = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
//   const maxCat = categoryData[0]?.[1] ?? 1;

//   // Order status distribution
//   const statusMap = orders.reduce(
//     (acc, o) => {
//       acc[o.orderStatus] = (acc[o.orderStatus] ?? 0) + 1;
//       return acc;
//     },
//     {} as Record<string, number>,
//   );

//   const statusColors: Record<string, string> = {
//     pending: "bg-amber-500",
//     shipped: "bg-blue-500",
//     delivered: "bg-emerald-500",
//     cancelled: "bg-red-500",
//   };

//   // Top products by stock (proxy for popularity)
//   const topProducts = [...products]
//     .sort((a, b) => b.stock - a.stock)
//     .slice(0, 5);

//   const lowStock = products.filter((p) => p.stock <= 5).length;
//   const outOfStock = products.filter((p) => p.stock === 0).length;

//   return (
//     <div className="flex flex-col flex-1 bg-gray-150 overflow-hidden">
//       {/* <TopBar title="Analytics" /> */}

//       <DashboardPageHeader
//         title="Analytics"
//         subtitle="Store-wide metrics and inventory insights"
//         loading={loading}
//         onRefresh={loadAnalytics}
//       />

//       {/* Content — fills remaining height, no outer viewport scroll */}
//       <div className="flex flex-col flex-1 px-8 py-4 gap-4 overflow-hidden">
//         {/* Stat cards — fixed layout size */}
//         <div className="shrink-0">
//           {loading ? (
//             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//               {Array(4)
//                 .fill(0)
//                 .map((_, i) => (
//                   <Skeleton key={i} className="h-24" />
//                 ))}
//             </div>
//           ) : (
//             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//               <StatCard
//                 label="Total Products"
//                 value={products.length}
//                 icon={LuPackage}
//                 accent="bg-gray-100 text-gray-600"
//                 sub="in catalogue"
//               />
//               <StatCard
//                 label="Total Orders"
//                 value={orders.length}
//                 icon={LuShoppingBag}
//                 accent="bg-emerald-500/10 text-emerald-400"
//                 sub="all time"
//               />
//               <StatCard
//                 label="Low Stock"
//                 value={lowStock}
//                 icon={LuTriangle}
//                 accent="bg-amber-500/10 text-amber-400"
//                 sub="≤ 5 units"
//               />
//               <StatCard
//                 label="Out of Stock"
//                 value={outOfStock}
//                 icon={LuTriangle}
//                 accent="bg-red-500/10 text-red-400"
//                 sub="needs restocking"
//               />
//             </div>
//           )}
//         </div>

//         {/* Middle row — capped height grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 shrink-0 max-h-70">
//           {/* Category distribution */}
//           <div className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col min-h-0">
//             <h3 className="text-gray-900 text-sm font-semibold mb-1 shrink-0">
//               Products by Category
//             </h3>
//             <p className="text-gray-300 text-xs mb-3 shrink-0">
//               Inventory distribution
//             </p>

//             <div className="flex-1 overflow-y-auto min-h-0 pr-1 custom-scroll">
//               {loading ? (
//                 <div className="space-y-3">
//                   {Array(3)
//                     .fill(0)
//                     .map((_, i) => (
//                       <Skeleton key={i} className="h-8" />
//                     ))}
//                 </div>
//               ) : categoryData.length === 0 ? (
//                 <p className="text-gray-300 text-sm text-center py-8">
//                   No data yet
//                 </p>
//               ) : (
//                 <div className="space-y-3">
//                   {categoryData.map(([name, count]) => (
//                     <div key={name}>
//                       <div className="flex items-center justify-between mb-1.5">
//                         <span className="text-gray-600 text-xs capitalize">
//                           {name}
//                         </span>
//                         <span className="text-gray-400 text-xs">
//                           {count} items ·{" "}
//                           {Math.round((count / products.length) * 100)}%
//                         </span>
//                       </div>
//                       <div className="h-1.5 bg-gray-150 rounded-full overflow-hidden">
//                         <div
//                           className="h-full bg-gray-900 rounded-full transition-all duration-700"
//                           style={{ width: `${(count / maxCat) * 100}%` }}
//                         />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Order status distribution */}
//           <div className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col min-h-0">
//             <h3 className="text-gray-900 text-sm font-semibold mb-1 shrink-0">
//               Orders by Status
//             </h3>
//             <p className="text-gray-300 text-xs mb-3 shrink-0">
//               Current pipeline breakdown
//             </p>

//             <div className="flex-1 overflow-y-auto min-h-0 pr-1 custom-scroll">
//               {loading ? (
//                 <div className="space-y-3">
//                   {Array(3)
//                     .fill(0)
//                     .map((_, i) => (
//                       <Skeleton key={i} className="h-8" />
//                     ))}
//                 </div>
//               ) : orders.length === 0 ? (
//                 <p className="text-gray-300 text-sm text-center py-8">
//                   No orders yet
//                 </p>
//               ) : (
//                 <div className="space-y-4">
//                   {Object.entries(statusMap).map(([status, count]) => (
//                     <div key={status} className="flex items-center gap-3">
//                       <div
//                         className={`w-2 h-2 rounded-full shrink-0 ${statusColors[status] ?? "bg-gray-1500"}`}
//                       />
//                       <div className="flex-1">
//                         <div className="flex items-center justify-between mb-1">
//                           <span className="text-gray-600 text-xs capitalize">
//                             {status}
//                           </span>
//                           <span className="text-gray-400 text-xs">{count}</span>
//                         </div>
//                         <div className="h-1.5 bg-gray-150 rounded-full overflow-hidden">
//                           <div
//                             className={`h-full rounded-full transition-all duration-700 ${statusColors[status] ?? "bg-gray-1500"}`}
//                             style={{
//                               width: `${(count / orders.length) * 100}%`,
//                             }}
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Top products table — dynamically claims remaining room */}
//         <div className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col flex-1 min-h-0">
//           <div className="flex items-center justify-between mb-3 shrink-0">
//             <div>
//               <h3 className="text-gray-900 text-sm font-semibold">
//                 Top Products
//               </h3>
//               <p className="text-gray-300 text-xs">Ranked by quantity</p>
//             </div>
//             <LuTrendingUp size={14} className="text-gray-300" />
//           </div>

//           <div className="flex-1 overflow-y-auto min-h-0 pr-1 custom-scroll">
//             {loading ? (
//               <div className="space-y-3">
//                 {Array(4)
//                   .fill(0)
//                   .map((_, i) => (
//                     <Skeleton key={i} className="h-12" />
//                   ))}
//               </div>
//             ) : topProducts.length === 0 ? (
//               <p className="text-gray-300 text-sm text-center py-8">
//                 No products yet
//               </p>
//             ) : (
//               <div className="space-y-2">
//                 {topProducts.map((product, i) => (
//                   <div
//                     key={product._id}
//                     className="flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-gray-150 transition-colors"
//                   >
//                     <span className="text-gray-300 text-xs font-mono w-4 shrink-0">
//                       {i + 1}
//                     </span>
//                     {product.image ? (
//                       // eslint-disable-next-line @next/next/no-img-element
//                       <img
//                         src={product.image}
//                         alt={product.name}
//                         className="w-8 h-8 rounded-lg object-cover border border-gray-100 shrink-0"
//                       />
//                     ) : (
//                       <div className="w-8 h-8 rounded-lg bg-gray-150 shrink-0" />
//                     )}
//                     <div className="flex-1 min-w-0">
//                       <p className="text-gray-900 text-xs font-medium truncate">
//                         {product.name}
//                       </p>
//                       <p className="text-gray-300 text-[11px] capitalize">
//                         {product.category}
//                       </p>
//                     </div>
//                     <div className="text-right shrink-0">
//                       <p className="text-gray-900 text-xs font-semibold">
//                         ${product.price}
//                       </p>
//                       <p
//                         className={`text-[11px] ${product.stock <= 5 ? "text-amber-400" : "text-gray-300"}`}
//                       >
//                         {product.stock} in stock
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
//----------
"use client";
import { useEffect, useState } from "react";
import {
  FiPackage,
  FiShoppingBag,
  FiUsers,
  FiArrowUpRight,
} from "react-icons/fi";
import Link from "next/link";
import { useSession } from "next-auth/react";
import type { SellerProductDTO, AdminProductDTO } from "@/types/products";
import type { CurrentUser, UserDTO } from "@/types/users";
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
  fetchSellerDashboardProducts,
} from "@/lib";

import { FaDollarSign } from "react-icons/fa6";
import SectionHeader from "./SectionHeader";

interface DisplayProducts {
  _id: string;
  name: string;
  price: number;
  stock: number;
  sellerName: string;
}

interface Stats {
  // recentlyAddedProducts: number;
  totalProducts: number;
  latestProducts: DisplayProducts[];
  latestOrders: OrderDTO[];
  users: UserDTO[];

  thisWeekRevenue: number;
  totalRevenue: number;
}

function StatCard({
  label,
  value,
  icon: Icon,
  sub,
  href,
  warn,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  //   sub: string;
  sub: React.ReactNode;
  href: string;
  warn?: boolean;
}) {
  return (
    <Link
      href={href}
      // className={`bg-white border rounded-xl p-5 flex flex-col gap-3 hover:shadow-md transition-all group ${
      //   warn && value > 0
      //     ? "border-amber-200"
      //     : "border-gray-100 hover:border-gray-200"
      // }`}
      className={`bg-white border rounded-xl p-5 flex flex-col gap-3 hover:shadow-md transition-all group border-gray-100 hover:border-gray-200`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
          {label}
        </span>
        <div
          // className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
          //   warn && value > 0
          //     ? "bg-amber-50 text-amber-500"
          //     : "bg-gray-150 text-gray-400 group-hover:bg-gray-100 group-hover:text-gray-600"
          // }`}
          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors  bg-gray-150 text-gray-400 group-hover:bg-gray-100 group-hover:text-gray-600`}
        >
          <Icon size={14} />
        </div>
      </div>
      <div>
        <p
          // className={`text-3xl font-bold tracking-tight ${warn && value > 0 ? "text-amber-600" : "text-gray-900"}`}
          className={`text-3xl font-bold tracking-tight text-gray-900`}
        >
          {value}
        </p>
        {/* <p className="text-gray-400 text-[11px] mt-0.5">{sub}</p> */}
        <div className="text-gray-400 text-[11px] mt-0.5">{sub}</div>
      </div>
    </Link>
  );
}

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

function Empty({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-gray-500">
      <p className="text-xs">{message}</p>
    </div>
  );
}

export default function DashboardOverview() {
  // const { data: session } = useSession();
  // const currentUser = session?.user as CurrentUser | undefined;
  // const isAdmin = currentUser?.role === "admin";

  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<OrderDTO[]>([]);
  // const [topProducts, setTopProducts] = useState<DisplayProducts[]>([]);
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

      // console.log("products111", productsRes);
      // console.log("orders111", ordersRes);
      // console.log("users111", usersRes);
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
          .reduce((acc, order) => {
            const orderTotal =
              order.products?.reduce(
                (itemSum, item) =>
                  itemSum + item.product?.price * item.quantity,
                0,
              ) ?? 0;
            return acc + orderTotal;
          }, 0),
        totalRevenue: orders.reduce((acc, order) => {
          const orderTotal =
            order.products?.reduce(
              (itemSum, item) => itemSum + item.product?.price * item.quantity,
              0,
            ) ?? 0;
          return acc + orderTotal;
        }, 0),
      });
      setRecentOrders(
        [...orders]
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .slice(0, 6),
      );
      // setTopProducts(lastAddedProducts.slice(0, 6));
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
  console.log("stats", stats);
  return (
    <div className="flex flex-col flex-1 bg-gray-150 overflow-hidden">
      <DashboardPageHeader
        title="Overview"
        subtitle="Full store overview"
        loading={loading}
        onRefresh={load}
      />
      {/* <div className="flex flex-col flex-1 px-8 py-4 gap-4 overflow-hidden"> */}
      <div className="flex flex-col flex-1 px-8 py-4 gap-6 overflow-y-auto lg:overflow-hidden custom-scroll">
        <div className="shrink-0">
          {loading ? (
            <div className={`grid gap-4 grid-cols-4`}>
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-24" />
                ))}
            </div>
          ) : (
            stats && (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  label="Total Products"
                  value={stats.totalProducts}
                  icon={FiPackage}
                  sub={
                    <span className="flex items-center gap-1.5">
                      <span className="text-gray-500 font-medium">
                        {stats.latestProducts.length} recently added
                      </span>
                    </span>
                  }
                  href="/dashboard/products"
                />
                <StatCard
                  label="Total Orders"
                  value={stats.latestOrders.length}
                  icon={FiShoppingBag}
                  sub={
                    <span className="flex items-center gap-1.5">
                      <span className="text-gray-500 font-medium">
                        {
                          stats.latestOrders.filter(
                            (o) => o.orderStatus === "delivered",
                          ).length
                        }{" "}
                        Completed
                      </span>
                      <span className="text-gray-300">&bull;</span>
                      <span className="text-gray-500 font-medium">
                        {
                          stats.latestOrders.filter(
                            (o) => o.orderStatus === "pending",
                          ).length
                        }{" "}
                        Pending
                      </span>
                    </span>
                  }
                  href="/dashboard/orders"
                />

                {/* <StatCard
                  label="Users"
                  value={stats.totalUsers}
                  icon={FiUsers}
                  sub="registered accounts"
                  href="/dashboard/users"
                /> */}
                <StatCard
                  label="USERS"
                  value={stats.users.length}
                  icon={FiUsers}
                  href="/dashboard/users"
                  sub={
                    <span className="flex items-center gap-1.5">
                      <span className="text-gray-500 font-medium">
                        {
                          stats.users.filter((u) => u.role === "customer")
                            .length
                        }{" "}
                        Customers
                      </span>
                      <span className="text-gray-300">&bull;</span>
                      <span className="text-gray-500 font-medium">
                        {stats.users.filter((u) => u.role === "seller").length}{" "}
                        Sellers
                      </span>
                      <span className="text-gray-300">&bull;</span>
                      <span className="text-gray-500 font-medium">
                        {stats.users.filter((u) => u.role === "admin").length}{" "}
                        Admins
                      </span>
                    </span>
                  }
                />
                <StatCard
                  label="Total Revenue"
                  value={new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  }).format(stats.totalRevenue)}
                  // value={200000}
                  icon={FaDollarSign}
                  sub={
                    <span className="flex items-center gap-1.5">
                      <span className="text-gray-500 font-medium">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                          maximumFractionDigits: 0,
                        }).format(stats.thisWeekRevenue)}
                        {"   "}
                        This Week
                      </span>
                    </span>
                  }
                  href="/dashboard/analytics"
                />
              </div>
            )
          )}
        </div>

        {/* <div className={`grid gap-4  flex-1 min-h-0 grid-cols-6`}> */}
        <div className="grid gap-4 shrink-0 lg:shrink flex-1 min-h-100 lg:min-h-0 grid-cols-1 lg:grid-cols-6">
          <div className="lg:col-span-3 md:col-span-6 col-span-6 bg-white border border-gray-100 rounded-xl p-4 flex flex-col min-h-0">
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
                <Empty message="No orders yet — they'll appear here once customers start buying" />
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
                <div className="flex-1  overflow-x-hidden overflow-y-hidden divide-y divide-gray-50 min-h-0 ">
                  {recentOrders.map((order) => {
                    return (
                      <div
                        key={order._id.toString()}
                        className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] gap-3 items-center py-2 hover:bg-gray-150 rounded-lg px-1 transition-colors"
                      >
                        <span className="text-gray-900 text-xs font-mono font-medium">
                          #{order._id.toString().slice(-8).toUpperCase()}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {order.user.userName}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {order.products.length}
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

          <div className="lg:col-span-3 md:col-span-6 col-span-6 bg-white border border-gray-100 rounded-xl p-4 flex flex-col min-h-0">
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
                <div className="grid grid-cols-[1fr_118px_50px] gap-3 pb-2 border-b border-gray-50 shrink-0">
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
                <div className="flex-1  overflow-y-hidden overflow-x-hidden  divide-y divide-gray-50 pr-3 ">
                  {(stats?.latestProducts || []).map((product, i) => (
                    <div
                      key={product._id}
                      className="grid grid-cols-[28px_1fr_80px_72px] gap-3 items-center py-2 hover:bg-gray-150 -mx-2 px-2 rounded-lg transition-colors"
                    >
                      <span className="text-gray-500 text-[11px] font-mono">
                        {i + 1}
                      </span>
                      <p className="text-gray-900 text-xs font-medium truncate">
                        {product.name}
                      </p>
                      <span className="text-gray-400 text-[11px]">
                        ${product.price.toLocaleString()}
                      </span>
                      <span className="text-gray-400 text-[11px] text-end">
                        {product.sellerName}
                      </span>
                      {/* <div className="text-right">
                        <p
                          className={`text-xs font-semibold ${
                            product.stock === 0
                              ? "text-red-500"
                              : product.stock <= 5
                                ? "text-amber-500"
                                : "text-gray-400"
                          }`}
                        >
                          {product.stock}
                        </p>
                        <p className="text-gray-500 text-[10px]">in stock</p>
                      </div> */}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* <div className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col flex-1 min-h-0"> */}
        <div className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col shrink-0 lg:shrink flex-1 min-h-87.5 lg:min-h-0">
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
              <div className="flex-1 overflow-x-hidden overflow-y-hidden divide-y divide-gray-50 min-h-0">
                {recentUsers.map((user) => (
                  <div
                    key={user._id}
                    className="grid grid-cols-[1.5fr_2fr_1fr_1fr] gap-3 items-center py-2 hover:bg-gray-150 rounded-lg px-1 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center text-white text-[10px] font-bold uppercase shrink-0">
                        {user.userName[0]}
                      </div>
                      <span className="text-gray-900 text-xs font-medium truncate">
                        {user.userName}
                      </span>
                    </div>
                    <span className="text-gray-400 text-xs truncate">
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
