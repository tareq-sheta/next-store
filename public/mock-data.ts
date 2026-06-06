import { hashSync } from "bcryptjs";
import type { UserRole } from "@/types/users";

export interface MockUserRecord {
  id: number;
  userName: string;
  role: UserRole;
  email: string;
  password: string;
}

export const users: MockUserRecord[] = [
  {
    id: 1,
    userName: "Admin",
    role: "admin",
    email: "admin@example.com",
    password: hashSync("admin@123", 10),
  },
  {
    id: 2,
    userName: "Hamada",
    role: "seller",
    email: "hamada@example.com",
    password: hashSync("hamada@123", 10),
  },
  {
    id: 3,
    userName: "Ali",
    role: "customer",
    email: "ali@example.com",
    password: hashSync("ali@123", 10),
  },
];
