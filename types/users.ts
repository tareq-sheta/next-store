// types/users.ts

export type UserRole = "admin" | "seller" | "customer";
export type AuthProvider = "credentials" | "google" | "github";

export interface AddressDTO {
  _id?: string;
  title: string;
  fullAddress: string;
  phone: string;
  label?: string;
}

export interface UserDTO {
  _id: string;
  userName: string;
  email: string;
  role: UserRole;
  image?: string;
  provider: AuthProvider;
  addresses?: AddressDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  userName: string;
  email: string;
  password: string;
  role?: UserRole;
  image?: string;
  provider?: AuthProvider;
  addresses?: AddressDTO[];
}

export interface UpdateUserInput {
  userName?: string;
  email?: string;
  image?: string;
  role?: UserRole;
  addresses?: AddressDTO[];
}

export interface SessionUser {
  _id: string;
  userName: string;
  email: string;
  role: UserRole;
  image?: string;
}
