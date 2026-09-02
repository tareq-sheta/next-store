// import {
//   UserDTO,
//   CreateUserInput,
//   UpdateUserInput,
// } from "@/types/users";
// import type { User } from "@/types";

// const BASE = "/api/users";

// async function handleResponse<T>(res: Response): Promise<T> {
//   const json = await res.json();
//   if (!res.ok) {
//     throw new Error(json.error ?? "Request failed");
//   }
//   return json.data;
// }

// function toLegacyUser(user: UserDTO): User {
//   return { ...user, id: user._id };
// }

// export async function fetchAllUsers(): Promise<UserDTO[]> {
//   const res = await fetch(BASE);
//   return handleResponse<UserDTO[]>(res);
// }

// export async function fetchUserById(id: string): Promise<UserDTO> {
//   const res = await fetch(`${BASE}/${id}`);
//   return handleResponse<UserDTO>(res);
// }

// export async function createUser(data: CreateUserInput): Promise<UserDTO> {
//   const res = await fetch(BASE, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });
//   return handleResponse<UserDTO>(res);
// }

// export async function updateUser(
//   id: string,
//   data: UpdateUserInput,
// ): Promise<UserDTO>;
// export async function updateUser(
//   data: User & { selectedAddressIndex?: number },
// ): Promise<User>;
// export async function updateUser(
//   idOrData: string | (User & { selectedAddressIndex?: number }),
//   data?: UpdateUserInput,
// ): Promise<UserDTO | User> {
//   if (typeof idOrData === "string") {
//     const res = await fetch(`${BASE}/${idOrData}`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(data),
//     });
//     return handleResponse<UserDTO>(res);
//   }

//   const { _id, selectedAddressIndex: _selected, id: _idLegacy, ...fields } =
//     idOrData;
//   const userId = _id ?? _idLegacy;
//   const res = await fetch(`${BASE}/${userId}`, {
//     method: "PATCH",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       userName: fields.userName,
//       email: fields.email,
//       image: fields.image,
//       role: fields.role,
//       addresses: fields.addresses,
//     }),
//   });
//   const updated = await handleResponse<UserDTO>(res);
//   return { ...updated, id: updated._id, selectedAddressIndex: idOrData.selectedAddressIndex };
// }

// export async function deleteUser(id: string): Promise<void> {
//   const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
//   if (!res.ok) {
//     const json = await res.json();
//     throw new Error(json.error ?? "Failed to delete user");
//   }
// }

// export async function updateUserPassword(
//   userId: string | number,
//   currentPassword: string,
//   newPassword: string,
// ): Promise<{ success: boolean; error?: string }> {
//   const res = await fetch(`${BASE}/${userId}`, {
//     method: "PATCH",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ currentPassword, newPassword }),
//   });
//   const json = await res.json();
//   if (!res.ok) {
//     return { success: false, error: json.error ?? "Failed to update password" };
//   }
//   return { success: true };
// }

// export async function login(
//   email: string,
//   password: string,
// ): Promise<
//   { success: true; data: User } | { success: false; error: string }
// > {
//   const res = await fetch("/api/auth/login", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email, password }),
//   });
//   const json = await res.json();
//   if (!res.ok || !json.success) {
//     return { success: false, error: json.error ?? "Login failed" };
//   }
//   const user = json.data as UserDTO;
//   return { success: true, data: toLegacyUser(user) };
// }

// export async function register(
//   email: string,
//   password: string,
//   userName?: string,
// ): Promise<
//   { success: true; data: User } | { success: false; error: string }
// > {
//   const res = await fetch(BASE, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       email,
//       password,
//       userName: userName ?? email.split("@")[0],
//       role: "customer",
//     }),
//   });
//   const json = await res.json();
//   if (!res.ok || !json.success) {
//     return { success: false, error: json.error ?? "Registration failed" };
//   }
//   const user = json.data as UserDTO;
//   return { success: true, data: toLegacyUser(user) };
// }
//------------------
//------------------
//------------------
// import { UserDTO, UpdateUserInput, UserRole } from "@/types/users";
import { usersModel } from "@/models/users";
import { UpdateUserInput, UserDTO, UserRole } from "@/types";
import { apiFetch, ApiResponse } from "@/utils/general";
import { signIn } from "next-auth/react";
import connectToDatabase from "../database";

const BASE = "/api/users";
//-------------------
// export async function fetchAllUsers(): Promise<ApiResponse<UserDTO[]>> {
//   const res = await fetch("/api/admin/users");
//   const response = await handleResponse<UserDTO[]>(res);
//   if (!response.success) {
//     throw new Error(response.error ?? "Failed to fetch users");
//   }
//   return response;
// }

// import connectToDatabase from "@/lib/database";
// import { usersModel } from "@/models/users";
// import { ApiResponse, UserDTO } from "@/types"; // Adjust path to match your structure

// 1. SECURITY: Restrict allowed search fields to prevent injection

export const fetchAllUsers = (): Promise<ApiResponse<UserDTO[]>> =>
  apiFetch<UserDTO[]>("/api/admin/users");
//-------------------

// export async function fetchUserById(
//   id: string,
// ): Promise<ApiResponse<UserDTO> | null> {
//   const res = await fetch(`${BASE}/${id}`);
//   const response = await handleResponse<UserDTO>(res);
//   if (!response.success) {
//     throw new Error(response.error ?? "Failed to fetch user");
//   }
//   return response;
// }

// export async function fetchUserById(
//   id: string,
// ): Promise<ApiResponse<UserDTO> | null> {
//   const res = await fetch(`${BASE}/${id}`);
//   const response = await handleResponse<UserDTO>(res);
//   if (!response.success) {
//     throw new Error(response.error ?? "Failed to fetch user");
//   }
//   return response;
// }

export const fetchUserById = (id: string): Promise<ApiResponse<UserDTO>> =>
  apiFetch<UserDTO>(`${BASE}/${id}`);

//-------------------
// export async function updateUser(
//   id: string,
//   data: UpdateUserInput,
// ): Promise<ApiResponse<UserDTO> | null> {
//   const res = await fetch(`${BASE}/${id}`, {
//     method: "PATCH",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });
//   const response = await handleResponse<UserDTO>(res);
//   if (!response.success) {
//     throw new Error(response.error ?? "Failed to update user");
//   }
//   return response;
// }
//---------------
// export const updateUser = async (
//   // id: string,
//   data: UpdateUserInput,
// ): Promise<ApiResponse<UserDTO>> =>
//   await apiFetch<UserDTO>(`${BASE}/${data.id || data._id}`, {
//     method: "PATCH",
//     body: JSON.stringify(data),
//   });

export const updateUser = async (
  data: UpdateUserInput,
): Promise<ApiResponse<UserDTO>> => {
  const { id, _id, ...updatePayload } = data as any;
  const targetId = id || _id;

  return await apiFetch<UserDTO>(`/api/users/${targetId}`, {
    method: "PATCH",
    body: JSON.stringify(updatePayload),
  });
};
//-------------------

// export async function deleteUser(id: string): Promise<ApiResponse<void>> {
//   const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
//   const response = await handleResponse<void>(res);
//   if (!response.success) {
//     throw new Error(response.error ?? "Failed to delete user");
//   }
// return response;
// }

export const deleteUser = async (id: string): Promise<ApiResponse<void>> =>
  await apiFetch<void>(`${BASE}/${id}`, {
    method: "DELETE",
  });

//-------------------
// export async function updateUserPassword(
//   userId: string,
//   currentPassword: string,
//   newPassword: string,
// ): Promise<{ success: boolean; error?: string }> {
//   const res = await fetch(`${BASE}/${userId}`, {
//     method: "PATCH",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ currentPassword, newPassword }),
//   });
//   const response = await handleResponse<{ success: boolean; error?: string }>(
//     res,
//   );
//   if (!response.success) {
//     return {
//       success: false,
//       error: response.error ?? "Failed to update password",
//     };
//   }
//   return { success: true };
// }
export const updateUserPassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<{ success: boolean; error?: string }> =>
  await apiFetch<{ success: boolean; error?: string }>(`${BASE}/${userId}`, {
    method: "PATCH",
    body: JSON.stringify({ currentPassword, newPassword }),
  });

//-------------------

export async function login(email: string, password: string) {
  const result = await signIn("credentials", {
    email,
    password,
    redirect: false,
  });
  if (result?.error) {
    return { success: false, data: null, error: "Invalid credentials" };
  }
  return { success: true, data: null };
}

// export async function register(data: {
//   userName: string;
//   email: string;
//   password: string;
//   // role: "customer" | "seller";
// }) {
//   const res = await fetch("/api/auth/register", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });
//   return res.json();
// }
export async function register(data: {
  userName: string;
  email: string;
  password: string;
  role: Exclude<UserRole, "admin">;
}) {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
// export const login = (email: string, password: string) =>
//   apiFetch("/api/auth/login", {
//     method: "POST",
//     body: JSON.stringify({ email, password }),
//   });

//-------------------

// register()/createUser() were removed from this file — they called
// POST /api/users, a route that doesn't exist (only /api/users/[id] and
// /api/admin/users do), and register() also depended on fetchAllUsers(),
// which now requires an admin session — meaning it 403'd before an
// anonymous registrant could ever reach the (also broken) POST call.
// Registration has exactly one correct implementation: handlers/users.ts's
// register(), which posts to /api/auth/register — that route already
// handles the duplicate-email check server-side.
