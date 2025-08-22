import { Server } from "socket.io";

let io: Server | null = null;

export const getIO = (res?: any) => {
  if (io) return io;

  if (res) {
    io = new Server(res.socket.server, {
      cors: { origin: "*" },
    });
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("🟢 Cliente conectado:", socket.id);
    });

    return io;
  }

  throw new Error("Socket.IO no inicializado");
};
