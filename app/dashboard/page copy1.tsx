"use client";
import { useEffect, useState } from "react";
import {
  FiAlertTriangle,
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

interface Stats {
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
  lowStock: number;
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
  value: number;
  icon: React.ElementType;
  sub: string;
  href: string;
  warn?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`bg-white border rounded-xl p-5 flex flex-col gap-3 hover:shadow-md transition-all group ${
        warn && value > 0
          ? "border-amber-200"
          : "border-gray-100 hover:border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
          {label}
        </span>
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
            warn && value > 0
              ? "bg-amber-50 text-amber-500"
              : "bg-gray-150 text-gray-400 group-hover:bg-gray-100 group-hover:text-gray-600"
          }`}
        >
          <Icon size={14} />
        </div>
      </div>
      <div>
        <p
          className={`text-3xl font-bold tracking-tight ${warn && value > 0 ? "text-amber-600" : "text-gray-900"}`}
        >
          {value}
        </p>
        <p className="text-gray-400 text-[11px] mt-0.5">{sub}</p>
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
      <Link
        href={href}
        className="text-[11px] font-medium text-gray-400 hover:text-gray-700 flex items-center gap-1 transition-colors"
      >
        {linkLabel} <FiArrowUpRight size={11} />
      </Link>
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

export default function DashboardPage() {
  const { data: session } = useSession();
  const currentUser = session?.user as CurrentUser | undefined;
  const isAdmin = currentUser?.role === "admin";

  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<OrderDTO[]>([]);
  const [topProducts, setTopProducts] = useState<
    (SellerProductDTO | AdminProductDTO)[]
  >([]);
  const [recentUsers, setRecentUsers] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        isAdmin
          ? fetchAdminDashboardProducts()
          : fetchSellerDashboardProducts(),
        fetchAllOrders(),
        isAdmin ? fetchAllUsers() : Promise.resolve(null),
      ]);

      const products = productsRes.success ? productsRes.data : [];
      const orders: OrderDTO[] = ordersRes.success ? ordersRes.data : [];
      const users: UserDTO[] = usersRes?.success ? usersRes.data : [];
      // console.log("products111", productsRes);
      console.log("orders111", ordersRes);
      // console.log("users111", usersRes);
      setStats({
        totalProducts: products.length,
        totalUsers: users.length,
        totalOrders: orders.length,
        lowStock: products.filter((p) => p.stock <= 5).length,
      });
      setRecentOrders(
        [...orders]
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .slice(0, 6),
      );
      setTopProducts(products.slice(0, 6));
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
    if (!currentUser) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, currentUser]);

  return (
    <div className="flex flex-col flex-1 bg-gray-150 overflow-hidden">
      <DashboardPageHeader
        title="Overview"
        subtitle={isAdmin ? "Full store overview" : "Your seller summary"}
        loading={loading}
        onRefresh={load}
      />
      <div className="flex flex-col flex-1 px-8 py-4 gap-4 overflow-hidden">
        <div className="shrink-0">
          {loading ? (
            <div
              className={`grid gap-4 ${isAdmin ? "grid-cols-4" : "grid-cols-3"}`}
            >
              {Array(isAdmin ? 4 : 3)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-24" />
                ))}
            </div>
          ) : (
            stats && (
              <div
                className={`grid gap-4 ${isAdmin ? "grid-cols-4" : "grid-cols-3"}`}
              >
                <StatCard
                  label="Products"
                  value={stats.totalProducts}
                  icon={FiPackage}
                  sub="in your catalog"
                  href="/dashboard/products"
                />
                <StatCard
                  label="Orders"
                  value={stats.totalOrders}
                  icon={FiShoppingBag}
                  sub="placed so far"
                  href="/dashboard/orders"
                />
                <StatCard
                  label="Low stock"
                  value={stats.lowStock}
                  icon={FiAlertTriangle}
                  sub="products at or below 5 units"
                  href="/dashboard/products"
                  warn
                />
                {isAdmin && (
                  <StatCard
                    label="Users"
                    value={stats.totalUsers}
                    icon={FiUsers}
                    sub="registered accounts"
                    href="/dashboard/users"
                  />
                )}
              </div>
            )
          )}
        </div>

        <div
          className={`grid gap-4 flex-1 min-h-0 ${isAdmin ? "grid-cols-6" : "grid-cols-1"}`}
        >
          <div className="lg:col-span-3 bg-white border border-gray-100 rounded-xl p-4 flex flex-col min-h-0">
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
                <div className="flex-1 overflow-y-auto overflow-x-hidden divide-y divide-gray-50 min-h-0 custom-scroll">
                  {recentOrders.map((order) => {
                    return (
                      <div
                        key={order._id}
                        className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] gap-3 items-center py-2 hover:bg-gray-150 rounded-lg px-1 transition-colors"
                      >
                        <span className="text-gray-900 text-xs font-mono font-medium">
                          #{order._id.slice(-8).toUpperCase()}
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

          <div className="lg:col-span-3 bg-white border border-gray-100 rounded-xl p-4 flex flex-col min-h-0">
            <SectionHeader
              title="Products"
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
            ) : topProducts.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <Empty message="No products yet" />
              </div>
            ) : (
              <div className="flex flex-col min-h-0 flex-1">
                <div className="grid grid-cols-[1fr_auto] gap-3 pb-2 border-b border-gray-50 shrink-0">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    Name
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    Stock
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto overflow-x-hidden divide-y divide-gray-50 min-h-0 pr-3 custom-scroll">
                  {topProducts.map((product, i) => (
                    <div
                      key={product._id}
                      className="flex items-center gap-3 py-2 hover:bg-gray-150 -mx-2 px-2 rounded-lg transition-colors"
                    >
                      <span className="text-gray-500 text-[11px] font-mono w-3 shrink-0">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 text-xs font-medium truncate">
                          {product.name}
                        </p>
                        <p className="text-gray-400 text-[11px]">
                          ${product.price}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
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
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {isAdmin && (
          <div className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col flex-1 min-h-0">
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
                <div className="flex-1 overflow-y-auto overflow-x-hidden divide-y divide-gray-50 min-h-0 custom-scroll">
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
        )}
      </div>
    </div>
  );
}
