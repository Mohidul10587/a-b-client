"use client";
import { getSocket } from "@/app/utils/socket";
import Image from "next/image";
import { useParams } from "next/navigation";
import { FC, useEffect, useRef, useState } from "react";
import { useChatContext } from "../ChatContext";
import { useSettings } from "@/app/context/AppContext";
import { ISettings } from "@/types/settings";
import { useData } from "@/app/DataContext";
import React from "react";
import UserDetailsModal from "../UserDetailsModal";

const ClientPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const params = useParams();
  const ids = params?.id as string[];
  const receiverId = ids[0] as string;
  const productSlug = ids[1] as string;
  const [product, setProduct] = useState<any>();
  const [presentReceiver, setPresentReceiver] = useState<any>(null);

  const [messageContent, setMessageContent] = useState(""); // State for message input
  const [messages, setMessages] = useState<any[]>([]); // Chat messages
  const messagesEndRef = useRef<HTMLDivElement | null>(null); // Ref for the bottom of the messages container
  const [id, setId] = useState<string | null>(null);
  const senderId = id; // Sender's ID
  const { setChatUsers, isRightDivOpen, setIsRightOpen } = useChatContext();
  const closeModal = () => {
    setIsModalOpen(false);
  };
  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  const { user } = useData();
  // Fetch the user's ID and handle socket connections
  useEffect(() => {
    const userId = user._id;
    setId(userId);

    const socket = getSocket();
    socket.connect();

    if (userId) {
      // Notify server of online status
      socket.emit("userOnline", userId);

      // Handle chat history for selected user
      if (receiverId && senderId) {
        const roomId = [receiverId, senderId].sort().join("_");
        socket.emit("joinRoom", [roomId, receiverId, productSlug]);

        socket.on("chatHistory", ({ messages, receiver, product }) => {
          setMessages(messages);
          setPresentReceiver(receiver);
          if (product !== null) {
            setProduct(product);
            setMessageContent("I want to talk with you about this product");
          }
        });
      }
      socket.on("chatUsers", (users) => {
        setChatUsers(users);
      });

      // Handle any errors from the socket
      socket.on("error", (errorMessage) => {
        console.error("Socket error:", errorMessage);
      });
    }

    // Clean up socket listeners on unmount
    return () => {
      socket.off("chatUsers");
      socket.off("chatHistory");
      socket.off("error");
    };
  }, [productSlug, receiverId, senderId, setChatUsers, user._id]); // Re-run when selectedUser or senderId changes

  // Send message to the server
  const sendMessage = () => {
    if (!receiverId || !messageContent.trim()) {
      alert("Please select a user and enter a message.");
      return;
    }

    const socket = getSocket();
    const messageData = {
      senderId: senderId,
      receiverId: receiverId,
      content: messageContent.trim(),
      product: product?._id,
    };

    // Emit the message to the server
    socket.emit("sendMessage", messageData);
    setProduct(null);
    setMessageContent(""); // Clear input field
    socket.on("chatHistory", ({ messages, receiver }) => {
      setMessages(messages);
      setMessageContent("");
    });
  };

  // Listen for updated chat history from the server
  const settings = useSettings() as ISettings;
  return (
    <>
      <div className="flex flex-col justify-between h-full">
        <div className="flex justify-between">
          <div className="flex items-center justify-between w-full p-2">
            <div className="flex items-center">
              <div className="mr-1 relative">
                <Image
                  src={
                    presentReceiver?.sellerInfo?.photo ||
                    presentReceiver?.image ||
                    "/default.jpg"
                  }
                  width={100}
                  height={100}
                  alt=""
                  className="rounded-full w-10 h-10 overflow-hidden border border-main object-cover"
                />
                {presentReceiver?.isOnline && (
                  <div className="absolute right-0 bottom-0">
                    <span className="relative flex size-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex size-2 rounded-full bg-green-500"></span>
                    </span>
                  </div>
                )}
              </div>
              <h1 className="font-bold">
                {presentReceiver?.sellerInfo?.companyName ??
                  presentReceiver?.name}
              </h1>
            </div>
            <button
              className="md:hidden mr-6"
              onClick={() => {
                setIsModalOpen(!isModalOpen);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M11.95 18q.525 0 .888-.363t.362-.887t-.362-.888t-.888-.362t-.887.363t-.363.887t.363.888t.887.362m.05 4q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m.1-12.3q.625 0 1.088.4t.462 1q0 .55-.337.975t-.763.8q-.575.5-1.012 1.1t-.438 1.35q0 .35.263.588t.612.237q.375 0 .638-.25t.337-.625q.1-.525.45-.937t.75-.788q.575-.55.988-1.2t.412-1.45q0-1.275-1.037-2.087T12.1 6q-.95 0-1.812.4T8.975 7.625q-.175.3-.112.638t.337.512q.35.2.725.125t.625-.425q.275-.375.688-.575t.862-.2"
                />
              </svg>
            </button>
            <button
              className="hidden md:block"
              onClick={() => {
                setIsRightOpen(!isRightDivOpen);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M11.95 18q.525 0 .888-.363t.362-.887t-.362-.888t-.888-.362t-.887.363t-.363.887t.363.888t.887.362m.05 4q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m.1-12.3q.625 0 1.088.4t.462 1q0 .55-.337.975t-.763.8q-.575.5-1.012 1.1t-.438 1.35q0 .35.263.588t.612.237q.375 0 .638-.25t.337-.625q.1-.525.45-.937t.75-.788q.575-.55.988-1.2t.412-1.45q0-1.275-1.037-2.087T12.1 6q-.95 0-1.812.4T8.975 7.625q-.175.3-.112.638t.337.512q.35.2.725.125t.625-.425q.275-.375.688-.575t.862-.2"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className={`md:h-80 h-full overflow-y-auto p-2 bg-gray-100`}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`my-3 p-2 max-w-sm  ${
                message.senderId === senderId
                  ? "bg-main-50 text-right ml-auto"
                  : "border bg-white text-left mr-auto"
              }`}
            >
              {message.product && (
                <div className="flex items-center">
                  <div className="w-1/5">
                    <Image
                      src={message.product.photo}
                      alt={message.product.title}
                      width={50}
                      height={100}
                      className="w-min h-full object-cover"
                    />
                  </div>
                  <div className="w-4/5">
                    <p className="line-clamp-2 text-sm font-medium">
                      {message.product.title}
                    </p>
                    <p>
                      {settings.currencySymbol}:{" "}
                      {new Intl.NumberFormat().format(message.product.price)}
                    </p>
                  </div>
                </div>
              )}
              <div className="text-sm text-left table w-full">
                <div dangerouslySetInnerHTML={{ __html: message.content }} />
              </div>
            </div>
          ))}
          {/* This div ensures the scroll always goes to the bottom */}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div>
          <div className="flex flex-col gap-2 border p-2">
            {product && (
              <div>
                <p
                  onClick={() => {
                    setProduct(null);
                    setMessageContent("");
                  }}
                >
                  X
                </p>
                <Image
                  src={product.photo || "/placeholder.jpg"}
                  alt={product.title || "Preview"}
                  width={50}
                  height={100}
                  className="rounded-md"
                />
                <p className="font-extrabold">{product.title}</p>
                <p>
                  {settings.currencySymbol}: {product.price}
                </p>
              </div>
            )}
            <textarea
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              placeholder="Type a message"
              rows={3}
              className="w-full outline-0 p-2"
            />
          </div>
          <button
            onClick={() => {
              sendMessage();
            }}
            className="w-full bg-main text-white py-2"
          >
            Send Message
          </button>
        </div>
      </div>
      {isModalOpen && (
        <UserDetailsModal
          isOpen={isModalOpen}
          onClose={closeModal}
          presentReceiver={presentReceiver}
        ></UserDetailsModal>
      )}
    </>
  );
};

export default ClientPage;
