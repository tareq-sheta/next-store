"use client";
import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { FiSearch, FiTrash, FiX } from "react-icons/fi";
import type { OrderDTO, OrderStatus } from "@/types/orders";
import {
  Skeleton,
  EmptyState,
  statusBadge,
  timeAgo,
  DashboardPageHeader,
} from "@/components/dashboard/dashboard-shared";
import { toast } from "sonner";
import Image from "next/image";
import { fetchAllOrders } from "@/lib";

const STATUS_OPTIONS: OrderStatus[] = [
  "pending",
  "shipped",
  "delivered",
  "cancelled",
];

export default function OrdersPage() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | OrderStatus>("all");
  const [updatingKey, setUpdatingKey] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAllOrders();
      // const json = await res.json();
      console.log(res, "orders1111111111111111111111111111111");
      if (res.success) setOrders(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Per-item status change. A seller's request only needs { status } — the
  // server scopes it to their own line items automatically and rejects
  // anything else in the body. An admin has to send the full products
  // array (with just this one item's status changed), since the
  // buyer/admin update path replaces the whole list — orderStatus itself
  // is never sent by either path; the server always derives it.
  const handleItemStatusChange = async (
    order: OrderDTO,
    productId: string,
    newStatus: OrderStatus,
  ) => {
    const key = `${order._id}:${productId}`;
    setUpdatingKey(key);
    try {
      const body = isAdmin
        ? {
            products: order.products.map((item) =>
              item.product._id === productId
                ? { ...item, status: newStatus }
                : item,
            ),
          }
        : { status: newStatus };

      const res = await fetch(`/api/orders/${order._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (json.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === order._id ? json.data : o)),
        );
        toast.success(`Status updated to ${newStatus}`);
      } else {
        toast.error(json.error ?? "Update failed");
      }
    } finally {
      setUpdatingKey(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this order?")) return;
    const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) {
      setOrders((prev) => prev.filter((o) => o._id !== id));
      toast.warning("Order removed");
    } else {
      toast.error(json.error ?? "Failed");
    }
  };

  const filtered = orders.filter((o) => {
    const matchSearch = o._id.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filterStatus === "all" || o.orderStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = orders.reduce(
    (acc, o) => {
      acc[o.orderStatus] = (acc[o.orderStatus] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  // console.log(orders);
  return (
    <div className="flex flex-col h-full overflow-hidden">

      <DashboardPageHeader
        title="Orders"
        subtitle="Track and manage all customer orders"
        loading={loading}
        onRefresh={loadOrders}
      />
      <div className="flex flex-col flex-1 px-8 py-6 min-h-0 overflow-hidden">
        <div className="flex items-center gap-2 mb-5 flex-wrap shrink-0">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterStatus === "all"
                ? "bg-gray-900 text-white"
                : "text-gray-400 hover:text-gray-700 hover:bg-gray-150"
            }`}
          >
            All <span className="ml-1 text-gray-300">{orders.length}</span>
          </button>
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                filterStatus === s
                  ? `border ${statusBadge(s)}`
                  : "text-gray-400 hover:text-gray-700 hover:bg-gray-150"
              }`}
            >
              {s} <span className="ml-1 opacity-60">{counts[s] ?? 0}</span>
            </button>
          ))}
        </div>

        <div className="relative mb-5 shrink-0">
          <FiSearch
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID…"
            aria-label="Search orders by ID"
            className="w-full bg-white border border-gray-100 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-300 outline-none focus:border-gray-400 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-700"
            >
              <FiX size={14} />
            </button>
          )}
        </div>

        <div className="flex flex-col flex-1 min-h-0 bg-white border border-gray-100 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-12" />
                ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              message={
                search ? `No orders matching "${search}"` : "No orders yet"
              }
            />
          ) : (
            <>
              <div className="flex-1 overflow-x-auto min-h-0 flex flex-col">
                <div className="w-full min-w-150 text-sm flex flex-col flex-1 min-h-0">
                  <div className="flex items-center border-b border-gray-100 text-[11px] uppercase tracking-wider text-gray-300 font-medium px-4 py-3 shrink-0 bg-white">
                    <div className="w-[20%] text-left">Order ID</div>
                    <div className="w-[10%] text-left">Image</div>
                    <div className="w-[45%] text-left">Items &amp; status</div>
                    <div className="w-[15%] text-left">Placed</div>
                    <div className="w-[15%] text-left">Order status</div>
                    <div className="w-[15%] text-right"></div>
                  </div>
                  <div className="flex flex-col flex-1 min-h-0 overflow-y-auto custom-scroll">
                    {filtered.map((order) => (
                      <div
                        key={order._id}
                        className="flex items-start border-b border-gray-50 hover:bg-gray-150 transition-colors group px-4 py-3"
                      >
                        <div className="w-[20%] font-mono text-xs text-gray-600 truncate pr-2 mt-2">
                          {order._id.slice(-10).toUpperCase()}
                        </div>
                        <div className="flex flex-col justify-around items-center w-[10%] h-full font-mono text-xs text-gray-600 truncate pr-2 pt-1">
                          {order.products.map((item) => (
                            <div
                              key={item.product._id}
                              // className="flex  items-center gap-2"
                              className="flex  pr-2 space-y-1.5"
                            >
                              <Image
                                src={item.product.image}
                                alt={item.product.name}
                                width={45}
                                height={45}
                                className="py-1"
                              />
                            </div>
                          ))}
                        </div>
                        <div className="w-[45%] flex flex-col h-full justify-around items-start pr-10 space-y-1.5">
                          {order.products.map((item) => (
                            <div
                              key={item.product._id}
                              className="flex items-center h-12.5 justify-between w-full gap-2"
                            >
                              <span className="text-gray-500 text-xs truncate flex-1">
                                {item.product.name.slice(0, 30) + "..."} ×{" "}
                                {item.quantity}
                              </span>
                              <select
                                value={item.productStatus}
                                disabled={
                                  updatingKey === `${order._id}:${item.product}`
                                }
                                onChange={(e) =>
                                  handleItemStatusChange(
                                    order,
                                    item.product._id,
                                    e.target.value as OrderStatus,
                                  )
                                }
                                aria-label={`Status for item ${item.product.name}`}
                                className={`text-[10px] font-medium px-2 py-0.5 rounded-full border outline-none cursor-pointer capitalize transition-colors bg-transparent ${statusBadge(item.productStatus)} disabled:opacity-50`}
                              >
                                {STATUS_OPTIONS.map((s) => (
                                  <option
                                    key={s}
                                    value={s}
                                    className="bg-white text-gray-900 capitalize"
                                  >
                                    {s}
                                  </option>
                                ))}
                              </select>
                            </div>
                          ))}
                        </div>
                        <div className="w-[15%] text-gray-300 text-xs truncate pr-2 mt-4.5">
                          {timeAgo(order.createdAt)}
                        </div>
                        <div className="w-[15%] pr-2 mt-4.5">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold capitalize w-fit ${statusBadge(order.orderStatus)}`}
                          >
                            {order.orderStatus}
                          </span>
                        </div>
                        <div className="w-[15%] flex justify-end pt-1">
                          {isAdmin && (
                            <button
                              onClick={() => handleDelete(order._id)}
                              className="opacity-80 group-hover:opacity-100 text-[20px] text-red-400/60 hover:text-red-400 transition-all p-2 mt-2 rounded hover:bg-red-50"
                            >
                              <FiTrash />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 border-t border-gray-100 text-gray-300 text-xs shrink-0">
                {filtered.length} of {orders.length} orders
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
