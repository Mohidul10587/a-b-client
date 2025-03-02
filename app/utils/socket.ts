import { io, Socket } from "socket.io-client";
import { apiUrl } from "../shared/urls";

let socket: Socket | null = null;

// Initialize Socket.IO client
export const getSocket = (): Socket => {
  if (!socket) {
    socket = io("https://add-to-cart-server-0ktr.onrender.com", {
      transports: ["websocket", "polling"],
      withCredentials: true,
      autoConnect: false,
      reconnectionAttempts: 5, // Limit retries
      timeout: 20000, // Set connection timeout
    });
  }
  return socket;
};
