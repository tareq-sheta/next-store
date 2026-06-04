import type { UserRole } from "@/types/users";
import type { User } from "@/types";
import bcrypt, { genSaltSync } from "bcryptjs";
import { users as usersData, MockUserRecord } from "@/public/mock-data";
// import { delay } from "@/utils/general";

export interface LoginResult {
  success: boolean;
  user?: User;
  error?: string;
}
export interface RegisterResult {
  success: boolean;
  user?: User;
  error?: string;
}
export interface RegisterData {
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  password: string;
}

let nextId = 4;
let usersDb: MockUserRecord[] = [...usersData];

export const isPasswordMatch = (password: string, hash: string) => {
  return bcrypt.compareSync(password, hash);
};
export const hashPassword = (password: string) => {
  const salt = genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

function toLegacyUser(record: MockUserRecord): User {
  return {
    _id: String(record.id),
    id: String(record.id),
    userName: record.userName,
    email: record.email,
    role: record.role,
    provider: "credentials",
    createdAt: "",
    updatedAt: "",
  };
}

export async function loginUser(
  email: string,
  password: string,
): Promise<LoginResult> {
  // await delay();
  const user = usersDb.find(
    (u) => u.email.toLowerCase() === email.toLowerCase(),
  );
  if (!user)
    return { success: false, error: "No account found with that email." };

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return { success: false, error: "Incorrect password." };
  }

  return { success: true, user: toLegacyUser(user) };
}

export async function registerUser(
  data: RegisterData,
): Promise<RegisterResult> {
  // await delay();
  const existing = usersDb.find(
    (u) => u.email.toLowerCase() === data.email.toLowerCase(),
  );
  if (existing) {
    return {
      success: false,
      error: "An account with this email already exists.",
    };
  }

  const hashed = hashPassword(data.password);
  const newUser: MockUserRecord = {
    id: nextId++,
    userName: data.name,
    email: data.email,
    role: data.role,
    password: hashed,
  };
  usersDb.push(newUser);

  return { success: true, user: toLegacyUser(newUser) };
}
