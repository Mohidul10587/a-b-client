"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Session } from "next-auth";

import useSWR from "swr";
import { fetcher } from "./shared/fetcher";
import { ISettings } from "@/types/settings";
import { useSession } from "next-auth/react";
import Modal from "@/components/Modal";

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
  sessionStatus: "authenticated" | "unauthenticated" | "loading";
  settings: ISettings;
  numberOfCartProduct: number;
  setNumberOfCartProducts: React.Dispatch<React.SetStateAction<number>>;
  thisProductQuantity: number;
  setThisProductQuantity: React.Dispatch<React.SetStateAction<number>>;
  showModal: (content: string, type?: "success" | "error" | "info") => void;
  closeModal: () => void;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
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
  const { data, status } = useSession();
  useEffect(() => {
    if (data?.user) {
      const storeUserDataInDatabase = async (userData: {
        name: string;
        email: string;
        image?: string;
      }) => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/user/create`,
            {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(userData),
            }
          );
          if (!response.ok) {
            throw new Error("Failed to store user data in the database.");
          }

          if (response.ok) {
            const data = await response.json();
            localStorage.setItem("myId", data.user._id);
            setUser(data.user);
            const cartData = localStorage.getItem("cartData");
            if (!cartData) {
              return;
            }
            try {
              const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/cart/create`,
                {
                  method: "POST",
                  credentials: "include",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    userId: data.user._id,
                    cartItems: JSON.parse(cartData),
                  }),
                }
              );

              if (response.ok) {
                const result = await response.json();
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
        } catch (error) {}
      };
      const userData = {
        name: data.user?.name || "Unknown User",
        email: data.user?.email || "",
        image: data.user?.image || "",
      };

      storeUserDataInDatabase(userData);
    }
  }, [data?.user]);

  const { data: response } = useSWR(`settings`, fetcher);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalType, setModalType] = useState<"success" | "error" | "info">(
    "success"
  );

  const settings = response?.respondedData;
  const showModal = (
    content: string,
    type: "success" | "error" | "info" = "success"
  ) => {
    setModalContent(content);
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);
  return (
    <DataContext.Provider
      value={{
        user,
        sessionStatus: status,
        settings,
        numberOfCartProduct,
        setNumberOfCartProducts,
        thisProductQuantity,
        setThisProductQuantity,
        showModal,
        closeModal,
      }}
    >
      {children}
      <Modal
        isOpen={isModalOpen}
        content={modalContent}
        type={modalType}
        onClose={closeModal}
      />
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
