import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import prisma from "@/app/prismaClient";
import { NextAuthOptions } from "next-auth";

const authOptions: NextAuthOptions = {
    session: {
      strategy: 'jwt'
    },
    pages: {
      signIn: "/login"
    },
    providers: [
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          email: {},
          password: {}
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }
  
          const user = await prisma.users.findUnique({
            where: {
              email: credentials.email
            }
          });
  
          if (user && await compare(credentials.password, user.password)) {
            return {
              id: user.id,
              email: user.email
            };
          }
          return null;
        }
      })
    ],
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.id = Number(user.id);
          token.email = user.email;
        }
        return token;
      },
      async session({ session, token }) {
        if (session.user) {
          session.user.id = token.id;
          session.user.email = token.email;
        }
        return session;
      }
    }
  };

  export default authOptions;