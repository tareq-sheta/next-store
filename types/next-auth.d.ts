import { DefaultSession } from "next-auth";
import "next-auth/jwt";

// 1. Extend the default Session and User interfaces
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    role?: string;
  }
}

// 2. Extend the default JWT interface
declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}
