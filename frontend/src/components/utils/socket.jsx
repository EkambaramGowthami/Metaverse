import { io } from "socket.io-client";
const BackendUrl = import.meta.env.VITE_BACKEND_URL;
export const socket = io(`${BackendUrl}`, {
  withCredentials: true,
  transports: ["websocket"],
});