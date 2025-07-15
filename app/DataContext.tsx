"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import useSWR, { KeyedMutator } from "swr";
import { useSession } from "next-auth/react";
import { ISettings } from "@/types/settings";
import { getTotalCartCount } from "@/components/AddToCart";
import { fetcher } from "./shared/fetcher";
import { defaultUser } from "./shared/defaultUser";
import Modal from "@/components/Modal";
import { useMergeLocalProducts } from "./hooks/useMergeLocalProducts";
import { req } from "./shared/request";
type infoType = "success" | "error" | "info";
interface DataContextProps {
  user: IUser;
  userMutate: KeyedMutator<any>;
  sessionStatus: "authenticated" | "unauthenticated" | "loading";
  settings: ISettings;
  isLoading: boolean;
  numberOfCartProduct: number;
  setNumberOfCartProducts: React.Dispatch<React.SetStateAction<number>>;
  thisProductQuantity: number;
  setThisProductQuantity: React.Dispatch<React.SetStateAction<number>>;
  showModal: (content: string, type?: "success" | "error" | "info") => void;
  closeModal: () => void;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const DataProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [numberOfCartProduct, setNumberOfCartProducts] = useState<number>(0);
  const [thisProductQuantity, setThisProductQuantity] = useState<number>(0);
  const { data, status } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalType, setModalType] = useState<infoType>("success");
  const total = useMergeLocalProducts();

  useEffect(() => {
    if (total !== null) {
      setNumberOfCartProducts(total);
    } else {
      setNumberOfCartProducts(getTotalCartCount());
    }
  }, [total]);
  const {
    data: response,
    mutate: userMutate,
    isLoading,
  } = useSWR(`settings`, fetcher);
  const settings = response?.item;
  
  const userId = data?.user?._id;
  const refreshToken = data?.refreshToken;
  useEffect(() => {
    if (!userId || !refreshToken) return; // wait until both exist

    (async () => {
      await req(`user/setCookie`, "POST", {
        refreshToken,
      });
    })();
  }, [userId, refreshToken]);
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
        user: data?.user as IUser,
        userMutate,
        sessionStatus: status,
        settings,
        isLoading,
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
