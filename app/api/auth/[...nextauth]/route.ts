// @/app/api/auth/[...nextauth].ts
import { authOptions } from "@/app/api/auth/authOptions";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions);

// Export GET and POST methods
export { handler as GET, handler as POST };
