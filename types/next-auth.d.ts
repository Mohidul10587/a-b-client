import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string; // Include user id
  }

  interface Session {
    user: User; // Ensure the session includes the extended user
  }
}
