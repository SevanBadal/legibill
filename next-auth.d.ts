import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: number;
    } & DefaultSession["user"];
  }

  interface User {
    id: number;
    email: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    email: string;
  }
}
