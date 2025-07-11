import { NextAuthOptions, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import Facebook from "next-auth/providers/facebook";
import { req } from "@/app/shared/request";
import { cookies } from "next/headers";

// Extend the Session type to include the provider property
declare module "next-auth" {
  /** DB থেকে পাওয়া অতিরিক্ত ফিল্ড */
  interface User {
    dbUser?: {
      _id: string;
      name: string;
      email: string;
      image?: string;
      phone?: string;
      role?: string;
      authProvider?: string;
    };
  }

  interface Session {
    provider?: string;
    user: IUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    name?: string;
    email?: string;
    image?: string;
    phone?: string;
    role?: string;
    provider?: string;
  }
}

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
        name: { label: "Name", type: "text" },
        identifier: { label: "Email/Phone", type: "text" },
        password: { label: "Password", type: "password" },
        authProvider: { label: "Type (email|phone)", type: "text" },
        operationType: { label: "Operation Type", type: "text" }, // "signUp" | "login"
      },
      async authorize(credentials) {
        // কোন API end‑point কল হবে?
        const route =
          credentials?.operationType === "signUp"
            ? "user/signUpByCredentials"
            : "user/logInByCredentials";

        const { res, data } = await req(route, "POST", {
          ...credentials,
          slug: "user",
          //@ts-ignore
          [credentials.authProvider]: credentials?.identifier,
        });

        if (!res.ok) {
          throw new Error(data?.message);
        }

        const { user, refreshToken } = data;
        return {
          id: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
          phone: user.phone,
          role: user.role,
          provider: user.authProvider, // "email" | "phone"
          dbUser: user, // ↙️ jwt কলব্যাকে কাজে লাগবে
          refreshToken,
        };
      },
    }),
  ],
  /* -------------------------------------------------
   next‑auth callbacks — cleaned‑up, one‑time cookie
--------------------------------------------------*/

  callbacks: {
    /* 1️⃣  signIn — only Google needs an upsert */
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const { res, data } = await req("user/googleUpsertUser", "POST", {
          name: user.name,
          email: user.email,
          image: user.image,
          authProvider: "google",
        });

        if (!res.ok) return false;
        (user as any).dbUser = data.user; // forward to jwt
        (user as any).refreshToken = data.refreshToken;
      }
      return true;
    },

    /* 2️⃣  jwt — first pass maps DB → token  +  sets refresh‑cookie once  */
    async jwt({ token, user }) {
      /* first call (after authorize / signIn) → user is defined */
      if (user) {
        const u: any = (user as any).dbUser || user;

        token.id = u._id;
        token.name = u.name;
        token.email = u.email;
        token.image = u.image;
        token.phone = u.phone;
        token.role = u.role ?? "user";
        token.provider = u.authProvider ?? token.provider;

        /*  refreshToken present only on credentials‑flow sign‑in  */
        const rt = (user as any).refreshToken;
        if (rt) {
          (await cookies()).set("refreshToken", rt, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 10, // 10 days
          });
        }
      }
      /* subsequent jwt calls just return the already‑filled token */
      return token;
    },

    /* 3️⃣  session — send selected token fields to the client */
    async session({ session, token }) {
      session.user = {
        _id: token.id!,
        name: token.name!,
        email: token.email!,
        image: token.image,
        phone: token.phone,
        role: token.role as string,
      } as any;

      session.provider = token.provider;
      return session;
    },
  },

  secret: process.env.NEXT_AUTH_SECRET,
};
