// types/users.ts

export type UserRole = "admin" | "seller" | "customer";
export type AuthProvider = "credentials" | "google" | "github";

// ─── Address ────────────────────────────────────────────────
export interface Address {
  _id?: string;
  title: string; // e.g. "Home", "Work"
  fullAddress: string;
  phone: string;
  label: string;
}

// ─── What the API returns (no password, string _id) ─────────
// This is what your components, Zustand, and React Query work with
export interface User {
  _id: string;
  userName: string;
  email: string;
  role: UserRole;
  phone?: string;
  image?: string;
  provider: AuthProvider;
  addresses?: Address[];
  createdAt: string; // serialized as string over HTTP, not Date
  updatedAt: string;
}

// ─── What you send when creating a user ─────────────────────
export interface CreateUserInput {
  userName: string;
  email: string;
  password: string; // plain text — only lives in this input type
  role: UserRole;
  phone?: string;
  image?: string;
  provider?: AuthProvider;
}

// ─── What you send when updating a user ─────────────────────
// Everything optional — only send what changed
export interface UpdateUserInput {
  userName?: string;
  email?: string;
  image?: string;
  role?: UserRole;
  phone?: string;
  addresses?: Address[];
}

// ─── What Zustand auth store holds ──────────────────────────
// Minimal — only what the UI needs globally
export interface SessionUser {
  _id: string;
  userName: string;
  email: string;
  role: UserRole;
  image?: string;
}
