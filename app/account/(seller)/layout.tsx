"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useData } from "../../DataContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useData();
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (user?._id) {
      if (user.role == "seller") {
        setIsLoaded(true);
      } else {
        router.replace(`/account`);
      }
    }
  }, [user, router]);

  if (!isLoaded) {
    return <main>Loading...</main>;
  }

  return <main>{children}</main>;
}
