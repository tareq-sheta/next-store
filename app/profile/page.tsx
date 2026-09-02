"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// import { useAuthStore } from "@/lib/store";
import { updateUser, updateUserPassword } from "@/lib/api/users";
import { signOut, useSession } from "next-auth/react";
import { CurrentUser } from "@/types";

export default function ProfilePage() {
  const router = useRouter();

  // 1. Properly pull session and status
  const { data: session, status, update: updateSession } = useSession();
  const user = session?.user as CurrentUser | undefined;
  console.log(session);
  // 2. Restore the logout function from Zustand
  // const logout = useAuthStore((state) => state.logout);

  // 3. Form State (Initialized to empty, updated when session loads)
  const [activeTab, setActiveTab] = useState<"info" | "password">("info");
  const [userName, setUserName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 4. Safely handle redirects and state initialization using useEffect
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && user) {
      setUserName(user.name || "");
      setEmail(user.email || "");
    }
  }, [status, user, router]);

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setError("");
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!userName.trim()) {
      setError("User name is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Invalid email");
      return;
    }

    setLoading(true);
    try {
      // NOTE: We are constructing the payload from individual state variables now.
      const response = await updateUser({
        _id: user.id, // Assuming your API needs the ID to know who to update
        userName: userName.trim(),
        email: email.trim(),
      });

      if (!response.success || !response.data) {
        setError(response.error || "Failed to update profile");
        return;
      }
      await updateSession({
        ...session,
        user: {
          ...session?.user,
          name: userName.trim(),
          email: email.trim(),
        },
      });
      showSuccess("Profile updated successfully!");
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,16}$/;
    if (!pwdRegex.test(newPwd)) {
      setError(
        "Password must be 8-16 chars with uppercase, lowercase, number, and special char",
      );
      return;
    }
    if (newPwd !== confirmPwd) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const result = await updateUserPassword(
        user.id, // Ensure your session token includes the user ID
        currentPwd,
        newPwd,
      );
      if (!result.success) {
        setError(result.error ?? "Failed to update password");
        return;
      }
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
      showSuccess("Password updated successfully!");
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Prevent rendering the form before the session is verified
  if (status === "loading" || !user) return null;

  return (
    <div className="container mx-auto px-4 py-12 max-w-lg">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
        Edit Profile
      </h1>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
          ✅ {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8">
        {(["info", "password"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setError("");
              setSuccess("");
            }}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab === "info" ? "Profile Info" : "Change Password"}
          </button>
        ))}
      </div>

      {activeTab === "info" && (
        <form onSubmit={handleInfoSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User Name
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm hover:bg-gray-150 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Info"}
            </button>
          </div>
        </form>
      )}

      {activeTab === "password" && (
        <form onSubmit={handlePasswordSubmit} className="space-y-5">
          {[
            {
              label: "Current Password",
              value: currentPwd,
              setter: setCurrentPwd,
            },
            { label: "New Password", value: newPwd, setter: setNewPwd },
            {
              label: "Confirm New Password",
              value: confirmPwd,
              setter: setConfirmPwd,
            },
          ].map(({ label, value, setter }) => (
            <div key={label}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              <input
                type="password"
                value={value}
                onChange={(e) => setter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                required
              />
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm hover:bg-gray-150 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-yellow-500 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors disabled:opacity-60"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      )}

      <div className="flex justify-center items-center mt-8 py-2.5 border border-red-500 rounded-lg text-center bg-red-50">
        <button
          onClick={async () => {
            await signOut();
            router.push("/");
          }}
          className="text-sm text-red-500 hover:text-red-700 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
