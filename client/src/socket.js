import { io } from "socket.io-client";
export const socket = io(import.meta.env.VITE_SOCKET_URL);
// socket.on("connect", () => {
//     console.log("Connected to Socket.IO server:", socket.id);
// });
// socket.on("connect_error", (error) => {
//     console.error("Socket.IO connection error:", error);
// });
// export default socket;