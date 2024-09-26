import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import prisma from "@/app/prismaClient";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

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

        if (user && user.password && await compare(credentials.password, user.password)) {
          return {
            id: user.id,
            email: user.email
          };
        }
        return null;
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      async profile(profile) {
        // Use Google's profile information to create a user if it doesn't exist in the DB.
        const existingUser = await prisma.users.findUnique({
          where: { email: profile.email }
        });

        if (!existingUser) {
          // Create a new user in the database
          const newUser = await prisma.users.create({
            data: {
              email: profile.email
            }
          });
          return { id: newUser.id, email: newUser.email };
        }

        // Return existing user
        return { id: existingUser.id, email: existingUser.email };
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
    },

  }
};

export default authOptions;