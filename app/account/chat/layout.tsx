"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { getSocket } from "@/app/utils/socket";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useChatContext } from "./ChatContext";
import ChatBoxModal from "./ChatBoxModal";

// Define the props for the Layout component
interface LayoutProps {
  children: React.ReactElement;
}
export default function Layout({ children }: LayoutProps) {
  const [id, setId] = useState<string | null>(null);
  const senderId = id;
  const [searchText, setSearchText] = useState("");
  const pathname = usePathname();
  const [presentUser, setPresentUser] = useState<any>();
  const sellerId = extractChatId(pathname);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>(sellerId || "");
  const { users, setChatUsers, isRightDivOpen } = useChatContext();

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const userId = localStorage.getItem("myId");
    setId(userId);
    const socket = getSocket();
    socket.connect();

    if (userId) {
      socket.emit("userOnline", userId);
      socket.emit("fetchChatUsers", [userId, selectedUser]);

      socket.on("chatUsers", (users) => {
        setChatUsers(users);

        setPresentUser(users.find((u: any) => u._id == selectedUser));
      });

      socket.on("error", (errorMessage) => {
        console.error("Socket error:", errorMessage);
      });
    }

    return () => {
      socket.off("chatUsers");
      socket.off("error");
    };
  }, [selectedUser, sellerId, senderId, setChatUsers]);
  
  const filteredUsers = users?.filter((user: any) => {
    const name = user.sellerInfo?.companyName || user.name || "";
    return name.toLowerCase().includes(searchText.toLowerCase());
  });
  return (
    <main className="container">
      <div className="flex flex-col md:flex-row w-full bg-white rounded overflow-hidden">
        <div className="w-full md:w-1/4">
          <div className="border-b flex items-center gap-2 p-2 sticky top-0">
            <h2 className="text-sm font-semibold">Users</h2>
            <input
              type="text"
              className="p-2 h-6 w-full outline-0 border rounded"
              placeholder="Search users..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <div className="overflow-y-auto">
            {filteredUsers?.map((user: any) => (
              <div key={user._id}>
                <div className="md:hidden">
                  <Link
                    href={`/account/chat/${user._id}`}
                    onClick={() => setIsModalOpen(true)}
                  >
                    <div
                      onClick={() => {
                        setSelectedUser(user._id);
                        setPresentUser(user);
                      }}
                      className={`p-2 text-base cursor-pointer ${
                        selectedUser === user._id
                          ? "bg-main-50 text-gray-700 font-medium"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="mr-2 relative">
                            <Image
                              src={
                                user?.sellerInfo?.photo ||
                                user.image ||
                                "/default.jpg"
                              }
                              alt={user.name || ""}
                              width={100}
                              height={100}
                              className="rounded-full w-10 h-10 overflow-hidden border border-main object-cover"
                            />
                            {user.isOnline && (
                              <div className="absolute right-0 bottom-0">
                                <span className="relative flex size-2">
                                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                                  <span className="relative inline-flex size-2 rounded-full bg-green-500"></span>
                                </span>
                              </div>
                            )}
                          </div>
                          <h2>{user.sellerInfo?.companyName || user.name}</h2>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>

                <div className="hidden md:block">
                  <Link href={`/account/chat/${user._id}`}>
                    <div
                      onClick={() => {
                        setSelectedUser(user._id);
                        setPresentUser(user);
                      }}
                      className={`p-2 text-base cursor-pointer ${
                        selectedUser === user._id
                          ? "bg-main-50 text-gray-700 font-medium"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="mr-2 relative">
                            <Image
                              src={
                                user?.sellerInfo?.photo ||
                                user.image ||
                                "/default.jpg"
                              }
                              alt={user.name || ""}
                              width={40}
                              height={40}
                              className="rounded-full w-10 h-10 border border-main object-cover"
                            />
                            {user.isOnline && (
                              <div className="absolute right-0 bottom-0">
                                <span className="relative flex size-2">
                                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                                  <span className="relative inline-flex size-2 rounded-full bg-green-500"></span>
                                </span>
                              </div>
                            )}
                          </div>
                          <h2>{user.sellerInfo?.companyName || user.name}</h2>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        {isModalOpen && (
          <ChatBoxModal isOpen={isModalOpen} onClose={closeModal}>
            {children}
          </ChatBoxModal>
        )}
        <div className="w-full md:w-3/4 flex md:flex-row flex-col">
          <div className="w-full hidden md:block">{children}</div>
          <div className={`${isRightDivOpen ? "block" : "hidden"} w-full md:w-80`}>
            <div className="bg-white">
              {presentUser?.isSeller ? (
                <>
                  <div className="block relative h-auto">
                    <Image
                      src={presentUser.sellerInfo?.coverPhoto || "/default.jpg"}
                      alt=""
                      width={400}
                      height={160}
                      className="w-full h-24 object-cover"
                    />
                    <div className="flex items-end p-2 gap-2 -mt-8 z-50">
                      {presentUser?.image ? (
                        <Image
                          src={
                            presentUser.sellerInfo?.photo ||
                            presentUser.image ||
                            "/default.jpg"
                          }
                          alt={`${presentUser.name}'s profile`}
                          width={80}
                          height={80}
                          className="w-12 h-12 bg-white border object-cover"
                        />
                      ) : (
                        <span className="text-gray-500 text-lg font-bold">
                          {presentUser?.name?.charAt(0)}
                        </span>
                      )}
                      <h1 className="font-bold">
                        {presentUser.sellerInfo.companyName || "N/A"}
                      </h1>
                    </div>
                  </div>
                  <div className="p-2 block text-sm">
                    <p>
                      <strong>
                        {presentUser.sellerInfo.email || "example@gmail.com"}
                      </strong>
                    </p>
                    <p>
                      <strong>Country:</strong>
                      {presentUser.sellerInfo.country || "N/A"}
                    </p>
                    <p>
                      <strong>City:</strong>{" "}
                      {presentUser.sellerInfo.city || "N/A"}
                    </p>
                    <p>
                      <strong>Postal Code:</strong>
                      {presentUser.sellerInfo.postalCode || "N/A"}
                    </p>
                    <p>
                      <strong>Street:</strong>{" "}
                      {presentUser.sellerInfo.street || "N/A"}
                    </p>
                    <p>
                      <strong>Address:</strong>
                      {presentUser.sellerInfo.address || "N/A"}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden mb-4">
                    {presentUser?.image ? (
                      <Image
                        src={presentUser.image}
                        alt={`${presentUser.name}'s profile`}
                        width={80}
                        height={80}
                      />
                    ) : (
                      <span className="text-gray-500 text-lg font-bold">
                        {presentUser?.name?.charAt(0)}
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {presentUser?.sellerInfo?.companyName || presentUser?.name}
                  </h2>
                  <p className="text-sm text-gray-500">{presentUser?.email}</p>
                </>
              )}
            </div>
        </div>
        </div>
      </div>
    </main>
  );
}

function extractChatId(url: string): string | null {
  const regex = /\/chat\/([a-f0-9]{24})/; // Matches the ID pattern
  const match = url.match(regex);
  return match ? match[1] : null; // Returns the ID if found, otherwise null
}
