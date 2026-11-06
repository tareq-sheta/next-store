"use client";

import { useEffect, useState, useCallback } from "react";
import {
  LuDollarSign,
  LuClock,
  LuTriangle,
  LuOctagonAlert,
} from "react-icons/lu";

import type { SellerProductDTO, ProductDTO } from "@/types/products";
import type { OrderDTO } from "@/types/orders";
import {
  DashboardPageHeader,
  Skeleton,
} from "@/components/dashboard/dashboard-shared";
import SectionHeader from "./SectionHeader";

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
    <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-4 hover:shadow-sm transition-shadow">
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
        {sub && <p className="text-gray-400 text-xs mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function SellerOverviewPage() {
  const [products, setProducts] = useState<SellerProductDTO[]>([]);
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

  // --- ACTIONABLE KPI CALCULATIONS ---

  // Note: Replace this placeholder logic with a proper backend Mongoose query for "Today's Revenue"
  const todaysRevenue = orders
    .filter((o) => o.orderStatus !== "cancelled")
    .reduce((acc, o) => acc + o.totalPrice, 0); // Adjust 'totalAmount' to match your DTO

  const pendingOrders = orders.filter((o) => o.orderStatus === "pending");
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const outOfStock = products.filter((p) => p.stock === 0).length;

  // --- ORDER STATUS DISTRIBUTION (Pipeline) ---
  const statusMap = orders.reduce(
    (acc, o) => {
      acc[o.orderStatus] = (acc[o.orderStatus] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const statusColors: Record<
    string,
    { bg: string; bar: string; text: string }
  > = {
    pending: {
      bg: "bg-amber-100",
      bar: "bg-amber-500",
      text: "text-amber-700",
    },
    shipped: { bg: "bg-blue-100", bar: "bg-blue-500", text: "text-blue-700" },
    delivered: {
      bg: "bg-emerald-100",
      bar: "bg-emerald-500",
      text: "text-emerald-700",
    },
    cancelled: { bg: "bg-red-100", bar: "bg-red-500", text: "text-red-700" },
  };

  return (
    <div className="flex flex-col flex-1 bg-gray-50 overflow-hidden">
      <DashboardPageHeader
        title="Overview"
        subtitle="Daily operations and fulfillment"
        loading={loading}
        onRefresh={loadAnalytics}
      />

      <div className="flex flex-col flex-1 px-8 py-4 gap-6 overflow-hidden custom-scroll overflow-y-auto">
        {/* ROW 1: THE PULSE (Actionable KPIs) */}
        <div className="shrink-0">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-32 rounded-2xl" />
                ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Today's Revenue"
                value={`$${todaysRevenue.toLocaleString()}`}
                icon={LuDollarSign}
                accent="bg-emerald-100 text-emerald-600"
                sub="Gross volume today"
              />
              <StatCard
                label="Pending Orders"
                value={pendingOrders.length}
                icon={LuClock}
                accent="bg-amber-100 text-amber-600"
                sub="Needs shipping labels"
              />
              <StatCard
                label="Low Stock"
                value={lowStock}
                icon={LuTriangle}
                accent="bg-orange-100 text-orange-600"
                sub="5 or fewer units remaining"
              />
              <StatCard
                label="Out of Stock"
                value={outOfStock}
                icon={LuOctagonAlert}
                accent="bg-red-100 text-red-600"
                sub="Immediate restock required"
              />
            </div>
          )}
        </div>

        {/* ROW 2: FULFILLMENT CENTER (60/40 Split) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 shrink-0 min-h-100">
          {/* Left Column (60%): Recent Orders Table */}
          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-5 flex flex-col min-h-0">
            {/* <div className="flex items-center justify-between mb-4 shrink-0">
              <div>
                <h3 className="text-gray-900 text-base font-semibold">
                  Recent Orders
                </h3>
                <p className="text-gray-400 text-xs mt-0.5">
                  Latest transactions requiring fulfillment
                </p>
              </div>
              <button className="text-sm text-gray-500 hover:text-gray-900 font-medium">
                View all ↗
              </button>
            </div> */}
            <SectionHeader title="Recent orders" href="/dashboard/orders" />

            <div className="flex-1 overflow-x-auto overflow-y-auto custom-scroll">
              <table className="w-full text-left border-collapse min-w-150">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-24">
                      Order ID
                    </th>
                    <th className="pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">
                      Items
                    </th>
                    <th className="pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="py-4">
                        <Skeleton className="h-32" />
                      </td>
                    </tr>
                  ) : (
                    orders.slice(0, 8).map((order) => {
                      const styling =
                        statusColors[order.orderStatus.toLowerCase()] ||
                        statusColors.pending;
                      return (
                        <tr
                          key={order._id}
                          className="hover:bg-gray-50/50 transition-colors group"
                        >
                          <td className="py-3.5 pr-4 text-sm font-mono text-gray-500">
                            #{order._id.slice(-6).toUpperCase()}
                          </td>
                          <td className="py-3.5 pr-4">
                            <p className="text-sm font-medium text-gray-900">
                              {/* Map this to your actual user name field in OrderDTO */}
                              {order.user?.userName || "Guest Customer"}
                            </p>
                          </td>
                          <td className="py-3.5 px-4 text-center text-sm text-gray-500">
                            {/* Map this to your actual products array in OrderDTO */}
                            {order.products?.length || 1}
                          </td>
                          <td className="py-3.5 pl-4 text-right">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide capitalize ${styling.bg} ${styling.text}`}
                            >
                              {order.orderStatus}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column (40%): Orders by Status */}
          <div className="lg:col-span-1 bg-white border border-gray-100 rounded-2xl p-5 flex flex-col min-h-0">
            <h3 className="text-gray-900 text-base font-semibold shrink-0">
              Orders by Status
            </h3>
            <p className="text-gray-400 text-xs mb-6 shrink-0 mt-0.5">
              Current pipeline breakdown
            </p>

            <div className="flex-1 overflow-y-auto pr-2 custom-scroll">
              {loading ? (
                <div className="space-y-4">
                  {Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton key={i} className="h-10" />
                    ))}
                </div>
              ) : orders.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">
                  No orders yet
                </p>
              ) : (
                <div className="space-y-5">
                  {Object.entries(statusMap).map(([status, count]) => {
                    const styling =
                      statusColors[status.toLowerCase()] ||
                      statusColors.pending;
                    return (
                      <div key={status} className="flex items-center gap-3">
                        <div
                          className={`w-2.5 h-2.5 rounded-full shrink-0 ${styling.bar}`}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-gray-700 text-sm font-medium capitalize">
                              {status}
                            </span>
                            <span className="text-gray-500 text-sm font-semibold">
                              {count}
                            </span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-1000 ease-out ${styling.bar}`}
                              style={{
                                width: `${(count / orders.length) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
