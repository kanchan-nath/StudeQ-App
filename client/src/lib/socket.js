import { io } from "socket.io-client";

let socket = null;

const connectSocket = () => {
  const token = localStorage.getItem("token");

  if (!token) return;
  if (socket?.connnected) return;

  socket = io("http://localhost:4000", {
    auth: {
      token,
    },
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.log("Socket disconnected", err.message);
  });
};

const disConnectSocket = () => {
  if (socket) {
    console.log("Socket disconnected", socket.id);
    socket.disconnect();
    socket = null;
  }
};

const getSocket = () => socket;

export { getSocket, connectSocket, disConnectSocket };
