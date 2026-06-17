import { io } from "socket.io-client";
import BASE_URL from "./api.js";

let socket = null;

const connectSocket = () => {
  if (socket?.connected) return;

  socket = io(BASE_URL, {
    withCredentials: true, 
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.log("Socket connection error:", err.message);
  });
};

const disConnectSocket = () => {
  if (socket) {
    console.log("Socket disconnected:", socket.id);
    socket.disconnect();
    socket = null;
  }
};

const getSocket = () => socket;

export { getSocket, connectSocket, disConnectSocket };