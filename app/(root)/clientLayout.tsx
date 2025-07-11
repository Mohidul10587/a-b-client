"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingComponent from "@/components/loading";
import useSWR from "swr";
import { useData } from "../DataContext";
import { fetcher } from "../shared/fetcher";

const ClientLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, sessionStatus, setNumberOfCartProducts } = useData();
  const router = useRouter();

  const { data, error, isLoading } = useSWR(
    user?.slug ? `user/sellerStatus/${user.slug}` : null,
    fetcher,
    {
      revalidateOnFocus: true,
    }
  );
  const { data: cartResponse, error: cartError } = useSWR(
    user?._id ? `cart/getUserCart/${user._id}` : null,
    fetcher
  );

  const getTotalCartCount = (): number => {
    if (typeof window !== "undefined") {
      const existingCart = localStorage.getItem("cartData");
      const cart: any[] = existingCart ? JSON.parse(existingCart) : [];
      return cart.reduce((total, item) => total + item.quantity, 0);
    }

    return 0;
  };
  useEffect(() => {
    if (user._id && sessionStatus === "authenticated") {
      if (cartResponse) {
        const total = cartResponse?.respondedData?.reduce(
          (total: number, item: any) => total + item.quantity,
          0
        );

        setNumberOfCartProducts(total);
      }
    } else {
      setNumberOfCartProducts(getTotalCartCount());
    }
  }, [cartResponse, sessionStatus, setNumberOfCartProducts, user._id]);

  useEffect(() => {
    if (data && data.success && !data.user.isUser) {
      router.push("/not-permitted");
    }
  }, [router, data]);

  // Loading state
  if (sessionStatus === "loading" || isLoading) {
    return <LoadingComponent />;
  }

  // Check if the user is authenticated and permitted
  if (data?.user.isUser || sessionStatus === "unauthenticated") {
    return <div className="flex flex-col">{children}</div>;
  }
  // return <div className="flex flex-col">{children}</div>;
  // Default fallback
  return null;
};

export default ClientLayout;
