import { io } from "socket.io-client";
const BackendUrl = import.meta.env.VITE_BACKEND_URL;
export const socket = io("https://metaverse-3joe.onrender.com", {
  withCredentials: true,
  transports: ["websocket"],
});