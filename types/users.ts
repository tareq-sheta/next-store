// types/users.ts

// import { UserRole } from "@/lib/rbac/roles";

// export type UserRole = "admin" | "seller" | "customer";
const ROLES = ["admin", "seller", "customer"] as const;
/** The allowed user roles in the system */
export type UserRole = (typeof ROLES)[number];
/** Supported authentication providers */
export type AuthProvider = "credentials" | "google" | "github";

/**
 * Data Transfer Object for a user's address.
 */
export interface AddressDTO {
  _id?: string;
  title: string;
  fullAddress: string;
  phone: string;
  label?: string;
}
/**
 * Represents the currently authenticated user in the frontend (e.g., in Zustand or NextAuth session).
 */
export type CurrentUser = {
  id: string;
  name?: string | null;
  role: UserRole;
  email?: string | null;
  image?: string | null;
  selectedAddressIndex?: number;
  addresses?: AddressDTO[];
};
/**
 * Data Transfer Object for a user, returned by API endpoints.
 * Safe to send to the client (password omitted).
 */
export interface UserDTO {
  _id: string;
  userName: string;
  email: string;
  role: UserRole;
  image?: string;
  provider: AuthProvider;
  selectedAddressIndex?: number;
  addresses?: AddressDTO[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Input type for creating a new user via API.
 */
export interface CreateUserInput {
  userName: string;
  email: string;
  password: string;
  role?: UserRole;
  image?: string;
  provider?: AuthProvider;
  addresses?: AddressDTO[];
}

/**
 * Input type for updating a user via API.
 */
export interface UpdateUserInput {
  id?: string;
  _id?: string;
  provider?: AuthProvider;
  createdAt?: string;
  updatedAt?: string;
  userName?: string;
  email?: string;
  image?: string;
  role?: UserRole;
  addresses?: AddressDTO[];
  selectedAddressIndex?: number;
}

/**
 * Minimal user data stored in the NextAuth session.
 */
export interface SessionUser {
  _id: string;
  userName: string;
  email: string;
  role: UserRole;
  image?: string;
}
