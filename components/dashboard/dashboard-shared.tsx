// Shared utility components and helpers used across all dashboard pages

import { useState } from "react";
import { FiRefreshCcw, FiRefreshCw } from "react-icons/fi";

export function Skeleton({ className }: { className: string }) {
  return (
    <div className={`animate-pulse bg-gray-100 rounded-lg ${className}`} />
  );
}
// export function PageHeader({
//   title,
//   subtitle,
//   action,
// }: {
//   title: string;
//   subtitle: string;
//   action?: React.ReactNode;
// }) {
//   return (
//     <div className="flex items-center justify-between mb-6">
//       <div>
//         <h2 className="text-gray-900 text-xl font-semibold tracking-tight">
//           {title}
//         </h2>
//         <p className="text-gray-400 text-sm mt-0.5">{subtitle}</p>
//       </div>
//       {action}
//     </div>
//   );
// }

// components/dashboard/DashboardPageHeader.tsx
// "use client";

// import { FiRefreshCw } from "react-icons/fi";
// import { timeAgo } from "@/components/dashboard/dashboard-shared";

interface DashboardPageHeaderProps {
  title: string;
  subtitle?: string;
  lastUpdated?: Date | null;
  loading?: boolean;
  onRefresh?: () => void;
}

export function DashboardPageHeader({
  title,
  subtitle,
  // lastUpdated,
  loading = false,
  onRefresh,
}: DashboardPageHeaderProps) {
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
      setLastUpdated(new Date());
    }
  };
  return (
    <div className="flex items-center justify-between bg-white border-b border-gray-100 py-3 px-8 shrink-0">
      <div>
        <h1 className="text-gray-900 font-semibold text-base">{title}</h1>
        {subtitle && <p className="text-gray-400 text-xs mt-0.5">{subtitle}</p>}
      </div>
      {onRefresh && (
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-gray-300 text-[11px]">
              Updated {timeAgo(lastUpdated.toISOString())}
            </span>
          )}
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-1.5 text-[12px] font-medium text-gray-500 border border-gray-200 bg-white px-3 py-1.5 rounded-lg hover:bg-gray-150 transition-colors disabled:opacity-40"
          >
            <FiRefreshCcw size={12} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      )}
    </div>
  );
}
// export function PageHeader({
//   title,
//   subtitle,
//   action,
// }: {
//   title: string;
//   subtitle: string;
//   action?: React.ReactNode;
// }) {
//   return (
//     <div className="flex items-center justify-between mb-6">
//       <div>
//         <h2 className="text-gray-900 text-xl font-semibold tracking-tight">
//           {title}
//         </h2>
//         <p className="text-gray-400 text-sm mt-0.5">{subtitle}</p>
//       </div>
//       {action}
//     </div>
//   );
// }

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-14 text-gray-300 text-sm">{message}</div>
  );
}

export function statusBadge(status: string) {
  switch (status) {
    case "shipped":
      return "bg-blue-50 text-blue-600 border-blue-100";
    case "delivered":
      return "bg-green-50 text-green-600 border-green-100";
    case "cancelled":
      return "bg-red-50 text-red-500 border-red-100";
    case "pending":
      return "bg-amber-50 text-amber-600 border-amber-100";
    default:
      return "bg-gray-150 text-gray-500 border-gray-100";
  }
}

export function roleBadge(role: string) {
  switch (role) {
    case "admin":
      return "bg-gray-900 text-white border-gray-900";
    case "seller":
      return "bg-gray-100 text-gray-700 border-gray-200";
    default:
      return "bg-gray-150 text-gray-400 border-gray-100";
  }
}

export function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
