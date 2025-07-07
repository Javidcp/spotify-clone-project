import { io } from "socket.io-client";
export const socket = io("http://localhost:5050");
// socket.on("connect", () => {
//     console.log("Connected to Socket.IO server:", socket.id);
// });
// socket.on("connect_error", (error) => {
//     console.error("Socket.IO connection error:", error);
// });
// export default socket;