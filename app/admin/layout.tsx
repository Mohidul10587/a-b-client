"use client";
import AdminHeader from "@/app/admin/components/AdminHeader";
import AdminFooter from "@/app/admin/components/AdminFooter";
import { useEffect, useState } from "react";
import { apiUrl } from "../shared/urls";
import { useRouter } from "next/navigation";

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);

  // Function to refresh the access token
  const refreshAccessToken = async () => {
    try {
      const response = await fetch(`${apiUrl}/admin/refresh-token`, {
        method: "POST",
        credentials: "include", // To include cookies in the request
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("accessToken", data.token); // Update the access token in localStorage
        return data.token;
      } else {
        throw new Error("Failed to refresh access token");
      }
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    const checkAdminStatus = async () => {
      let token = localStorage.getItem("accessToken");

      try {
        if (!token) {
          throw new Error("No access token found");
        }

        let response = await fetch(`${apiUrl}/admin/check-admin`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          // Attempt to refresh the token if it is expired
          token = await refreshAccessToken();

          if (!token) {
            router.push("/adminLogin");
            return;
          }

          // Retry the request with the new token
          response = await fetch(`${apiUrl}/admin/check-admin`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }

        const data = await response.json();
        if (data.success) {
          setAdmin(data.data);
          setLoading(false);
        } else {
          router.push("/adminLogin");
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        localStorage.removeItem("accessToken");
        router.push("/adminLogin");
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
