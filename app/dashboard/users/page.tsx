"use client";

import { useEffect, useState, useCallback } from "react";
import { FiSearch, FiUserPlus, FiTrash2, FiEdit, FiX } from "react-icons/fi";
import type { UserDTO, UpdateUserInput, CurrentUser } from "@/types/users";
import {
  Skeleton,
  EmptyState,
  roleBadge,
  timeAgo,
  DashboardPageHeader,
} from "@/components/dashboard/dashboard-shared";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

// ─── Modal ────────────────────────────────────────────────────────────────────

function UserModal({
  user,
  onClose,
  onSave,
}: {
  user: UserDTO | null;
  onClose: () => void;
  onSave: (id: string | null, data: UpdateUserInput) => Promise<void>;
}) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    userName: user?.userName ?? "",
    email: user?.email ?? "",
    role: user?.role ?? "customer",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave(user?._id ?? null, form);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-gray-100 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
          <h3 className="text-gray-900 font-semibold text-base">
            {user ? "Edit User" : "Add User"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FiX size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-500 text-xs uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <input
              required
              value={form.userName}
              onChange={(e) => setForm({ ...form, userName: e.target.value })}
              placeholder="John Doe"
              className="w-full bg-gray-150 border border-gray-100 rounded-lg px-3 py-2.5 text-gray-900 text-sm outline-none focus:border-gray-400 transition-colors"
            />
          </div>
          <div>
            <label className="block text-gray-500 text-xs uppercase tracking-wider mb-1.5">
              Email
            </label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="user@example.com"
              className="w-full bg-gray-150 border border-gray-100 rounded-lg px-3 py-2.5 text-gray-900 text-sm outline-none focus:border-gray-400 transition-colors"
            />
          </div>
          <div>
            <label className="block text-gray-500 text-xs uppercase tracking-wider mb-1.5">
              Role
            </label>
            <select
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value as UserDTO["role"] })
              }
              className="w-full bg-gray-150 border border-gray-100 rounded-lg px-3 py-2.5 text-gray-900 text-sm outline-none focus:border-gray-400 transition-colors"
            >
              <option value="customer">Customer</option>
              <option value="seller">Seller</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl bg-gray-900 text-white border  hover:bg-white hover:border hover:border-gray-900   hover:text-gray-900 text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {saving ? "Saving…" : user ? "Save Changes" : "Add User"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-gray-900 text-white border  hover:bg-white hover:border hover:border-gray-900   hover:text-gray-900 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function UsersPage() {
  // const currentUser = useAuthStore((s) => s.currentUser);
  const { data: session, status } = useSession();
  const currentUser = session?.user as CurrentUser | undefined;
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [modalUser, setModalUser] = useState<UserDTO | null | undefined>(
    undefined,
  ); // undefined = closed
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      const json = await res.json();
      if (json.success) setUsers(json.data);
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setUsers((prev) => prev.filter((u) => u._id !== id));
        toast.warning("User deleted");
      } else {
        toast.error(json.error ?? "Failed to delete");
      }
    } finally {
      setDeletingId(null);
    }
  };

  const handleSave = async (id: string | null, data: UpdateUserInput) => {
    if (id) {
      const res = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        setUsers((prev) => prev.map((u) => (u._id === id ? json.data : u)));
        toast.success("User updated");
      } else {
        toast.error(json.error ?? "Failed to update");
      }
    } else {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, password: "Temp@1234" }),
      });
      const json = await res.json();
      if (json.success) {
        setUsers((prev) => [json.data, ...prev]);
        toast.success("User added");
      } else {
        toast.error(json.error ?? "Failed to add");
      }
    }
    setModalUser(undefined);
  };

  const filtered = users.filter(
    (u) =>
      u.userName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {modalUser !== undefined && (
        <UserModal
          user={modalUser}
          onClose={() => setModalUser(undefined)}
          onSave={handleSave}
        />
      )}

      {/* Header — fixed */}
      <DashboardPageHeader
        title="Users"
        subtitle="Add, edit or remove user accounts"
        lastUpdated={lastUpdated}
        loading={loading}
        onRefresh={loadUsers}
      />

      {/* Content — fills remaining height */}
      <div className="flex flex-col flex-1 px-8 py-6 gap-5 min-h-0 overflow-hidden">
        {/* Search + Add User — fixed height */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative flex-1">
            <FiSearch
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email…"
              className="w-full bg-white border border-gray-100 rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder:text-gray-300 outline-none focus:border-gray-400 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
              >
                <FiX size={14} />
              </button>
            )}
          </div>
          <button
            onClick={() => setModalUser(null)}
            className="flex items-center gap-2 bg-gray-900 text-white border hover:bg-white hover:border hover:border-gray-900 hover:text-gray-900 text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shrink-0"
          >
            <FiUserPlus size={14} /> Add User
          </button>
        </div>

        {/* Table — grows and scrolls internally */}
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
                search ? `No users matching "${search}"` : "No users yet"
              }
            />
          ) : (
            <>
              {/* Scrollable table body */}
              {/* 1. Outer wrapper handles horizontal overflow (X) if screens drop below min-w-187.5.
  2. Uses flex column styles with min-h-0 to propagate rigid height down to rows without Y-scroll bugs.
*/}
              <div className="flex-1 overflow-x-auto min-h-0 flex flex-col">
                {/* Flexbox Table Wrapper */}
                <div className="w-full min-w-187.5 text-sm flex flex-col flex-1 min-h-0">
                  {/* Flexbox Header — Fixed and unscrollable */}
                  <div className="flex items-center border-b border-gray-100 text-[11px] uppercase tracking-wider text-gray-300 font-medium px-4 py-3 shrink-0 bg-white">
                    <div className="w-[6%] text-left">#</div>
                    <div className="w-[34%] text-left">User</div>
                    <div className="w-[25%] text-left">Email</div>
                    <div className="w-[15%] text-left">Role</div>
                    <div className="w-[12%] text-left">Joined</div>
                    <div className="w-[8%] text-right"></div>
                  </div>

                  {/* Flexbox Body Matrix — Handles vertical scroll (Y) internally */}
                  <div className="flex flex-col flex-1 min-h-0 overflow-y-auto custom-scroll">
                    {filtered.map((user, i) => (
                      <div
                        key={user._id}
                        className="flex items-center border-b border-gray-50 hover:bg-gray-150 transition-colors group px-4 py-3"
                      >
                        {/* Row Index Column */}
                        <div className="w-[6%] text-gray-300 text-xs font-mono pr-2">
                          {i + 1}
                        </div>

                        {/* User Details Column */}
                        <div className="w-[34%] flex items-center gap-2.5 min-w-0 pr-4">
                          <div className="w-7 h-7 rounded-full bg-gray-800/10 border border-violet-500/20 flex items-center justify-center text-violet-300 text-xs font-semibold uppercase shrink-0">
                            {user.userName[0]}
                          </div>
                          <span className="text-gray-900 text-xs font-medium truncate">
                            {user.userName}
                          </span>
                          {user._id === currentUser?.id && (
                            <span className="text-[10px] text-violet-400/60 bg-gray-800/10 px-1.5 py-0.5 rounded shrink-0">
                              you
                            </span>
                          )}
                        </div>

                        {/* Email Column */}
                        <div className="w-[25%] text-gray-400 text-xs truncate pr-2">
                          {user.email}
                        </div>

                        {/* Role Badge Column */}
                        <div className="w-[15%] pr-2">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full border font-medium capitalize inline-block ${roleBadge(user.role)}`}
                          >
                            {user.role}
                          </span>
                        </div>

                        {/* Joined Column */}
                        <div className="w-[12%] text-gray-300 text-xs truncate pr-2">
                          {timeAgo(user.createdAt)}
                        </div>

                        {/* Actions Column */}
                        <div className="w-[8%] flex justify-end">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setModalUser(user)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-150 transition-colors"
                            >
                              <FiEdit size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(user._id)}
                              disabled={
                                deletingId === user._id ||
                                user._id === currentUser?.id
                              }
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-50 transition-colors disabled:opacity-30"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer — fixed at bottom of table card */}
              <div className="px-4 py-3 border-t border-gray-100 text-gray-300 text-xs shrink-0">
                {filtered.length} of {users.length} users
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  // return (
  //   <div className="flex-1 overflow-auto">
  //     {modalUser !== undefined && (
  //       <UserModal
  //         user={modalUser}
  //         onClose={() => setModalUser(undefined)}
  //         onSave={handleSave}
  //       />
  //     )}

  //     {/* <TopBar title="Manage Users" subtitle="Admin" /> */}

  //     <DashboardPageHeader
  //       title="Users"
  //       subtitle="Add, edit or remove user accounts"
  //       lastUpdated={lastUpdated}
  //       loading={loading}
  //       onRefresh={loadUsers}
  //     />
  //     <div className="px-8 py-6">
  //       {/* Search bar */}
  //       <div className="relative mb-5">
  //         <FiSearch
  //           size={14}
  //           className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300"
  //         />
  //         <input
  //           value={search}
  //           onChange={(e) => setSearch(e.target.value)}
  //           placeholder="Search by name or email…"
  //           className="w-full bg-white border border-gray-100 rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder:text-gray-300 outline-none focus:border-gray-400 transition-colors"
  //         />
  //         {search && (
  //           <button
  //             onClick={() => setSearch("")}
  //             className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
  //           >
  //             <FiX size={14} />
  //           </button>
  //         )}
  //       </div>

  //       {/* Table */}
  //       <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
  //         {loading ? (
  //           <div className="p-6 space-y-3">
  //             {Array(5)
  //               .fill(0)
  //               .map((_, i) => (
  //                 <Skeleton key={i} className="h-12" />
  //               ))}
  //           </div>
  //         ) : filtered.length === 0 ? (
  //           <EmptyState
  //             message={
  //               search ? `No users matching "${search}"` : "No users yet"
  //             }
  //           />
  //         ) : (
  //           <div className="overflow-x-auto">
  //             <table className="w-full text-sm">
  //               <thead>
  //                 <tr className="border-b border-gray-100">
  //                   {["#", "User", "Email", "Role", "Joined", ""].map((h) => (
  //                     <th
  //                       key={h}
  //                       className="text-left text-[11px] uppercase tracking-wider text-gray-300 px-4 py-3 font-medium"
  //                     >
  //                       {h}
  //                     </th>
  //                   ))}
  //                 </tr>
  //               </thead>
  //               <tbody>
  //                 {filtered.map((user, i) => (
  //                   <tr
  //                     key={user._id}
  //                     className="border-b border-gray-50 hover:bg-gray-150 transition-colors group"
  //                   >
  //                     <td className="px-4 py-3 text-gray-300 text-xs font-mono">
  //                       {i + 1}
  //                     </td>
  //                     <td className="px-4 py-3">
  //                       <div className="flex items-center gap-2.5">
  //                         <div className="w-7 h-7 rounded-full bg-gray-800/10 border border-violet-500/20 flex items-center justify-center text-violet-300 text-xs font-semibold uppercase shrink-0">
  //                           {user.userName[0]}
  //                         </div>
  //                         <span className="text-gray-900 text-xs font-medium">
  //                           {user.userName}
  //                         </span>
  //                         {user._id === currentUser?._id && (
  //                           <span className="text-[10px] text-violet-400/60 bg-gray-800/10 px-1.5 py-0.5 rounded">
  //                             you
  //                           </span>
  //                         )}
  //                       </div>
  //                     </td>
  //                     <td className="px-4 py-3 text-gray-400 text-xs">
  //                       {user.email}
  //                     </td>
  //                     <td className="px-4 py-3">
  //                       <span
  //                         className={`text-[10px] px-2 py-0.5 rounded-full border font-medium capitalize ${roleBadge(user.role)}`}
  //                       >
  //                         {user.role}
  //                       </span>
  //                     </td>
  //                     <td className="px-4 py-3 text-gray-300 text-xs">
  //                       {timeAgo(user.createdAt)}
  //                     </td>
  //                     <td className="px-4 py-3">
  //                       <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
  //                         <button
  //                           onClick={() => setModalUser(user)}
  //                           className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-150 transition-colors"
  //                         >
  //                           <FiEdit size={14} />
  //                         </button>
  //                         <button
  //                           onClick={() => handleDelete(user._id)}
  //                           disabled={
  //                             deletingId === user._id ||
  //                             user._id === currentUser?._id
  //                           }
  //                           className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-50 transition-colors disabled:opacity-30"
  //                         >
  //                           <FiTrash2 size={14} />
  //                         </button>
  //                       </div>
  //                     </td>
  //                   </tr>
  //                 ))}
  //               </tbody>
  //             </table>

  //             {/* Footer count */}
  //             <div className="px-4 py-3 border-t border-gray-100 text-gray-300 text-xs">
  //               {filtered.length} of {users.length} users
  //             </div>
  //           </div>
  //         )}
  //       </div>
  //     </div>
  //   </div>
  // );
}
