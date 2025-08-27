import { io } from "socket.io-client";
export const socket = io("https://metaverse-3joe.onrender.com", {
  withCredentials: true,
  transports: ["websocket"],
});