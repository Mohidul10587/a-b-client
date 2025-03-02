"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Session } from "next-auth";
import { apiUrl } from "./shared/urls";
import useSWR from "swr";
import { fetcher } from "./shared/fetcher";

interface User {
  oneClickPayStartedAt: any;
  _id: string;
  slug: string;
  name: string;
  email: string;
  image: string;
  isSeller: boolean;
  isUser: boolean;
  createdAt: string;
  sellerId: any;
  coins: number;
  coinsTakingDate: string;
  isOneClickPayOffer: boolean;
}

interface DataContextProps {
  user: User;
  session: Session | null;
  sessionStatus: "authenticated" | "unauthenticated" | "loading";

  numberOfCartProduct: number;
  setNumberOfCartProducts: React.Dispatch<React.SetStateAction<number>>;
  thisProductQuantity: number;
  setThisProductQuantity: React.Dispatch<React.SetStateAction<number>>;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const DataProvider = ({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) => {
  const [numberOfCartProduct, setNumberOfCartProducts] = useState<number>(0);
  const [thisProductQuantity, setThisProductQuantity] = useState<number>(0);
  const [user, setUser] = useState<User>({
    _id: "",
    slug: "",
    email: "",
    name: "",
    image: "",
    isSeller: false,
    isUser: true,
    createdAt: "",
    sellerId: {},
    coins: 0,
    coinsTakingDate: "",
    isOneClickPayOffer: false,
    oneClickPayStartedAt: "",
  });
  const [sessionStatus, setSessionStatus] = useState<
    "authenticated" | "unauthenticated" | "loading"
  >("loading");
  useEffect(() => {
    if (session) {
      setSessionStatus("authenticated");
      const storeUserDataInDatabase = async (userData: {
        name: string;
        email: string;
        image?: string;
      }) => {
        try {
          const response = await fetch(`${apiUrl}/user/create`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          });
          const data = await response.json();
          console.log("This is data", data);
          if (!response.ok) {
            throw new Error("Failed to store user data in the database.");
          }
          if (response.ok) {
            localStorage.setItem("myId", data.user._id);
            setUser(data.user);
            if (localStorage.getItem("isCartSaved") !== "cart saved") {
              const cartData = localStorage.getItem("cartData");

              if (!cartData) return;

              try {
                const response = await fetch(`${apiUrl}/cart/create`, {
                  method: "POST",
                  credentials: "include",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    userId: data.user._id,
                    cartItems: JSON.parse(cartData),
                  }),
                });

                if (response.ok) {
                  const result = await response.json();
                  localStorage.setItem("isCartSaved", "cart saved");
                  localStorage.removeItem("cartData");
                  const total = result.cart.cartItems.reduce(
                    (total: number, item: any) => total + item.quantity,
                    0
                  );
                  setNumberOfCartProducts(total);
                }
              } catch (error) {
                console.error("Error saving cart:", error);
              }
            }
          }
        } catch (error) {
          console.error("Error storing user data:", error);
        }
      };
      const userData = {
        name: session?.user?.name || "Unknown User",
        email: session?.user?.email || "",
        image: session?.user?.image || "",
      };

      storeUserDataInDatabase(userData);
    } else {
      setSessionStatus("unauthenticated");
    }
  }, [session]);

  return (
    <DataContext.Provider
      value={{
        user,
        session,
        sessionStatus,

        numberOfCartProduct,
        setNumberOfCartProducts,
        thisProductQuantity,
        setThisProductQuantity,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
// change
