import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectToDatabase from "@/lib/database";
import { usersModel } from "@/models/users";
import bcrypt from "bcryptjs";
 
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
 
        await connectToDatabase();
 
        const user = await usersModel
          .findOne({ email: credentials.email.toLowerCase() })
          .select("+password")
          .lean();
 
        if (!user || !user.password) return null;
 
        const isMatch = await bcrypt.compare(credentials.password, user.password);
        if (!isMatch) return null;
 
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.userName,
          role: user.role,
          image: user.image ?? null,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string; role?: string }).id = token.id as string;
        (session.user as { id?: string; role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};