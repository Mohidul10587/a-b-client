"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useData } from "@/app/DataContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { sessionStatus, user } = useData();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.replace(`/auth?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [sessionStatus, router, pathname]);

  if (sessionStatus === "loading") {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        Loading...
      </div>
    );
  }

  if (sessionStatus === "unauthenticated") {
    return null;
  }
  if (sessionStatus === "authenticated") {
    return children;
  }
}
