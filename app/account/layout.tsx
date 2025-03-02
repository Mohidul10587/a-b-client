"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import LayoutTop from "./LayoutTop";
import { ChatProvider } from "./chat/ChatContext";
import { useData } from "../DataContext";
import Header from "@/components/header/Header";
import FooterPage from "@/components/Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { sessionStatus, user } = useData();
  const router = useRouter();
  const pathname = usePathname();
  console.log(user);
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
    return (
      <main>
        <ChatProvider>
          <Header />
          <LayoutTop user={user} />
          {children}
          <FooterPage />
        </ChatProvider>
      </main>
    );
  }
}
