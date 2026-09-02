// "use client";

// import { useEffect, useState, useCallback } from "react";
// // import { TrendingUp, Package, ShoppingBag, AlertTriangle } from "lucide-react";
// import {
//   LuTrendingUp,
//   LuPackage,
//   LuShoppingBag,
//   LuTriangle,
// } from "react-icons/lu";
// import type { ProductDTO } from "@/types/products";
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

// export default function AnalyticsPage() {
//   const [products, setProducts] = useState<ProductDTO[]>([]);
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
//       acc[o.status] = (acc[o.status] ?? 0) + 1;
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
//     .sort((a, b) => b.quantity - a.quantity)
//     .slice(0, 5);

//   const lowStock = products.filter((p) => p.stock <= 5).length;
//   const outOfStock = products.filter((p) => p.stock === 0).length;

//   return (
//     <div className="flex-1 overflow-auto">
//       {/* <TopBar title="Analytics" /> */}

//       <DashboardPageHeader
//         title="Analytics"
//         subtitle="Store-wide metrics and inventory insights"
//         loading={loading}
//         onRefresh={loadAnalytics}
//       />
//       <div className="px-8 py-6 space-y-6">
//         {/* <div>
//           <h2 className="text-gray-900 text-xl font-semibold tracking-tight">
//             Analytics
//           </h2>
//           <p className="text-gray-300 text-sm mt-0.5">
//             Store-wide metrics and inventory insights
//           </p>
//         </div> */}

//         {/* Stat cards */}
//         {loading ? (
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//             {Array(4)
//               .fill(0)
//               .map((_, i) => (
//                 <Skeleton key={i} className="h-28" />
//               ))}
//           </div>
//         ) : (
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//             <StatCard
//               label="Total Products"
//               value={products.length}
//               icon={LuPackage}
//               accent="bg-gray-100 text-gray-600"
//               sub="in catalogue"
//             />
//             <StatCard
//               label="Total Orders"
//               value={orders.length}
//               icon={LuShoppingBag}
//               accent="bg-emerald-500/10 text-emerald-400"
//               sub="all time"
//             />
//             <StatCard
//               label="Low Stock"
//               value={lowStock}
//               icon={LuTriangle}
//               accent="bg-amber-500/10 text-amber-400"
//               sub="≤ 5 units"
//             />
//             <StatCard
//               label="Out of Stock"
//               value={outOfStock}
//               icon={LuTriangle}
//               accent="bg-red-500/10 text-red-400"
//               sub="needs restocking"
//             />
//           </div>
//         )}

//         {/* Two column charts */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
//           {/* Category distribution */}
//           <div className="bg-white border border-gray-100 rounded-2xl p-5">
//             <h3 className="text-gray-900 text-sm font-semibold mb-1">
//               Products by Category
//             </h3>
//             <p className="text-gray-300 text-xs mb-5">Inventory distribution</p>
//             {loading ? (
//               <div className="space-y-3">
//                 {Array(5)
//                   .fill(0)
//                   .map((_, i) => (
//                     <Skeleton key={i} className="h-8" />
//                   ))}
//               </div>
//             ) : categoryData.length === 0 ? (
//               <p className="text-gray-300 text-sm text-center py-8">
//                 No data yet
//               </p>
//             ) : (
//               <div className="space-y-3">
//                 {categoryData.map(([name, count]) => (
//                   <div key={name}>
//                     <div className="flex items-center justify-between mb-1.5">
//                       <span className="text-gray-600 text-xs capitalize">
//                         {name}
//                       </span>
//                       <span className="text-gray-400 text-xs">
//                         {count} items ·{" "}
//                         {Math.round((count / products.length) * 100)}%
//                       </span>
//                     </div>
//                     <div className="h-1.5 bg-gray-150 rounded-full overflow-hidden">
//                       <div
//                         className="h-full bg-gray-900 rounded-full transition-all duration-700"
//                         style={{ width: `${(count / maxCat) * 100}%` }}
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Order status distribution */}
//           <div className="bg-white border border-gray-100 rounded-2xl p-5">
//             <h3 className="text-gray-900 text-sm font-semibold mb-1">
//               Orders by Status
//             </h3>
//             <p className="text-gray-300 text-xs mb-5">
//               Current pipeline breakdown
//             </p>
//             {loading ? (
//               <div className="space-y-3">
//                 {Array(4)
//                   .fill(0)
//                   .map((_, i) => (
//                     <Skeleton key={i} className="h-8" />
//                   ))}
//               </div>
//             ) : orders.length === 0 ? (
//               <p className="text-gray-300 text-sm text-center py-8">
//                 No orders yet
//               </p>
//             ) : (
//               <div className="space-y-4">
//                 {Object.entries(statusMap).map(([status, count]) => (
//                   <div key={status} className="flex items-center gap-3">
//                     <div
//                       className={`w-2 h-2 rounded-full shrink-0 ${statusColors[status] ?? "bg-gray-1500"}`}
//                     />
//                     <div className="flex-1">
//                       <div className="flex items-center justify-between mb-1">
//                         <span className="text-gray-600 text-xs capitalize">
//                           {status}
//                         </span>
//                         <span className="text-gray-400 text-xs">{count}</span>
//                       </div>
//                       <div className="h-1.5 bg-gray-150 rounded-full overflow-hidden">
//                         <div
//                           className={`h-full rounded-full transition-all duration-700 ${statusColors[status] ?? "bg-gray-1500"}`}
//                           style={{ width: `${(count / orders.length) * 100}%` }}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Top products table */}
//         <div className="bg-white border border-gray-100 rounded-2xl p-5">
//           <div className="flex items-center justify-between mb-5">
//             <div>
//               <h3 className="text-gray-900 text-sm font-semibold">
//                 Top Products
//               </h3>
//               <p className="text-gray-300 text-xs">Ranked by quantity</p>
//             </div>
//             <LuTrendingUp size={14} className="text-gray-300" />
//           </div>
//           {loading ? (
//             <div className="space-y-3">
//               {Array(5)
//                 .fill(0)
//                 .map((_, i) => (
//                   <Skeleton key={i} className="h-12" />
//                 ))}
//             </div>
//           ) : topProducts.length === 0 ? (
//             <p className="text-gray-300 text-sm text-center py-8">
//               No products yet
//             </p>
//           ) : (
//             <div className="space-y-2">
//               {topProducts.map((product, i) => (
//                 <div
//                   key={product._id}
//                   className="flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-gray-150 transition-colors"
//                 >
//                   <span className="text-gray-300 text-xs font-mono w-4 shrink-0">
//                     {i + 1}
//                   </span>
//                   {product.image ? (
//                     // eslint-disable-next-line @next/next/no-img-element
//                     <img
//                       src={product.image}
//                       alt={product.name}
//                       className="w-8 h-8 rounded-lg object-cover border border-gray-100 shrink-0"
//                     />
//                   ) : (
//                     <div className="w-8 h-8 rounded-lg bg-gray-150 shrink-0" />
//                   )}
//                   <div className="flex-1 min-w-0">
//                     <p className="text-gray-900 text-xs font-medium truncate">
//                       {product.name}
//                     </p>
//                     <p className="text-gray-300 text-[11px] capitalize">
//                       {product.category}
//                     </p>
//                   </div>
//                   <div className="text-right shrink-0">
//                     <p className="text-gray-900 text-xs font-semibold">
//                       ${product.price}
//                     </p>
//                     <p
//                       className={`text-[11px] ${product.stock <= 5 ? "text-amber-400" : "text-gray-300"}`}
//                     >
//                       {product.stock} in stock
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useState, useCallback } from "react";
// import { TrendingUp, Package, ShoppingBag, AlertTriangle } from "lucide-react";
import {
  LuTrendingUp,
  LuPackage,
  LuShoppingBag,
  LuTriangle,
} from "react-icons/lu";
import type { AdminProductDTO, ProductDTO } from "@/types/products";
import type { OrderDTO } from "@/types/orders";
import {
  DashboardPageHeader,
  Skeleton,
  //  TopBar
} from "@/components/dashboard/dashboard-shared";

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
  sub,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  accent: string;
  sub?: string;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">
          {label}
        </span>
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${accent}`}
        >
          <Icon size={15} />
        </div>
      </div>
      <div>
        <p className="text-gray-900 text-2xl font-semibold tracking-tight">
          {value}
        </p>
        {sub && <p className="text-gray-300 text-xs mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [products, setProducts] = useState<AdminProductDTO[]>([]);
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const [p, o] = await Promise.all([
        fetch("/api/products").then((r) => r.json()),
        fetch("/api/orders").then((r) => r.json()),
      ]);
      if (p.success) setProducts(p.data);
      if (o.success) setOrders(o.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  // Category distribution
  const categoryMap = products.reduce(
    (acc, p) => {
      acc[p.category] = (acc[p.category] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  const categoryData = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
  const maxCat = categoryData[0]?.[1] ?? 1;

  // Order status distribution
  const statusMap = orders.reduce(
    (acc, o) => {
      acc[o.orderStatus] = (acc[o.orderStatus] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const statusColors: Record<string, string> = {
    pending: "bg-amber-500",
    shipped: "bg-blue-500",
    delivered: "bg-emerald-500",
    cancelled: "bg-red-500",
  };

  // Top products by stock (proxy for popularity)
  const topProducts = [...products]
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 5);

  const lowStock = products.filter((p) => p.stock <= 5).length;
  const outOfStock = products.filter((p) => p.stock === 0).length;

  return (
    <div className="flex flex-col flex-1 bg-gray-150 overflow-hidden">
      {/* <TopBar title="Analytics" /> */}

      <DashboardPageHeader
        title="Analytics"
        subtitle="Store-wide metrics and inventory insights"
        loading={loading}
        onRefresh={loadAnalytics}
      />

      {/* Content — fills remaining height, no outer viewport scroll */}
      <div className="flex flex-col flex-1 px-8 py-4 gap-4 overflow-hidden">
        {/* Stat cards — fixed layout size */}
        <div className="shrink-0">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-24" />
                ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Total Products"
                value={products.length}
                icon={LuPackage}
                accent="bg-gray-100 text-gray-600"
                sub="in catalogue"
              />
              <StatCard
                label="Total Orders"
                value={orders.length}
                icon={LuShoppingBag}
                accent="bg-emerald-500/10 text-emerald-400"
                sub="all time"
              />
              <StatCard
                label="Low Stock"
                value={lowStock}
                icon={LuTriangle}
                accent="bg-amber-500/10 text-amber-400"
                sub="≤ 5 units"
              />
              <StatCard
                label="Out of Stock"
                value={outOfStock}
                icon={LuTriangle}
                accent="bg-red-500/10 text-red-400"
                sub="needs restocking"
              />
            </div>
          )}
        </div>

        {/* Middle row — capped height grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 shrink-0 max-h-70">
          {/* Category distribution */}
          <div className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col min-h-0">
            <h3 className="text-gray-900 text-sm font-semibold mb-1 shrink-0">
              Products by Category
            </h3>
            <p className="text-gray-300 text-xs mb-3 shrink-0">
              Inventory distribution
            </p>

            <div className="flex-1 overflow-y-auto min-h-0 pr-1 custom-scroll">
              {loading ? (
                <div className="space-y-3">
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton key={i} className="h-8" />
                    ))}
                </div>
              ) : categoryData.length === 0 ? (
                <p className="text-gray-300 text-sm text-center py-8">
                  No data yet
                </p>
              ) : (
                <div className="space-y-3">
                  {categoryData.map(([name, count]) => (
                    <div key={name}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-gray-600 text-xs capitalize">
                          {name}
                        </span>
                        <span className="text-gray-400 text-xs">
                          {count} items ·{" "}
                          {Math.round((count / products.length) * 100)}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-150 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gray-900 rounded-full transition-all duration-700"
                          style={{ width: `${(count / maxCat) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Order status distribution */}
          <div className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col min-h-0">
            <h3 className="text-gray-900 text-sm font-semibold mb-1 shrink-0">
              Orders by Status
            </h3>
            <p className="text-gray-300 text-xs mb-3 shrink-0">
              Current pipeline breakdown
            </p>

            <div className="flex-1 overflow-y-auto min-h-0 pr-1 custom-scroll">
              {loading ? (
                <div className="space-y-3">
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton key={i} className="h-8" />
                    ))}
                </div>
              ) : orders.length === 0 ? (
                <p className="text-gray-300 text-sm text-center py-8">
                  No orders yet
                </p>
              ) : (
                <div className="space-y-4">
                  {Object.entries(statusMap).map(([status, count]) => (
                    <div key={status} className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full shrink-0 ${statusColors[status] ?? "bg-gray-1500"}`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-gray-600 text-xs capitalize">
                            {status}
                          </span>
                          <span className="text-gray-400 text-xs">{count}</span>
                        </div>
                        <div className="h-1.5 bg-gray-150 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${statusColors[status] ?? "bg-gray-1500"}`}
                            style={{
                              width: `${(count / orders.length) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Top products table — dynamically claims remaining room */}
        <div className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col flex-1 min-h-0">
          <div className="flex items-center justify-between mb-3 shrink-0">
            <div>
              <h3 className="text-gray-900 text-sm font-semibold">
                Top Products
              </h3>
              <p className="text-gray-300 text-xs">Ranked by quantity</p>
            </div>
            <LuTrendingUp size={14} className="text-gray-300" />
          </div>

          <div className="flex-1 overflow-y-auto min-h-0 pr-1 custom-scroll">
            {loading ? (
              <div className="space-y-3">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-12" />
                  ))}
              </div>
            ) : topProducts.length === 0 ? (
              <p className="text-gray-300 text-sm text-center py-8">
                No products yet
              </p>
            ) : (
              <div className="space-y-2">
                {topProducts.map((product, i) => (
                  <div
                    key={product._id}
                    className="flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-gray-150 transition-colors"
                  >
                    <span className="text-gray-300 text-xs font-mono w-4 shrink-0">
                      {i + 1}
                    </span>
                    {product.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-8 h-8 rounded-lg object-cover border border-gray-100 shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-gray-150 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 text-xs font-medium truncate">
                        {product.name}
                      </p>
                      <p className="text-gray-300 text-[11px] capitalize">
                        {product.category}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-gray-900 text-xs font-semibold">
                        ${product.price}
                      </p>
                      <p
                        className={`text-[11px] ${product.stock <= 5 ? "text-amber-400" : "text-gray-300"}`}
                      >
                        {product.stock} in stock
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
