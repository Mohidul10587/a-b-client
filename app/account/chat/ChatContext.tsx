"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { getSocket } from "@/app/utils/socket";
import { useData } from "@/app/DataContext";
interface User {
  _id: string;
  name: string;
}

interface UserContextType {
  users: User[];
  setChatUsers: any;
  isRightDivOpen: boolean;
  setIsRightOpen: any;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [users, setChatUsers] = useState<any[]>([]);

  const pathname = usePathname();
  const sellerId = extractChatId(pathname);
  const { user } = useData();

  const [isRightDivOpen, setIsRightOpen] = useState(false);
  useEffect(() => {
    const userId = user?._id;
    // const userId = localStorage.getItem("myId");
    const socket = getSocket();
    socket.connect();

    if (userId) {
      socket.emit("userOnline", userId);
      socket.emit("fetchChatUsers", [userId, sellerId]);

      socket.on("chatUsers", (users) => {
        setChatUsers(users);
      });

      socket.on("error", (errorMessage) => {
        console.error("Socket error:", errorMessage);
      });
    }

    return () => {
      socket.off("chatUsers");
      socket.off("error");
    };
  }, [sellerId]);

  return (
    <UserContext.Provider
      value={{ users, setChatUsers, isRightDivOpen, setIsRightOpen }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};

function extractChatId(url: string): string | null {
  const regex = /\/chat\/([a-f0-9]{24})/; // Matches the ID pattern
  const match = url.match(regex);
  return match ? match[1] : null; // Returns the ID if found, otherwise null
}
