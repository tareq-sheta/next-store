import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectToDatabase from "@/lib/database";
import { usersModel } from "@/models/users";
import bcrypt from "bcryptjs";
// import { UserRole } from "@/types";
import { Types } from "mongoose";
import { UserRole } from "./rbac/roles";
import { AddressDTO } from "@/types";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        //these are the email and password from the user
        if (!credentials?.email || !credentials?.password) return null;

        await connectToDatabase();

        // const user = await usersModel
        //   .findOne({ email: credentials.email.toLowerCase() })
        //   .select("+password")
        //   .lean();
        const user = await usersModel
          .findOne({ email: credentials.email.toLowerCase() })
          .select("+password")
          .lean<{
            _id: Types.ObjectId;
            email: string;
            userName: string;
            role: UserRole;
            image?: string;
            password?: string;
            // addresses?: AddressDTO[];
            // selectedAddressIndex?: number;
          }>();

        if (!user || !user.password) return null;

        const isMatch = await bcrypt.compare(
          credentials.password,
          user.password,
        );
        if (!isMatch) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.userName,
          role: user.role,
          image: user.image ?? null,
          // addresses: user.addresses,
          // selectedAddressIndex: user.selectedAddressIndex,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  // callbacks: {
  //   async jwt({ token, user, trigger, session }) {
  //     if (user) {
  //       token.id = user.id;
  //       token.role = user.role as UserRole;
  //     }
  //     if (trigger === "update" && session) {
  //       // 2. Merge the new data into the token
  //       token.name = session.user.name;
  //       token.email = session.user.email;
  //     }
  //     return token;
  //   },

  //   async session({ session, token }) {
  //     session.user.id = token.id ?? "";
  //     session.user.role = token.role ?? "customer";
  //     return session;
  //   },
  // },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // 1. Initial Sign-In: Attach ID and Role from the database
      if (user) {
        token.id = user.id;
        token.role = user.role as UserRole;
      }

      // 2. Profile Update: Merge new data from frontend into the token
      if (trigger === "update" && session?.user) {
        token.name = session.user.name;
        token.email = session.user.email;
      }

      return token;
    },

    async session({ session, token }) {
      // 3. Pass custom fields to the frontend
      session.user.id = token.id as string;
      session.user.role = token.role as UserRole;

      // 4. EXPLICITLY pass the updated standard fields to the frontend!
      if (token.name) session.user.name = token.name;
      if (token.email) session.user.email = token.email;

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
