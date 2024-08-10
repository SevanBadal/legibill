import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handler = NextAuth({
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
            async authorize(credentials, request) {
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
                  id: user.id.toString(),
                  email: user.email
                };
              }
              // Return null if user data could not be retrieved
              return null
            }
          })
    ]
})

export { handler as GET, handler as POST }