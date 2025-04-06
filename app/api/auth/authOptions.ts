import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import CredentialsProvider from "next-auth/providers/credentials";
import { apiUrl } from "@/app/shared/urls";
import Facebook from "next-auth/providers/facebook";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email:",
          type: "email",
          placeholder: "your-email@example.com",
        },
        password: {
          label: "Password:",
          type: "password",
          placeholder: "your-password",
        },
      },

      async authorize(credentials: any) {
        try {
          // Make a request to your backend API
          const res = await fetch(`${apiUrl}/user/logInWithEmailPassword`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });

          if (!res.ok) {
            throw new Error("Invalid email or password");
          }

          const { user } = await res.json();

          // Return the user object if successful
          return {
            id: user._id,
            name: user.name,
            email: user.email,
            isSeller: user.isSeller,
          };
        } catch (error) {
          console.error("Authorize error:", error);
          throw new Error("Invalid credentials");
        }
      },
    }),
  ],
  secret: process.env.NEXT_AUTH_SECRET,
};
