import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import Facebook from "next-auth/providers/facebook";
import { cookies } from "next/headers";

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
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/user/logInWithEmailPassword`,
            {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials?.email,
                password: credentials?.password,
              }),
            }
          );

          if (!res.ok) {
            throw new Error("Invalid email or password");
          }

          const { user: currentUser, token } = await res.json();

          // Set the refresh token cookie
          (await cookies()).set("refreshToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
          });

          return {
            id: currentUser._id, // Include _id as id in the session
            name: currentUser.name,
            email: currentUser.email,
          };
        } catch (error) {
          console.error("Authorize error:", error);
          throw new Error("Invalid credentials");
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // If user exists, it's the initial login
      if (user) {
        token.id = user.id; // Attach user id to the token
      }
      return token;
    },

    async session({ session, token }) {
      // Add id from token to session object
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },

    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/user/create`,
            {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: user.name,
                email: user.email,
                image: user.image,
                provider: "google",
              }),
            }
          );

          if (!res.ok) {
            throw new Error("Google login failed");
          }

          const { token, user: currentUser } = await res.json();

          // Set the refresh token cookie
          (await cookies()).set("refreshToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
          });

          // Store user id in token for session
          user.id = currentUser._id;

          // Set a cookie flag for Google login
          (await cookies()).set("googleLogin", "true", {
            path: "/",
          });
        } catch (error) {
          console.error("Google Login Error:", error);
          return false;
        }
      }
      return true; // Proceed with login
    },
  },

  secret: process.env.NEXT_AUTH_SECRET,
};
