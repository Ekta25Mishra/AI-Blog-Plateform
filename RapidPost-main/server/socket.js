import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: [
                "http://localhost:5173", // local frontend
                "http://localhost:3000", // optional if needed
                "https://rapidpost.live",
                "https://www.rapidpost.live"
            ],
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    console.log("✅ Socket.io initialized");

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};