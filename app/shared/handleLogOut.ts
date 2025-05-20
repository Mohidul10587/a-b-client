import { signOut } from "next-auth/react";
import { apiUrl } from "./urls";
export async function handleLogOut(route: string) {
  try {
    const res = await fetch(`${apiUrl}/user/logout`, {
      credentials: "include",
      method: "POST",
    });
  } catch (error) {
    console.error("Failed to log out:", error);
  }
  // Redirect to the sign-out callback URL
  signOut({ callbackUrl: `${route}` });
}
