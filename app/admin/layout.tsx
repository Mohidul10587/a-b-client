"use client";
import AdminHeader from "@/app/admin/components/AdminHeader";
import AdminFooter from "@/app/admin/components/AdminFooter";
import { useEffect, useState } from "react";
import { apiUrl } from "../shared/urls";
import { useRouter } from "next/navigation";

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        let response = await fetch(`${apiUrl}/admin/check-admin`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();

        if (data.success === true) {
          setLoading(false);
        } else {
          router.push("/aAuth");
        }
      } catch (error) {
        router.push("/aAuth");
      }
    };

    checkAdminStatus();
  }, [router]);
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
