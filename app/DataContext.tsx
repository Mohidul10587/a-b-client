"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { fetcher } from "./shared/fetcher";

const DataContext = createContext<DataContextProps | undefined>(undefined);
export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: response } = useSWR(`settings`, fetcher);
  const settings = response?.respondedData;
  const { data: session, status: sessionStatus } = useSession();
  const [numberOfCartProduct, setNumberOfCartProducts] = useState<number>(0);
  const [thisProductQuantity, setThisProductQuantity] = useState<number>(0);
  const [user, setUser] = useState<User>({
    _id: "",
    name: "",
    slug: "",
    email: "",
    image: "",
    phone: "",
    password: "",
    isSeller: false,
    isUser: false,
    oneClickPayStartedAt: "",
    coins: 0,
    coinsTakingDate: "",
    toDaysCoins: 0,
    companyName: "",
    companyEmail: "",
    country: "",
    city: "",
    postalCode: "",
    companyPhone: "",
    street: "",
    address: "",
    facebook: "",
    twitter: "",
    gmail: "",
    whatsapp: "",
    skype: "",
    linkedin: "",
    monday_openingHours: "",
    tuesday_openingHours: "",
    wednesday_openingHours: "",
    thursday_openingHours: "",
    friday_openingHours: "",
    saturday_openingHours: "",
    sunday_openingHours: "",
    photo: "",
    coverPhoto: "",
    contactInfo: "",
    createdAt: "",
  });

  const {
    data: responseUser,
    error: errorUser,
    mutate: muteUser,
    isLoading: isLoadingUser,
  } = useSWR(
    session ? `user/getAuthenticatedUser?id=${session.user?.id}` : null,
    fetcher
  );

  useEffect(() => {
    if (responseUser) {
      const user = responseUser.respondedData;
      setUser(user);
      localStorage.setItem("myId", user?._id);
      const storeUserDataInDatabase = async () => {
        try {
          const cartData = localStorage.getItem("cartData");
          if (!cartData) {
            setNumberOfCartProducts(responseUser.respondedCartData);
            return;
          }
          try {
            const cartResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/cart/create`,
              {
                method: "POST",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  userId: user._id,
                  cartItems: JSON.parse(cartData),
                }),
              }
            );

            if (cartResponse.ok) {
              const result = await cartResponse.json();
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
        } catch (error) {
          console.error("Error storing user data:", error);
        }
      };
      storeUserDataInDatabase();
    }
  }, [responseUser]);

  return (
    <DataContext.Provider
      value={{
        user,
        muteUser,
        session,
        sessionStatus,
        settings,
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
    throw new Error("Use data must be used within a data provider");
  }
  return context;
};
