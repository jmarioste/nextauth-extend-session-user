import { NextApiRequest, NextApiResponse } from "next";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import { InMemoryUserService } from "services/UserService";

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error(
    "please provide process.env.NEXTAUTH_SECRET environment variable"
  );
}

export default async function hanlder(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return await NextAuth(req, res, {
    providers: [
      //TODO: Create signIn mutation
      CredentialsProvider({
        name: "Credentials",
        id: "credentials",
        credentials: {
          email: { label: "Email", type: "text" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          if (!credentials) {
            throw new Error("No credentials.");
          }
          const { email, password } = credentials;
          const userService = new InMemoryUserService();
          return userService.signInCredentials(email, password);
        },
      }),
    ],

    pages: {
      signIn: "/signin",
    },
    callbacks: {
      async jwt({ token, user }) {
        /* Step 1: update the token based on the user object */
        if (user) {
          token.role = user.role;
          token.subscribed = user.subscribed;
        }
        return token;
      },
      session({ session, token }) {
        /* Step 2: update the session.user based on the token object */
        if (token && session.user) {
          session.user.role = token.role;
          session.user.subscribed = token.subscribed;
        }
        return session;
      },
    },
  });
}
