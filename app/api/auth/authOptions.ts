import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { req } from "@/app/shared/request";

/* ────────────────────────────────────────────────────────────────────────────
 * 🔄  Type Augmentation
 * ──────────────────────────────────────────────────────────────────────────*/
declare module "next-auth" {
  interface User {
    dbUser?: {
      _id: string;
      name: string;
      email?: string;
      image?: string;
      phone?: string;
      role?: string;
      slug?: string;
      authProvider?: string;
    };
    slug?: string;
    refreshToken?: string;
  }

  interface Session {
    provider?: string;
    refreshToken?: string;
    user: IUser & { slug?: string };
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
    slug?: string;
    provider?: string;
    refreshToken?: string;
  }
}

/* ────────────────────────────────────────────────────────────────────────────
 * ⚙️  Next‑Auth Options
 * ──────────────────────────────────────────────────────────────────────────*/
export const authOptions: NextAuthOptions = {
  /* ────────────── Providers ────────────── */
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "Name", type: "text" },
        identifier: { label: "Email/Phone/Slug", type: "text" },
        password: { label: "Password", type: "password" },
        authProvider: { label: "Type", type: "text" }, // "email" | "phone" | "slug"
        operationType: { label: "Operation", type: "text" }, // "signUp" | "logIn"
      },
      async authorize(credentials) {
        const route =
          credentials?.operationType === "signUp"
            ? "user/signUpByCredentials"
            : "user/logInByCredentials";

        const payload: Record<string, any> = {
          ...credentials,
          // identifier value mapped to the dynamic provider key (email/phone/slug)
          //@ts-ignore
          [credentials.authProvider]: credentials?.identifier,
        };

        const { res, data } = await req(route, "POST", payload);

        if (!res.ok) throw new Error(data?.message);

        const { user, refreshToken } = data;
        return {
          id: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
          phone: user.phone,
          role: user.role,
          slug: user.slug,
          provider: user.authProvider,
          dbUser: user,
          refreshToken,
        };
      },
    }),
  ],

  /* ────────────── Callbacks ────────────── */
  callbacks: {
    /** 1️⃣ Google sign‑in needs an upsert */
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        function getEmailUsername(email: string): string | null {
          if (!email || typeof email !== "string") return null;
          const [username] = email.split("@");
          return username || null;
        }

        const { res, data } = await req("user/googleUpsertUser", "POST", {
          name: user.name,
          email: user.email,
          image: user.image,
          authProvider: "google",
          slug: getEmailUsername(user.email as string),
        });

        if (!res.ok) return false;

        (user as any).dbUser = data.user;
        (user as any).refreshToken = data.refreshToken;
      }
      return true;
    },

    /** 2️⃣ jwt — map DB → token, persist refreshToken & slug */
    async jwt({ token, user }) {
      if (user) {
        const u: any = (user as any).dbUser || user;

        token.id = u._id;
        token.name = u.name;
        token.email = u.email;
        token.image = u.image;
        token.phone = u.phone;
        token.role = u.role ?? "user";
        token.slug = u.slug ?? token.slug;
        token.provider = u.authProvider ?? token.provider;
        token.refreshToken =
          (user as any).refreshToken ?? token.refreshToken ?? undefined;
      }
      return token;
    },

    /** 3️⃣ session — expose selected token fields to the client */
    async session({ session, token }) {
      session.user = {
        _id: token.id!,
        name: token.name!,
        email: token.email!,
        image: token.image,
        phone: token.phone,
        role: token.role as string,
        slug: token.slug,
      } as any;

      session.provider = token.provider;
      session.refreshToken = token.refreshToken;
      return session;
    },
  },

  /* ────────────── Misc ────────────── */
  secret: process.env.NEXT_AUTH_SECRET,
};
