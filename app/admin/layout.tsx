"use client";
import AdminHeader from "@/app/admin/components/AdminHeader";
import AdminFooter from "@/app/admin/components/AdminFooter";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useData } from "../DataContext";

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, sessionStatus } = useData();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionStatus === "loading") return;

    if (sessionStatus === "unauthenticated" || user?.role !== "admin") {
      router.push("/auth");
    } else {
      setLoading(false);
    }
  }, [sessionStatus, user, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Authenticating...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader />
      <main className="flex-grow">{children}</main>
      <AdminFooter />
    </div>
  );
};

export default RootLayout;
