import { io } from "socket.io-client";

// One shared socket instance for the whole app.
// autoConnect is false so we connect only once the user is authenticated.
export const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
  autoConnect: false,
});
