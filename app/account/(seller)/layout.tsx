"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useData } from "../../DataContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useData();
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false); // Track when user data is fully loaded

  useEffect(() => {
    if (user._id) {
      setIsLoaded(true); // Set loaded to true when real user data is available
      if (user.role !== "seller") {
        router.replace(`/account`); // Redirect if not a seller
      }
    }
  }, [user, router]);

  if (!isLoaded) {
    // Show a loading state while user data is being fetched
    return <main>Loading...</main>;
  }

  // Render children only when user.isSeller === true
  return <main>{user.isSeller ? children : null}</main>;
}
