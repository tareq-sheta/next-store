import {
  UserDTO,
  CreateUserInput,
  UpdateUserInput,
} from "@/types/users";
import type { User } from "@/types";

const BASE = "/api/users";

async function handleResponse<T>(res: Response): Promise<T> {
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error ?? "Request failed");
  }
  return json.data;
}

function toLegacyUser(user: UserDTO): User {
  return { ...user, id: user._id };
}

export async function fetchAllUsers(): Promise<UserDTO[]> {
  const res = await fetch(BASE);
  return handleResponse<UserDTO[]>(res);
}

export async function fetchUserById(id: string): Promise<UserDTO> {
  const res = await fetch(`${BASE}/${id}`);
  return handleResponse<UserDTO>(res);
}

export async function createUser(data: CreateUserInput): Promise<UserDTO> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<UserDTO>(res);
}

export async function updateUser(
  id: string,
  data: UpdateUserInput,
): Promise<UserDTO>;
export async function updateUser(
  data: User & { selectedAddressIndex?: number },
): Promise<User>;
export async function updateUser(
  idOrData: string | (User & { selectedAddressIndex?: number }),
  data?: UpdateUserInput,
): Promise<UserDTO | User> {
  if (typeof idOrData === "string") {
    const res = await fetch(`${BASE}/${idOrData}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<UserDTO>(res);
  }

  const { _id, selectedAddressIndex: _selected, id: _idLegacy, ...fields } =
    idOrData;
  const userId = _id ?? _idLegacy;
  const res = await fetch(`${BASE}/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userName: fields.userName,
      email: fields.email,
      image: fields.image,
      role: fields.role,
      addresses: fields.addresses,
    }),
  });
  const updated = await handleResponse<UserDTO>(res);
  return { ...updated, id: updated._id, selectedAddressIndex: idOrData.selectedAddressIndex };
}

export async function deleteUser(id: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.error ?? "Failed to delete user");
  }
}

export async function updateUserPassword(
  userId: string | number,
  currentPassword: string,
  newPassword: string,
): Promise<{ success: boolean; error?: string }> {
  const res = await fetch(`${BASE}/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  const json = await res.json();
  if (!res.ok) {
    return { success: false, error: json.error ?? "Failed to update password" };
  }
  return { success: true };
}

export async function login(
  email: string,
  password: string,
): Promise<
  { success: true; data: User } | { success: false; error: string }
> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    return { success: false, error: json.error ?? "Login failed" };
  }
  const user = json.data as UserDTO;
  return { success: true, data: toLegacyUser(user) };
}

export async function register(
  email: string,
  password: string,
  userName?: string,
): Promise<
  { success: true; data: User } | { success: false; error: string }
> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      userName: userName ?? email.split("@")[0],
      role: "customer",
    }),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    return { success: false, error: json.error ?? "Registration failed" };
  }
  const user = json.data as UserDTO;
  return { success: true, data: toLegacyUser(user) };
}
