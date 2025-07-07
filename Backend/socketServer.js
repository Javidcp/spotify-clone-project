const { Server } = require("socket.io");

let io;

module.exports = (server, app) => {
    io = new Server(server, {
        cors: {
        origin: ["http://localhost:5173", "http://localhost:5174"],
        credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("sendNotification", async (data) => {
        console.log("Received notification:", data);

        socket.broadcast.emit("newSongNotification", data);
        });

        socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        });
    });
};

module.exports.getIO = () => io;
